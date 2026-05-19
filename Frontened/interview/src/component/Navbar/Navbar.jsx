import React from 'react'
import './navbar.css'
import { Link } from "react-router-dom";
import ProfileSidebar from '../ProfileSidebar/ProfileSidebar';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`home-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <nav className={`navbar ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="logo-section">
          <img src="/logo.png" alt="InterviewAce Logo" className="logo" />
          <h1 className="brand-name">InterviewAce</h1>
        </div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/subjects">Subjects</Link></li>
          <li><Link to="/progress">Progress</Link></li>
          <li><Link to="/interview-rounds">Interview Rounds</Link></li>
          <li><Link to="/test">Test</Link></li>
        </ul>
        <ProfileSidebar />
      </nav>
    </div>
  )
}

export default Navbar
