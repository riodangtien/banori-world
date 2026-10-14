import {useMemo,useEffect} from 'react';
import {CanvasTexture,Color,BackSide,SRGBColorSpace} from 'three';
import {heightAt} from '../world/map';
import type {Settings} from '../environment/settings';
function signTexture(label:string){
 const c=document.createElement('canvas');c.width=512;c.height=128;const x=c.getContext('2d')!;
 x.clearRect(0,0,512,128);x.fillStyle='#18324A';x.font='700 29px Space Grotesk,Arial';x.textAlign='center';x.textBaseline='middle';x.fillText(label,232,64);x.strokeStyle='#18324A';x.lineWidth=7;x.beginPath();x.moveTo(423,64);x.lineTo(475,64);x.lineTo(455,44);x.moveTo(475,64);x.lineTo(455,84);x.stroke();
 const texture=new CanvasTexture(c);texture.colorSpace=SRGBColorSpace;return texture;
}
export function ExpeditionWorld({settings}:{settings:Settings}){
 const signs=useMemo(()=>[{x:-12,z:4.9,angle:0,label:'EXPLORER CAMP'},{x:19,z:-8.1,angle:-.2,label:'RIVERSIDE'},{x:-19.6,z:14.5,angle:0,label:'WOODLAND'}].map(s=>({...s,texture:signTexture(s.label)})),[]);
 useEffect(()=>()=>signs.forEach(s=>s.texture.dispose()),[signs]);
 const uniforms=useMemo(()=>({top:{value:new Color('#85cefa')},horizon:{value:new Color('#e3f6ff')}}),[]);
 return <>
 {!settings.night&&settings.weather==='clear'&&<mesh name="expedition-sky" renderOrder={-100} frustumCulled={false}><sphereGeometry args={[140,24,16]}/><shaderMaterial toneMapped={false} side={BackSide} depthWrite={false} uniforms={uniforms} vertexShader="varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}" fragmentShader={'uniform vec3 top;uniform vec3 horizon;varying vec3 vP;void main(){float h=smoothstep(-.05,.7,normalize(vP).y);gl_FragColor=vec4(mix(horizon,top,h),1.0);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}'}/></mesh>}
 {signs.map(s=><mesh key={s.label} position={[s.x+Math.sin(s.angle)*.057,heightAt(s.x,s.z)+1.27,s.z+Math.cos(s.angle)*.057]} rotation={[0,s.angle,0]}><planeGeometry args={[.79,.2]}/><meshBasicMaterial map={s.texture} transparent polygonOffset polygonOffsetFactor={-1}/></mesh>)}
 </>;
}
