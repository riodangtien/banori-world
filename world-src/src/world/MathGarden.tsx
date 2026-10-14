import {useMemo,useEffect} from 'react';
import {Builder} from './geometry';
import {heightAt} from './map';
// An authored counting garden at the camp: five planted rows, framed beds and rounded edging.
export function MathGarden(){const batches=useMemo(()=>{const b=new Builder(),x=-17.8,z=10.8;
 for(let row=0;row<3;row++){const cx=x+row*.68,y=heightAt(cx,z);b.box([cx,y+.035,z],[.54,.07,1.25],'#66523c');for(const side of [-1,1])b.box([cx+side*.28,y+.06,z],[.06,.13,1.35],'#b28a59');for(const end of [-1,1])b.box([cx,y+.06,z+end*.65],[.6,.13,.06],'#b28a59');
 for(let n=0;n<5;n++){const pz=z-.48+n*.24,py=heightAt(cx,pz);b.cylinder([cx,py+.02,pz],[cx,py+.18,pz],.02,'#507d50');b.rock([cx-.055,py+.14,pz],[.085,.04,.055],'#79a75c',-.3);b.rock([cx+.055,py+.18,pz],[.085,.04,.055],'#91b966',.3);}}
 return b.finish();},[]);useEffect(()=>()=>batches.forEach(b=>{b.geometry.dispose();b.material.dispose();}),[batches]);return <group name="counting-garden">{batches.map((b,i)=><mesh key={i} geometry={b.geometry} material={b.material} receiveShadow/>)}</group>}
