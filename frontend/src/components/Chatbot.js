import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Chatbot.css';
import { generateChatSummary, generateSuggestions } from '../services/geminiService';

const CHAT_STORAGE_KEY = 'chatbotMessages';

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
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const [enhancedSummary, setEnhancedSummary] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const generateSummary = (messages) => {
    const userMessages = messages.filter(msg => msg.sender === 'user');
    const mainTopics = userMessages.map(msg => msg.text).join(' ');
    return `Conversation Summary:\n\nMain Topics Discussed:\n${mainTopics}\n\nDuration: ${messages.length} messages\nDate: ${new Date().toLocaleDateString()}`;
  };

  const handleSend = async () => {
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
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await response.json();
      
      const botMessage = {
        text: data.response,
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

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };
      recognition.start();
    }
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
        setEnhancedSummary('');
        setSuggestions('');
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

          <div className="chat-messages">
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
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              rows="1"
            />
            <button 
              className={`voice-btn ${isListening ? 'listening' : ''}`} 
              onClick={toggleVoiceInput}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              <i className="fas fa-microphone"></i>
            </button>
            <button 
              className="send-btn" 
              onClick={handleSend}
              disabled={!input.trim()}
              title="Send message"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
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
              <li>
                <i className="fas fa-phone"></i>
                National Crisis Hotline: 988
              </li>
              <li>
                <i className="fas fa-ambulance"></i>
                Emergency Services: 911
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot; 