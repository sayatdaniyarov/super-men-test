"use strict";
/* ================= Super-Мен: Айназдың оқу ойыны ================= */
const $app=document.getElementById("app");
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const hl=s=>esc(s).replace(/\*(.+?)\*/g,"<mark>$1</mark>").replace(/\n/g,"<br>");
const fmt=s=>Math.floor(s/60)+":"+String(s%60).padStart(2,"0");
const store={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};

/* ---------- Профиль ---------- */
const DEF={xp:0,correct:0,rounds:0,badges:[],best:{},blitz:0,streak:0,last:"",day:"",dayRounds:0};
const P=Object.assign({},DEF,store.get("sm_profile",{}));
const saveP=()=>store.set("sm_profile",P);
const dstr=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const today=()=>dstr(new Date());
const yesterday=()=>{const d=new Date();d.setDate(d.getDate()-1);return dstr(d)};
const curStreak=()=>(P.last===today()||P.last===yesterday())?P.streak:0;
const dayRounds=()=>P.day===today()?P.dayRounds:0;
const LV=[0,150,350,600,900,1300,1800,2400,3100,4000,5000];
const LVN=["Жас зерттеуші","Білімқұмар","Тапқыр","Ақылды жұлдыз","Ой шебері","Супер-оқушы","Білім батыры","Алтын жұлдыз","Данышпан","Супер-Айназ","Аңыз"];
const levelOf=x=>{let l=0;LV.forEach((v,i)=>{if(x>=v)l=i});return l};
function addRound(correct,xp){
  const t=today();
  if(P.last!==t){P.streak=P.last===yesterday()?P.streak+1:1;P.last=t}
  if(P.day!==t){P.day=t;P.dayRounds=0}
  P.dayRounds++;P.rounds++;P.correct+=correct;
  const b=levelOf(P.xp);P.xp+=xp;const a=levelOf(P.xp);saveP();
  return a>b?a:null;
}
const BADGES=[
  {id:"first",t:"Алғашқы қадам",d:"Алғашқы раундты аяқта"},
  {id:"perfect",t:"Мінсіз раунд",d:"Бір де қатесіз шеш"},
  {id:"table",t:"Кесте шебері",d:"Көбейту кестесін қатесіз шеш"},
  {id:"units",t:"Өлшем білгірі",d:"Ұзындық, уақыт, масса — әрқайсысынан 3 жұлдыз"},
  {id:"words",t:"Сөз зергері",d:"Қазақ тілінен қатесіз шеш"},
  {id:"fast",t:"Найзағай",d:"Әр сұраққа орта есеппен 20 секундтан аз жұмса"},
  {id:"blitz",t:"Блиц батыры",d:"Блицте 20 дұрыс жауап бер"},
  {id:"combo",t:"Комбо шебері",d:"Қатарынан 10 дұрыс жауап"},
  {id:"d3",t:"3 күн қатарынан",d:"3 күн қатарынан жаттық"},
  {id:"d7",t:"Апта бойы",d:"7 күн қатарынан жаттық"},
  {id:"c100",t:"100 дұрыс жауап",d:"Барлығы 100 дұрыс жауап жина"},
  {id:"book",t:"Кітап құмар",d:"Кітап тестінен 80% жина"},
  {id:"lv6",t:"Супер-оқушы",d:"6-деңгейге жет"}
];
function award(id,list){if(!P.badges.includes(id)){P.badges.push(id);list.push(id)}}
function commonBadges(list){
  award("first",list);
  if(["len","time","mass"].every(k=>P.best[k]&&P.best[k].stars===3))award("units",list);
  if(P.streak>=3)award("d3",list);if(P.streak>=7)award("d7",list);
  if(P.correct>=100)award("c100",list);if(levelOf(P.xp)>=5)award("lv6",list);
  saveP();
}
const totalStars=()=>Object.values(P.best).reduce((s,b)=>s+(b.stars||0),0)+Object.values(store.get("sm_bookstars",{})).reduce((s,v)=>s+v,0);

/* ---------- Дыбыс ---------- */
let soundOn=store.get("sm_sound",true),actx=null;
function tone(freqs,dur=.12,type="triangle",vol=.08){
  if(!soundOn)return;
  try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();const t=actx.currentTime;
    freqs.forEach((f,i)=>{const o=actx.createOscillator(),g=actx.createGain();o.type=type;o.frequency.value=f;
      g.gain.setValueAtTime(0,t+i*dur);g.gain.linearRampToValueAtTime(vol,t+i*dur+.01);g.gain.exponentialRampToValueAtTime(.0001,t+i*dur+dur);
      o.connect(g).connect(actx.destination);o.start(t+i*dur);o.stop(t+i*dur+dur+.02)})}catch(e){}
}
const sfx={ok:()=>tone([660,880],.1),bad:()=>tone([300,220],.14,"sawtooth",.05),win:()=>tone([523,659,784,1046],.13),
  tick:()=>tone([1000],.04,"square",.025),lvl:()=>tone([523,659,784,1046,1318],.12),combo:()=>tone([784,988,1175],.07)};

