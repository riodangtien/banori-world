import { useEffect,useMemo } from 'react';
import { BufferGeometry,Color,Float32BufferAttribute,Vector2 } from 'three';
import { biomeAt,boundaryScale,GRID,heightAt,WORLD_X,WORLD_Z } from './map';
const palette={central:'#789852',pine:'#567750',meadow:'#a1b263',river:'#8a9e62',lake:'#809b61',waterfall:'#7c8b66',oldForest:'#637d45',rocky:'#87916e',wetland:'#80966a',hidden:'#66834d'} as const;
const signed=(v:Vector2)=>boundaryScale(Math.atan2(v.y/WORLD_Z,v.x/WORLD_X))-Math.hypot(v.x/WORLD_X,v.y/WORLD_Z);
export function buildTerrain(){const top=new BufferGeometry(),side=new BufferGeometry(),p:number[]=[],c:number[]=[],sp:number[]=[],sc:number[]=[];
 const add=(v:Vector2)=>{p.push(v.x,heightAt(v.x,v.y),v.y);const color=new Color(palette[biomeAt(v.x,v.y)]).offsetHSL(0,0,.018*Math.sin(v.x*1.7+v.y*1.3));c.push(color.r,color.g,color.b);};
 // Clip edge triangles to one shared implicit contour; placement samples this exact triangulation.
 for(let ix=-76;ix<76;ix++)for(let iz=-61;iz<61;iz++){const x=ix*GRID,z=iz*GRID,a=new Vector2(x,z),b=new Vector2(x+GRID,z),d=new Vector2(x,z+GRID),e=new Vector2(x+GRID,z+GRID);
  for(const triangle of [[a,d,b],[b,d,e]]){const poly:Vector2[]=[],edge:Vector2[]=[];for(let i=0;i<3;i++){const v=triangle[i],w=triangle[(i+1)%3],sv=signed(v),sw=signed(w);if(sv>=0)poly.push(v);if((sv>=0)!==(sw>=0)){const q=v.clone().lerp(w,sv/(sv-sw));poly.push(q);edge.push(q);}}
   for(let i=1;i<poly.length-1;i++){add(poly[0]);add(poly[i]);add(poly[i+1]);}
   if(edge.length===2){const [v,w]=edge,vy=heightAt(v.x,v.y),wy=heightAt(w.x,w.y);sp.push(v.x,vy,v.y,w.x,wy,w.y,v.x,-2.15,v.y,v.x,-2.15,v.y,w.x,wy,w.y,w.x,-2.15,w.y);for(let i=0;i<6;i++){const col=new Color(i===0||i===1||i===4?'#766043':'#454638');sc.push(col.r,col.g,col.b);} // close the same irregular outline underneath
    sp.push(0,-2.15,0,v.x,-2.15,v.y,w.x,-2.15,w.y);for(let i=0;i<3;i++){const col=new Color('#343e32');sc.push(col.r,col.g,col.b);}}
  }}
 top.setAttribute('position',new Float32BufferAttribute(p,3));top.setAttribute('color',new Float32BufferAttribute(c,3));top.computeVertexNormals();side.setAttribute('position',new Float32BufferAttribute(sp,3));side.setAttribute('color',new Float32BufferAttribute(sc,3));side.computeVertexNormals();return{top,side};}
export function Terrain(){const {top,side}=useMemo(buildTerrain,[]);useEffect(()=>()=>{top.dispose();side.dispose();},[top,side]);return <group><mesh geometry={top} receiveShadow><meshStandardMaterial vertexColors flatShading roughness={1}/></mesh><mesh geometry={side} receiveShadow><meshStandardMaterial vertexColors flatShading side={2}/></mesh><mesh rotation={[-Math.PI/2,0,0]} position={[0,-2.18,0]} receiveShadow><planeGeometry args={[180,150]}/><shadowMaterial transparent opacity={.14}/></mesh></group>;}
