import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Report.css";

const Report = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

   const [view, setView] = useState("summary");

  if (!state || !state.report) {
    return <h2>No Report Found</h2>;
  }

  const { report } = state;
 

  return (
    <div className="report-container">

      {view === "summary" && (
        <div className="report-box">
          <h1 className="title">Test Completed!</h1>
          <p className="subtitle">You Passed! Room for improvement.</p>

          <div className="stats-row">
            <div className="stat-card blue">
              <h2>{report.correct}</h2>
              <p>Correct Answers</p>
            </div>

            <div className="stat-card green">
              <h2>{report.score}%</h2>
              <p>Score</p>
            </div>

            <div className="stat-card purple">
              <h2>{report.totalQuestions}</h2>
              <p>Total Questions</p>
            </div>

            <div className="stat-card orange">
              <h2>{Math.floor(report.timeTaken / 60)}</h2>
              <p>Duration (min)</p>
            </div>
          </div>

          <h2 className="section-title">Topic-wise Performance</h2>
          <ul className="topic-list">
            {Object.keys(report.topicAnalysis).map((topic) => (
              <li key={topic} className="topic-item">
                <strong>{topic}</strong> —{" "}
                {report.topicAnalysis[topic].correct}/
                {report.topicAnalysis[topic].correct +
                  report.topicAnalysis[topic].wrong}{" "}
                correct
              </li>
            ))}
          </ul>

          <button className="btn-primary" onClick={() => setView("details")}>
            View Detailed Results
          </button>
        </div>
      )}

      {/* -------------------- DETAILED VIEW -------------------- */}
      {view === "details" && (
        <div className="report-box">
          <h1 className="title">Detailed Results</h1>

          <div className="stats-row">
            <div className="stat-card light-green">
              <h2>{report.correct}</h2>
              <p>Correct</p>
            </div>

            <div className="stat-card light-red">
              <h2>{report.wrong}</h2>
              <p>Incorrect</p>
            </div>
          </div>

          <h2 className="section-title">Question Analysis</h2>

          {report.questions.map((q, i) => {
            const userIndex = report.answers[i];
            const userAnswer =
              userIndex !== undefined ? q.options[userIndex] : "Not Answered";

            const isCorrect = userAnswer === q.correctAnswer;

            return (
              <div key={i} className="question-card">
                <h3 className="question-title">
                  Q{i + 1} <span className="topic-tag">({q.topic})</span>
                </h3>

                <p>{q.question}</p>

                <p>
                  <strong>Your Answer:</strong>{" "}
                  <span className={isCorrect ? "correct-text" : "wrong-text"}>
                    {userAnswer}
                  </span>
                </p>

                <p>
                  <strong>Correct Answer:</strong>{" "}
                  <span className="correct-text">{q.correctAnswer}</span>
                </p>
              </div>
            );
          })}

          <button className="btn-dark2" onClick={() => setView("summary")}>
            Back to Summary
          </button>
        </div>
      )}

      <button className="btn-home2" onClick={() => navigate("/")}>
  Back to Home
</button>

    </div>
  );
};

export default Report;