/* ---------- Иконкалар ---------- */
const I={
  star:(f,s="var(--ink)")=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4L2.8 9.3l6.4-.8z" fill="${f}" stroke="${s}" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  back:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  close:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>`,
  snd:on=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/>${on?'<path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>':'<path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>'}</svg>`,
  clock:`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13" r="8" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M12 9v4l3 2M9 2h6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>`,
  bolt:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2L4 14h7l-1 8 9-12h-7z" fill="var(--sun)" stroke="var(--ink)" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  flame:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-6 1-9.5z" fill="var(--flame)" stroke="var(--ink)" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  medal:(on=true)=>`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M15 3h8l3 14h-8zM33 3h-8l-3 14h8z" fill="${on?"var(--hero)":"var(--lock)"}" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round"/><circle cx="24" cy="30" r="14" fill="${on?"var(--sun)":"var(--lock)"}" stroke="var(--ink)" stroke-width="2.5"/><path d="M24 22l2.4 5 5.4.6-4 3.7 1.1 5.4L24 34l-4.9 2.7 1.1-5.4-4-3.7 5.4-.6z" fill="${on?"#fff":"var(--paper)"}" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  book:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5c3-1 6-1 9 1 3-2 6-2 9-1v14c-3-1-6-1-9 1-3-2-6-2-9-1z M12 6v14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/></svg>`,
  del:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5h11v14H9l-6-7z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M12 9l5 6M17 9l-5 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  check:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
};

/* ---------- Ортақ бөліктер ---------- */
function topbar(o={}){
  return `<header class="bar">${o.back?`<button class="iconbtn" id="back" aria-label="Артқа">${I.back}</button>`:`<div class="logo">SUPER-МЕН</div>`}
  ${o.title?`<h1 class="ttl">${esc(o.title)}</h1>`:""}
  <div class="bar-r"><div class="pts" aria-label="XP">${I.bolt}<span>${P.xp}</span></div>
  <button class="iconbtn" id="snd" aria-label="${soundOn?"Дыбысты өшіру":"Дыбысты қосу"}">${I.snd(soundOn)}</button></div></header>`;
}
function bindBar(backFn){
  const s=document.getElementById("snd");
  if(s)s.onclick=()=>{soundOn=!soundOn;store.set("sm_sound",soundOn);s.innerHTML=I.snd(soundOn);if(soundOn)sfx.ok()};
  const b=document.getElementById("back");if(b&&backFn)b.onclick=backFn;
}
let screen="hub";
function go(html,after){stopFx();$app.innerHTML=html;window.scrollTo(0,0);after&&after()}
function installHint(){
  const ios=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
  const standalone=navigator.standalone===true||matchMedia("(display-mode: standalone)").matches;
  if(!ios||standalone||store.get("sm_hide_install",false))return "";
  return `<div class="install"><span>Қолданба ретінде орнату: <b>Бөлісу</b> батырмасын басып, <b>«На экран „Домой“»</b> таңда.</span><button id="hideInstall" aria-label="Жабу">✕</button></div>`;
}

/* ================= Басты бет ================= */
function hub(){
  screen="hub";stopTimer();
  const l=levelOf(P.xp),lo=LV[l],hi=LV[l+1],pct=hi?((P.xp-lo)/(hi-lo))*100:100,dr=dayRounds(),st=curStreak();
  go(`${topbar()}
  <section class="panel prof">
    <div class="ava">${I.star("var(--sun)")}<b>${l+1}</b></div>
    <div class="prof-main">
      <p class="hi">Сәлем, <span>Айназ!</span></p>
      <p class="rank">${LVN[l]} · ${l+1}-деңгей</p>
      <div class="xpbar" role="progressbar" aria-valuenow="${Math.round(pct)}" aria-valuemin="0" aria-valuemax="100"><div style="width:${pct}%"></div></div>
      <p class="xptxt">${hi?`${P.xp} / ${hi} XP · келесі деңгейге ${hi-P.xp} XP қалды`:`${P.xp} XP · ең жоғары деңгей!`}</p>
    </div>
  </section>
  <div class="chips">
    <div class="chip">${I.flame}<b>${st}</b><span>күн қатарынан</span></div>
    <div class="chip">${I.star("var(--sun)")}<b>${totalStars()}</b><span>жұлдыз</span></div>
    <button class="chip" id="toBadges">${I.medal(true)}<b>${P.badges.length}/${BADGES.length}</b><span>марапат</span></button>
  </div>
  <section class="panel goal">
    <div><b>Бүгінгі мақсат</b><span>${dr>=3?"Орындалды! Жарайсың!":`Тағы ${3-dr} раунд шеш`}</span></div>
    <div class="dots">${[0,1,2].map(i=>`<i class="${i<dr?"on":""}">${i<dr?I.check:i+1}</i>`).join("")}</div>
  </section>
  ${installHint()}
  <div class="subjects">
    <button class="subj s-math" data-s="math"><span class="sic">+×</span><span class="stx"><b>Математика</b><small>Өлшем бірліктері, көбейту кестесі</small></span></button>
    <button class="subj s-kaz" data-s="kaz"><span class="sic">Аә</span><span class="stx"><b>Қазақ тілі</b><small>Сөз таптары, антоним, буын</small></span></button>
    <button class="subj s-book" data-s="book"><span class="sic">${I.book}</span><span class="stx"><b>Кітап тесті</b><small>«SUPER-МЕН» әңгімелері бойынша</small></span></button>
  </div>
  <p class="foot">Раунд сайын XP жина, жаңа деңгейлер мен марапаттарды аш!</p>`,()=>{
    bindBar();
    document.querySelectorAll(".subj").forEach(b=>b.onclick=()=>b.dataset.s==="book"?bookHome():subject(b.dataset.s));
    document.getElementById("toBadges").onclick=badges;
    const h=document.getElementById("hideInstall");if(h)h.onclick=()=>{store.set("sm_hide_install",true);h.parentElement.remove()};
  });
}

