
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
    <div className="dashboard">
      <h1 className="title">📚 Interview Prep Dashboard</h1>

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
