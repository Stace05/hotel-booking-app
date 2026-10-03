import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignInAlt, FaSignOutAlt, FaBuilding, FaSuitcase } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext'; 
import './Header.css'; 

const Header = () => {
  const navigate = useNavigate();
  
  const { user, logout } = useContext(AuthContext); 

  const handleLogout = () => {
    logout();
    navigate('/'); 
  };

  return (
    <header className="header-container">
      <nav className="nav-content">
        
        <div className="nav-left">
          <Link to="/">
            <div className="logo-img" style={{ backgroundColor: '#EAE0CF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
              B
            </div>
          </Link>
          
          <div className="desktop-menu">
            <div className="desktop-menu-links">
              <Link to="/" className="nav-link">Rooms</Link>
              
              {user && (
                <>
                  <Link to="/my-bookings" className="nav-link">Bookings</Link>
                  
                  {user.role === 'admin' && (
                    <Link to="/rooms/add" className="nav-link">Add Room</Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="nav-right">
          {!user ? (
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
              <span className="user-greeting">{user.name}</span>
              
              {user.role === 'admin' && (
                <Link to="/rooms/my" className="auth-link">
                  <FaBuilding className="nav-icon" /> Reports
                </Link>
              )}
              
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