/* ================= Пән беті ================= */
const IDS={math:["len","time","mass","mul","mixm","blitz"],kaz:["pos","lex","syl","mixk"]};
function subject(s){
  screen="subject";
  go(`${topbar({back:1,title:s==="math"?"Математика":"Қазақ тілі"})}
  <p class="lead2">${s==="math"?"Тақырыпты таңда. Әр раундта уақыт шектеулі — асық, бірақ абай бол!":"Тақырыпты таңда. Ережені оқып ал да, уақыт біткенше шеш!"}</p>
  <div class="topics">${IDS[s].map(id=>{const T=TOPICS[id],b=P.best[id];
    return `<button class="topic" data-t="${id}"><span class="tbadge" style="background:${T.c}">${esc(T.badge)}</span>
    <span class="tmain"><b>${esc(T.title)}</b><small>${esc(T.sub)}</small><span class="tinfo">${I.clock}${T.blitz?"60 секунд":`${T.n} сұрақ · әр сұраққа ${QT} сек`}</span></span>
    <span class="tstars">${T.blitz?`<b>${P.blitz||0}</b><small>рекорд</small>`:[0,1,2].map(k=>I.star(b&&k<b.stars?"var(--sun)":"var(--paper)")).join("")}</span></button>`}).join("")}</div>`,()=>{
    bindBar(hub);document.querySelectorAll(".topic").forEach(b=>b.onclick=()=>intro(b.dataset.t));
  });
}
function intro(id){
  screen="intro";const T=TOPICS[id];
  go(`${topbar({back:1,title:T.title})}
  <section class="panel intro">
    <span class="tbadge big" style="background:${T.c}">${esc(T.badge)}</span>
    <h2>${esc(T.title)}</h2><p class="sub">${esc(T.sub)}</p>
    <div class="rule"><b>Есте сақта!</b><ul>${T.rule.map(r=>`<li>${esc(r)}</li>`).join("")}</ul></div>
    <div class="ibox">${T.blitz?`<div>${I.clock}<b>60 сек</b><span>уақыт</span></div><div>${I.bolt}<b>${P.blitz||0}</b><span>рекорд</span></div>`
      :`<div><b>${T.n}</b><span>сұрақ</span></div><div>${I.clock}<b>${QT} сек</b><span>әр сұраққа</span></div><div>${I.star("var(--sun)")}<b>${(P.best[id]&&P.best[id].stars)||0}/3</b><span>жұлдыз</span></div>`}</div>
    <p class="sub">Дұрыс жауап +10 XP. Қатарынан 3 дұрыс — комбо, әр жауапқа +5 XP. Әр сұраққа 60 секунд беріледі. Тез жауап берсең — уақыт бонусы!</p>
    <button class="big" id="go">Бастау!</button>
  </section>`,()=>{bindBar(()=>subject(T.subj));document.getElementById("go").onclick=()=>startRound(id)});
}

/* ================= Раунд ================= */
let R=null,timer=null;
const QT=60; /* әр сұраққа берілетін уақыт, секунд */
const fullMs=()=>R.T.blitz?R.T.time*1000:QT*1000;
function makeList(gen,n){const out=[],seen=new Set();let g=0;while(out.length<n&&g<n*60){g++;const q=gen();if(seen.has(q.key))continue;seen.add(q.key);out.push(q)}return out}
function startRound(id){
  const T=TOPICS[id];
  R={id,T,list:makeList(T.gen,T.blitz?70:T.n),i:0,correct:0,pts:0,streak:0,bestStreak:0,wrong:[],left:T.blitz?T.time*1000:QT*1000,used:0,saved:0,running:false,input:"",timeUp:false};
  tone([440],.05,"sine",.0001);screen="round";showQ();startTimer();
}
function startTimer(){
  stopTimer();let last=performance.now(),lastSec=Math.ceil(R.left/1000);
  timer=setInterval(()=>{const now=performance.now();if(R.running&&!document.hidden&&!document.querySelector(".modal")){R.left-=now-last;R.used+=now-last}last=now;
    if(R.left<=0){R.left=0;drawTimer();if(R.T.blitz){stopTimer();timeUp()}else qTimeUp();return}
    const s=Math.ceil(R.left/1000);if(s!==lastSec){lastSec=s;if(s<=10&&R.running)sfx.tick()}
    drawTimer()},100);
}
function stopTimer(){if(timer){clearInterval(timer);timer=null}}
function drawTimer(){const el=document.getElementById("tmr");if(!el||!R)return;const s=Math.ceil(R.left/1000);
  el.querySelector("span").textContent=fmt(s);el.classList.toggle("hot",s<=10);
  el.querySelector(".ring").style.setProperty("--p",(R.left/fullMs()*100).toFixed(1)+"%")}
