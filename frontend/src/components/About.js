import React from 'react';
import '../styles/About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="hero-content">
          <h1>About Inner Calm</h1>
          <p>Dedicated to your mental wellness journey with professional care and support.</p>
        </div>
      </div>

      <div className="about-content">
        <section className="mission-section">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p>At Inner Calm, we believe in making mental health support accessible, compassionate, and effective. Our mission is to empower individuals to achieve emotional well-being through professional therapy services and a supportive community.</p>
          </div>
          <div className="mission-image">
            <img src="/images/mission.png" alt="Our Mission" />
          </div>
        </section>

        <section className="values-section">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <i className="fas fa-heart"></i>
              <h3>Compassion</h3>
              <p>We approach every individual with empathy and understanding, creating a safe space for healing and growth.</p>
            </div>
            <div className="value-card">
              <i className="fas fa-shield-alt"></i>
              <h3>Trust</h3>
              <p>We maintain the highest standards of confidentiality and professional ethics in all our services.</p>
            </div>
            <div className="value-card">
              <i className="fas fa-users"></i>
              <h3>Community</h3>
              <p>We foster a supportive environment where individuals can connect and grow together.</p>
            </div>
            <div className="value-card">
              <i className="fas fa-graduation-cap"></i>
              <h3>Excellence</h3>
              <p>Our therapists are highly qualified and committed to providing the best possible care.</p>
            </div>
          </div>
        </section>

        <section className="team-section">
          <h2>Our Expert Team</h2>
          <div className="team-grid">
            <div className="team-card">
              <img src="/images/therapist1.jpeg" alt="Dr. Sarah Johnson" />
              <h3>Dr. Sarah Johnson</h3>
              <p className="role">Clinical Director</p>
              <p className="bio">With over 15 years of experience in clinical psychology, Dr. Johnson leads our team with expertise and compassion.</p>
            </div>
            <div className="team-card">
              <img src="/images/therapist2.jpeg" alt="Michael Chen" />
              <h3>Michael Chen</h3>
              <p className="role">Senior Therapist</p>
              <p className="bio">Specializing in cognitive behavioral therapy, Michael brings innovative approaches to mental health care.</p>
            </div>
            <div className="team-card">
              <img src="/images/therapist3.jpg" alt="Dr. Emily Rodriguez" />
              <h3>Dr. Emily Rodriguez</h3>
              <p className="role">Family Therapist</p>
              <p className="bio">Dr. Rodriguez is dedicated to helping families build stronger, healthier relationships.</p>
            </div>
          </div>
        </section>

        <section className="approach-section">
          <h2>Our Approach</h2>
          <div className="approach-grid">
            <div className="approach-card">
              <i className="fas fa-user-check"></i>
              <h3>Personalized Care</h3>
              <p>We tailor our therapy approaches to meet your unique needs and goals.</p>
            </div>
            <div className="approach-card">
              <i className="fas fa-brain"></i>
              <h3>Evidence-Based</h3>
              <p>Our methods are grounded in scientific research and proven therapeutic techniques.</p>
            </div>
            <div className="approach-card">
              <i className="fas fa-hands-helping"></i>
              <h3>Holistic Support</h3>
              <p>We address all aspects of your well-being, from emotional to social needs.</p>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>1000+</h3>
              <p>Clients Helped</p>
            </div>
            <div className="stat-card">
              <h3>15+</h3>
              <p>Years Experience</p>
            </div>
            <div className="stat-card">
              <h3>98%</h3>
              <p>Client Satisfaction</p>
            </div>
            <div className="stat-card">
              <h3>20+</h3>
              <p>Expert Therapists</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About; 