import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Analytics.css";

const API_URL = "http://localhost:5001/api/admin";

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(`${API_URL}/dashboard`, getAuthHeader());
      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching analytics", err);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading analytics...</div>;

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1>Dashboard Analytics</h1>
        <p>Comprehensive overview of platform performance.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Users</span>
          <span className="stat-value">{data.stats.users}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Interviews</span>
          <span className="stat-value">{data.stats.interviews}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Subjects</span>
          <span className="stat-value">{data.stats.subjects}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Questions</span>
          <span className="stat-value">{data.stats.questions}</span>
        </div>
      </div>

      <div className="charts-row">
        <div className="recent-activity">
          <h3>Recent Interviews</h3>
          <div className="activity-list">
            {data.latestInterviews.map((int) => (
              <div key={int._id} className="activity-item">
                <div className="user-meta">
                  <span className="user-name">{int.userId?.name || "Unknown"}</span>
                  <span className="user-email">{int.userId?.email || ""}</span>
                </div>
                <div className="activity-info">
                   <span className="activity-date">{new Date(int.createdAt).toLocaleDateString()}</span>
                </div>
                <div className={`activity-perf score-badge ${int.performanceScore >= 80 ? 'score-high' : int.performanceScore >= 60 ? 'score-med' : 'score-low'}`}>
                  {int.performanceScore}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