function showQ(){
  const q=R.list[R.i];if(!q){finish();return}
  R.input="";R.cur={q,done:false};
  if(!R.T.blitz)R.left=QT*1000;
  const T=R.T,n=R.list.length;
  const prog=T.blitz?`<div class="blitzc">${I.bolt}<b>${R.correct}</b><span>дұрыс</span></div>`
    :`<div class="track"><div class="fill" style="width:${R.i/n*100}%"></div></div><span class="count">${R.i+1}/${n}</span>`;
  go(`<div class="hud"><button class="iconbtn" id="quit" aria-label="Шығу">${I.close}</button>${prog}
    <div class="tmr" id="tmr"><i class="ring"></i><span>${fmt(Math.ceil(R.left/1000))}</span></div></div>
  <section class="panel qcard" id="qc">
    <div class="qmeta"><span class="pill" style="background:${T.c};color:#fff">${esc(T.title)}</span>
      <span class="ptsmall">${I.star("var(--sun)")}<span id="pts">${R.pts}</span></span>
      ${R.streak>=3?`<span class="combo">Комбо ×${R.streak}</span>`:""}</div>
    ${q.k==="num"?`<p class="qlabel">Бос орынды толтыр</p><div class="expr"><span>${esc(q.pre)}</span><span class="blank" id="blank">?</span><span>${esc(q.post)}</span></div>`
      :`${q.quote?`<blockquote class="quote">${hl(q.quote)}</blockquote>`:""}<h2 class="qtext">${esc(q.q)}</h2>
       <div class="opts ${q.opts.every(o=>o.length<=3)?"three":q.opts.every(o=>o.length<=16)?"two":""}">${q.opts.map((o,i)=>`<button class="opt" data-i="${i}"><span class="k">${i+1}</span><span>${esc(o)}</span></button>`).join("")}</div>`}
    <div id="fb"></div>
  </section>
  ${q.k==="num"?`<div class="pad" id="pad">${[1,2,3,4,5,6,7,8,9,"del",0,"ok"].map(x=>`<button class="key ${x==="ok"?"k-ok":x==="del"?"k-del":""}" data-k="${x}" aria-label="${x==="del"?"Өшіру":x==="ok"?"Тексеру":x}">${x==="del"?I.del:x==="ok"?"Тексеру":x}</button>`).join("")}</div>`:""}`,()=>{
    drawTimer();R.running=true;
    document.getElementById("quit").onclick=askQuit;
    if(q.k==="num")document.querySelectorAll(".key").forEach(b=>b.onclick=()=>press(b.dataset.k));
    else document.querySelectorAll(".opt").forEach(b=>b.onclick=()=>choose(+b.dataset.i));
  });
}
function press(k){
  if(R.cur.done)return;
  if(k==="ok"){if(!R.input){const b=document.getElementById("blank");b.classList.remove("nudge");void b.offsetWidth;b.classList.add("nudge");return}
    resolve(Number(R.input)===R.cur.q.a,R.input,document.getElementById("blank"));return}
  if(k==="del")R.input=R.input.slice(0,-1);else if(R.input.length<5)R.input=(R.input==="0"?"":R.input)+k;
  const b=document.getElementById("blank");b.textContent=R.input||"?";b.classList.toggle("filled",!!R.input);
}
function choose(i){
  if(R.cur.done)return;const q=R.cur.q,btns=document.querySelectorAll(".opt"),ok=q.opts[i]===q.a;
  btns.forEach((b,j)=>{b.disabled=true;if(q.opts[j]===q.a)b.classList.add("ok");else if(j===i)b.classList.add("bad");else b.classList.add("dim")});
  resolve(ok,q.opts[i],btns[i]);
}
const PRAISE=["Жарайсың!","Керемет!","Тамаша!","Дұрыс!","Супер!","Міне, нағыз Супер-қыз!"];
const OOPS=["Қап, қателестің","Ештеңе етпейді","Келесі жолы табасың"];
const ansText=q=>q.k==="num"?(q.pre+q.a+q.post).trim():q.a;
function resolve(ok,given,el){
  R.cur.done=true;const q=R.cur.q,T=R.T;
  if(!T.blitz)R.running=false;
  const pad=document.getElementById("pad");if(pad)pad.classList.add("off");
  if(ok){
    if(!T.blitz)R.saved+=Math.floor(R.left/1000);
    R.correct++;R.streak++;R.bestStreak=Math.max(R.bestStreak,R.streak);
    const bonus=R.streak>=3?5:0;R.pts+=10+bonus;
    if(el&&el.id==="blank")el.classList.add("ok");
    sfx.ok();if(R.streak===3||R.streak===6||R.streak===10)setTimeout(sfx.combo,120);
    pop(`+${10+bonus}`,el);burst(el);
    document.getElementById("pts").textContent=R.pts;
    if(!T.blitz)document.getElementById("fb").innerHTML=`<div class="fb ok slim" role="status"><h4>${pick(PRAISE)}${R.streak>=3?` · Комбо ×${R.streak}`:""}</h4></div>`;
    setTimeout(next,T.blitz?380:850);
  }else{
    R.streak=0;R.wrong.push({q,given});sfx.bad();
    if(el&&el.id==="blank"){el.classList.add("bad")}
    if(T.blitz){document.getElementById("fb").innerHTML=`<div class="fb bad slim" role="status"><h4>Дұрысы: ${esc(ansText(q))}</h4></div>`;setTimeout(next,1200);return}
    document.getElementById("fb").innerHTML=`<div class="fb bad" role="status"><h4>${pick(OOPS)}</h4>
      <p>Дұрыс жауабы: <b>${esc(ansText(q))}</b></p><p>${esc(q.e)}</p><span class="story">Уақыт тоқтап тұр — асықпай оқы.</span></div>
      <div class="row" style="margin-top:12px"><button class="big blue" id="next">Келесі</button></div>`;
    const nx=document.getElementById("next");nx.onclick=next;nx.scrollIntoView({behavior:"smooth",block:"nearest"});
  }
}
function next(){
  if(!R||screen!=="round")return;
  R.i++;
  if(R.T.blitz&&R.i>=R.list.length-5)R.list=R.list.concat(makeList(R.T.gen,30));
  if(R.i>=R.list.length){finish();return}
  showQ();
}
function askQuit(){
  modal(`<h3 class="mtitle">Раундты тоқтатасың ба?</h3><p class="sub">Нәтиже сақталмайды.</p>`,[
    {t:"Жалғастыру",cls:"blue"},{t:"Иә, шығу",cls:"alt",fn:()=>{stopTimer();const s=R.T.subj;R=null;subject(s)}}]);
}
function qTimeUp(){
  if(!R||!R.cur||R.cur.done)return;
  const q=R.cur.q;R.cur.done=true;R.running=false;R.streak=0;R.wrong.push({q,given:"уақыт бітті"});sfx.bad();
  const pad=document.getElementById("pad");if(pad)pad.classList.add("off");
  document.querySelectorAll(".opt").forEach(b=>{b.disabled=true;if(b.querySelector("span:last-child").textContent===q.a)b.classList.add("ok");else b.classList.add("dim")});
  document.getElementById("fb").innerHTML=`<div class="fb bad" role="status"><h4>Уақыт бітті!</h4>
    <p>Дұрыс жауабы: <b>${esc(ansText(q))}</b></p><p>${esc(q.e)}</p><span class="story">Келесі сұраққа тағы ${QT} секунд беріледі.</span></div>
    <div class="row" style="margin-top:12px"><button class="big blue" id="next">Келесі</button></div>`;
  const nx=document.getElementById("next");nx.onclick=next;nx.scrollIntoView({behavior:"smooth",block:"nearest"});
}
function timeUp(){
  if(!R)return;R.running=false;R.timeUp=true;sfx.bad();
  const o=document.createElement("div");o.className="toast";o.innerHTML=`${I.clock}<b>Уақыт бітті!</b>`;document.body.appendChild(o);
  setTimeout(()=>{o.remove();finish()},1400);
}
function finish(){
  stopTimer();if(!R)return;screen="result";
  const T=R.T,id=R.id,answered=Math.min(R.i+(R.cur&&R.cur.done&&R.timeUp?1:0),R.list.length);
  const n=T.blitz?R.correct+R.wrong.length:R.list.length;
  const allDone=!T.blitz&&!R.timeUp;
  const secLeft=Math.ceil(R.left/1000);
  const stars=T.blitz?(R.correct>=20?3:R.correct>=14?2:R.correct>=8?1:0):(r=>r>=.9?3:r>=.7?2:r>=.5?1:0)(R.correct/n);
  const tBonus=T.blitz?0:Math.round(R.saved/6),xp=R.pts+tBonus+stars*10;
  let rec=false;const prev=P.best[id];
  if(T.blitz){if(R.correct>(P.blitz||0)){P.blitz=R.correct;rec=!!prev}P.best[id]={stars:Math.max(prev?prev.stars:0,stars)}}
  else if(!prev||stars>prev.stars||(stars===prev.stars&&R.correct>prev.c)){P.best[id]={stars,c:R.correct,n};rec=!!prev}
  const lvUp=addRound(R.correct,xp);
  const nb=[];
  if(!T.blitz&&R.correct===n&&!R.timeUp){award("perfect",nb);if(id==="mul")award("table",nb);if(T.subj==="kaz")award("words",nb)}
  if(!T.blitz&&R.correct>=n*.8&&R.used<=n*20000)award("fast",nb);
  if(T.blitz&&R.correct>=20)award("blitz",nb);
  if(R.bestStreak>=10)award("combo",nb);
  commonBadges(nb);
  const skipped=T.blitz?0:R.list.length-answered;
  const v=[["Тағы бір рет көрейік!","Ережені қайта оқып, тағы шешіп көр. Міндетті түрде үйренесің!"],["Жақсы бастама!","Қате кеткен сұрақтарды қайталасаң, нәтижең бірден өседі."],
    ["Өте жақсы!","Сәл ғана қалды — келесі жолы 3 жұлдыз аласың!"],["Сен — нағыз чемпион!","Керемет нәтиже! Супер-Айназ!"]][stars];
  const used=T.blitz?T.time-secLeft:Math.round(R.used/1000);
  go(`${topbar()}
  <section class="panel res">
    <div class="bigstars">${[0,1,2].map(k=>`<span class="bs ${k<stars?"on":""}" style="animation-delay:${.2+k*.25}s">${I.star(k<stars?"var(--sun)":"var(--paper)")}</span>`).join("")}</div>
    <h2 class="verdict">${v[0]}</h2>
    <div class="score">${R.correct}<small> / ${n}</small></div>
    <p class="sub">${R.timeUp&&!T.blitz?`Уақыт бітті! Үлгермеген сұрақтар: ${skipped}. `:""}${v[1]}${rec?" Жаңа рекорд!":""}</p>
    <div class="stats">
      <div class="stat"><b>+${xp}</b><span>XP${tBonus?` (уақыт бонусы +${tBonus})`:""}</span></div>
      <div class="stat"><b>${fmt(Math.max(0,used))}</b><span>уақыт</span></div>
      <div class="stat"><b>${R.bestStreak}</b><span>қатарынан дұрыс</span></div>
    </div>
    ${nb.length?`<div class="newb">${nb.map(b=>{const B=BADGES.find(x=>x.id===b);return `<span>${I.medal(true)}${esc(B.t)}</span>`}).join("")}</div>`:""}
    <div class="row" style="width:100%"><button class="big" id="again">Қайта ойнау</button><button class="big alt" id="topics">Тақырыптар</button></div>
    ${R.wrong.length?`<h2 class="sec" style="align-self:flex-start">Қате кеткен сұрақтар</h2><div class="review">${R.wrong.map(w=>`<div class="rv">
      <p class="q">${w.q.k==="num"?esc(w.q.pre+"?"+w.q.post):(w.q.quote?esc(w.q.quote.replace(/\*/g,"").replace(/\n/g," / "))+" — ":"")+esc(w.q.k==="num"?"":w.q.q)}</p>
      <p class="y">Сенің жауабың: ${esc(w.given)}</p><p class="a">Дұрыс жауабы: ${esc(ansText(w.q))}</p><p class="s">${esc(w.q.e)}</p></div>`).join("")}</div>`:""}
  </section>`,()=>{
    bindBar();document.getElementById("again").onclick=()=>intro(id);document.getElementById("topics").onclick=()=>subject(T.subj);
  });
  if(stars){sfx.win();confetti(stars*55)}
  celebrate(lvUp,nb);
}
function celebrate(lvUp,nb){
  const queue=[];
  if(lvUp!==null)queue.push(()=>{sfx.lvl();confetti(120);modal(`<div class="ava big">${I.star("var(--sun)")}<b>${lvUp+1}</b></div><h3 class="mtitle">Жаңа деңгей!</h3><p class="sub"><b>${lvUp+1}-деңгей: ${esc(LVN[lvUp])}</b></p>`,[{t:"Керемет!",fn:nextC}])});
  nb.forEach(b=>{const B=BADGES.find(x=>x.id===b);queue.push(()=>{sfx.combo();modal(`<div class="mmedal">${I.medal(true)}</div><h3 class="mtitle">Жаңа марапат!</h3><p class="sub"><b>${esc(B.t)}</b><br>${esc(B.d)}</p>`,[{t:"Жарайсың!",fn:nextC}])})});
  function nextC(){const f=queue.shift();if(f)setTimeout(f,250)}
  setTimeout(nextC,900);
}
function modal(html,btns){
  const m=document.createElement("div");m.className="modal";m.setAttribute("role","dialog");
  m.innerHTML=`<div class="mbox panel">${html}<div class="row">${btns.map((b,i)=>`<button class="big ${b.cls||""}" data-i="${i}">${esc(b.t)}</button>`).join("")}</div></div>`;
  document.body.appendChild(m);
  m.querySelectorAll("button[data-i]").forEach(el=>el.onclick=()=>{m.remove();const f=btns[+el.dataset.i].fn;f&&f()});
  m.querySelector("button").focus();
}

