"use strict";
/* ================= FEMO олимпиадасы ================= */
const FJPG=new Set(["a20_7","a20b_4","w21b_1"]);
const fimg=n=>`img/femo/${n}.${FJPG.has(n)?"jpg":"png"}`;
const FR=Object.fromEntries(FEMO_ROUNDS.map((r,i)=>[r.id,Object.assign(r,{i,qs:FEMO_Q.filter(q=>q.r===r.id)})]));
const FQ=Object.fromEntries(FEMO_Q.map(q=>[q.id,q]));
const FRANK=[[0,"Қатысушы","var(--lock)"],[15,"Мақтау қағазы","var(--t5)"],[40,"Қола медаль","#C77B3B"],[80,"Күміс медаль","#9AA6B8"],[120,"Алтын медаль","var(--sun)"],[165,"Абсолют чемпион","var(--hero)"]];
BADGES.push(
  {id:"femo1",t:"Олимпиадашы",d:"FEMO-ның алғашқы есебін шеш"},
  {id:"femo25",t:"Ой шебері",d:"FEMO-дан 25 есеп шеш"},
  {id:"femo100",t:"Олимпиада чемпионы",d:"FEMO-дан 100 есеп шеш"},
  {id:"femoR",t:"Тур жеңімпазы",d:"FEMO турын 3 жұлдызбен аяқта"},
  {id:"femoClean",t:"Кеңессіз батыр",d:"FEMO турын кеңессіз әрі қатесіз аяқта"},
  {id:"femoDay",t:"Күн есебі ×5",d:"Күн есебін 5 рет шеш"}
);
/* P.femo[id]: 3 — бірден, кеңессіз; 2 — көмекпен шешілді; 1 — әзірге шешілмеді */
if(!P.femo)P.femo={};if(!P.femoStars)P.femoStars={};if(!P.femoDays)P.femoDays=[];
const fSolved=()=>Object.values(P.femo).filter(v=>v>=2).length;
const fWrong=()=>FEMO_Q.filter(q=>P.femo[q.id]===1);
const fRank=n=>{let r=FRANK[0];FRANK.forEach(x=>{if(n>=x[0])r=x});return r};
const fStarsTotal=()=>Object.values(P.femoStars).reduce((s,v)=>s+v,0);
function fDaily(){
  const t=today();let h=0;for(const c of t)h=(h*31+c.charCodeAt(0))>>>0;
  const pool=FEMO_Q.filter(q=>!(P.femo[q.id]>=2));const list=pool.length?pool:FEMO_Q;
  return list[h%list.length];
}
const fDailyDone=()=>P.femoDays.includes(today());

const ICUP=`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 6h20v8a10 10 0 0 1-20 0z" fill="var(--sun)" stroke="var(--ink)" stroke-width="2.5" stroke-linejoin="round"/><path d="M14 9H8a6 6 0 0 0 7 8M34 9h6a6 6 0 0 1-7 8" fill="none" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round"/><path d="M24 24v8M16 40h16l-2-8H18z" fill="var(--sun)" stroke="var(--ink)" stroke-width="2.5" stroke-linejoin="round"/></svg>`;
const IBULB=`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6 6 0 0 0-3.5 10.9V17h7v-3.1A6 6 0 0 0 12 3z" fill="var(--sun)" stroke="var(--ink)" stroke-width="1.8" stroke-linejoin="round"/><path d="M9.5 20h5" stroke="var(--ink)" stroke-width="2" stroke-linecap="round"/></svg>`;

