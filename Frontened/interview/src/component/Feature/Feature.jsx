import React from 'react'
import './Feature.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom"; 

const Feature = () => {
  return (
    <div>
      <section className="features-section">
        <div className="features-header" >
          <h2>Complete Interview Experience</h2>
          <p>
            Practice all aspects of technical interviews with AI-powered feedback
          </p>
        </div>

        <div className="features-cards">
         
          <Link to="/hr-round" className="feature-card hr">
            <div className="icon">👤</div>
            <h3>HR Round</h3>
            <p>
              Behavioral questions with voice/text responses. AI evaluates fluency, 
              confidence, and sentiment with real-time feedback.
            </p>
            <ul>
              <li> <FontAwesomeIcon icon={faCheck} /> Speech-to-Text Recognition</li>
              <li> <FontAwesomeIcon icon={faCheck} /> Confidence Scoring</li>
              <li> <FontAwesomeIcon icon={faCheck} /> AI Voice Interviewer</li>
            </ul>
          </Link>

          {/* Technical Round */}
          <Link to="/technical-round" className="feature-card tech">
            <div className="icon">💻</div>
            <h3>Technical Round</h3>
            <p>
              MCQs, coding challenges, and conceptual questions across DSA, DBMS, 
              OS, CN, and OOPS with live code execution.
            </p>
            <ul>
              <li><FontAwesomeIcon icon={faCheck} /> Monaco Code Editor</li>
              <li><FontAwesomeIcon icon={faCheck} /> Real-time Execution</li>
              <li><FontAwesomeIcon icon={faCheck} /> AI Code Review</li>
            </ul>
          </Link>

          {/* Group Discussion */}
         <Link to="/aptitude" className="feature-card aptitude">
  <div className="icon">🧠</div>
  <h3>Aptitude Round</h3>
  <p>
    Test your logical reasoning, numerical ability, and problem-solving 
    skills with 10 carefully crafted questions.
  </p>
  <ul>
    <li><FontAwesomeIcon icon={faCheck} /> 10 Multiple Choice Questions</li>
    <li><FontAwesomeIcon icon={faCheck} /> 10 Minutes Time Limit</li>
    <li><FontAwesomeIcon icon={faCheck} /> Instant Results & Analysis</li>
    <li><FontAwesomeIcon icon={faCheck} /> Progress Tracking</li>
  </ul>
</Link>
        </div>
      </section>
    </div>
  )
}

export default Feature
