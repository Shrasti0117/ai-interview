import React, { useEffect, useState } from 'react';
import './Hrroundpage2.css';

const ProgressTracker = ({ total = 0, current = 0, showTips = true, maxQuestions = 10, usingFallback = false }) => {
  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    // Live update progress
    if (maxQuestions > 0) {
      const percentage = Math.round((current / maxQuestions) * 100);
      setProgressPercentage(percentage);
    }
  }, [current, maxQuestions]);

  return (
    <div className="progress-tracker-container">
      <div className="tracker-header">
        <h3>📊 Interview Progress</h3>
        <span className="progress-badge">{current} / {maxQuestions}</span>
      </div>

      {usingFallback && (
        <div className="fallback-warning">
          <span className="warning-icon">⚠️</span>
          <span className="warning-text">Local Fallback Mode</span>
        </div>
      )}

      <div className="progress-bar-wrapper">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="progress-text">{progressPercentage}% Complete</p>
      </div>

      <div className="progress-stats">
        <div className="stat-item">
          <span className="stat-label">Questions Answered:</span>
          <span className="stat-value">{current - 1}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Questions Remaining:</span>
          <span className="stat-value">{Math.max(0, maxQuestions - current)}</span>
        </div>
      </div>

      {showTips && (
        <div className="tips-box">
          <h4>💡 Interview Tips</h4>
          <ul>
            <li>Be honest and specific</li>
            <li>Use real examples</li>
            <li>Take your time</li>
            <li>Stay focused</li>
            <li>Answer completely</li>
          </ul>
        </div>
      )}

      <p className="tracker-info">
        {usingFallback 
          ? "Using local fallback questions. Answer all to complete the interview."
          : "Answer all questions to receive detailed AI feedback."
        }
      </p>
    </div>
  );
};

export default ProgressTracker;
