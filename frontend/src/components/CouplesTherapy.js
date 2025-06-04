import React, { useState } from 'react';
import '../styles/CouplesTherapy.css';

const CouplesTherapy = () => {
  const [formData, setFormData] = useState({
    partner1Name: '',
    partner2Name: '',
    email: '',
    phone: '',
    relationshipDuration: '',
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
    <div className="couples-therapy">
      <div className="therapy-hero">
        <div className="hero-content">
          <h1>Couples Therapy</h1>
          <p>Strengthen your relationship with professional guidance and support.</p>
        </div>
      </div>

      <div className="therapy-content">
        <section className="info-section">
          <h2>Why Choose Couples Therapy?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <i className="fas fa-heart"></i>
              <h3>Improved Communication</h3>
              <p>Learn effective ways to express needs and understand each other better.</p>
            </div>
            <div className="benefit-card">
              <i className="fas fa-handshake"></i>
              <h3>Conflict Resolution</h3>
              <p>Develop healthy strategies to resolve disagreements and build trust.</p>
            </div>
            <div className="benefit-card">
              <i className="fas fa-users"></i>
              <h3>Relationship Growth</h3>
              <p>Strengthen your bond and create a more fulfilling partnership.</p>
            </div>
            <div className="benefit-card">
              <i className="fas fa-balance-scale"></i>
              <h3>Emotional Balance</h3>
              <p>Find harmony in your relationship while maintaining individual well-being.</p>
            </div>
          </div>
        </section>

        <section className="session-details">
          <h2>Session Details</h2>
          <div className="details-grid">
            <div className="detail-card">
              <h3>Duration</h3>
              <p>75-minute sessions</p>
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
                <label htmlFor="partner1Name">Partner 1 Name *</label>
                <input
                  type="text"
                  id="partner1Name"
                  name="partner1Name"
                  value={formData.partner1Name}
                  onChange={handleChange}
                  required
                  placeholder="Enter first partner's name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="partner2Name">Partner 2 Name *</label>
                <input
                  type="text"
                  id="partner2Name"
                  name="partner2Name"
                  value={formData.partner2Name}
                  onChange={handleChange}
                  required
                  placeholder="Enter second partner's name"
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
                <label htmlFor="relationshipDuration">Relationship Duration *</label>
                <select
                  id="relationshipDuration"
                  name="relationshipDuration"
                  value={formData.relationshipDuration}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select duration</option>
                  <option value="less-than-1">Less than 1 year</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="more-than-10">More than 10 years</option>
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
                placeholder="Please describe the main concerns or challenges in your relationship"
                rows="4"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="goals">Relationship Goals</label>
              <textarea
                id="goals"
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                placeholder="What do you hope to achieve through couples therapy?"
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

export default CouplesTherapy; 