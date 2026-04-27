import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ─── DATA ────────────────────────────────────────────────────────────────────

const coreSubjects = [
  { id:1, name:"Data Structures & Algorithms", short:"DSA",   icon:"⚡",  color:"#e8f0fe", iconColor:"#1a73e8", borderColor:"#1a73e8", progress:50, totalTopics:48, doneTopics:24, difficulty:"Hard",   diffColor:"#d93025", diffBg:"#fce8e6", questionsCount:320, tag:"Most Asked", tagColor:"#1a73e8", tagBg:"#e8f0fe", topics:["Arrays","Linked Lists","Trees","Graphs","Dynamic Programming","Sorting"] },
  { id:2, name:"Database Management Systems", short:"DBMS",  icon:"🗄️", color:"#e6f4ea", iconColor:"#1e8e3e", borderColor:"#1e8e3e", progress:35, totalTopics:32, doneTopics:11, difficulty:"Medium", diffColor:"#e37400", diffBg:"#fff3e0", questionsCount:180, tag:"Core",      tagColor:"#1e8e3e", tagBg:"#e6f4ea", topics:["SQL","Normalization","Transactions","Indexing","ER Diagrams","NoSQL"] },
  { id:3, name:"Operating Systems",           short:"OS",    icon:"⚙️",  color:"#f3e8fd", iconColor:"#9334ea", borderColor:"#9334ea", progress:20, totalTopics:36, doneTopics:7,  difficulty:"Hard",   diffColor:"#d93025", diffBg:"#fce8e6", questionsCount:210, tag:"Core",      tagColor:"#9334ea", tagBg:"#f3e8fd", topics:["Processes","Threads","Memory Management","Scheduling","Deadlocks","File Systems"] },
  { id:4, name:"Computer Networks",           short:"CN",    icon:"🌐",  color:"#fce8e6", iconColor:"#d93025", borderColor:"#d93025", progress:10, totalTopics:28, doneTopics:3,  difficulty:"Medium", diffColor:"#e37400", diffBg:"#fff3e0", questionsCount:160, tag:"Core",      tagColor:"#d93025", tagBg:"#fce8e6", topics:["OSI Model","TCP/IP","HTTP/HTTPS","DNS","Routing","Security"] },
  { id:5, name:"Software Engineering",        short:"SE",    icon:"🛠️", color:"#e8f4fd", iconColor:"#0277bd", borderColor:"#0277bd", progress:15, totalTopics:24, doneTopics:4,  difficulty:"Easy",   diffColor:"#1e8e3e", diffBg:"#e6f4ea", questionsCount:120, tag:"Core",      tagColor:"#0277bd", tagBg:"#e8f4fd", topics:["SDLC","Agile","Testing","Design Patterns","UML","DevOps"] },
  { id:6, name:"System Design",               short:"SD",    icon:"🏗️", color:"#fff3e0", iconColor:"#e37400", borderColor:"#e37400", progress:5,  totalTopics:20, doneTopics:1,  difficulty:"Hard",   diffColor:"#d93025", diffBg:"#fce8e6", questionsCount:90,  tag:"Advanced",  tagColor:"#e37400", tagBg:"#fff3e0", topics:["Scalability","Load Balancing","Caching","Microservices","Databases","APIs"] },
  { id:7, name:"Object-Oriented Programming", short:"OOPS",  icon:"🧩",  color:"#fbeaff", iconColor:"#7b1fa2", borderColor:"#7b1fa2", progress:60, totalTopics:22, doneTopics:13, difficulty:"Medium", diffColor:"#e37400", diffBg:"#fff3e0", questionsCount:150, tag:"Core",      tagColor:"#7b1fa2", tagBg:"#fbeaff", topics:["Inheritance","Polymorphism","Encapsulation","Abstraction","Interfaces","Design Patterns"] },
];

