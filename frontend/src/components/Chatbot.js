import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { voiceService } from '../services/voiceService';
import ConversationPopup from './ConversationPopup';
import '../styles/Chatbot.css';

const CHAT_STORAGE_KEY = 'chatbotMessages';
const PYTHON_BACKEND_URL = process.env.REACT_APP_PYTHON_BACKEND_URL || 'http://localhost:5001';

const Chatbot = () => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return [{
      text: "Hello! I'm your AI Mental Health Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString()
    }];
  });
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [chatSummary, setChatSummary] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConversationOpen, setIsConversationOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const chatMessagesRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`${PYTHON_BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await response.json();
      
      const botMessage = {
        text: data.response || "Sorry, I didn't get a response. Please try again.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceInput = () => {
    voiceService.startListening(
      (transcript) => {
        setInput(transcript);
        setIsListening(false);
      },
      (error) => {
        console.error('Voice recognition error:', error);
        setIsListening(false);
    }
    );
    setIsListening(true);
  };

  const handleConversationMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const handleEndChat = async () => {
    if (messages.length <= 1) {
      alert('Please have a conversation before ending the chat.');
      return;
    }
    const chatData = {
      messages,
      summary: { status: 'pending' }
    };
    localStorage.setItem('chatSummary', JSON.stringify(chatData));
    navigate('/chat-summary');
  };

  const handleNewChat = () => {
    if (messages.length > 1) {
      if (window.confirm('Are you sure you want to start a new chat? The current conversation will be cleared.')) {
        setMessages([{
          text: "Hello! I'm your AI Mental Health Assistant. How can I help you today?",
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString()
        }]);
        setShowSummary(false);
        setChatSummary('');
        localStorage.removeItem(CHAT_STORAGE_KEY);
      }
    }
  };

  return (
    <div className="chatbot-container">
      <section className="chatbot-hero">
        <div className="hero-content">
          <h1>AI Mental Health Assistant</h1>
          <p>Your 24/7 companion for mental wellness support</p>
        </div>
      </section>

      <div className="chatbot-content">
        <div className="chat-window">
          <div className="chat-header">
            <h2>Chat Session</h2>
            <div className="chat-actions">
              <button className="action-btn" onClick={handleEndChat}>
                <i className="fas fa-stop-circle"></i> End Chat
              </button>
              <button className="action-btn" onClick={handleNewChat}>
                <i className="fas fa-plus-circle"></i> New Chat
              </button>
            </div>
          </div>

          <div className="chat-messages" ref={chatMessagesRef}>
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}-message`}>
                <div className="message-header">
                  <span className="sender">{message.sender === 'user' ? 'You' : 'AI Assistant'}</span>
                  <span className="timestamp">{message.timestamp}</span>
                </div>
                <div className="message-content">{message.text}</div>
              </div>
            ))}
            {isTyping && (
              <div className="message bot-message typing-indicator">
                <div className="typing-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="messages-end-ref" />
          </div>

          <form className="chat-input" onSubmit={handleSend}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              rows="1"
            />
            <button 
              className={`voice-btn ${isListening ? 'listening' : ''}`} 
              onClick={() => {
                if (isListening) {
                  voiceService.stopListening();
                  setIsListening(false);
                } else {
                  voiceService.startListening(
                    (transcript) => {
                      setInput(transcript);
                      setIsListening(false);
                    },
                    (error) => {
                      console.error('Voice recognition error:', error);
                      setIsListening(false);
                    }
                  );
                  setIsListening(true);
                }
              }}
              type="button"
              title={isListening ? 'Stop Listening' : 'Start voice input'}
            >
              <img src="/images/chatbot_voice.png" alt="Voice" className="voice-icon" />
            </button>
            <button 
              className="conversation-btn"
              onClick={() => setIsConversationOpen(true)}
              type="button"
              title="Start voice conversation"
            >
              <img src="/images/chatbot_conver.png" alt="Conversation" className="conversation-icon" />
            </button>
            <button 
              className="send-btn" 
              type="submit"
              disabled={!input.trim()}
              title="Send message"
            >
              <img src="/images/send_message.png" alt="Send" className="send-icon" />
            </button>
          </form>
        </div>

        <div className="chatbot-sidebar">
          <div className="sidebar-section">
            <h3>Features</h3>
            <ul className="feature-list">
              <li>24/7 Availability</li>
              <li>Voice & Text Support</li>
              <li>Non-judgmental Space</li>
              <li>Emergency Resources</li>
              <li>Chat History</li>
            </ul>
          </div>

          <div className="sidebar-section">
            <h3>Emergency Resources</h3>
            <p>If you're experiencing a crisis, please contact:</p>
            <ul className="emergency-list">
              <li><i className="fas fa-phone"></i> National Crisis Hotline: 988</li>
              <li><i className="fas fa-ambulance"></i> Emergency Services: 911</li>
            </ul>
          </div>
        </div>
      </div>

      <ConversationPopup 
        isOpen={isConversationOpen}
        onClose={() => setIsConversationOpen(false)}
        onMessage={handleConversationMessage}
      />
    </div>
  );
};

export default Chatbot;
