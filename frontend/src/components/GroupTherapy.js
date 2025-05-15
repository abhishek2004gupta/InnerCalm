import React, { useState } from 'react';
import '../styles/GroupTherapy.css';

const GroupTherapy = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    occupation: '',
    preferredTime: '',
    concerns: '',
    problemType: '',
    emergencyContact: '',
    insuranceInfo: '',
    goals: ''
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
    <div className="group-therapy">
      <div className="group-therapy-hero">
        <div className="hero-content">
          <h1>Group Therapy Sessions</h1>
          <p>Join our supportive community and embark on your journey to mental wellness together.</p>
        </div>
      </div>

      <div className="group-therapy-content">
        <section className="info-section">
          <h2>Why Choose Group Therapy?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <i className="fas fa-users"></i>
              <h3>Shared Experience</h3>
              <p>Connect with others who understand your journey and share similar experiences.</p>
            </div>
            <div className="benefit-card">
              <i className="fas fa-comments"></i>
              <h3>Supportive Environment</h3>
              <p>Experience the power of group support in a safe and confidential setting.</p>
            </div>
            <div className="benefit-card">
              <i className="fas fa-hand-holding-heart"></i>
              <h3>Professional Guidance</h3>
              <p>Led by experienced therapists who facilitate meaningful discussions and growth.</p>
            </div>
            <div className="benefit-card">
              <i className="fas fa-chart-line"></i>
              <h3>Cost-Effective</h3>
              <p>Access professional mental health support at a more affordable rate.</p>
            </div>
          </div>
        </section>

        <section className="session-details">
          <h2>Session Details</h2>
          <div className="details-grid">
            <div className="detail-card">
              <h3>Duration</h3>
              <p>90-minute sessions</p>
            </div>
            <div className="detail-card">
              <h3>Frequency</h3>
              <p>Weekly meetings</p>
            </div>
            <div className="detail-card">
              <h3>Group Size</h3>
              <p>6-8 participants</p>
            </div>
            <div className="detail-card">
              <h3>Format</h3>
              <p>Virtual sessions</p>
            </div>
          </div>
        </section>

        <section className="join-section">
          <h2>Join Our Next Session</h2>
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
                <label htmlFor="age">Age *</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="18"
                  max="100"
                  placeholder="Enter your age"
                />
              </div>
            </div>

            <div className="form-row">
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
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="occupation">Occupation *</label>
                <select
                  id="occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select your occupation</option>
                  <option value="student">Student</option>
                  <option value="employed">Employed</option>
                  <option value="self-employed">Self-Employed</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="retired">Retired</option>
                  <option value="other">Other</option>
                </select>
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
                  <option value="">Select a time</option>
                  <option value="morning">Morning (9 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (1 PM - 4 PM)</option>
                  <option value="evening">Evening (5 PM - 8 PM)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="problemType">Type of Concern *</label>
              <select
                id="problemType"
                name="problemType"
                value={formData.problemType}
                onChange={handleChange}
                required
              >
                <option value="">Select your main concern</option>
                <option value="anxiety">Anxiety</option>
                <option value="depression">Depression</option>
                <option value="stress">Stress Management</option>
                <option value="relationships">Relationship Issues</option>
                <option value="work">Work-Life Balance</option>
                <option value="trauma">Trauma</option>
                <option value="grief">Grief and Loss</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="concerns">Detailed Concerns *</label>
              <textarea
                id="concerns"
                name="concerns"
                value={formData.concerns}
                onChange={handleChange}
                required
                placeholder="Please describe your concerns and what brings you to group therapy"
                rows="4"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="goals">Therapy Goals *</label>
              <textarea
                id="goals"
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                required
                placeholder="What do you hope to achieve through group therapy?"
                rows="3"
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="emergencyContact">Emergency Contact *</label>
                <input
                  type="text"
                  id="emergencyContact"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  required
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
                  placeholder="Insurance provider and policy number (if applicable)"
                />
              </div>
            </div>

            <div className="form-note">
              <p>* Required fields</p>
              <p>Your information is confidential and will only be used to provide you with the best possible care.</p>
            </div>

            <button type="submit" className="submit-btn">
              Join Group Therapy
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default GroupTherapy; 