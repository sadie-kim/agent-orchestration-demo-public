const S={
  apiKey:null,
  model:'gpt-4o',
  sim:true,
  running:false,
  scenario:null,
  timer:null,
  elapsed:0,
  aiReview:true,
  lang:'en',
  apiMode:'browser',
  backendAvailable:false,
  backendReady:false,
  gasReady:false,
  liveActionsEnabled:false,
  allowedEmailRecipients:[],
  defaultEmailRecipient:'demo-recipient@example.com',
  demoFromName:'Agent Orchestration Demo',
  accessTokenRequired:false
};

// ── I18N (UI CHROME ONLY) ──
const T={
  en:{
    'setup.title':'Agent Orchestration',
    'setup.sub':'Meridian Wealth Advisory — Live Demo',
    'setup.start':'Start Live Demo →',
    'setup.or':'or',
    'setup.sim':'Run in Simulation Mode',
    'setup.apikey':'Or enter a different API key...',
    'setup.recipientLabel':'Recipient email',
    'setup.accessTokenLabel':'Demo access token',
    'setup.serverReady':'Live mode is server-managed on this deployment. No browser API key needed.',
    'setup.browserMode':'No server API key detected. Enter your own key for live mode, or run the simulation.',
    'setup.liveActionsOn':'Live Google actions are enabled for allowlisted recipients only.',
    'setup.liveActionsOff':'Email, Docs, and Calendar actions run as a visual simulation unless the server owner enables them.',
    'scenario.title':'Select Scenario',
    'scenario.placeholder':'Choose a scenario...',
    'scenario.promptLabel':'Prompt — edit freely',
    'scenario.run':'Run ▶',
    'scenario.skip':'Skip → Run Default',
    'topbar.scenario':'Scenario',
    'topbar.aiReviewer':'AI Reviewer',
    'topbar.on':'ON',
    'topbar.off':'OFF',
    'topbar.idle':'Idle',
    'topbar.running':'Running',
    'topbar.complete':'Complete ✓',
    'topbar.reset':'↺ Reset',
    'tab.waiting':'Waiting',
    'waiting.text':'Waiting for agents',
    'feed.header':'Activity Feed',
    'modal.humanReview':'Human Review',
    'modal.editPlaceholder':'Edit the content here...',
    'modal.approve':'Approve & Continue',
    'modal.edit':'Edit',
    'modal.retry':'↻ Retry Agent',
    'modal.skip':'Skip (auto-approve)',
    'simBadge':'Simulation Mode',
    'agent.orc1':'ORCHES-',
    'agent.orc2':'TRATOR',
    'agent.sco':'SCOUT',
    'agent.fge':'FORGE',
    'agent.her':'HERALD'
  },
  ko:{
    'setup.title':'Agent Orchestration',
    'setup.sub':'Meridian Wealth Advisory — 라이브 데모',
    'setup.start':'라이브 데모 시작 →',
    'setup.or':'또는',
    'setup.sim':'시뮬레이션 모드 실행',
    'setup.apikey':'다른 API 키를 입력하려면...',
    'setup.recipientLabel':'수신 이메일',
    'setup.accessTokenLabel':'데모 액세스 토큰',
    'setup.serverReady':'이 배포본의 라이브 모드는 서버에서 키를 관리합니다. 브라우저 API 키가 필요 없습니다.',
    'setup.browserMode':'서버 API 키가 설정되지 않았습니다. 라이브 모드는 개인 API 키를 입력하거나 시뮬레이션으로 실행하세요.',
    'setup.liveActionsOn':'실제 Google 작업은 허용된 수신자에게만 실행됩니다.',
    'setup.liveActionsOff':'서버 소유자가 활성화하지 않으면 이메일, 문서, 캘린더 작업은 시각적 시뮬레이션으로 실행됩니다.',
    'scenario.title':'시나리오 선택',
    'scenario.placeholder':'시나리오를 선택하세요...',
    'scenario.promptLabel':'프롬프트 — 자유롭게 수정',
    'scenario.run':'실행 ▶',
    'scenario.skip':'기본값으로 실행 →',
    'topbar.scenario':'시나리오',
    'topbar.aiReviewer':'AI 리뷰어',
    'topbar.on':'켜짐',
    'topbar.off':'꺼짐',
    'topbar.idle':'대기 중',
    'topbar.running':'실행 중',
    'topbar.complete':'완료 ✓',
    'topbar.reset':'↺ 초기화',
    'tab.waiting':'대기',
    'waiting.text':'에이전트를 기다리는 중',
    'feed.header':'활동 로그',
    'modal.humanReview':'휴먼 리뷰',
    'modal.editPlaceholder':'내용을 여기에서 수정하세요...',
    'modal.approve':'승인 및 계속',
    'modal.edit':'수정',
    'modal.retry':'↻ 에이전트 재시도',
    'modal.skip':'건너뛰기 (자동 승인)',
    'simBadge':'시뮬레이션 모드',
    'agent.orc1':'조율자',
    'agent.orc2':'',
    'agent.sco':'수집가',
    'agent.fge':'제작자',
    'agent.her':'배달원'
  }
};
function t(key){return (T[S.lang]&&T[S.lang][key])||T.en[key]||key;}
function applyLang(lang){
  S.lang=(lang==='ko')?'ko':'en';
  document.documentElement.lang=S.lang;
  try{localStorage.setItem('demoLang',S.lang);}catch(e){}
  // Update text content
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key=el.getAttribute('data-i18n');
    el.textContent=t(key);
  });
  // Update placeholders
  document.querySelectorAll('[data-i18n-ph]').forEach(el=>{
    const key=el.getAttribute('data-i18n-ph');
    el.setAttribute('placeholder',t(key));
  });
  // Update SVG text nodes
  document.querySelectorAll('[data-i18n-svg]').forEach(el=>{
    const key=el.getAttribute('data-i18n-svg');
    el.textContent=t(key);
  });
  // Recenter orchestrator label when Korean (single-line) vs English (two-line)
  const orc1=document.querySelector('[data-i18n-svg="agent.orc1"]');
  const orc2=document.querySelector('[data-i18n-svg="agent.orc2"]');
  if(orc1&&orc2){
    if(S.lang==='ko'){
      orc1.setAttribute('y','46');
      orc2.setAttribute('y','46');
      orc2.textContent='';
      orc2.style.display='none';
    } else {
      orc1.setAttribute('y','38');
      orc2.setAttribute('y','51');
      orc2.style.display='';
    }
  }
  // Update active toggle button
  const en=document.getElementById('lang-en'),ko=document.getElementById('lang-ko');
  if(en&&ko){en.classList.toggle('on',S.lang==='en');ko.classList.toggle('on',S.lang==='ko');en.setAttribute('aria-pressed',S.lang==='en');ko.setAttribute('aria-pressed',S.lang==='ko');}
  // Sync reviewer ON/OFF state
  const rv=document.getElementById('rv-status'),rvc=document.getElementById('rv-check');
  if(rv&&rvc){rv.textContent=rvc.checked?t('topbar.on'):t('topbar.off');}
  // Sync status label if idle/running/complete
  const st=document.getElementById('status');
  if(st){
    const k=st.getAttribute('data-status-key');
    if(k)st.textContent=t(k);
  }
  // Re-translate all existing feed entries using their stored raw message
  document.querySelectorAll('#feed-body .fl').forEach(el=>{
    const raw=el.getAttribute('data-raw');
    if(raw!==null)el.textContent=translateFeedMsg(raw);
  });
  updateSetupModeUI();
}
function setLang(lang){applyLang(lang);}
function hasLiveAI(){return S.apiMode==='proxy'?S.backendReady:!!S.apiKey;}
function hasLiveActions(){
  if(S.backendAvailable)return !!(S.gasReady&&S.liveActionsEnabled);
  return !!(GAS_ENDPOINT&&GAS_TOKEN);
}
function getRecipient(){
  const input=document.getElementById('recipient-email');
  const value=input&&input.value.trim()?input.value.trim():S.defaultEmailRecipient;
  return value||'demo-recipient@example.com';
}
function getDemoAccessToken(){
  const input=document.getElementById('demo-access-token');
  return input?input.value.trim():'';
}
function apiHeaders(){
  const headers={'Content-Type':'application/json'};
  if(S.accessTokenRequired){
    const token=getDemoAccessToken();
    if(token)headers['x-demo-access-token']=token;
  }
  return headers;
}
function updateSetupModeUI(){
  const apiInput=document.getElementById('api-key');
  const divider=document.getElementById('setup-divider');
  const note=document.getElementById('setup-note');
  const deliveryNote=document.getElementById('delivery-note');
  const recipientInput=document.getElementById('recipient-email');
  const tokenField=document.getElementById('demo-token-field');
  if(!apiInput||!divider||!note)return;
  if(S.apiMode==='proxy'){
    apiInput.style.display='none';
    divider.style.display='none';
    note.textContent=t('setup.serverReady');
  }else{
    apiInput.style.display='';
    divider.style.display='';
    note.textContent=t('setup.browserMode');
  }
  if(recipientInput&&!recipientInput.value&&S.defaultEmailRecipient){
    recipientInput.value=S.defaultEmailRecipient;
  }
  if(tokenField){
    tokenField.style.display=S.accessTokenRequired?'block':'none';
  }
  if(deliveryNote){
    const allowlist=S.allowedEmailRecipients.length?(' Allowed: '+S.allowedEmailRecipients.join(', ')):'';
    deliveryNote.textContent=(hasLiveActions()?t('setup.liveActionsOn'):t('setup.liveActionsOff'))+allowlist;
  }
}
async function loadRuntimeConfig(){
  try{
    const r=await fetch('/api/config',{cache:'no-store'});
    if(!r.ok)return updateSetupModeUI();
    const cfg=await r.json();
    if(cfg&&cfg.backend){
      S.backendAvailable=true;
      S.apiMode=cfg.openaiConfigured?'proxy':'browser';
      S.backendReady=!!cfg.openaiConfigured;
      S.gasReady=!!cfg.gasConfigured;
      S.liveActionsEnabled=!!cfg.liveActionsEnabled;
      S.allowedEmailRecipients=Array.isArray(cfg.allowedEmailRecipients)?cfg.allowedEmailRecipients:[];
      S.defaultEmailRecipient=cfg.defaultEmailRecipient||S.allowedEmailRecipients[0]||S.defaultEmailRecipient;
      S.demoFromName=cfg.demoFromName||S.demoFromName;
      S.accessTokenRequired=!!cfg.accessTokenRequired;
    }
  }catch(e){}
  updateSetupModeUI();
}
// Initialize lang on DOM ready
(function(){
  let initial='en';
  try{const saved=localStorage.getItem('demoLang');if(saved)initial=saved;
    else if((navigator.language||'').toLowerCase().startsWith('ko'))initial='ko';
  }catch(e){}
  document.addEventListener('DOMContentLoaded',()=>{
    applyLang(initial);
    loadRuntimeConfig();
  });
})();

// ── API KEYS (loaded from optional keys.local.js; empty in public builds) ──
// In public mode, users enter their own key via the API-key input on the setup screen.
const _LK=(typeof window!=='undefined'&&window._LOCAL_KEYS)||{};
const _K_ANTHROPIC=_LK.anthropic||'';
const _K=_LK.openai||'';

// ── GOOGLE APPS SCRIPT CONFIG ──
// Sourced from keys.local.js, OR (public, BYO-Google) pasted by the user on the
// setup screen via applyGasFromUI(). Empty = Gmail/Docs/Calendar stay simulated.
let GAS_ENDPOINT=_LK.gasEndpoint||'';
let GAS_TOKEN=_LK.gasToken||'';
if(GAS_ENDPOINT&&GAS_TOKEN){
  S.gasReady=true;
  S.liveActionsEnabled=true;
}
// Bring-your-own Google bridge: in browser mode, let the presenter connect their
// own Apps Script deployment. Secrets stay in the tab; the recipient allowlist is
// still enforced by their Apps Script.
function applyGasFromUI(){
  if(S.backendAvailable)return; // proxy mode uses server-managed GAS
  const ep=((document.getElementById('gas-endpoint')||{}).value||'').trim();
  const tk=((document.getElementById('gas-token')||{}).value||'').trim();
  if(ep&&tk){
    GAS_ENDPOINT=ep;GAS_TOKEN=tk;
    S.gasReady=true;S.liveActionsEnabled=true;
  }
}

async function callGAS(action,data){
  if(!hasLiveActions()){
    return {success:false,skipped:true,error:'Live Google actions are disabled for this demo'};
  }
  if(S.backendAvailable){
    const r=await fetch('/api/gas',{
      method:'POST',
      headers:apiHeaders(),
      body:JSON.stringify({action,data})
    });
    return await r.json();
  }
  const r=await fetch(GAS_ENDPOINT,{
    method:'POST',redirect:'follow',
    headers:{'Content-Type':'text/plain'},
    body:JSON.stringify({token:GAS_TOKEN,action,data})
  });
  return await r.json();
}

// ── FICTIONAL COMPANY ENVIRONMENT ──
// Meridian Wealth Advisory — a fictional Australian financial advisory firm
// All names, figures, and entities below are fabricated for demo purposes.
const COMPANY={
  name:'Meridian Wealth Advisory',
  abn:'47 612 903 158',
  office:'Level 12, 88 Pitt Street, Sydney NSW 2000',
  team:{
    ceo:'Daniel Park',
    cfo:'Rachel Nguyen',
    headOps:'Tom Bradley',
    seniorAdvisor:'Sadie Kim',
    analyst:'Jordan Lee',
    marketing:'Emily Chen',
    hr:'Priya Sharma',
    pm:'Marcus Wright'
  },
  clients:{
    premium:'Hartfield Group (CEO: Andrew Hartfield, AUM: $4.2M)',
    growth:'Solaris Tech Pty Ltd (MD: Lisa Tran, AUM: $1.8M)',
    new:'Coastal Living Developments (Dir: James Whitmore)',
    sme:'BrightPath Education (Founder: Maria Santos, AUM: $920K)'
  }
};

