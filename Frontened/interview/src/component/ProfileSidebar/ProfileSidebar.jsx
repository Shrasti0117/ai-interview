import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import './ProfileSidebar.css';

const ProfileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  
  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.name || user.email?.split('@')[0] || 'User';
  const userEmail = user.email || 'user@example.com';
  const userInitial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.clear();
    alert('Logout successful');
    navigate('/login', { replace: true });
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="profile-container" ref={sidebarRef}>
      {/* Profile Toggle Button */}
      <button 
        className="profile-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Toggle profile menu"
      >
        <div className="profile-avatar">{userInitial}</div>
      </button>

      {/* Sidebar */}
      {isOpen && (
        <div className={`profile-sidebar ${isDarkMode ? 'dark-mode' : ''}`}>
          {/* User Info Section */}
          <div className="sidebar-header">
            <div className="user-info">
              <div className="large-avatar">{userInitial}</div>
              <div className="user-details">
                <h3 className="user-name">{userName}</h3>
                <p className="user-email">{userEmail}</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="sidebar-divider"></div>

          {/* Menu Items */}
          <div className="sidebar-menu">
            <button
              className="menu-item"
              onClick={() => handleNavigation('/')}
            >
              <span className="menu-icon">🏠</span>
              <span className="menu-text">Home</span>
            </button>

            <button
              className="menu-item"
              onClick={() => handleNavigation('/dashboard')}
            >
              <span className="menu-icon">📊</span>
              <span className="menu-text">Dashboard</span>
            </button>

            <button
              className="menu-item"
              onClick={() => handleNavigation('/subjects')}
            >
              <span className="menu-icon">📚</span>
              <span className="menu-text">Subjects</span>
            </button>

            <button
              className="menu-item"
              onClick={() => handleNavigation('/progress')}
            >
              <span className="menu-icon">📈</span>
              <span className="menu-text">Progress</span>
            </button>

            <button
              className="menu-item"
              onClick={() => handleNavigation('/interview-rounds')}
            >
              <span className="menu-icon">🎯</span>
              <span className="menu-text">Interview Rounds</span>
            </button>

            <button
              className="menu-item"
              onClick={() => handleNavigation('/test')}
            >
              <span className="menu-icon">✍️</span>
              <span className="menu-text">Test</span>
            </button>
          </div>

          {/* Divider */}
          <div className="sidebar-divider"></div>

          {/* Settings Section */}
          <div className="sidebar-settings">
            <button
              className="menu-item theme-toggle"
              onClick={toggleTheme}
            >
              <span className="menu-icon">
                {isDarkMode ? '🌙' : '☀️'}
              </span>
              <span className="menu-text">
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="sidebar-divider"></div>

          {/* Logout Button */}
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <span className="menu-icon">🚪</span>
            <span className="menu-text">Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileSidebar;