/* ================= Марапаттар ================= */
function badges(){
  screen="badges";
  go(`${topbar({back:1,title:"Марапаттар"})}
  <p class="lead2">${P.badges.length} / ${BADGES.length} марапат ашылды. Барлығын жина!</p>
  <div class="bgrid">${BADGES.map(B=>{const on=P.badges.includes(B.id);return `<div class="bdg ${on?"":"lock"}">${I.medal(on)}<b>${esc(B.t)}</b><small>${esc(B.d)}</small></div>`}).join("")}</div>
  <section class="panel lvls"><h2 class="sec">Деңгейлер</h2>${LVN.map((t,i)=>`<div class="lv ${levelOf(P.xp)>=i?"on":""}"><i>${i+1}</i><span>${esc(t)}</span><small>${LV[i]} XP</small></div>`).join("")}</section>`,()=>bindBar(hub));
}

/* ================= Кітап тесті ================= */
const MODES=[
  {id:"mix",tag:"Аралас",cls:"t-sun",title:"Жылдам тест",desc:"Екі кітаптан 20 сұрақ",pick:()=>sample(Q,20)},
  {id:"b1",tag:"1-кітап",cls:"t-red",title:B1,desc:Q.filter(x=>x.b===1).length+" сұрақ · Мансұр мен Айдана",pick:()=>shuffle(Q.filter(x=>x.b===1))},
  {id:"b2",tag:"2-кітап",cls:"t-blue",title:B2,desc:Q.filter(x=>x.b===2).length+" сұрақ · ауылдағы жаз",pick:()=>shuffle(Q.filter(x=>x.b===2))},
  {id:"all",tag:"Марафон",cls:"t-leaf",title:"Барлық сұрақ",desc:Q.length+" сұрақ · нағыз чемпионға",pick:()=>shuffle(Q.slice())}
];
let S=null;
function bookHome(){
  screen="book";const best=store.get("sm_best",{});
  go(`${topbar({back:1,title:"Кітап тесті"})}
  <p class="lead2">Сұрақтар «SUPER-МЕН» кітапшаларындағы әңгімелер бойынша. Дұрыс жауап — 10 XP, кеңес алсаң — 5 XP.</p>
  <div class="modes">${MODES.map(m=>{const b=best[m.id];
    return `<button class="mode" data-m="${m.id}"><span class="tag ${m.cls}">${m.tag}</span><h3>${esc(m.title)}</h3><p>${esc(m.desc)}</p>
    <span class="best">${b?`Ең жақсы нәтиже: ${b.c}/${b.n} · ${b.p} ұпай`:"Әлі шешілмеген"}</span></button>`}).join("")}</div>`,()=>{
    bindBar(hub);document.querySelectorAll(".mode").forEach(b=>b.onclick=()=>{const m=MODES.find(x=>x.id===b.dataset.m);bookStart(m.id,m.pick())});
  });
}
function bookStart(mode,list){S={mode,list,i:0,pts:0,correct:0,streak:0,bestStreak:0,wrong:[]};tone([440],.05,"sine",.0001);screen="bookq";bookQ()}
function bookQ(){
  const q=S.list[S.i],n=S.list.length,tf=q.t==="tf",opts=tf?["Дұрыс","Бұрыс"]:shuffle([q.a,...q.w]);
  S.cur={q,opts,hint:false,done:false};
  const label=tf?"Дұрыс па, бұрыс па?":(q.t==="who"?"Кім айтты?":"Сұрақ");
  go(`<div class="hud"><button class="iconbtn" id="home" aria-label="Шығу">${I.close}</button>
    <div class="track"><div class="fill" style="width:${S.i/n*100}%"></div></div><span class="count">${S.i+1}/${n}</span>
    <div class="pts">${I.star("var(--sun)")}<span id="pts">${S.pts}</span></div></div>
  <section class="panel qcard">
    <div class="qmeta"><span class="pill ${q.b===1?"t-red":"t-blue"}">${q.b}-кітап</span><span class="pill t-sun">${label}</span>${S.streak>=3?`<span class="combo">Комбо ×${S.streak}</span>`:""}</div>
    ${q.t==="who"?`<blockquote class="quote">${esc(q.quote)}</blockquote>`:""}
    <h2 class="qtext">${esc(q.t==="who"?"Бұл сөзді кім айтты?":q.q)}</h2>
    <div class="opts ${tf?"tf":""}">${opts.map((o,k)=>`<button class="opt" data-o="${esc(o)}">${tf?"":`<span class="k">${k+1}</span>`}<span>${esc(o)}</span></button>`).join("")}</div>
    <div class="tools" id="tools"><button class="ghost" id="hint">Кеңес: қай әңгіме?</button></div>
    <div id="fb"></div>
  </section>`,()=>{
    bindBar();
    document.getElementById("home").onclick=()=>modal(`<h3 class="mtitle">Тестті тоқтатасың ба?</h3>`,[{t:"Жалғастыру",cls:"blue"},{t:"Иә, шығу",cls:"alt",fn:bookHome}]);
    document.getElementById("hint").onclick=e=>{S.cur.hint=true;e.target.outerHTML=`<span class="hintbox">Әңгіме: «${esc(q.s)}»</span>`};
    document.querySelectorAll(".opt").forEach(b=>b.onclick=()=>bookAnswer(b));
  });
}
function bookAnswer(btn){
  if(S.cur.done)return;S.cur.done=true;
  const q=S.cur.q,pick_=btn.dataset.o,ok=pick_===q.a;
  document.querySelectorAll(".opt").forEach(b=>{b.disabled=true;if(b.dataset.o===q.a)b.classList.add("ok");else if(b===btn)b.classList.add("bad");else b.classList.add("dim")});
  if(ok){S.correct++;S.streak++;S.bestStreak=Math.max(S.bestStreak,S.streak);const g=S.cur.hint?5:10;S.pts+=g;sfx.ok();burst(btn);pop("+"+g,btn)}
  else{S.streak=0;S.wrong.push({q,pick:pick_});sfx.bad()}
  document.getElementById("pts").textContent=S.pts;
  const last=S.i===S.list.length-1;document.getElementById("tools").remove();
  document.getElementById("fb").innerHTML=`<div class="fb ${ok?"ok":"bad"}" role="status">
    <h4>${ok?pick(PRAISE)+(S.cur.hint?" +5":" +10"):pick(OOPS)}</h4>${ok?"":`<p>Дұрыс жауабы: <b>${esc(q.a)}</b></p>`}
    <p>${esc(q.e)}</p><span class="story">Әңгіме: «${esc(q.s)}» · ${q.b===1?B1:B2}</span></div>
    <div class="row" style="margin-top:14px"><button class="big ${ok?"blue":""}" id="next">${last?"Нәтижені көру":"Келесі сұрақ"}</button></div>`;
  const nx=document.getElementById("next");nx.onclick=()=>{S.i++;S.i<S.list.length?bookQ():bookResults()};nx.scrollIntoView({behavior:"smooth",block:"nearest"});
}
function bookResults(){
  screen="bookr";
  const n=S.list.length,c=S.correct,pct=c/n,stars=pct>=.95?3:pct>=.8?2:pct>=.6?1:0;
  const best=store.get("sm_best",{});const prev=best[S.mode];const isBest=S.mode!=="retry"&&(!prev||S.pts>prev.p);
  if(isBest){best[S.mode]={c,n,p:S.pts};store.set("sm_best",best);const bs=store.get("sm_bookstars",{});bs[S.mode]=Math.max(bs[S.mode]||0,stars);store.set("sm_bookstars",bs)}
  const xp=S.pts+stars*10,lvUp=addRound(c,xp),nb=[];
  if(pct>=.8&&n>=20)award("book",nb);if(S.bestStreak>=10)award("combo",nb);commonBadges(nb);
  const v=[["Тағы бір рет көрейік!","Әңгімелерді қайта оқып, тағы шешіп көр."],["Жақсы бастама!","Қате кеткен сұрақтарды қайталасаң, нәтижең бірден өседі."],["Өте жақсы!","Сен кітапты жақсы білесің. Сәл ғана қалды!"],["Сен — нағыз чемпион!","Керемет нәтиже! Тестке толық дайынсың."]][stars];
  go(`${topbar()}
  <section class="panel res">
    <div class="bigstars">${[0,1,2].map(k=>`<span class="bs ${k<stars?"on":""}" style="animation-delay:${.2+k*.25}s">${I.star(k<stars?"var(--sun)":"var(--paper)")}</span>`).join("")}</div>
    <h2 class="verdict">${v[0]}</h2><div class="score">${c}<small> / ${n}</small></div>
    <p class="sub">${v[1]}${isBest&&prev?" Жаңа рекорд!":""}</p>
    <div class="stats"><div class="stat"><b>+${xp}</b><span>XP</span></div><div class="stat"><b>${S.bestStreak}</b><span>қатарынан дұрыс</span></div><div class="stat"><b>${S.wrong.length}</b><span>қате</span></div></div>
    ${nb.length?`<div class="newb">${nb.map(b=>{const B=BADGES.find(x=>x.id===b);return `<span>${I.medal(true)}${esc(B.t)}</span>`}).join("")}</div>`:""}
    <div class="row" style="width:100%">${S.wrong.length?`<button class="big" id="retry">Қателерді қайта шешу</button>`:""}<button class="big ${S.wrong.length?"alt":""}" id="again">Басқа тест</button></div>
    ${S.wrong.length?`<h2 class="sec" style="align-self:flex-start">Қате кеткен сұрақтар</h2><div class="review">${S.wrong.map(w=>`<div class="rv">
      <p class="q">${esc(w.q.t==="who"?w.q.quote+" — кім айтты?":w.q.q)}</p><p class="y">Сенің жауабың: ${esc(w.pick)}</p><p class="a">Дұрыс жауабы: ${esc(w.q.a)}</p><p class="s">«${esc(w.q.s)}»</p></div>`).join("")}</div>`:""}
  </section>`,()=>{
    bindBar();const r=document.getElementById("retry");if(r)r.onclick=()=>bookStart("retry",shuffle(S.wrong.map(w=>w.q)));
    document.getElementById("again").onclick=bookHome;
  });
  if(stars){sfx.win();confetti(stars*55)}
  celebrate(lvUp,nb);
}