const SCENARIOS={
A:{
  name:'회계 / 금융',
  label:'Hartfield Group 분기 포트폴리오 보고서',
  goal:'Hartfield Group의 Q2 포트폴리오 보고서를 작성하고 Andrew Hartfield에게 이메일로 발송해줘',
  orc:{lines:['Analyzing goal: "Hartfield Group Q2 Portfolio Report"','Accessing client profile: AUM $4.2M, Risk: Balanced Growth','Task 1 → Scout: research market data + portfolio benchmarks','Task 2 → Forge: create quarterly report for Hartfield Group','Task 3 → Herald: email Andrew Hartfield + book review meeting','Dispatching Scout...']},
  sco:{searches:[
    {q:'"Q2 2026 Australian market performance ASX200 RBA"',r:['RBA holds cash rate at 4.10% after February cut','ASX200 up 4.8% YTD, led by resources and financials','AUD/USD stabilising around 0.67 on trade surplus']},
    {q:'"balanced growth portfolio benchmarks Australia 2026"',r:['Balanced Growth benchmark: +6.1% annualised','ESG integration now standard across top-tier advisors','Fixed income allocation shift: 30% → 25% recommended']},
    {q:'"Australian SMSF regulatory changes 2026"',r:['SMSF contribution caps increased to $30K/yr','Transfer balance cap indexed to $1.9M','New reporting requirements effective July 2026']}
  ],summary:'14 key data points identified. Hartfield portfolio outperforming benchmark by +1.8%. RBA rate cut creating rebalance opportunity.'},
  fge:{title:'Hartfield Group — Q2 2026 Portfolio Report',content:[
    {t:'h1',v:'Q2 2026 Portfolio Report — Hartfield Group'},
    {t:'summary',v:'Your portfolio delivered **strong Q2 results**, outperforming the Balanced Growth benchmark by **+1.8%**. The February rate cut has created strategic opportunities we recommend acting on before the July SMSF deadline.'},
    {t:'metrics',v:[{label:'Total AUM',val:'$4.38M'},{label:'QoQ Growth',val:'+4.3%'},{label:'Risk Score',val:'5.4 / 10'},{label:'Dividend Income',val:'$42,600'}]},
    {t:'hr'},
    {t:'h2',v:'Portfolio Performance'},
    {t:'ul',v:['**AUM Growth**: $4.2M → $4.38M (+4.3% quarter-on-quarter)','**Annualised Return**: +8.2% vs Benchmark +6.1%','**Risk Score**: 5.4/10 — within target range (5–6)','**Dividends**: $42,600 reinvested into growth allocation']},
    {t:'callout',v:'Portfolio has outperformed benchmark for **3 consecutive quarters**. Current momentum supports a tactical rebalance toward AU equities.',style:'ok'},
    {t:'hr'},
    {t:'h2',v:'Recommendations'},
    {t:'ul',v:['Increase AU equities allocation by **5%** (rate cut tailwind)','Review SMSF contributions before **new cap** takes effect 1 July','Consider reducing fixed income from **28% → 23%**']},
    {t:'callout',v:'WARNING: SMSF contribution caps change on 1 July 2026. Action required before deadline to maximise tax advantage.',style:'warn'},
    {t:'hr'},
    {t:'h2',v:'Next Steps'},
    {t:'ul',v:['Q2 Review Meeting — scheduled **Monday 9:00 AM**','SMSF strategy session before July deadline']},
    {t:'p',v:'Prepared by Meridian Wealth Advisory · Level 12, 88 Pitt Street, Sydney'}
  ]},
  her:{to:'demo-recipient@example.com',subj:'Hartfield Group Q2 Portfolio Report — Meridian Wealth',
    body:'Dear Andrew,\n\nPlease find your Q2 2026 Portfolio Report from Meridian Wealth Advisory.\n\nKey highlights:\n✓ Portfolio up 4.3% QoQ, outperforming benchmark by +1.8%\n✓ AUM grown to $4.38M\n✓ 3 strategic recommendations for Q3 enclosed\n\nReview meeting scheduled for Monday 9:00 AM.\n\nBest regards,',
    evt:{title:'Hartfield Group Q2 Review — Meridian',time:'Monday, April 14, 2026 · 9:00–9:30 AM',day:14}}
},
B:{
  name:'비즈니스 오너 / 영업',
  label:'Coastal Living 신규 클라이언트 미팅 준비',
  goal:'Coastal Living Developments의 James Whitmore 미팅을 위한 브리핑 자료를 준비하고 팀에게 공유해줘',
  orc:{lines:['Analyzing goal: "Coastal Living — New Client Meeting Brief"','Checking CRM: James Whitmore, Director, property development','Task 1 → Scout: research Coastal Living + property dev sector','Task 2 → Forge: create meeting brief for the team','Task 3 → Herald: share with advisory team + schedule prep','Dispatching Scout...']},
  sco:{searches:[
    {q:'"Coastal Living Developments Sydney property development"',r:['Active projects in Northern Beaches and Central Coast','$12M residential development pipeline for 2026–27','Recently expanded into boutique commercial fit-outs']},
    {q:'"property developer financial advisory needs Australia"',r:['Key concern: cash flow management across project stages','Tax structuring critical for multi-entity developers','Insurance and risk management often underserved']}
  ],summary:'James Whitmore runs a $12M pipeline. Key opportunity: project-stage cash flow advisory + tax structuring across entities.'},
  fge:{title:'Client Meeting Brief — Coastal Living Developments',content:[
    {t:'h1',v:'Meeting Brief: Coastal Living Developments'},
    {t:'summary',v:'New client meeting with **James Whitmore**, Director of Coastal Living Developments. **$12M development pipeline** presents a significant advisory opportunity in project-stage cash flow and multi-entity tax structuring.'},
    {t:'metrics',v:[{label:'Pipeline Value',val:'$12M'},{label:'Projects Active',val:'3'},{label:'Opportunity',val:'High'}]},
    {t:'hr'},
    {t:'h2',v:'Client Profile'},
    {t:'ul',v:['**Director**: James Whitmore','**Business**: Residential & boutique commercial development','**Pipeline**: $12M across Northern Beaches + Central Coast','**Current advisor**: Unknown (likely Big 4 accounting firm)']},
    {t:'hr'},
    {t:'h2',v:'Key Talking Points'},
    {t:'ul',v:['Lead with **project-stage cash flow modelling** expertise','Highlight our property developer client base (**3 active**)','Address **tax structuring** for multi-entity setups','Offer complimentary pipeline risk assessment']},
    {t:'callout',v:'TIP: James recently expanded into boutique commercial fit-outs — this signals growth ambition and need for more sophisticated advisory.',style:'ok'},
    {t:'hr'},
    {t:'h2',v:'Proposed Agenda'},
    {t:'ul',v:['**9:00–9:10** — Introductions + their growth story','**9:10–9:25** — Current pain points and advisor gaps','**9:25–9:35** — Meridian\'s approach for developers','**9:35–9:45** — Next steps + complimentary assessment offer']},
    {t:'p',v:'Prepared by Meridian Wealth Advisory · Level 12, 88 Pitt Street, Sydney'}
  ]},
  her:{to:'demo-recipient@example.com',subj:'Coastal Living 미팅 브리핑 — Monday',
    body:'팀 여러분,\n\nMonday Coastal Living Developments (James Whitmore) 미팅 브리핑을 공유합니다.\n\n핵심:\n✓ $12M 개발 파이프라인 보유\n✓ 프로젝트별 캐시플로우 자문 기회\n✓ 다중 법인 세무 구조화 니즈\n\n준비 미팅을 잡아두었습니다.\n\nBest regards,',
    evt:{title:'Coastal Living 미팅 준비 — Meridian',time:'Monday, April 14, 2026 · 8:30–9:00 AM',day:14}}
},
C:{
  name:'마케팅',
  label:'경쟁사 분석: Pinnacle vs Sterling vs Apex',
  goal:'Pinnacle Advisory, Sterling Partners, Apex Wealth 3곳의 최근 동향을 조사해서 경쟁 분석 리포트를 만들고 마케팅팀에 공유해줘',
  orc:{lines:['Analyzing goal: "Competitive Analysis — 3 rival firms"','Competitors identified: Pinnacle, Sterling, Apex','Task 1 → Scout: research competitor positioning + moves','Task 2 → Forge: create competitive analysis report','Task 3 → Herald: share with Emily Chen + marketing team','Dispatching Scout...']},
  sco:{searches:[
    {q:'"financial advisory competitive landscape Sydney 2026"',r:['Pinnacle Advisory: expanded to Melbourne, hired 8 advisors','Sterling Partners: launched AI-assisted portfolio tool','Apex Wealth: aggressive digital marketing, 40% lead growth']},
    {q:'"wealth management firm differentiation strategies"',r:['Personalised service remains #1 client retention driver','Digital presence now expected by under-45 demographic','Content marketing ROI highest in financial services']}
  ],summary:'3 competitors profiled. Sterling\'s AI tool is biggest threat. Apex winning on digital marketing. Meridian\'s edge: personalised service + niche expertise.'},
  fge:{title:'Competitive Analysis — Meridian vs Market Q2 2026',content:[
    {t:'h1',v:'Competitive Analysis Report'},
    {t:'summary',v:'Three primary competitors show **divergent strategies**. Sterling Partners poses the greatest innovation threat with their AI tool. Meridian\'s positioning remains strong but **digital presence needs investment**.'},
    {t:'metrics',v:[{label:'Meridian Retention',val:'94%'},{label:'Industry Avg',val:'82%'},{label:'Apex Lead Growth',val:'+40%'},{label:'Threat Level',val:'Medium'}]},
    {t:'hr'},
    {t:'h2',v:'Competitor Profiles'},
    {t:'ul',v:['**Pinnacle Advisory**: Geographic expansion (Melbourne), growing team — threat: **scale**','**Sterling Partners**: AI portfolio tool launched — threat: **innovation perception**','**Apex Wealth**: 40% lead growth via digital marketing — threat: **pipeline volume**']},
    {t:'callout',v:'WARNING: Sterling\'s AI-assisted portfolio tool is gaining media coverage. Clients may perceive Meridian as falling behind on technology.',style:'warn'},
    {t:'hr'},
    {t:'h2',v:'Meridian\'s Competitive Advantages'},
    {t:'ul',v:['**Highest retention rate** in segment (94% vs 82% industry avg)','**Niche expertise** in property developers + SME founders','**Personal relationship model** valued by HNW clients']},
    {t:'callout',v:'TIP: Meridian\'s 94% retention rate is a powerful marketing asset — consider featuring in client acquisition materials.',style:'ok'},
    {t:'hr'},
    {t:'h2',v:'Recommended Actions'},
    {t:'ul',v:['Invest in **digital presence** (website refresh + content strategy)','Develop Meridian\'s own **AI-assisted reporting** (this demo!)','Launch **referral programme** targeting existing HNW clients']},
    {t:'p',v:'Prepared by Meridian Wealth Advisory · Level 12, 88 Pitt Street, Sydney'}
  ]},
  her:{to:'demo-recipient@example.com',subj:'경쟁 분석 리포트 — Meridian vs Market Q2 2026',
    body:'Emily + 마케팅팀,\n\nPinnacle, Sterling, Apex 3곳 경쟁 분석 리포트를 공유합니다.\n\n핵심 발견:\n✓ Sterling의 AI 툴이 가장 큰 위협\n✓ Apex의 디지털 마케팅 리드 40% 성장\n✓ Meridian 강점: 94% 고객 유지율\n\n전략 미팅을 잡아두었습니다.\n\nBest regards,',
    evt:{title:'마케팅 전략 미팅 — Meridian',time:'Wednesday, April 16, 2026 · 2:00–2:30 PM',day:16}}
},
D:{
  name:'HR / 인사',
  label:'Jordan Lee 온보딩 가이드 작성',
  goal:'다음 주 입사하는 신규 분석가 Jordan Lee를 위한 온보딩 가이드를 작성하고 관련 팀에 공유해줘',
  orc:{lines:['Analyzing goal: "Onboarding Guide for Jordan Lee"','Role: Junior Analyst, reporting to Rachel Nguyen (CFO)','Task 1 → Scout: research onboarding best practices','Task 2 → Forge: create Meridian onboarding guide','Task 3 → Herald: share with team leads + schedule orientation','Dispatching Scout...']},
  sco:{searches:[
    {q:'"financial services onboarding best practices 2026"',r:['ASIC compliance training must be completed within 30 days','Buddy system reduces analyst turnover by 35%','First-week shadowing with senior advisors most effective']},
    {q:'"junior analyst onboarding checklist wealth management"',r:['Systems access: portfolio platform, CRM, compliance tools','Client confidentiality training mandatory before client contact','Gradual client exposure: observe → assist → lead over 90 days']}
  ],summary:'Best practices compiled. Key for Meridian: ASIC compliance within 30 days, buddy assignment, gradual client exposure model.'},
  fge:{title:'Meridian Onboarding Guide — Jordan Lee',content:[
    {t:'h1',v:'Welcome to Meridian Wealth Advisory'},
    {t:'summary',v:'Welcome **Jordan Lee**! You\'re joining as **Junior Analyst** reporting to Rachel Nguyen (CFO). This guide covers your first 90 days. Your buddy is **Marcus Wright** (PM).'},
    {t:'metrics',v:[{label:'Start Date',val:'14 Apr'},{label:'Buddy',val:'Marcus W.'},{label:'ASIC Due',val:'Day 30'},{label:'90-Day Goal',val:'Lead Review'}]},
    {t:'hr'},
    {t:'h2',v:'Week 1 Checklist'},
    {t:'ul',v:['**IT Setup**: Xplan, Salesforce CRM, compliance portal','**Buddy Meet**: Marcus Wright + full team introductions','**ASIC Training**: Complete compliance modules 1–3','**Client Shadow**: Observe Sadie Kim on Hartfield Group account']},
    {t:'callout',v:'TIP: ASIC compliance training must be completed within 30 days of start. Begin in Week 1 to stay ahead of schedule.',style:'ok'},
    {t:'hr'},
    {t:'h2',v:'30-60-90 Day Plan'},
    {t:'ul',v:['**Day 1–30**: Learn Xplan, complete ASIC training, shadow 3 client meetings','**Day 31–60**: Assist with portfolio analysis, draft first client report','**Day 61–90**: Lead BrightPath Education quarterly review with supervision']},
    {t:'callout',v:'Buddy system reduces analyst turnover by 35%. Marcus will be your go-to for the first 90 days.',style:''},
    {t:'p',v:'Prepared by Meridian Wealth Advisory · HR Team'}
  ]},
  her:{to:'demo-recipient@example.com',subj:'Jordan Lee 온보딩 가이드 — Meridian Wealth',
    body:'팀장님들,\n\n월요일 입사 예정인 Jordan Lee (Junior Analyst) 온보딩 가이드를 공유합니다.\n\n포함 내용:\n✓ 첫 주 체크리스트 (Xplan, ASIC 교육)\n✓ 버디: Marcus Wright\n✓ 90일 플랜 및 클라이언트 노출 로드맵\n\n오리엔테이션 일정을 캘린더에 잡아두었습니다.\n\nBest regards,',
    evt:{title:'Jordan Lee 오리엔테이션 — Meridian',time:'Monday, April 14, 2026 · 10:00–11:00 AM',day:14}}
},
E:{
  name:'프로젝트 매니저',
  label:'CRM 마이그레이션 주간 상태 보고서',
  goal:'Salesforce CRM 마이그레이션 프로젝트의 주간 상태 보고서를 작성하고 스테이크홀더들에게 공유해줘',
  orc:{lines:['Analyzing goal: "CRM Migration Weekly Status — Week 15"','Project: Salesforce Migration (Phase 2 of 3)','Task 1 → Scout: research CRM migration benchmarks','Task 2 → Forge: create Week 15 status report','Task 3 → Herald: distribute to Daniel Park + stakeholders','Dispatching Scout...']},
  sco:{searches:[
    {q:'"Salesforce CRM migration best practices financial services"',r:['Data migration accuracy target: 99.5% minimum','User adoption training should begin 2 weeks pre-launch','Parallel running period: recommend 4–6 weeks']},
    {q:'"CRM migration risk management enterprise"',r:['#1 risk: data integrity during transfer','Client-facing teams need dedicated support window','Integration testing with existing tools often underestimated']}
  ],summary:'Industry benchmarks compiled. Meridian migration tracking well vs. typical timelines. Data accuracy at 99.7%.'},
  fge:{title:'CRM Migration Status — Week 15 | Meridian',content:[
    {t:'h1',v:'CRM Migration Weekly Status — Week 15'},
    {t:'summary',v:'Phase 2 (Data Migration) proceeding **2 days ahead of schedule**. Client data accuracy validated at **99.7%**, exceeding the 99.5% industry benchmark. Team training begins next Monday.'},
    {t:'metrics',v:[{label:'Records Migrated',val:'842 / 860'},{label:'Data Accuracy',val:'99.7%'},{label:'Budget Used',val:'$68K / $95K'},{label:'Status',val:'🟢 On Track'}]},
    {t:'hr'},
    {t:'h2',v:'This Week\'s Progress'},
    {t:'ul',v:['**✅ Hartfield Group** data validated by Sadie Kim','**✅ Xplan Integration** testing completed successfully','**⏳ BrightPath Education** records pending manual review (12 records)']},
    {t:'callout',v:'TIP: Data accuracy at 99.7% exceeds the 99.5% industry benchmark for financial services CRM migrations.',style:'ok'},
    {t:'hr'},
    {t:'h2',v:'Risks & Blockers'},
    {t:'ul',v:['**BrightPath records**: 12 client records require manual review — ETA Wednesday','**Integration testing**: Minor API latency with legacy Xplan endpoints']},
    {t:'callout',v:'WARNING: Parallel running period decision needed by Friday. 4 weeks (aggressive) vs 6 weeks (conservative) — impacts Phase 3 timeline.',style:'warn'},
    {t:'hr'},
    {t:'h2',v:'Decisions Needed'},
    {t:'ul',v:['Approve parallel running period: **4 or 6 weeks**?','Confirm training schedule for advisory team (**Rachel to sign off**)']},
    {t:'p',v:'Prepared by Marcus Wright · Project Manager, Meridian Wealth Advisory'}
  ]},
  her:{to:'demo-recipient@example.com',subj:'CRM Migration Week 15 — Meridian Wealth',
    body:'Daniel + 스테이크홀더 여러분,\n\nCRM 마이그레이션 Week 15 보고서를 공유합니다.\n\n요약:\n✓ 전체 상태: 🟢 일정 2일 앞서 진행\n✓ 데이터 정확도 99.7% (목표 초과)\n✓ 2건 의사결정 필요 (병행 운영 기간, 교육 일정)\n\n리뷰 미팅이 잡혀있습니다.\n\nBest regards,',
    evt:{title:'CRM Migration Review — Meridian',time:'Friday, April 17, 2026 · 3:00–3:30 PM',day:17}}
},
F:{
  name:'부동산 / 컨설팅',
  label:'Solaris Tech 시드니 오피스 시장 리포트',
  goal:'Solaris Tech의 Lisa Tran에게 시드니 상업용 오피스 시장 동향 리포트를 작성해서 보내줘',
  orc:{lines:['Analyzing goal: "Sydney Office Market Report for Solaris Tech"','Client: Solaris Tech Pty Ltd (MD: Lisa Tran, AUM: $1.8M)','Task 1 → Scout: research Sydney commercial property market','Task 2 → Forge: create market report for Solaris Tech','Task 3 → Herald: send to Lisa Tran + schedule consultation','Dispatching Scout...']},
  sco:{searches:[
    {q:'"Sydney commercial office market Q2 2026 vacancy rates"',r:['CBD vacancy rate: 11.2% (down from 13.1% in Q1)','Premium grade rents: $1,280/sqm (up 3.5% QoQ)','Tech sector driving demand in North Sydney + Pyrmont']},
    {q:'"Australian commercial property investment outlook 2026"',r:['Foreign investment rebounding in A-grade office space','Green building premium: 8–12% higher rents for NABERS 5+','Flexible workspace demand growing 15% YoY']}
  ],summary:'Sydney office market recovering. Key for Solaris Tech: tech corridor demand + green building premium opportunity. Vacancy trending down.'},
  fge:{title:'Sydney Office Market Report — Solaris Tech',content:[
    {t:'h1',v:'Sydney Office Market Report — Q2 2026'},
    {t:'summary',v:'The Sydney commercial office market is showing **clear recovery signals**. CBD vacancy has dropped to **11.2%** and tech corridors are seeing accelerated demand — directly relevant to **Solaris Tech\'s** expansion plans.'},
    {t:'metrics',v:[{label:'CBD Vacancy',val:'11.2%'},{label:'Premium Rents',val:'$1,280/sqm'},{label:'Tech Premium',val:'+15%'},{label:'Green Premium',val:'8–12%'}]},
    {t:'hr'},
    {t:'h2',v:'Market Overview'},
    {t:'ul',v:['**CBD Vacancy**: 11.2% (down from 13.1% in Q1) — market tightening','**Premium Grade Rents**: $1,280/sqm (+3.5% QoQ increase)','**Tech Corridors**: North Sydney + Pyrmont driving demand','**Green Buildings**: NABERS 5+ rated commanding 8–12% rent premium']},
    {t:'callout',v:'TIP: Foreign investment is rebounding in A-grade office space. Flexible workspace demand growing 15% YoY — consider hybrid office configurations.',style:'ok'},
    {t:'hr'},
    {t:'h2',v:'Recommendations for Solaris Tech'},
    {t:'ul',v:['Target **North Sydney or Pyrmont** for expansion (tech cluster benefit)','Prioritise **NABERS 5+** buildings for long-term value + ESG alignment','**Lock in lease terms now** before further vacancy tightening','Consider **flexible workspace** component (15% YoY demand growth)']},
    {t:'callout',v:'WARNING: CBD vacancy is tightening rapidly. Delaying a lease decision beyond Q3 may significantly reduce available A-grade options.',style:'warn'},
    {t:'p',v:'Prepared for Lisa Tran, MD — Solaris Tech Pty Ltd\nMeridian Wealth Advisory · Level 12, 88 Pitt Street, Sydney'}
  ]},
  her:{to:'demo-recipient@example.com',subj:'Sydney Office Market Report — Meridian for Solaris Tech',
    body:'Dear Lisa,\n\nPlease find Meridian\'s Sydney office market analysis, prepared specifically for Solaris Tech\'s expansion planning.\n\nHighlights:\n✓ CBD vacancy down to 11.2% — market tightening\n✓ Tech corridors showing 15% rent premium\n✓ Green building opportunities aligned with Solaris ESG goals\n\nI\'ve scheduled a consultation to discuss your options.\n\nBest regards,',
    evt:{title:'Solaris Tech Office Strategy — Meridian',time:'Tuesday, April 15, 2026 · 11:00–11:30 AM',day:15}}
},
G:{
  name:'리서치 전용',
  label:'RBA 금리 결정 빠른 시황 체크 (조사만)',
  goal:'다음 주 RBA 금리 결정을 앞두고 호주 시장 상황만 빠르게 조사해서 핵심만 알려줘 — 문서나 이메일은 필요 없어',
  path:['scout'],
  orc:{lines:['Analyzing goal: "Quick market check — RBA decision"','Intent: research only — no document or message to produce','Task 1 → Scout: research RBA outlook + ASX/AUD reaction']},
  sco:{searches:[
    {q:'"RBA April 2026 cash rate decision expectations"',r:['Market pricing ~60% chance of a hold','Inflation eased to 2.9% — within target band','3 of 4 big banks forecast no change']},
    {q:'"ASX200 AUD reaction RBA April 2026"',r:['ASX200 flat ahead of the decision','AUD/USD holding 0.67 on stable terms of trade','2yr bond yield steady at 3.8%']},
    {q:'"Australian consumer spending Q1 2026"',r:['Retail spend +0.4% MoM, services-led','Household savings ratio up to 4.1%']}
  ],summary:'9 data points. Consensus: RBA holds at 4.10% next week (inflation in band). Low surprise risk — no portfolio action needed pre-decision.'}
},
H:{
  name:'문서 초안 (발송 X)',
  label:'팀 내부 자산배분 메모 초안 (발송하지 않음)',
  goal:'다음 분기 자산배분 변경에 대한 내부 검토 메모 초안만 작성해줘 — 아직 아무한테도 보내지 마',
  path:['scout','forge'],
  orc:{lines:['Analyzing goal: "Internal allocation memo — draft only"','Intent: produce a document, but explicitly do NOT send it','Task 1 → Scout: research allocation-shift rationale','Task 2 → Forge: draft the internal review memo']},
  sco:{searches:[
    {q:'"strategic asset allocation 2026 rate-cut cycle"',r:['Equity overweight favoured early in a cutting cycle','Duration extension recommended as cuts begin','Cash drag rising — redeploy idle balances']},
    {q:'"Australian equities vs fixed income outlook 2026"',r:['AU equities: earnings revisions turning positive','Balanced books typically hold 25–30% fixed income','Alternatives gaining share for diversification']}
  ],summary:'Draft basis: tilt +5% AU equities, trim fixed income 28%→23%, extend duration. For internal review before any client action.'},
  fge:{title:'Internal Memo — Q3 Allocation Review (DRAFT)',content:[
    {t:'h1',v:'Q3 Asset Allocation Review — Internal Draft'},
    {t:'summary',v:'**Draft for internal review only.** Proposes a tactical tilt toward AU equities ahead of the rate-cut cycle. **Not for client distribution** until the investment committee signs off.'},
    {t:'metrics',v:[{label:'Proposed AU Equity',val:'+5%'},{label:'Fixed Income',val:'28% → 23%'},{label:'Duration',val:'Extend'},{label:'Status',val:'Draft'}]},
    {t:'hr'},
    {t:'h2',v:'Rationale'},
    {t:'ul',v:['Early rate-cut cycle historically favours an **equity overweight**','**Duration extension** captures the falling-yield tailwind','Reduce **cash drag** by redeploying idle balances']},
    {t:'callout',v:'This memo is a **draft** — do not send to clients until the investment committee approves.',style:'warn'},
    {t:'h2',v:'Next Steps'},
    {t:'ul',v:['Circulate to the investment committee for review','Revisit after the RBA decision next week']},
    {t:'p',v:'Prepared by Meridian Wealth Advisory · Internal use only'}
  ]}
}
};

