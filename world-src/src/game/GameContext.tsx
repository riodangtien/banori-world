import {createContext,useContext,useState,useEffect,type ReactNode} from 'react';
import {Camera,Scene} from 'three';
import {questions,getQuestion,selectMissions,zones,shuffledIndices,type Subject,type Grade,type Difficulty} from './questions';
import {canStand} from '../player/controller';
import {firstLocation,type Location} from './locations';
import {species,speciesNames,assessAnimal,type Species} from './WildlifeCapture';
export type Phase='setup'|'find'|'quiz'|'reward'|'complete';
export type CaptureStatus='TOO_FAR'|'NOT_CENTERED'|'OCCLUDED'|'WRONG_TARGET'|'SUCCESS';
export const captureFeedback:Record<CaptureStatus,{text:string;action:string;icon:'compass'|'camera'|'close'|'check'}>={
 TOO_FAR:{text:'Mục tiêu ở quá xa',action:'Đi gần hơn, trong khoảng 8 mét.',icon:'compass'},
 NOT_CENTERED:{text:'Chưa ngắm đúng tâm',action:'Kéo để đưa động vật vào giữa khung ngắm.',icon:'camera'},
 OCCLUDED:{text:'Mục tiêu bị che khuất',action:'Đi sang bên để tránh cây hoặc công trình.',icon:'close'},
 WRONG_TARGET:{text:'Em đã hoàn thành loài này',action:'Hãy chụp một loài khác chưa có trong bộ sưu tập.',icon:'compass'},
 SUCCESS:{text:'Chụp đúng động vật!',action:'Cùng quan sát và giải toán.',icon:'check'}
};
export type LearningResult={species?:Species;id:string;skill:string;attempts:number;xp:number};
export type Game={runId:string;phase:Phase;subject:Subject;grade:Grade;difficulty:Difficulty;mission:number;ids:string[];xp:number;attempts:number;missionAttempts:number;position:Location;order:number[];message:string;captureStatus:CaptureStatus|null;hint:boolean;guide:boolean;paused:boolean;mapOpen:boolean;tutorial:number;results:LearningResult[]};
export const initial:Game={runId:'preview',phase:'setup',subject:'math',grade:1,difficulty:'easy',mission:0,ids:animalQuestions(1,'easy',()=>0),xp:0,attempts:0,missionAttempts:0,position:firstLocation(),order:shuffledIndices(),message:'',captureStatus:null,hint:false,guide:false,paused:false,mapOpen:false,tutorial:0,results:[]};
export const itemNames=speciesNames;
export function animalQuestions(grade:Grade,difficulty:Difficulty,random:()=>number=Math.random){const ids=selectMissions(grade,difficulty,random);return species.map((_,i)=>ids[i%ids.length]);}
export const xpFor=(difficulty:Difficulty)=>({easy:30,medium:50,hard:80}[difficulty]);
export function transitionAnswer(g:Game,index:number,random:()=>number=Math.random):Game{
 if(g.phase!=='quiz'||g.results.some(r=>r.species===species[g.mission]))return g;const q=getQuestion(g.ids,g.mission),attempt=g.missionAttempts;
 if(index===q.correct)return{...g,phase:'reward',xp:g.xp+xpFor(g.difficulty),tutorial:g.tutorial<6?5:6,results:[...g.results,{species:species[g.mission],id:q.id,skill:q.skill,attempts:attempt,xp:xpFor(g.difficulty)}],message:'',captureStatus:null};
 const retry=attempt+1;return{...g,phase:'quiz',attempts:g.attempts+1,missionAttempts:retry,order:shuffledIndices(g.order,random),hint:true,captureStatus:null,message:'Chưa đúng. Xem gợi ý rồi thử lại nhé! Không cần tìm hay chụp lại động vật.'};
}
export function transitionNext(g:Game):Game{if(g.phase!=='reward')return g;const next=species.findIndex(name=>!g.results.some(r=>r.species===name));return next<0?{...g,phase:'complete',tutorial:6}:{...g,phase:'find',mission:next,missionAttempts:0,order:shuffledIndices(),hint:false,captureStatus:null,tutorial:6,message:'Tiếp tục khám phá và chụp một loài động vật chưa có trong bộ sưu tập.'};}
export function transitionCapture(g:Game,status:CaptureStatus,animal?:Species,runId?:string):Game{
 if(g.phase!=='find'||g.paused||(runId&&g.runId!==runId))return g;
 if(status==='SUCCESS'&&animal&&species.includes(animal)&&!g.results.some(r=>r.species===animal))return{...g,mission:species.indexOf(animal),phase:'quiz',hint:false,message:'',captureStatus:status,tutorial:g.tutorial<6?4:6};
 const feedback=status==='SUCCESS'?'WRONG_TARGET':status;return{...g,captureStatus:feedback,message:captureFeedback[feedback].text+' · '+captureFeedback[feedback].action};
}
const saveKey='banori-wildlife-v1';
export function validateSave(value:unknown):Game|null{try{let g=value as Game;if(g&&Array.isArray(g.ids)&&g.ids.length===7&&[1,2,3,4,5].includes(g.grade)&&['easy','medium','hard'].includes(g.difficulty)){g={...g,ids:[...g.ids,...animalQuestions(g.grade,g.difficulty).slice(7)]};}if(!g||![1,2,3,4,5].includes(g.grade)||!['easy','medium','hard'].includes(g.difficulty)||!['find','quiz','reward','complete'].includes(g.phase)||!Number.isInteger(g.mission)||g.mission<0||g.mission>=species.length||!Array.isArray(g.ids)||g.ids.length!==species.length||!g.ids.every((id,i)=>questions.some(q=>q.id===id&&q.grade===g.grade&&q.zone===zones[i%zones.length].id))||!Number.isFinite(g.xp)||g.xp<0||g.xp>species.length*80||!Array.isArray(g.results)||g.results.length>species.length||g.results.some(r=>!species.includes(r.species!)||!questions.some(q=>q.id===r.id&&q.grade===g.grade))||new Set(g.results.map(r=>r.species)).size!==g.results.length||!g.position||![g.position.x,g.position.y,g.position.z].every(Number.isFinite)||!canStand(g.position.x,g.position.z,1.2))return null;return{...g,runId:typeof g.runId==='string'?g.runId:'legacy-'+g.grade,position:firstLocation(),subject:'math',order:shuffledIndices(),paused:false,mapOpen:false,tutorial:Number.isInteger(g.tutorial)?Math.max(0,Math.min(6,g.tutorial)):6,captureStatus:null,message:'',phase:g.phase==='quiz'||(g.phase==='complete'&&g.results.length<species.length)?'find':g.phase,mission:g.phase==='complete'&&g.results.length<species.length?species.findIndex(name=>!g.results.some(r=>r.species===name)):g.mission,guide:true};}catch{return null;}}
export function readSave(){try{return validateSave(JSON.parse(localStorage.getItem(saveKey)||'null'));}catch{return null;}}
export type LearningSession={runId:string;grade:Grade;difficulty:Difficulty;xp:number;results:LearningResult[]};
const historyKey='banori-wildlife-history-v1';
export function recordSession(records:LearningSession[],game:Game){if(!game.results.length)return records;const entry:LearningSession={runId:game.runId,grade:game.grade,difficulty:game.difficulty,xp:game.results.reduce((sum,r)=>sum+r.xp,0),results:game.results};return[...records.filter(r=>r.runId!==game.runId),entry].slice(-20);}
function readHistory():LearningSession[]{try{const records=JSON.parse(localStorage.getItem(historyKey)||'[]');return Array.isArray(records)?records.filter((r:LearningSession)=>typeof r?.runId==='string'&&[1,2,3,4,5].includes(r.grade)&&Array.isArray(r.results)&&r.results.length<=species.length&&r.results.every(x=>questions.some(q=>q.id===x.id&&q.grade===r.grade))&&Number.isFinite(r.xp)).slice(-20):[];}catch{return[];}}
function useGameState(){const [game,set]=useState<Game>(initial),[saved,setSaved]=useState<Game|null>(()=>readSave()),[history,setHistory]=useState<LearningSession[]>(readHistory);
 useEffect(()=>{if(game.phase==='setup')return;try{localStorage.setItem(saveKey,JSON.stringify(game));setSaved(validateSave(game));}catch{/* Storage may be disabled; the session remains playable. */}},[game]);
 useEffect(()=>{if(!game.results.length)return;setHistory(previous=>{const next=recordSession(previous,game);try{localStorage.setItem(historyKey,JSON.stringify(next));}catch{}return next;});},[game.results,game.runId]);
 const baseQuestion=getQuestion(game.ids,game.mission),question={...baseQuestion,prompt:'Thử thách của '+({deer:'Hươu',fox:'Cáo',rabbit:'Thỏ',frog:'Ếch',bird:'Chim',butterfly:'Bướm',fish:'Cá',wolf:'Sói',bear:'Gấu',boar:'Lợn rừng',badger:'Lửng',squirrel:'Sóc'}[species[game.mission]])+': '+baseQuestion.prompt};
 const start=(subject:Subject,difficulty:Difficulty,grade:Grade=1)=>set({...initial,runId:Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8),subject,grade,difficulty,phase:'find',ids:animalQuestions(grade,difficulty),order:shuffledIndices(),guide:true,position:firstLocation(),tutorial:0});
 const resolveCapture=(status:CaptureStatus,animal?:Species,runId?:string)=>set(g=>transitionCapture(g,status,animal,runId));
 const capture=(camera:Camera,scene:Scene)=>{const result=assessAnimal(camera,scene,game.results.map(r=>r.species??''));resolveCapture(result.status,result.target?.species);};

 return{game,saved,history,question,start,capture,resolveCapture,answer:(index:number)=>set(g=>transitionAnswer(g,index)),skip:()=>set(g=>transitionAnswer(g,-1)),next:()=>set(transitionNext),reset:()=>set({...initial,order:shuffledIndices()}),resumeSaved:()=>{const value=readSave();if(value)set(value);},showHint:()=>set(g=>({...g,hint:true})),showGuide:()=>set(g=>({...g,guide:!g.guide})),pause:()=>set(g=>g.phase==='find'?{...g,paused:true,mapOpen:false}:g),resume:()=>set(g=>({...g,paused:false,mapOpen:false})),openMap:()=>set(g=>g.phase==='find'?{...g,paused:true,mapOpen:true}:g),advanceTutorial:(step:number)=>set(g=>g.tutorial===step?{...g,tutorial:step+1}:g),skipTutorial:()=>set(g=>({...g,tutorial:6})),restartTutorial:()=>set(g=>({...g,tutorial:0,paused:false,mapOpen:false}))};
}
const Context=createContext<ReturnType<typeof useGameState>>(null!);
export const useGame=()=>useContext(Context);
export function GameProvider({children}:{children:ReactNode}){const value=useGameState();return <Context.Provider value={value}>{children}</Context.Provider>;}
