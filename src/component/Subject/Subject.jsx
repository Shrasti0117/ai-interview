import React from 'react'
import './subject.css'
import { FaDatabase, FaCode, FaGlobe } from "react-icons/fa";
import { MdOutlineComputer } from "react-icons/md";
import { HiOutlineServer } from "react-icons/hi";

const subjects = [
  { icon: <FaCode />, title: "Data Structures & Algorithms", color: "#e0edff", iconColor: "#2563eb" },
  { icon: <FaDatabase />, title: "Database Management", color: "#e6f7ec", iconColor: "#22c55e" },
  { icon: <MdOutlineComputer />, title: "Operating Systems", color: "#f1eaff", iconColor: "#7c3aed" },
  { icon: <HiOutlineServer />, title: "Software Engineering", color: "#f9f9f9", iconColor: "#333" },
  { icon: <FaGlobe />, title: "Web Development", color: "#f9f9f9", iconColor: "#333" },
];


const Subject = () => {
  return (
   <div className="subjects-section">
      <h2>Engineering Subjects</h2>
      <p>Master interviews across all core engineering disciplines</p>

      <div className="subjects-grid">
        {subjects.map((subject, index) => (
          <div
            key={index}
            className="subject-card"
            style={{ backgroundColor: subject.color }}
          >
            <div className="icon" style={{ color: subject.iconColor }}>
              {subject.icon}
            </div>
            <p>{subject.title}</p>
          </div>
        ))}
      </div>

      <div className="cta-section">
        <h3>Ready to Ace Your Interview?</h3>
        <p>Join thousands of engineering students who have improved their interview skills</p>
        <button>Start Your Journey</button>
      </div>
    </div>
  )
}

export default Subject
