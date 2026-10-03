import { Vector2 } from 'three';
export type Vec3=[number,number,number];
export type Biome='central'|'pine'|'meadow'|'river'|'lake'|'waterfall'|'oldForest'|'rocky'|'wetland'|'hidden';
export const WORLD_X=28,WORLD_Z=22,waterLevel=.16;
export const areas=[
 {name:'Central Forest',x:-2,z:1},{name:'Pine Highlands',x:-16,z:-12},{name:'Flower Meadow',x:-14,z:7},
 {name:'River Valley',x:-1,z:-2},{name:'Great Lake',x:7,z:5},{name:'Waterfall Cliff',x:-8,z:-14},
 {name:'Dense Old Forest',x:17,z:2},{name:'Rocky Hills',x:17,z:-11},{name:'Wetland',x:13,z:14},{name:'Hidden Grove',x:-19,z:14},
] as const;
export const semanticZones={
 DEER_GRAZING_AREA:[-13,7] as const,DEER_DRINKING_AREA:[1,1] as const,RABBIT_BURROW:[-17,9] as const,
 SQUIRREL_TREE_ZONE:[-2,1] as const,FOX_FOREST_ZONE:[17,1] as const,BEAR_CAVE:[19,-10] as const,
 BEAR_FISHING_AREA:[6,9] as const,BIRD_PERCH:[1,-1] as const,DUCK_LAKE_ZONE:[8,5] as const,
 FROG_WETLAND:[14,14] as const,BUTTERFLY_FLOWER_ZONE:[-13,7] as const,
};
const main=[new Vector2(-8.4,-12.8),new Vector2(-6,-10),new Vector2(-5,-5),new Vector2(-1,-1),new Vector2(4,1.5),new Vector2(6,4),new Vector2(8,8),new Vector2(10,13),new Vector2(9,17.5),new Vector2(8.55,19.25)];
const west=[new Vector2(-24,-4),new Vector2(-19,-2),new Vector2(-14,0),new Vector2(-9,-.5),new Vector2(-4,-1)];
const east=[new Vector2(23,-6),new Vector2(20,-4),new Vector2(17,-1),new Vector2(13,1.5),new Vector2(9,3.5)];
const wetland=[new Vector2(9,10),new Vector2(12.5,11.8),new Vector2(15,13.8),new Vector2(18,14.7)];
export const waterways=[main,west,east,wetland] as const;
export const waterWidths=[.88,.52,.55,.38] as const;
export const trailways=[
 [[-14,8],[-12,5],[-8,1],[-5,-4],[-1,-5],[5,-3],[11,-3],[13.2,-2],[13.2,2],[13.2,5.2],[17,5.8]],
 [[13.2,-2],[14,-4],[17,-6],[17,-9.5]],
 [[-14,8],[-17,10],[-19,13],[-19,15.5]],
 [[-12,5],[-14,0],[-14,-6],[-19,-12]],
 [[-1,-5],[-1,-9],[-3,-12],[-5.7,-12.5]],
 [[17,5.8],[17,8],[18,11],[17,13]],
] as readonly (readonly [number,number][])[];
function curvePoint(points:readonly Vector2[],t:number){
 const s=Math.max(0,Math.min(.99999,t))*(points.length-1),i=Math.floor(s),u=s-i;
 const p0=points[Math.max(0,i-1)],p1=points[i],p2=points[Math.min(points.length-1,i+1)],p3=points[Math.min(points.length-1,i+2)],u2=u*u,u3=u2*u;
 return new Vector2(.5*((2*p1.x)+(-p0.x+p2.x)*u+(2*p0.x-5*p1.x+4*p2.x-p3.x)*u2+(-p0.x+3*p1.x-3*p2.x+p3.x)*u3),.5*((2*p1.y)+(-p0.y+p2.y)*u+(2*p0.y-5*p1.y+4*p2.y-p3.y)*u2+(-p0.y+3*p1.y-3*p2.y+p3.y)*u3));
}
export function waterwayPoint(index:number,t:number){return curvePoint(waterways[index],t);}
export function trailPoint(index:number,t:number){return curvePoint(trailways[index].map(([x,z])=>new Vector2(x,z)),t);}
export function riverPoint(t:number){return waterwayPoint(0,t);}
export function boundaryScale(theta:number){return 1+Math.sin(theta*3+.35)*.055+Math.sin(theta*5-1.1)*.035+Math.cos(theta*8+.4)*.018;}
export function boundaryPoint(theta:number,scale=1){const s=boundaryScale(theta)*scale;return new Vector2(Math.cos(theta)*WORLD_X*s,Math.sin(theta)*WORLD_Z*s);}
export function insideIsland(x:number,z:number,margin=0){const theta=Math.atan2(z/WORLD_Z,x/WORLD_X),normalized=Math.hypot(x/WORLD_X,z/WORLD_Z);return normalized<boundaryScale(theta)-margin/WORLD_Z;}
const waterSamples=waterways.map((_,w)=>Array.from({length:141},(_,i)=>waterwayPoint(w,i/140)));
const trailSamples=trailways.map((_,w)=>Array.from({length:101},(_,i)=>trailPoint(w,i/100)));
export function segmentDistance(x:number,z:number,points:Vector2[]){let best=Infinity;for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],dx=b.x-a.x,dz=b.y-a.y,l=dx*dx+dz*dz,t=l?Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.y)*dz)/l)):0;const ex=x-a.x-t*dx,ez=z-a.y-t*dz;best=Math.min(best,ex*ex+ez*ez);}return Math.sqrt(best);}
export function distanceToWaterway(x:number,z:number,index?:number){
 let best=Infinity;const from=index??0,to=index??waterways.length-1;
 for(let w=from;w<=to;w++)best=Math.min(best,segmentDistance(x,z,waterSamples[w]));
 return best;
}
export function distanceToRiver(x:number,z:number){return distanceToWaterway(x,z,0);}
export function distanceToTrail(x:number,z:number){let best=Infinity;for(let w=0;w<trailways.length;w++)best=Math.min(best,segmentDistance(x,z,trailSamples[w]));return best;}
export function riverX(z:number){let best=riverPoint(0),distance=Infinity;for(let i=0;i<=180;i++){const p=riverPoint(i/180),d=Math.abs(p.y-z);if(d<distance){distance=d;best=p;}}return best.x;}
export function isLakeIsland(x:number,z:number){return ((x-7.1)/1.35)**2+((z-5.2)/1.05)**2<1;}
export function isLake(x:number,z:number){return ((x-7)/5.2)**2+((z-5.1)/4.25)**2<1&&!isLakeIsland(x,z);}
export function isWetlandPond(x:number,z:number){return [new Vector2(13.5,13.4),new Vector2(17,14.2),new Vector2(11.5,15.4)].some((p,i)=>((x-p.x)/(1.55+i*.18))**2+((z-p.y)/(1+i*.14))**2<1);}
export function nearestWaterway(x:number,z:number,index:number){
 const points=waterSamples[index];let best=Infinity,t=0;
 for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],dx=b.x-a.x,dz=b.y-a.y,l=dx*dx+dz*dz,u=l?Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.y)*dz)/l)):0,d=Math.hypot(x-a.x-u*dx,z-a.y-u*dz);if(d<best){best=d;t=(i-1+u)/(points.length-1);}}
 return {distance:best,t,width:waterWidthAt(index,t)};
}
export function waterWidthAt(w:number,t:number){return waterWidths[w]*(.84+.19*Math.sin(t*16+w)+.13*Math.sin(t*37+.8))*(w===0?(.82+t*.35):1);}
export function sourceDistance(x:number,z:number){return Math.sqrt(((x+8.5)/1.5)**2+((z+16.05)/1.35)**2);}
export function inSource(x:number,z:number){return sourceDistance(x,z)<1 || (Math.abs(x+8.5)<.7&&z>=-16&&z<=-14.25);}
export function basinDistance(x:number,z:number){return Math.hypot((x+8.4)/1.55,(z+13.05)/1.75);}
export function isWater(x:number,z:number){if(isLakeIsland(x,z))return false;if(inSource(x,z)||basinDistance(x,z)<1||isLake(x,z)||isWetlandPond(x,z))return true;for(let i=0;i<waterways.length;i++){const n=nearestWaterway(x,z,i);if(n.distance<n.width)return true;}return false;}
export const clearings=[{x:-8.5,z:-14,r:3.5},{x:17,z:2,r:4.7},{x:-14,z:8,r:4.3},{x:17,z:-11,r:3.4},{x:-19,z:15.5,r:2.5},{x:-16,z:-12,r:2.5}];
export function inClearing(x:number,z:number){return clearings.some(c=>Math.hypot(x-c.x,z-c.z)<c.r);}
function noise(x:number,z:number){const ix=Math.floor(x),iz=Math.floor(z),u=x-ix,v=z-iz,fx=u*u*(3-2*u),fz=v*v*(3-2*v);const hash=(a:number,b:number)=>{const n=Math.sin(a*127.1+b*311.7+42)*43758.5453;return n-Math.floor(n);};return (hash(ix,iz)*(1-fx)+hash(ix+1,iz)*fx)*(1-fz)+(hash(ix,iz+1)*(1-fx)+hash(ix+1,iz+1)*fx)*fz;}
export function terrainNoise(x:number,z:number){let value=0,amp=.22,freq=.15;for(let i=0;i<4;i++){value+=(noise(x*freq,z*freq)-.5)*amp;freq*=2;amp*=.5;}return value;}
const bump=(x:number,z:number,cx:number,cz:number,sx:number,sz:number,h:number)=>h*Math.exp(-((x-cx)**2/sx+(z-cz)**2/sz));
const smooth=(v:number)=>{const t=Math.max(0,Math.min(1,v));return t*t*(3-2*t);};
function rawElevation(x:number,z:number){
 const theta=Math.atan2(z/WORLD_Z,x/WORLD_X),edge=smooth((boundaryScale(theta)-Math.hypot(x/WORLD_X,z/WORLD_Z))*WORLD_Z/2);
 let h=.42+.13*Math.sin(x*.29)*Math.cos(z*.25)+terrainNoise(x,z);
 h+=bump(x,z,-16,-12,75,52,2.55)+bump(x,z,17,-11,48,40,3.35)+bump(x,z,-8,-14,34,24,2.05)+bump(x,z,17,2,92,82,.9)+bump(x,z,-19,14,44,28,.72)+bump(x,z,-2,1,130,95,.5);
 h-=bump(x,z,-14,7,90,50,.22)+bump(x,z,13,14,70,40,.24);
 h*=.3+.7*edge;
 for(let i=0;i<waterways.length;i++){const n=nearestWaterway(x,z,i);const weight=1-smooth((n.distance-n.width*.72)/1.15);h=h*(1-weight)+(-.055+.08*Math.min(1,n.distance/n.width)**2)*weight;}
 const lake=Math.sqrt(((x-7)/5.2)**2+((z-5.1)/4.25)**2),island=Math.sqrt(((x-7.1)/1.35)**2+((z-5.2)/1.05)**2);
 if(lake<1.25){const w=(1-smooth((lake-.85)/.4))*smooth((island-.85)/.3);h=h*(1-w)+(-.11+.13*lake*lake)*w;}
 if(island<1.1){const w=1-smooth((island-.7)/.4);h=h*(1-w)+(.32+bump(x,z,7.1,5.2,3,2,.38))*w;}
 for(const [cx,cz,rx,rz] of [[13.5,13.4,1.55,1],[17,14.2,1.73,1.14],[11.5,15.4,1.91,1.28]]){const d=Math.hypot((x-cx)/rx,(z-cz)/rz),w=1-smooth((d-.8)/.5);h=h*(1-w)+.035*w;}
 const basin=basinDistance(x,z),bw=1-smooth((basin-.75)/.7);h=h*(1-bw)+.025*bw;
 const campWeight=1-smooth((Math.hypot(x+14,z-8)-3.6)/1.3);h=h*(1-campWeight)+.38*campWeight;
 const sd=sourceDistance(x,z),channel=Math.max(Math.abs(x+8.5)/.72,Math.abs(z+15.15)/.9),sw=1-smooth((Math.min(sd,channel)-.8)/.6);
 // Raised upstream pool and its banks form a visible source at the cliff lip.
 const beforeSource=h;const rise=1-smooth((Math.hypot((x+8.5)/2.5,(z+16)/2.2)-.75)/.6);h=h*(1-rise)+3.05*rise;h=h*(1-sw)+2.64*sw;if(Math.abs(x+8.5)<.65&&z>=-16&&z<=-14.4)h=2.64;if(z> -14.4)h=beforeSource;
 return Math.max(-.24,h);
}
export const GRID=.4;
const gridCache=new Map<string,number>();
export function gridHeight(ix:number,iz:number){const key=ix+','+iz;let h=gridCache.get(key);if(h===undefined){h=rawElevation(ix*GRID,iz*GRID);gridCache.set(key,h);}return h;}
// The same diagonal and barycentric interpolation are used by Terrain.tsx.
export function heightAt(x:number,z:number){const ix=Math.floor(x/GRID),iz=Math.floor(z/GRID),u=x/GRID-ix,v=z/GRID-iz,a=gridHeight(ix,iz),b=gridHeight(ix+1,iz),c=gridHeight(ix,iz+1),d=gridHeight(ix+1,iz+1);return u+v<=1?a+(b-a)*u+(c-a)*v:d+(c-d)*(1-u)+(b-d)*(1-v);}
export function biomeAt(x:number,z:number):Biome{
 if(Math.hypot(x+16,z+12)<8)return'pine';if(Math.hypot(x-17,z+11)<7)return'rocky';if(Math.hypot(x+14,z-7)<7)return'meadow';
 if(Math.hypot(x-13,z-14)<7)return'wetland';if(Math.hypot(x+19,z-14)<5)return'hidden';if(Math.hypot(x-17,z-2)<8)return'oldForest';
 if(Math.hypot(x+8,z+14)<4.5)return'waterfall';if(isLake(x,z)||isLakeIsland(x,z))return'lake';if(distanceToWaterway(x,z)<2.2)return'river';return'central';
}
