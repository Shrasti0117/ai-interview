import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ProgressTracker from "./ProgressTracker";
import "./Hrroundpage2.css";

const API_BASE_URL = "http://localhost:5001";

const Hrroundpage2Backend = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { interviewId, initialQuestion, maxQuestions: initialMaxQuestions, usingFallback, language = "english" } = location.state || {};

  const [currentQuestion, setCurrentQuestion] = useState(initialQuestion || "");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [questionHistory, setQuestionHistory] = useState([]);
  const [answerHistory, setAnswerHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [maxQuestions, setMaxQuestions] = useState(initialMaxQuestions || 10);
  const [interviewUsingFallback, setInterviewUsingFallback] = useState(usingFallback || false);
  const [interviewLanguage, setInterviewLanguage] = useState(language);

  // ✅ Initialize interview
  useEffect(() => {
    if (!interviewId) {
      setError("Invalid session. Redirecting...");
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    if (initialQuestion) {
      setQuestionHistory([initialQuestion]);
      setCurrentQuestion(initialQuestion);
      setCurrentIndex(0);
      setTotalQuestions(1);
      if (initialMaxQuestions) {
        setMaxQuestions(initialMaxQuestions);
      }
    }
  }, [initialQuestion, interviewId, navigate, initialMaxQuestions]);

  // ✅ Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // ✅ Scroll to top when error appears
  useEffect(() => {
    if (error) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [error]);

  // ✅ Submit Answer & Fetch Next Question with Live Update
  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      setError("Please provide an answer.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.post(
        `${API_BASE_URL}/api/interview/answer`,
        {
          interviewId,
          answer,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ Check if interview is complete
      if (res.data?.interviewComplete) {
        setSuccessMessage(`✓ Interview Complete! You answered ${res.data?.totalQuestions} questions.`);
        setTimeout(() => {
          navigate("/interview-feedback", {
            state: {
              interviewId: res.data?.interviewId,
              totalQuestions: res.data?.totalQuestions,
              duration: res.data?.duration,
              performanceScore: res.data?.performanceScore,
              usingFallback: res.data?.usingFallback,
            },
          });
        }, 2000);
        return;
      }

      const nextQuestion = res.data?.question;

      if (!nextQuestion) {
        throw new Error("No question received from server");
      }

      // ✅ Safe state updates with live updates
      setAnswerHistory((prev) => [...prev, answer]);
      setQuestionHistory((prev) => [...prev, nextQuestion]);
      setCurrentIndex((prev) => prev + 1);
      setCurrentQuestion(nextQuestion);
      const newQuestionCount = questionHistory.length + 1;
      setTotalQuestions(newQuestionCount);
      setAnswer("");
      setSuccessMessage(
        `✓ Answer saved! (${newQuestionCount}/${maxQuestions}) Next question loaded.`
      );
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Previous Question
  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentQuestion(questionHistory[prevIndex]);
      setAnswer(answerHistory[prevIndex] || "");
      setError("");
      setSuccessMessage("");
    }
  };

  // ✅ Next (from history)
  const handleNext = () => {
    if (currentIndex < questionHistory.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentQuestion(questionHistory[nextIndex]);
      setAnswer(answerHistory[nextIndex] || "");
      setError("");
      setSuccessMessage("");
    }
  };

  // ✅ End Interview
  const handleEndInterview = () => {
    const confirmEnd = window.confirm(
      "Are you sure you want to end the interview? All your answers will be submitted."
    );
    if (confirmEnd) {
      navigate("/");
    }
  };

  const charCount = answer.length;
  const maxChars = 5000;

  return (
    <div className="interview-page-container">
      {/* LEFT SIDEBAR - PROGRESS TRACKER */}
      <aside className="interview-sidebar">
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "20px 0", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: "20px" }} onClick={() => navigate("/")}>
          <img src="/logo.png" alt="Logo" style={{ width: 44, height: 44, objectFit: "contain", borderRadius: "50%", boxShadow: "0 4px 12px rgba(0,0,0,0.12)", transition: "all 0.3s ease" }} 
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          />
          <div style={{ fontWeight: '800', fontSize: '18px', color: '#fff' }}>InterviewAce</div>
        </div>
        <ProgressTracker
          total={totalQuestions}
          current={currentIndex + 1}
          showTips={true}
          maxQuestions={maxQuestions}
          usingFallback={interviewUsingFallback}
        />
      </aside>

      {/* MAIN CONTENT */}
      <main className="interview-main-content">
        {/* HEADER */}
        <div className="interview-header">
          <div className="header-info">
            <h1>HR Round Interview</h1>
            <p className="interview-subtitle">
              Question {currentIndex + 1} of {maxQuestions} 
              {interviewUsingFallback && " • Fallback Mode"}
              {interviewLanguage !== "english" && ` • Language: ${interviewLanguage}`}
            </p>
          </div>
          <button
            className="btn-end-interview"
            onClick={handleEndInterview}
            disabled={loading}
          >
            End Interview
          </button>
        </div>

        {/* SUCCESS MESSAGE */}
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠</span>
            {error}
            <button
              className="error-close"
              onClick={() => setError("")}
            >
              ✕
            </button>
          </div>
        )}

        {/* QUESTION SECTION */}
        <div className="question-section">
          <div className="question-header">
            <h2 className="question-title">Question {currentIndex + 1}</h2>
            <span className="question-number">{currentIndex + 1}/{totalQuestions}</span>
          </div>

          {loading && currentIndex === questionHistory.length - 1 ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Generating next question...</p>
              <p className="loading-subtext">Please wait while AI prepares the next question</p>
            </div>
          ) : (
            <div className="question-content">
              <p className="question-text">
                {currentQuestion || "Loading question..."}
              </p>
            </div>
          )}
        </div>

        {/* ANSWER SECTION */}
        <div className="answer-section">
          <div className="answer-header">
            <label className="answer-label">Your Answer</label>
            <span className="char-counter">
              {charCount}/{maxChars}
            </span>
          </div>
          <textarea
            className="answer-textarea"
            value={answer}
            onChange={(e) => setAnswer(e.target.value.slice(0, maxChars))}
            placeholder="Type your answer here... Share your thoughts, experience, and insights."
            rows="10"
            disabled={loading}
            maxLength={maxChars}
          />
          <p className="answer-hint">
            💡 Tip: Be specific, honest, and provide relevant examples.
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="action-buttons">
          <button
            className="btn btn-secondary"
            onClick={handlePrevious}
            disabled={currentIndex === 0 || loading}
          >
            ← Previous
          </button>

          <div className="button-spacer"></div>

          {currentIndex < questionHistory.length - 1 ? (
            <button
              className="btn btn-primary"
              onClick={handleNext}
              disabled={loading}
            >
              Next →
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleSubmitAnswer}
              disabled={loading || !answer.trim()}
            >
              {loading ? "Processing..." : "Submit & Next"}
            </button>
          )}
        </div>

        {/* FOOTER INFO */}
        <div className="interview-footer">
          <p className="footer-text">
            Progress: <strong>{currentIndex + 1}</strong> of <strong>{totalQuestions}</strong> questions
          </p>
          <p className="footer-note">
            All answers are automatically saved as you progress through the interview.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Hrroundpage2Backend;