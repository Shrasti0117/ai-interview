import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InterviewSetup from "./InterviewSetup";

const API_BASE_URL = "http://localhost:5001";

const Hrroundpage1 = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleStartInterview = async ({ lang, mode, resumeFile }) => {
    setError("");
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const formData = new FormData();
      if (resumeFile) {
        formData.append("resume", resumeFile);
      }
      formData.append("language", lang === "en" ? "english" : "hindi");
      formData.append("mode", mode);
      
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
    }
  };

  return (
    <div>
      {error && (
        <div style={{ 
          maxWidth: "800px", 
          margin: "20px auto 0", 
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
      <InterviewSetup onStart={handleStartInterview} />
    </div>
  );
};

export default Hrroundpage1;