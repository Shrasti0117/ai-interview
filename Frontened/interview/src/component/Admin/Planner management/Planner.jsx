import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faClock, faCalendar } from "@fortawesome/free-solid-svg-icons";
import "./Planner.css";

const API_URL = "http://localhost:5001/api/admin/planner";

const Planner = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ task: "", priority: "Medium", date: "" });

  useEffect(() => {
    fetchTasks();
  }, []);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL, getAuthHeader());
      setTasks(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching tasks", err);
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, newTask, getAuthHeader());
      setShowModal(false);
      setNewTask({ task: "", priority: "Medium", date: "" });
      fetchTasks();
    } catch (err) {
      alert("Error adding task");
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm("Delete this planned task?")) {
      try {
        await axios.delete(`${API_URL}/${id}`, getAuthHeader());
        fetchTasks();
      } catch (err) {
        alert("Error deleting task");
      }
    }
  };

  if (loading) return <div className="loading">Loading Planner...</div>;

  return (
    <div className="planner-container">
      <div className="planner-header">
        <div>
          <h1>Planner Control</h1>
          <p>Schedule platform-wide tasks and announcements.</p>
        </div>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} /> Create Task
        </button>
      </div>

      <div className="planner-grid">
        {tasks.map((t) => (
          <div key={t._id} className={`task-card ${t.priority.toLowerCase()}`}>
            <div className="task-header">
              <span className="priority-tag">{t.priority}</span>
              <span className="status-badge">{t.status}</span>
            </div>
            <h3 className="task-title">{t.task}</h3>
            <div className="task-meta">
              <span><FontAwesomeIcon icon={faCalendar} /> {new Date(t.date).toLocaleDateString()}</span>
              <span><FontAwesomeIcon icon={faClock} /> {t.assignedTo}</span>
            </div>
            <div className="task-actions">
              <button className="delete-task-btn" onClick={() => handleDeleteTask(t._id)}>
                <FontAwesomeIcon icon={faTrash} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="add-task-modal">
          <div className="modal-card">
            <h2>Schedule New Task</h2>
            <form onSubmit={handleAddTask}>
              <div className="form-group">
                <label>Task / Announcement</label>
                <textarea 
                  value={newTask.task} 
                  onChange={(e) => setNewTask({...newTask, task: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value})}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input 
                  type="date" 
                  value={newTask.date} 
                  onChange={(e) => setNewTask({...newTask, date: e.target.value})} 
                  required 
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="submit-btn" style={{background: '#3b82f6', color: 'white'}}>Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Planner;
