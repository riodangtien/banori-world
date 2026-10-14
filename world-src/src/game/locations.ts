import {canStand,findSpawn,groundAt,initialCameraYaw} from '../player/controller';
import {trailPoint,trailways,distanceToTrail} from '../world/map';
export type Location={x:number;y:number;z:number};
const spawn=findSpawn(),yaw=initialCameraYaw(spawn);
// Place the tutorial collectible along the player's initial sight line on safe ground.
export function firstLocation():Location{
 for(const d of [3.4,2.6,2])for(let turn=0;turn<16;turn++){const a=yaw+turn*Math.PI/8,x=spawn.x-Math.sin(a)*d,z=spawn.z-Math.cos(a)*d;const clear=Array.from({length:10},(_,i)=>{const t=(i+1)/10,cx=spawn.x+(x-spawn.x)*t,cz=spawn.z+(z-spawn.z)*t;return canStand(cx,cz,.3)&&Math.abs(groundAt(cx,cz)-spawn.y)<.35;}).every(Boolean);if(clear&&canStand(x,z,1.2)&&distanceToTrail(x,z)>.9)return{x,y:groundAt(x,z)+1.25,z};}
 return{x:spawn.x,y:spawn.y+1.25,z:spawn.z};
}
// Learning kiosks sit beside the route, leaving the walking corridor open.
export const locations:Location[]=trailways.flatMap((_,path)=>Array.from({length:25},(_,i)=>{const t=.05+i*.9/24,p=trailPoint(path,t),d=trailPoint(path,t+.002).sub(p).normalize();return[-1,1].map(side=>({x:p.x-d.y*1.7*side,z:p.y+d.x*1.7*side}));}).flat()).filter(p=>canStand(p.x,p.z,1.2)&&distanceToTrail(p.x,p.z)>.9).map(p=>({...p,y:groundAt(p.x,p.z)+1.25}));

export function relocated(previous:Location,random:()=>number=Math.random):Location{
 const candidates=locations.filter(p=>Math.hypot(p.x-previous.x,p.z-previous.z)>6);
 if(!candidates.length)throw new Error('No safe quest relocation');
 return candidates[Math.min(candidates.length-1,Math.floor(random()*candidates.length))];
}

export const areaAnchors=[{x:-8,z:1},{x:-19,z:13},{x:17,z:-6}];
export function zoneLocation(mission:number,previous?:Location,random:()=>number=Math.random):Location{
 if(mission===0&&!previous)return firstLocation();
 const anchor=previous??areaAnchors[mission];const candidates=locations.filter(p=>{const d=Math.hypot(p.x-anchor.x,p.z-anchor.z);return d>(previous?2:0)&&d<9;}).sort((a,b)=>Math.hypot(a.x-anchor.x,a.z-anchor.z)-Math.hypot(b.x-anchor.x,b.z-anchor.z));
 if(!candidates.length)return previous??firstLocation();const near=candidates.slice(0,12);return near[Math.min(near.length-1,Math.floor(random()*near.length))];
}
