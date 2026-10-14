import {Onboarding} from './Onboarding';
import {LearningVisual} from './LearningVisual';
import {useEffect,useRef,useState,type ReactNode} from 'react';
import {useGame,itemNames,captureFeedback} from './GameContext';
import {subjects,difficultyLabels,type Subject,type Difficulty,type Grade,getQuestion} from './questions';
import {usePlay} from '../player/session';
import {Icon,collectibleIcons} from './Icons';
import {species,speciesNames} from './WildlifeCapture';
import {FieldMap} from './FieldMap';
import './game.css';
function Progress({mission,complete=false}:{mission:number;complete?:boolean}){
 return <div className="mission-slots" aria-label={`${complete?7:mission} of 7 species completed`}>{collectibleIcons.map((name,i)=><span key={i} className={complete||i<mission?'slot done':i===mission?'slot current':'slot'}><Icon name={complete||i<mission?'check':name}/></span>)}</div>;
}
export function GameHUD({enter,exit,status,climate}:{enter:()=>void;exit:()=>void;status:string;climate?:ReactNode}){
 const g=useGame(),{game,question}=g,s=usePlay();
 const [grade,setGrade]=useState<Grade>(1);const subject:Subject='math';const [difficulty,setDifficulty]=useState<Difficulty>('easy');
 const modal=useRef<HTMLDivElement>(null);
 const [fullscreen,setFullscreen]=useState(Boolean(document.fullscreenElement));
 useEffect(()=>{const changed=()=>setFullscreen(Boolean(document.fullscreenElement));document.addEventListener('fullscreenchange',changed);return()=>document.removeEventListener('fullscreenchange',changed);},[]);
 const blocking=['setup','quiz','reward','complete'].includes(game.phase)||game.paused;
 const award={easy:30,medium:50,hard:80}[game.difficulty];
 useEffect(()=>{
  if(!blocking)return;const node=modal.current;node?.focus();
  const trap=(e:KeyboardEvent)=>{if(e.key!=='Tab'||!node)return;
   const list=[...node.querySelectorAll<HTMLElement>('button:not(:disabled),select,summary,[tabindex="0"]')];
   if(!list.length)return;const first=list[0],last=list[list.length-1];
   if(e.shiftKey&&(document.activeElement===first||document.activeElement===node)){e.preventDefault();last.focus();}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  };node?.addEventListener('keydown',trap);return()=>node?.removeEventListener('keydown',trap);
 },[blocking,game.phase,game.paused,game.mapOpen]);
 if(game.phase==='setup')return <div className="demo-modal demo-start" ref={modal} role="dialog" aria-modal="true" aria-labelledby="demo-title" tabIndex={-1}>
  <section className="expedition-launcher">
   <div className="expedition-art">
    <img className="expedition-logo" src="../logo.png" alt="BANORI"/>
    <span className="chapter-tag"><Icon name="compass"/> THE FOREST EXPEDITION</span>
    <h1 id="demo-title">A little curiosity.<br/><strong>A whole world.</strong></h1>
    <img className="expedition-explorer" src="../2home.svg" alt="Official BANORI explorer"/>
    <div className="expedition-caption"><span>PLAY · EXPLORE · PROTECT</span><p>Your next discovery starts here.</p></div>
    <span className="field-stamp" aria-hidden="true"><Icon name="compass"/><small>EXPLORER</small></span>
   </div>
   <div className="expedition-config">
    <header className="launch-heading"><span className="eyeline"><Icon name="flag"/> PREPARE YOUR JOURNEY</span><h2>Your forest.<br/> Your maths adventure.</h2><span className="expedition-count">7 animal species <i/> One expedition</span></header>
    <div className="math-focus"><span className="subject-symbol math"><Icon name="math"/></span><div><strong>Primary Mathematics</strong><p>Find wildlife, take photographs and solve maths · Grades 1–5</p></div></div>
    <fieldset className="grade-field"><legend>Your school year</legend><div className="grade-picker">{([1,2,3,4,5] as Grade[]).map(n=><button key={n} onClick={()=>setGrade(n)} aria-pressed={grade===n} aria-label={`Grade ${n}`}>Grade {n}</button>)}</div></fieldset>
    <fieldset className="difficulty-field"><legend>Choose your challenge</legend><div className="difficulty-options">{(['easy','medium','hard'] as Difficulty[]).map((level,i)=><button key={level} aria-label={`${difficultyLabels[level]} difficulty`} aria-pressed={difficulty===level} className={difficulty===level?'selected':''} onClick={()=>setDifficulty(level)}><span className="rank-diamonds" aria-hidden="true">{[0,1,2].map(n=><i key={n} className={n<=i?'filled':''}/>)}</span>{difficultyLabels[level]}</button>)}</div></fieldset>
    <div className="launch-route"><span><Icon name="compass"/>Find</span><i/><span><Icon name="camera"/>Capture</span><i/><span><Icon name="book"/>Learn</span></div>
    <button className="demo-primary launch-start" aria-label="START DEMO →" disabled={!s.asset||s.mode!=='explore'} onClick={()=>{g.start(subject,difficulty,grade);s.setView('third');enter();}}><span>{s.asset?'START EXPEDITION':status==='preparing'?'PREPARING THE FOREST…':'EXPLORER UNAVAILABLE'}</span><Icon name="arrow"/></button>
    {g.saved&&<div className="resume-save"><span>Grade {g.saved.grade} · {g.saved.xp} XP saved on this device</span><button disabled={!s.asset||s.mode!=='explore'} onClick={()=>{g.resumeSaved();s.setView('third');enter();}}>Continue saved expedition</button></div>}
    {g.history.length>0&&<details className="learning-history"><summary>{g.history.reduce((n,run)=>n+run.results.length,0)} maths tasks practised on this device</summary><ul>{g.history.slice(-3).reverse().map(run=><li key={run.runId}>Grade {run.grade} · {run.results.length}/7 species · {run.xp} XP — {run.results.map(r=>r.skill).join(', ')}</li>)}</ul></details>}
    <details className="launch-help"><summary><Icon name="compass"/>First time in the forest?<Icon name="chevron"/></summary><p>Explore freely and photograph deer, foxes, rabbits, frogs, birds, butterflies and fish. Each new species unlocks one maths question. Retry with a hint without chasing the animal again.</p><p><kbd>W A S D</kbd> Move <kbd>V</kbd> View <kbd>Space</kbd> Jump · Touch controls available in landscape.</p></details>
    <div className="launch-footer"><span><Icon name="star"/> UP TO {({easy:210,medium:350,hard:560}[difficulty])} XP</span><span>Wildlife expedition / 7 species</span></div>
   </div>
  </section>
 </div>;
 if(s.mode!=='play')return null;
 return <>
  <Onboarding/><div className="expedition-status"><div className="xp-status"><Icon name="star"/><strong>{game.xp} XP</strong><span className="xp-track"><i style={{width:`${game.xp/(award*7)*100}%`}}/></span></div><Progress mission={game.results.length} complete={game.phase==='complete'}/></div>
  <aside className="quest-panel" aria-label="Current mission">
   <div className={'objective-symbol item-'+game.mission}><Icon name={collectibleIcons[game.mission]}/></div>
   <div className="objective-copy"><span className="objective-index">WILDLIFE ALBUM · {game.results.length}/7</span><h2>{game.phase==='find'?'Find a new animal':itemNames[game.mission]}</h2><p>{game.phase==='find'?'Explore · Photograph · Learn':'Animal photographed.'}</p></div>
   <div className="quest-actions"><span className="quest-range"><Icon name="compass"/><strong id="quest-distance" aria-label="Straight-line distance to item">— m</strong></span><button onClick={g.showGuide} aria-pressed={game.guide} aria-label="Toggle location hint"><Icon name={game.guide?'check':'flag'}/>{game.guide?'Guide on':'Guide me'}</button></div>
   {game.guide&&<p id="quest-bearing" className="bearing-guide">Follow the trail marker.</p>}
  </aside>
  {game.message&&<div className="expedition-notice quest-message camera-feedback" lang="vi" data-status={game.captureStatus??'retry'} role="status"><Icon name={game.captureStatus?captureFeedback[game.captureStatus].icon:'compass'}/>{game.message}</div>}
  <div className="expedition-map-tools"><FieldMap/><div className="map-utility-row"><button className="pause-control" onClick={g.pause} aria-label="Pause expedition"><Icon name="pause"/></button><button className="pause-control" aria-label={fullscreen?'Leave fullscreen':'Enter fullscreen'} onClick={()=>{if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});else document.documentElement.requestFullscreen?.().catch(()=>{});}}><Icon name="expand"/></button></div></div>
  {blocking&&<div className={'demo-modal '+(game.mapOpen?'map-overlay':'challenge-overlay')} ref={modal} role="dialog" aria-modal="true" aria-labelledby="question-title" tabIndex={-1}>
   <section className={'demo-card '+(game.mapOpen?'map-card':game.paused?'pause-card':game.phase==='quiz'?'quiz-card':'reward-card')}>
    <button className="modal-exit" onClick={game.paused?g.resume:exit} aria-label={game.paused?'Resume expedition':'Exit demo'}><Icon name="close"/></button>
    {game.paused?game.mapOpen?<>
     <header className="map-heading"><span className="eyeline"><Icon name="map"/> YOUR FIELD MAP</span><h2 id="question-title">Know your way.</h2><p>Follow the sandy trails. Bridges connect the river banks. The distance shown is straight-line distance.</p></header>
     <FieldMap large/>
     <div className="map-footer"><button className="map-guide" onClick={g.showGuide} aria-pressed={game.guide}><Icon name="flag"/>{game.guide?'Hide target':'Reveal target'}</button><button className="demo-primary" onClick={g.resume}>BACK TO EXPLORING<Icon name="arrow"/></button></div>
    </>:<>
     <div className="pause-emblem"><Icon name="compass"/></div><span className="eyeline">EXPEDITION PAUSED</span><h2 id="question-title">Take a breather.</h2><p>The forest will be right here.</p><div className="wildlife-album" aria-label="Animal collection">{species.map((name,i)=><span key={name} className={game.results.some(r=>r.species===name)?'collected':''}><Icon name={game.results.some(r=>r.species===name)?'check':'footprint'}/>{speciesNames[i]}</span>)}</div><button className="demo-primary" onClick={g.resume}>RESUME EXPEDITION<Icon name="arrow"/></button>{s.photo&&<a className="text-action" href={s.photo} download="banori-maths.png">Save your last photograph</a>}<button className="text-action" onClick={g.restartTutorial}>Show interactive help again</button><details className="climate-settings"><summary>Forest climate & motion</summary>{climate}</details><button className="text-action" onClick={exit}>Return to the starting screen</button>
    </>:game.phase==='quiz'?<>
     <div className="capture-sheet">
      <span className="eyeline"><Icon name="check"/> CHỤP ĐÚNG ĐỘNG VẬT</span>
      <div className="captured-photo">{s.photo?<img src={s.photo} alt="Your photographed animal in the forest"/>:<Icon name={collectibleIcons[game.mission]}/>}<span className="photo-corners"/></div>
      <span className="captured-label">FOUND IN BANORI FOREST</span><h3>{itemNames[game.mission]}</h3>
      <div className="collection-patch"><Icon name={collectibleIcons[game.mission]}/><span>EXPLORER'S<br/>FIELD NOTES</span></div>
      <div className="capture-metadata"><span>{subjects[game.subject]}</span><b>{difficultyLabels[game.difficulty]} challenge</b></div>
     </div>
     <div className="question-sheet" lang="vi">
      <div className="challenge-header"><span className="eyeline">CHỤP THÀNH CÔNG · {game.results.length+1}/7</span><span className="question-value"><Icon name="star"/>{award} XP</span></div>
      <div className="challenge-route"><span><Icon name="check"/>Found</span><i/><span><Icon name="check"/>Captured</span><i/><strong><Icon name="book"/>Learn</strong></div>
      <span className="eyeline">{itemNames[game.mission]} · MATHS CHALLENGE</span><h2 id="question-title">{question.prompt}</h2>{game.message&&<p className="quiz-feedback" role="status">{game.message}</p>}<LearningVisual scene={question.scene}/>
      <div className="quiz-answers">{game.order.map((index,i)=><button key={index} onClick={()=>g.answer(index)}><span>{String.fromCharCode(65+i)}</span><b>{question.answers[index]}</b><Icon name="chevron"/></button>)}</div>
      {game.hint&&<p className="quiz-hint"><Icon name="compass"/>{question.hint}</p>}
      <div className="quiz-footer"><button onClick={g.showHint} aria-label="Show hint"><Icon name="compass"/>A little hint</button><button onClick={g.showHint}>Need a hint?<Icon name="arrow"/></button></div>
      <p className="retry-note">Your animal stays in the forest. Try again here; no need to recapture.</p>
     </div>
    </>:game.phase==='reward'?<>
     <span className="eyeline">DISCOVERY COMPLETE</span><div className="reward-medal"><Icon name="star"/><span><Icon name="check"/></span></div><h2 id="question-title">Curiosity rewarded.</h2><p className="answer-explanation">{question.prompt}</p><strong>{question.answers[question.correct]}</strong><LearningVisual scene={question.scene} result/><p className="answer-explanation">{question.explanation}</p><div className="learning-skill" lang="vi">Kỹ năng: {question.skill}</div><div className="xp-reward">+{award}<small>XP EARNED</small></div><div className="reward-progress"><Progress mission={game.results.length}/><span>{game.results.length} of 7 animal species collected</span></div><button className="demo-primary" aria-label={game.results.length===7?'SEE RESULTS →':'NEXT MISSION →'} onClick={g.next}>{game.results.length===7?'COMPLETE YOUR EXPEDITION':'ON TO THE NEXT DISCOVERY'}<Icon name="arrow"/></button>
    </>:<>
     <span className="eyeline">EXPEDITION COMPLETE</span><div className="reward-medal final-medal"><Icon name="compass"/><span><Icon name="star"/></span></div><h2 id="question-title">Officially<br/>a forest explorer.</h2><Progress mission={7} complete/><div className="xp-reward">{game.xp}<small>TOTAL XP</small></div><p>Seven species. {game.attempts} retry{game.attempts===1?'':'s'}.<br/>Grade {game.grade} · {difficultyLabels[game.difficulty]}</p><ul className="result-skills">{game.results.map(result=><li key={result.species??result.id}>{result.species?speciesNames[species.indexOf(result.species)]:'Animal'} · {result.skill} · +{result.xp} XP · {getQuestion([result.id],0).answers[0]}</li>)}</ul><button className="demo-primary" onClick={exit}>CHOOSE ANOTHER TRAIL<Icon name="arrow"/></button>
    </>}
   </section>
  </div>}
  <output id="expedition-health" hidden>{JSON.stringify({phase:game.phase,paused:game.paused,mapOpen:game.mapOpen,mission:game.mission,xp:game.xp,grade:game.grade,questionId:question.id,position:game.position,species:species[game.mission],collected:game.results.map(r=>r.species),tutorial:game.tutorial,attempts:game.missionAttempts})}</output>
 </>;
}