function initLive(){
  if(S.apiMode==='proxy'){
    if(!S.backendReady){
      alert(S.lang==='ko'
        ? '서버 라이브 모드가 아직 설정되지 않았습니다. 서버 환경변수에서 OpenAI 키를 먼저 설정해주세요.'
        : 'Server-managed live mode is not configured yet. Set the OpenAI key on the server first.');
      return;
    }
    if(S.accessTokenRequired&&!getDemoAccessToken()){
      alert(S.lang==='ko'?'데모 액세스 토큰을 입력해주세요.':'Enter the demo access token for this server.');
      document.getElementById('demo-access-token').focus();
      return;
    }
    S.apiKey=null;
    S.sim=false;
    populateDropdown();
    document.getElementById('setup').style.display='none';
    document.getElementById('scenario-select').style.display='flex';
    return;
  }
  const manualKey=document.getElementById('api-key').value.trim();
  // Live calls go to the OpenAI endpoint only, so accept OpenAI keys and reject Anthropic (sk-ant-) keys
  // that would otherwise pass validation and then fail every request.
  const isOpenAIKey=k=>k&&k.startsWith('sk-')&&!k.startsWith('sk-ant-');
  const keyCandidate=isOpenAIKey(manualKey)?manualKey:_K;
  if(!keyCandidate){
    // Public mode, no key provided — politely redirect to simulation
    alert(S.lang==='ko'
      ? 'OpenAI API 키가 필요합니다. 위 입력란에 OpenAI 키(sk-...)를 입력하거나, "시뮬레이션 모드 실행"을 눌러주세요.'
      : 'An OpenAI API key is required. Enter your OpenAI key (sk-...) in the field above, or click "Run in Simulation Mode".');
    document.getElementById('api-key').style.opacity='1';
    document.getElementById('api-key').focus();
    return;
  }
  S.apiKey=keyCandidate;
  S.sim=false;
  applyGasFromUI();
  populateDropdown();
  document.getElementById('setup').style.display='none';
  document.getElementById('scenario-select').style.display='flex';
}
function initWithKey(){initLive();}
function initSim(){
  S.sim=true;
  const manualKey=document.getElementById('api-key').value.trim();
  S.apiKey=(manualKey&&manualKey.startsWith('sk-')&&!manualKey.startsWith('sk-ant-'))?manualKey:_K;
  document.getElementById('sim-mode-badge').style.display='block';
  document.getElementById('dbg-sim').checked=true;
  applyGasFromUI();
  populateDropdown();
  document.getElementById('setup').style.display='none';
  document.getElementById('scenario-select').style.display='flex';
}

