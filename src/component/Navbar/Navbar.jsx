import React from 'react'
import './navbar.css'
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
       <div className="home-container">
         
      <nav className="navbar">
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
        </ul>
      <button className='login_btn'><Link to="/Login">Login</Link></button>
      </nav>
      </div>
  )
}

export default Navbar
