import {Box3,Camera,Object3D,Raycaster,Scene,Vector3} from 'three';
import type {CaptureStatus} from './GameContext';
export const species=['deer','fox','rabbit','frog','bird','butterfly','fish','wolf','bear','boar','badger','squirrel'] as const;
export type Species=typeof species[number];
export const speciesNames=['Deer','Fox','Rabbit','Frog','Bird','Butterfly','Fish','Wolf','Bear','Wild boar','Badger','Squirrel'];
export type AnimalTarget={species:Species;position:{x:number;y:number;z:number};object:Object3D};
export function animalSpecies(o:Object3D|null):Species|null{while(o){const value=o.name.replace('wildlife-','');if(species.includes(value as Species))return value as Species;o=o.parent;}return null;}
export function animalTargets(scene:Scene):AnimalTarget[]{const targets:AnimalTarget[]=[];scene.traverse(o=>{if(!o.name.startsWith('wildlife-'))return;const name=animalSpecies(o);if(!name||!o.visible)return;const box=new Box3().setFromObject(o);if(box.isEmpty())return;const p=box.getCenter(new Vector3());targets.push({species:name,position:{x:p.x,y:p.y,z:p.z},object:o});});return targets;}
function ignored(o:Object3D){while(o){if(!o.visible||o.name==='playable-explorer'||o.name==='photo-camera'||o.name==='expedition-sky'||o.userData.captureIgnore||o.name==='world-water')return true;o=o.parent!;}return false;}
export function assessAnimal(camera:Camera,scene:Scene,completed:readonly string[]=[]):{status:CaptureStatus;target?:AnimalTarget}{
 const direction=camera.getWorldDirection(new Vector3()),targets=animalTargets(scene).map(t=>{const delta=new Vector3(t.position.x,t.position.y,t.position.z).sub(camera.position);return{t,distance:delta.length(),dot:direction.dot(delta.normalize())};}).filter(t=>t.dot>.985).sort((a,b)=>Number(a.distance>8)-Number(b.distance>8)||b.dot-a.dot);
 if(!targets.length)return{status:'NOT_CENTERED'};
 const {t,distance}=targets[0];if(distance>8)return{status:'TOO_FAR',target:t};
 const delta=new Vector3(t.position.x,t.position.y,t.position.z).sub(camera.position).normalize();
 const hits=new Raycaster(camera.position,delta,.05,distance).intersectObjects(scene.children,true).filter(h=>!ignored(h.object));
 if(hits[0]&&animalSpecies(hits[0].object)!==t.species)return{status:'OCCLUDED',target:t};
 if(completed.includes(t.species))return{status:'WRONG_TARGET',target:t};
 return{status:'SUCCESS',target:t};
}