// Populate dropdown on page load
function populateDropdown(){
  const dd=document.getElementById('scenario-dropdown');
  if(dd.options.length>1)return; // already populated
  Object.keys(SCENARIOS).forEach(key=>{
    const s=SCENARIOS[key];
    const opt=document.createElement('option');
    opt.value=key;
    opt.textContent=s.name+' — '+s.label;
    dd.appendChild(opt);
  });
}
function selectScenario(sc){
  if(!sc)return;
  S.scenario=sc;
  const d=SCENARIOS[sc];
  // Show description
  const desc=document.getElementById('scenario-desc');
  desc.style.display='block';
  desc.innerHTML='<span style="color:var(--text);font-weight:500">'+escHtml(d.name)+'</span><br>'+escHtml(d.label);
  // Show prompt editor
  document.getElementById('prompt-input').value=d.goal;
  document.getElementById('prompt-edit').style.display='block';
}
function skipAndRun(){
  const sc=S.scenario;const d=SCENARIOS[sc];
  document.getElementById('scenario-select').style.display='none';
  document.getElementById('demo').style.display='flex';
  document.getElementById('sc-name').textContent=d.name+' — '+d.goal.substring(0,40)+(d.goal.length>40?'...':'');
  buildCalendar();
  runOrchestration(d);
}
function runWithPrompt(){
  const sc=S.scenario;const d=SCENARIOS[sc];
  const customGoal=document.getElementById('prompt-input').value.trim()||d.goal;
  d._displayGoal=customGoal;
  document.getElementById('scenario-select').style.display='none';
  document.getElementById('demo').style.display='flex';
  document.getElementById('sc-name').textContent=d.name+' — '+customGoal.substring(0,40)+(customGoal.length>40?'...':'');
  buildCalendar();
  runOrchestration(d);
}
function startDemo(sc){
  S.scenario=sc;const d=SCENARIOS[sc];
  document.getElementById('scenario-select').style.display='none';
  document.getElementById('demo').style.display='flex';
  document.getElementById('sc-name').textContent=d.name+' — '+d.goal.substring(0,32)+'...';
  buildCalendar();
  runOrchestration(d);
}

function resetDemo(){
  clearInterval(S.timer);S.elapsed=0;S.running=false;
  document.getElementById('demo').style.display='none';
  document.getElementById('scenario-select').style.display='flex';
  document.getElementById('prompt-edit').style.display='none';
  document.getElementById('scenario-desc').style.display='none';
  document.getElementById('scenario-dropdown').selectedIndex=0;
  document.getElementById('feed-body').innerHTML='';
  const _stIdle=document.getElementById('status');
  _stIdle.textContent=t('topbar.idle');_stIdle.setAttribute('data-status-key','topbar.idle');
  _stIdle.className='';
  document.getElementById('timer').textContent='00:00';
  document.getElementById('docs-content').innerHTML='';
  document.getElementById('docs-title').textContent='New Document';
  document.getElementById('gd-letterhead').classList.remove('show');
  document.getElementById('gd-footer').classList.remove('show');
  document.getElementById('gm-to').textContent='';
  document.getElementById('gm-subj').textContent='';
  document.getElementById('gm-body').textContent='';
  document.getElementById('gm-brand').classList.remove('show');
  document.getElementById('gm-sig').classList.remove('show');
  document.getElementById('gm-disclaimer').classList.remove('show');
  document.getElementById('gm-sent').hidden=true;
  document.getElementById('gm-compose').style.display='';
  document.getElementById('gc-event-detail').hidden=true;
  ['nd-orc','nd-sco','nd-fge','nd-her'].forEach(id=>setNode(id,'idle'));
  ['c-orc-sco','c-orc-fge','c-orc-her'].forEach(id=>{
    const el=document.getElementById(id);if(el){el.setAttribute('class','conn');}
  });
  ['sk-sco-search','sk-fge-doc','sk-her-email','sk-her-cal'].forEach(id=>setSkill(id,''));
  setTab('waiting');
  ['tab-docs','tab-gmail','tab-cal'].forEach(id=>{
    document.getElementById(id).classList.remove('done');
  });
}

function toggleSimMode(v){S.sim=v;document.getElementById('sim-mode-badge').style.display=v?'block':'none';}

// ── AI REVIEW AGENT ──
async function aiReviewContent(agentName, content, title, stepNum, totalSteps){
  feed('[REVIEWER] 🔍 AI Review Agent analyzing '+agentName+' output...','rev');
  await wait(400);
  try{
    const reviewRes=await callAPI(
      'You are a QA Review Agent at Meridian Wealth Advisory. Your job is to review the output of other AI agents for quality, accuracy, and professionalism. Be concise.\n\nRespond in EXACTLY this format:\nVERDICT: APPROVE or NEEDS_EDIT\nSCORE: <1-10>\nNOTES: <1-2 sentence review summary>\nIf NEEDS_EDIT, add:\nSUGGESTION: <specific improvement>',
      'Review this output from the '+agentName+' agent:\n\n'+content.substring(0,1500)
    );
    if(reviewRes){
      const verdict=reviewRes.match(/VERDICT:\s*(APPROVE|NEEDS_EDIT)/i);
      const score=reviewRes.match(/SCORE:\s*(\d+)/);
      const notes=reviewRes.match(/NOTES:\s*(.+)/i);
      const suggestion=reviewRes.match(/SUGGESTION:\s*(.+)/i);
      const v=verdict?verdict[1]:'APPROVE';
      const s=score?parseInt(score[1],10):9;
      const n=notes?notes[1]:'Reviewed.';
      feed('[REVIEWER] Score: '+s+'/10 — '+n,'rev');
      if(v==='NEEDS_EDIT'&&suggestion){
        feed('[REVIEWER] 💡 Suggestion: '+suggestion[1],'rev');
      }

      // Score below 8 or NEEDS_EDIT → escalate to human
      if(s<8||v==='NEEDS_EDIT'){
        feed('[REVIEWER] ⚠ Score below threshold — escalating to human review','rev');
        await wait(400);
        return requestHumanApproval(agentName, title, content, stepNum, totalSteps, s, n, suggestion?suggestion[1]:null);
      }

      feed('[REVIEWER] ✓ APPROVED','ok');
      await wait(600);
      return {approved:true,content:content,edited:false,aiReviewed:true,score:s};
    }
  }catch(e){
    feed('[REVIEWER] Review failed — escalating to human','sys');
    return requestHumanApproval(agentName, title||'Review Output', content, stepNum||1, totalSteps||3);
  }
  return {approved:true,content:content,edited:false,aiReviewed:true};
}

// ── APPROVAL GATE (Human or AI) ──
let _approvalStep=0;
function requestApproval(agentName, title, content, stepNum, totalSteps){
  // If AI Review is ON and we have an API key, use the review agent
  if(S.aiReview&&hasLiveAI()){
    return aiReviewContent(agentName, content, title, stepNum, totalSteps);
  }
  return requestHumanApproval(agentName, title, content, stepNum, totalSteps);
}

function requestHumanApproval(agentName, title, content, stepNum, totalSteps, aiScore, aiNotes, aiSuggestion){
  return new Promise((resolve)=>{
    const overlay=document.getElementById('approval-overlay');
    const preview=document.getElementById('ap-preview');
    const editArea=document.getElementById('ap-edit-area');
    const editBtn=document.getElementById('ap-edit-btn');
    const approveBtn=document.getElementById('ap-approve-btn');
    const skipBtn=document.getElementById('ap-skip-btn');
    const retryBtn=document.getElementById('ap-retry-btn');

    document.getElementById('ap-title').textContent=title;
    const agentColors={Scout:'96,165,250',Forge:'245,158,11',Herald:'192,132,252'};
    const ac=agentColors[agentName]||'16,185,129';
    approveBtn.style.background='rgb('+ac+')';
    document.querySelector('.ap-badge').style.borderColor='rgba('+ac+',.4)';
    document.querySelector('.ap-badge').style.color='rgb('+ac+')';
    document.querySelector('.ap-badge').style.background='rgba('+ac+',.08)';
    document.getElementById('ap-agent').textContent=agentName;
    document.getElementById('ap-count').textContent='Step '+stepNum+' of '+totalSteps;

    // If escalated from AI review, show feedback + retry button
    const escalated=(aiScore!==undefined);
    if(escalated){
      document.querySelector('.ap-badge').textContent='AI FLAGGED — Score '+aiScore+'/10';
      preview.textContent=(aiNotes?'⚠ AI Review: '+aiNotes+'\n':'')+(aiSuggestion?'💡 Suggestion: '+aiSuggestion+'\n\n':'')+'───────────────────\n\n'+content;
      retryBtn.style.display='inline-block';
    } else {
      document.querySelector('.ap-badge').textContent='HUMAN REVIEW';
      preview.textContent=content;
      retryBtn.style.display='none';
    }
    editArea.value=content;
    editArea.style.display='none';
    preview.style.display='block';
    let editing=false;

    function cleanup(){
      overlay.classList.remove('show');
      approveBtn.removeEventListener('click',onApprove);
      editBtn.removeEventListener('click',onEdit);
      skipBtn.removeEventListener('click',onSkip);
      retryBtn.removeEventListener('click',onRetry);
      retryBtn.style.display='none';
    }
    function onApprove(){
      const finalContent=editing?editArea.value:content;
      cleanup();
      feed('[SYSTEM] ✓ Human approved '+(editing?'(with edits)':''),'ok');
      resolve({approved:true,content:finalContent,edited:editing});
    }
    function onEdit(){
      if(!editing){
        editing=true;
        preview.style.display='none';
        editArea.style.display='block';
        editArea.focus();
        editBtn.textContent='Preview';
      } else {
        editing=false;
        preview.textContent=editArea.value;
        preview.style.display='block';
        editArea.style.display='none';
        editBtn.textContent='Edit';
      }
    }
    function onSkip(){
      cleanup();
      resolve({approved:true,content:content,edited:false,skipped:true});
    }
    async function onRetry(){
      cleanup();
      feed('[SYSTEM] ↻ Sending feedback to '+agentName+' for retry...','rev');
      await wait(300);
      // Call agent again with the reviewer's feedback
      const feedback='Previous attempt scored '+aiScore+'/10. Issues: '+(aiNotes||'quality below threshold')+'. Suggestion: '+(aiSuggestion||'improve overall quality')+'. Please redo your output addressing these specific issues.';
      feed('['+agentName.toUpperCase()+'] Retrying with reviewer feedback...','rev');
      const retryRes=await callAPI(
        'You are '+agentName+', an AI agent at Meridian Wealth Advisory. You previously produced output that was reviewed and scored '+aiScore+'/10. You must improve your output based on the feedback. Return ONLY the improved content, no explanation.',
        'ORIGINAL OUTPUT:\n'+content.substring(0,1500)+'\n\nREVIEWER FEEDBACK:\n'+feedback+'\n\nPlease produce an improved version.'
      );
      if(retryRes&&retryRes.length>20){
        feed('['+agentName.toUpperCase()+'] ✓ Retry complete — improved output generated','ok');
        // Re-review the retry result
        feed('[REVIEWER] 🔍 Re-reviewing retry output...','rev');
        await wait(400);
        const reReview=await callAPI(
          'You are a QA Review Agent. Score this REVISED output 1-10. Respond in format:\nVERDICT: APPROVE or NEEDS_EDIT\nSCORE: <1-10>\nNOTES: <1 sentence>',
          'Revised output from '+agentName+':\n\n'+retryRes.substring(0,1500)
        );
        const newScore=reReview?.match(/SCORE:\s*(\d+)/);
        const newNotes=reReview?.match(/NOTES:\s*(.+)/i);
        const ns=newScore?parseInt(newScore[1],10):8;
        feed('[REVIEWER] Retry Score: '+ns+'/10'+(newNotes?' — '+newNotes[1]:''),'rev');
        if(ns>=8){
          feed('[REVIEWER] ✓ APPROVED after retry','ok');
          await wait(400);
          resolve({approved:true,content:retryRes,edited:true,retried:true});
        } else {
          feed('[REVIEWER] Still below threshold — returning to human','rev');
          const result=await requestHumanApproval(agentName, title, retryRes, stepNum, totalSteps, ns, newNotes?newNotes[1]:'Still needs work', null);
          resolve(result);
        }
      } else {
        feed('['+agentName.toUpperCase()+'] Retry failed — returning to human review','sys');
        const result=await requestHumanApproval(agentName, title, content, stepNum, totalSteps);
        resolve(result);
      }
    }

    approveBtn.addEventListener('click',onApprove);
    editBtn.addEventListener('click',onEdit);
    skipBtn.addEventListener('click',onSkip);
    retryBtn.addEventListener('click',onRetry);
    overlay.classList.add('show');
    feed('[SYSTEM] ⏸ Waiting for human decision...','sys');
  });
}

