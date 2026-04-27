import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ─── REUSABLE COMPONENTS ─────────────────────────────────────────────────────

function StatCard({ icon, value, label, color, bg }) {
  return (
    <div style={{ background: "var(--bg-surface)", borderRadius: 16, padding: 20, border: "1px solid var(--border-color)", display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 200 }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 700, marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

function SubjectMiniCard({ title, progress, color, icon, onClick }) {
  return (
    <div style={{ background: "var(--bg-surface)", borderRadius: 16, padding: 20, border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: color + "15", color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{icon}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)" }}>{title}</div>
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
          <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>Progress</span>
          <span style={{ color, fontWeight: 700 }}>{progress}%</span>
        </div>
        <div style={{ height: 6, background: "var(--bg-surface-alt)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: color, borderRadius: 99 }} />
        </div>
      </div>
      <button 
        onClick={onClick}
        style={{ marginTop: 4, background: color + "10", color, border: "none", borderRadius: 8, padding: "8px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
      >Continue Studying</button>
    </div>
  );
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [plannerFilter, setPlannerFilter] = useState("all");

  useEffect(() => {
    try {
      const savedTasks = JSON.parse(localStorage.getItem("plannerTasks"));
      const fallbackTasks = [
        { id: 1, text: "Revise Array questions on LeetCode", completed: false },
        { id: 2, text: "Read about DBMS Normalization", completed: true },
        { id: 3, text: "Take a mock technical interview", completed: false }
      ];

      if (Array.isArray(savedTasks)) {
        setTasks(savedTasks);
      } else {
        setTasks(fallbackTasks);
      }
    } catch {
      setTasks([
        { id: 1, text: "Revise Array questions on LeetCode", completed: false },
        { id: 2, text: "Read about DBMS Normalization", completed: true },
        { id: 3, text: "Take a mock technical interview", completed: false }
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("plannerTasks", JSON.stringify(tasks));
  }, [tasks]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const addTask = () => {
    const trimmedTask = newTask.trim();
    if (!trimmedTask) return;

    const duplicateExists = tasks.some(task => task.text.toLowerCase() === trimmedTask.toLowerCase());
    if (duplicateExists) return;

    setTasks([{ id: Date.now(), text: trimmedTask, completed: false }, ...tasks]);
    setNewTask("");
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const plannerSummary = {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
  };
  plannerSummary.pending = plannerSummary.total - plannerSummary.completed;

  const filteredTasks = tasks.filter(task => {
    if (plannerFilter === "pending") return !task.completed;
    if (plannerFilter === "completed") return task.completed;
    return true;
  });

  return (
<<<<<<< Updated upstream
    <div style={{ background: "#f0f4ff", minHeight: "100vh", fontFamily: "'Sora', sans-serif" }}>
      {/* Navbar (from priyanshu branch) */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #e8eaed", height: 62, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 500 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("/")}>
          <img src="/logo.png" alt="Logo" style={{ width: 40, height: 40, objectFit: "contain", borderRadius: "50%", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }} />
          <div style={{ fontWeight: 800, fontSize: 20, color: "#1a73e8" }}>InterviewAce</div>
        </div>
        <div style={{ display: "flex", gap: 32, height: "100%" }}>
          {["Home", "Dashboard", "Subjects", "Progress", "Interview Rounds", "Test"].map(n => (
            <div key={n} 
              onMouseEnter={() => setHoveredNav(n)}
              onMouseLeave={() => setHoveredNav(null)}
              onClick={() => navigate(n === "Home" ? "/" : `/${n.toLowerCase().replace(' ', '-')}`)}
              style={{ display: "flex", alignItems: "center", height: "100%", padding: "0 4px", fontSize: 14, fontWeight: (n === "Dashboard") ? 700 : 500, color: (n === "Dashboard" || hoveredNav === n) ? "#1a73e8" : "#5f6368", borderBottom: (n === "Dashboard") ? "2px solid #1a73e8" : "2px solid transparent", cursor: "pointer", transition: "0.2s" }}
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
        <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "var(--text-heading)", margin: "0 0 8px 0" }}>👋 Welcome Back!</h1>
            <p style={{ color: "var(--text-muted)", fontSize: 16, fontWeight: 500 }}>Here's what's happening with your interview preparation today.</p>
          </div>
          <button 
            onClick={() => navigate("/interview-rounds")}
            style={{ background: "var(--primary-blue)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 24px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(26,115,232,0.2)" }}
          >Start Practice Round</button>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
          <StatCard icon="📊" value="68%" label="Overall Readiness" color="#1a73e8" bg="#e8f0fe" />
          <StatCard icon="📚" value="12" label="Topics Today" color="#1e8e3e" bg="#e6f4ea" />
          <StatCard icon="🏆" value="450" label="Points Earned" color="#e37400" bg="#fff3e0" />
          <StatCard icon="🔥" value="5 Days" label="Current Streak" color="#d93025" bg="#fce8e6" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
          
          {/* Left Column: Learning Progress */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ background: "var(--bg-surface)", borderRadius: 20, padding: 28, border: "1px solid var(--border-color)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>📖 Continue Learning</h2>
                <button onClick={() => navigate("/subjects")} style={{ background: "transparent", color: "var(--primary-blue)", border: "none", fontWeight: 700, cursor: "pointer" }}>View All Subjects</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <SubjectMiniCard title="Data Structures & Algorithms" progress={50} color="#1a73e8" icon="⚡" onClick={() => navigate("/subjects")} />
                <SubjectMiniCard title="Operating Systems" progress={20} color="#9334ea" icon="⚙️" onClick={() => navigate("/subjects")} />
                <SubjectMiniCard title="DBMS" progress={35} color="#1e8e3e" icon="🗄️" onClick={() => navigate("/subjects")} />
                <SubjectMiniCard title="System Design" progress={5} color="#e37400" icon="🏗️" onClick={() => navigate("/subjects")} />
              </div>
            </div>

            <div style={{ background: "linear-gradient(135deg, #1a73e8 0%, #1558b0 100%)", borderRadius: 20, padding: 32, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 8px 0" }}>Test Your Knowledge</h3>
                <p style={{ margin: 0, opacity: 0.9, maxWidth: 300 }}>Take a quick 10-minute aptitude test to stay sharp.</p>
              </div>
              <button 
                onClick={() => navigate("/aptitude")}
                style={{ background: "#fff", color: "#1a73e8", border: "none", borderRadius: 12, padding: "12px 24px", fontWeight: 800, cursor: "pointer" }}
              >Take Test</button>
            </div>
          </div>

          {/* Right Column: Planner & Quick Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            
            {/* Planner */}
            <div style={{ background: "var(--bg-surface)", borderRadius: 20, padding: 28, border: "1px solid var(--border-color)", height: "fit-content" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>📝 Daily Planner</h2>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", background: "var(--bg-surface-alt)", border: "1px solid var(--border-color)", borderRadius: 999, padding: "5px 10px" }}>
                  {plannerSummary.pending} pending
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8, marginBottom: 14 }}>
                {[
                  { key: "all", label: `All (${plannerSummary.total})` },
                  { key: "pending", label: `Pending (${plannerSummary.pending})` },
                  { key: "completed", label: `Done (${plannerSummary.completed})` }
                ].map(filter => (
                  <button
                    key={filter.key}
                    onClick={() => setPlannerFilter(filter.key)}
                    style={{
                      border: "1px solid var(--border-color)",
                      borderRadius: 10,
                      padding: "8px 6px",
                      background: plannerFilter === filter.key ? "var(--primary-blue)" : "var(--bg-surface)",
                      color: plannerFilter === filter.key ? "#fff" : "var(--text-muted)",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                <input 
                  type="text" 
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addTask();
                  }}
                  placeholder="Add a prep task..."
                  style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1.5px solid var(--border-color)", background: "var(--bg-surface)", color: "var(--text-main)", outline: "none", fontSize: 14 }}
                />
                <button onClick={addTask} style={{ background: "var(--primary-blue)", color: "#fff", border: "none", borderRadius: 10, width: 40, height: 40, fontWeight: 800, cursor: "pointer" }}>+</button>
              </div>

              {plannerSummary.completed > 0 && (
                <div style={{ marginBottom: 12, display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={clearCompleted}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#dc2626",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    Clear completed
                  </button>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 320, overflowY: "auto", paddingRight: 4 }}>
                {filteredTasks.map(task => (
                  <div key={task.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px", borderRadius: 12, background: task.completed ? "var(--bg-surface-alt)" : "var(--bg-page)", border: "1px solid var(--border-color)" }}>
                    <input 
                      type="checkbox" 
                      checked={task.completed} 
                      onChange={() => toggleTask(task.id)}
                      style={{ width: 18, height: 18, cursor: "pointer" }}
                    />
                    <span style={{ flex: 1, fontSize: 14, color: task.completed ? "var(--text-muted)" : "var(--text-heading)", textDecoration: task.completed ? "line-through" : "none", fontWeight: 500 }}>{task.text}</span>
                    <button onClick={() => deleteTask(task.id)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 16 }}>×</button>
                  </div>
                ))}

                {filteredTasks.length === 0 && (
                  <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 13, fontWeight: 600, padding: "16px 10px", border: "1px dashed var(--border-color)", borderRadius: 12 }}>
                    No tasks in this view. Add one to get started.
                  </div>
                )}
              </div>
            </div>

            {/* Quick Resources */}
            <div style={{ background: "var(--bg-surface)", borderRadius: 20, padding: 28, border: "1px solid var(--border-color)" }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 16px 0" }}>⚡ Quick Resources</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { name: "LeetCode", url: "https://leetcode.com", color: "#ffa116" },
                  { name: "GeeksforGeeks", url: "https://geeksforgeeks.org", color: "#2f8d46" },
                  { name: "InterviewBit", url: "https://interviewbit.com", color: "#0088cc" }
                ].map(res => (
                  <a key={res.name} href={res.url} target="_blank" rel="noreferrer" style={{ textDecoration: "none", padding: "12px", borderRadius: 12, border: "1.5px solid var(--border-color)", color: "var(--text-heading)", background: "var(--bg-surface)", fontWeight: 700, fontSize: 13, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {res.name}
                    <span style={{ color: res.color }}>↗</span>
                  </a>
                ))}
              </div>
            </div>

          </div>

        </div>

<<<<<<< Updated upstream
<<<<<<< HEAD
        <div className="right">
          <h2>📝 Today's Planner</h2>
          <div className="planner">
            <div className="input-row">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add new task..."
              />
              <button onClick={addTask} className="add-btn">Add</button>
=======
        {/* Stats Grid */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
          <StatCard icon="📊" value="68%" label="Overall Readiness" color="#1a73e8" bg="#e8f0fe" />
          <StatCard icon="📚" value="12" label="Topics Today" color="#1e8e3e" bg="#e6f4ea" />
          <StatCard icon="🏆" value="450" label="Points Earned" color="#e37400" bg="#fff3e0" />
          <StatCard icon="🔥" value="5 Days" label="Current Streak" color="#d93025" bg="#fce8e6" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
          
          {/* Left Column: Learning Progress */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ background: "#fff", borderRadius: 20, padding: 28, border: "1px solid #e8eaed" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>📖 Continue Learning</h2>
                <button onClick={() => navigate("/subjects")} style={{ background: "transparent", color: "#1a73e8", border: "none", fontWeight: 700, cursor: "pointer" }}>View All Subjects</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <SubjectMiniCard title="Data Structures & Algorithms" progress={50} color="#1a73e8" icon="⚡" onClick={() => navigate("/subjects")} />
                <SubjectMiniCard title="Operating Systems" progress={20} color="#9334ea" icon="⚙️" onClick={() => navigate("/subjects")} />
                <SubjectMiniCard title="DBMS" progress={35} color="#1e8e3e" icon="🗄️" onClick={() => navigate("/subjects")} />
                <SubjectMiniCard title="System Design" progress={5} color="#e37400" icon="🏗️" onClick={() => navigate("/subjects")} />
              </div>
            </div>

            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1, background: "linear-gradient(135deg, #1a73e8 0%, #1558b0 100%)", borderRadius: 20, padding: 24, color: "#fff", display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 8px 0" }}>Test Your Knowledge</h3>
                  <p style={{ margin: 0, opacity: 0.9, fontSize: 14 }}>Take a quick 10-minute aptitude test to stay sharp.</p>
                </div>
                <button 
                  onClick={() => navigate("/aptitude")}
                  style={{ background: "#fff", color: "#1a73e8", border: "none", borderRadius: 12, padding: "10px", fontWeight: 800, cursor: "pointer", alignSelf: "flex-start" }}
                >Take Test</button>
              </div>

              <div style={{ flex: 1, background: "linear-gradient(135deg, #9334ea 0%, #6b21a8 100%)", borderRadius: 20, padding: 24, color: "#fff", display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 8px 0" }}>Custom Practice Test</h3>
                  <p style={{ margin: 0, opacity: 0.9, fontSize: 14 }}>Create a customized mock exam for specific topics.</p>
                </div>
                <button 
                  onClick={() => navigate("/test")}
                  style={{ background: "#fff", color: "#9334ea", border: "none", borderRadius: 12, padding: "10px", fontWeight: 800, cursor: "pointer", alignSelf: "flex-start" }}
                >Configure Test</button>
              </div>
>>>>>>> origin/priyanshu
            </div>
            <ul className="task-list">
              {tasks.map((task) => (
                <li key={task.id} className={task.completed ? "done" : ""}>
                  <div className="task-item">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                    />
                    <span>{task.text}</span>
                  </div>
                  <button onClick={() => deleteTask(task.id)} className="delete-btn">❌</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
        <div className="quick-links">
        <h2>⚡ Quick Resources</h2>
        <div className="links">
          <a href="https://leetcode.com" target="_blank" rel="noreferrer" className="btn green">LeetCode</a>
          <a href="https://geeksforgeeks.org" target="_blank" rel="noreferrer" className="btn purple">GFG</a>
          <a href="https://interviewbit.com" target="_blank" rel="noreferrer" className="btn pink">InterviewBit</a>
        </div>
=======
>>>>>>> Stashed changes
      </div>
    </div>
  );
}