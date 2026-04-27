import React, { useState } from 'react';

// ─── DATA ────────────────────────────────────────────────────────────────────

const coreSubjects = [
  { id:1,  name:"Data Structures & Algorithms", short:"DSA",   icon:"⚡",  color:"#e8f0fe", iconColor:"#1a73e8", progress:50, total:120, completed:60, score:78, difficulty:"Hard",   tag:"Most Asked" },
  { id:2,  name:"Database Management Systems",  short:"DBMS",  icon:"🗄️", color:"#e6f4ea", iconColor:"#1e8e3e", progress:35, total:90,  completed:32, score:72, difficulty:"Medium", tag:"Core" },
  { id:3,  name:"Operating Systems",            short:"OS",    icon:"⚙️",  color:"#f3e8fd", iconColor:"#9334ea", progress:20, total:80,  completed:16, score:65, difficulty:"Hard",   tag:"Core" },
  { id:4,  name:"Computer Networks",            short:"CN",    icon:"🌐",  color:"#fce8e6", iconColor:"#d93025", progress:10, total:70,  completed:7,  score:55, difficulty:"Medium", tag:"Core" },
  { id:5,  name:"Software Engineering",         short:"SE",    icon:"🛠️", color:"#e8f4fd", iconColor:"#0277bd", progress:15, total:60,  completed:9,  score:60, difficulty:"Easy",   tag:"Core" },
  { id:6,  name:"System Design",                short:"SD",    icon:"🏗️", color:"#fff3e0", iconColor:"#e37400", progress:5,  total:60,  completed:3,  score:40, difficulty:"Hard",   tag:"Advanced" },
  { id:7,  name:"Object-Oriented Programming",  short:"OOPS",  icon:"🧩",  color:"#fbeaff", iconColor:"#7b1fa2", progress:60, total:55,  completed:33, score:82, difficulty:"Medium", tag:"Core" },
];

const specialSubjects = [
  { id:8,  name:"Web Development",              short:"WebDev",icon:"💻",  color:"#e3f2fd", iconColor:"#1565c0", progress:45, total:80,  completed:36, score:75, difficulty:"Easy",   tag:"Trending" },
  { id:9,  name:"Full Stack Development (MERN)",short:"MERN",  icon:"🚀",  color:"#e8f5e9", iconColor:"#2e7d32", progress:30, total:100, completed:30, score:68, difficulty:"Hard",   tag:"Trending" },
  { id:10, name:"Python Programming",           short:"Python",icon:"🐍",  color:"#fffde7", iconColor:"#f57f17", progress:55, total:70,  completed:39, score:80, difficulty:"Easy",   tag:"Popular" },
  { id:11, name:"Data Science",                 short:"DS",    icon:"📊",  color:"#fce4ec", iconColor:"#c2185b", progress:25, total:76,  completed:19, score:62, difficulty:"Hard",   tag:"Trending" },
  { id:12, name:"Compiler Design",              short:"CD",    icon:"🔧",  color:"#f1f8e9", iconColor:"#558b2f", progress:8,  total:52,  completed:4,  score:45, difficulty:"Hard",   tag:"Advanced" },
  { id:13, name:"Theory of Computation",        short:"TOC",   icon:"🧮",  color:"#ede7f6", iconColor:"#4527a0", progress:12, total:44,  completed:5,  score:50, difficulty:"Hard",   tag:"Advanced" },
];

const allSubjects = [...coreSubjects, ...specialSubjects];

const interviews = [
  { id:1, type:"HR Round",        mode:"Fresher HR Round", date:"4/26/2026", score:60, grade:"Average", questions:6, time:"0m 36s", avgLen:1,   status:"Completed" },
  { id:2, type:"HR Round",        mode:"Internship HR",    date:"4/25/2026", score:82, grade:"Good",    questions:6, time:"4m 12s", avgLen:120, status:"Completed" },
  { id:3, type:"Technical Round", mode:"DSA + DBMS",       date:"4/24/2026", score:74, grade:"Good",    questions:5, time:"8m 45s", avgLen:200, status:"Completed" },
];

