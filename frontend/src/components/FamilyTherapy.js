import React, { useState } from 'react';
import '../styles/FamilyTherapy.css';

const FamilyTherapy = () => {
  const [formData, setFormData] = useState({
    familyName: '',
    email: '',
    phone: '',
    familySize: '',
    childrenAges: '',
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
    <div className="family-therapy">
      <div className="therapy-hero">
        <div className="hero-content">
          <h1>Family Therapy</h1>
          <p>Strengthen family bonds and improve communication through professional guidance.</p>
        </div>
      </div>

      <div className="therapy-content">
        <section className="info-section">
          <h2>Why Choose Family Therapy?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <i className="fas fa-home"></i>
              <h3>Family Unity</h3>
              <p>Build stronger relationships and create a more harmonious home environment.</p>
            </div>
            <div className="benefit-card">
              <i className="fas fa-comments"></i>
              <h3>Better Communication</h3>
              <p>Learn effective ways to express feelings and resolve conflicts together.</p>
            </div>
            <div className="benefit-card">
              <i className="fas fa-heart"></i>
              <h3>Emotional Support</h3>
              <p>Create a safe space for each family member to be heard and understood.</p>
            </div>
            <div className="benefit-card">
              <i className="fas fa-puzzle-piece"></i>
              <h3>Problem Solving</h3>
              <p>Develop strategies to overcome challenges as a united family unit.</p>
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
                <label htmlFor="familyName">Family Name *</label>
                <input
                  type="text"
                  id="familyName"
                  name="familyName"
                  value={formData.familyName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your family name"
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
                <label htmlFor="familySize">Number of Family Members *</label>
                <select
                  id="familySize"
                  name="familySize"
                  value={formData.familySize}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select family size</option>
                  <option value="2">2 members</option>
                  <option value="3">3 members</option>
                  <option value="4">4 members</option>
                  <option value="5">5 members</option>
                  <option value="6+">6+ members</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="childrenAges">Children's Ages (if applicable)</label>
                <input
                  type="text"
                  id="childrenAges"
                  name="childrenAges"
                  value={formData.childrenAges}
                  onChange={handleChange}
                  placeholder="e.g., 8, 12, 15"
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
                placeholder="Please describe the main concerns or challenges your family is facing"
                rows="4"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="goals">Family Goals</label>
              <textarea
                id="goals"
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                placeholder="What do you hope to achieve through family therapy?"
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

export default FamilyTherapy; 