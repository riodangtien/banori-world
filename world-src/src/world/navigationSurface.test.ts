import { describe,it,expect } from 'vitest';
import { bridges } from './layout';
import { bridgePoint,bridgeSurfaceY,bridgeStrip,bridgeCoordinates } from './bridgeSurface';
import { buildPaths } from './Paths';
import { heightAt } from './map';
import { CharacterController,emptyInput,groundAt } from '../player/controller';

describe('paths and bridge approaches',()=>{
 it('leaves a dry connector between neighbouring bridges instead of overlapping ramps and rails',()=>{
  for(let i=0;i<bridges.length;i++)for(let j=i+1;j<bridges.length;j++){const a=bridges[i],b=bridges[j],clearance=Math.hypot(a.x-b.x,a.z-b.z)-Math.hypot(a.length/2+a.ramp,.65)-Math.hypot(b.length/2+b.ramp,.65);expect(clearance,a.id+' / '+b.id).toBeGreaterThanOrEqual(.49);}
 });
 it('keeps road triangles above the terrain, including their interiors',()=>{
  const g=buildPaths(),p=g.getAttribute('position');expect(p.count).toBeGreaterThan(100);
  for(let i=0;i<p.count;i+=3){let x=0,y=0,z=0;for(let j=0;j<3;j++){x+=p.getX(i+j)/3;y+=p.getY(i+j)/3;z+=p.getZ(i+j)/3;}expect(y-heightAt(x,z)).toBeCloseTo(.028,4);}
  g.dispose();
 });
 it('has upward deck faces and dry, continuous ramp ends on every bridge',()=>{
  for(const b of bridges){const half=b.length/2;
   for(let t=-half-b.ramp;t<half+b.ramp;t+=.15){const strip=bridgeStrip(b,t,Math.min(t+.15,half+b.ramp)),v=strip.getAttribute('position'),normal=strip.getAttribute('normal');for(let face=0;face<v.count;face+=3)if(normal.getY(face)>.05){let x=0,y=0,z=0;for(let j=0;j<3;j++){x+=v.getX(face+j)/3;y+=v.getY(face+j)/3;z+=v.getZ(face+j)/3;}expect(y-heightAt(x,z),b.id+' at '+t).toBeGreaterThan(.001);}strip.dispose();}
   const g=bridgeStrip(b,-.1,.1);expect(g.getAttribute('normal').getY(0)).toBeGreaterThan(.99);g.dispose();
   for(const sign of [-1,1])for(const side of [-.65,0,.65]){const t=sign*(half+b.ramp),p=bridgePoint(b,t,side);expect(bridgeSurfaceY(b,t,side)).toBeCloseTo(heightAt(p.x,p.z)+.028);}
   for(let t=-half;t<=half;t+=.1)for(const side of [-.65,0,.65]){const p=bridgePoint(b,t,side);expect(bridgeSurfaceY(b,t,side)).toBeGreaterThan(heightAt(p.x,p.z)+.02);}
  }
 });
 it('walks across every complete bridge without needing to jump',()=>{
  for(const b of bridges){const end=b.length/2+b.ramp,p=bridgePoint(b,-end+.05),c=new CharacterController(),i=emptyInput();c.position={...p,y:groundAt(p.x,p.z)};c.cameraYaw=b.angle+Math.PI;i.moveY=1;
   for(let n=0;n<Math.ceil((end*2-.1)/2.2*60);n++)c.step(i,1/60);
   expect(bridgeCoordinates(b,c.position.x,c.position.z).along,b.id).toBeGreaterThan(end-.12);expect(c.grounded).toBe(true);
  }
 });
});
