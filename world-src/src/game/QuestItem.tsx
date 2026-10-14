import {toMap} from './FieldMap';
import {useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import {useGame} from './GameContext';
import {usePlay} from '../player/session';
import {animalTargets,assessAnimal,speciesNames,species} from './WildlifeCapture';
export function QuestItem(){const {game}=useGame(),s=usePlay(),timer=useRef(0);
 useFrame(({camera,scene},dt)=>{timer.current+=dt;if(timer.current<.16)return;timer.current=0;if(s.mode!=='play'||game.phase!=='find')return;
 const p=s.controller.position,xy=toMap(p.x,p.z),transform='translate('+xy.join(' ')+') rotate('+(-s.controller.cameraYaw*180/Math.PI)+')';for(const id of ['map-player','map-player-large'])document.getElementById(id)?.setAttribute('transform',transform);
 const completed=game.results.map(r=>r.species??''),assessment=assessAnimal(camera,scene,completed),locked=s.view==='first'&&!game.paused&&assessment.status==='SUCCESS';const finder=document.querySelector<HTMLElement>('.viewfinder');if(finder)finder.dataset.locked=String(locked);const status=document.getElementById('quest-camera-status');if(status)status.textContent=locked?'ĐÃ NGẮM ĐÚNG':'TÌM VÀ CHỤP ĐỘNG VẬT';
 const nearest=animalTargets(scene).filter(t=>!completed.includes(t.species)).sort((a,b)=>Math.hypot(a.position.x-p.x,a.position.z-p.z)-Math.hypot(b.position.x-p.x,b.position.z-p.z))[0];
 const out=document.getElementById('quest-distance'),bearing=document.getElementById('quest-bearing');if(out)out.textContent=nearest?Math.round(Math.hypot(p.x-nearest.position.x,p.z-nearest.position.z))+' m':'—';
 if(nearest){const angle=Math.atan2(nearest.position.x-p.x,nearest.position.z-p.z)-s.controller.cameraYaw-Math.PI,relative=Math.atan2(Math.sin(angle),Math.cos(angle));if(bearing)bearing.textContent=speciesNames[species.indexOf(nearest.species)]+' · '+(Math.abs(relative)<.25?'Ahead':Math.abs(relative)>2.6?'Behind you':relative<0?'To your right':'To your left');for(const id of ['map-animal','map-animal-large'])document.getElementById(id)?.setAttribute('transform','translate('+toMap(nearest.position.x,nearest.position.z).join(' ')+')');}
 });return null;
}
