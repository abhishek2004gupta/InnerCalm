import React, { useState, useEffect, useRef } from 'react';
import { voiceService } from '../services/voiceService';
import '../styles/ConversationPopup.css';

const ConversationPopup = ({ isOpen, onClose, onMessage }) => {
  const [conversation, setConversation] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const conversationEndRef = useRef(null);

  const scrollToBottom = () => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

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
        setIsListening(false);

        try {
          const response = await fetch(`${process.env.REACT_APP_PYTHON_BACKEND_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: transcript }),
          });

          const data = await response.json();
          
          const botMessage = {
            text: data.response || "Sorry, I didn't get a response. Please try again.",
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString()
          };
          
          setConversation(prev => [...prev, botMessage]);
          onMessage(botMessage);
        } catch (error) {
          console.error('Error:', error);
          const errorMessage = {
            text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString()
          };
          setConversation(prev => [...prev, errorMessage]);
          onMessage(errorMessage);
        }
      },
      (error) => {
        console.error('Voice recognition error:', error);
        setIsListening(false);
      }
    );
    setIsListening(true);
  };

  if (!isOpen) return null;

  return (
    <div className="conversation-popup-overlay">
      <div className="conversation-popup">
        <div className="conversation-header">
          <h3>Voice Conversation</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
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
          <button 
            className={`voice-btn ${isListening ? 'listening' : ''}`} 
            onClick={handleVoiceInput}
            title={isListening ? 'Listening...' : 'Start voice input'}
          >
            <i className="fas fa-microphone"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationPopup; 