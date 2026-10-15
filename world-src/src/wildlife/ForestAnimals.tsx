import {useMemo,useEffect,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import {useAnimations,useGLTF} from '@react-three/drei';
import {Box3,Group,Object3D,Mesh,SkinnedMesh,MeshStandardMaterial,Vector3,Matrix4,BufferAttribute} from 'three';
import {clone} from 'three/examples/jsm/utils/SkeletonUtils.js';
import {AnimalController} from './behavior';
import {heightAt} from '../world/map';
import type {Settings} from '../environment/settings';
export const forestSpecies=['wolf','bear','boar','badger','squirrel'] as const;
export type ForestSpecies=typeof forestSpecies[number];
export const animalHeights:Record<ForestSpecies,number>={wolf:1.05,bear:1.2,boar:.78,badger:.42,squirrel:.65};
export function normalizeForestModel(source:Group,species:ForestSpecies){const model=clone(source);if(species==='squirrel')model.rotation.y+=Math.PI;model.updateMatrixWorld(true);model.traverse(o=>{if(o instanceof SkinnedMesh){o.skeleton.update();o.computeBoundingBox();}});const box=new Box3().setFromObject(model),size=box.getSize(new Vector3()),scale=animalHeights[species]/size.y;model.scale.multiplyScalar(scale);model.position.set(-(box.min.x+box.max.x)*scale*.5,-box.min.y*scale,-(box.min.z+box.max.z)*scale*.5);model.traverse(o=>{if(o instanceof Mesh){const materials=(Array.isArray(o.material)?o.material:[o.material]).map(material=>{const m=material.clone() as MeshStandardMaterial;m.roughness=.96;m.metalness=0;m.flatShading=true;return m;});o.material=Array.isArray(o.material)?materials:materials[0];o.castShadow=true;o.receiveShadow=true;}});return model;}
// The downloaded static meshes retain their artwork. A small reversible vertex gait
// articulates the lower legs; squirrels use a short bounding motion instead.
export function createForestMotion(model:Object3D,species:ForestSpecies){
 model.updateMatrixWorld(true);const height=animalHeights[species],v=new Vector3();
 const parts:Array<{mesh:Mesh;position:BufferAttribute;rest:Float32Array;world:Matrix4;inverse:Matrix4}>=[];
 if(species!=='wolf'&&species!=='squirrel')model.traverse(o=>{if(o instanceof Mesh){o.geometry=o.geometry.clone();const position=o.geometry.attributes.position as BufferAttribute;parts.push({mesh:o,position,rest:new Float32Array(position.array),world:o.matrixWorld.clone(),inverse:o.matrixWorld.clone().invert()});}});
 return {update(time:number,moving:boolean){const stride=moving?Math.sin(time*7):0;for(const part of parts){for(let i=0;i<part.position.count;i++){v.fromArray(part.rest,i*3).applyMatrix4(part.world);const weight=Math.max(0,1-v.y/(height*.42)),diagonal=(v.x<0?1:-1)*(v.z<0?1:-1);v.z+=stride*diagonal*height*.12*weight;v.y+=Math.max(0,stride*diagonal)*height*.045*weight;v.applyMatrix4(part.inverse);part.position.setXYZ(i,v.x,v.y,v.z);}part.position.needsUpdate=true;}},dispose(){for(const part of parts)part.mesh.geometry.dispose();}};
}
export function ForestAnimal({species,zone,settings,index=0}:{species:ForestSpecies;zone:number;settings:Settings;index?:number}){
 const {scene,animations}=useGLTF(import.meta.env.BASE_URL+'world-assets/animals/'+species+'.glb'),root=useRef<Group>(null!),last=useRef(''),c=useMemo(()=>new AnimalController(zone,4501+index*199+forestSpecies.indexOf(species)*811),[zone,index,species]),model=useMemo(()=>normalizeForestModel(scene,species),[scene,species]),motion=useMemo(()=>createForestMotion(model,species),[model,species]);const {actions,mixer}=useAnimations(animations,model);
 useEffect(()=>()=>{motion.dispose();mixer.stopAllAction();mixer.uncacheRoot(model);model.traverse(o=>{if(o instanceof Mesh)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());});},[model,mixer,motion]);
 useFrame(({camera},dt)=>{if(!root.current)return;const rigged=species==='wolf',near=Math.hypot(camera.position.x-c.x,camera.position.z-c.z)<90;if(!settings.paused&&near)c.advance(dt);const moving=c.state==='MOVE',hop=species==='squirrel'&&moving?Math.max(0,Math.sin(c.time*9))*.095:0;
 root.current.position.set(c.x,heightAt(c.x,c.z)+hop,c.z);root.current.rotation.set(0,c.angle,near?Math.sin(c.time*(moving?7:1.7))*(moving?.012:.004):0);mixer.timeScale=rigged&&!settings.paused&&near?1:0;
 if(near)motion.update(c.time,moving);if(rigged){const state=moving?'Walk':c.state==='ACTION'?'Eating':'Idle';if(last.current!==state){actions[last.current]?.fadeOut(.25);actions[state]?.reset().fadeIn(.25).play();last.current=state;}}root.current.userData.rigged=rigged;root.current.userData.behavior=c.state;
 });
 return <group ref={root} position={[c.x,heightAt(c.x,c.z),c.z]} name={'wildlife-'+species} userData={{assetModel:true}}><primitive object={model}/></group>;
}
export function ForestAnimals({settings}:{settings:Settings}){return <group name="forest-mammals"><ForestAnimal species="wolf" zone={14} settings={settings}/><ForestAnimal species="bear" zone={15} index={2} settings={settings}/><ForestAnimal species="boar" zone={16} settings={settings}/><ForestAnimal species="boar" zone={16} index={1} settings={settings}/><ForestAnimal species="badger" zone={17} settings={settings}/><ForestAnimal species="badger" zone={17} index={1} settings={settings}/><ForestAnimal species="squirrel" zone={18} settings={settings}/><ForestAnimal species="squirrel" zone={19} index={1} settings={settings}/></group>}
