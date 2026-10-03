import { bridgeStrip,bridgeSurfaceY } from './bridgeSurface';
import { useEffect,useMemo,useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { BufferGeometry,Float32BufferAttribute,Box3,CatmullRomCurve3,Mesh,MeshStandardMaterial,Vector3,TubeGeometry } from 'three';
import { Builder,type V } from './geometry';
import { heightAt } from './map';
import { groundObjectFromBoundingBox } from './grounding';
import { bridges } from './layout';
import type { Settings } from '../environment/settings';
const wood='#825d3e',lightwood='#bd945e',dark='#544735',stone='#77816e',yellow='#e8c257';
function Model({x,z,width,rotation=0}:{x:number;z:number;width:number;rotation?:number}){const {scene}=useGLTF(import.meta.env.BASE_URL+'world-assets/structures/tent_detailedOpen.glb');const model=useMemo(()=>{const copy=scene.clone(true),box=new Box3().setFromObject(copy),size=box.getSize(new Vector3()),center=box.getCenter(new Vector3()),s=width/Math.max(size.x,size.z);copy.scale.setScalar(s);copy.position.set(x-center.x*s,-box.min.y*s,z-center.z*s);copy.rotation.y=rotation;copy.traverse(o=>{if(o instanceof Mesh){const m=(Array.isArray(o.material)?o.material[0]:o.material) as MeshStandardMaterial;o.material=new MeshStandardMaterial({color:m.name.includes('wood')?wood:m.name.includes('rope')?'#d3bc87':'#e0ca91',roughness:1,flatShading:true});o.castShadow=true;o.receiveShadow=true;}});groundObjectFromBoundingBox(copy,.035);return copy;},[scene,x,z,width,rotation]);useEffect(()=>()=>model.traverse(o=>{if(o instanceof Mesh)(o.material as MeshStandardMaterial).dispose();}),[model]);return <primitive object={model}/>;}
function sign(b:Builder,x:number,z:number,angle=0){const y=heightAt(x,z);b.box([x,y+.7,z],[.11,1.5,.11],wood);b.box([x,y+1.27,z],[.85,.25,.1],yellow,angle);b.box([x+.16,y+1.0,z],[.65,.21,.1],lightwood,angle);}
function crate(b:Builder,x:number,z:number,s=.5){const y=heightAt(x,z)+s/2;b.box([x,y,z],[s,s,s],lightwood);for(const dx of [-1,1]){b.box([x+dx*s*.43,y,z],[.06,s+.02,s+.02],wood);b.box([x,y+dx*s*.43,z],[s+.02,.05,s+.02],wood);}}
function lantern(b:Builder,x:number,y:number,z:number){b.box([x,y,z],[.17,.23,.17],'#f2c966');for(const dx of [-.09,.09])b.box([x+dx,y,z],[.025,.3,.2],dark);b.box([x,y+.17,z],[.24,.055,.24],dark);}
export function buildLandmarks(){const b=new Builder();
 // Lookout: individually seated stone footings, load-bearing posts, crossed braces and stairs with stringers.
 const x=17,z=-11,ground=heightAt(x,z),floor=ground+2.35,span=1.04;
 for(const dx of [-span,span])for(const dz of [-span,span]){const foot=heightAt(x+dx,z+dz);b.rock([x+dx,foot+.12,z+dz],[.35,.32,.35],stone,dx);b.box([x+dx,(foot+.25+floor+1.4)/2,z+dz],[.22,floor+1.4-foot-.25,.22],wood);b.box([x+dx,foot+.34,z+dz],[.32,.14,.32],dark);}
 for(const side of [-span,span]){b.beam([x-span,ground+.65,z+side],[x+span,floor-.18,z+side],.12,lightwood);b.beam([x+span,ground+.65,z+side],[x-span,floor-.18,z+side],.12,lightwood);b.beam([x+side,ground+.65,z-span],[x+side,floor-.18,z+span],.12,wood);}
 for(const dz of [-span,span])b.box([x,floor-.16,z+dz],[2.5,.24,.19],wood);
 for(let i=0;i<12;i++)b.box([x-1.13+i*.205,floor,z],[.19,.14,2.45],lightwood);
 // Three complete railings; front railing leaves an entrance aligned to the landing.
 for(const dy of [.5,.94]){b.box([x,floor+dy,z-span],[2.22,.09,.09],wood);for(const side of [-1,1])b.box([x+side*span,floor+dy,z],[.09,.09,2.22],wood);for(const side of [-1,1])b.box([x+side*.82,floor+dy,z+span],[.52,.09,.09],wood);}
 for(const dz of [-span,span])for(const dx of [-.5,0,.5])if(dz<0)b.box([x+dx,floor+.47,z+dz],[.06,.9,.06],lightwood);
 // Ground-to-platform stairway, not floating ladder rungs.
 const bottomZ=z+3.9,bottom=heightAt(x,bottomZ),landingZ=z+1.55,steps=11;
 b.box([x,floor,landingZ],[1.06,.14,.85],lightwood);
 for(const dx of [-.47,.47]){b.beam([x+dx,bottom+.02,bottomZ],[x+dx,floor-.12,landingZ],.16,wood);b.beam([x+dx,bottom+.88,bottomZ],[x+dx,floor+.88,landingZ],.075,wood);b.box([x+dx,(heightAt(x+dx,landingZ)+floor)/2,landingZ],[.14,floor-heightAt(x+dx,landingZ),.14],wood);}
 for(let i=0;i<steps;i++){const t=(i+1)/steps,sy=bottom+(floor-bottom)*t,sz=bottomZ+(landingZ-bottomZ)*t;b.box([x,sy-.07,sz],[.95,.14,.34],lightwood);if(i%3===0)for(const dx of [-.47,.47])b.box([x+dx,sy+.4,sz],[.065,.8,.065],wood);}
 // Compact pitched roof with four real roof posts and ridge/rafters.
 const roofY=floor+1.48,ridge=roofY+.58;
 for(const dx of [-1,1]){b.beam([x+dx*1.3,roofY,z-1.3],[x,ridge,z-1.3],.1,wood);b.beam([x+dx*1.3,roofY,z+1.3],[x,ridge,z+1.3],.1,wood);}
 b.beam([x,ridge,z-1.4],[x,ridge,z+1.4],.1,wood);
 for(let i=0;i<13;i++)for(const side of [-1,1])b.beam([x,ridge,z-1.3+i*.21],[x+side*1.34,roofY-.04,z-1.3+i*.21],.23,'#a9824e');
 b.cylinder([x,ridge,z],[x,ridge+1.1,z],.035,dark);b.box([x+.33,ridge+.87,z],[.64,.32,.025],yellow);
 crate(b,x+1.9,z+.4,.52);sign(b,19,-8.1,-.2);lantern(b,16.5,floor+.35,-10.35);
 // A rope coil and rocky trail markers on the landing's surroundings.
 for(let i=0;i<9;i++){const a=i/9*6.283;b.cylinder([18.6+Math.cos(a)*.2,heightAt(18.6,-10.4)+.07,-10.4+Math.sin(a)*.2],[18.6+Math.cos(a+.7)*.2,heightAt(18.6,-10.4)+.07,-10.4+Math.sin(a+.7)*.2],.035,'#c8b587');}
 // Explorer camp: three tents face the shared fire clearing; supplies and protection details have a purpose.
 const fireX=-14,fireZ=8.4,fireY=heightAt(fireX,fireZ);
 for(let i=0;i<11;i++){const a=i/11*6.283;b.rock([fireX+Math.cos(a)*.55,fireY+.05,fireZ+Math.sin(a)*.55],[.17,.13,.16],stone,a);}
 for(const a of [.5,2.1])b.cylinder([fireX-Math.cos(a)*.36,fireY+.1,fireZ-Math.sin(a)*.36],[fireX+Math.cos(a)*.36,fireY+.15,fireZ+Math.sin(a)*.36],.07,dark);
 for(const [cx,cz,angle] of [[-12.75,9.4,-.3],[-15.3,9.4,.3]]){const y=heightAt(cx,cz);b.box([cx,y+.4,cz],[1.15,.16,.32],lightwood,angle);for(const dx of [-.42,.42])b.box([cx+dx,y+.18,cz],[.13,.36,.28],wood);}
 for(const [cx,cz] of [[-11.3,7],[-11.9,6.9],[-16.8,8.7]])crate(b,cx,cz,.52);
 for(const [cx,cz] of [[-11.4,7.9],[-11.8,8.05]]){const y=heightAt(cx,cz);b.cylinder([cx,y,cz],[cx,y+.7,cz],.25,lightwood,.23);for(const h of [.15,.55])b.cylinder([cx,y+h-.025,cz],[cx,y+h+.025,cz],.257,dark);}
 const tx=-12.1,tz=6,ty=heightAt(tx,tz);b.box([tx,ty+.78,tz],[1.5,.12,.7],lightwood);for(const dx of [-.6,.6])for(const dz of [-.25,.25])b.box([tx+dx,ty+.36,tz+dz],[.08,.72,.08],wood);
 b.box([tx,ty+.85,tz],[.7,.035,.44],'#d6d7ad');b.box([tx+.1,ty+.87,tz],[.07,.012,.35],'#679da5');b.box([tx-.26,ty+.87,tz-.1],[.14,.015,.13],'#759a59');
 // Board displays a map, supply crates carry a yellow guardian mark, packs have straps.
 const by=heightAt(-11.2,5.4);for(const dx of [-.42,.42])b.box([-11.2+dx,by+.75,5.4],[.09,1.5,.09],wood);b.box([-11.2,by+1.25,5.4],[1.1,.74,.09],lightwood);b.box([-11.2,by+1.25,5.46],[.85,.52,.025],'#d3d6aa');b.beam([-11.52,by+1.1,5.48],[-10.9,by+1.4,5.48],.06,'#6a9caa');
 for(const [cx,cz] of [[-16,7.2],[-12.6,5.8]]){const y=heightAt(cx,cz);b.rock([cx,y+.26,cz],[.22,.3,.18],'#637956');b.box([cx+.16,y+.24,cz+.12],[.045,.4,.04],dark);b.box([cx-.16,y+.24,cz+.12],[.045,.4,.04],dark);}
 for(let i=0;i<6;i++){const cy=heightAt(-16.8,9.5)+(i>2?.23:.08);b.cylinder([-17.2,cy,9.3+(i%3)*.18],[-16.5,cy,9.3+(i%3)*.18],.08,wood);}
 sign(b,-12,4.9);const ly=heightAt(-12.8,8.2);b.box([-12.8,ly+.88,8.2],[.07,1.76,.07],dark);b.beam([-12.8,ly+1.73,8.2],[-12.55,ly+1.73,8.2],.07,dark);lantern(b,-12.55,ly+1.5,8.2);
 // Protected sapling, observation birdhouse and drinking bowl along the camp edge.
 const sx=-16.6,sz=6,sy=heightAt(sx,sz);for(const dx of [-.5,.5])for(const dz of [-.5,.5])b.box([sx+dx,heightAt(sx+dx,sz+dz)+.3,sz+dz],[.065,.66,.065],wood);for(const side of [-.5,.5]){b.beam([sx-.5,sy+.44,sz+side],[sx+.5,sy+.44,sz+side],.05,lightwood);b.beam([sx+side,sy+.44,sz-.5],[sx+side,sy+.44,sz+.5],.05,lightwood);}b.cylinder([sx,sy-.05,sz],[sx,sy+.8,sz],.05,wood);b.rock([sx,sy+.94,sz],[.3,.35,.28],'#83a757');
 b.cylinder([-17.2,heightAt(-17.2,7),7],[-17.2,heightAt(-17.2,7)+1.7,7],.07,wood);b.box([-17.2,heightAt(-17.2,7)+1.75,7],[.42,.4,.3],lightwood);b.rock([-17.2,heightAt(-17.2,7)+1.78,7.16],[.055,.055,.015],dark);b.box([-17.2,heightAt(-17.2,7)+2,7],[.52,.09,.4],yellow);
 b.cylinder([-16.7,heightAt(-16.7,7.6),7.6],[-16.7,heightAt(-16.7,7.6)+.1,7.6],.23,stone);b.cylinder([-16.7,heightAt(-16.7,7.6)+.101,7.6],[-16.7,heightAt(-16.7,7.6)+.115,7.6],.18,'#81bfc3');
 // Tropical BANORI accent: broad folded banana leaves and a small yellow bunch.
 const bx=-16.8,bz=10.3,by2=heightAt(bx,bz);b.cylinder([bx,by2-.04,bz],[bx,by2+1.4,bz],.095,'#929b4d',.065);
 for(let i=0;i<6;i++){const angle=i/6*6.283,verts:number[]=[],point=(t:number,side:number)=>{const length=.9,rad=t*length,width=Math.sin(t*Math.PI)*.17;return[bx+Math.cos(angle)*rad+Math.sin(angle)*width*side,by2+1.42+Math.sin(t*Math.PI)*.23-t*.36-(side? .04:0),bz+Math.sin(angle)*rad-Math.cos(angle)*width*side];};for(let j=0;j<5;j++){const t=j/5,tn=(j+1)/5;for(const side of [-1,1])verts.push(...point(t,0),...point(tn,0),...point(t,side),...point(t,side),...point(tn,0),...point(tn,side));}const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(verts,3));g.computeVertexNormals();b.add(g,i%2?'#6c924d':'#83a757',[0,0,0]);}for(let i=0;i<3;i++){const curve=new CatmullRomCurve3([new Vector3(bx+.13+i*.045,by2+1.1,bz+.08),new Vector3(bx+.18+i*.045,by2+.98,bz+.12),new Vector3(bx+.14+i*.045,by2+.88,bz+.1)]);b.add(new TubeGeometry(curve,5,.03,5,false),yellow,[0,0,0]);}
 // The guardian trunk begins below the lowest ground contact, with terrain-conforming roots.
 const hx=17,hz=2,hy=heightAt(hx,hz);b.cylinder([hx,hy-.18,hz],[hx+.08,hy+4.7,hz],.78,'#725333',.46);
 for(let i=0;i<7;i++){const a=i/7*6.283,len=2.4+(i%3)*.35,points:Vector3[]=[];for(let j=0;j<5;j++){const t=j/4,rx=hx+Math.cos(a+.12*Math.sin(t*3))*len*t,rz=hz+Math.sin(a+.12*Math.sin(t*3))*len*t;points.push(new Vector3(rx,heightAt(rx,rz)+(.22*(1-t)-.11*t),rz));}b.add(new TubeGeometry(new CatmullRomCurve3(points),12,.18-(i%2)*.035,6,false),'#725333',[0,0,0]);const ex=hx+Math.cos(a)*len,ez=hz+Math.sin(a)*len;b.rock([ex,heightAt(ex,ez)+.03,ez],[.33,.25,.3],stone,a);}
 for(let i=0;i<8;i++){const a=i/8*6.283,dx=Math.cos(a)*(i%2?1.8:1.4),dz=Math.sin(a)*(i%2?1.8:1.4),cy=hy+3.1+(i%3)*.65;b.cylinder([hx,hy+2.1,hz],[hx+dx,cy,hz+dz],.22,'#725333',.1);b.rock([hx+dx,cy+.55,hz+dz],[1.2,1.1,1.12],i%3===0?'#d8b257':i%3===1?'#c79f45':'#b7a452',a);}b.rock([hx,hy+4.6,hz],[1.35,1.13,1.3],'#e0ba62');
 // Humid root micro-scenes: a few fern fronds and mushrooms, not a carpet.
 for(let i=0;i<18;i++){const a=i*2.4,d=1.6+(i%4)*.36,cx=hx+Math.cos(a)*d,cz=hz+Math.sin(a)*d,y=heightAt(cx,cz);if(i%3===0){b.cylinder([cx,y,cz],[cx,y+.13,cz],.025,'#dbd4b0');b.rock([cx,y+.16,cz],[.105,.06,.105],'#b97346');}else for(let j=0;j<3;j++)b.rock([cx+(j-1)*.07,y+.1,cz],[.1,.19,.03],'#6c924d',a+j);}
 // Solid bridge surfaces and continuous bank ramps share the player's height profile.
 for(const br of bridges){const dir=new Vector3(Math.sin(br.angle),0,Math.cos(br.angle)),normal=new Vector3(dir.z,0,-dir.x),at=(t:number,side=0,y=br.y):V=>[br.x+dir.x*t+normal.x*side,y,br.z+dir.z*t+normal.z*side];
  const half=br.length/2,total=br.length+br.ramp*2,count=Math.ceil(total/.16);for(let i=0;i<count;i++){const a=-half-br.ramp+i*total/count,c=-half-br.ramp+(i+1)*total/count;b.add(bridgeStrip(br,a,c),i%3===0?'#c5a160':lightwood,[0,0,0]);}
  for(const side of [-.57,.57]){b.beam(at(-half,side,br.y-.12),at(half,side,br.y-.12),.12,wood);const postCount=Math.max(1,Math.ceil(br.length/1.3));for(let i=0;i<=postCount;i++){const t=-half+i*br.length/postCount,p=at(t,side),floor=heightAt(p[0],p[2]);b.box([p[0],(floor+br.y+.8)/2,p[2]],[.09,br.y+.8-floor,.09],wood);}b.beam(at(-half,side,br.y+.72),at(half,side,br.y+.72),.075,wood);
   for(const end of [-1,1]){let prev=at(end*half,side,br.y+.72);for(let i=1;i<=8;i++){const t=end*(half+br.ramp*i/8),p=at(t,side,bridgeSurfaceY(br,t,side)+.655);b.beam(prev,p,.075,wood);prev=p;}const t=end*(half+br.ramp),p=at(t,side,bridgeSurfaceY(br,t,side));b.box([p[0],p[1]+.33,p[2]],[.09,.66,.09],wood);}
  }
 }
 // Cliff framing sits beside the source and basin, leaving the lip visibly open.
 for(const side of [-1,1])for(let i=0;i<4;i++){const cx=-8.5+side*(1.32+i*.35),cz=-14.3-(i%2)*.6,y=heightAt(cx,cz);b.rock([cx,y-.12,cz],[.6,.7,.65],i%2?'#69766a':'#83917b',i*.7);}
 for(let i=0;i<12;i++){const a=i/12*6.283,cx=-8.4+Math.cos(a)*1.7,cz=-12.8+Math.sin(a)*1.55;if(cz>-11.8||(cz< -13.65&&Math.abs(cx+8.5)<1.15))continue;b.rock([cx,heightAt(cx,cz)+.02,cz],[.32,.3,.32],'#60756c',a);}
 // Sanctuary is a quiet protected glade rather than unexplained columns.
 sign(b,-19.6,14.5);const gy=heightAt(-19,15.5);b.box([-19,gy+.35,15.7],[1.6,.15,.37],lightwood);for(const dx of [-.6,.6])b.box([-19+dx,gy+.13,15.7],[.18,.3,.27],wood);
 return b.finish();}
