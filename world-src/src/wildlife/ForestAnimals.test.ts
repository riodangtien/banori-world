import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {Group,Mesh,BoxGeometry,MeshStandardMaterial} from 'three';
import {createForestMotion,forestSpecies} from './ForestAnimals';
import {animalZones} from '../world/layout';
import {AnimalController,safeAnimalPoint} from './behavior';
import {species} from '../game/WildlifeCapture';
import {validateSave,initial} from '../game/GameContext';
describe('ready-made forest wildlife',()=>{
 it('ships valid complete GLB assets and license records for each replacement model',()=>{const records=JSON.parse(readFileSync('public/world-assets/animals/forest-model-sources.json','utf8'));for(const name of forestSpecies){const data=readFileSync('public/world-assets/animals/'+name+'.glb');expect(data.subarray(0,4).toString()).toBe('glTF');expect(data.readUInt32LE(8)).toBe(data.length);const json=JSON.parse(data.subarray(20,20+data.readUInt32LE(12)).toString()),record=records.find((r:{id:string})=>r.id===name);expect(record.source).toContain('https://poly.pizza/m/');expect(record.license).toBe(name==='wolf'?'CC0 1.0':'CC-BY 3.0');expect(json.meshes.length).toBeGreaterThan(0);if(name==='wolf')for(const clip of ['Idle','Walk','Eating'])expect(json.animations.some((a:{name:string})=>a.name===clip)).toBe(true);else expect(json.materials.some((m:{pbrMetallicRoughness?:{baseColorFactor?:number[];baseColorTexture?:unknown}})=>m.pbrMetallicRoughness?.baseColorTexture!==undefined||m.pbrMetallicRoughness?.baseColorFactor?.length===4)).toBe(true);}});
 it('has safe dedicated habitats and preserves the former seven-species save',()=>{for(let z=14;z<animalZones.length;z++){const c=new AnimalController(z,47023);expect(safeAnimalPoint(z,c.x,c.z)).toBe(true);for(let n=0;n<500;n++){c.advance(.05);expect(safeAnimalPoint(z,c.x,c.z)).toBe(true);}}const old={...initial,phase:'find',ids:initial.ids.slice(0,7)};expect(validateSave(old)?.ids).toHaveLength(species.length);const complete={...old,phase:'complete',mission:6,xp:210,results:old.ids.map((id,i)=>({id,species:species[i],skill:'Maths',attempts:0,xp:30}))};expect(validateSave(complete)?.phase).toBe('find');expect(validateSave(complete)?.mission).toBe(7);});
});

describe('living expanded habitats',()=>{
 it('gives every habitat a valid moving route rather than a permanently idle animal',()=>{for(let zone=0;zone<animalZones.length;zone++){const c=new AnimalController(zone,47023+zone),x=c.x,z=c.z;let distance=0;for(let n=0;n<2400;n++){c.advance(.05);distance=Math.max(distance,Math.hypot(c.x-x,c.z-z));}expect(distance,animalZones[zone].species+' zone '+zone).toBeGreaterThan(.15);}},20000);
});

it('deforms only an individual copy and restores its static artwork at rest',()=>{const source=new BoxGeometry(.4,1,.8).translate(0,.5,0),model=new Group(),mesh=new Mesh(source,new MeshStandardMaterial());model.add(mesh);const original=Array.from(source.attributes.position.array),motion=createForestMotion(model,'bear');motion.update(.2,true);expect(Array.from(mesh.geometry.attributes.position.array)).not.toEqual(original);expect(Array.from(source.attributes.position.array)).toEqual(original);motion.update(1,false);expect(Array.from(mesh.geometry.attributes.position.array)).toEqual(original);motion.dispose();source.dispose();mesh.material.dispose();});
