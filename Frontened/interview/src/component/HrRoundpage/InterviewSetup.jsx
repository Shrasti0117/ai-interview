import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * INTERVIEWACE - InterviewSetup Component
 * A comprehensive setup page with Resume Upload, Language/Mode selection,
 * and real-time Voice/Video testing capabilities.
 */

const API_BASE_URL = "http://localhost:5001";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

.ia-setup-container {
  font-family: 'DM Sans', sans-serif;
  background-color: #F5F5F5;
  min-height: 100vh;
  padding: 40px 20px;
  color: #333;
}

.ia-setup-content {
  max-width: 800px;
  margin: 0 auto;
}

/* Typography */
.ia-title {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #1a1a1a;
}

.ia-subtitle {
  font-size: 15px;
  color: #777;
  margin: 0 0 32px 0;
}

/* Cards */
.ia-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  animation: ia-fadeIn 0.5s ease forwards;
}

.ia-card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.ia-icon-box {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background-color: #1D9E75;
  color: #fff;
}

.ia-icon-box.amber {
  background-color: #FAEEDA;
  color: #854F0B;
}

.ia-card-title-group h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.ia-card-title-group p {
  margin: 4px 0 0 0;
  font-size: 13px;
  color: #777;
}

.ia-small-gray {
  font-size: 13px;
  color: #999;
  font-weight: 400;
}

/* Upload Area */
.ia-upload-area {
  border: 2px dashed #ddd;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: #fdfdfd;
}

.ia-upload-area:hover {
  border-color: #1D9E75;
  background-color: #f9f9f9;
}

.ia-upload-area.active {
  border-color: #1D9E75;
  background-color: #E1F5EE;
}

.ia-upload-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.ia-filename {
  font-weight: 600;
  color: #1D9E75;
  margin-top: 8px;
  display: block;
}

/* Selectors */
.ia-selector-group {
  margin-bottom: 24px;
}

.ia-selector-label {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  display: block;
}

