import React, { useState } from 'react';
import '../styles/IndividualTherapy.css';

const IndividualTherapy = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    occupation: '',
    preferredTime: '',
    mainConcerns: '',
    goals: '',
    emergencyContact: '',
    insuranceInfo: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="individual-therapy">
      <div className="therapy-hero">
        <div className="hero-content">
          <h1>Individual Therapy</h1>
          <p>Personalized one-on-one sessions tailored to your unique needs and goals.</p>
        </div>
      </div>

      <div className="therapy-content">
        <section className="info-section">
          <h2>Why Choose Individual Therapy?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <i className="fas fa-user-lock"></i>
              <h3>Private & Confidential</h3>
              <p>Your personal space to explore thoughts and feelings without judgment.</p>
            </div>
            <div className="benefit-card">
              <i className="fas fa-bullseye"></i>
              <h3>Personalized Approach</h3>
              <p>Treatment plans customized to your specific needs and goals.</p>
            </div>
            <div className="benefit-card">
              <i className="fas fa-clock"></i>
              <h3>Flexible Scheduling</h3>
              <p>Choose appointment times that work best for your schedule.</p>
            </div>
            <div className="benefit-card">
              <i className="fas fa-chart-line"></i>
              <h3>Focused Progress</h3>
              <p>Dedicated attention to help you achieve meaningful change.</p>
            </div>
          </div>
        </section>

        <section className="session-details">
          <h2>Session Details</h2>
          <div className="details-grid">
            <div className="detail-card">
              <h3>Duration</h3>
              <p>50-minute sessions</p>
            </div>
            <div className="detail-card">
              <h3>Frequency</h3>
              <p>Weekly or bi-weekly</p>
            </div>
            <div className="detail-card">
              <h3>Format</h3>
              <p>In-person or online</p>
            </div>
            <div className="detail-card">
              <h3>Cost</h3>
              <p>Insurance accepted</p>
            </div>
          </div>
        </section>

        <section className="join-section">
          <h2>Schedule Your First Session</h2>
          <form onSubmit={handleSubmit} className="join-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="age">Age *</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="18"
                  placeholder="Enter your age"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="occupation">Occupation</label>
                <input
                  type="text"
                  id="occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="Enter your occupation"
                />
              </div>

              <div className="form-group">
                <label htmlFor="preferredTime">Preferred Session Time *</label>
                <select
                  id="preferredTime"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select preferred time</option>
                  <option value="morning">Morning (9AM-12PM)</option>
                  <option value="afternoon">Afternoon (12PM-5PM)</option>
                  <option value="evening">Evening (5PM-8PM)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="mainConcerns">Main Concerns *</label>
              <textarea
                id="mainConcerns"
                name="mainConcerns"
                value={formData.mainConcerns}
                onChange={handleChange}
                required
                placeholder="Please describe your main concerns or reasons for seeking therapy"
                rows="4"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="goals">Therapy Goals</label>
              <textarea
                id="goals"
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                placeholder="What do you hope to achieve through therapy?"
                rows="4"
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="emergencyContact">Emergency Contact</label>
                <input
                  type="text"
                  id="emergencyContact"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  placeholder="Name and phone number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="insuranceInfo">Insurance Information</label>
                <input
                  type="text"
                  id="insuranceInfo"
                  name="insuranceInfo"
                  value={formData.insuranceInfo}
                  onChange={handleChange}
                  placeholder="Insurance provider and policy number"
                />
              </div>
            </div>

            <div className="form-note">
              <p>* Required fields</p>
              <p>All information provided is confidential and will be used only for scheduling and treatment purposes.</p>
            </div>

            <button type="submit" className="submit-btn">
              Schedule Session
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default IndividualTherapy; 