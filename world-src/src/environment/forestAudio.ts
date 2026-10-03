import { useCallback,useEffect,useRef,useState } from 'react';
import type { Settings } from './settings';
import type { CharacterController } from '../player/controller';
import { animalZones } from '../world/layout';

// Original synthesized ambience: no downloaded recordings or network audio.
class ForestAudio {
 context=new AudioContext(); master=this.context.createGain(); analyser=this.context.createAnalyser();
 timer=0; tick=0; calls=0; volume=1;
 settings:Settings; player:CharacterController; playing=false; audible=false;
 constructor(settings:Settings,player:CharacterController){
  this.settings=settings;this.player=player;this.master.gain.value=0;
  this.analyser.fftSize=256;this.master.connect(this.analyser);this.analyser.connect(this.context.destination);
  // No continuous noise bed: only soft, intermittent wildlife calls.
  this.timer=window.setInterval(()=>{this.update();if(this.audible&&this.volume>0&&this.context.state==='running'&&!document.hidden){this.tick++;if(this.tick%9===0)this.bird();if(this.tick%23===0)this.frog();}},500);
 }
 update(){const now=this.context.currentTime,active=this.audible&&!document.hidden;
  this.master.gain.cancelAndHoldAtTime(now);
  this.master.gain.linearRampToValueAtTime(active?.35*this.volume:0,now+.35);
 }
 tone(frequency:number,end:number,duration:number,volume:number,pan:number,delay=0,type:OscillatorType='sine'){
  const c=this.context,at=c.currentTime+delay,osc=c.createOscillator(),gain=c.createGain(),stereo=c.createStereoPanner();
  osc.type=type;osc.frequency.setValueAtTime(frequency,at);osc.frequency.exponentialRampToValueAtTime(end,at+duration);
  gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(volume,at+.025);gain.gain.exponentialRampToValueAtTime(.0001,at+duration);
  stereo.pan.value=Math.max(-.8,Math.min(.8,pan));osc.connect(gain);gain.connect(stereo);stereo.connect(this.master);osc.start(at);osc.stop(at+duration+.03);
  osc.onended=()=>{osc.disconnect();gain.disconnect();stereo.disconnect();};
 }
 bird(){this.calls++;const pan=Math.sin(this.tick*1.7)*.65,volume=this.settings.night?.009:.027;
  for(let i=0;i<3;i++)this.tone(1800+i*170,2700-i*220,.16,volume,pan,i*.23);
 }
 frog(){const a=animalZones[11+this.tick%3],p=this.player.position,d=this.playing?Math.hypot(p.x-a.x,p.z-a.z):16;
  this.calls++;for(let i=0;i<2;i++)this.tone(480,350,.13,.025/(1+d*.08),(a.x-p.x)/20,i*.27);
 }
 async start(){await this.context.resume();const first=!this.audible;this.audible=true;this.update();if(first&&this.volume>0)this.bird();}
 level(){const samples=new Float32Array(this.analyser.fftSize);this.analyser.getFloatTimeDomainData(samples);return Math.sqrt(samples.reduce((sum,x)=>sum+x*x,0)/samples.length);}
 close(){clearInterval(this.timer);void this.context.close();}
}

export function useForestAudio(settings:Settings,player:CharacterController,playing:boolean,volume:number){
 const audio=useRef<ForestAudio|null>(null),[enabled,setEnabled]=useState(false),[level,setLevel]=useState(0),[calls,setCalls]=useState(0),[error,setError]=useState(false);
 const current=useRef({settings,playing,volume});current.current={settings,playing,volume};
 const start=useCallback(()=>{try{const a=audio.current??(audio.current=new ForestAudio(current.current.settings,player));a.playing=current.current.playing;a.volume=current.current.volume;void a.start().then(()=>{setEnabled(true);setError(false);}).catch(()=>setError(true));}catch{setError(true);}},[player]);
 useEffect(()=>{const a=audio.current;if(a){a.settings=settings;a.playing=playing;a.volume=volume;a.update();}},[settings,playing,volume]);
 useEffect(()=>{
  // Retry automatically on a trusted interaction when autoplay is restricted.
  const message=(e:MessageEvent)=>{if(e.origin===location.origin&&e.source===window.parent&&e.data?.type==='banori-audio-start')start();};
  window.addEventListener('pointerdown',start,{passive:true});window.addEventListener('keydown',start);window.addEventListener('message',message);start();
  const timer=window.setInterval(()=>{setLevel(audio.current?.level()??0);setCalls(audio.current?.calls??0);},500);
  return()=>{clearInterval(timer);window.removeEventListener('pointerdown',start);window.removeEventListener('keydown',start);window.removeEventListener('message',message);audio.current?.close();audio.current=null;};
 },[start]);
 return{start,enabled,error,level,calls};
}
