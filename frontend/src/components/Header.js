import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout, getCurrentUser } from '../services/authService';
import '../styles/Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = isAuthenticated();
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        setUser(getCurrentUser());
      } else {
        setUser(null);
      }
    };

    // Check auth state on mount
    checkAuth();

    // Check auth state every second
    const interval = setInterval(checkAuth, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    setIsLoggedIn(false);
    setUser(null);
    navigate('/login');
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-section')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🧠</span>
          <span className="logo-text">Inner Calm</span>
        </Link>
        {isLoggedIn && user && (
          <div className="header-coins-bar">
            <img src="/images/coin.png" alt="Coins" className="coin-logo" />
            <span className="coin-count">{user.coins}</span>
          </div>
        )}

        <button 
          className={`mobile-menu-btn ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          {isLoggedIn ? (
            <>
              <Link to="/chatbot" className="nav-link">Chat</Link>
              <Link to="/chat-summary" className="nav-link">Summaries</Link>
              <div className="profile-section">
                <button 
                  className="profile-button"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  {user?.firstName || 'Profile'}
                </button>
                {showProfileMenu && (
                  <div className="profile-menu">
                    <div className="profile-menu-header">
                      <span className="profile-name">{user?.firstName} {user?.lastName}</span>
                      <span className="profile-email">{user?.email}</span>
                    </div>
                    <Link to="/profile" className="profile-menu-item">View Profile</Link>
                    <Link to="/profile/edit" className="profile-menu-item">Edit Profile</Link>
                    <button 
                      className="profile-menu-item logout"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header; 