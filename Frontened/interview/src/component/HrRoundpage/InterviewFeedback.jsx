import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./InterviewFeedback.css";

const API_BASE_URL = "http://localhost:5001";

const InterviewFeedback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { interviewId, totalQuestions, duration, performanceScore } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [interview, setInterview] = useState(null);

  useEffect(() => {
    if (!interviewId) {
      setError("No interview data found. Redirecting...");
      setTimeout(() => navigate("/"), 3000);
      return;
    }

    fetchInterviewResults();
  }, [interviewId, navigate]);

  // ✅ Scroll to top when error appears
  useEffect(() => {
    if (error) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [error]);

  const fetchInterviewResults = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const { data } = await axios.get(
        `${API_BASE_URL}/api/interview/results/${interviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setInterview(data.interview);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || 
        err.message || 
        "Failed to load interview results"
      );
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#10b981"; // Green
    if (score >= 70) return "#3b82f6"; // Blue
    if (score >= 60) return "#f59e0b"; // Orange
    return "#ef4444"; // Red
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 60) return "Average";
    return "Needs Improvement";
  };

  if (loading) {
    return (
      <div className="feedback-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your interview results...</p>
        </div>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="feedback-container">
        <div className="error-box">
          <h2>⚠️ Error</h2>
          <p>{error || "Failed to load interview results"}</p>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-container">
      {/* HEADER */}
      <div className="feedback-header">
        <h1>🎉 Interview Complete!</h1>
        <p className="header-subtitle">
          Here's your performance summary and feedback
        </p>
      </div>

      {/* SCORE CARD */}
      <div className="score-card">
        <div className="score-circle" style={{ borderColor: getScoreColor(interview.performanceScore) }}>
          <div className="score-value" style={{ color: getScoreColor(interview.performanceScore) }}>
            {interview.performanceScore}
          </div>
          <div className="score-label">Score</div>
        </div>
        <div className="score-info">
          <h2 style={{ color: getScoreColor(interview.performanceScore) }}>
            {getScoreLabel(interview.performanceScore)}
          </h2>
          <p className="feedback-text">{interview.feedback}</p>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">📝</div>
          <div className="metric-content">
            <div className="metric-value">{interview.totalQuestions}</div>
            <div className="metric-label">Total Questions</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⏱️</div>
          <div className="metric-content">
            <div className="metric-value">{interview.durationFormatted}</div>
            <div className="metric-label">Total Time</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⏳</div>
          <div className="metric-content">
            <div className="metric-value">{interview.metrics.timePerQuestion}s</div>
            <div className="metric-label">Avg Time/Q</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <div className="metric-value">{interview.metrics.avgAnswerWords}</div>
            <div className="metric-label">Avg Answer Length</div>
          </div>
        </div>
      </div>

      {/* DETAILS SECTION */}
      <div className="details-section">
        <h3>Interview Details</h3>
        
        {interview.usingFallback && (
          <div className="info-banner">
            <span className="info-icon">ℹ️</span>
            <span>This interview used local fallback questions</span>
          </div>
        )}

        {interview.language && interview.language !== "english" && (
          <div className="info-banner">
            <span className="info-icon">🌍</span>
            <span>Interview Language: <strong>{interview.language}</strong></span>
          </div>
        )}

        <div className="detail-item">
          <span className="detail-label">Status:</span>
          <span className="detail-value">
            {interview.status === "completed" ? "✅ Completed" : "⏳ In Progress"}
          </span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Started at:</span>
          <span className="detail-value">
            {new Date(interview.startedAt).toLocaleString()}
          </span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Completed at:</span>
          <span className="detail-value">
            {new Date(interview.completedAt).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Q&A SECTION */}
      <div className="qa-section">
        <h3>Your Answers</h3>
        <div className="qa-list">
          {interview.qaPairs.map((pair, index) => (
            <div key={index} className="qa-item">
              <div className="qa-header">
                <h4>Question {pair.questionNumber}</h4>
                <span className="char-count">{pair.charCount} characters</span>
              </div>
              <p className="question-text">Q: {pair.question}</p>
              <div className="answer-box">
                <p className="answer-text">A: {pair.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="action-buttons">
        <button className="btn btn-secondary" onClick={() => navigate("/")}>
          ← Go Home
        </button>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Start New Interview →
        </button>
      </div>
    </div>
  );
};

export default InterviewFeedback;