const aptitudeHistory = [
  { date:"Apr 26", score:70, topic:"SpeedDistance + Percentage" },
  { date:"Apr 25", score:85, topic:"NumberSeries + ProfitLoss"  },
  { date:"Apr 24", score:60, topic:"RatioProportion"            },
];

const achievements = [
  { emoji:"🏆", title:"First Interview",  desc:"Completed your first interview round",   earned:true  },
  { emoji:"🎯", title:"Sharp Shooter",    desc:"Scored 80+ in any interview",            earned:true  },
  { emoji:"🔥", title:"3-Day Streak",     desc:"Practiced 3 days in a row",              earned:true  },
  { emoji:"📚", title:"Subject Master",   desc:"Complete any subject 100%",              earned:false },
  { emoji:"⚡", title:"Speed Demon",      desc:"Finish aptitude test in under 5 min",    earned:false },
  { emoji:"💎", title:"Diamond Coder",    desc:"Score 90+ in Technical Round",           earned:false },
];

const weekActivity = [
  {day:"Mon",value:40},{day:"Tue",value:70},{day:"Wed",value:55},
  {day:"Thu",value:90},{day:"Fri",value:30},{day:"Sat",value:85},{day:"Sun",value:60},
];

const TABS = ["Overview","Subjects","Interview History","Aptitude","Achievements"];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function scoreColor(s) { return s >= 80 ? "#1e8e3e" : s >= 60 ? "#e37400" : "#d93025"; }

function gradeMap(g) {
  return ({ Excellent:{text:"#1e8e3e",bg:"#e6f4ea"}, Good:{text:"#1a73e8",bg:"#e8f0fe"},
            Average:{text:"#e37400",bg:"#fff3e0"}, Poor:{text:"#d93025",bg:"#fce8e6"} })[g]
    || {text:"#444",bg:"#f1f3f4"};
}

// ─── REUSABLE COMPONENTS ─────────────────────────────────────────────────────

function ScoreCircle({ score, size=80, stroke=7 }) {
  const r=((size-stroke*2)/2), circ=2*Math.PI*r, dash=(score/100)*circ, col=scoreColor(score), cx=size/2;
  return (
    <svg width={size} height={size} style={{flexShrink:0}}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="#e8eaed" strokeWidth={stroke}/>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke={col} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cx})`} style={{transition:"stroke-dasharray .6s ease"}}/>
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
        style={{fontSize:size>70?18:13,fontWeight:700,fill:col,fontFamily:"inherit"}}>{score}</text>
    </svg>
  );
}

function MiniRing({ progress, size=44, stroke=4, color }) {
  const r=((size-stroke*2)/2), circ=2*Math.PI*r, dash=(progress/100)*circ, cx=size/2;
  return (
    <svg width={size} height={size} style={{flexShrink:0}}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="#e8eaed" strokeWidth={stroke}/>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cx})`} style={{transition:"stroke-dasharray .7s ease"}}/>
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
        style={{fontSize:10,fontWeight:700,fill:color,fontFamily:"inherit"}}>{progress}%</text>
    </svg>
  );
}

function Bar({ value, color="#1a73e8", height=8 }) {
  return (
    <div style={{background:"#e8eaed",borderRadius:99,height,overflow:"hidden"}}>
      <div style={{width:`${value}%`,height:"100%",background:color,borderRadius:99,transition:"width .6s ease"}}/>
    </div>
  );
}

function Badge({ label, textColor, bgColor }) {
  return (
    <span style={{background:bgColor,color:textColor,fontSize:11,fontWeight:700,
      padding:"3px 10px",borderRadius:99,border:`1px solid ${textColor}25`}}>{label}</span>
  );
}

function GradeBadge({ grade }) {
  const {text,bg}=gradeMap(grade);
  return <Badge label={grade} textColor={text} bgColor={bg}/>;
}

