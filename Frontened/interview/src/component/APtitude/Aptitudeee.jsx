import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./aptitudeee.css";

const Aptitudeee = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { questions = [] } = location.state || {};

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes

  // Submit answers
  const handleSubmit = React.useCallback(() => {
    let correct = 0;
    let wrong = 0;

    const topicAnalysis = {};

    questions.forEach((q, index) => {
      const userAnswerIndex = answers[index];
      const userAnswerText = userAnswerIndex !== undefined ? q.options[userAnswerIndex] : null;
      const correctAnswerText = q.correctAnswer;

      if (!topicAnalysis[q.topic]) {
        topicAnalysis[q.topic] = { correct: 0, wrong: 0 };
      }

      if (userAnswerText === correctAnswerText) {
        correct++;
        topicAnalysis[q.topic].correct++;
      } else {
        wrong++;
        topicAnalysis[q.topic].wrong++;
      }
    });

    // Navigate to report page
    navigate("/aptitude-report", {
      state: {
        correct,
        wrong,
        topicAnalysis,
        total: questions.length,
      },
    });
  }, [answers, questions, navigate]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleSubmit]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Handle answer selection
  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  if (!questions || questions.length === 0) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>No questions found</h2>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const optionLetters = ["A", "B", "C", "D"];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="header">
        <div className="header-title">Aptitude Test</div>
        <div className="timer-info">
          <span className="timer-icon">🕒</span>
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-text">
          <span>
            Progress: {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span>
            Answered: {answeredCount} of {questions.length}
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-indicator"
            style={{
              width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>


      <div className="question-box">
        <div className="question-header">
          <span className="topic-tag">{currentQuestion.topic || "Topic"}</span>
          <span>
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>

        <p className="question-text">{currentQuestion.question}</p>

        <div className="option-container">
          {currentQuestion.options.map((opt, i) => (
            <label key={i} className="option">
              <input
                type="radio"
                name={`question-${currentQuestionIndex}`}
                value={i}
                checked={answers[currentQuestionIndex] === i}
                onChange={() => handleAnswerSelect(currentQuestionIndex, i)}
                className="radio-input"
              />
              <strong
                style={{ color: "#3498db", marginRight: "10px" }}
              >
                {optionLetters[i]}
              </strong>
              {opt}
            </label>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="footer-buttons">
        <button
          className="button previous-button"
          onClick={() =>
            setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
          }
        >
          ← Previous
        </button>

        <button className="button submit-button" onClick={handleSubmit}>
          &#10006; Submit Test
        </button>

        <button
          className="button next-button"
          onClick={() =>
            setCurrentQuestionIndex((prev) =>
              Math.min(prev + 1, questions.length - 1)
            )
          }
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Aptitudeee;
