import { BoxGeometry,BufferGeometry,Float32BufferAttribute,CylinderGeometry,DodecahedronGeometry,Matrix4,MeshStandardMaterial,Quaternion,Vector3 } from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
export type V=[number,number,number];
// Static structures are baked into material batches, keeping tiny storytelling props inexpensive.
export class Builder{parts=new Map<string,BufferGeometry[]>();add(g:BufferGeometry,color:string,p:V,scale:V=[1,1,1],q=new Quaternion()){if(g.index){const original=g;g=g.toNonIndexed();original.dispose();}if(!g.attributes.uv)g.setAttribute('uv',new Float32BufferAttribute(new Float32Array(g.attributes.position.count*2),2));g.applyMatrix4(new Matrix4().compose(new Vector3(...p),q,new Vector3(...scale)));const list=this.parts.get(color)??[];list.push(g);this.parts.set(color,list);}
 box(p:V,size:V,color:string,rotation=0){this.add(new BoxGeometry(...size),color,p,[1,1,1],new Quaternion().setFromAxisAngle(new Vector3(0,1,0),rotation));}
 beam(a:V,b:V,width:number,color:string){const d=new Vector3(...b).sub(new Vector3(...a)),p=new Vector3(...a).addScaledVector(d,.5);this.add(new BoxGeometry(width,d.length(),width),color,p.toArray() as V,[1,1,1],new Quaternion().setFromUnitVectors(new Vector3(0,1,0),d.normalize()));}
 cylinder(a:V,b:V,r:number,color:string,top=r){const d=new Vector3(...b).sub(new Vector3(...a)),p=new Vector3(...a).addScaledVector(d,.5);this.add(new CylinderGeometry(top,r,d.length(),8),color,p.toArray() as V,[1,1,1],new Quaternion().setFromUnitVectors(new Vector3(0,1,0),d.normalize()));}
 rock(p:V,size:V,color:string,rotation=0){this.add(new DodecahedronGeometry(1,0),color,p,size,new Quaternion().setFromAxisAngle(new Vector3(0,1,0),rotation));}
 finish(){return [...this.parts].map(([color,parts])=>{const geometry=mergeGeometries(parts,false)!;parts.forEach(p=>p.dispose());return{geometry,material:new MeshStandardMaterial({color,roughness:.93,flatShading:true})};});}}
