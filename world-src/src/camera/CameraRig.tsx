import {useGame} from '../game/GameContext';
import { useEffect,useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useFrame,useThree } from '@react-three/fiber';
import { PerspectiveCamera,Vector3 } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { destinations,type Settings } from '../environment/settings';
import { usePlay } from '../player/session';
import { cameraBlockedAt,validatePlayerPosition,canStand } from '../player/controller';
export function CameraRig({settings}:{settings:Settings}){
 const demo=useGame(),{camera,size}=useThree(),controls=useRef<OrbitControlsImpl>(null!),s=usePlay(),elapsed=useRef(0),start=useRef(new Vector3()),fromTarget=useRef(new Vector3()),target=useRef(new Vector3()),desired=useRef(new Vector3()),poseTimer=useRef(0);
 useEffect(()=>{if(s.mode!=='explore')return;const d=destinations[settings.destination],scale=settings.destination==='overview'?Math.max(1,.98/(size.width/size.height)):1;camera.position.set(d.position[0]*scale,d.position[1]*scale,d.position[2]*scale);controls.current?.target.set(...d.target as [number,number,number]);controls.current?.update();},[settings.destination,camera,size.width,size.height,s.mode]);
 useEffect(()=>{elapsed.current=0;start.current.copy(camera.position);fromTarget.current.copy(controls.current?.target??target.current);if(s.mode==='transitioningToPlay'){s.controller.reset();try{const saved=validatePlayerPosition(JSON.parse(localStorage.getItem('banori-player-position-v2')||'null'),demo.game.runId);if(saved)s.controller.position=saved;}catch{}s.controller.cameraPitch=s.view==='first'?.04:.25;const p=s.controller.position;s.controller.cameraYaw=Math.atan2(p.x-demo.game.position.x,p.z-demo.game.position.z);}},[s.mode,camera,s.controller]);
 useEffect(()=>{if(s.mode==='play')s.controller.cameraPitch=s.view==='first'?.04:.25;},[s.view,s.mode,s.controller]);
 useFrame((_,delta)=>{if(s.mode==='explore'){s.ready();if(camera instanceof PerspectiveCamera&&camera.fov!==38){camera.fov=38;camera.updateProjectionMatrix();}return;}
 const c=s.controller;if(s.mode==='play'&&demo.game.phase==='find'&&!demo.game.paused)c.step(s.input,delta);const p=c.position,first=s.view==='first';
 if(camera instanceof PerspectiveCamera){const fov=first?64:48;if(camera.fov!==fov){camera.fov=fov;camera.updateProjectionMatrix();}}
 if(first){const bob=0;desired.current.set(p.x,p.y+1.55+bob,p.z);target.current.set(p.x-Math.sin(c.cameraYaw)*Math.cos(c.cameraPitch)*5,desired.current.y-Math.sin(c.cameraPitch)*5,p.z-Math.cos(c.cameraYaw)*Math.cos(c.cameraPitch)*5);}
 else{target.current.set(p.x,p.y+1.2,p.z);desired.current.set(p.x+Math.sin(c.cameraYaw)*4.4,p.y+1.2+Math.sin(c.cameraPitch)*4.4,p.z+Math.cos(c.cameraYaw)*4.4);for(let t=.25;t<=1;t+=.04){const x=target.current.x+(desired.current.x-target.current.x)*t,y=target.current.y+(desired.current.y-target.current.y)*t,z=target.current.z+(desired.current.z-target.current.z)*t;if(cameraBlockedAt(x,y,z)){desired.current.lerpVectors(target.current,desired.current,Math.max(.28,t-.05));break;}}}
 if(s.mode==='play'){if(first){camera.position.set(desired.current.x,camera.position.y+(desired.current.y-camera.position.y)*(1-Math.exp(-14*Math.min(delta,.25))),desired.current.z);target.current.y=camera.position.y-Math.sin(c.cameraPitch)*5;}else camera.position.lerp(desired.current,1-Math.exp(-10*Math.min(delta,.12)));camera.lookAt(target.current);controls.current.target.copy(target.current);}else{elapsed.current+=Math.min(delta,.05);const t=Math.min(1,elapsed.current/1.5),smooth=t*t*(3-2*t);if(s.mode==='transitioningToExplore'){const d=destinations.overview,scale=Math.max(1,.98/(size.width/size.height));desired.current.set(d.position[0]*scale,d.position[1]*scale,d.position[2]*scale);target.current.set(0,.5,0);}camera.position.lerpVectors(start.current,desired.current,smooth);camera.lookAt(new Vector3().lerpVectors(fromTarget.current,target.current,smooth));if(t===1){controls.current.target.copy(target.current);s.finish();}}
 poseTimer.current+=delta;if(s.mode==='play'&&demo.game.phase==='find'&&!demo.game.paused&&c.grounded&&poseTimer.current>1&&canStand(p.x,p.z)){poseTimer.current=0;try{localStorage.setItem('banori-player-position-v2',JSON.stringify({runId:demo.game.runId,x:p.x,z:p.z}));}catch{}}
 const out=document.getElementById('player-health');if(out)out.textContent=JSON.stringify({mode:s.mode,view:s.view,position:p,cameraYaw:c.cameraYaw,cameraPitch:c.cameraPitch,animation:c.animation,grounded:c.grounded,camera:camera.position.toArray()});
 });
 return <OrbitControls ref={controls} makeDefault enabled={s.mode==='explore'} enableZoom={false} enableDamping dampingFactor={.055} minDistance={8} maxDistance={240} minPolarAngle={.2} maxPolarAngle={Math.PI*.47} enablePan screenSpacePanning/>;
}
