import { useQuality } from '../environment/quality';
import { useLayoutEffect,useMemo,useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color,InstancedMesh,Object3D } from 'three';
import { biomeAt,distanceToWaterway,heightAt,isWater,waterLevel } from '../world/map';
import { random } from '../utils/random';
import { WindMaterial } from './WindMaterial';
import type { Settings } from '../environment/settings';
import { worldLayout,detailAllowed,type Plant } from '../world/layout';
const dummy=new Object3D();
export function Vegetation({settings}:{settings:Settings}){
 const quality=useQuality();
 const leaves=useRef<InstancedMesh>(null!);
 const trunks=useRef<InstancedMesh>(null!),broadA=useRef<InstancedMesh>(null!),broadB=useRef<InstancedMesh>(null!),pineA=useRef<InstancedMesh>(null!),pineB=useRef<InstancedMesh>(null!),grass=useRef<InstancedMesh>(null!),flowers=useRef<InstancedMesh>(null!),bushes=useRef<InstancedMesh>(null!),stems=useRef<InstancedMesh>(null!),caps=useRef<InstancedMesh>(null!),reeds=useRef<InstancedMesh>(null!);
 const data=useMemo(()=>{
  const all=worldLayout.trees,conifers=all.filter(p=>['pine','rocky'].includes(biomeAt(p.x,p.z))),broad=all.filter(p=>!conifers.includes(p));
  const r=random(909),grassPlants:Array<Pick<Plant,'x'|'z'|'s'|'rotation'>>=[],bushPlants:Array<Pick<Plant,'x'|'z'|'s'|'rotation'>>=[],blooms:Array<Pick<Plant,'x'|'z'|'s'|'rotation'>>=[],mushrooms:Array<Pick<Plant,'x'|'z'|'s'|'rotation'>>=[],reedPlants:Array<Pick<Plant,'x'|'z'|'s'|'rotation'>>=[];
  for(let i=0;i<(innerWidth<600?3500:7000);i++){const x=r()*54-27,z=r()*42-21;if(detailAllowed(x,z)&&biomeAt(x,z)!=='rocky'&&Math.sin(x*.6+z*.3)+Math.cos(z*.7)>-.15)grassPlants.push({x,z,s:.08+r()*.2,rotation:r()*6.28});}
  for(let i=0;i<1200;i++){const x=r()*52-26,z=r()*40-20,b=biomeAt(x,z);if(detailAllowed(x,z,.45)&&!['meadow','rocky'].includes(b)&&distanceToWaterway(x,z)>.9)bushPlants.push({x,z,s:.2+r()*.38,rotation:r()*6.28});}
  for(let i=0;i<1700;i++){const a=r()*6.28,d=Math.sqrt(r()),x=-14+Math.cos(a)*d*7,z=7+Math.sin(a)*d*5.2;if(detailAllowed(x,z)&&Math.sin(x*2)+Math.cos(z*2)>.25)blooms.push({x,z,s:.045+r()*.075,rotation:r()*6.28});}
  for(let i=0;i<520;i++){const old=r()<.72,a=r()*6.28,d=Math.sqrt(r()),x=(old?17:-19)+Math.cos(a)*d*(old?7:4.7),z=(old?2:14)+Math.sin(a)*d*(old?7:4.2);if(detailAllowed(x,z)&&worldLayout.trees.some(t=>Math.hypot(x-t.x,z-t.z)<1.1))mushrooms.push({x,z,s:.05+r()*.085,rotation:r()*6.28});}
  for(let i=0;i<900;i++){const wet=r()<.55,a=r()*6.28,d=Math.sqrt(r()),x=(wet?14:7)+Math.cos(a)*d*(wet?8:6.3),z=(wet?14:5)+Math.sin(a)*d*(wet?6:5.2);const near=!isWater(x,z)&&(distanceToWaterway(x,z)<1.6||Math.abs(((x-7)/5.2)**2+((z-5.1)/4.25)**2-1)<.14);if(detailAllowed(x,z)&&near)reedPlants.push({x,z,s:.12+r()*.23,rotation:r()*6.28});}
  const fallenLeaves:Array<Pick<Plant,'x'|'z'|'s'|'rotation'>>=[];for(const tree of broad.filter(t=>biomeAt(t.x,t.z)==='oldForest'))for(let j=0;j<7;j++){const a=r()*6.283,d=.25+r()*1.15,x=tree.x+Math.cos(a)*d,z=tree.z+Math.sin(a)*d;if(detailAllowed(x,z))fallenLeaves.push({x,z,s:.06+r()*.04,rotation:a});}
  return{leaves:fallenLeaves,broad,pine:conifers,all,grass:grassPlants,bushes:bushPlants,blooms,mushrooms,reeds:reedPlants};
 },[]);
 useLayoutEffect(()=>{
  const set=(ref:React.RefObject<InstancedMesh|null>,items:Array<Pick<Plant,'x'|'z'|'s'|'rotation'>>,fn:(p:Pick<Plant,'x'|'z'|'s'|'rotation'>)=>void)=>{items.forEach((p,i)=>{fn(p);dummy.updateMatrix();ref.current!.setMatrixAt(i,dummy.matrix);if(ref===broadA||ref===broadB||ref===pineA||ref===pineB){const old=biomeAt(p.x,p.z)==='oldForest',pine=ref===pineA||ref===pineB;const tint=new Color(pine?(i%3===0?'#476f53':'#315b46'):settings.season==='winter'?'#d8dfcb':old||settings.season==='autumn'?['#bd963f','#d8b252','#ca8b3e','#9a9b4c'][i%4]:['#789b50','#92b46a','#6e9856','#abc77a'][i%4]);ref.current!.setColorAt(i,tint);}});if(ref===leaves)items.forEach((_,i)=>ref.current!.setColorAt(i,new Color(['#b99442','#c4a95d','#b5793d','#969b51'][i%4])));ref.current!.instanceMatrix.needsUpdate=true;ref.current!.computeBoundingSphere();};
  set(leaves,data.leaves,p=>{dummy.position.set(p.x,heightAt(p.x,p.z)+.014,p.z);dummy.rotation.set(0,p.rotation,0);dummy.scale.set(p.s,.008,p.s*1.6);});
  set(trunks,data.all,p=>{dummy.position.set(p.x,heightAt(p.x,p.z)+p.s*.7,p.z);dummy.rotation.set(0,p.rotation,0);dummy.scale.set(.13*p.s,1.4*p.s,.13*p.s);});
  set(broadA,data.broad,p=>{dummy.position.set(p.x,heightAt(p.x,p.z)+1.65*p.s,p.z);dummy.rotation.set(0,p.rotation,0);const family=biomeAt(p.x,p.z);dummy.scale.set((family==='oldForest'?.94:family==='river'?.57:.68+(data.broad.indexOf(p as Plant)%3)*.08)*p.s,(family==='river'?1.02:family==='oldForest'?.61:.72)*p.s,(family==='river'?.57:.78)*p.s);});
  set(broadB,data.broad,p=>{dummy.position.set(p.x+.18*p.s,heightAt(p.x,p.z)+2.18*p.s,p.z-.1*p.s);dummy.rotation.set(0,p.rotation,0);dummy.scale.set(.66*p.s,.63*p.s,.66*p.s);});
  set(pineA,data.pine,p=>{dummy.position.set(p.x,heightAt(p.x,p.z)+1.52*p.s,p.z);dummy.rotation.set(0,p.rotation,0);dummy.scale.set(.73*p.s,1.45*p.s,.73*p.s);});
  set(pineB,data.pine,p=>{dummy.position.set(p.x,heightAt(p.x,p.z)+2.38*p.s,p.z);dummy.rotation.set(0,p.rotation+.3,0);dummy.scale.set(.48*p.s,1.12*p.s,.48*p.s);});
  set(grass,data.grass,p=>{dummy.position.set(p.x,heightAt(p.x,p.z)+p.s*.5,p.z);dummy.rotation.set(0,p.rotation,0);dummy.scale.set(p.s*.4,p.s,p.s*.4);});
  set(bushes,data.bushes,p=>{dummy.position.set(p.x,heightAt(p.x,p.z)+p.s*.5,p.z);dummy.rotation.set(0,p.rotation,0);dummy.scale.set(p.s*1.15,p.s*.8,p.s);});
  set(flowers,data.blooms,p=>{dummy.position.set(p.x,heightAt(p.x,p.z)+.13,p.z);dummy.rotation.set(0,p.rotation,0);dummy.scale.set(p.s,p.s*.5,p.s);});
  set(stems,data.mushrooms,p=>{dummy.position.set(p.x,heightAt(p.x,p.z)+p.s,p.z);dummy.scale.set(p.s*.28,p.s,p.s*.28);});
  set(caps,data.mushrooms,p=>{dummy.position.set(p.x,heightAt(p.x,p.z)+p.s*2,p.z);dummy.rotation.set(0,p.rotation,0);dummy.scale.set(p.s*1.1,p.s*.5,p.s*1.1);});
  set(reeds,data.reeds,p=>{dummy.position.set(p.x,(isWater(p.x,p.z)?waterLevel:heightAt(p.x,p.z))+p.s*.5,p.z);dummy.rotation.set(0,p.rotation,0);dummy.scale.set(p.s*.16,p.s,p.s*.16);});
 },[data,settings.season]);
 useFrame(({camera})=>{const d=camera.position.length();grass.current.count=Math.round((d<95?data.grass.length:d<135?data.grass.length*.35:0)*quality.density);flowers.current.count=Math.round(data.blooms.length*quality.density);stems.current.visible=caps.current.visible=leaves.current.visible=d<110;flowers.current.visible=d<145;broadB.current.visible=d<155;});
 return <group><instancedMesh ref={leaves} args={[undefined,undefined,data.leaves.length]}><octahedronGeometry args={[1,0]}/><meshStandardMaterial color="#ffffff" flatShading roughness={1}/></instancedMesh>
  <instancedMesh ref={trunks} args={[undefined,undefined,data.all.length]} castShadow={quality.shadow>512}><cylinderGeometry args={[1,1.28,1,6]}/><meshStandardMaterial color="#67513b" flatShading/></instancedMesh>
  <instancedMesh ref={broadA} args={[undefined,undefined,data.broad.length]} castShadow={quality.shadow>512}><dodecahedronGeometry args={[1,0]}/><meshStandardMaterial color="#ffffff" flatShading roughness={1}/></instancedMesh>
  <instancedMesh ref={broadB} args={[undefined,undefined,data.broad.length]} castShadow={quality.shadow>512}><icosahedronGeometry args={[1,1]}/><meshStandardMaterial color="#ffffff" flatShading roughness={1}/></instancedMesh>
  <instancedMesh ref={pineA} args={[undefined,undefined,data.pine.length]} castShadow={quality.shadow>512}><coneGeometry args={[1,1,7]}/><meshStandardMaterial color="#ffffff" flatShading/></instancedMesh>
  <instancedMesh ref={pineB} args={[undefined,undefined,data.pine.length]} castShadow={quality.shadow>512}><coneGeometry args={[1,1,7]}/><meshStandardMaterial color="#ffffff" flatShading/></instancedMesh>
  <instancedMesh ref={grass} args={[undefined,undefined,data.grass.length]}><coneGeometry args={[1,1,3]}/><WindMaterial settings={settings}/></instancedMesh>
  <instancedMesh ref={bushes} args={[undefined,undefined,data.bushes.length]}><icosahedronGeometry args={[1,1]}/><meshStandardMaterial color="#4e7841" flatShading/></instancedMesh>
  <instancedMesh ref={flowers} args={[undefined,undefined,data.blooms.length]}><icosahedronGeometry args={[1,0]}/><meshStandardMaterial color="#f2d57a" flatShading/></instancedMesh>
  <instancedMesh ref={stems} args={[undefined,undefined,data.mushrooms.length]}><cylinderGeometry args={[1,1.25,1,5]}/><meshStandardMaterial color="#e4d5b4" flatShading/></instancedMesh>
  <instancedMesh ref={caps} args={[undefined,undefined,data.mushrooms.length]}><sphereGeometry args={[1,7,4]}/><meshStandardMaterial color="#c56549" flatShading/></instancedMesh>
  <instancedMesh ref={reeds} args={[undefined,undefined,data.reeds.length]}><coneGeometry args={[1,1,5]}/><meshStandardMaterial color="#7c9250" flatShading/></instancedMesh>
 </group>;
}
