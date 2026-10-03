import { createContext,useContext,useEffect,useRef } from 'react';
import { useFrame,useThree } from '@react-three/fiber';
export type Quality='auto'|'low'|'medium'|'high';
export type Tier=Exclude<Quality,'auto'>;
export const presets={low:{dpr:1,shadow:512,density:.3,water:0},medium:{dpr:1.35,shadow:1024,density:.65,water:256},high:{dpr:2,shadow:2048,density:1,water:512}};
export const QualityContext=createContext(presets.medium);
export const useQuality=()=>useContext(QualityContext);
export function QualityMonitor({auto,tier,onTier}:{auto:boolean;tier:Tier;onTier:(t:Tier)=>void}){const {gl,setDpr}=useThree(),sample=useRef({seconds:0,frames:0,cooldown:0});useEffect(()=>{setDpr(Math.min(devicePixelRatio,presets[tier].dpr));if(auto&&gl.capabilities.maxTextureSize<4096)onTier('low');},[tier,auto,gl,setDpr,onTier]);useFrame((_,dt)=>{if(!auto||document.hidden)return;const p=sample.current;p.seconds+=dt;p.frames++;p.cooldown+=dt;if(p.seconds<5)return;const fps=p.frames/p.seconds;p.seconds=p.frames=0;if(p.cooldown<12)return;if(fps<32&&tier!=='low'){onTier(tier==='high'?'medium':'low');p.cooldown=0;}else if(fps>57&&tier==='low'){onTier('medium');p.cooldown=0;}});return null;}
