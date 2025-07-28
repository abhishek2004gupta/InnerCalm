import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TherapyConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { meetingLink, sessionId, type } = location.state || {};

  if (!meetingLink) {
    navigate('/');
    return null;
  }

  return (
    <div className="therapy-confirmation">
      <div className="confirmation-card">
        <h2>Thank you for registering for {type} Therapy!</h2>
        <p>Your session has been scheduled. You can now join the session using the link below. The therapist will connect shortly.</p>
        <a href={meetingLink} target="_blank" rel="noopener noreferrer" className="join-meeting-btn">
          Join Meeting
        </a>
      </div>
    </div>
  );
};

export default TherapyConfirmation; 