// Timer
function startTimer(){
  S.elapsed=0;
  S.timer=setInterval(()=>{
    S.elapsed++;
    const m=String(Math.floor(S.elapsed/60)).padStart(2,'0');
    const s=String(S.elapsed%60).padStart(2,'0');
    document.getElementById('timer').textContent=m+':'+s;
  },1000);
}

// Feed translation map (EN → KO) — applied in order, longest phrases first
const FEED_KO=[
  // Agent bracket labels
  ['[SYSTEM]','[시스템]'],
  ['[ORCHESTRATOR]','[조율자]'],
  ['[SCOUT → ORCHESTRATOR]','[수집가 → 조율자]'],
  ['[FORGE → ORCHESTRATOR]','[제작자 → 조율자]'],
  ['[ORCHESTRATOR → FORGE]','[조율자 → 제작자]'],
  ['[ORCHESTRATOR → HERALD]','[조율자 → 배달원]'],
  ['[SCOUT]','[수집가]'],
  ['[FORGE]','[제작자]'],
  ['[HERALD]','[배달원]'],
  ['[REVIEWER]','[리뷰어]'],
  // Long phrases first
  ['AI Review Agent analyzing','AI 리뷰 에이전트가 분석 중:'],
  ['Score below threshold — escalating to human review','점수 미달 — 사람 리뷰로 에스컬레이션'],
  ['Still below threshold — returning to human','여전히 기준 미달 — 사람 리뷰로 반환'],
  ['Review failed — escalating to human','리뷰 실패 — 사람 리뷰로 에스컬레이션'],
  ['Retrying with reviewer feedback...','리뷰어 피드백으로 재시도 중...'],
  ['Retry complete — improved output generated','재시도 완료 — 개선된 출력 생성됨'],
  ['Re-reviewing retry output...','재시도 출력 재검토 중...'],
  ['Retry failed — returning to human review','재시도 실패 — 사람 리뷰로 반환'],
  ['Sending feedback to','피드백 전송 중:'],
  ['for retry...','재시도를 위해...'],
  ['Sending real email via Gmail API...','Gmail API로 실제 이메일 발송 중...'],
  ['Writing document based on research findings...','리서치 결과로 문서 작성 중...'],
  ['Live mode failed — falling back to simulation','라이브 모드 실패 — 시뮬레이션으로 대체'],
  ['AI generation insufficient — falling back to simulation','AI 생성 불충분 — 시뮬레이션으로 대체'],
  ['API failed — falling back to simulation','API 실패 — 시뮬레이션으로 대체'],
  ['Search error, continuing with goal context...','검색 오류, 목표 컨텍스트로 계속...'],
  ['Composing email based on document...','문서 기반으로 이메일 작성 중...'],
  ['Determining document title...','문서 제목 결정 중...'],
  ['Determining meeting details...','미팅 세부사항 결정 중...'],
  ['Send email + create calendar event','이메일 발송 + 캘린더 이벤트 생성'],
  ['Waiting for human decision...','사람의 결정을 기다리는 중...'],
  ['Human edited Scout findings','사람이 Scout 결과 수정함'],
  ['Human approved Scout findings','사람이 Scout 결과 승인함'],
  ['Human edited document — noted for Herald','사람이 문서 수정함 — Herald에게 전달'],
  ['Human approved document','사람이 문서 승인함'],
  ['Human edited email content','사람이 이메일 내용 수정함'],
  ['Human approved email for sending','사람이 이메일 발송 승인함'],
  ['Human approved','사람이 승인함'],
  ['Human edited','사람이 수정함'],
  ['(with edits)','(수정 포함)'],
  ['Orchestration started','오케스트레이션 시작'],
  ['Orchestration complete','오케스트레이션 완료'],
  ['Begin document creation','문서 작성 시작'],
  ['Research complete','리서치 완료'],
  ['Document created','문서 작성 완료'],
  ['Document ready','문서 준비 완료'],
  ['Running live web search...','실시간 웹 검색 중...'],
  ['Creating Google Doc:','Google Doc 생성 중:'],
  ['Real Google Doc created →','실제 Google Doc 생성됨 →'],
  ['GAS doc creation skipped (fallback)','GAS 문서 생성 건너뜀 (대체)'],
  ['GAS doc creation skipped','GAS 문서 생성 건너뜀'],
  ['Activating skill:','스킬 활성화:'],
  ['Analyzing prompt...','프롬프트 분석 중...'],
  ['Dispatching Scout...','Scout에게 전달 중...'],
  ['Writing document...','문서 작성 중...'],
  ['Drafting email...','이메일 작성 중...'],
  ['Composing email body...','이메일 본문 작성 중...'],
  ['Writing email body...','이메일 본문 작성 중...'],
  ['Sending email to','이메일 발송 중:'],
  ['Real email sent to','실제 이메일 발송 완료:'],
  ['Email sent','이메일 발송 완료'],
  ['Creating calendar event:','캘린더 이벤트 생성 중:'],
  ['Creating calendar event...','캘린더 이벤트 생성 중...'],
  ['Real calendar event created','실제 캘린더 이벤트 생성됨'],
  ['Calendar event created','캘린더 이벤트 생성 완료'],
  ['GAS email send failed','GAS 이메일 발송 실패'],
  ['GAS calendar failed','GAS 캘린더 실패'],
  ['GAS email error:','GAS 이메일 오류:'],
  ['GAS calendar error:','GAS 캘린더 오류:'],
  ['Request timed out','요청 시간 초과'],
  ['Search timed out','검색 시간 초과'],
  ['Search network error:','검색 네트워크 오류:'],
  ['Search Error:','검색 오류:'],
  ['Network error:','네트워크 오류:'],
  ['using sim fallback','시뮬레이션 대체 사용'],
  ['using fallback','대체 사용'],
  ['Retry Score:','재시도 점수:'],
  ['Score:','점수:'],
  ['Suggestion:','제안:'],
  ['APPROVED after retry','재시도 후 승인됨'],
  ['APPROVED','승인됨'],
  ['Retrying with reviewer feedback','리뷰어 피드백으로 재시도'],
  ['Searching:','검색 중:'],
  ['Goal:','목표:'],
  ['Time:','소요 시간:'],
  ['Error:','오류:']
];
function translateFeedMsg(msg){
  if(S.lang!=='ko')return msg;
  let out=msg;
  for(const [en,ko] of FEED_KO){
    // Use split/join for plain substring replace (all occurrences, no regex escaping needed)
    out=out.split(en).join(ko);
  }
  return out;
}

