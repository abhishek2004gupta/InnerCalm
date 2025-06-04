import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout, getCurrentUser } from '../services/authService';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
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
    checkAuth();
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    setIsLoggedIn(false);
    setUser(null);
    navigate('/login');
  };

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
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="navbar-brand">
        Inner Calm
      </Link>
      <button className="mobile-menu-btn" onClick={toggleMenu}>
        <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
        <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
        <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
      </button>
      <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}> 
        <Link 
          to="/" 
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          onClick={closeMenu}
        >
          Home
        </Link>
        <Link 
          to="/about" 
          className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
          onClick={closeMenu}
        >
          About Us
        </Link>
        <Link 
          to="/services" 
          className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`}
          onClick={closeMenu}
        >
          Services
        </Link>
        <Link 
          to="/contact" 
          className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
          onClick={closeMenu}
        >
          Contact
        </Link>
        {isLoggedIn ? (
          <div className="profile-section">
            <button 
              className="profile-button styled-profile-btn"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <span className="profile-avatar">{user?.firstName?.[0] || 'P'}</span>
              <span className="profile-name-navbar">{user?.firstName || 'Profile'}</span>
              <span className="profile-caret">▼</span>
            </button>
            {showProfileMenu && (
              <div className="profile-menu">
                <div className="profile-menu-header">
                  <span className="profile-name">{user?.firstName} {user?.lastName}</span>
                  <span className="profile-email">{user?.email}</span>
                </div>
                <Link to="/profile" className="profile-menu-item" onClick={closeMenu}>View Profile</Link>
                <Link to="/profile/edit" className="profile-menu-item" onClick={closeMenu}>Edit Profile</Link>
                <button 
                  className="profile-menu-item logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="nav-link login-register-btn" onClick={closeMenu}>
            Login / Register
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 