function SummaryCard({ emoji, value, label, sub, color, bg }) {
  return (
    <div style={{background:"#fff",borderRadius:14,padding:"18px 18px 16px",border:"1px solid #e8eaed"}}>
      <div style={{width:38,height:38,background:bg,borderRadius:10,display:"flex",
        alignItems:"center",justifyContent:"center",fontSize:18,marginBottom:10}}>{emoji}</div>
      <div style={{fontSize:26,fontWeight:800,color}}>{value}</div>
      <div style={{fontSize:13,fontWeight:600,color:"#1a1a2e",marginTop:2}}>{label}</div>
      <div style={{fontSize:12,color:"#9aa0a6",marginTop:2}}>{sub}</div>
    </div>
  );
}

// ─── SUBJECT MINI CARD (for Subjects tab) ────────────────────────────────────

function SubjectMiniCard({ s }) {
  const [hov, setHov] = useState(false);
  const diffColors = { Hard:["#d93025","#fce8e6"], Medium:["#e37400","#fff3e0"], Easy:["#1e8e3e","#e6f4ea"] };
  const [dc, db] = diffColors[s.difficulty] || ["#444","#f1f3f4"];
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:"#fff",borderRadius:16,padding:"18px 18px 14px",
        border:hov?`2px solid ${s.iconColor}`:"1.5px solid #e8eaed",
        transition:"all .2s",transform:hov?"translateY(-3px)":"none",
        boxShadow:hov?`0 6px 22px ${s.iconColor}20`:"none",cursor:"pointer",
        display:"flex",flexDirection:"column",gap:12}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:44,height:44,background:s.color,borderRadius:12,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{s.icon}</div>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",lineHeight:1.3}}>{s.name}</div>
            <div style={{fontSize:11,color:"#9aa0a6",marginTop:1}}>{s.short}</div>
          </div>
        </div>
        <MiniRing progress={s.progress} color={s.iconColor}/>
      </div>
      {/* Badges */}
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        <Badge label={`✦ ${s.tag}`} textColor={s.iconColor} bgColor={s.color}/>
        <Badge label={s.difficulty} textColor={dc} bgColor={db}/>
      </div>
      {/* Progress */}
      <div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
          <span style={{fontSize:12,color:"#5f6368"}}>{s.completed}/{s.total} topics</span>
          <span style={{fontSize:12,fontWeight:700,color:s.iconColor}}>{s.progress}%</span>
        </div>
        <Bar value={s.progress} color={s.iconColor} height={6}/>
      </div>
      {/* Footer */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
        paddingTop:8,borderTop:"1px solid #f1f3f4"}}>
        <span style={{fontSize:12,color:"#5f6368"}}>
          Avg Score: <b style={{color:scoreColor(s.score)}}>{s.score}</b>
        </span>
        <button style={{background:s.color,color:s.iconColor,border:"none",borderRadius:8,
          padding:"7px 14px",fontWeight:700,fontSize:12,cursor:"pointer"}}>
          {s.progress>0?"Continue →":"Start →"}
        </button>
      </div>
    </div>
  );
}

// ─── TAB: OVERVIEW ───────────────────────────────────────────────────────────

