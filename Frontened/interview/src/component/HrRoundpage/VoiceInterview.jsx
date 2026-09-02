import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./VoiceInterview.css";

const API_BASE_URL = "http://localhost:5001";

const VoiceInterview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [maxQuestions, setMaxQuestions] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [userDuration, setUserDuration] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [conversationHistory, setConversationHistory] = useState([]); // For future conversation replay
  const [userName, setUserName] = useState("You");
  const [answers, setAnswers] = useState([]); // Store all answers
  const [isTransitioning, setIsTransitioning] = useState(false); // Track transition state
  const recognitionRef = useRef(null);
  const durationRef = useRef(null);
  const interviewIdRef = useRef(location.state?.interviewId);

  // Speak question using Web Speech API (Define BEFORE useEffect that uses it)
  const speakQuestion = useCallback((text) => {
    const synth = window.speechSynthesis;
    if (!synth) {
      setError("Text-to-Speech not supported");
      return;
    }

    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = location.state?.language === "hindi" ? "hi-IN" : "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setAiSpeaking(true);
    utterance.onend = () => setAiSpeaking(false);
    utterance.onerror = (event) => {
      console.error("Speech error:", event.error);
      setAiSpeaking(false);
    };

    synth.speak(utterance);
  }, [location.state?.language]);

  // Get user name from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserName(user.name || "You");
      } catch (e) {
        setUserName("You");
      }
    }
  }, []);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech Recognition not supported in your browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = location.state?.language === "hindi" ? "hi-IN" : "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
      durationRef.current = 0;
      const interval = setInterval(() => {
        setUserDuration((prev) => prev + 1);
        durationRef.current += 1;
      }, 1000);
      durationRef.current = interval;
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i].transcript;
        if (event.results[i].isFinal) {
          setTranscript((prev) => prev + " " + transcript);
        } else {
          interimTranscript += transcript;
        }
      }
      if (interimTranscript) {
        setTranscript((prev) => {
          const cleanPrev = prev.replace(/ [^.!?]*$/, "");
          return (cleanPrev + " " + interimTranscript).trim();
        });
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (event.error !== "no-speech") {
        setError("Error: " + event.error);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (durationRef.current && typeof durationRef.current === "number") {
        // Duration is just a number, no need to clear
      } else if (durationRef.current) {
        clearInterval(durationRef.current);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [location.state?.language]);

  // Load initial question
  useEffect(() => {
    if (location.state?.initialQuestion) {
      setCurrentQuestion(location.state.initialQuestion);
      setMaxQuestions(location.state.maxQuestions || 10);
      setInterviewStarted(true);
      setConversationHistory([
        {
          type: "ai",
          text: location.state.initialQuestion,
          timestamp: new Date(),
        },
      ]);
      // Auto-speak the first question
      setTimeout(() => {
        speakQuestion(location.state.initialQuestion);
      }, 500);
    }
  }, [location.state, speakQuestion]);

  // Start listening
  const handleStartListening = () => {
    setError("");
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  // Stop listening
  const handleStopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // Submit answer
  const handleSubmitAnswer = async () => {
    if (!transcript.trim()) {
      setError("Please provide an answer");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      
      console.log("🎤 Submitting Answer...");
      console.log("Interview ID:", interviewIdRef.current);
      console.log("Answer Length:", transcript.trim().length);
      console.log("Token exists:", !!token);

      if (!interviewIdRef.current) {
        throw new Error("Interview ID is missing. Please start a new interview.");
      }

      if (!token) {
        throw new Error("Authentication token is missing. Please log in again.");
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/interview/answer`,
        {
          interviewId: interviewIdRef.current,
          answer: transcript.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ API Response Received:", response.data);

      // Store answer
      const newAnswer = {
        questionNumber: questionNumber,
        question: currentQuestion,
        answer: transcript.trim(),
        duration: userDuration,
        timestamp: new Date(),
      };
      const updatedAnswers = [...answers, newAnswer];
      setAnswers(updatedAnswers);

      // Add user response to conversation
      setConversationHistory((prev) => [
        ...prev,
        {
          type: "user",
          text: transcript.trim(),
          timestamp: new Date(),
          duration: userDuration,
        },
      ]);

      if (response.data.interviewComplete) {
        console.log("🏁 Interview Complete!");
        // Add final message and navigate
        navigate("/interview-feedback", {
          state: {
            interviewId: interviewIdRef.current,
            score: response.data.performanceScore,
            feedback: response.data.feedback,
            answers: updatedAnswers,
            totalQuestions: maxQuestions,
          },
        });
      } else {
        console.log("⏭️ Loading next question...");
        
        // Verify next question exists
        if (!response.data.question) {
          throw new Error("Backend did not return next question");
        }

        // Start transition
        setIsTransitioning(true);

        // Add AI's next question
        setConversationHistory((prev) => [
          ...prev,
          {
            type: "ai",
            text: response.data.question,
            timestamp: new Date(),
          },
        ]);

        // Smooth transition: fade out current, then update and fade in
        setTimeout(() => {
          console.log("📝 Updating to question:", response.data.currentQuestionNumber);
          setCurrentQuestion(response.data.question);
          setQuestionNumber(response.data.currentQuestionNumber || questionNumber + 1);
          setTranscript("");
          setUserDuration(0);
          setIsTransitioning(false);

          // Auto-speak the new question
          setTimeout(() => {
            console.log("🔊 Speaking next question...");
            speakQuestion(response.data.question);
          }, 300);
        }, 400);
      }
    } catch (err) {
      console.error("❌ Error:", err.message);
      if (err.response) {
        console.error("Backend Error Response:", err.response.data);
        setError(err.response.data?.error || err.response.data?.message || err.message);
      } else if (err.request) {
        console.error("No response from server");
        setError("No response from server. Please check if backend is running.");
      } else {
        console.error("Error Details:", err);
        setError(err.message);
      }
      setIsTransitioning(false);
    } finally {
      setIsProcessing(false);
    }
  };

  // Repeat question
  const handleRepeatQuestion = () => {
    speakQuestion(currentQuestion);
  };

  const isFinalQuestion = questionNumber >= maxQuestions;

  if (!interviewStarted) {
    return (
      <div className="vi-loading">
        <div className="vi-spinner"></div>
        <p>Loading interview...</p>
      </div>
    );
  }

  return (
    <div className="vi-main-container">
      {/* Top Progress Tracker */}
      <div className="top-progress-tracker">
        <div className="progress-dots">
          {[...Array(maxQuestions)].map((_, i) => (
            <div
              key={i}
              className={`progress-dot ${
                i < questionNumber ? "completed" : i === questionNumber - 1 ? "active" : ""
              }`}
              title={`Question ${i + 1}`}
            />
          ))}
        </div>
        <span className="progress-counter">
          Question {questionNumber} of {maxQuestions}
        </span>
      </div>

      {/* Error Message */}
      {error && <div className="vi-error-alert">{error}</div>}

      {/* Modern Video-Call Style Cards */}
      <div className="cards-wrapper">
        {/* AI Card */}
        <div className={`card ai-card ${isTransitioning ? "fade-out" : "fade-in"}`}>
          {/* Avatar with glow and speaking animation */}
          <div className={`avatar-ring ${aiSpeaking ? "active" : ""}`}>
            <div className={`avatar ai-avatar ${aiSpeaking ? "speaking" : ""}`}>
              <span className="avatar-emoji">💬</span>
            </div>
          </div>

          <h3 className="card-title">AI Interviewer</h3>
          <div className={`status-indicator ${aiSpeaking ? "active" : ""}`}>
            {aiSpeaking ? "🔊 Speaking" : isTransitioning ? "⏳ Loading..." : "✓ Ready"}
          </div>

          {/* Question preview in card */}
          <div className="card-content">
            <p className="question-preview">{currentQuestion.substring(0, 120)}...</p>
          </div>
        </div>

        {/* User Card */}
        <div className={`card user-card ${isTransitioning ? "fade-out" : "fade-in"}`}>
          {/* Avatar with glow and waveform when listening */}
          <div className={`avatar-ring ${isListening ? "active" : ""}`}>
            <div className="avatar user-avatar">
              <span className="avatar-emoji">👤</span>
              
              {/* Waveform inside avatar when listening */}
              {isListening && (
                <div className="waveform">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}></span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <h3 className="card-title">{userName}</h3>
          <div className={`status-indicator ${isListening ? "active" : ""}`}>
            {isListening ? "🎤 Listening" : isTransitioning ? "⏳ Next Q..." : "✓ Ready"}
          </div>

          {/* Transcript preview in card */}
          {transcript && (
            <div className="card-content">
              <p className="transcript-preview">{transcript.substring(0, 120)}...</p>
            </div>
          )}
        </div>
      </div>

      {/* Real-Time Subtitle Box (AI Speaking) */}
      {aiSpeaking && (
        <div className="subtitle-box ai-subtitle">
          <div className="subtitle-label">AI Question:</div>
          <p>{currentQuestion}</p>
        </div>
      )}

      {/* Real-Time Subtitle Box (User Speaking) */}
      {isListening && transcript && (
        <div className="subtitle-box user-subtitle">
          <div className="subtitle-label">Your Response:</div>
          <p>{transcript}</p>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="progress-indicator">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${(questionNumber / maxQuestions) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Bottom Message Bar with Controls */}
      <div className={`message-bar ${isTransitioning ? "transitioning" : ""}`}>
        {isTransitioning ? (
          <div className="message-placeholder">
            <p>✨ Loading next question...</p>
            <div className="loading-spinner"></div>
          </div>
        ) : transcript ? (
          <div className="message-content">
            <div className="current-response">
              <p>{transcript}</p>
              <span className="response-meta">
                ⏱️ {Math.floor(userDuration / 60)}m {userDuration % 60}s | 📝 {transcript.length} chars
              </span>
            </div>

            <div className="message-controls">
              <button
                className="msg-btn clear-btn"
                onClick={() => setTranscript("")}
                disabled={isProcessing || isListening}
                title="Clear response"
              >
                🔄
              </button>
              <button
                className="msg-btn submit-btn"
                onClick={handleSubmitAnswer}
                disabled={isProcessing || isListening || !transcript.trim()}
                data-final={isFinalQuestion ? "true" : "false"}
                title={isFinalQuestion ? "Complete interview" : "Submit answer"}
              >
                {isProcessing ? "⏳" : isFinalQuestion ? "✓ Complete" : "✓ Submit"}
              </button>
            </div>
          </div>
        ) : (
          <div className="message-placeholder">
            {!isListening ? (
              <>
                <p>Click the button below to start speaking your answer</p>
                <button
                  className="msg-btn listening-btn"
                  onClick={handleStartListening}
                  disabled={isProcessing || aiSpeaking}
                  title="Start listening"
                >
                  🎤 Start Speaking
                </button>
              </>
            ) : (
              <>
                <p>🎤 Listening... Speak your answer now</p>
                <button
                  className="msg-btn listening-btn active"
                  onClick={handleStopListening}
                  disabled={isProcessing}
                  title="Stop listening"
                >
                  ⏹️ Stop Speaking
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Repeat & Exit Controls */}
      <div className="bottom-controls">
        <button
          className="control-btn repeat-btn"
          onClick={handleRepeatQuestion}
          disabled={isProcessing || isListening || isTransitioning}
          title="Replay question"
        >
          🔊 Repeat Question
        </button>

        <button
          className="control-btn exit-btn"
          onClick={() => {
            if (
              window.confirm(
                "Are you sure you want to exit the interview? Your progress will be saved."
              )
            ) {
              navigate("/interview-rounds");
            }
          }}
          disabled={isTransitioning}
          title="Exit interview"
        >
          Exit Interview
        </button>
      </div>
    </div>
  );
};

export default VoiceInterview;
