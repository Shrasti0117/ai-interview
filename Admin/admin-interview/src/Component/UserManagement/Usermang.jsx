import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Usermang.css";

const API_URL = "http://localhost:5001/api/admin";

const Usermang = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const getAuthHeader = () => {
    const token = localStorage.getItem("adminToken");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users-progress`, getAuthHeader());
      setUsers(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users", err);
      setLoading(false);
    }
  };

  const getScoreClass = (score) => {
    if (score >= 80) return "score-high";
    if (score >= 60) return "score-med";
    return "score-low";
  };

  if (loading) return <div className="loading">Loading user data...</div>;

  return (
    <div className="user-container">
      <div className="user-header">
        <h1>User Management</h1>
        <p>Monitor user performance and progress across interviews.</p>
      </div>

      <div className="user-table-container">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Interviews</th>
              <th>Avg Performance</th>
              <th>Joined On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className="user-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                </td>
                <td>{user.interviewCount}</td>
                <td>
                  <span className={`score-badge ${getScoreClass(user.avgScore)}`}>
                    {user.avgScore}%
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="view-details-btn">View Full Report</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Usermang;
