import { useState } from "react";
import './HRround'


export default function HRRound() {
  const [question, setQuestion] = useState("Tell me about yourself.");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);

  // 🎤 Speech-to-Text
  const startListening = () => {
    const recognition = new window.webkitSpeechRecognition(); // For Chrome
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setAnswer(transcript);
      generateFeedback(transcript);
    };

    recognition.start();
  };

  // 🔊 Text-to-Speech (AI interviewer speaks question)
  const speakQuestion = () => {
    const speech = new SpeechSynthesisUtterance(question);
    speech.lang = "en-US";
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
  };

  // Dummy AI feedback (later connect with AI API)
  const generateFeedback = (text) => {
    setFeedback({
      fluency: "Good",
      clarity: "Moderate",
      confidence: Math.floor(Math.random() * 100), // random score
      sentiment: text.includes("confident") ? "Positive" : "Neutral"
    });
  };

  return (
    <div className="hr-container">
      <h1>🤖 HR Round - Soft Skills Evaluation</h1>
      <div className="question-box">
        <h2>AI Interviewer asks:</h2>
        <p>{question}</p>
        <button onClick={speakQuestion}>🔊 Play Question</button>
      </div>

      <div className="answer-section">
        <h3>Your Answer:</h3>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Speak or type your answer here..."
        ></textarea>
        <div className="actions">
          <button onClick={startListening}>🎤 Speak Answer</button>
          <button onClick={() => generateFeedback(answer)}>Submit</button>
        </div>
      </div>

      {feedback && (
        <div className="feedback-box">
          <h3>AI Feedback:</h3>
          <p><strong>Fluency:</strong> {feedback.fluency}</p>
          <p><strong>Clarity:</strong> {feedback.clarity}</p>
          <p><strong>Confidence Score:</strong> {feedback.confidence}%</p>
          <p><strong>Sentiment:</strong> {feedback.sentiment}</p>
        </div>
      )}
    </div>
  );
}


