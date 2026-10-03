import { useQuality } from './quality';
import { useMemo,useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points } from 'three';
import { heightAt } from '../world/map';
import type { Settings } from './settings';
export function NightLife({settings}:{settings:Settings}){const quality=useQuality();const ref=useRef<Points>(null!),time=useRef(0),array=useMemo(()=>new Float32Array(55*3),[]);useFrame(({camera},d)=>{const count=Math.round(55*quality.density);ref.current.geometry.setDrawRange(0,count);if(!settings.night||camera.position.length()>100)return;if(!settings.paused)time.current+=Math.min(d,.05);for(let i=0;i<count;i++){const a=i*2.4,x=(i<30?17:-15)+Math.cos(a)*((i%7)*.5+1)+Math.sin(time.current*.4+a)*.3,z=(i<30?2:8)+Math.sin(a)*((i%7)*.5+1),y=heightAt(x,z)+.35+Math.sin(time.current*.6+a)*.15+(i%4)*.2;ref.current.geometry.attributes.position.setXYZ(i,x,y,z);}ref.current.geometry.attributes.position.needsUpdate=true;});return <points ref={ref} visible={settings.night} frustumCulled={false}><bufferGeometry><bufferAttribute attach="attributes-position" args={[array,3]}/></bufferGeometry><pointsMaterial color="#eee696" size={.075} transparent opacity={.8} depthWrite={false}/></points>;}