/* ================= Эффекттер ================= */
const cv=document.getElementById("fx"),cx=cv.getContext("2d");let parts=[],raf=null;
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
function sizeCv(){const d=devicePixelRatio||1;cv.width=innerWidth*d;cv.height=innerHeight*d;cx.setTransform(d,0,0,d,0,0)}
addEventListener("resize",sizeCv);sizeCv();
const COLS=["#E5293B","#FFC83D","#2B8FE0","#23A35A","#FF8FB1","#7C5CE6"];
function spawn(x,y,n,sp){for(let i=0;i<n;i++)parts.push({x,y,vx:(Math.random()-.5)*sp,vy:-Math.random()*sp*.9-2,r:4+Math.random()*5,c:COLS[i%COLS.length],a:Math.random()*6,va:(Math.random()-.5)*.3,life:90+Math.random()*60,star:Math.random()<.35})}
function loop(){cx.clearRect(0,0,innerWidth,innerHeight);parts=parts.filter(p=>p.life-->0&&p.y<innerHeight+30);
  for(const p of parts){p.vy+=.18;p.x+=p.vx;p.y+=p.vy;p.a+=p.va;cx.save();cx.translate(p.x,p.y);cx.rotate(p.a);cx.fillStyle=p.c;
    if(p.star){cx.beginPath();for(let k=0;k<10;k++){const r=k%2?p.r*.45:p.r*1.2,an=k*Math.PI/5;cx.lineTo(r*Math.cos(an),r*Math.sin(an))}cx.closePath();cx.fill()}
    else cx.fillRect(-p.r/2,-p.r/3,p.r,p.r*.66);cx.restore()}
  raf=parts.length?requestAnimationFrame(loop):null}
