import { describe,it,expect } from 'vitest';
import { areas,biomeAt,boundaryPoint,boundaryScale,distanceToWaterway,heightAt,insideIsland,isLake,isWetlandPond,riverPoint,semanticZones,waterways,waterwayPoint } from './map';
describe('expanded forest world',()=>{
 it('has roughly six times the original explorable footprint',()=>{let area=0;const samples=720;for(let i=0;i<samples;i++){const a=boundaryPoint(i/samples*Math.PI*2),b=boundaryPoint((i+1)/samples*Math.PI*2);area+=a.x*b.y-b.x*a.y;}expect(Math.abs(area)/2).toBeGreaterThan(1650);});
 it('uses an irregular non-circular silhouette',()=>{const scales=Array.from({length:32},(_,i)=>boundaryScale(i/32*Math.PI*2));expect(Math.max(...scales)-Math.min(...scales)).toBeGreaterThan(.1);const east=boundaryPoint(0),north=boundaryPoint(Math.PI/2);expect(east.x/north.y).toBeGreaterThan(1.2);});
 it('creates strong low, mid and high elevation bands',()=>{expect(heightAt(17,-11)).toBeGreaterThan(3);expect(heightAt(-16,-12)).toBeGreaterThan(2);expect(heightAt(7,5)).toBeGreaterThan(.2);expect(heightAt(6,4)).toBeLessThan(.1);});
 it('connects four organic waterways and lake/wetland water',()=>{expect(waterways).toHaveLength(4);for(let w=0;w<waterways.length;w++)for(let i=0;i<=10;i++){const p=w===0?riverPoint(i/10):waterwayPoint(w,i/10);expect(distanceToWaterway(p.x,p.y,w)).toBeLessThan(.01);}expect(isLake(9,5)).toBe(true);expect(isWetlandPond(14,14)).toBe(true);});
 it('defines ten distinct biome centers and future behavior markers',()=>{expect(areas).toHaveLength(10);expect(new Set(areas.map(a=>biomeAt(a.x,a.z))).size).toBeGreaterThanOrEqual(8);expect(Object.keys(semanticZones).length).toBeGreaterThanOrEqual(10);for(const a of areas)expect(insideIsland(a.x,a.z)).toBe(true);});
});
