import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faBook, faCalendarAlt, faChartBar, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import "./Siderbar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/admin/users" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>
            <FontAwesomeIcon icon={faUsers} className="sidebar-icon" />
            <div className="sidebar-text">
              <h4>User Management</h4>
              <p>Manage users and their progress</p>
            </div>
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/content" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>
            <FontAwesomeIcon icon={faBook} className="sidebar-icon" />
            <div className="sidebar-text">
              <h4>Content Management</h4>
              <p>Manage subjects and questions</p>
            </div>
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/planner" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>
            <FontAwesomeIcon icon={faCalendarAlt} className="sidebar-icon" />
            <div className="sidebar-text">
              <h4>Planner Control</h4>
              <p>Control daily tasks and planning</p>
            </div>
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/analytics" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>
            <FontAwesomeIcon icon={faChartBar} className="sidebar-icon" />
            <div className="sidebar-text">
              <h4>Analytics</h4>
              <p>View performance metrics</p>
            </div>
          </NavLink>
        </li>

        <li className="logout-li">
          <button onClick={handleLogout} className="sidebar-item logout-btn">
            <FontAwesomeIcon icon={faSignOutAlt} className="sidebar-icon" />
            <div className="sidebar-text">
              <h4>Logout</h4>
              <p>Sign out of admin session</p>
            </div>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;


