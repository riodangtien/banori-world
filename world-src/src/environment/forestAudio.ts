import { useCallback,useEffect,useRef,useState } from 'react';
import type { Settings } from './settings';
import type { CharacterController } from '../player/controller';
import { animalZones } from '../world/layout';

// Original synthesized ambience: no downloaded recordings or network audio.
class ForestAudio {
 context=new AudioContext(); master=this.context.createGain(); analyser=this.context.createAnalyser();
 wind=this.context.createGain(); water=this.context.createGain();
 sources:AudioBufferSourceNode[]=[]; timer=0; tick=0;
 settings:Settings; player:CharacterController; playing=false; audible=false;
 constructor(settings:Settings,player:CharacterController){
  this.settings=settings;this.player=player;this.master.gain.value=0;
  this.analyser.fftSize=256;this.master.connect(this.analyser);this.analyser.connect(this.context.destination);
  const buffer=this.context.createBuffer(1,this.context.sampleRate*4,this.context.sampleRate),data=buffer.getChannelData(0);
  let smooth=0;for(let i=0;i<data.length;i++){smooth=.985*smooth+.015*(Math.random()*2-1);data[i]=smooth*6;}
  const noise=(gain:GainNode,frequency:number,type:BiquadFilterType)=>{const source=this.context.createBufferSource(),filter=this.context.createBiquadFilter();source.buffer=buffer;source.loop=true;filter.type=type;filter.frequency.value=frequency;source.connect(filter);filter.connect(gain);gain.connect(this.master);source.start();this.sources.push(source);};
  noise(this.wind,550,'lowpass');noise(this.water,1400,'highpass');
  this.timer=window.setInterval(()=>{this.update();if(this.audible&&this.context.state==='running'&&!document.hidden){this.tick++;if(this.tick%7===0)this.bird();if(this.tick%11===0)this.frog();}},500);
 }
 update(){const now=this.context.currentTime,s=this.settings,active=this.audible&&!document.hidden&&!s.paused;
  this.master.gain.setTargetAtTime(active?.45:0,now,.25);
  this.wind.gain.setTargetAtTime(s.weather==='rain'?.5:.16,now,.8);
  const p=this.player.position,d=this.playing?Math.min(Math.hypot(p.x+8,p.z+14),Math.hypot(p.x-7,p.z-5)):12;
  this.water.gain.setTargetAtTime((s.weather==='rain'?.8:.25)/(1+d*.13),now,.8);
 }
 tone(frequency:number,end:number,duration:number,volume:number,pan:number,delay=0,type:OscillatorType='sine'){
  const c=this.context,at=c.currentTime+delay,osc=c.createOscillator(),gain=c.createGain(),stereo=c.createStereoPanner();
  osc.type=type;osc.frequency.setValueAtTime(frequency,at);osc.frequency.exponentialRampToValueAtTime(end,at+duration);
  gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(volume,at+.025);gain.gain.exponentialRampToValueAtTime(.0001,at+duration);
  stereo.pan.value=Math.max(-.8,Math.min(.8,pan));osc.connect(gain);gain.connect(stereo);stereo.connect(this.master);osc.start(at);osc.stop(at+duration+.03);
  osc.onended=()=>{osc.disconnect();gain.disconnect();stereo.disconnect();};
 }
 bird(){const pan=Math.sin(this.tick*1.7)*.65,volume=this.settings.night?.012:.045;
  for(let i=0;i<3;i++)this.tone(2100+i*170,3200-i*220,.13,volume,pan,i*.19);
 }
 frog(){const a=animalZones[11+this.tick%3],p=this.player.position,d=this.playing?Math.hypot(p.x-a.x,p.z-a.z):16;
  for(let i=0;i<2;i++)this.tone(this.settings.night?230:310,160,.19,.05/(1+d*.08),(a.x-p.x)/20,i*.25,'triangle');
 }
 async start(){await this.context.resume();this.audible=true;this.update();}
 mute(){this.audible=false;this.update();}
 level(){const samples=new Float32Array(this.analyser.fftSize);this.analyser.getFloatTimeDomainData(samples);return Math.sqrt(samples.reduce((sum,x)=>sum+x*x,0)/samples.length);}
 close(){clearInterval(this.timer);this.sources.forEach(s=>s.stop());void this.context.close();}
}

export function useForestAudio(settings:Settings,player:CharacterController,playing:boolean,visible:boolean){
 const audio=useRef<ForestAudio|null>(null),[enabled,setEnabled]=useState(false),[level,setLevel]=useState(0),[error,setError]=useState(false);
 const current=useRef({settings,playing,visible});current.current={settings,playing,visible};
 const start=useCallback(()=>{const a=audio.current??(audio.current=new ForestAudio(current.current.settings,player));a.playing=current.current.playing;void a.start().then(()=>{setEnabled(true);setError(false);}).catch(()=>setError(true));},[player]);
 const toggle=()=>{if(enabled){audio.current?.mute();setEnabled(false);}else start();};
 useEffect(()=>{const a=audio.current;if(a){a.settings=settings;a.playing=playing;a.audible=enabled&&visible;a.update();}},[settings,playing,enabled,visible]);
 useEffect(()=>{const timer=window.setInterval(()=>setLevel(audio.current?.level()??0),500);return()=>{clearInterval(timer);audio.current?.close();};},[]);
 return{start,toggle,enabled,error,level};
}
