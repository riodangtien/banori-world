import { useEffect,useMemo } from 'react';
import { Builder } from './geometry';
import { heightAt,waterways,waterwayPoint,waterWidthAt,isWater,insideIsland,distanceToTrail } from './map';
import { worldLayout,waterRocks,bridges,animalZones } from './layout';
export function Props(){const batches=useMemo(()=>{const b=new Builder();
 // Sparse shoreline stone groups frame streams without filling paths or animal glades.
 for(let w=0;w<waterways.length;w++)for(let i=2;i<32;i+=2){const t=i/34,p=waterwayPoint(w,t),d=waterwayPoint(w,t+.003).sub(p).normalize(),side=i%4?1:-1,offset=waterWidthAt(w,t)+.22,x=p.x-d.y*offset*side,z=p.y+d.x*offset*side;
  if(!insideIsland(x,z,.5)||isWater(x,z)||distanceToTrail(x,z)<1.5||bridges.some(br=>Math.hypot(x-br.x,z-br.z)<br.length/2+br.ramp+1)||animalZones.some(a=>Math.hypot(x-a.x,z-a.z)<a.r+.4))continue;
  for(let j=0;j<3;j++){const cx=x+d.x*j*.17,cz=z+d.y*j*.17,s=.09+(i+j)%3*.025;b.rock([cx,heightAt(cx,cz)+s*.13,cz],[s,s*.55,s*.8],j%2?'#8a917d':'#788471',i+j);}
 }
for(const p of waterRocks)b.rock([p.x,heightAt(p.x,p.z)+.14,p.z],[.27,.28,.3],'#60776c',p.rotation);for(const p of worldLayout.rocks)b.rock([p.x,heightAt(p.x,p.z)+p.s*.16,p.z],[p.s,p.s*(.55+p.variant*.07),p.s*.8],p.variant%2?'#8a917d':'#788471',p.rotation);for(const p of worldLayout.logs){const dx=Math.sin(p.rotation)*p.s*.8,dz=Math.cos(p.rotation)*p.s*.8,a:[number,number,number]=[p.x-dx,heightAt(p.x-dx,p.z-dz)+.09,p.z-dz],c:[number,number,number]=[p.x+dx,heightAt(p.x+dx,p.z+dz)+.09,p.z+dz];b.cylinder(a,c,.11,'#6c5239');const t=.985;b.cylinder([a[0]*t+c[0]*(1-t),a[1]*t+c[1]*(1-t),a[2]*t+c[2]*(1-t)],a,.112,'#ba9562');b.cylinder([c[0]*t+a[0]*(1-t),c[1]*t+a[1]*(1-t),c[2]*t+a[2]*(1-t)],c,.112,'#ba9562');}
 for(const p of worldLayout.stumps){const y=heightAt(p.x,p.z);b.cylinder([p.x,y-.08,p.z],[p.x,y+p.s*1.1,p.z],p.s,'#745538',p.s*.82);b.cylinder([p.x,y+p.s*1.1,p.z],[p.x,y+p.s*1.1+.015,p.z],p.s*.75,'#c19c69');}return b.finish();},[]);useEffect(()=>()=>batches.forEach(b=>{b.geometry.dispose();b.material.dispose();}),[batches]);return <group>{batches.map((b,i)=><mesh key={i} geometry={b.geometry} material={b.material} receiveShadow/>)}</group>;}
