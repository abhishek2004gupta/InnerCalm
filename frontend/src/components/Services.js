import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Services.css';

const Services = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="services">
      <section className="services-hero">
        <div className="hero-content">
          <h1>Our Virtual Services</h1>
          <p>Professional mental health support, available anytime, anywhere</p>
        </div>
      </section>

      <section className="services-content">
        <div id="services-section" className="services-grid">
          <div className="service-card">
            <div className="service-icon">👥</div>
            <h2>Group Therapy</h2>
            <p>Join our virtual group therapy sessions where you can connect with others who understand your journey. Our experienced therapists facilitate safe and supportive group discussions.</p>
            <ul className="service-features">
              <li>Weekly virtual group sessions</li>
              <li>Small, intimate groups (6-8 participants)</li>
              <li>Topic-focused discussions</li>
              <li>Peer support and shared experiences</li>
              <li>Flexible scheduling options</li>
            </ul>
            <button className="service-btn" onClick={() => handleNavigation('/services/group')}>Join a Group</button>
          </div>

          <div className="service-card">
            <div className="service-icon">👤</div>
            <h2>Individual Therapy</h2>
            <p>One-on-one virtual sessions with licensed therapists, tailored to your specific needs and goals. Get personalized attention and guidance in a private, secure environment.</p>
            <ul className="service-features">
              <li>Personalized treatment plans</li>
              <li>Flexible scheduling</li>
              <li>Secure video sessions</li>
              <li>Progress tracking</li>
              <li>Emergency support available</li>
            </ul>
            <button className="service-btn" onClick={() => handleNavigation('/services/individual')}>Book a Session</button>
          </div>

          <div className="service-card">
            <div className="service-icon">💑</div>
            <h2>Couples Therapy</h2>
            <p>Strengthen your relationship through guided virtual sessions designed for couples. Work together to improve communication and build a stronger bond.</p>
            <ul className="service-features">
              <li>Joint virtual sessions</li>
              <li>Relationship-focused guidance</li>
              <li>Communication improvement</li>
              <li>Conflict resolution strategies</li>
              <li>Flexible scheduling for couples</li>
            </ul>
            <button className="service-btn" onClick={() => handleNavigation('/services/couples')}>Start Together</button>
          </div>

          <div className="service-card">
            <div className="service-icon">👨‍👩‍👧‍👦</div>
            <h2>Family Therapy</h2>
            <p>Address family dynamics and improve relationships through virtual family therapy sessions. Our therapists help families work together towards better understanding and harmony.</p>
            <ul className="service-features">
              <li>Family-focused sessions</li>
              <li>Multiple family members</li>
              <li>Dynamics improvement</li>
              <li>Conflict resolution</li>
              <li>Flexible family scheduling</li>
            </ul>
            <button className="service-btn" onClick={() => handleNavigation('/services/family')}>Family Support</button>
          </div>

          <div className="service-card">
            <div className="service-icon">🤖</div>
            <h2>AI Mental Health Assistant</h2>
            <p>Our advanced AI chatbot provides 24/7 support, offering immediate responses to your concerns through text or voice interaction.</p>
            <ul className="service-features">
              <li>24/7 availability</li>
              <li>Voice and text interaction</li>
              <li>Non-judgmental support</li>
              <li>Personalized responses</li>
              <li>Emergency resource connection</li>
            </ul>
            <button className="service-btn" onClick={() => handleNavigation('/chatbot')}>Chat Now</button>
          </div>
        </div>

        <div className="services-info">
          <h2>Why Choose Virtual Therapy?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <h3>Convenience</h3>
              <p>Access therapy from anywhere, at any time that suits your schedule.</p>
            </div>
            <div className="benefit-card">
              <h3>Privacy</h3>
              <p>Receive support in the comfort and privacy of your own space.</p>
            </div>
            <div className="benefit-card">
              <h3>Accessibility</h3>
              <p>No travel required, making mental health support more accessible.</p>
            </div>
            <div className="benefit-card">
              <h3>Flexibility</h3>
              <p>Choose between group sessions, individual therapy, or AI support.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services; 