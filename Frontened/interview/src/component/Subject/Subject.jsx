import React from 'react'
import './subject.css'
import { FaDatabase, FaCode, FaGlobe, FaPlus, FaProjectDiagram, FaLayerGroup, FaPython, FaBrain, FaCogs, FaCalculator, FaSitemap } from "react-icons/fa";
import { MdOutlineComputer, MdSchema } from "react-icons/md";
import { HiOutlineServer } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';

const subjects = [
  { id: "DSA", icon: <FaCode />, title: "Data Structures & Algorithms", color: "#e0edff", iconColor: "#2563eb" },
  { id: "DBMS", icon: <FaDatabase />, title: "Database Management Systems", color: "#e6f7ec", iconColor: "#22c55e" },
  { id: "OS", icon: <MdOutlineComputer />, title: "Operating Systems", color: "#f1eaff", iconColor: "#7c3aed" },
  { id: "CN", icon: <FaSitemap />, title: "Computer Networks", color: "#fff1f1", iconColor: "#dc2626" },
  { id: "SE", icon: <HiOutlineServer />, title: "Software Engineering", color: "#f0f9ff", iconColor: "#0284c7" },
  { id: "SD", icon: <FaProjectDiagram />, title: "System Design", color: "#fffbeb", iconColor: "#d97706" },
  { id: "OOPS", icon: <FaLayerGroup />, title: "Object-Oriented Programming", color: "#faf5ff", iconColor: "#7c3aed" },
  { id: "WebDev", icon: <FaGlobe />, title: "Web Development", color: "#eff6ff", iconColor: "#2563eb" },
  { id: "MERN", icon: <MdSchema />, title: "Full Stack Development (MERN)", color: "#f0fdf4", iconColor: "#16a34a" },
  { id: "Python", icon: <FaPython />, title: "Python Programming", color: "#fffbeb", iconColor: "#d97706" },
  { id: "DataScience", icon: <FaBrain />, title: "Data Science", color: "#fdf2f8", iconColor: "#db2777" },
  { id: "Compiler", icon: <FaCogs />, title: "Compiler Design", color: "#f0fdf4", iconColor: "#16a34a" },
  { id: "TOC", icon: <FaCalculator />, title: "Theory of Computation", color: "#faf5ff", iconColor: "#7c3aed" },
];

const Subject = () => {
  const navigate = useNavigate();

  return (
    <div className="subjects-section">
      <h2>Engineering Subjects</h2>
      <p>Master interviews across all core engineering disciplines</p>

      <div className="subjects-grid">
        {subjects.map((subject, index) => (
          <div
            key={index}
            className="subject-card"
            style={{ backgroundColor: subject.color, cursor: 'pointer' }}
            onClick={() => navigate(`/subjects?subject=${encodeURIComponent(subject.id)}`)}
          >
            <div className="icon" style={{ color: subject.iconColor }}>
              {subject.icon}
            </div>
            <p>{subject.title}</p>
          </div>
        ))}

        {/* More Subjects Card */}
        <div
          className="subject-card more-card"
          onClick={() => navigate('/subjects')}
          style={{ cursor: 'pointer' }}
        >
          <div className="icon">
            <FaPlus />
          </div>
          <p>More Subjects</p>
        </div>
      </div>
    </div>
  )
}

export default Subject
