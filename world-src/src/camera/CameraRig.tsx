import { useEffect,useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useFrame,useThree } from '@react-three/fiber';
import { PerspectiveCamera,Vector3 } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { destinations,type Settings } from '../environment/settings';
import { usePlay } from '../player/session';
import { obstacles,groundAt } from '../player/controller';
export function CameraRig({settings}:{settings:Settings}){
 const {camera,size}=useThree(),controls=useRef<OrbitControlsImpl>(null!),s=usePlay(),elapsed=useRef(0),start=useRef(new Vector3()),fromTarget=useRef(new Vector3()),target=useRef(new Vector3()),desired=useRef(new Vector3());
 useEffect(()=>{if(s.mode!=='explore')return;const d=destinations[settings.destination],scale=settings.destination==='overview'?Math.max(1,.98/(size.width/size.height)):1;camera.position.set(d.position[0]*scale,d.position[1]*scale,d.position[2]*scale);controls.current?.target.set(...d.target as [number,number,number]);controls.current?.update();},[settings.destination,camera,size.width,size.height,s.mode]);
 useEffect(()=>{elapsed.current=0;start.current.copy(camera.position);fromTarget.current.copy(controls.current?.target??target.current);if(s.mode==='transitioningToPlay')s.controller.reset();},[s.mode,camera,s.controller]);
 useEffect(()=>{if(s.mode==='play')s.controller.cameraPitch=s.view==='first'?.04:.25;},[s.view,s.mode,s.controller]);
 useFrame((_,delta)=>{if(s.mode==='explore'){s.ready();if(camera instanceof PerspectiveCamera&&camera.fov!==38){camera.fov=38;camera.updateProjectionMatrix();}return;}
 const c=s.controller;if(s.mode==='play'&&!(matchMedia('(pointer:coarse)').matches&&size.height>size.width))c.step(s.input,delta);const p=c.position,first=s.view==='first';
 if(camera instanceof PerspectiveCamera){const fov=first?64:48;if(camera.fov!==fov){camera.fov=fov;camera.updateProjectionMatrix();}}
 if(first){const walking=c.animation==='Walk'||c.animation==='Run',bob=walking?Math.sin(performance.now()*.011)*.018:0;desired.current.set(p.x,p.y+1.55+bob,p.z);target.current.set(p.x-Math.sin(c.cameraYaw)*Math.cos(c.cameraPitch)*5,desired.current.y-Math.sin(c.cameraPitch)*5,p.z-Math.cos(c.cameraYaw)*Math.cos(c.cameraPitch)*5);}
 else{target.current.set(p.x,p.y+1.2,p.z);desired.current.set(p.x+Math.sin(c.cameraYaw)*4.4,p.y+1.2+Math.sin(c.cameraPitch)*4.4,p.z+Math.cos(c.cameraYaw)*4.4);for(let t=.25;t<=1;t+=.04){const x=target.current.x+(desired.current.x-target.current.x)*t,y=target.current.y+(desired.current.y-target.current.y)*t,z=target.current.z+(desired.current.z-target.current.z)*t;if(y<groundAt(x,z)+.3||obstacles.some(o=>Math.hypot(x-o.x,z-o.z)<o.r+.15&&y<groundAt(o.x,o.z)+o.height)){desired.current.lerpVectors(target.current,desired.current,Math.max(.28,t-.05));break;}}}
 if(s.mode==='play'){camera.position.lerp(desired.current,1-Math.exp(-12*Math.min(delta,.05)));camera.lookAt(target.current);controls.current.target.copy(target.current);}else{elapsed.current+=Math.min(delta,.05);const t=Math.min(1,elapsed.current/1.5),smooth=t*t*(3-2*t);if(s.mode==='transitioningToExplore'){const d=destinations.overview,scale=Math.max(1,.98/(size.width/size.height));desired.current.set(d.position[0]*scale,d.position[1]*scale,d.position[2]*scale);target.current.set(0,.5,0);}camera.position.lerpVectors(start.current,desired.current,smooth);camera.lookAt(new Vector3().lerpVectors(fromTarget.current,target.current,smooth));if(t===1){controls.current.target.copy(target.current);s.finish();}}
 const out=document.getElementById('player-health');if(out)out.textContent=JSON.stringify({mode:s.mode,view:s.view,position:p,animation:c.animation,grounded:c.grounded,camera:camera.position.toArray()});
 });
 return <OrbitControls ref={controls} makeDefault enabled={s.mode==='explore'} enableZoom={false} enableDamping dampingFactor={.055} minDistance={8} maxDistance={240} minPolarAngle={.2} maxPolarAngle={Math.PI*.47} enablePan screenSpacePanning/>;
}