.ia-btn-row {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.ia-mode-btn {
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #e8e8e8;
  background: #fff;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.ia-mode-btn:hover {
  background: #f9f9f9;
  border-color: #ccc;
}

.ia-mode-btn.active {
  border: 2px solid #1D9E75;
  background-color: #E1F5EE;
  color: #1D9E75;
}

/* Panels */
.ia-panel {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 12px;
  border: 1px solid #eee;
  animation: ia-fadeIn 0.4s ease;
}

.ia-panel-info {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}

/* Banner */
.ia-banner {
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 13px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  line-height: 1.4;
}

.ia-banner.warning {
  background-color: #FAEEDA;
  border: 1px solid #EF9F27;
  color: #854F0B;
}

.ia-banner.error {
  background-color: #FCEBEB;
  border: 1px solid #E24B4A;
  color: #E24B4A;
}

.ia-banner.success {
  background-color: #E1F5EE;
  border: 1px solid #1D9E75;
  color: #1D9E75;
}

/* Voice Specific */
.ia-status-row {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.ia-mic-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ccc;
}

.ia-mic-dot.active {
  background: #1D9E75;
  animation: ia-pulse 1.5s infinite;
}

.ia-mic-dot.muted {
  background: #E24B4A;
}

.ia-status-text {
  font-size: 13px;
  font-weight: 500;
  flex: 1;
}

.ia-wave-container {
  display: flex;
  align-items: center;
  gap: 3px;
  height: 20px;
}

.ia-wave-bar {
  width: 3px;
  background: #1D9E75;
  border-radius: 2px;
}

/* Video Specific */
.ia-video-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.ia-video-box {
  background: #1a1a2e;
  aspect-ratio: 16/9;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ia-video-box video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ia-video-placeholder {
  color: #fff;
  text-align: center;
}

.ia-video-avatar {
  font-size: 40px;
  margin-bottom: 8px;
  display: block;
}

.ia-video-label {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(0,0,0,0.5);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
}

/* Tips Grid */
.ia-tips-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.ia-tip-box {
  display: flex;
  gap: 12px;
}

.ia-tip-icon-box {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ia-tip-content h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
}

.ia-tip-content p {
  margin: 0;
  font-size: 12px;
  color: #777;
  line-height: 1.4;
}

/* Start Button */
.ia-start-btn {
  width: 100%;
  background-color: #1D9E75;
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(29, 158, 117, 0.2);
}

.ia-start-btn:hover:not(:disabled) {
  background-color: #188663;
  transform: translateY(-1px);
}

.ia-start-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.ia-footer-note {
  text-align: center;
  font-size: 13px;
  color: #999;
  margin-top: 12px;
}

/* Animations */
@keyframes ia-pulse {
  0% { box-shadow: 0 0 0 0 rgba(29, 158, 117, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(29, 158, 117, 0); }
  100% { box-shadow: 0 0 0 0 rgba(29, 158, 117, 0); }
}

@keyframes ia-wave {
  0%, 100% { height: 4px; }
  50% { height: 18px; }
}

@keyframes ia-fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive */
@media (max-width: 600px) {
  .ia-video-grid, .ia-tips-grid, .ia-btn-row {
    grid-template-columns: 1fr;
  }
  .ia-btn-row {
    flex-direction: column;
  }
}
`;

// --- SUB-COMPONENTS ---

const PermBanner = ({ type, message }) => (
  <div className={`ia-banner ${type}`}>
    <span>{type === "warning" ? "⚠️" : type === "error" ? "❌" : "✅"}</span>
    <span>{message}</span>
  </div>
);

const VoicePanel = () => {
  const [micEnabled, setMicEnabled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [permError, setPermError] = useState(false);
  const [testMsg, setTestMsg] = useState("");
  const streamRef = useRef(null);

  const toggleMic = async () => {
    if (micEnabled) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setMicEnabled(false);
      setIsMuted(false);
      streamRef.current = null;
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        setMicEnabled(true);
        setPermError(false);
      } catch (err) {
        console.error("Mic access error:", err);
        setPermError(true);
      }
    }
  };

  const testMic = () => {
    setTestMsg("🎙 Listening... speak now!");
    setTimeout(() => {
      setTestMsg("✓ Microphone working — audio detected clearly.");
      setTimeout(() => setTestMsg(""), 3000);
    }, 2000);
  };

  const toggleMute = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  return (
    <div className="ia-panel">
      {!micEnabled && !permError && (
        <PermBanner type="warning" message="Microphone access is required for voice interview. Click 'Enable Mic' to allow." />
      )}
      {permError && (
        <PermBanner type="error" message="Microphone permission denied. Please allow microphone access in your browser settings and try again." />
      )}

      <div className="ia-status-row">
        <div className={`ia-mic-dot ${micEnabled ? (isMuted ? "muted" : "active") : ""}`}></div>
        <div className="ia-status-text">
          {!micEnabled ? "Microphone off — Enable mic to start" : 
           isMuted ? "Muted — Unmute to answer" : "Microphone active — Ready for interview"}
        </div>
        {micEnabled && !isMuted && (
          <div className="ia-wave-container">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="ia-wave-bar" style={{ 
                animation: `ia-wave 0.6s infinite ease-in-out`,
                animationDelay: `${i * 0.1}s`,
                height: `${4 + Math.random() * 10}px`
              }}></div>
            ))}
          </div>
        )}
      </div>

      <div className="ia-btn-row">
        <button 
          className={`ia-mode-btn ${micEnabled ? "active" : ""}`} 
          onClick={toggleMic}
          style={micEnabled ? { backgroundColor: "#FCEBEB", borderColor: "#E24B4A", color: "#E24B4A" } : {}}
        >
          {micEnabled ? "🔴 Disable Mic" : "🎙 Enable Mic"}
        </button>
        <button className="ia-mode-btn" onClick={testMic} disabled={!micEnabled}>
          🔊 Test Mic
        </button>
        <button className="ia-mode-btn" onClick={toggleMute} disabled={!micEnabled}>
          {isMuted ? "🔊 Unmute" : "🔇 Mute"}
        </button>
      </div>

      {testMsg && <PermBanner type="success" message={testMsg} />}

      <p className="ia-panel-info">
        AI will ask questions verbally. Speak your answers clearly. Responses are auto-transcribed and evaluated in real time.
      </p>
    </div>
  );
};

const VideoPanel = () => {
  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [permError, setPermError] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const enableCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraOn(true);
      setStatusMsg("✓ Camera connected successfully.");
      setTimeout(() => setStatusMsg(""), 3000);
      setPermError("");
    } catch (err) {
      setPermError("Camera access denied. Please check permissions.");
    }
  };

  const enableMic = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicOn(true);
      setStatusMsg("✓ Microphone connected for video interview.");
      setTimeout(() => setStatusMsg(""), 3000);
      setPermError("");
    } catch (err) {
      setPermError("Microphone access denied. Please check permissions.");
    }
  };

  const stopAll = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setCameraOn(false);
    setMicOn(false);
    setPermError("");
    setStatusMsg("");
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  return (
    <div className="ia-panel">
      {!cameraOn && !permError && (
        <PermBanner type="warning" message="Camera and microphone access required. Click 'Enable Camera' to start." />
      )}
      {permError && <PermBanner type="error" message={permError} />}

      <div className="ia-video-grid">
        <div className="ia-video-box">
          {cameraOn ? (
            <video ref={videoRef} autoPlay muted playsInline />
          ) : (
            <div className="ia-video-placeholder">
              <span className="ia-video-avatar">👤</span>
              <p style={{ fontSize: 13, margin: 0 }}>Your camera</p>
            </div>
          )}
          <div className="ia-video-label">You</div>
        </div>
        <div className="ia-video-box">
          <div className="ia-video-placeholder">
            <span className="ia-video-avatar">🤖</span>
            <p style={{ fontSize: 13, margin: 0 }}>AI Interviewer</p>
          </div>
          <div className="ia-video-label">InterviewAce AI</div>
        </div>
      </div>

      <div className="ia-btn-row">
        <button className={`ia-mode-btn ${cameraOn ? "active" : ""}`} onClick={enableCamera}>
          📷 {cameraOn ? "Camera On" : "Enable Camera"}
        </button>
        <button className={`ia-mode-btn ${micOn ? "active" : ""}`} onClick={enableMic}>
          🎙 {micOn ? "Mic On" : "Enable Mic"}
        </button>
        <button className="ia-mode-btn" onClick={() => { setStatusMsg("🔄 Camera flipped (front/rear)."); setTimeout(() => setStatusMsg(""), 2000); }} disabled={!cameraOn}>
          🔄 Flip
        </button>
        <button className="ia-mode-btn" style={{ color: "#E24B4A" }} onClick={stopAll}>
          ✕ Stop All
        </button>
      </div>

      {statusMsg && <PermBanner type="success" message={statusMsg} />}

      <p className="ia-panel-info">
        Full video interview with AI facial expression analysis. Ensure good lighting and a quiet environment for best results.
      </p>
    </div>
  );
};

// --- MAIN COMPONENT ---

export default function InterviewSetup({ onStart }) {
  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState(null);
  const [lang, setLang] = useState("en");
  const [mode, setMode] = useState("text");
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setResumeFile(file);
  };

  const handleStart = async () => {
    // For voice mode, start interview and navigate to voice interview page
    if (mode === "voice") {
      setStarting(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const formData = new FormData();
        if (resumeFile) {
          formData.append("resume", resumeFile);
        }
        formData.append("language", lang === "en" ? "english" : "hindi");

        let sessionId = localStorage.getItem("sessionId");
        if (!sessionId) {
          sessionId = crypto.randomUUID();
          localStorage.setItem("sessionId", sessionId);
        }
        formData.append("sessionId", sessionId);

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
          navigate("/voice-interview", {
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
          setStarting(false);
        }
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.error ||
            err.response?.data?.message ||
            err.message ||
            "Something went wrong"
        );
        setStarting(false);
      }
    } else {
      // For text/video modes, use original handler
      setStarting(true);
      setTimeout(() => {
        setStarting(false);
        if (onStart) onStart({ lang, mode, resumeFile });
      }, 1800);
    }
  };

  return (
    <div className="ia-setup-container">
      <style>{styles}</style>
      <div className="ia-setup-content">
        {/* Header */}
        <header>
          <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", marginBottom: "15px" }} onClick={() => window.location.href = "/"}>
            <img src="/logo.png" alt="Logo" style={{ width: 44, height: 44, objectFit: "cover", borderRadius: "50%", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
            <div style={{ fontWeight: '800', fontSize: '22px', color: '#1a1a1a', letterSpacing: '-0.5px' }}>InterviewAce</div>
          </div>
          <h1 className="ia-title">Setup Your Interview</h1>
          <p className="ia-subtitle">Configure your preferences for the best AI interview experience</p>
        </header>

        {/* Error Message */}
        {error && (
          <div style={{ 
            maxWidth: "800px", 
            margin: "20px 0", 
            padding: "12px 16px", 
            backgroundColor: "#FCEBEB", 
            border: "1px solid #E24B4A", 
            color: "#E24B4A", 
            borderRadius: "10px",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        {/* Upload Resume Card */}
        <div className="ia-card">
          <div className="ia-card-header">
            <div className="ia-icon-box">📄</div>
            <div className="ia-card-title-group">
              <h3>Upload Resume <span className="ia-small-gray">(Optional)</span></h3>
              <p>Upload your resume for personalized questions</p>
            </div>
          </div>
          <div 
            className={`ia-upload-area ${resumeFile ? "active" : ""}`}
            onClick={() => fileInputRef.current.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: "none" }} 
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
            {resumeFile ? (
              <div>
                <span className="ia-upload-icon">✅</span>
                <span className="ia-filename">{resumeFile.name}</span>
              </div>
            ) : (
              <div>
                <span className="ia-upload-icon">☁️</span>
                <p style={{ fontSize: 14, margin: 0, color: "#777" }}>Click to upload (PDF, DOC, DOCX)</p>
              </div>
            )}
          </div>
        </div>

        {/* Language & Mode Card */}
        <div className="ia-card">
          <div className="ia-card-header">
            <div className="ia-icon-box">⚙</div>
            <div className="ia-card-title-group">
              <h3>Language & Mode</h3>
              <p>Choose how you want to interact with the AI</p>
            </div>
          </div>

          <div className="ia-selector-group">
            <label className="ia-selector-label">Select Language</label>
            <div className="ia-btn-row">
              <button className={`ia-mode-btn ${lang === "en" ? "active" : ""}`} onClick={() => setLang("en")}>🇺🇸 English</button>
              <button className={`ia-mode-btn ${lang === "hi" ? "active" : ""}`} onClick={() => setLang("hi")}>🇮🇳 हिंदी</button>
            </div>
          </div>

          <div className="ia-selector-group">
            <label className="ia-selector-label">Interview Mode</label>
            <div className="ia-btn-row">
              <button className={`ia-mode-btn ${mode === "text" ? "active" : ""}`} onClick={() => setMode("text")}>📝 TEXT</button>
              <button className={`ia-mode-btn ${mode === "voice" ? "active" : ""}`} onClick={() => setMode("voice")}>🎙 VOICE</button>
              <button className={`ia-mode-btn ${mode === "video" ? "active" : ""}`} onClick={() => setMode("video")}>📹 VIDEO</button>
            </div>
          </div>

          {/* Dynamic Panels */}
          <div style={{ marginTop: 24 }}>
            {mode === "text" && (
              <div className="ia-panel">
                <p className="ia-panel-info">
                  Type your answers during the interview. Questions will appear as text and you respond by typing. Best for quiet environments.
                </p>
              </div>
            )}
            {mode === "voice" && <VoicePanel />}
            {mode === "video" && <VideoPanel />}
          </div>
        </div>

        {/* Tips Card */}
        <div className="ia-card">
          <div className="ia-card-header">
            <div className="ia-icon-box amber">💡</div>
            <div className="ia-card-title-group">
              <h3>Interview Tips</h3>
              <p>Best practices for a successful preparation</p>
            </div>
          </div>
          <div className="ia-tips-grid">
            {[
              { icon: "💛", title: "Be Honest", desc: "AI detects exaggeration. Authentic answers score better.", bg: "#FAEEDA" },
              { icon: "⏱", title: "Take Your Time", desc: "Think before answering. Quality over speed.", bg: "#E6F1FB" },
              { icon: "📌", title: "Use Examples", desc: "Real-world examples improve evaluation accuracy.", bg: "#FCEBEB" },
              { icon: "🎯", title: "Stay Focused", desc: "Answer to the point. Avoid unnecessary details.", bg: "#EEEDFE" }
            ].map((tip, i) => (
              <div key={i} className="ia-tip-box">
                <div className="ia-tip-icon-box" style={{ backgroundColor: tip.bg }}>{tip.icon}</div>
                <div className="ia-tip-content">
                  <h4>{tip.title}</h4>
                  <p>{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div style={{ marginTop: 40 }}>
          <button 
            className="ia-start-btn" 
            onClick={handleStart} 
            disabled={starting}
          >
            {starting ? "⏳ Starting Interview..." : "Start AI Interview ▶"}
          </button>
          <p className="ia-footer-note">Average interview duration: 15–20 minutes</p>
        </div>
      </div>
    </div>
  );
}
