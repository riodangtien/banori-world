'use strict';
const app=document.querySelector('.app');const screens=[...document.querySelectorAll('[data-screen]')];let activeScreen='home';
function setActiveNavigation(key){document.querySelectorAll('[data-nav-key]').forEach(link=>{if(link.dataset.navKey===key)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});}
function navigatePrimary(key){showScreen(key==='world'?'watery':['characters','brand'].includes(key)?'concept':'home',false);setActiveNavigation(key);history.replaceState(null,'',({home:'#home',about:'#about',world:'#world',characters:'#characters',brand:'#concept'})[key]);if(key==='characters')selectBrand(0,false);if(key==='about')document.querySelector('.home-journey').scrollIntoView({behavior:'smooth',block:'start'});if(key==='home')document.querySelector('.home-scroll').scrollTop=0;}
document.querySelectorAll('[data-nav-key]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();navigatePrimary(link.dataset.navKey);}));
function closeMenus(){document.querySelectorAll('.menu-toggle').forEach(b=>{b.setAttribute('aria-expanded','false');b.setAttribute('aria-label','Open navigation menu');});document.querySelectorAll('.header nav').forEach(n=>n.classList.remove('is-open'))}
function showScreen(name,updateHistory=true){if(!screens.some(s=>s.dataset.screen===name))return;const previous=screens.find(s=>s.dataset.screen===activeScreen);const next=screens.find(s=>s.dataset.screen===name);if(previous!==next){previous.classList.add('is-leaving');previous.classList.remove('is-active');previous.setAttribute('aria-hidden','true');next.classList.remove('is-leaving');next.classList.add('is-active');next.setAttribute('aria-hidden','false')}activeScreen=name;app.dataset.activeScreen=name;setActiveNavigation(name==='home'?'home':name==='watery'?'world':'brand');closeMenus();if(updateHistory)history.replaceState(null,'',name==='home'?'#home':name==='concept'?'#concept':'#world');updateForest(name)}
document.querySelectorAll('[data-screen-link]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();showScreen(link.dataset.screenLink)}));
document.querySelectorAll('.menu-toggle').forEach(button=>button.addEventListener('click',()=>{const nav=button.closest('.header').querySelector('nav');const open=button.getAttribute('aria-expanded')!=='true';closeMenus();button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu');nav.classList.toggle('is-open',open)}));
document.addEventListener('keydown',event=>{if(event.target.closest('input,textarea,select,button,[role=dialog]')||dialog?.open)return;if(event.key==='Escape')closeMenus();if(event.key==='ArrowRight'&&activeScreen==='home')showScreen('watery');else if(event.key==='ArrowRight'&&activeScreen==='watery')showScreen('concept');else if(event.key==='ArrowLeft'&&activeScreen==='concept')showScreen('watery');else if(event.key==='ArrowLeft'&&activeScreen==='watery')showScreen('home')});
const chapters={play:'A playful world built for adventure.',explore:'Discover colorful places and unique friends.',protect:'Together, for a greener tomorrow.',more:'More of the BANORI story is coming soon.'};document.querySelectorAll('[data-chapter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-chapter]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));button.title=chapters[button.dataset.chapter]}));
const dialog=document.querySelector('#message-dialog');const dialogTitle=document.querySelector('#dialog-title');const dialogCopy=document.querySelector('#dialog-copy');function openMessage(title,copy){dialogTitle.textContent=title;dialogCopy.textContent=copy;dialog.showModal()}
document.querySelectorAll('[data-trailer]').forEach(button=>button.addEventListener('click',()=>openMessage('The adventure is coming.','The BANORI trailer is not available yet. Explore WATERY while the world continues to grow.')));document.querySelector('[data-water-action]').addEventListener('click',()=>openMessage('WATERY is growing.','The playable WATERY experience is coming soon. For now, this product board introduces its world and merge mechanic.'));document.querySelector('[data-how]').addEventListener('click',()=>openMessage('Drop. Match. Merge. Grow.','Drop fruits from above. When two identical fruits touch, they merge into one larger fruit. Keep growing your colorful farm world.'));document.querySelectorAll('.dialog-close,.dialog-done').forEach(button=>button.addEventListener('click',()=>dialog.close()));dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});

const worldScroll=document.querySelector('.world-scroll');
const forest=document.querySelector('.forest-frame');
let forestScrollFrame=0;
function sendForestVisibility(){
  const rect=forest.getBoundingClientRect(),viewport=worldScroll.getBoundingClientRect();
  const overlap=Math.max(0,Math.min(rect.bottom,viewport.bottom)-Math.max(rect.top,viewport.top));
  const fraction=activeScreen==='watery'?Math.min(1,overlap/Math.max(1,Math.min(rect.height,viewport.height))):0;
  forest.contentWindow?.postMessage({type:'banori-visible',visible:fraction>0,volume:fraction*fraction},location.origin);
}
worldScroll.addEventListener('scroll',()=>{if(!forestScrollFrame)forestScrollFrame=requestAnimationFrame(()=>{forestScrollFrame=0;sendForestVisibility();});},{passive:true});
window.addEventListener('resize',sendForestVisibility);
for(const event of ['pointerdown','keydown'])document.addEventListener(event,()=>{forest.contentWindow?.postMessage({type:'banori-audio-start'},location.origin);},{passive:true});
const conceptScreen=document.querySelector('.concept-screen');
const conceptBoard=document.querySelector('.concept-board');
const conceptScroll=document.createElement('div');
conceptScroll.className='concept-scroll';
conceptScroll.tabIndex=0;
conceptScroll.setAttribute('aria-label','BANORI brand identity');
conceptBoard.before(conceptScroll);
conceptScroll.append(conceptBoard);
document.querySelectorAll('.identity-section').forEach(section=>conceptScroll.append(section));
const brandViews=[conceptBoard,...conceptScroll.querySelectorAll('.identity-section')];
const brandNames=['Overview','Logo','Color','Type'];
const brandNav=document.createElement('nav');brandNav.className='brand-tabs';brandNav.setAttribute('aria-label','Brand sections');
brandViews.forEach((view,index)=>{view.classList.add('brand-view');const button=document.createElement('button');button.innerHTML='<span class="brand-tab-symbol" aria-hidden="true">'+["<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"><rect x=\"5\" y=\"3\" width=\"14\" height=\"18\" rx=\"2\"/><path d=\"M9 8h6M9 12h6M9 16h3\"/></svg>","<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"><circle cx=\"12\" cy=\"12\" r=\"7\"/><circle cx=\"3\" cy=\"12\" r=\"2\"/><circle cx=\"21\" cy=\"12\" r=\"2\"/><path d=\"M9 10h.01M15 10h.01M10 15q2 2 4 0\"/></svg>","<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"><path d=\"M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1-4c-2-1 0-3 2-3h2a3 3 0 0 0 3-3 9 9 0 0 0-9-8z\"/><path d=\"M7 9h.01M11 6h.01M16 8h.01\"/></svg>","Aa"][index]+'</span><span>'+brandNames[index]+'</span>'; button.dataset.brandView=String(index);button.addEventListener('click',()=>selectBrand(index));brandNav.append(button);});
conceptScroll.prepend(brandNav);
function selectBrand(index,updateHistory=true){brandViews.forEach((view,i)=>{view.classList.toggle('is-current',i===index);view.hidden=false;view.inert=false;});brandNav.querySelectorAll('button').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));if(updateHistory){brandViews[index].scrollIntoView({behavior:'smooth',block:'start'});history.replaceState(null,'',index===0?'#concept':'#'+brandViews[index].id);}}
selectBrand(0,false);
document.querySelector('[data-kingdom-how]').addEventListener('click',()=>openMessage('Build towers. Hold the gates.','Choose a battlefield, build towers on empty slots and call the next wave. Use fire rain and frost when needed. Upgrade or sell towers to adapt your strategy. Complete every wave with health remaining at the gates to win.'));
document.querySelectorAll('[data-world-jump]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();document.querySelector('#'+link.dataset.worldJump).scrollIntoView({behavior:'smooth',block:'start'});history.replaceState(null,'',link.getAttribute('href'));}));
history.scrollRestoration='manual';
function updateForest(name){
  if(name==='watery'&&!forest.getAttribute('src'))forest.src=forest.dataset.src;
  if(name==='watery'){
    worldScroll.scrollTop=0;

  }
  if(name==='concept'){
    selectBrand(0,false);
    conceptScroll.scrollTop=0;
    requestAnimationFrame(()=>conceptScroll.scrollTop=0);
  }
  screens.forEach(screen=>screen.inert=screen.dataset.screen!==name);
  sendForestVisibility();
}
forest.addEventListener('load',()=>{
  const frameWindow=forest.contentWindow;
  sendForestVisibility();
  if(navigator.userActivation?.hasBeenActive)frameWindow.postMessage({type:'banori-audio-start'},location.origin);
  frameWindow.addEventListener('keydown',event=>{
    const movement={ArrowDown:60,ArrowUp:-60,PageDown:worldScroll.clientHeight*.85,PageUp:-worldScroll.clientHeight*.85,' ':worldScroll.clientHeight*.85}[event.key];
    if(movement&&!document.body.classList.contains('world-playing')){event.preventDefault();worldScroll.scrollBy({top:movement,behavior:'smooth'});}
  },true);
});
function openHash(){const hash=location.hash;if(hash==='#about'||hash==='#characters'){navigatePrimary(hash.slice(1));return;}const brandIndex=brandViews.findIndex(view=>'#'+view.id===hash);if(hash==='#concept'||brandIndex>=0){showScreen('concept',false);selectBrand(Math.max(0,brandIndex),false);if(brandIndex>0)requestAnimationFrame(()=>brandViews[brandIndex].scrollIntoView({block:'start'}));}else if(['#world','#watery','#kingdom'].includes(hash)){showScreen('watery',false);requestAnimationFrame(()=>{const target=hash==='#kingdom'?'kingdom-main':hash==='#watery'?'watery-main':null;if(target)document.getElementById(target).scrollIntoView({block:'start'});});}else showScreen('home',false);}
window.addEventListener('hashchange',openHash);openHash();

window.addEventListener('message',event=>{if(event.origin!==location.origin||event.source!==forest.contentWindow||event.data?.type!=='banori-play')return;document.body.classList.toggle('world-playing',Boolean(event.data.active));});
window.addEventListener('message',event=>{if(event.origin!==location.origin||event.source!==forest.contentWindow||event.data?.type!=='banori-audio-health')return;forest.dataset.audioVolume=String(event.data.volume);forest.dataset.audioLevel=String(event.data.level);forest.dataset.audioCalls=String(event.data.calls);});

document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenus();});
document.addEventListener('click',event=>{if(!event.target.closest('.header'))closeMenus();});

conceptScroll.addEventListener('scroll',()=>{const top=conceptScroll.getBoundingClientRect().top+90;let selected=0;brandViews.forEach((view,i)=>{if(view.getBoundingClientRect().top<=top+10)selected=i;});brandNav.querySelectorAll('button').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===selected)));},{passive:true});
