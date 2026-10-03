import { bridgeCoordinates,bridgeSurfaceY } from '../world/bridgeSurface';
import { bridges,worldLayout } from '../world/layout';
import { heightAt,insideIsland,isWater } from '../world/map';
export type WorldMode='explore'|'transitioningToPlay'|'play'|'transitioningToExplore';
export type Input={moveX:number;moveY:number;jump:boolean;run:boolean;cameraX:number;cameraY:number};
export const emptyInput=():Input=>({moveX:0,moveY:0,jump:false,run:false,cameraX:0,cameraY:0});
export type Obstacle={x:number;z:number;r:number;height:number;kind:'tree'|'rock'|'log'|'structure'};
const structures=[[-14,6.1,1.15,1.5],[-16.2,8.2,.85,1.4],[-12.4,10.1,.8,1.4],[-14,8.4,.42,.45],[-12.75,9.4,.4,.3],[-15.3,9.4,.4,.3],[-12.1,6,.65,.8],[-11.3,7,.28,.5],[-11.4,7.9,.28,.5],[-16.6,6,.5,1],[17,2,1.2,8],[17,-11,1.45,8],[-19,15.7,.6,2]];
export const obstacles:Obstacle[]=[...worldLayout.trees.map(p=>({x:p.x,z:p.z,r:.13*p.s,height:4*p.s,kind:'tree' as const})),...worldLayout.rocks.filter(p=>p.s>.42).map(p=>({x:p.x,z:p.z,r:p.r*.65,height:p.s*.65,kind:'rock' as const})),...worldLayout.logs.map(p=>({x:p.x,z:p.z,r:p.r*.5,height:p.s*.32,kind:'log' as const})),...structures.map(([x,z,r,height])=>({x,z,r,height,kind:'structure' as const}))];
export const colliders=obstacles.map(o=>[o.x,o.z,o.r]);
export function bridgeHeight(x:number,z:number){for(const b of bridges){const p=bridgeCoordinates(b,x,z);if(Math.abs(p.side)<.65&&Math.abs(p.along)<=b.length/2+b.ramp)return bridgeSurfaceY(b,p.along,p.side);}return null;}
export const groundAt=(x:number,z:number)=>bridgeHeight(x,z)??heightAt(x,z);
export function blocks(o:Obstacle,x:number,z:number,r:number,feetY:number){return o.height>.32&&feetY<groundAt(o.x,o.z)+o.height-.08&&Math.hypot(x-o.x,z-o.z)<r+o.r;}
export function canStand(x:number,z:number,r=.21,feetY=groundAt(x,z)){if(!insideIsland(x,z,r+.35))return false;for(const [dx,dz] of [[0,0],[r,0],[-r,0],[0,r],[0,-r]])if(isWater(x+dx,z+dz)&&bridgeHeight(x+dx,z+dz)===null)return false;return !obstacles.some(o=>blocks(o,x,z,r,feetY));}
export function floorAt(x:number,z:number,feetY:number){let floor=groundAt(x,z);for(const o of obstacles)if((o.kind==='rock'||o.kind==='log')&&Math.hypot(x-o.x,z-o.z)<o.r+.08){const top=groundAt(o.x,o.z)+o.height;if(feetY>=top-.12)floor=Math.max(floor,top);}return floor;}
export function findSpawn(){for(const radius of [1,.21])for(const [x,z] of [[-8,1],[-7,4],[-7,5],[-9,1],[-10,5],[-10,4],[-11,4],[-12,4]])if(canStand(x,z,radius)&&Math.abs(heightAt(x+.3,z)-heightAt(x-.3,z))<.3)return{x,y:groundAt(x,z),z};throw new Error('No safe player spawn');}
export function initialCameraYaw(p:{x:number;y:number;z:number}){let best=0,longest=0;for(let i=0;i<16;i++){const angle=i*Math.PI/8;let clear=0;for(let distance=.6;distance<=4.8;distance+=.2){const x=p.x+Math.sin(angle)*distance,z=p.z+Math.cos(angle)*distance,y=p.y+1.4+Math.sin(.25)*distance;if(y<groundAt(x,z)+.3||obstacles.some(o=>Math.hypot(x-o.x,z-o.z)<o.r+.15&&y<groundAt(o.x,o.z)+o.height))break;clear=distance;}if(clear>longest){longest=clear;best=angle;}}return best;}
export class CharacterController{
 position=findSpawn();yaw=0;cameraYaw=0;cameraPitch=.25;velocityY=0;grounded=true;animation='Idle';
 reset(){this.position=findSpawn();this.cameraYaw=initialCameraYaw(this.position);this.yaw=this.cameraYaw+Math.PI;this.cameraPitch=.25;this.velocityY=0;this.grounded=true;this.animation='Idle';}
 step(input:Input,delta:number){const dt=Math.min(delta,.05);this.cameraYaw-=input.cameraX*.0045;this.cameraPitch=Math.max(-.85,Math.min(.85,this.cameraPitch+input.cameraY*.003));input.cameraX=input.cameraY=0;
 if(input.jump&&this.grounded){this.velocityY=5.5;this.grounded=false;}input.jump=false;
 const previousY=this.position.y;if(!this.grounded){this.velocityY-=12*dt;this.position.y+=this.velocityY*dt;}
 const magnitude=Math.min(1,Math.hypot(input.moveX,input.moveY)),speed=(input.run?4.2:2.2)/Math.max(1,Math.hypot(input.moveX,input.moveY)),a=this.cameraYaw,dx=(input.moveX*Math.cos(a)-input.moveY*Math.sin(a))*speed*dt,dz=(-input.moveX*Math.sin(a)-input.moveY*Math.cos(a))*speed*dt;
 const attempt=(x:number,z:number)=>{for(let pass=0;pass<2;pass++)for(const o of obstacles)if(blocks(o,x,z,.21,this.position.y)){const vx=x-o.x,vz=z-o.z,d=Math.hypot(vx,vz)||.001,target=o.r+.212;x=o.x+vx/d*target;z=o.z+vz/d*target;}const g=groundAt(x,z);if(canStand(x,z,.21,this.position.y)&&(Math.abs(g-groundAt(this.position.x,this.position.z))<.45||(!this.grounded&&g<this.position.y+.25))){this.position.x=x;this.position.z=z;return true;}return false;};
 const oldX=this.position.x,oldZ=this.position.z;if(magnitude>.08){if(!attempt(oldX+dx,oldZ+dz)){if(!attempt(oldX+dx,oldZ))attempt(oldX,oldZ+dz);}}
 const moving=Math.hypot(this.position.x-oldX,this.position.z-oldZ)>.001;if(moving)this.yaw=Math.atan2(this.position.x-oldX,this.position.z-oldZ);
 const ground=floorAt(this.position.x,this.position.z,Math.max(previousY,this.position.y));if((this.velocityY<=0&&this.position.y<=ground)||this.grounded){this.position.y=ground;this.velocityY=0;this.grounded=true;}
 this.animation=!this.grounded?'Jump':moving?(input.run?'Run':'Walk'):'Idle';
 }
}
