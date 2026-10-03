import { BufferGeometry,Float32BufferAttribute } from 'three';
import type { Bridge } from './layout';
import { heightAt } from './map';
export const BRIDGE_HALF_WIDTH=.65;
export function bridgePoint(b:Bridge,t:number,side=0){return{x:b.x+Math.sin(b.angle)*t+Math.cos(b.angle)*side,z:b.z+Math.cos(b.angle)*t-Math.sin(b.angle)*side};}
export function bridgeSurfaceY(b:Bridge,t:number,side=0){const top=b.y+.065,half=b.length/2;if(Math.abs(t)<=half)return top;const u=Math.min(1,(Math.abs(t)-half)/b.ramp),end=bridgePoint(b,Math.sign(t)*(half+b.ramp),side),p=bridgePoint(b,t,side);return Math.max(top*(1-u)+(heightAt(end.x,end.z)+.028)*u,heightAt(p.x,p.z)+.028);}
export function bridgeCoordinates(b:Bridge,x:number,z:number){return{along:(x-b.x)*Math.sin(b.angle)+(z-b.z)*Math.cos(b.angle),side:(x-b.x)*Math.cos(b.angle)-(z-b.z)*Math.sin(b.angle)};}
// Continuous solid planks, including terrain-following approach ramps.
export function bridgeStrip(b:Bridge,start:number,end:number){
 const p:number[]=[],quad=(a:number[],b:number[],c:number[],d:number[])=>p.push(...a,...c,...b,...a,...d,...c);
 const v=(t:number,s:number,lower=false)=>{const q=bridgePoint(b,t,s);return[q.x,bridgeSurfaceY(b,t,s)-(lower?.1:0),q.z];};
 // Narrow panels follow terrain across the ramp width as well as along it.
 const flat=Math.abs(start)<=b.length/2&&Math.abs(end)<=b.length/2,columns=flat?1:10,count=flat?1:Math.ceil((end-start)/.05); for(let j=0;j<count;j++)for(let i=0;i<columns;i++){const from=start+(end-start)*j/count,to=start+(end-start)*(j+1)/count,left=-.65+i*1.3/columns,right=left+1.3/columns,a=v(from,left),c=v(from,right),d=v(to,right),e=v(to,left),al=v(from,left,true),cl=v(from,right,true),dl=v(to,right,true),el=v(to,left,true);
 quad(a,c,d,e);quad(al,el,dl,cl);if(i===0)quad(a,e,el,al);if(i===columns-1)quad(c,cl,dl,d);if(j===0)quad(a,al,cl,c);if(j===count-1)quad(e,d,dl,el);
 }
 const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(p,3));g.computeVertexNormals();return g;
}