function OverviewTab({ totalQ, doneQ }) {
  const topSubjects = [...allSubjects].sort((a,b)=>b.progress-a.progress).slice(0,5);
  const needsWork   = [...allSubjects].sort((a,b)=>a.progress-b.progress).slice(0,4);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>

      {/* Top 2 cols */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>

        {/* Latest Interview */}
        <div style={{background:"#fff",borderRadius:16,padding:24,border:"1px solid #e8eaed"}}>
          <h3 style={{margin:"0 0 16px",fontSize:15,fontWeight:700,color:"#1a1a2e"}}>🎯 Latest Interview</h3>
          <div style={{display:"flex",alignItems:"center",gap:20}}>
            <ScoreCircle score={interviews[0].score} size={76}/>
            <div>
              <div style={{fontWeight:700,fontSize:15,color:"#1a1a2e"}}>{interviews[0].type}</div>
              <div style={{fontSize:13,color:"#5f6368",marginTop:2}}>{interviews[0].mode}</div>
              <div style={{marginTop:10,display:"flex",gap:8,flexWrap:"wrap"}}>
                <GradeBadge grade={interviews[0].grade}/>
                <Badge label="✓ Done" textColor="#1e8e3e" bgColor="#e6f4ea"/>
              </div>
              <div style={{fontSize:11,color:"#9aa0a6",marginTop:8}}>
                {interviews[0].date} · {interviews[0].questions} Qs · {interviews[0].time}
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Activity */}
        <div style={{background:"#fff",borderRadius:16,padding:24,border:"1px solid #e8eaed"}}>
          <h3 style={{margin:"0 0 16px",fontSize:15,fontWeight:700,color:"#1a1a2e"}}>📅 Weekly Activity</h3>
          <div style={{display:"flex",gap:8,alignItems:"flex-end",height:100}}>
            {weekActivity.map(({day,value})=>(
              <div key={day} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                <div style={{width:"100%",height:value,borderRadius:"4px 4px 0 0",
                  background:value>=80?"#1a73e8":value>=60?"#6ea8fe":"#c5d8ff",
                  transition:"height .5s ease"}}/>
                <div style={{fontSize:10,color:"#9aa0a6"}}>{day}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Subjects by Progress */}
      <div style={{background:"#fff",borderRadius:16,padding:"22px 26px",border:"1px solid #e8eaed"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <h3 style={{margin:0,fontSize:15,fontWeight:700,color:"#1a1a2e"}}>🏆 Top Subjects by Progress</h3>
          <span style={{fontSize:12,color:"#9aa0a6"}}>Showing top 5</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {topSubjects.map((s,i)=>(
            <div key={s.id} style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
              <div style={{width:22,height:22,background:i===0?"#fff3e0":i===1?"#f1f3f4":"#f8f9fa",
                borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:11,fontWeight:800,color:i===0?"#e37400":i===1?"#5f6368":"#9aa0a6",flexShrink:0}}>
                {i+1}
              </div>
              <div style={{width:38,height:38,background:s.color,borderRadius:10,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{s.icon}</div>
              <div style={{minWidth:180,fontSize:13,color:"#3c4043",fontWeight:600}}>{s.name}</div>
              <div style={{flex:1,minWidth:100}}><Bar value={s.progress} color={s.iconColor} height={7}/></div>
              <div style={{width:36,textAlign:"right",fontSize:13,fontWeight:800,color:s.iconColor}}>{s.progress}%</div>
              <div style={{fontSize:11,color:"#9aa0a6",width:70,textAlign:"right"}}>Score: {s.score}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Needs Attention */}
      <div style={{background:"#fff",borderRadius:16,padding:"22px 26px",border:"1px solid #e8eaed"}}>
        <h3 style={{margin:"0 0 16px",fontSize:15,fontWeight:700,color:"#1a1a2e"}}>⚠️ Needs Attention</h3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
          {needsWork.map(s=>(
            <div key={s.id} style={{background:"#fafafa",borderRadius:12,padding:"14px 16px",
              border:"1px solid #f1f3f4",display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:36,height:36,background:s.color,borderRadius:10,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{s.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:700,color:"#1a1a2e",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.name}</div>
                <div style={{marginTop:5}}><Bar value={s.progress} color={s.iconColor} height={5}/></div>
                <div style={{fontSize:11,color:s.iconColor,fontWeight:700,marginTop:3}}>{s.progress}% done</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overall banner */}
      <div style={{background:"linear-gradient(135deg,#1a73e8 0%,#1558b0 100%)",borderRadius:16,
        padding:"28px 36px",color:"#fff",display:"flex",alignItems:"center",
        justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
        <div>
          <div style={{fontSize:20,fontWeight:800}}>Overall Interview Readiness</div>
          <div style={{fontSize:14,opacity:.85,marginTop:4}}>{doneQ} of {totalQ} questions · {allSubjects.length} subjects tracked</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:52,fontWeight:900,lineHeight:1}}>{Math.round((doneQ/totalQ)*100)}%</div>
          <div style={{fontSize:12,opacity:.8,marginTop:4}}>Interview Ready</div>
        </div>
      </div>

    </div>
  );
}

// ─── TAB: SUBJECTS ────────────────────────────────────────────────────────────

function SubjectsTab() {
  const [search, setSearch] = useState("");
  const [diff, setDiff] = useState("All");
  const [sortBy, setSortBy] = useState("Default");

  function filterList(list) {
    let out = list;
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(s => s.name.toLowerCase().includes(q) || s.short.toLowerCase().includes(q));
    }
    if (diff !== "All") out = out.filter(s => s.difficulty === diff);
    if (sortBy === "Progress ↓") out = [...out].sort((a,b)=>b.progress-a.progress);
    else if (sortBy === "Progress ↑") out = [...out].sort((a,b)=>a.progress-b.progress);
    else if (sortBy === "Score ↓") out = [...out].sort((a,b)=>b.score-a.score);
    else if (sortBy === "Name A-Z") out = [...out].sort((a,b)=>a.name.localeCompare(b.name));
    return out;
  }

  const filteredCore = filterList(coreSubjects);
  const filteredSpec = filterList(specialSubjects);
  const totalFiltered = filteredCore.length + filteredSpec.length;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>

      {/* Search & Filter Bar */}
      <div style={{background:"#fff",borderRadius:14,padding:"16px 18px",border:"1px solid #e8eaed",
        display:"flex",flexWrap:"wrap",gap:10,alignItems:"center"}}>
        <div style={{flex:1,minWidth:180,position:"relative"}}>
          <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#9aa0a6",fontSize:15}}>🔍</span>
          <input type="text" placeholder="Search subjects..." value={search}
            onChange={e=>setSearch(e.target.value)}
            style={{width:"100%",padding:"9px 12px 9px 36px",border:"1.5px solid #e8eaed",
              borderRadius:9,fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
        </div>
        import React, { useState } from "react";
        // ...existing code from the latest version...
        // (Paste the complete, latest, and correct implementation here, as per your requirements)
        // ...existing code...
  );
}

// ─── TAB: APTITUDE ────────────────────────────────────────────────────────────

function AptitudeTab() {
  const avg = Math.round(aptitudeHistory.reduce((a,b)=>a+b.score,0)/aptitudeHistory.length);
  const best = Math.max(...aptitudeHistory.map(a=>a.score));
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14}}>
        {aptitudeHistory.map((a,i)=>{
          const g = a.score>=80?"Excellent":a.score>=60?"Good":"Average";
          return (
            <div key={i} style={{background:"#fff",borderRadius:14,padding:20,
              border:"1px solid #e8eaed",display:"flex",gap:16,alignItems:"center"}}>
              <ScoreCircle score={a.score} size={62} stroke={5}/>
              <div>
                <div style={{fontWeight:600,fontSize:13,color:"#1a1a2e"}}>{a.topic}</div>
                <div style={{fontSize:11,color:"#9aa0a6",marginTop:3}}>📅 {a.date}</div>
                <div style={{marginTop:8}}><GradeBadge grade={g}/></div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{background:"#fff",borderRadius:14,padding:22,border:"1px solid #e8eaed"}}>
        <h3 style={{margin:"0 0 16px",fontSize:15,fontWeight:700,color:"#1a1a2e"}}>📈 Score Trend</h3>
        <div style={{display:"flex",gap:14,alignItems:"flex-end",height:120,paddingBottom:4}}>
          {aptitudeHistory.map((a,i)=>{
            const col=scoreColor(a.score), h=(a.score/100)*100;
            return (
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                <div style={{fontSize:12,fontWeight:700,color:col}}>{a.score}</div>
                <div style={{width:"55%",height:h,background:col,borderRadius:"5px 5px 0 0",transition:"height .6s ease"}}/>
                <div style={{fontSize:11,color:"#9aa0a6"}}>{a.date}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
        {[["Tests Taken",aptitudeHistory.length,"#1a73e8"],["Best Score",best,"#1e8e3e"],["Avg Score",avg,"#e37400"]].map(([l,v,c])=>(
          <div key={l} style={{background:"#fff",borderRadius:12,padding:"16px 18px",
            border:"1px solid #e8eaed",textAlign:"center"}}>
            <div style={{fontSize:28,fontWeight:800,color:c}}>{v}</div>
            <div style={{fontSize:12,color:"#5f6368",marginTop:4}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",justifyContent:"center"}}>
        <button style={{background:"#9334ea",color:"#fff",border:"none",borderRadius:11,
          padding:"13px 34px",fontWeight:700,cursor:"pointer",fontSize:14}}
          onMouseEnter={e=>e.currentTarget.style.background="#7b2fc7"}
          onMouseLeave={e=>e.currentTarget.style.background="#9334ea"}>
          Take New Aptitude Test →
        </button>
      </div>
    </div>
  );
}

// ─── TAB: ACHIEVEMENTS ────────────────────────────────────────────────────────

function AchievementsTab() {
  const earned = achievements.filter(a=>a.earned);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div style={{background:"#fff",borderRadius:14,padding:18,border:"1px solid #e8eaed",
        display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontWeight:700,fontSize:15,color:"#1a1a2e"}}>🏅 {earned.length}/{achievements.length} Achievements Unlocked</div>
          <div style={{fontSize:12,color:"#5f6368",marginTop:3}}>Keep practicing to unlock more badges!</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          {earned.map((a,i)=>(
            <div key={i} style={{width:34,height:34,background:"#fff3e0",borderRadius:8,
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{a.emoji}</div>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:16}}>
        {achievements.map((ach,i)=>(
          <div key={i} style={{background:"#fff",borderRadius:14,padding:22,
            border:ach.earned?"2px solid #1a73e8":"1px solid #e8eaed",
            opacity:ach.earned?1:0.55,position:"relative",transition:"transform .2s"}}
            onMouseEnter={e=>{if(ach.earned){e.currentTarget.style.transform="translateY(-2px)";}}}
            onMouseLeave={e=>{e.currentTarget.style.transform="none";}}>
            <div style={{position:"absolute",top:10,right:10}}>
              {ach.earned
                ? <Badge label="✓ Earned" textColor="#1a73e8" bgColor="#e8f0fe"/>
                : <Badge label="🔒 Locked" textColor="#9aa0a6" bgColor="#f1f3f4"/>}
            </div>
            <div style={{fontSize:36,marginBottom:12}}>{ach.emoji}</div>
            <div style={{fontWeight:700,fontSize:14,color:"#1a1a2e",marginBottom:5}}>{ach.title}</div>
            <div style={{fontSize:12,color:"#5f6368",lineHeight:1.5}}>{ach.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState("Overview");

  const totalQ   = allSubjects.reduce((a,b)=>a+b.total,0);
  const doneQ    = allSubjects.reduce((a,b)=>a+b.completed,0);
  const avgScore = Math.round(interviews.reduce((a,b)=>a+b.score,0)/interviews.length);
  const overallPct = Math.round((doneQ/totalQ)*100);
  const started  = allSubjects.filter(s=>s.progress>0).length;

  return (
<<<<<<< Updated upstream
    <div style={{fontFamily:"'Sora',sans-serif",background:"#f0f4ff",minHeight:"100vh"}}>

      {/* NAVBAR */}
      <nav style={{background:"#fff",borderBottom:"1px solid #e8eaed",height:62,
        padding:"0 32px",display:"flex",alignItems:"center",justifyContent:"space-between",
        position:"sticky",top:0,zIndex:200}}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate && navigate("/")}>
          <img src="/logo.png" alt="Logo" style={{ width: 40, height: 40, objectFit: "contain", borderRadius: "50%", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }} />
          <div style={{fontWeight:800,fontSize:20,color:"#1a1a2e",letterSpacing:-0.5}}>InterviewAce</div>
        </div>
        <div style={{display:"flex",gap:28,fontSize:15}}>
          {["Home","Dashboard","Subjects","Progress","Interview Rounds","Test"].map(n=>(
            <span key={n} 
              onClick={() => navigate(n === "Home" ? "/" : `/${n.toLowerCase().replace(' ', '-')}`)}
              style={{cursor:"pointer",fontWeight:n==="Progress"?700:400,
              color:n==="Progress"?"#1a73e8":"#5f6368",
              borderBottom:n==="Progress"?"2px solid #1a73e8":"2px solid transparent",paddingBottom:4}}>
              {n}
            </span>
          ))}
        </div>
        <button 
          onClick={handleLogout}
          style={{background:"#1a73e8",color:"#fff",border:"none",borderRadius:9,
          padding:"9px 22px",fontWeight:700,cursor:"pointer",fontSize:14}}
          onMouseEnter={e=>e.currentTarget.style.background="#1558b0"}
          onMouseLeave={e=>e.currentTarget.style.background="#1a73e8"}>Logout</button>
      </nav>
=======
    <div style={{fontFamily:"'Sora',sans-serif",background:"var(--bg-page)",minHeight:"100vh",color:"var(--text-main)"}}>
>>>>>>> Stashed changes

      <div style={{maxWidth:1150,margin:"0 auto",padding:"36px 20px 72px"}}>

        {/* Page Header */}
        <div style={{marginBottom:28}}>
          <h1 style={{fontSize:30,fontWeight:800,color:"#1a1a2e",margin:0,letterSpacing:-0.5}}>📊 My Progress</h1>
          <p style={{color:"#5f6368",margin:"6px 0 0",fontSize:15}}>
            Track your readiness across {allSubjects.length} subjects, interview rounds & aptitude tests
          </p>
        </div>

        {/* Summary Cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14,marginBottom:28}}>
          <SummaryCard emoji="📈" value={`${overallPct}%`} label="Overall Progress"
            sub={`${doneQ}/${totalQ} questions`} color="#1a73e8" bg="#e8f0fe"/>
          <SummaryCard emoji="📚" value={allSubjects.length} label="Total Subjects"
            sub={`${started} in progress`} color="#9334ea" bg="#f3e8fd"/>
          <SummaryCard emoji="🎙️" value={interviews.length} label="Interviews Done"
            sub="completed rounds" color="#1e8e3e" bg="#e6f4ea"/>
          <SummaryCard emoji="⭐" value={avgScore} label="Avg Interview Score"
            sub="out of 100" color="#e37400" bg="#fff3e0"/>
          <SummaryCard emoji="🧠" value={aptitudeHistory.length} label="Aptitude Tests"
            sub="tests taken" color="#d93025" bg="#fce8e6"/>
        </div>

        {/* Tab Bar */}
        <div style={{display:"flex",gap:4,background:"#fff",borderRadius:13,padding:4,
          border:"1px solid #e8eaed",marginBottom:24,overflowX:"auto"}}>
          {TABS.map(t=>(
            <button key={t} onClick={()=>setActiveTab(t)}
              style={{flex:1,minWidth:110,padding:"11px 14px",borderRadius:10,border:"none",
                cursor:"pointer",fontWeight:activeTab===t?700:500,fontSize:14,whiteSpace:"nowrap",
                background:activeTab===t?"#1a73e8":"transparent",
                color:activeTab===t?"#fff":"#5f6368",transition:"all .2s"}}>
              {t}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab==="Overview"          && <OverviewTab totalQ={totalQ} doneQ={doneQ}/>}
        {activeTab==="Subjects"          && <SubjectsTab/>}
        {activeTab==="Interview History" && <InterviewHistoryTab/>}
        {activeTab==="Aptitude"          && <AptitudeTab/>}
        {activeTab==="Achievements"      && <AchievementsTab/>}

      </div>
    </div>
  );
}
