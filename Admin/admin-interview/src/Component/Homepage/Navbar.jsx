import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUser } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

const Navbar = () => {
  return (
    <div className="navbar">
     
      <div className="navbar-left">
        <FontAwesomeIcon icon={faUserPlus} className="navbar-icon" />
        <div className="navbar-logo">
          <h2>Interview Prep Admin</h2>
          <p>Manage your platform content and users</p>
        </div>
      </div>

      <div className="navbar-right">
        <div className="admin-user">
          <FontAwesomeIcon icon={faUser} className="admin-user-icon" />
          <span>Admin User</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
