import React from 'react'
import './footer.css'

import { FaGraduationCap } from "react-icons/fa";


const Footer = () => {
  return (
    <div className="footer-section">
   
      <div className="cta-footer">
        <h2>Ready to Ace Your Interview?</h2>
        <p>Join thousands of engineering students who have improved their interview skills</p>
        <button>Start Your Journey</button>
      </div>

      <div className="footer-content">
        <div className="footer-column">
          <div className="logo">
            <FaGraduationCap className="logo-icon" />
            <span>InterviewAce</span>
          </div>
          <p>Prepare for engineering interviews with AI-powered practice sessions.</p>
        </div>

        <div className="footer-column">
          <h4>Features</h4>
          <ul>
            <li>HR Interviews</li>
            <li>Technical Assessment</li>
            <li>Group Discussions</li>
            <li>Progress Tracking</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Subjects</h4>
          <ul>
            <li>Data Structures</li>
            <li>Algorithms</li>
            <li>System Design</li>
            <li>Databases</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Support</h4>
          <ul>
            <li>Help Center</li>
            <li>Contact Us</li>
            <li>Documentation</li>
            <li>Community</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 InterviewAce. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Footer
