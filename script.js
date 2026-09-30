'use strict';
const app=document.querySelector('.app');const screens=[...document.querySelectorAll('[data-screen]')];let activeScreen='home';
function closeMenus(){document.querySelectorAll('.menu-toggle').forEach(b=>b.setAttribute('aria-expanded','false'));document.querySelectorAll('.header nav').forEach(n=>n.classList.remove('is-open'))}
function showScreen(name,updateHistory=true){if(!screens.some(s=>s.dataset.screen===name))return;const previous=screens.find(s=>s.dataset.screen===activeScreen);const next=screens.find(s=>s.dataset.screen===name);if(previous!==next){previous.classList.add('is-leaving');previous.classList.remove('is-active');previous.setAttribute('aria-hidden','true');next.classList.remove('is-leaving');next.classList.add('is-active');next.setAttribute('aria-hidden','false')}activeScreen=name;app.dataset.activeScreen=name;closeMenus();if(updateHistory)history.replaceState(null,'',name==='home'?'#home':name==='concept'?'#concept':'#world');updateForest(name)}
document.querySelectorAll('[data-screen-link]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();showScreen(link.dataset.screenLink)}));
document.querySelectorAll('.menu-toggle').forEach(button=>button.addEventListener('click',()=>{const nav=button.closest('.header').querySelector('nav');const open=button.getAttribute('aria-expanded')!=='true';closeMenus();button.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open)}));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenus();if(event.key==='ArrowRight'&&activeScreen==='home')showScreen('watery');else if(event.key==='ArrowRight'&&activeScreen==='watery')showScreen('concept');else if(event.key==='ArrowLeft'&&activeScreen==='concept')showScreen('watery');else if(event.key==='ArrowLeft'&&activeScreen==='watery')showScreen('home')});
const chapters={play:'A playful world built for adventure.',explore:'Discover colorful places and unique friends.',protect:'Together, for a greener tomorrow.',more:'More of the BANORI story is coming soon.'};document.querySelectorAll('[data-chapter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-chapter]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));button.title=chapters[button.dataset.chapter]}));
const dialog=document.querySelector('#message-dialog');const dialogTitle=document.querySelector('#dialog-title');const dialogCopy=document.querySelector('#dialog-copy');function openMessage(title,copy){dialogTitle.textContent=title;dialogCopy.textContent=copy;dialog.showModal()}
document.querySelectorAll('[data-trailer]').forEach(button=>button.addEventListener('click',()=>openMessage('The adventure is coming.','The BANORI trailer is not available yet. Explore WATERY while the world continues to grow.')));document.querySelector('[data-water-action]').addEventListener('click',()=>openMessage('WATERY is growing.','The playable WATERY experience is coming soon. For now, this product board introduces its world and merge mechanic.'));document.querySelector('[data-how]').addEventListener('click',()=>openMessage('Drop. Match. Merge. Grow.','Drop fruits from above. When two identical fruits touch, they merge into one larger fruit. Keep growing your colorful farm world.'));document.querySelectorAll('.dialog-close,.dialog-done').forEach(button=>button.addEventListener('click',()=>dialog.close()));dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});

const worldScroll=document.querySelector('.world-scroll');
const forest=document.querySelector('.forest-frame');
const conceptScreen=document.querySelector('.concept-screen');
const conceptBoard=document.querySelector('.concept-board');
const conceptScroll=document.createElement('div');
conceptScroll.className='concept-scroll';
conceptScroll.tabIndex=0;
conceptScroll.setAttribute('aria-label','BANORI brand identity');
conceptBoard.before(conceptScroll);
conceptScroll.append(conceptBoard);
document.querySelectorAll('.identity-section').forEach(section=>conceptScroll.append(section));
history.scrollRestoration='manual';
function updateForest(name){
  if(name==='watery'&&!forest.getAttribute('src'))forest.src=forest.dataset.src;
  if(name==='watery'){
    worldScroll.scrollTop=0;
    requestAnimationFrame(()=>worldScroll.scrollTop=0);
    setTimeout(()=>worldScroll.scrollTop=0,250);
  }
  if(name==='concept'){
    conceptScroll.scrollTop=0;
    requestAnimationFrame(()=>conceptScroll.scrollTop=0);
  }
  screens.forEach(screen=>screen.inert=screen.dataset.screen!==name);
}
forest.addEventListener('load',()=>{
  const frameWindow=forest.contentWindow;
  frameWindow.addEventListener('keydown',event=>{
    const movement={ArrowDown:60,ArrowUp:-60,PageDown:worldScroll.clientHeight*.85,PageUp:-worldScroll.clientHeight*.85,' ':worldScroll.clientHeight*.85}[event.key];
    if(movement){event.preventDefault();worldScroll.scrollBy({top:movement,behavior:'smooth'});}
  },true);
});
showScreen(location.hash==='#concept'?'concept':['#world','#watery'].includes(location.hash)?'watery':'home',false);
if(location.hash==='#watery')worldScroll.scrollTop=document.querySelector('.watery-board').offsetTop;

