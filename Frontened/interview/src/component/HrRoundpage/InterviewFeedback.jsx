import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./InterviewFeedback.css";

const API_BASE_URL = "http://localhost:5001";

const getScoreColor = (score) => {
  if (score >= 80) return "#10b981";
  if (score >= 70) return "#3b82f6";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
};

const getScoreLabel = (score) => {
  if (score >= 80) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 60) return "Average";
  return "Needs Improvement";
};

const formatDuration = (seconds) => {
  const totalSeconds = Number.isFinite(seconds) ? Math.max(0, Math.round(seconds)) : 0;
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

const normalizeAnswer = (entry, index) => {
  if (!entry) return null;

  const answerText = entry.answer || entry.text || entry.response || "";
  const questionText = entry.question || entry.questionText || entry.prompt || "";

  return {
    questionNumber: entry.questionNumber || index + 1,
    question: questionText,
    answer: answerText,
    duration: Number(entry.duration || entry.timeSpent || 0),
    timestamp: entry.timestamp ? new Date(entry.timestamp) : null,
  };
};

const buildInterviewModel = ({ apiData, navigationState }) => {
  const source = apiData?.interview || apiData || {};
  const routeAnswers = Array.isArray(navigationState?.answers) ? navigationState.answers : [];
  const rawAnswers = routeAnswers.length
    ? routeAnswers
    : Array.isArray(source.answers)
      ? source.answers
      : Array.isArray(source.qaPairs)
        ? source.qaPairs
        : [];

  const answers = rawAnswers.map(normalizeAnswer).filter(Boolean);
  const scoreValue = Number(
    navigationState?.score ?? source.performanceScore ?? source.score ?? apiData?.performanceScore ?? apiData?.score ?? 0
  );
  const feedbackText =
    navigationState?.feedback || source.feedback || apiData?.feedback || "Your interview has been completed successfully.";
  const totalQuestions = Number(
    navigationState?.totalQuestions ?? source.totalQuestions ?? apiData?.totalQuestions ?? answers.length
  );

  const totalDurationSeconds = answers.reduce((total, item) => total + Number(item.duration || 0), 0);
  const durationFormatted =
    source.durationFormatted || apiData?.durationFormatted || formatDuration(source.duration || apiData?.durationSeconds || totalDurationSeconds);

  const totalWords = answers.reduce((total, item) => total + item.answer.split(/\s+/).filter(Boolean).length, 0);
  const avgAnswerWords = answers.length ? Math.round(totalWords / answers.length) : 0;
  const avgAnswerDuration = answers.length ? Math.max(1, Math.round(totalDurationSeconds / answers.length)) : 0;

  const strengths = [];
  if (scoreValue >= 80) {
    strengths.push("Strong overall delivery and confident communication.");
  } else if (scoreValue >= 70) {
    strengths.push("Clear structure and good interview pacing.");
  } else {
    strengths.push("You completed the full interview and stayed engaged.");
  }

  if (avgAnswerWords >= 35) {
    strengths.push("Your answers included useful context and detail.");
  }

  if (answers.some((item) => item.duration >= 10)) {
    strengths.push("You spent enough time on key responses to explain your thinking.");
  }

  const improvements = [];
  if (scoreValue < 80) {
    improvements.push("Add more concrete examples and measurable outcomes.");
  }
  if (avgAnswerWords < 35) {
    improvements.push("Expand short answers with context, action, and result.");
  }
  if (answers.some((item) => item.duration < 5)) {
    improvements.push("Pause briefly before answering to improve clarity.");
  }

  return {
    scoreValue,
    scoreLabel: getScoreLabel(scoreValue),
    scoreColor: getScoreColor(scoreValue),
    feedbackText,
    totalQuestions,
    durationFormatted,
    avgAnswerWords,
    avgAnswerDuration,
    strengths,
    improvements,
    answers,
    interviewId: navigationState?.interviewId || source._id || source.interviewId || "",
    status: source.status || "completed",
    startedAt: source.startedAt || null,
    completedAt: source.completedAt || null,
  };
};

const InterviewFeedback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationState = location.state;

  const [loading, setLoading] = useState(
    !(
      navigationState?.score !== undefined ||
      navigationState?.feedback ||
      (Array.isArray(navigationState?.answers) && navigationState.answers.length > 0)
    )
  );
  const [error, setError] = useState("");
  const [interview, setInterview] = useState(null);
  const [showAnswers, setShowAnswers] = useState(true);

  useEffect(() => {
    const hasRouteData =
      navigationState?.score !== undefined ||
      navigationState?.feedback ||
      (Array.isArray(navigationState?.answers) && navigationState.answers.length > 0);

    if (hasRouteData) {
      setInterview(buildInterviewModel({ navigationState }));
      setLoading(false);
      return;
    }

    if (!navigationState?.interviewId) {
      setError("No interview data found. Redirecting to home...");
      setLoading(false);
      const timer = setTimeout(() => navigate("/"), 2500);
      return () => clearTimeout(timer);
    }

    let active = true;

    const fetchInterviewResults = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const { data } = await axios.get(`${API_BASE_URL}/api/interview/results/${navigationState.interviewId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!active) return;
        setInterview(buildInterviewModel({ apiData: data, navigationState }));
      } catch (err) {
        if (!active) return;
        console.error(err);
        setError(err.response?.data?.error || err.message || "Failed to load interview results");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchInterviewResults();

    return () => {
      active = false;
    };
  }, [navigate, location.state]);

  useEffect(() => {
    if (error) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [error]);

  const answerCards = useMemo(() => interview?.answers || [], [interview]);

  if (loading) {
    return (
      <div className="feedback-container">
        <div className="feedback-shell loading-shell">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your interview results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="feedback-container">
        <div className="feedback-shell error-shell">
          <div className="error-box">
            <h2>Interview result unavailable</h2>
            <p>{error || "Failed to load interview results"}</p>
            <div className="action-buttons">
              <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
                Dashboard
              </button>
              <button className="btn btn-primary" onClick={() => navigate("/")}>
                Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-container">
      <div className="feedback-shell">
        <header className="feedback-header">
          <div className="brand-row" onClick={() => navigate("/")}> 
            <div className="brand-badge">IA</div>
            <div>
              <p className="eyebrow">InterviewAce</p>
              <h1>Interview complete</h1>
            </div>
          </div>
          <p className="header-subtitle">Your voice interview summary, score, and answer review</p>
        </header>

        <section className="result-hero">
          <div className="result-score-card">
            <div className="score-circle" style={{ borderColor: interview.scoreColor }}>
              <div className="score-value" style={{ color: interview.scoreColor }}>
                {Math.round(interview.scoreValue)}
              </div>
              <div className="score-label">/100</div>
            </div>

            <div className="score-info">
              <div className="score-pill" style={{ color: interview.scoreColor, borderColor: interview.scoreColor }}>
                {interview.scoreLabel}
              </div>
              <h2>Performance summary</h2>
              <p className="feedback-text">{interview.feedbackText}</p>
              <div className="feedback-tags">
                <span className="tag tag-info">{interview.totalQuestions} questions</span>
                <span className="tag tag-info">{interview.durationFormatted}</span>
                <span className="tag tag-info">{interview.avgAnswerWords} avg words</span>
              </div>
            </div>
          </div>

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
              <div className="metric-icon">🎯</div>
              <div className="metric-content">
                <div className="metric-value">{Math.max(0, interview.avgAnswerDuration)}s</div>
                <div className="metric-label">Avg Time/Q</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">✨</div>
              <div className="metric-content">
                <div className="metric-value">{interview.avgAnswerWords}</div>
                <div className="metric-label">Avg Answer Length</div>
              </div>
            </div>
          </div>
        </section>

        <section className="feedback-columns">
          <div className="feedback-panel">
            <div className="panel-header">
              <h3>What went well</h3>
              <span className="panel-subtitle">Strengths from this session</span>
            </div>
            <div className="panel-list">
              {interview.strengths.map((item) => (
                <div key={item} className="panel-item positive-item">
                  <span className="panel-bullet">+</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="feedback-panel">
            <div className="panel-header">
              <h3>Improve next time</h3>
              <span className="panel-subtitle">Actionable coaching notes</span>
            </div>
            <div className="panel-list">
              {interview.improvements.length > 0 ? (
                interview.improvements.map((item) => (
                  <div key={item} className="panel-item improvement-item">
                    <span className="panel-bullet">•</span>
                    <p>{item}</p>
                  </div>
                ))
              ) : (
                <div className="panel-item positive-item">
                  <span className="panel-bullet">+</span>
                  <p>Great pacing and detail across your answers.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="review-panel">
          <div className="review-header">
            <div>
              <h3>Answer review</h3>
              <p>Review the questions and responses captured during the interview.</p>
            </div>
            <button className="toggle-btn" onClick={() => setShowAnswers((prev) => !prev)}>
              {showAnswers ? "Hide answers" : "Show answers"}
            </button>
          </div>

          {showAnswers ? (
            answerCards.length > 0 ? (
              <div className="answer-list">
                {answerCards.map((item, index) => (
                  <article key={`${item.questionNumber}-${index}`} className="answer-card">
                    <div className="answer-card-header">
                      <h4>Question {item.questionNumber}</h4>
                      <span className="answer-meta">
                        {item.duration ? `${item.duration}s` : "0s"}
                        {item.timestamp ? ` • ${item.timestamp.toLocaleTimeString()}` : ""}
                      </span>
                    </div>

                    <div className="answer-block question-block">
                      <span className="answer-label">Question</span>
                      <p>{item.question || "Question text unavailable."}</p>
                    </div>

                    <div className="answer-block response-block">
                      <span className="answer-label">Your answer</span>
                      <p>{item.answer || "No answer captured."}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No answers were stored for this interview yet.</p>
              </div>
            )
          ) : (
            <div className="empty-state compact-state">
              <p>Answer review is hidden. Use the button above to expand it.</p>
            </div>
          )}
        </section>

        <div className="action-buttons">
          <button className="btn btn-secondary" onClick={() => navigate("/interview-rounds")}>
            Back to rounds
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/dashboard")}>
            Go to dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewFeedback;
