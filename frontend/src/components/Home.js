import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Your Mental Wellness Journey Starts Here</h1>
          <p>Professional virtual mental health support, available 24/7</p>
          <Link to="/services" className="cta-button" onClick={scrollToTop}>Explore Our Services</Link>
        </div>
      </section>

      <section className="features">
        <h2>Our Virtual Services</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Group Therapy</h3>
            <p>Connect with others in a supportive virtual environment. Share experiences and learn from peers.</p>
            <Link to="/services#services-section" className="feature-link" onClick={scrollToTop}>Learn More</Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👤</div>
            <h3>Individual Therapy</h3>
            <p>One-on-one virtual sessions with licensed therapists, tailored to your specific needs.</p>
            <Link to="/services#services-section" className="feature-link" onClick={scrollToTop}>Learn More</Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Mental Health Assistant</h3>
            <p>24/7 support through our advanced AI chatbot. Available for text and voice interaction.</p>
            <Link to="/services#services-section" className="feature-link" onClick={scrollToTop}>Try Now</Link>
          </div>
        </div>
      </section>

      <section className="why-choose-us">
        <h2>Why Choose Virtual Therapy?</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <h3>Accessible Anywhere</h3>
            <p>Get support from the comfort of your home, anywhere in the world.</p>
          </div>
          <div className="benefit-card">
            <h3>Flexible Scheduling</h3>
            <p>Book sessions that fit your schedule, including evenings and weekends.</p>
          </div>
          <div className="benefit-card">
            <h3>Privacy & Comfort</h3>
            <p>Receive support in a private, comfortable environment of your choice.</p>
          </div>
          <div className="benefit-card">
            <h3>24/7 Support</h3>
            <p>Access our AI assistant anytime for immediate support and guidance.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Start Your Journey?</h2>
        <p>Take the first step towards better mental health today.</p>
        <div className="cta-buttons">
          <Link to="/services#services-section" className="cta-button primary" onClick={scrollToTop}>Book a Session</Link>
          <Link to="/services#services-section" className="cta-button secondary" onClick={scrollToTop}>Learn More</Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 