const specialSubjects = [
  { id:8,  name:"Web Development",              short:"WebDev", icon:"💻",  color:"#e3f2fd", iconColor:"#1565c0", borderColor:"#1565c0", progress:45, totalTopics:40, doneTopics:18, difficulty:"Easy",   diffColor:"#1e8e3e", diffBg:"#e6f4ea", questionsCount:200, tag:"Trending",  tagColor:"#1565c0", tagBg:"#e3f2fd", topics:["HTML/CSS","JavaScript","React","REST APIs","Authentication","Deployment"] },
  { id:9,  name:"Full Stack Development (MERN)",short:"MERN",   icon:"🚀",  color:"#e8f5e9", iconColor:"#2e7d32", borderColor:"#2e7d32", progress:30, totalTopics:50, doneTopics:15, difficulty:"Hard",   diffColor:"#d93025", diffBg:"#fce8e6", questionsCount:250, tag:"Trending",  tagColor:"#2e7d32", tagBg:"#e8f5e9", topics:["MongoDB","Express.js","React","Node.js","JWT Auth","Deployment"] },
  { id:10, name:"Python Programming",           short:"Python", icon:"🐍",  color:"#fffde7", iconColor:"#f57f17", borderColor:"#f57f17", progress:55, totalTopics:35, doneTopics:19, difficulty:"Easy",   diffColor:"#1e8e3e", diffBg:"#e6f4ea", questionsCount:190, tag:"Popular",   tagColor:"#f57f17", tagBg:"#fffde7", topics:["Basics","OOP","Libraries","File I/O","Decorators","Generators"] },
  { id:11, name:"Data Science",                 short:"DS",     icon:"📊",  color:"#fce4ec", iconColor:"#c2185b", borderColor:"#c2185b", progress:25, totalTopics:38, doneTopics:10, difficulty:"Hard",   diffColor:"#d93025", diffBg:"#fce8e6", questionsCount:175, tag:"Trending",  tagColor:"#c2185b", tagBg:"#fce4ec", topics:["NumPy","Pandas","ML Basics","Visualization","Statistics","Sklearn"] },
  { id:12, name:"Compiler Design",              short:"CD",     icon:"🔧",  color:"#f1f8e9", iconColor:"#558b2f", borderColor:"#558b2f", progress:8,  totalTopics:26, doneTopics:2,  difficulty:"Hard",   diffColor:"#d93025", diffBg:"#fce8e6", questionsCount:110, tag:"Advanced",  tagColor:"#558b2f", tagBg:"#f1f8e9", topics:["Lexical Analysis","Parsing","Syntax Trees","Code Generation","Optimization","Grammars"] },
  { id:13, name:"Theory of Computation",        short:"TOC",    icon:"🧮",  color:"#ede7f6", iconColor:"#4527a0", borderColor:"#4527a0", progress:12, totalTopics:22, doneTopics:3,  difficulty:"Hard",   diffColor:"#d93025", diffBg:"#fce8e6", questionsCount:95,  tag:"Advanced",  tagColor:"#4527a0", tagBg:"#ede7f6", topics:["Automata","DFA/NFA","Context-Free Grammars","Turing Machines","Decidability","Complexity"] },
];

const allSubjects = [...coreSubjects, ...specialSubjects];
const FILTERS = ["All","Easy","Medium","Hard"];
const SORT_OPTIONS = ["Default","Progress: High","Progress: Low","Name A-Z"];

// ─── REUSABLE COMPONENTS ─────────────────────────────────────────────────────

function ProgressRing({ progress, size=54, stroke=5, color }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (progress / 100) * circ;
  const cx = size / 2;
  return (
    <div style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="#e8eaed" strokeWidth={stroke} />
        <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.7s ease" }} />
      </svg>
      <span style={{ position: "absolute", fontSize: 11, fontWeight: 800, color, fontFamily: "inherit" }}>{progress}%</span>
    </div>
  );
}

function BarStrip({ value, color }) {
  return (
    <div style={{ background: "#e8eaed", borderRadius: 99, height: 6, overflow: "hidden", width: "100%" }}>
      <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.6s ease" }} />
    </div>
  );
}

function DiffBadge({ difficulty, color, bg }) {
  return (
    <span style={{ background: bg, color, fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 99, border: `1px solid ${color}40`, whiteSpace: "nowrap" }}>
      {difficulty}
    </span>
  );
}