// ── Safe rich text: escape HTML first, then apply **bold** markup ──
// Prevents model/scenario output from injecting executable HTML into innerHTML.
function escHtml(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function richText(s){return escHtml(s).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');}

// Feed
function feed(msg,cls='sys',indent=false){
  const el=document.createElement('div');
  el.className='fl '+(indent?'indent ':'')+cls;
  el.textContent=translateFeedMsg(msg);
  el.setAttribute('data-raw',msg);
  const fb=document.getElementById('feed-body');
  fb.appendChild(el);
  fb.scrollTop=fb.scrollHeight;
}

function feedDelay(msgs,cls,interval=400,indent=false){
  return new Promise(res=>{
    let i=0;
    const go=()=>{
      if(i>=msgs.length){setTimeout(res,200);return;}
      feed(msgs[i++],cls,indent);
      setTimeout(go,interval);
    };go();
  });
}

// Nodes
function setSkill(id,state){
  const el=document.getElementById(id);
  if(el){el.setAttribute('class','skill-tag'+(state?' '+state:''));}
}
function setNode(id,state){
  const el=document.getElementById(id);
  if(el){el.setAttribute('class','nd '+state);}
}
function setConn(id,state){
  const el=document.getElementById(id);
  if(el){el.setAttribute('class','conn '+state);}
}
function setTab(name){
  document.querySelectorAll('.at').forEach(t=>t.classList.remove('on'));
  document.querySelectorAll('.ap').forEach(p=>p.classList.remove('vis'));
  const t=document.getElementById('tab-'+name);
  const p=document.getElementById(name==='waiting'?'waiting-panel':name+'-app');
  if(t)t.classList.add('on');
  if(p)p.classList.add('vis');
}
// Allow clicking tabs to switch views
document.querySelectorAll('.at').forEach(function(btn){
  btn.addEventListener('click',function(){setTab(btn.dataset.app);});
});

// ── DRAGGABLE SPLITTERS ──
(function(){
  // Vertical splitter: left-panel ↔ right-panel
  const sv=document.getElementById('splitter-v');
  const lp=document.getElementById('left-panel');
  const panels=document.getElementById('panels');
  let draggingV=false;

  sv.addEventListener('mousedown',function(e){
    e.preventDefault();draggingV=true;sv.classList.add('active');
    document.body.style.cursor='col-resize';document.body.style.userSelect='none';
  });

  // Horizontal splitter: diagram-area ↔ feed
  const sh=document.getElementById('splitter-h');
  const da=document.getElementById('diagram-area');
  let draggingH=false;

  sh.addEventListener('mousedown',function(e){
    e.preventDefault();draggingH=true;sh.classList.add('active');
    document.body.style.cursor='row-resize';document.body.style.userSelect='none';
  });

  document.addEventListener('mousemove',function(e){
    if(draggingV){
      const rect=panels.getBoundingClientRect();
      const pct=((e.clientX-rect.left)/rect.width)*100;
      const clamped=Math.max(20,Math.min(80,pct));
      lp.style.width=clamped+'%';
    }
    if(draggingH){
      const rect=lp.getBoundingClientRect();
      const y=e.clientY-rect.top;
      const clamped=Math.max(120,Math.min(rect.height-80,y));
      da.style.height=clamped+'px';
    }
  });

  document.addEventListener('mouseup',function(){
    if(draggingV){draggingV=false;sv.classList.remove('active');document.body.style.cursor='';document.body.style.userSelect='';}
    if(draggingH){draggingH=false;sh.classList.remove('active');document.body.style.cursor='';document.body.style.userSelect='';}
  });
})();

// Delay helper
const wait=ms=>new Promise(r=>setTimeout(r,ms));

// ── MAIN ORCHESTRATION ──
async function runOrchestration(d){
  S.running=true;
  window._currentScenario=d;
  // Use custom prompt if available
  const userGoal=d._displayGoal||d.goal;
  const _st=document.getElementById('status');
  _st.textContent=t('topbar.running');_st.setAttribute('data-status-key','topbar.running');
  _st.className='run';
  startTimer();

  // Shared state for passing data between agents
  const chain={scoutResults:null,forgeDoc:null,forgeTitle:null};

  // Which agents this goal actually needs. Defaults to the full pipeline so
  // existing scenarios are unchanged; scenarios can declare a shorter `path`
  // so the orchestrator routes dynamically (e.g. research-only).
  const AGENT_NAMES={scout:'Scout',forge:'Forge',herald:'Herald'};
  const path=Array.isArray(d.path)?d.path:['scout','forge','herald'];
  const skipped=['forge','herald'].filter(a=>!path.includes(a));

  feed('──────────────────────────────','sys');
  feed('[SYSTEM] Orchestration started','sys');
  feed('Goal: '+userGoal,'orc');
  feed('──────────────────────────────','sys');
  await wait(600);

  // Phase 1: Orchestrator analyzes the prompt
  setNode('nd-orc','active');
  if(!S.sim&&hasLiveAI()){
    feed('[ORCHESTRATOR] Analyzing prompt...','orc');
    try{
      const plan=await callAPI(
        'You are Orchestrator. Given a user goal, output exactly 3 lines — one task per agent. Format:\nTask 1 → Scout: <what to research>\nTask 2 → Forge: <what document to create>\nTask 3 → Herald: <what to send/schedule>\nNo other text.',
        userGoal
      );
      if(plan){
        const planLines=plan.split('\n').filter(l=>l.trim());
        for(const line of planLines){feed(line,'orc');await wait(450);}
      }
    }catch(e){
      await feedDelay(d.orc.lines,'orc',550);
    }
  } else {
    await feedDelay(d.orc.lines,'orc',550);
  }
  // Dynamic routing: the orchestrator decides which agents this goal needs.
  if(skipped.length){
    feed('[ORCHESTRATOR] Routing: this goal needs '+path.map(a=>AGENT_NAMES[a]).join(' + ')+' — '+skipped.map(a=>AGENT_NAMES[a]).join(', ')+' not required','orc');
    skipped.forEach(a=>setNode(a==='forge'?'nd-fge':'nd-her','skip'));
  } else {
    feed('[ORCHESTRATOR] Routing: full pipeline — Scout → Forge → Herald','orc');
  }
  await wait(450);
  feed('[ORCHESTRATOR] Dispatching Scout...','orc');
  await wait(400);

  // Phase 2: Scout
  setConn('c-orc-sco','active');
  await wait(400);
  setNode('nd-sco','active');
  setSkill('sk-sco-search','lit');
  feed('──────────────────────────────','sys');
  feed('[SCOUT] Activating skill: web_search','sco');
  await wait(300);

  if(!S.sim&&hasLiveAI()){
    chain.scoutResults=await runScoutLive2(userGoal);
    if(!chain.scoutResults){
      feed('[SCOUT] API failed — falling back to simulation','sys');
      await runScoutSim(d.sco);
      chain.scoutResults=d.sco.summary;
    }
  } else {
    await runScoutSim(d.sco);
    chain.scoutResults=d.sco.summary;
  }

  setSkill('sk-sco-search','done');
  setNode('nd-sco','done');setConn('c-orc-sco','done');
  feed('[SCOUT → ORCHESTRATOR] Research complete ✓','ok');
  await wait(500);

  // ── HUMAN APPROVAL: Scout Output ──
  if(chain.scoutResults){
    const scoutApproval=await requestApproval('Scout','Review Research Findings',chain.scoutResults,1,3);
    if(scoutApproval.edited){
      chain.scoutResults=scoutApproval.content;
      feed('[SYSTEM] ✓ Human edited Scout findings','ok');
    } else {
      feed('[SYSTEM] ✓ Human approved Scout findings','ok');
    }
    await wait(300);
  }

  // Phase 3: Forge (only if the goal needs a document)
  if(path.includes('forge')){
  setConn('c-orc-fge','active');
  await wait(400);
  setNode('nd-fge','active');
  setSkill('sk-fge-doc','lit');
  feed('──────────────────────────────','sys');
  feed('[FORGE] Activating skill: create_google_doc','fge');
  feed('[ORCHESTRATOR → FORGE] Begin document creation','orc');
  await wait(600);
  setTab('docs');

  if(!S.sim&&hasLiveAI()){
    const forgeResult=await runForgeLive2(userGoal,chain.scoutResults);
    if(forgeResult&&forgeResult.content&&forgeResult.content.length>20){
      chain.forgeDoc=forgeResult.content;
      chain.forgeTitle=forgeResult.title;
      // Create real Google Doc via GAS
      try{
        const gasContent=forgeResult.structured||[{t:'p',v:forgeResult.content}];
        const gasDoc=await callGAS('create_doc',{title:forgeResult.title,content:gasContent});
        if(gasDoc.success){S.lastDocId=gasDoc.result.docId;feed('[FORGE] Real Google Doc created → '+gasDoc.result.docUrl,'ok');}
        else if(gasDoc.skipped){feed('[FORGE] Live Google Doc skipped — simulation only','sys');}
      }catch(e){feed('[FORGE] GAS doc creation skipped (fallback)','sys');}
    } else {
      feed('[FORGE] AI generation insufficient — falling back to simulation','sys');
      await runForgeSim(d.fge);
      chain.forgeDoc=d.fge.content.map(b=>b.v).join('\n');
      chain.forgeTitle=d.fge.title;
    }
  } else {
    await runForgeSim(d.fge);
    chain.forgeDoc=d.fge.content.map(b=>typeof b.v==='string'?b.v:JSON.stringify(b.v)).join('\n');
    chain.forgeTitle=d.fge.title;
    // Create real Google Doc via GAS even in sim mode
    try{
      const gasDoc=await callGAS('create_doc',{title:d.fge.title,content:d.fge.content});
      if(gasDoc.success){S.lastDocId=gasDoc.result.docId;feed('[FORGE] Real Google Doc created → '+gasDoc.result.docUrl,'ok');}
      else if(gasDoc.skipped){feed('[FORGE] Live Google Doc skipped — simulation only','sys');}
    }catch(e){feed('[FORGE] GAS doc creation skipped','sys');}
  }

  setSkill('sk-fge-doc','done');
  setNode('nd-fge','done');setConn('c-orc-fge','done');
  document.getElementById('tab-docs').classList.add('done');
  feed('[FORGE → ORCHESTRATOR] Document created ✓','ok');
  await wait(500);

  // ── HUMAN APPROVAL: Forge Output ──
  if(chain.forgeDoc){
    const forgePreview=chain.forgeTitle+'\n\n'+chain.forgeDoc.substring(0,800)+(chain.forgeDoc.length>800?'\n...':'');
    const forgeApproval=await requestApproval('Forge','Review Document Draft',forgePreview,2,3);
    if(forgeApproval.edited){
      feed('[SYSTEM] ✓ Human edited document — noted for Herald','ok');
    } else {
      feed('[SYSTEM] ✓ Human approved document','ok');
    }
    await wait(300);
  }

  } // end Forge phase

  // Phase 4: Herald (only if the goal needs an email/calendar action)
  if(path.includes('herald')){
  setConn('c-orc-her','active');
  await wait(400);
  setNode('nd-her','active');
  setSkill('sk-her-email','lit');
  feed('──────────────────────────────','sys');
  feed('[HERALD] Activating skill: send_email','her');
  feed('[ORCHESTRATOR → HERALD] Send email + create calendar event','orc');
  await wait(600);
  setTab('gmail');

  if(!S.sim&&hasLiveAI()){
    try{
      await runHeraldLive2(userGoal,chain);
    }catch(e){
      feed('[HERALD] Live mode failed — falling back to simulation','sys');
      await runHeraldSim(d.her);
    }
  } else {
    await runHeraldSim(d.her);
  }

  setSkill('sk-her-email','done');
  setSkill('sk-her-cal','lit');
  feed('[HERALD] Activating skill: create_calendar','her');
  await wait(800);
  setSkill('sk-her-cal','done');
  setNode('nd-her','done');setConn('c-orc-her','done');
  document.getElementById('tab-gmail').classList.add('done');
  document.getElementById('tab-cal').classList.add('done');
  } // end Herald phase

  setNode('nd-orc','done');
  // Done
  clearInterval(S.timer);
  const _stDone=document.getElementById('status');
  _stDone.textContent=t('topbar.complete');_stDone.setAttribute('data-status-key','topbar.complete');
  _stDone.className='done';
  feed('──────────────────────────────','sys');
  feed('[SYSTEM] Orchestration complete ✓','ok');
  feed('[SYSTEM] Time: '+document.getElementById('timer').textContent,'sys');
}

// ── SCOUT SIM ──
async function runScoutSim(sco){
  for(const s of sco.searches){
    feed('[SCOUT] Searching: '+s.q,'sco');
    await wait(800);
    for(const r of s.r){
      feed('↳ '+r,'sco',false,true);
      await wait(420);
    }
    await wait(300);
  }
  feed('[SCOUT] '+sco.summary,'sco');
}

// ── FORGE SIM ──
async function runForgeSim(fge){
  feed('[FORGE] Creating Google Doc: "'+fge.title+'"','fge');
  document.getElementById('docs-title').textContent=fge.title;
  await wait(800);
  feed('[FORGE] Writing document...','fge');

  const container=document.getElementById('docs-content');
  container.innerHTML='<span class="cursor"></span>';
  const cursor=container.querySelector('.cursor');
  document.getElementById('gd-letterhead').classList.add('show');

  for(const block of fge.content){
    await wait(200);
    // Summary banner
    if(block.t==='summary'){
      const el=document.createElement('div');
      el.className='gd-summary';
      el.style.opacity='0';
      container.insertBefore(el,cursor);
      el.innerHTML=richText(block.v);
      requestAnimationFrame(()=>{el.style.transition='opacity .5s';el.style.opacity='1';});
      await wait(400);
    // Metric cards
    } else if(block.t==='metrics'){
      const row=document.createElement('div');
      row.className='gd-metrics';
      row.style.opacity='0';
      for(const m of block.v){
        const card=document.createElement('div');card.className='gd-metric';
        const valEl=document.createElement('div');valEl.className='gd-metric-val';
        if(/[\+↑]|growth|gain/i.test(m.val))valEl.classList.add('up');
        else if(/[\-↓]|decline|loss|drop/i.test(m.val))valEl.classList.add('down');
        valEl.textContent=m.val;
        const lblEl=document.createElement('div');lblEl.className='gd-metric-label';lblEl.textContent=m.label;
        card.appendChild(valEl);card.appendChild(lblEl);row.appendChild(card);
      }
      container.insertBefore(row,cursor);
      requestAnimationFrame(()=>{row.style.transition='opacity .5s';row.style.opacity='1';});
      await wait(500);
    // Callout box
    } else if(block.t==='callout'){
      const el=document.createElement('div');
      el.className='gd-callout'+(block.style?' '+block.style:'');
      el.style.opacity='0';
      el.innerHTML=richText(block.v);
      container.insertBefore(el,cursor);
      requestAnimationFrame(()=>{el.style.transition='opacity .4s';el.style.opacity='1';});
      await wait(350);
    // HR divider
    } else if(block.t==='hr'){
      container.insertBefore(document.createElement('hr'),cursor);
      await wait(100);
    // Standard elements
    } else {
      const el=document.createElement(block.t==='h1'?'h1':block.t==='h2'?'h2':block.t==='p'?'p':'ul');
      if(block.t==='ul'){
        for(const item of block.v){
          const li=document.createElement('li');
          container.insertBefore(li,cursor);
          if(item.includes('**')){li.innerHTML=richText(item);await wait(TYPE_SPEED.body*item.length*0.3);}
          else{await typeInto(li,item,TYPE_SPEED.body);}
          await wait(80);
        }
      } else {
        container.insertBefore(el,cursor);
        await typeInto(el,block.v,block.t==='h1'?TYPE_SPEED.title:block.t==='h2'?TYPE_SPEED.heading:TYPE_SPEED.body);
      }
    }
    await wait(150);
  }
  cursor.remove();
  document.getElementById('gd-footer').classList.add('show');
  feed('[FORGE] Document ready ✓','fge');
}

// ── HERALD SIM ──
async function runHeraldSim(her){
  const recipient=getRecipient()||her.to;
  feed('[HERALD] Drafting email...','her');
  await wait(600);

  // Fill email fields
  await typeInto(document.getElementById('gm-to'),recipient,TYPE_SPEED.fast);
  await wait(200);
  await typeInto(document.getElementById('gm-subj'),her.subj,TYPE_SPEED.email);
  await wait(200);
  // Show branded header and signature
  document.getElementById('gm-brand').classList.add('show');
  feed('[HERALD] Composing email body...','her');
  await typeInto(document.getElementById('gm-body'),her.body,TYPE_SPEED.email);
  document.getElementById('gm-sig').classList.add('show');
  document.getElementById('gm-disclaimer').classList.add('show');
  await wait(600);

  // ── HUMAN APPROVAL: Sim email before sending ──
  const simEmailPreview='To: '+recipient+'\nSubject: '+her.subj+'\n\n'+her.body;
  const simApproval=await requestApproval('Herald','Approve Email Before Sending',simEmailPreview,3,3);
  if(simApproval.edited){
    feed('[SYSTEM] ✓ Human edited email content','ok');
  } else {
    feed('[SYSTEM] ✓ Human approved email for sending','ok');
  }
  await wait(300);

  // Send
  feed('[HERALD] Sending email to '+recipient+'...','her');
  document.getElementById('gm-sending').hidden=false;
  await wait(1200);
  document.getElementById('gm-compose').style.display='none';
  document.getElementById('gm-sent').hidden=false;
  document.getElementById('gm-sent-to').textContent='Sent to '+recipient;
  feed('[HERALD] Email sent ✓','ok');
  await wait(800);

  // Calendar
  setTab('cal');
  feed('[HERALD] Creating calendar event...','her');
  await wait(1000);
  const evtEl=document.getElementById('gc-event-detail');
  document.getElementById('gc-evt-title').textContent=her.evt.title;
  document.getElementById('gc-evt-time').textContent=her.evt.time;
  evtEl.hidden=false;

  // Highlight day
  const dayEls=document.querySelectorAll('.gc-day-num');
  dayEls.forEach(d=>{
    if(parseInt(d.textContent)===her.evt.day){
      const evtChip=d.parentElement.querySelector('.gc-event');
      if(evtChip){evtChip.classList.add('show');}
    }
  });
  feed('[HERALD] Calendar event created ✓','ok');
  await wait(400);
}

// ── LIVE SCOUT v2 (returns results for chain) ──
async function runScoutLive2(userGoal){
  try{
    feed('[SCOUT] Running live web search...','sco');
    const res=await callAPI(
      'You are Scout, a research agent at Meridian Wealth Advisory (a Sydney-based financial advisory firm). Your job is to search the web and return key findings relevant to the user\'s goal. Format your response as a bulleted list of findings (use • as bullet). Keep it concise, 8-12 bullet points total. These findings will be passed to a document-writing agent next.',
      'Research this topic thoroughly for Meridian Wealth Advisory: '+userGoal,
      [{type:'web_search_20250305',name:'web_search'}]
    );
    if(res){
      const lines=res.split('\n').filter(l=>l.trim());
      for(const line of lines){
        feed('[SCOUT] '+line,'sco');
        await wait(350);
      }
      return res;
    }
    return null;
  } catch(e){
    feed('[SCOUT] Search error, continuing with goal context...','sys');
    return null;
  }
}

// ── LIVE FORGE v2 (uses Scout results, returns doc for Herald) ──
async function runForgeLive2(userGoal,scoutResults){
  const result={title:'',content:'',structured:null};
  try{
    // Step 1: Ask Claude to determine a good document title
    feed('[FORGE] Determining document title...','fge');
    const titleRes=await callAPI(
      'Given a user goal, output ONLY a short professional document title (no quotes, no explanation). Example: "Q3 2025 Client Portfolio Report"',
      userGoal
    );
    result.title=(titleRes||'Report').replace(/^["']|["']$/g,'').trim();
    document.getElementById('docs-title').textContent=result.title;

    // Step 2: Generate document content based on Scout findings
    feed('[FORGE] Writing document based on research findings...','fge');
    const scoutContext=scoutResults?'\n\nResearch findings from Scout agent:\n'+scoutResults:'';

    // Build company context + reference data from scenario for richer output
    const companyCtx='\n\nCOMPANY CONTEXT (use this data):\n'+JSON.stringify(COMPANY)+'\n\nThe document is being prepared by '+COMPANY.name+'. Use real team names, client names, and company details from above.';
    // Extract reference data points from sim scenario content
    let refData='';
    if(window._currentScenario&&window._currentScenario.fge&&window._currentScenario.fge.content){
      const simContent=window._currentScenario.fge.content;
      const refParts=[];
      simContent.forEach(function(b){
        if(b.t==='metrics'&&Array.isArray(b.v)){refParts.push('KEY METRICS (use in dashboard): '+b.v.map(function(m){return m.label+': '+m.val}).join(', '));}
        else if(b.t==='summary'){refParts.push('EXECUTIVE SUMMARY GUIDANCE: '+b.v.substring(0,200));}
        else if(b.t==='h2'){refParts.push('SECTION TO INCLUDE: '+b.v);}
        else if(b.t==='ul'&&Array.isArray(b.v)){refParts.push('SUPPORTING DETAILS: '+b.v.join('; '));}
        else if(b.t==='callout'){refParts.push('INSIGHT: '+(b.style==='warn'?'WARNING: ':'TIP: ')+b.v);}
      });
      if(refParts.length){refData='\n\nREFERENCE DATA (incorporate these specific numbers and insights):\n'+refParts.join('\n');}
    }

    const docRes=await callAPI(
      'You are Forge, a document creation agent at Meridian Wealth Advisory (a Sydney-based financial advisory firm, Level 12, 88 Pitt St). Create a comprehensive, multi-section professional business document using the research findings AND the reference data provided. You MUST use the specific numbers, names, and data points from the reference data — do not make up generic placeholders.\n\nCRITICAL: The document must have AT LEAST 4-6 sections with ## headings. Use ALL the section headings and data points from the reference data. Do not just output one section — create a full, polished report.\n\nFormatting rules:\n- Use # for the document title (only one)\n- Immediately after the title, write ONE summary sentence (this becomes a highlighted executive summary banner)\n- Use [METRIC: Label | Value] for key data points — place 2-4 on consecutive lines right after the summary to create a metrics dashboard. Use the EXACT metrics from the reference data. Examples:\n  [METRIC: Portfolio Value | $4.2M]\n  [METRIC: YTD Return | +12.3%]\n- Use ## for section headings\n- Use --- between major sections\n- Use > for important callouts or insights (rendered as highlight boxes). Prefix with type:\n  > TIP: This is a positive insight\n  > WARNING: This needs attention\n- Use - for bullet points, and **bold** for key terms\n- Keep paragraphs concise (2-3 sentences)\n- Include specific numbers and data from the reference data and research\n- End with a professional sign-off from Meridian Wealth Advisory\n- Return ONLY the document content, no preamble.',
      'Goal: '+userGoal+scoutContext+companyCtx+refData+'\n\nCreate a COMPLETE, multi-section professional document with 4-6 sections. Use ALL the specific data provided — do NOT use generic placeholders or output only a partial document.'
    );

    if(docRes){
      result.content=docRes;
      // Render in UI with typing animation
      const container=document.getElementById('docs-content');
      container.innerHTML='<span class="cursor"></span>';
      const cursor=container.querySelector('.cursor');
      document.getElementById('gd-letterhead').classList.add('show');
      const structured=[];
      const lines=docRes.split('\n');
      let afterH1=false; // track if next paragraph is the executive summary
      let metricBuf=[]; // buffer for consecutive metric lines

      function flushMetrics(){
        if(!metricBuf.length)return;
        const row=document.createElement('div');
        row.className='gd-metrics';
        row.style.opacity='0';
        for(const m of metricBuf){
          const card=document.createElement('div');
          card.className='gd-metric';
          const valEl=document.createElement('div');
          valEl.className='gd-metric-val';
          // Color code: green for positive indicators, red for negative
          if(/[\+↑]|increase|up|growth|gain/i.test(m.val))valEl.classList.add('up');
          else if(/[\-↓]|decrease|down|decline|loss|drop/i.test(m.val))valEl.classList.add('down');
          valEl.textContent=m.val;
          const lblEl=document.createElement('div');
          lblEl.className='gd-metric-label';
          lblEl.textContent=m.label;
          card.appendChild(valEl);
          card.appendChild(lblEl);
          row.appendChild(card);
        }
        container.insertBefore(row,cursor);
        // Animate in
        requestAnimationFrame(()=>{row.style.transition='opacity .5s';row.style.opacity='1';});
        metricBuf=[];
      }

      for(let li=0;li<lines.length;li++){
        const rawLine=lines[li];
        const line=rawLine.trimStart();
        if(!line.trim()){flushMetrics();await wait(80);continue;}

        // Horizontal rule
        if(/^[-*_]{3,}\s*$/.test(line.trim())){
          flushMetrics();
          structured.push({t:'hr'});
          const hr=document.createElement('hr');
          container.insertBefore(hr,cursor);
          await wait(100);continue;
        }

        // Metric line: [METRIC: label | value] or variations
        const metricMatch=line.match(/^\[(?:METRIC|KPI|STAT)[:\s]*([^|]+)\|([^\]]+)\]/i);
        if(metricMatch){
          metricBuf.push({label:metricMatch[1].trim(),val:metricMatch[2].trim()});
          // Peek ahead: if next line is not a metric, flush
          const nextLine=(li+1<lines.length)?lines[li+1].trimStart():'';
          if(!/^\[(?:METRIC|KPI|STAT)/i.test(nextLine)){
            structured.push({t:'metrics',v:metricBuf.map(m=>({label:m.label,val:m.val}))});
            flushMetrics();
          }
          await wait(150);continue;
        }

        // Blockquote → callout box
        if(line.startsWith('> ')){
          flushMetrics();
          const raw=line.slice(2).trim();
          const callout=document.createElement('div');
          // Detect callout type
          if(/^(?:WARNING|⚠)/i.test(raw)){
            callout.className='gd-callout warn';
            callout.innerHTML=richText(raw.replace(/^(?:WARNING|⚠)[:\s]*/i,''));
          } else if(/^(?:TIP|✓|SUCCESS|APPROVED)/i.test(raw)){
            callout.className='gd-callout ok';
            callout.innerHTML=richText(raw.replace(/^(?:TIP|✓|SUCCESS|APPROVED)[:\s]*/i,''));
          } else {
            callout.className='gd-callout';
            callout.innerHTML=richText(raw);
          }
          callout.style.opacity='0';
          container.insertBefore(callout,cursor);
          requestAnimationFrame(()=>{callout.style.transition='opacity .4s';callout.style.opacity='1';});
          const calloutStyle=/^(?:WARNING|⚠)/i.test(raw)?'warn':/^(?:TIP|✓|SUCCESS)/i.test(raw)?'ok':'';
          const calloutText=raw.replace(/^(?:WARNING|⚠|TIP|✓|SUCCESS|APPROVED)[:\s]*/i,'').replace(/\*\*/g,'');
          structured.push({t:'callout',v:calloutText,style:calloutStyle});
          await wait(300);continue;
        }

        let el;
        // Headings
        if(line.startsWith('# ')&&!line.startsWith('## ')){
          flushMetrics();
          const text=line.slice(2).trim();
          structured.push({t:'h1',v:text});
          el=document.createElement('h1');
          container.insertBefore(el,cursor);
          await typeInto(el,text,TYPE_SPEED.title);
          afterH1=true;
        } else if(line.startsWith('## ')){
          flushMetrics();
          const text=line.slice(3).trim();
          structured.push({t:'h2',v:text});
          el=document.createElement('h2');
          container.insertBefore(el,cursor);
          await typeInto(el,text,TYPE_SPEED.heading);
          afterH1=false;
        } else if(line.startsWith('### ')){
          flushMetrics();
          const text=line.slice(4).trim();
          structured.push({t:'h2',v:text});
          el=document.createElement('h2');
          container.insertBefore(el,cursor);
          await typeInto(el,text,TYPE_SPEED.heading);
          afterH1=false;
        // Bullets
        } else if(/^[-*]\s/.test(line)||/^\d+[.)]\s/.test(line)){
          flushMetrics();
          const text=line.replace(/^[-*]\s+/,'').replace(/^\d+[.)]\s+/,'').trim();
          let ul=cursor.previousSibling;
          if(!ul||ul.tagName!=='UL'){ul=document.createElement('ul');container.insertBefore(ul,cursor);}
          const liEl=document.createElement('li');
          ul.appendChild(liEl);
          if(text.includes('**')){liEl.innerHTML=richText(text);await wait(TYPE_SPEED.body*text.length*0.3);}
          else{await typeInto(liEl,text,TYPE_SPEED.body);}
          const cleanBullet=text; // keep with ** for GAS bold rendering
          const last=structured[structured.length-1];
          if(last&&last.t==='ul'){last.v.push(cleanBullet);}
          else{structured.push({t:'ul',v:[cleanBullet]});}
          await wait(60);continue;
        // Bold headings
        } else if(/^\*\*[^*]+\*\*:?\s*$/.test(line.trim())){
          flushMetrics();
          const text=line.replace(/\*\*/g,'').replace(/:?\s*$/,'').trim();
          structured.push({t:'h2',v:text});
          el=document.createElement('h2');
          container.insertBefore(el,cursor);
          await typeInto(el,text,TYPE_SPEED.heading);
          afterH1=false;
        // Regular paragraph
        } else {
          flushMetrics();
          const plainText=line.replace(/\*\*([^*]+)\*\*/g,'$1').trim();
          // If this is the first paragraph right after h1 → summary banner
          if(afterH1){
            structured.push({t:'summary',v:plainText});
            el=document.createElement('div');
            el.className='gd-summary';
            el.innerHTML=richText(line.trim());
            el.style.opacity='0';
            container.insertBefore(el,cursor);
            requestAnimationFrame(()=>{el.style.transition='opacity .5s';el.style.opacity='1';});
            await wait(TYPE_SPEED.body*plainText.length*0.3);
            afterH1=false;
          } else {
            structured.push({t:'p',v:plainText});
            el=document.createElement('p');
            el.innerHTML=richText(line.trim());
            container.insertBefore(el,cursor);
            await wait(TYPE_SPEED.body*plainText.length*0.3);
          }
        }
        await wait(100);
      }
      flushMetrics();
      cursor.remove();
      document.getElementById('gd-footer').classList.add('show');
      result.structured=structured;
    } else {
      result.title=userGoal.substring(0,50);
      result.content=userGoal;
    }
    feed('[FORGE] Document ready ✓','fge');
  } catch(e){
    feed('[FORGE] Error: '+e.message+', using fallback','sys');
    result.title=userGoal.substring(0,50);
    result.content=userGoal;
  }
  return result;
}

// ── LIVE HERALD v2 (uses Forge output, generates real email) ──
async function runHeraldLive2(userGoal,chain){
  const recipient=getRecipient();
  try{
    // Step 1: Ask Claude to compose an email based on the document
    feed('[HERALD] Composing email based on document...','her');
    const emailRes=await callAPI(
      'You are Herald, a communication agent at Meridian Wealth Advisory. Write a brief professional email to accompany a document that was just created. Do NOT include a sign-off name or title — the email signature is added automatically. End the body with a closing like "Best regards," or "Warm regards," and nothing after it. Output EXACTLY in this format (no other text):\nSUBJECT: <email subject>\nBODY:\n<email body>\n\nKeep the body under 8 lines. Be professional but warm. Reference the key points from the document.',
      'Goal: '+userGoal+'\n\nDocument title: '+(chain.forgeTitle||'Report')+'\n\nDocument summary: '+(chain.forgeDoc||'').substring(0,500)
    );

    let subject='Re: '+(chain.forgeTitle||'Report');
    let body='Please find the attached document.';

    if(emailRes){
      const subjMatch=emailRes.match(/SUBJECT:\s*(.+)/i);
      const bodyMatch=emailRes.match(/BODY:\s*([\s\S]+)/i);
      if(subjMatch)subject=subjMatch[1].trim();
      if(bodyMatch)body=bodyMatch[1].trim();
    }
    // Strip any trailing sign-off name/title from GPT output for preview
    body=body.replace(/(\b(?:Best|Warm|Kind)\s+regards,?)\s*\n[\s\S]*$/i,'$1');

    // Animate email in UI
    await typeInto(document.getElementById('gm-to'),recipient,TYPE_SPEED.fast);
    await wait(200);
    await typeInto(document.getElementById('gm-subj'),subject,TYPE_SPEED.email);
    await wait(200);
    // Show branded header and signature
    document.getElementById('gm-brand').classList.add('show');
    feed('[HERALD] Writing email body...','her');
    await typeInto(document.getElementById('gm-body'),body,TYPE_SPEED.email);
    document.getElementById('gm-sig').classList.add('show');
    document.getElementById('gm-disclaimer').classList.add('show');
    await wait(600);

    // ── HUMAN APPROVAL: Email before sending ──
    const emailPreview='To: '+recipient+'\nSubject: '+subject+'\n\n'+body;
    const heraldApproval=await requestApproval('Herald','Approve Email Before Sending',emailPreview,3,3);
    if(heraldApproval.edited){
      // Parse edited content back
      const edited=heraldApproval.content;
      const subjLine=edited.match(/Subject:\s*(.+)/i);
      const bodyPart=edited.split(/\n\n/);
      if(subjLine)subject=subjLine[1].trim();
      if(bodyPart.length>1)body=bodyPart.slice(1).join('\n\n').trim();
      // Update UI with edits
      document.getElementById('gm-subj').textContent=subject;
      document.getElementById('gm-body').textContent=body;
      feed('[SYSTEM] ✓ Human edited email content','ok');
    } else {
      feed('[SYSTEM] ✓ Human approved email for sending','ok');
    }
    await wait(300);

    // Send via GAS with HTML formatting when the server owner enabled live actions.
    feed(hasLiveActions()?'[HERALD] Sending real email via Gmail API...':'[HERALD] Simulating email send...','her');
    document.getElementById('gm-sending').hidden=false;
    try{
      // Strip any trailing sign-off name/title that GPT may have added despite instructions
      // Keep "Best regards," but remove lines after it (name, title, company)
      let cleanBody=body.replace(/(\b(?:Best|Warm|Kind)\s+regards,?)\s*\n[\s\S]*$/i,'$1');
      const bodyHtml=cleanBody.replace(/\n/g,'<br>');
      const htmlBody='<div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto">'
        +'<div style="border-bottom:3px solid #f59e0b;padding-bottom:16px;margin-bottom:20px">'
        +'<table cellpadding="0" cellspacing="0" border="0"><tr>'
        +'<td style="background:#1a1a2e;color:#f59e0b;font-size:16px;font-weight:bold;padding:6px 12px;border-radius:4px;font-family:Arial,sans-serif">MW</td>'
        +'<td style="padding-left:12px">'
        +'<div style="font-size:14px;font-weight:bold;color:#1a1a2e;font-family:Arial,sans-serif">Meridian Wealth Advisory</div>'
        +'<div style="font-size:11px;color:#70757a;font-family:Arial,sans-serif">Financial Advisory · Wealth Management</div>'
        +'</td></tr></table>'
        +'</div>'
        +'<div style="font-size:14px;line-height:1.7;color:#202124;padding:0 0 24px">'+bodyHtml+'</div>'
        +'<div style="border-top:1px solid #e8eaed;padding-top:16px;margin-top:8px">'
        +'<table cellpadding="0" cellspacing="0" border="0"><tr>'
        +'<td style="background:#1a1a2e;color:#f59e0b;font-size:11px;font-weight:bold;padding:4px 8px;border-radius:3px;font-family:Arial,sans-serif">MW</td>'
        +'<td style="padding-left:10px;font-family:Arial,sans-serif">'
        +'<div style="font-size:12px;font-weight:bold;color:#1a1a2e">Sadie Kim</div>'
        +'<div style="font-size:11px;color:#70757a">Senior Advisor</div>'
        +'<div style="font-size:11px;color:#70757a">Meridian Wealth Advisory</div>'
        +'<div style="font-size:10px;color:#9aa0a6;margin-top:4px">Level 12, 88 Pitt Street, Sydney NSW 2000</div>'
        +'<div style="font-size:10px;color:#9aa0a6">T: +61 2 9188 4200 · ABN 47 612 903 158</div>'
        +'</td></tr></table>'
        +'</div>'
        +'<div style="font-size:9px;color:#bdc1c6;margin-top:16px;padding-top:12px;border-top:1px solid #f0f0f0">'
        +'This email and any attachments are confidential and intended for the named recipient only. If received in error, please notify the sender and delete all copies.</div>'
        +'</div>';
      // Plain text fallback also gets clean body + text signature
      const plainBody=cleanBody+'\n\nSadie Kim\nSenior Advisor · Meridian Wealth Advisory\nLevel 12, 88 Pitt Street, Sydney NSW 2000\nT: +61 2 9188 4200';
      const emailData={to:recipient,subject:subject,body:plainBody,htmlBody:htmlBody};
      if(S.lastDocId){emailData.attachDocId=S.lastDocId;}
      const gasRes=await callGAS('send_email',emailData);
      if(gasRes.success){feed('[HERALD] ✓ Real email sent to '+recipient,'ok');}
      else if(gasRes.skipped){feed('[HERALD] Live email skipped — simulation only','sys');}
      else{feed('[HERALD] GAS email error: '+(gasRes.error||'unknown'),'sys');}
    }catch(e){feed('[HERALD] GAS email send failed','sys');}

    document.getElementById('gm-compose').style.display='none';
    document.getElementById('gm-sent').hidden=false;
    document.getElementById('gm-sent-to').textContent='Sent to '+recipient;
    feed('[HERALD] Email sent ✓','ok');
    await wait(800);

    // Step 2: Create calendar event
    setTab('cal');
    feed('[HERALD] Determining meeting details...','her');
    const evtRes=await callAPI(
      'You are Herald. Suggest a follow-up meeting for this goal. Output EXACTLY (no other text):\nTITLE: <meeting title>\nDAY: <number 14-18 representing a day in April 2026>\nHOUR: <number 9-17 for start hour>\nDURATION: <30 or 60>',
      'Goal: '+userGoal+'\nDocument: '+(chain.forgeTitle||'Report')
    );

    let evtTitle='Follow-up Meeting';
    let evtDay=14;let evtHour=9;let evtDur=30;
    if(evtRes){
      const tm=evtRes.match(/TITLE:\s*(.+)/i);
      const dm=evtRes.match(/DAY:\s*(\d+)/i);
      const hm=evtRes.match(/HOUR:\s*(\d+)/i);
      const durm=evtRes.match(/DURATION:\s*(\d+)/i);
      if(tm)evtTitle=tm[1].trim();
      if(dm)evtDay=parseInt(dm[1]);
      if(hm)evtHour=parseInt(hm[1]);
      if(durm)evtDur=parseInt(durm[1]);
    }

    feed(hasLiveActions()?'[HERALD] Creating calendar event: '+evtTitle:'[HERALD] Simulating calendar event: '+evtTitle,'her');
    const startISO=`2026-04-${String(evtDay).padStart(2,'0')}T${String(evtHour).padStart(2,'0')}:00:00+10:00`;
    const endISO=`2026-04-${String(evtDay).padStart(2,'0')}T${String(evtHour).padStart(2,'0')}:${evtDur===60?'59':'30'}:00+10:00`;
    try{
      const calRes=await callGAS('create_event',{
        title:evtTitle,startTime:startISO,endTime:endISO,
        description:'Created by Agent Orchestration — Goal: '+userGoal,
        attendees:[recipient]
      });
      if(calRes.success){feed('[HERALD] ✓ Real calendar event created','ok');}
      else if(calRes.skipped){feed('[HERALD] Live calendar skipped — simulation only','sys');}
      else{feed('[HERALD] GAS calendar error: '+(calRes.error||'unknown'),'sys');}
    }catch(e){feed('[HERALD] GAS calendar failed','sys');}

    // Update calendar UI
    const evtTimeStr=`Monday, April ${evtDay}, 2026 · ${evtHour}:00–${evtHour}:${evtDur===60?'59':'30'}`;
    const evtEl=document.getElementById('gc-event-detail');
    document.getElementById('gc-evt-title').textContent=evtTitle;
    document.getElementById('gc-evt-time').textContent=evtTimeStr;
    evtEl.hidden=false;
    const dayEls=document.querySelectorAll('.gc-day-num');
    dayEls.forEach(d=>{
      if(parseInt(d.textContent)===evtDay){
        const evtChip=d.parentElement.querySelector('.gc-event');
        if(evtChip){evtChip.classList.add('show');}
      }
    });
    feed('[HERALD] Calendar event created ✓','ok');
    await wait(400);

  } catch(e){
    feed('[HERALD] Error: '+e.message+', using sim fallback','sys');
    // Minimal fallback
    document.getElementById('gm-to').textContent=recipient;
    document.getElementById('gm-subj').textContent='Re: '+(chain.forgeTitle||'Report');
    document.getElementById('gm-body').textContent='Please see the attached document.';
    document.getElementById('gm-compose').style.display='none';
    document.getElementById('gm-sent').hidden=false;
    document.getElementById('gm-sent-to').textContent='Sent to '+recipient;
  }
}

// ── API CALL (with timeout + error handling) ──
// ── OpenAI Chat Completions (for Forge, Herald, Orchestrator) ──
async function callAPI(sys,user,tools=[]){
  const hasSearch=tools.some(t=>t.type&&t.type.includes('web_search'));
  if(hasSearch) return callAPISearch(sys,user); // route to Responses API

  if(S.apiMode==='proxy'){
    try{
      const r=await fetch('/api/openai/chat',{
        method:'POST',
        headers:apiHeaders(),
        body:JSON.stringify({system:sys,user})
      });
      const data=await r.json();
      if(!r.ok||data.error){feed('[API] Error: '+(data.error||('HTTP '+r.status)),'sys');return null;}
      return data.content||null;
    }catch(e){
      feed('[API] Network error: '+e.message,'sys');
      return null;
    }
  }

  const body={model:S.model||'gpt-4o',max_tokens:2000,messages:[{role:'system',content:sys},{role:'user',content:user}]};
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),45000);
  try{
    const r=await fetch('https://api.openai.com/v1/chat/completions',{
      method:'POST',signal:controller.signal,
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+S.apiKey},
      body:JSON.stringify(body)
    });
    clearTimeout(timeout);
    if(!r.ok){const errBody=await r.text();feed('[API] Error: HTTP '+r.status+' — '+errBody.substring(0,200),'sys');return null;}
    const data=await r.json();
    if(data.error){feed('[API] Error: '+data.error.message,'sys');return null;}
    return data.choices?.[0]?.message?.content||null;
  }catch(e){
    clearTimeout(timeout);
    if(e.name==='AbortError'){feed('[API] Request timed out','sys');}
    else{feed('[API] Network error: '+e.message,'sys');}
    return null;
  }
}

