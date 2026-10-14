import {useMemo,useEffect} from 'react';
import {RoundedBox} from '@react-three/drei';
import {Shape,ExtrudeGeometry,LatheGeometry,Vector2} from 'three';
export function CollectibleModel({index}:{index:number}){
 const geometries=useMemo(()=>{
  const s=new Shape();s.moveTo(-.56,.32);s.bezierCurveTo(-.67,-.34,-.36,-.67,.21,-.56);s.bezierCurveTo(.55,-.51,.72,-.2,.64,.12);s.bezierCurveTo(.38,-.17,-.12,-.18,-.56,.32);
  const banana=new ExtrudeGeometry(s,{depth:.16,bevelEnabled:true,bevelSize:.055,bevelThickness:.045,bevelSegments:3,curveSegments:20});banana.translate(0,.1,-.08);
  const crystal=new LatheGeometry([new Vector2(0,-.6),new Vector2(.28,-.28),new Vector2(.4,.14),new Vector2(.25,.39),new Vector2(0,.65)],6);
  return{banana,crystal};
 },[]);
 useEffect(()=>()=>{geometries.banana.dispose();geometries.crystal.dispose();},[geometries]);
 if(index===0)return <group rotation={[0,0,-.1]} name="golden-banana-model">
  <mesh geometry={geometries.banana} castShadow><meshStandardMaterial color="#F3CE63" roughness={.45}/></mesh>
  <RoundedBox args={[.1,.16,.13]} radius={.025} position={[-.56,.37,0]} rotation={[0,0,-.4]}><meshStandardMaterial color="#745330"/></RoundedBox>
  <mesh position={[.62,.19,0]} rotation={[0,0,-.3]}><sphereGeometry args={[.065,8,6]}/><meshStandardMaterial color="#977440"/></mesh>
  <mesh position={[-.24,-.37,.145]} rotation={[0,0,.45]}><boxGeometry args={[.34,.014,.012]}/><meshStandardMaterial color="#D9A437"/></mesh>
 </group>;
 if(index===1)return <group name="explorer-book-model" rotation={[0,0,-.12]}>
  <RoundedBox args={[.75,.94,.19]} radius={.035}><meshStandardMaterial color="#48327D" roughness={.85}/></RoundedBox>
  <RoundedBox args={[.66,.81,.17]} radius={.018} position={[.055,0,0]}><meshStandardMaterial color="#F6ECCF" roughness={1}/></RoundedBox>
  {[-1,1].map(side=><RoundedBox key={side} args={[.77,.96,.04]} radius={.03} position={[0,0,side*.11]}><meshStandardMaterial color="#6336FF" roughness={.7}/></RoundedBox>)}
  <mesh position={[-.28,0,.135]}><boxGeometry args={[.045,.9,.015]}/><meshStandardMaterial color="#DBCA8B"/></mesh>
  <mesh position={[.24,.47,.14]}><boxGeometry args={[.1,.18,.018]}/><meshStandardMaterial color="#F3CE63"/></mesh>
  <mesh position={[.06,.08,.14]} rotation={[0,0,Math.PI/4]}><planeGeometry args={[.24,.24]}/><meshBasicMaterial color="#CDEFF3"/></mesh>
  <mesh position={[.06,-.19,.14]}><planeGeometry args={[.3,.025]}/><meshBasicMaterial color="#CDEFF3"/></mesh>
 </group>;
 return <group name="knowledge-crystal-model">
  <mesh geometry={geometries.crystal} castShadow><meshStandardMaterial color="#65D6DC" roughness={.32} metalness={.08}/></mesh>
  <mesh position={[0,-.24,0]}><cylinderGeometry args={[.28,.19,.15,6]}/><meshStandardMaterial color="#F3CE63" roughness={.45}/></mesh>
  {[-1,1].map(side=><mesh key={side} position={[side*.34,-.25,0]} scale={.36} rotation={[0,0,side*-.45]} geometry={geometries.crystal}><meshStandardMaterial color="#B1ECED" roughness={.4}/></mesh>)}
 </group>;
}
