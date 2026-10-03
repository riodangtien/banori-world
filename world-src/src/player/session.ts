import { createContext,useContext } from 'react';
import type { Group,AnimationClip } from 'three';
import type { CharacterController,Input,WorldMode } from './controller';
export type ViewMode='first'|'third';
export type PlaySession={view:ViewMode;setView:(v:ViewMode)=>void;photoRequest:{current:boolean};photo:string|null;onPhoto:(blob:Blob)=>void;mode:WorldMode;controller:CharacterController;input:Input;asset:{scene:Group;animations:AnimationClip[]}|null;finish:()=>void;ready:()=>void};
export const PlayContext=createContext<PlaySession>(null!);
export const usePlay=()=>useContext(PlayContext);
