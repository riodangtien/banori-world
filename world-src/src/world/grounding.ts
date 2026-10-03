import { Box3,Object3D,Quaternion,Vector3 } from 'three';
import { heightAt,insideIsland,isWater,distanceToTrail } from './map';
export const getTerrainHeight=heightAt;
export function terrainNormal(x:number,z:number){const e=.08;return new Vector3(heightAt(x-e,z)-heightAt(x+e,z),2*e,heightAt(x,z-e)-heightAt(x,z+e)).normalize();}
export function snapToTerrain(object:Object3D,embed=0){object.position.y=heightAt(object.position.x,object.position.z)-embed;}
export function alignToTerrainNormal(object:Object3D){object.quaternion.copy(new Quaternion().setFromUnitVectors(new Vector3(0,1,0),terrainNormal(object.position.x,object.position.z)));}
export function groundObjectFromBoundingBox(object:Object3D,embed=0){object.updateMatrixWorld(true);const b=new Box3().setFromObject(object);const heights=[heightAt(b.min.x,b.min.z),heightAt(b.max.x,b.min.z),heightAt(b.min.x,b.max.z),heightAt(b.max.x,b.max.z),heightAt((b.min.x+b.max.x)/2,(b.min.z+b.max.z)/2)];object.position.y+=Math.max(...heights)-b.min.y-embed;object.updateMatrixWorld(true);return b;}
export type Footprint={id:string;x:number;z:number;r:number;y?:number;kind:string};
export function validatePlacement(p:Footprint,objects:Footprint[],road=true){if(![p.x,p.z,p.r,p.y??0].every(Number.isFinite))return 'invalid transform';if(!insideIsland(p.x,p.z,p.r+.25))return 'outside terrain';const samples=[[0,0],[p.r,0],[-p.r,0],[0,p.r],[0,-p.r]];if(samples.some(([x,z])=>isWater(p.x+x,p.z+z)))return 'water';if(road&&distanceToTrail(p.x,p.z)<p.r+.57)return 'trail';if(objects.some(o=>o.id!==p.id&&Math.hypot(p.x-o.x,p.z-o.z)<p.r+o.r+.08))return 'intersection';return null;}