const run=()=>{if(!raf)raf=requestAnimationFrame(loop)};
function burst(el){if(reduce||!el)return;const r=el.getBoundingClientRect();spawn(r.left+r.width/2,r.top+r.height/2,16,9);run()}
function confetti(n){if(reduce)return;for(let k=0;k<3;k++)setTimeout(()=>{spawn(innerWidth*(.2+.3*k),innerHeight*.35,n/3|0,14);run()},k*220)}
function stopFx(){/* confetti fades on its own */}
function pop(t,el){if(!el)return;const r=el.getBoundingClientRect(),s=document.createElement("div");s.className="float";s.textContent=t;
  s.style.left=(r.left+r.width/2)+"px";s.style.top=(r.top-8)+"px";document.body.appendChild(s);setTimeout(()=>s.remove(),950)}

/* ================= Пернетақта ================= */
addEventListener("keydown",e=>{
  const m=document.querySelector(".modal");
  if(m){if(e.key==="Enter"||e.key==="Escape"){e.preventDefault();m.querySelector("button").click()}return}
  if(screen==="round"&&R&&R.cur){
    if(!R.cur.done){
      if(R.cur.q.k==="num"){if(/^[0-9]$/.test(e.key))press(e.key);else if(e.key==="Backspace")press("del");else if(e.key==="Enter")press("ok")}
      else if(/^[1-4]$/.test(e.key)){const b=document.querySelectorAll(".opt")[+e.key-1];if(b)b.click()}
    }else if(e.key==="Enter"){const nx=document.getElementById("next");if(nx){e.preventDefault();nx.click()}}
  }else if(screen==="bookq"&&S&&S.cur){
    if(!S.cur.done&&/^[1-4]$/.test(e.key)){const b=document.querySelectorAll(".opt")[+e.key-1];if(b)b.click()}
    else if(S.cur.done&&e.key==="Enter"){const nx=document.getElementById("next");if(nx&&document.activeElement!==nx){e.preventDefault();nx.click()}}
  }
});

hub();
if("serviceWorker" in navigator&&location.protocol!=="file:")addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