export function Landmarks({settings}:{settings:Settings}){const batches=useMemo(buildLandmarks,[]),flame=useRef<Mesh>(null!),clock=useRef(0);useEffect(()=>()=>batches.forEach(b=>{b.geometry.dispose();b.material.dispose();}),[batches]);useFrame((_,d)=>{if(!settings.paused)clock.current+=Math.min(d,.05);if(flame.current)flame.current.scale.set(.9+Math.sin(clock.current*5)*.1,1+Math.sin(clock.current*8)*.13,.9);});const fy=heightAt(-14,8.4);return <group>{batches.map((b,i)=><mesh key={i} geometry={b.geometry} material={b.material} castShadow receiveShadow/>)}<Model x={-14} z={6.1} width={2.5}/><Model x={-16.2} z={8.2} width={1.65} rotation={.65}/><Model x={-12.4} z={10.1} width={1.65} rotation={-1.1}/><mesh ref={flame} position={[-14,fy+.37,8.4]}><coneGeometry args={[.21,.58,6]}/><meshStandardMaterial color="#ffd083" emissive="#ec863a" emissiveIntensity={settings.night?2:.8}/></mesh>{settings.night&&<><pointLight position={[-14,fy+1,8.4]} color="#ffbd72" intensity={8} distance={8} decay={2}/><pointLight position={[17,heightAt(17,-11)+2.8,-11]} color="#ffcb87" intensity={3} distance={5}/><pointLight position={[-12.55,heightAt(-12.8,8.2)+1.5,8.2]} color="#ffc67b" intensity={2} distance={4}/></>}</group>;}
