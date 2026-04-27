import React, { useEffect, useMemo, useState } from 'react'
import './navbar.css'
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePanel, setActivePanel] = useState("profile");
  const [profileData, setProfileData] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("appTheme") || "light");

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("http://localhost:5001/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) return;

        const data = await response.json();
        setProfileData(data);
      } catch {
        // Silently fallback to local user if profile endpoint fails.
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const resolvedTheme = theme === "system"
      ? (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : theme;

    root.setAttribute("data-theme", resolvedTheme);
    localStorage.setItem("appTheme", theme);

    const mediaQuery = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
    const handleSystemThemeChange = () => {
      if (theme === "system") {
        const nextTheme = mediaQuery && mediaQuery.matches ? "dark" : "light";
        root.setAttribute("data-theme", nextTheme);
      }
    };

    if (mediaQuery) {
      mediaQuery.addEventListener?.("change", handleSystemThemeChange);
    }

    return () => {
      if (mediaQuery) {
        mediaQuery.removeEventListener?.("change", handleSystemThemeChange);
      }
    };
  }, [theme]);

  useEffect(() => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  const mergedUser = profileData || user || null;
  const displayName = mergedUser?.name || "User";
  const displayEmail = mergedUser?.email || "No email found";
  const accountStatus = mergedUser ? "Active" : "Guest";
  const profileImage =
    mergedUser?.photo ||
    mergedUser?.avatar ||
    mergedUser?.profileImage ||
    mergedUser?.imageUrl ||
    "";

  const userInitial = (displayName || "U").trim().charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("sessionId");
    alert("Logout successful");
    navigate("/login", { replace: true });
  };

  const themeOptions = [
    { key: "light", label: "Light", icon: "☀️" },
    { key: "dark", label: "Dark", icon: "🌙" },
    { key: "system", label: "System", icon: "🖥️" },
  ];
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
          <li><Link to="/test">Test</Link></li>
        </ul>

        <button
          className="profile-icon-btn"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open profile menu"
          title="Profile"
        >
          {userInitial}
        </button>
      </nav>

      {isSidebarOpen && <div className="profile-sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`profile-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="profile-sidebar-header">
          <div className="profile-sidebar-heading">
            <h3>Account</h3>
            <p>Manage your profile and preferences</p>
          </div>
          <button
            className="close-sidebar-btn"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close profile menu"
          >
            x
          </button>
        </div>

        <div className="profile-sidebar-nav">
          <button
            className={`profile-menu-btn ${activePanel === "profile" ? "active" : ""}`}
            onClick={() => setActivePanel("profile")}
          >
            Profile
          </button>
          <button
            className={`profile-menu-btn ${activePanel === "settings" ? "active" : ""}`}
            onClick={() => setActivePanel("settings")}
          >
            Settings
          </button>
        </div>

        <div className="profile-sidebar-user">
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="profile-avatar-image" />
          ) : (
            <div className="profile-avatar-large">{userInitial}</div>
          )}

          <div className="profile-summary-chip">
            <span className="profile-status-dot" />
            <span>{accountStatus}</span>
          </div>

          {activePanel === "profile" ? (
            <>
              <p className="profile-name">{displayName}</p>
              <p className="profile-email">{displayEmail}</p>

              <div className="profile-quick-info">
                <div className="profile-quick-item">
                  <span className="profile-quick-label">Role</span>
                  <span className="profile-quick-value">Candidate</span>
                </div>
                <div className="profile-quick-item">
                  <span className="profile-quick-label">Theme</span>
                  <span className="profile-quick-value">{theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="settings-list">
              <p className="settings-title">Settings</p>
              <div className="settings-item">
                <span className="settings-key">Notifications</span>
                <span className="settings-value">Enabled</span>
              </div>
              <div className="settings-item">
                <span className="settings-key">Language</span>
                <span className="settings-value">English</span>
              </div>
              <div className="settings-item">
                <span className="settings-key">Account</span>
                <span className="settings-value settings-value-success">{accountStatus}</span>
              </div>

              <div className="theme-section">
                <div className="theme-section-header">
                  <span className="theme-section-title">Theme</span>
                  <span className="theme-section-value">{theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
                </div>

                <div className="theme-options">
                  {themeOptions.map((option) => (
                    <button
                      key={option.key}
                      className={`theme-option-btn ${theme === option.key ? "active" : ""}`}
                      onClick={() => setTheme(option.key)}
                    >
                      <span className="theme-option-icon">{option.icon}</span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <button className='login_btn sidebar-logout-btn' onClick={handleLogout}>Logout</button>
      </aside>
      </div>
  )
}

export default Navbar
