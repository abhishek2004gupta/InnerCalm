import React, { useState } from 'react';
import '../styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    preferredContact: 'email',
    urgency: 'normal'
  });
  const [messageStatus, setMessageStatus] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessageStatus({ text: 'Sending message...', type: 'pending' });

    try {
      const response = await fetch('https://formsubmit.co/abhishekg272004@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessageStatus({ text: 'Message sent successfully!', type: 'success' });
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          preferredContact: 'email',
          urgency: 'normal'
        });
      } else {
        setMessageStatus({ text: 'Failed to send message. Please try again.', type: 'error' });
      }
    } catch (error) {
      setMessageStatus({ text: 'Error sending message. Please try again.', type: 'error' });
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="hero-content">
          <h1>Contact Us</h1>
          <p>We're here to help. Reach out to us for any questions or concerns.</p>
        </div>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <div className="info-card">
            <i className="fas fa-map-marker-alt"></i>
            <h3>Location</h3>
            <p>123 Therapy Street</p>
            <p>Mental Health District</p>
            <p>City, State 12345</p>
          </div>

          <div className="info-card">
            <i className="fas fa-phone"></i>
            <h3>Phone</h3>
            <p>Main: (555) 123-4567</p>
            <p>Emergency: (555) 987-6543</p>
            <p>Hours: Mon-Fri, 9AM-6PM</p>
          </div>

          <div className="info-card">
            <i className="fas fa-envelope"></i>
            <h3>Email</h3>
            <p>info@innercalm.com</p>
            <p>support@innercalm.com</p>
            <p>emergency@innercalm.com</p>
          </div>
        </div>

        <div className="contact-form-container">
          <form action="https://formsubmit.co/abhishekg272004@gmail.com" method="POST" className="contact-form">
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
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Enter message subject"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="preferredContact">Preferred Contact Method *</label>
                <select
                  id="preferredContact"
                  name="preferredContact"
                  value={formData.preferredContact}
                  onChange={handleChange}
                  required
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="both">Both</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="urgency">Urgency Level *</label>
                <select
                  id="urgency"
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  required
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Please describe your inquiry in detail"
                rows="6"
              ></textarea>
            </div>

            <div className="form-note">
              <p>* Required fields</p>
              <p>For emergencies, please call our emergency line directly.</p>
            </div>

            <button type="submit" className="submit-btn" onClick={handleSubmit}>
              Send Message
            </button>
            {messageStatus.text && (
              <div style={{ 
                marginTop: '10px', 
                color: messageStatus.type === 'success' ? 'green' : 
                       messageStatus.type === 'error' ? 'red' : 'black'
              }}>
                {messageStatus.text}
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="map-section">
        <h2>Find Us</h2>
        <div className="map-container">
          {/* Add your map component or iframe here */}
          <div className="map-placeholder">
            <i className="fas fa-map-marked-alt"></i>
            <p>Interactive Map Coming Soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 