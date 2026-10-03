import { useEffect,useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshStandardMaterial } from 'three';
import type { Settings } from '../environment/settings';
export function WindMaterial({settings}:{settings:Settings}){
 const wind=useMemo(()=>({value:0}),[]);
 const material=useMemo(()=>{const m=new MeshStandardMaterial({color:'#87a24b',roughness:1,flatShading:true});m.onBeforeCompile=shader=>{shader.uniforms.banoriTime=wind;shader.vertexShader='uniform float banoriTime;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
 #ifdef USE_INSTANCING
 float anchor = clamp(position.y + 0.5, 0.0, 1.0);
 vec3 field = instanceMatrix[3].xyz;
 transformed.x += sin(banoriTime*1.7 + field.x*.7 + field.z*.4) * anchor * anchor * .24;
 #endif`);};m.customProgramCacheKey=()=> 'banori-rooted-wind-v1';return m;},[wind]);
 useEffect(()=>()=>material.dispose(),[material]);
 useFrame(({camera},delta)=>{if(!settings.paused&&camera.position.length()<100)wind.value+=Math.min(delta,.05);material.color.set(settings.season==='winter'?'#c8d4ae':settings.season==='autumn'?'#baa15e':'#87a24b');});
 return <primitive object={material} attach="material"/>;
}