/* ---------- Олимпиада картасы ---------- */
function femoHome(){
  screen="femo";
  const n=fSolved(),N=FEMO_Q.length,rk=fRank(n),nx=FRANK.find(x=>x[0]>n),w=fWrong(),dq=fDaily(),dd=fDailyDone();
  go(`${topbar({back:1,title:"FEMO олимпиадасы"})}
  <section class="panel fhero">
    <div class="fcup" style="background:${rk[2]}">${ICUP}</div>
    <div class="fhm">
      <p class="fk">2-сынып · 2019–2026 жылдардағы ${FEMO_ROUNDS.length} тур</p>
      <h2>${esc(rk[1])}</h2>
      <div class="xpbar"><div style="width:${n/N*100}%"></div></div>
      <p class="xptxt">${n} / ${N} есеп шешілді${nx?` · «${esc(nx[1])}» дейін ${nx[0]-n} есеп`:" · Барлығы шешілді!"}</p>
    </div>
  </section>
  <div class="fact">
    <button class="fcard fday ${dd?"done":""}" id="fDay"><span class="fbadge">${dd?I.check:"×2"}</span><b>Күн есебі</b><small>${dd?"Бүгінгі есеп шешілді! Ертең жаңасы келеді.":`${esc(FR[dq.r].t)} · ${dq.p} балл · XP екі есе!`}</small></button>
    <button class="fcard fwr" id="fWr" ${w.length?"":"disabled"}><span class="fbadge">${w.length}</span><b>Қателер жұмысы</b><small>${w.length?"Шешілмеген есептерді қайта шеш":"Қате есептер жоқ — тамаша!"}</small></button>
  </div>
  <h2 class="sec">Олимпиада жолы</h2>
  <div class="fmap">${FEMO_ROUNDS.map((r,i)=>{
    const qs=FR[r.id].qs,sv=qs.filter(q=>P.femo[q.id]>=2).length,st=P.femoStars[r.id]||0,cur=sv<qs.length&&(i===0||FEMO_ROUNDS.slice(0,i).every(x=>P.femoStars[x.id]));
    return `<button class="fnode ${i%2?"r":"l"} ${sv===qs.length?"full":""} ${cur?"cur":""}" data-r="${r.id}">
      <span class="fnum" style="--pct:${sv/qs.length*100}%"><b>${i+1}</b></span>
      <span class="fnt"><b>${esc(r.t)}</b><small>${esc(r.sub)}</small><span class="fns">${[0,1,2].map(k=>I.star(k<st?"var(--sun)":"var(--paper)")).join("")}<em>${sv}/${qs.length}</em></span></span></button>`}).join("")}
  </div>
  <p class="foot">Олимпиадада асығудың қажеті жоқ: ойлан, сызып көр, сосын жауап бер. Кеңес алсаң — жартылай ұпай.</p>`,()=>{
    bindBar(hub);
    document.querySelectorAll(".fnode").forEach(b=>b.onclick=()=>femoRoundIntro(b.dataset.r));
    document.getElementById("fDay").onclick=()=>femoStart("day",[dq]);
    const wr=document.getElementById("fWr");if(w.length)wr.onclick=()=>femoStart("wrong",w.slice(0,10));
    const c=document.querySelector(".fnode.cur");if(c)setTimeout(()=>c.scrollIntoView({block:"center",behavior:"smooth"}),300);
  });
}
function femoRoundIntro(rid){
  screen="femoi";const r=FR[rid],qs=r.qs,sv=qs.filter(q=>P.femo[q.id]>=2).length,mx=qs.reduce((s,q)=>s+q.p,0);
  go(`${topbar({back:1,title:r.t})}
  <section class="panel intro">
    <span class="tbadge big" style="background:var(--t2)">${r.i+1}</span>
    <h2>${esc(r.t)}</h2><p class="sub">${esc(r.sub)} · 2-сынып</p>
    <div class="ibox"><div><b>${qs.length}</b><span>есеп</span></div><div><b>${mx}</b><span>балл</span></div><div>${I.star("var(--sun)")}<b>${P.femoStars[rid]||0}/3</b><span>жұлдыз</span></div><div><b>${sv}</b><span>шешілді</span></div></div>
    <div class="rule"><b>Ойын ережесі</b><ul>
      <li>Әр есепке 2 мүмкіндік бар.</li><li>Бірден шешсең — толық ұпай (1 балл = 10 XP).</li>
      <li>«Кеңес» алсаң немесе екінші рет тапсаң — жартысы.</li><li>Уақыт шектелмейді — секундомер тек өзің үшін.</li></ul></div>
    <div class="row" style="width:100%;max-width:520px">
      <button class="big" id="go">Турды бастау</button>
      ${sv&&sv<qs.length?`<button class="big alt" id="go2">Шешілмегендер (${qs.length-sv})</button>`:""}
    </div>
  </section>`,()=>{
    bindBar(femoHome);
    document.getElementById("go").onclick=()=>femoStart(rid,qs);
    const g2=document.getElementById("go2");if(g2)g2.onclick=()=>femoStart(rid,qs.filter(q=>!(P.femo[q.id]>=2)),true);
  });
}