// ── OpenAI Responses API (for Scout web search) ──
async function callAPISearch(sys,user){
  if(S.apiMode==='proxy'){
    try{
      const r=await fetch('/api/openai/search',{
        method:'POST',
        headers:apiHeaders(),
        body:JSON.stringify({system:sys,user})
      });
      const data=await r.json();
      if(!r.ok||data.error){feed('[API] Search Error: '+(data.error||('HTTP '+r.status)),'sys');return null;}
      return data.content||null;
    }catch(e){
      feed('[API] Search network error: '+e.message,'sys');
      return null;
    }
  }

  const body={model:'gpt-4o',input:[{role:'system',content:sys},{role:'user',content:user}],tools:[{type:'web_search_preview'}]};
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),45000);
  try{
    const r=await fetch('https://api.openai.com/v1/responses',{
      method:'POST',signal:controller.signal,
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+S.apiKey},
      body:JSON.stringify(body)
    });
    clearTimeout(timeout);
    if(!r.ok){const errBody=await r.text();feed('[API] Search Error: HTTP '+r.status+' — '+errBody.substring(0,200),'sys');return null;}
    const data=await r.json();
    if(data.error){feed('[API] Search Error: '+data.error.message,'sys');return null;}
    // Extract text from Responses API output
    const textBlocks=data.output?.filter(b=>b.type==='message')?.flatMap(m=>m.content?.filter(c=>c.type==='output_text').map(c=>c.text))||[];
    return textBlocks.join('\n')||null;
  }catch(e){
    clearTimeout(timeout);
    if(e.name==='AbortError'){feed('[API] Search timed out','sys');}
    else{feed('[API] Search network error: '+e.message,'sys');}
    return null;
  }
}

