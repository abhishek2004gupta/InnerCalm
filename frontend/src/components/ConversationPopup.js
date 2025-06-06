import React, { useState, useEffect, useRef } from 'react';
import { voiceService } from '../services/voiceService';
import '../styles/ConversationPopup.css';

const PYTHON_BACKEND_URL = process.env.REACT_APP_PYTHON_BACKEND_URL || 'http://localhost:5001';

const ConversationPopup = ({ isOpen, onClose, onMessage }) => {
  const [conversation, setConversation] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const conversationEndRef = useRef(null);

  const scrollToBottom = () => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  useEffect(() => {
    if (!isOpen) {
      stopConversation();
    }
  }, [isOpen]);

  const startConversation = () => {
    setIsActive(true);
    handleVoiceInput();
  };

  const stopConversation = () => {
    setIsActive(false);
    voiceService.stopListening();
  };

  const handleVoiceInput = () => {
    voiceService.startListening(
      async (transcript) => {
        const userMessage = {
          text: transcript,
          sender: 'user',
          timestamp: new Date().toLocaleTimeString()
        };
        
        setConversation(prev => [...prev, userMessage]);
        onMessage(userMessage);

        try {
          const response = await fetch(`${PYTHON_BACKEND_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: transcript }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          
          const botMessage = {
            text: data.response || "Sorry, I didn't get a response. Please try again.",
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString()
          };
          
          setConversation(prev => [...prev, botMessage]);
          onMessage(botMessage);
          voiceService.speak(botMessage.text);
        } catch (error) {
          console.error('Error:', error);
          const errorMessage = {
            text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString()
          };
          setConversation(prev => [...prev, errorMessage]);
          onMessage(errorMessage);
          voiceService.speak(errorMessage.text);
        }
      },
      (error) => {
        console.error('Voice recognition error:', error);
        if (isActive) {
          handleVoiceInput();
        }
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="conversation-popup-overlay">
      <div className="conversation-popup">
        <div className="conversation-header">
          <h3>Voice Conversation</h3>
          <div className="header-buttons">
            <button className="close-btn" onClick={onClose} title="Close conversation">
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
        
        <div className="conversation-terminal">
          {conversation.map((message, index) => (
            <div key={index} className={`terminal-line ${message.sender}-line`}>
              <span className="terminal-prompt">{message.sender === 'user' ? 'You:' : 'Bot:'}</span>
              <span className="terminal-text">{message.text}</span>
              <span className="terminal-timestamp">{message.timestamp}</span>
            </div>
          ))}
          <div ref={conversationEndRef} />
        </div>

        <div className="conversation-controls">
          {!isActive ? (
            <button 
              className="start-btn"
              onClick={startConversation}
              title="Start conversation"
            >
              <i className="fas fa-play"></i> Start
            </button>
          ) : (
            <button 
              className="end-btn"
              onClick={stopConversation}
              title="End conversation"
            >
              <i className="fas fa-stop"></i> End
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationPopup; 