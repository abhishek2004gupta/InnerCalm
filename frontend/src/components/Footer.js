import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Inner Calm</h3>
          <p>Your journey to mental wellness starts here. We provide professional therapy services to help you achieve inner peace and personal growth.</p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <img src="/images/facebook.jpeg" alt="Facebook" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <img src="/images/twitter.png" alt="Twitter" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <img src="/images/instagram.jpg" alt="Instagram" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <img src="/images/linkedin.png" alt="LinkedIn" />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/policies">Policies</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Our Services</h3>
          <ul className="footer-links">
            <li><Link to="/services/individual">Individual Therapy</Link></li>
            <li><Link to="/services/group">Group Therapy</Link></li>
            <li><Link to="/services/couples">Couples Therapy</Link></li>
            <li><Link to="/services/family">Family Therapy</Link></li>
            <li><Link to="/chatbot">AI Mental Health Assistant</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Info</h3>
          <ul className="footer-links contact-info">
            <li>
              <i className="fas fa-map-marker-alt"></i>
              <span>123 Therapy Street, Mental Health District, City, State 12345</span>
            </li>
            <li>
              <i className="fas fa-phone"></i>
              <span>(555) 123-4567</span>
            </li>
            <li>
              <i className="fas fa-envelope"></i>
              <span>info@innercalm.com</span>
            </li>
            <li>
              <i className="fas fa-clock"></i>
              <span>Mon-Fri: 9AM-6PM</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Inner Calm. All rights reserved.</p>
        <div className="footer-bottom-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/accessibility">Accessibility</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 