// ── Fictional company + simulation scenario data (data only) ──
// Authored here; scripts/build.mjs concatenates this BEFORE app.js into the
// single-file bundle, so COMPANY/SCENARIOS are in scope for app.js.

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