function TagBadge({ tag, color, bg }) {
  return (
    <span style={{ background: bg, color, fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 99, border: `1px solid ${color}40`, whiteSpace: "nowrap" }}>
      ✦ {tag}
    </span>
  );
}

function SubjectCard({ subject, onSelect, view }) {
  const [hovered, setHovered] = useState(false);

  const cardStyle = {
    background: "#fff",
    borderRadius: 18,
    padding: view === "grid" ? 22 : "16px 24px",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    flexDirection: view === "grid" ? "column" : "row",
    gap: view === "grid" ? 14 : 24,
    alignItems: view === "grid" ? "stretch" : "center",
    position: "relative",
    border: hovered ? `2.5px solid ${subject.borderColor}` : "1.5px solid #e8eaed",
    transform: hovered ? "translateY(-4px)" : "none",
    boxShadow: hovered ? `0 8px 28px ${subject.borderColor}22` : "none",
  };

  const gridLayout = (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: 14 }}>
          <div style={{ width: 50, height: 50, background: subject.color, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
            {subject.icon}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1a2e", lineHeight: 1.3, marginBottom: 2 }}>{subject.name}</div>
            <div style={{ fontSize: 12, color: "#9aa0a6", fontWeight: 600 }}>{subject.short}</div>
          </div>
        </div>
        <ProgressRing progress={subject.progress} color={subject.iconColor} />
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <TagBadge tag={subject.tag} color={subject.tagColor} bg={subject.tagBg} />
        <DiffBadge difficulty={subject.difficulty} color={subject.diffColor} bg={subject.diffBg} />
      </div>

      <div style={{ marginTop: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12, color: "#5f6368", fontWeight: 600 }}>
          <span>{subject.doneTopics}/{subject.totalTopics} topics done</span>
          <span style={{ color: subject.iconColor }}>{subject.progress}%</span>
        </div>
        <BarStrip value={subject.progress} color={subject.iconColor} />
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
        {subject.topics.slice(0, 4).map((t, idx) => (
          <span key={idx} style={{ background: subject.color, color: subject.iconColor, fontSize: 11, fontWeight: 700, padding: "5px 10px", borderRadius: 8 }}>
            {t}
          </span>
        ))}
        {subject.topics.length > 4 && (
          <span style={{ background: "#f1f3f4", color: "#5f6368", fontSize: 11, fontWeight: 700, padding: "5px 10px", borderRadius: 8 }}>
            +{subject.topics.length - 4} more
          </span>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: "1px solid #f1f3f4", marginTop: 4 }}>
        <span style={{ fontSize: 13, color: "#5f6368", fontWeight: 600 }}>📝 {subject.questionsCount} questions</span>
        <button style={{ background: subject.color, color: subject.iconColor, border: "none", borderRadius: 10, padding: "9px 18px", fontWeight: 800, fontSize: 13, cursor: "pointer", transition: "0.2s" }}>
          {subject.progress > 0 ? "Continue →" : "Start →"}
        </button>
      </div>
    </>
  );

  const listLayout = (
    <>
      <div style={{ width: 50, height: 50, background: subject.color, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
        {subject.icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1a2e" }}>{subject.name} ({subject.short})</div>
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <TagBadge tag={subject.tag} color={subject.tagColor} bg={subject.tagBg} />
          <DiffBadge difficulty={subject.difficulty} color={subject.diffColor} bg={subject.diffBg} />
          <span style={{ fontSize: 12, color: "#5f6368", fontWeight: 600 }}>📝 {subject.questionsCount} Qs</span>
        </div>
      </div>
      <div style={{ width: 180 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12, fontWeight: 700 }}>
          <span style={{ color: "#5f6368" }}>{subject.progress}%</span>
          <span style={{ color: subject.iconColor }}>{subject.doneTopics}/{subject.totalTopics} topics</span>
        </div>
        <BarStrip value={subject.progress} color={subject.iconColor} />
      </div>
      <div style={{ marginLeft: 20 }}>
        <ProgressRing progress={subject.progress} color={subject.iconColor} size={48} />
      </div>
      <button style={{ background: subject.color, color: subject.iconColor, border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 800, fontSize: 13, cursor: "pointer", marginLeft: 20 }}>
        {subject.progress > 0 ? "Continue" : "Start"}
      </button>
    </>
  );

  return (
    <div 
      onMouseEnter={() => setHovered(true)} 
      onMouseLeave={() => setHovered(false)} 
      onClick={() => onSelect(subject)}
      style={cardStyle}
    >
      {view === "grid" ? gridLayout : listLayout}
    </div>
  );
}

function SubjectModal({ subject, onClose }) {
  return (
    <div 
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 24, padding: 36, maxWidth: 520, width: "100%", position: "relative", boxShadow: "0 20px 40px rgba(0,0,0,0.2)", animation: "modalSlide 0.3s ease-out" }}
      >
        <button 
          onClick={onClose}
          style={{ position: "absolute", top: 20, right: 20, width: 36, height: 36, borderRadius: "50%", background: "#f1f3f4", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#5f6368", fontWeight: 800 }}
        >✕</button>

        <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 30 }}>
          <div style={{ width: 64, height: 64, background: subject.color, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>{subject.icon}</div>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: "#1a1a2e" }}>{subject.name}</h2>
            <div style={{ color: "#5f6368", fontSize: 14, fontWeight: 600, marginTop: 4 }}>{subject.short} • {subject.questionsCount} Interview Questions</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 30 }}>
          {[
            { label: "Progress", val: `${subject.progress}%`, color: subject.iconColor },
            { label: "Topics", val: `${subject.doneTopics}/${subject.totalTopics}`, color: "#1a1a2e" },
            { label: "Difficulty", val: subject.difficulty, color: subject.diffColor }
          ].map((stat, i) => (
            <div key={i} style={{ background: "#f8f9fa", padding: "16px 8px", borderRadius: 16, textAlign: "center", border: "1px solid #f1f3f4" }}>
              <div style={{ fontSize: 12, color: "#9aa0a6", fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{stat.label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: stat.color }}>{stat.val}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 30 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#1a1a2e", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <span>📚 Curriculum Topics</span>
            <span style={{ fontSize: 11, background: "#f1f3f4", padding: "2px 8px", borderRadius: 6, color: "#5f6368" }}>{subject.topics.length} Total</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {subject.topics.map((t, i) => (
              <span key={i} style={{ background: subject.color, color: subject.iconColor, fontSize: 12, fontWeight: 700, padding: "6px 12px", borderRadius: 10 }}>{t}</span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 30 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, fontWeight: 700 }}>
            <span style={{ color: "#5f6368" }}>Current Completion</span>
            <span style={{ color: subject.iconColor }}>{subject.progress}%</span>
          </div>
          <BarStrip value={subject.progress} color={subject.iconColor} />
        </div>

        <button style={{ width: "100%", background: subject.iconColor, color: "#fff", border: "none", borderRadius: 16, padding: 16, fontSize: 16, fontWeight: 800, cursor: "pointer", boxShadow: `0 8px 20px ${subject.iconColor}40`, transition: "0.2s" }}>
          {subject.progress > 0 ? "Continue Preparation" : "Start Learning Path"}
        </button>
      </div>
      <style>{`
        @keyframes modalSlide {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function SubjectsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Default");
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("grid");

  // Stats
  const started = allSubjects.filter(s => s.progress > 0).length;
  const completed = allSubjects.filter(s => s.progress === 100).length;
  const overallProgress = Math.round(allSubjects.reduce((acc, s) => acc + s.progress, 0) / allSubjects.length);

  const applyFilters = (list) => {
    let out = [...list];
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.short.toLowerCase().includes(q) || 
        s.topics.some(t => t.toLowerCase().includes(q))
      );
    }
    if (filter !== "All") out = out.filter(s => s.difficulty === filter);
    
    if (sort === "Progress: High") out.sort((a, b) => b.progress - a.progress);
    else if (sort === "Progress: Low") out.sort((a, b) => a.progress - b.progress);
    else if (sort === "Name A-Z") out.sort((a, b) => a.name.localeCompare(b.name));
    
    return out;
  };

  const filteredCore = applyFilters(coreSubjects);
  const filteredSpecial = applyFilters(specialSubjects);
  const totalFiltered = filteredCore.length + filteredSpecial.length;

  return (
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// ...existing code from the latest version...
// (Paste the complete, latest, and correct implementation here, as per your requirements)
// ...existing code...
        <div style={{ display: "flex", gap: 32, height: "100%" }}>
          {["Home", "Dashboard", "Subjects", "Progress", "Interview Rounds", "Test"].map(n => (
            <div key={n} 
              onMouseEnter={() => setHoveredNav(n)}
              onMouseLeave={() => setHoveredNav(null)}
              onClick={() => navigate(n === "Home" ? "/" : `/${n.toLowerCase().replace(' ', '-')}`)}
              style={{ display: "flex", alignItems: "center", height: "100%", padding: "0 4px", fontSize: 14, fontWeight: (n === "Subjects") ? 700 : 500, color: (n === "Subjects" || hoveredNav === n) ? "#1a73e8" : "#5f6368", borderBottom: (n === "Subjects") ? "2px solid #1a73e8" : "2px solid transparent", cursor: "pointer", transition: "0.2s" }}
            >
              {n}
            </div>
          ))}
        </div>
        <button onClick={handleLogout} style={{ background: "#1a73e8", color: "#fff", border: "none", borderRadius: 9, padding: "8px 22px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Logout</button>
      </nav>
=======
    <div style={{ background: "var(--bg-page)", minHeight: "100vh", fontFamily: "'Sora', sans-serif", color: "var(--text-main)" }}>
>>>>>>> Stashed changes

      <div style={{ maxWidth: 1150, margin: "0 auto", padding: "36px 20px 80px" }}>
        
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1a1a2e", margin: "0 0 8px 0" }}>📚 Engineering Subjects</h1>
          <p style={{ color: "#5f6368", fontSize: 16, fontWeight: 500 }}>Master interviews across all core and specialization disciplines</p>
        </div>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Total Subjects", val: allSubjects.length, color: "#1a73e8", bg: "#e8f0fe", icon: "📖" },
            { label: "In Progress", val: started, color: "#9334ea", bg: "#f3e8fd", icon: "⏳" },
            { label: "Completed", val: completed, color: "#1e8e3e", bg: "#e6f4ea", icon: "✅" },
            { label: "Avg Progress", val: `${overallProgress}%`, color: "#e37400", bg: "#fff3e0", icon: "📈" }
          ].map((s, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #e8eaed", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 12, color: "#9aa0a6", fontWeight: 700, marginTop: 2 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters Bar */}
        <div style={{ background: "#fff", borderRadius: 18, padding: "16px 20px", border: "1px solid #e8eaed", display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", marginBottom: 32 }}>
          <div style={{ flex: 1, minWidth: 240, position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
            <input 
              type="text" 
              placeholder="Search subjects or topics..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "12px 14px 12px 42px", border: "1.5px solid #e8eaed", borderRadius: 12, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
            />
          </div>

          <div style={{ display: "flex", background: "#f8f9fa", padding: 4, borderRadius: 12, border: "1px solid #e8eaed" }}>
            {FILTERS.map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)}
                style={{ padding: "8px 16px", borderRadius: 9, border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", background: filter === f ? "#1a73e8" : "transparent", color: filter === f ? "#fff" : "#5f6368", transition: "0.2s" }}
              >
                {f}
              </button>
            ))}
          </div>

          <select 
            value={sort} 
            onChange={(e) => setSort(e.target.value)}
            style={{ padding: "11px 14px", borderRadius: 12, border: "1.5px solid #e8eaed", fontSize: 14, fontWeight: 600, background: "#fff", outline: "none", cursor: "pointer", color: "#3c4043" }}
          >
            {SORT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>

          <div style={{ display: "flex", background: "#f1f3f4", padding: 3, borderRadius: 10, gap: 2 }}>
            <button 
              onClick={() => setView("grid")}
              style={{ width: 34, height: 34, borderRadius: 8, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, background: view === "grid" ? "#1a73e8" : "transparent", color: view === "grid" ? "#fff" : "#5f6368" }}
            >⊞</button>
            <button 
              onClick={() => setView("list")}
              style={{ width: 34, height: 34, borderRadius: 8, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, background: view === "list" ? "#1a73e8" : "transparent", color: view === "list" ? "#fff" : "#5f6368" }}
            >☰</button>
          </div>

          <div style={{ fontSize: 13, color: "#9aa0a6", fontWeight: 600, marginLeft: "auto" }}>{totalFiltered} subjects found</div>
        </div>

        {/* Core Subjects Section */}
        {filteredCore.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 5, height: 28, background: "#1a73e8", borderRadius: 99 }}></div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: "#1a1a2e" }}>Core Engineering Subjects</h2>
              <span style={{ background: "#e8f0fe", color: "#1a73e8", fontSize: 12, fontWeight: 800, padding: "2px 10px", borderRadius: 99 }}>{filteredCore.length}</span>
            </div>
            <div style={{ 
              display: view === "grid" ? "grid" : "flex", 
              flexDirection: view === "grid" ? "initial" : "column",
              gridTemplateColumns: view === "grid" ? "repeat(auto-fill, minmax(300px, 1fr))" : "none", 
              gap: 18 
            }}>
              {filteredCore.map(s => <SubjectCard key={s.id} subject={s} onSelect={setSelected} view={view} />)}
            </div>
          </div>
        )}

        {/* Special Subjects Section */}
        {filteredSpecial.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 5, height: 28, background: "#9334ea", borderRadius: 99 }}></div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: "#1a1a2e" }}>Specialization & Programming</h2>
              <span style={{ background: "#f3e8fd", color: "#9334ea", fontSize: 12, fontWeight: 800, padding: "2px 10px", borderRadius: 99 }}>{filteredSpecial.length}</span>
            </div>
            <div style={{ 
              display: view === "grid" ? "grid" : "flex", 
              flexDirection: view === "grid" ? "initial" : "column",
              gridTemplateColumns: view === "grid" ? "repeat(auto-fill, minmax(300px, 1fr))" : "none", 
              gap: 18 
            }}>
              {filteredSpecial.map(s => <SubjectCard key={s.id} subject={s} onSelect={setSelected} view={view} />)}
            </div>
          </div>
        )}

        {/* Empty State */}
        {totalFiltered === 0 && (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🔍</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e", margin: "0 0 8px 0" }}>No subjects found</h2>
            <p style={{ color: "#5f6368", marginBottom: 24 }}>Try adjusting your search or difficulty filters</p>
            <button 
              onClick={() => { setSearch(""); setFilter("All"); setSort("Default"); }}
              style={{ background: "#1a73e8", color: "#fff", border: "none", borderRadius: 12, padding: "12px 28px", fontWeight: 700, cursor: "pointer", fontSize: 14 }}
            >Clear All Filters</button>
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{ 
          background: "linear-gradient(135deg, #1a73e8 0%, #1558b0 100%)", 
          borderRadius: 24, 
          padding: "36px 44px", 
          color: "#fff", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between", 
          flexWrap: "wrap", 
          gap: 24,
          boxShadow: "0 15px 35px rgba(26,115,232,0.25)"
        }}>
          <div style={{ flex: 1, minWidth: 300 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 10px 0" }}>Ready to Ace Your Interview?</h2>
            <p style={{ margin: 0, fontSize: 16, color: "rgba(255,255,255,0.85)", fontWeight: 500, maxWidth: 450 }}>Practice simulated interview rounds based on your subject preparation and get real-time feedback.</p>
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button 
              onClick={() => navigate("/interview-rounds")}
              style={{ background: "#fff", color: "#1a73e8", border: "none", borderRadius: 14, padding: "14px 28px", fontWeight: 800, fontSize: 15, cursor: "pointer", transition: "0.2s" }}
            >Start Interview Round →</button>
            <button 
              onClick={() => navigate("/progress")}
              style={{ background: "transparent", color: "#fff", border: "2px solid rgba(255,255,255,0.4)", borderRadius: 14, padding: "12px 28px", fontWeight: 800, fontSize: 15, cursor: "pointer", transition: "0.2s" }}
            >View Progress</button>
          </div>
        </div>

      </div>

      {/* Modal */}
      {selected && <SubjectModal subject={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
