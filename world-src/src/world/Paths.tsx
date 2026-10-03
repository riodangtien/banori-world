import { useEffect,useMemo } from 'react';
import { BufferGeometry,Float32BufferAttribute,Vector2 } from 'three';
import { GRID,heightAt,insideIsland,isWater,segmentDistance,trailPoint,trailways } from './map';
import { bridges } from './layout';
import { bridgeCoordinates } from './bridgeSurface';
function clip(poly:Vector2[],distance:(p:Vector2)=>number){const result:Vector2[]=[];for(let i=0;i<poly.length;i++){const v=poly[i],w=poly[(i+1)%poly.length],a=distance(v),b=distance(w);if(a>=0)result.push(v);if((a>=0)!==(b>=0))result.push(v.clone().lerp(w,a/(a-b)));}return result;}
function clearBridgeFootprints(poly:Vector2[]){let pieces=[poly];for(const bridge of bridges){const end=bridge.length/2+bridge.ramp;pieces=pieces.flatMap(piece=>{if(piece.length<3)return[];const coords=piece.map(p=>bridgeCoordinates(bridge,p.x,p.y));if(coords.every(p=>p.side>.65)||coords.every(p=>p.side<-.65)||coords.every(p=>p.along>end)||coords.every(p=>p.along<-end))return[piece];let remaining=piece;const outside:Vector2[][]=[];for(const plane of [(p:Vector2)=>bridgeCoordinates(bridge,p.x,p.y).side-.65,(p:Vector2)=>-bridgeCoordinates(bridge,p.x,p.y).side-.65,(p:Vector2)=>bridgeCoordinates(bridge,p.x,p.y).along-end,(p:Vector2)=>-bridgeCoordinates(bridge,p.x,p.y).along-end]){const part=clip(remaining,plane);if(part.length>=3)outside.push(part);remaining=clip(remaining,p=>-plane(p));}return outside;});}return pieces;}
export function buildPaths(){
 const trails=trailways.map((_,w)=>Array.from({length:121},(_,i)=>trailPoint(w,i/120))),positions:number[]=[],cache=new Map<string,number>();
 const field=(v:Vector2)=>{const key=v.x+','+v.y,known=cache.get(key);if(known!==undefined)return known;let f=Math.max(...trails.map((points,w)=>(w===0?.55:w===2?.34:.42)-segmentDistance(v.x,v.y,points)));
  for(const b of bridges){const p=bridgeCoordinates(b,v.x,v.y),end=b.length/2+b.ramp; // Short dry connectors align curved trails with straight bridge entrances.
   if(Math.abs(p.along)>end&&Math.abs(p.along)<end+.8)f=Math.max(f,.55-Math.abs(p.side));
  }
  if(isWater(v.x,v.y)||!insideIsland(v.x,v.y,.1))f=Math.min(f,-.01);cache.set(key,f);return f;
 };
 // Clip one union of all paths to the terrain's exact triangles: no stacked junctions or long chords through hills.
 for(let ix=-72;ix<72;ix++)for(let iz=-57;iz<57;iz++){const a=new Vector2(ix*GRID,iz*GRID),b=new Vector2((ix+1)*GRID,iz*GRID),c=new Vector2(ix*GRID,(iz+1)*GRID),d=new Vector2((ix+1)*GRID,(iz+1)*GRID);for(const tri of [[a,c,b],[b,c,d]]){const poly:Vector2[]=[];for(let i=0;i<3;i++){const v=tri[i],w=tri[(i+1)%3],fv=field(v),fw=field(w);if(fv>=0)poly.push(v);if((fv>=0)!==(fw>=0))poly.push(v.clone().lerp(w,fv/(fv-fw)));}for(const piece of clearBridgeFootprints(poly))for(let i=1;i<piece.length-1;i++)for(const v of [piece[0],piece[i],piece[i+1]])positions.push(v.x,heightAt(v.x,v.y)+.028,v.y);}}
 const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(positions,3));g.computeVertexNormals();return g;
}
export function Paths(){const geometry=useMemo(buildPaths,[]);useEffect(()=>()=>geometry.dispose(),[geometry]);return <mesh geometry={geometry} receiveShadow><meshStandardMaterial color="#c5ae7c" roughness={1} polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-1}/></mesh>;}
