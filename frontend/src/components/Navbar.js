/**
 * Navbar Component
 */

import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Navbar.css';

function Navbar() {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>💰 Expense Tracker</h2>
        </div>

        {isAuthenticated ? (
          <div className="navbar-menu">
            <span className="navbar-user">Welcome, {user?.name || 'User'}</span>
            <button className="navbar-btn logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="navbar-menu">
            <button className="navbar-btn" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="navbar-btn signup-btn" onClick={() => navigate('/signup')}>
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
