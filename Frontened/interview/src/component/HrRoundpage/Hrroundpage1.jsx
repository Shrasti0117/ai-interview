import React, { useState, useEffect } from "react";
import axios from "axios";
import "./hrroundpage.css";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5001";

const tips = [
  {
    icon: "💡",
    title: "Be Honest",
    desc: "AI detects exaggeration. Authentic answers score better.",
  },
  {
    icon: "⏱️",
    title: "Take Your Time",
    desc: "Think before answering. Quality over speed.",
  },
  {
    icon: "📌",
    title: "Use Examples",
    desc: "Real-world examples improve evaluation accuracy.",
  },
  {
    icon: "🎯",
    title: "Stay Focused",
    desc: "Answer to the point. Avoid unnecessary details.",
  },
];

const Hrroundpage1 = () => {
  const navigate = useNavigate();

  const [language, setLanguage] = useState("english");
  const [mode, setMode] = useState("text");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Create persistent sessionId
  useEffect(() => {
    let existingSession = localStorage.getItem("sessionId");

    if (!existingSession) {
      const newSessionId = crypto.randomUUID(); // better than Date.now()
      localStorage.setItem("sessionId", newSessionId);
    }
  }, []);

  // ✅ Scroll to top when error appears
  useEffect(() => {
    if (error) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [error]);

  // ✅ File validation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF, DOC, DOCX files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.");
      return;
    }

    setError("");
    setResumeFile(file);
  };

  const startInterview = async () => {
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      formData.append("language", language);
      formData.append("mode", mode);
      formData.append("sessionId", localStorage.getItem("sessionId"));

      const { data } = await axios.post(
        `${API_BASE_URL}/api/interview/start`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.interviewId && data.question) {
        navigate("/hr-round-2", {
          state: {
            interviewId: data.interviewId,
            initialQuestion: data.question,
            maxQuestions: data.maxQuestions,
            usingFallback: data.usingFallback,
            language: data.language,
          },
        });
      } else {
        setError("Interview started but question not received.");
      }
    } catch (err) {
      console.error(err);
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

  return (
    <div>
      <div className="setup-container">
        <h1 className="setup-title">Setup Your Interview</h1>
        <p className="setup-subtitle">
          Configure your preferences for the best AI interview experience
        </p>

        {/* Error Message */}
        {error && <div className="error-box">{error}</div>}

        {/* Resume Upload */}
        <div className="setup-card">
          <div className="card-header">
            <div className="card-icon">📄</div>
            <div>
              <h3>Upload Resume (Optional)</h3>
              <p>
                Upload your resume for personalized questions.
              </p>
            </div>
          </div>

          <div className="upload-box">
            <div className="upload-icon">☁️</div>

            {resumeFile ? (
              <div className="file-info">
                <p>{resumeFile.name}</p>
                <button onClick={() => setResumeFile(null)}>Remove</button>
              </div>
            ) : (
              <span>PDF, DOC, DOCX (Max 5MB)</span>
            )}

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Language & Mode */}
        <div className="lm-card">
          <div className="lm-header">
            <div className="lm-icon">⚙️</div>
            <div>
              <h3>Language & Mode</h3>
            </div>
          </div>

          <p className="section-title">Select Language</p>
          <div className="lm-row">
            {[
              { code: "english", label: "🇺🇸 English", name: "English" },
              { code: "hindi", label: "🇮🇳 हिंदी", name: "Hindi" },
            ].map((lang) => (
              <div
                key={lang.code}
                className={`lm-option ${language === lang.code ? "active" : ""}`}
                onClick={() => setLanguage(lang.code)}
                title={lang.name}
              >
                <p>{lang.label}</p>
              </div>
            ))}
          </div>

          <p className="section-title">Select Interview Mode</p>
          <div className="lm-row">
            {["text", "voice", "video"].map((m) => (
              <div
                key={m}
                className={`lm-option mode ${
                  mode === m ? "active" : ""
                }`}
                onClick={() => setMode(m)}
              >
                <h4>{m.toUpperCase()}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="tips-card">
          <div className="tips-header">
            <div className="tips-icon">💡</div>
            <h3>Interview Tips</h3>
          </div>

          <div className="tips-grid">
            {tips.map((tip, index) => (
              <div key={index} className="tip-box">
                <div className="tip-icon">{tip.icon}</div>
                <div>
                  <h4>{tip.title}</h4>
                  <p>{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="start-wrapper">
        <button
          className="start-btn"
          onClick={startInterview}
          disabled={loading}
        >
          {loading ? "Starting..." : "Start AI Interview ▶"}
        </button>

        <p className="duration-text">
          Average interview duration: 15–20 minutes
        </p>
      </div>
    </div>
  );
};

export default Hrroundpage1;