import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignInAlt, FaSignOutAlt, FaBuilding } from 'react-icons/fa';
import './Header.css'; 

const Header = () => {
  const navigate = useNavigate();

  const isAuthenticated = false; 

  const handleLogout = () => {
    console.log('Кнопка виходу натиснута');
  };

  return (
    <header className="header-container">
      <nav className="nav-content">
        
        <div className="nav-left">
          <Link to="/">
            <div className="logo-img" style={{ backgroundColor: '#36ADA3', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
              B
            </div>
          </Link>
          
          <div className="desktop-menu">
            <div className="desktop-menu-links">
              <Link to="/" className="nav-link">Rooms</Link>
              
              {isAuthenticated && (
                <>
                  <Link to="/bookings" className="nav-link">Bookings</Link>
                  <Link to="/rooms/add" className="nav-link">Add Room</Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="nav-right">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="auth-link">
                <FaSignInAlt className="nav-icon" /> Login
              </Link>
              <Link to="/register" className="auth-link">
                <FaUser className="nav-icon" /> Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/rooms/my" className="auth-link">
                <FaBuilding className="nav-icon" /> My Rooms
              </Link>
              <button onClick={handleLogout} className="auth-link auth-button">
                <FaSignOutAlt className="nav-icon" /> Sign Out
              </button>
            </>
          )}
        </div>

      </nav>
    </header>
  );
};

export default Header;