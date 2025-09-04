import React from 'react'
import './Feature.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom"; 

const Feature = () => {
  return (
    <div>
      <section className="features-section">
        <div className="features-header">
          <h2>Complete Interview Experience</h2>
          <p>
            Practice all aspects of technical interviews with AI-powered feedback
          </p>
        </div>

        <div className="features-cards">
          {/* HR Round */}
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
          <Link to="/group-discussion" className="feature-card gd">
            <div className="icon">👥</div>
            <h3>Group Discussion</h3>
            <p>
              Simulate GD scenarios with AI participants. Practice leadership, 
              participation, and communication skills.
            </p>
            <ul>
              <li><FontAwesomeIcon icon={faCheck} /> AI Participants</li>
              <li><FontAwesomeIcon icon={faCheck} /> Leadership Scoring</li>
              <li><FontAwesomeIcon icon={faCheck} /> Participation Analysis</li>
            </ul>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Feature
