
import { useState, useEffect } from "react";
import './Dashboard.css';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

   useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("plannerTasks")) || [];
    setTasks(savedTasks);
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
    if (newTask.trim() === "") return;
    setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    setNewTask("");
  };

  return (
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

      <div className="grid">
       
        <div className="left">
          <h2>📖 Track Your Interview Readiness</h2>
          <div className="subject-grid">
            {[
              { title: "Data Structures & Algorithms", progress: 50 },
              { title: "Operating Systems", progress: 20 },
              { title: "DBMS", progress: 15 },
              { title: "Computer Networks", progress: 10 },
              { title: "System Design", progress: 5 },
            ].map((subject, idx) => (
              <div key={idx} className="card">
                <h3>{subject.title}</h3>
                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{ width: `${subject.progress}%` }}
                  />
                </div>
                <p>{subject.progress}% completed</p>
                <button className="continue-btn">Continue</button>
              </div>
            ))}
          </div>
        </div>

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
      </div>
    </div>
  );
}