/* ---------- Есеп шешу ---------- */
let F=null,ftimer=null;
function femoStart(mode,list,partial){
  F={mode,list,i:0,xp:0,pts:0,max:list.reduce((s,q)=>s+q.p,0),clean:true,wrong:0,t0:performance.now(),log:[],partial:!!partial};
  tone([440],.05,"sine",.0001);screen="femoq";femoQ();
  clearInterval(ftimer);ftimer=setInterval(()=>{const el=document.getElementById("fclock");if(el&&!document.querySelector(".modal"))el.textContent=fmt(Math.floor((performance.now()-F.t0)/1000))},500);
}
function femoQ(){
  const q=F.list[F.i];if(!q){femoFinish();return}
  F.cur={q,tries:0,hint:false,done:false,input:""};
  const r=FR[q.r],n=F.list.length;
  go(`<div class="hud"><button class="iconbtn" id="quit" aria-label="Шығу">${I.close}</button>
    <div class="track"><div class="fill" style="width:${F.i/n*100}%"></div></div><span class="count">${F.i+1}/${n}</span>
    <div class="tmr"><span class="sw">${I.clock}</span><span id="fclock">${fmt(Math.floor((performance.now()-F.t0)/1000))}</span></div></div>
  <section class="panel qcard">
    <div class="qmeta"><span class="pill" style="background:var(--t2);color:#fff">${esc(r.t)} · №${q.n}</span><span class="pill t-sun">${q.p} балл</span>
      ${F.mode==="day"?`<span class="combo">×2 XP</span>`:""}<span class="ptsmall">${I.bolt}<span id="fxp">${F.xp}</span></span></div>
    <h2 class="qtext ftext">${esc(q.q)}</h2>
    ${q.img?`<figure class="fig"><img src="${fimg(q.img)}" alt="Есептің суреті" loading="eager"></figure>`:""}
    ${q.k==="num"?`<div class="ansrow"><span class="albl">Жауабың:</span><span class="blank fans" id="blank">?</span></div>`
      :`<div class="opts ${q.opts.every(o=>o.length<=16)?"two":""}">${q.opts.map((o,i)=>`<button class="opt" data-i="${i}"><span class="k">${i+1}</span><span>${esc(o)}</span></button>`).join("")}</div>`}
    <div class="tools" id="ftools"><button class="ghost hintb" id="fhint">${IBULB}Кеңес</button></div>
    <div id="fb"></div>
  </section>
  ${q.k==="num"?`<div class="pad" id="pad">${[1,2,3,4,5,6,7,8,9,"del",0,"ok"].map(x=>`<button class="key ${x==="ok"?"k-ok":x==="del"?"k-del":""}" data-k="${x}" aria-label="${x==="del"?"Өшіру":x==="ok"?"Тексеру":x}">${x==="del"?I.del:x==="ok"?"Тексеру":x}</button>`).join("")}</div>`:""}`,()=>{
    document.getElementById("quit").onclick=()=>modal(`<h3 class="mtitle">Олимпиададан шығасың ба?</h3><p class="sub">Шешкен есептерің сақталады.</p>`,[{t:"Жалғастыру",cls:"blue"},{t:"Иә, шығу",cls:"alt",fn:()=>{clearInterval(ftimer);femoFinish(true)}}]);
    document.getElementById("fhint").onclick=fHint;
    if(q.k==="num")document.querySelectorAll(".key").forEach(b=>b.onclick=()=>fPress(b.dataset.k));
    else document.querySelectorAll(".opt").forEach(b=>b.onclick=()=>fChoose(+b.dataset.i,b));
  });
}
function fHint(){
  const c=F.cur;if(c.done||c.hint)return;c.hint=true;
  const t=document.getElementById("ftools");
  t.innerHTML=`<div class="hintbox fh">${IBULB}<span>${esc(c.q.h)}</span></div>`;sfx.combo();
}
function fPress(k){
  const c=F.cur;if(c.done)return;const b=document.getElementById("blank");
  if(k==="ok"){if(!c.input){b.classList.remove("nudge");void b.offsetWidth;b.classList.add("nudge");return}
    fCheck(Number(c.input)===c.q.a,c.input,b);return}
  if(k==="del")c.input=c.input.slice(0,-1);else if(c.input.length<10)c.input=(c.input==="0"?"":c.input)+k;
  b.textContent=c.input||"?";b.classList.toggle("filled",!!c.input);b.classList.remove("bad");
}
function fChoose(i,btn){
  const c=F.cur;if(c.done||btn.disabled)return;const ok=c.q.opts[i]===c.q.a;
  if(!ok){btn.disabled=true;btn.classList.add("bad")}
  fCheck(ok,c.q.opts[i],btn);
}
function fCheck(ok,given,el){
  const c=F.cur,q=c.q;c.tries++;
  if(!ok&&c.tries<2){
    sfx.bad();F.clean=false;
    if(q.k==="num"){el.classList.add("bad");c.input=""}
    document.getElementById("fb").innerHTML=`<div class="fb bad slim" role="status"><h4>Тағы бір рет ойлан! Бір мүмкіндік қалды.</h4></div>`;
    if(!c.hint){const hb=document.getElementById("fhint");if(hb)hb.classList.add("glow")}
    return;
  }
  c.done=true;
  const pad=document.getElementById("pad");if(pad)pad.classList.add("off");
  document.querySelectorAll(".opt").forEach(b=>{b.disabled=true;if(q.opts&&q.opts[+b.dataset.i]===q.a)b.classList.add("ok");else if(!b.classList.contains("bad"))b.classList.add("dim")});
  const ht=document.getElementById("ftools");if(ht&&!c.hint)ht.remove();
  const prev=P.femo[q.id]||0;let gain=0,msg;
  if(ok){
    const full=c.tries===1&&!c.hint;
    gain=q.p*10*(full?1:.5)*(F.mode==="day"?2:1);F.pts+=full?q.p:q.p/2;
    P.femo[q.id]=Math.max(prev,full?3:2);
    if(!full)F.clean=false;
    if(q.k==="num"){el.classList.add("ok");el.textContent=q.a}
    sfx.ok();burst(el);pop("+"+gain,el);
    msg=full?pick(["Керемет! Нағыз олимпиадашы!","Тамаша! Бірден таптың!","Супер-Айназ!","Жарайсың, дұрыс!"]):pick(["Дұрыс! Жарайсың!","Таптың! Келесі жолы кеңессіз көр!"]);
    if(F.mode==="day"&&!fDailyDone())P.femoDays.push(today());
  }else{
    sfx.bad();F.clean=false;F.wrong++;
    if(!prev)P.femo[q.id]=1;
    if(q.k==="num"){el.classList.add("bad")}
    msg="Бұл жолы шықпады — шешуін оқып ал";
  }
  F.xp+=gain;document.getElementById("fxp").textContent=F.xp;
  F.log.push({q,ok,given});saveP();
  const last=F.i===F.list.length-1;
  document.getElementById("fb").innerHTML=`<div class="fb ${ok?"ok":"bad"}" role="status"><h4>${esc(msg)}</h4>
    <p>Дұрыс жауабы: <b>${esc(String(q.a))}</b></p><p class="sol"><b>Шешуі.</b> ${esc(q.e)}</p></div>
    <div class="row" style="margin-top:12px"><button class="big ${ok?"blue":""}" id="next">${last?"Нәтижені көру":"Келесі есеп"}</button></div>`;
  const nx=document.getElementById("next");nx.onclick=()=>{F.i++;femoQ()};nx.scrollIntoView({behavior:"smooth",block:"nearest"});
}
function femoFinish(quit){
  clearInterval(ftimer);screen="femor";
  const done=F.log.length,ok=F.log.filter(x=>x.ok).length;
  if(!done){femoHome();return}
  const isRound=!!FR[F.mode];
  let stars=0;
  if(isRound&&!quit&&!F.partial){const r=F.pts/F.max;stars=r>=.9?3:r>=.7?2:r>=.4?1:0;P.femoStars[F.mode]=Math.max(P.femoStars[F.mode]||0,stars)}
  else if(isRound){const qs=FR[F.mode].qs;if(qs.every(q=>P.femo[q.id]>=2))P.femoStars[F.mode]=Math.max(P.femoStars[F.mode]||0,1);stars=P.femoStars[F.mode]||0}
  const lvUp=addRound(ok,Math.round(F.xp)+stars*10),nb=[];
  const sv=fSolved();
  if(sv>=1)award("femo1",nb);if(sv>=25)award("femo25",nb);if(sv>=100)award("femo100",nb);
  if(isRound&&stars===3)award("femoR",nb);
  if(isRound&&!quit&&!F.partial&&F.clean&&done===F.list.length)award("femoClean",nb);
  if(P.femoDays.length>=5)award("femoDay",nb);
  commonBadges(nb);
  const secs=Math.floor((performance.now()-F.t0)/1000),rk=fRank(sv);
  const title=F.mode==="day"?"Күн есебі":F.mode==="wrong"?"Қателер жұмысы":FR[F.mode].t+" · "+FR[F.mode].sub;
  go(`${topbar()}
  <section class="panel res">
    <p class="fk">${esc(title)}</p>
    ${isRound?`<div class="bigstars">${[0,1,2].map(k=>`<span class="bs ${k<stars?"on":""}" style="animation-delay:${.2+k*.25}s">${I.star(k<stars?"var(--sun)":"var(--paper)")}</span>`).join("")}</div>`:`<div class="fcup big" style="background:${rk[2]}">${ICUP}</div>`}
    <h2 class="verdict">${ok===done?"Барлығы дұрыс! Чемпион!":ok>=done*.7?"Өте жақсы нәтиже!":ok>=done*.4?"Жақсы! Ойлау күшейіп келеді!":"Олимпиада есептері қиын — бірақ сен үйреніп жатырсың!"}</h2>
    <div class="score">${ok}<small> / ${done}</small></div>
    <div class="stats"><div class="stat"><b>+${Math.round(F.xp)+stars*10}</b><span>XP</span></div><div class="stat"><b>${fmt(secs)}</b><span>уақыт</span></div><div class="stat"><b>${sv}/${FEMO_Q.length}</b><span>барлық шешілген</span></div></div>
    <p class="sub">Олимпиада атағың: <b>${esc(rk[1])}</b></p>
    ${nb.length?`<div class="newb">${nb.map(b=>{const B=BADGES.find(x=>x.id===b);return `<span>${I.medal(true)}${esc(B.t)}</span>`}).join("")}</div>`:""}
    <div class="row" style="width:100%">${isRound?`<button class="big" id="again">Қайта шешу</button>`:""}<button class="big ${isRound?"alt":""}" id="map">Олимпиада жолы</button></div>
  </section>`,()=>{
    bindBar();
    const a=document.getElementById("again");if(a)a.onclick=()=>femoRoundIntro(F.mode);
    document.getElementById("map").onclick=femoHome;
  });
  if(ok){sfx.win();confetti(Math.max(30,stars*55))}
  celebrate(lvUp,nb);
}

addEventListener("keydown",e=>{
  if(document.querySelector(".modal")||screen!=="femoq"||!F||!F.cur)return;
  const c=F.cur;
  if(!c.done){
    if(c.q.k==="num"){if(/^[0-9]$/.test(e.key))fPress(e.key);else if(e.key==="Backspace")fPress("del");else if(e.key==="Enter")fPress("ok")}
    else if(/^[1-4]$/.test(e.key)){const b=document.querySelectorAll(".opt")[+e.key-1];if(b)b.click()}
  }else if(e.key==="Enter"){const nx=document.getElementById("next");if(nx){e.preventDefault();nx.click()}}
});

hub();