// ── TYPE ANIMATION ──
const TYPE_SPEED={title:20,heading:20,body:14,email:16,fast:10};
const reduceMotion=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
async function typeInto(el,text,speed=TYPE_SPEED.body){
  if(reduceMotion){el.textContent=text;return;} // a11y: no typing animation
  for(let i=0;i<=text.length;i++){
    el.textContent=text.slice(0,i);
    await wait(speed);
  }
}

// ── CALENDAR BUILD (dynamic: shows current week + next week) ──
function buildCalendar(){
  const week=document.getElementById('gc-week');
  week.innerHTML='';
  const now=new Date();
  const todayDate=now.getDate();
  // Find Monday of current week
  const dayOfWeek=now.getDay(); // 0=Sun,1=Mon...
  const mondayOffset=dayOfWeek===0?-6:1-dayOfWeek;
  const monday=new Date(now);
  monday.setDate(todayDate+mondayOffset);
  // Show 14 days (current week + next week) to cover event scheduling
  const dayNames=['Mon','Tue','Wed','Thu','Fri','Sat','Sun','Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  for(let i=0;i<14;i++){
    const d=new Date(monday);
    d.setDate(monday.getDate()+i);
    const dateNum=d.getDate();
    const day=document.createElement('div');
    day.className='gc-day';
    const hdr=document.createElement('div');
    hdr.className='gc-day-hdr';hdr.textContent=dayNames[i];
    const num=document.createElement('div');
    num.className='gc-day-num'+(dateNum===todayDate?' today':'');
    num.textContent=dateNum;
    day.appendChild(hdr);day.appendChild(num);
    // Event chip (hidden until Herald activates it)
    const evt=document.createElement('div');
    evt.className='gc-event';
    evt.textContent='Meeting';
    day.appendChild(evt);
    week.appendChild(day);
  }
}

// ── KEYBOARD SHORTCUT ──
document.addEventListener('keydown',e=>{
  if(e.ctrlKey&&e.shiftKey&&e.key==='D'){
    const dbg=document.getElementById('dbg');
    dbg.style.display=dbg.style.display==='flex'?'none':'flex';
  }
});
