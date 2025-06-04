import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AIChatbot.css';

const AIChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [chatSummary, setChatSummary] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const newMessage = {
      text,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse = {
        text: "I'm here to support you. How can I help you today?",
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    // Implement voice recording logic here
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    // Implement stop recording and speech-to-text logic here
  };

  const startListening = () => {
    setIsListening(true);
    // Implement text-to-speech logic here
  };

  const stopListening = () => {
    setIsListening(false);
    // Implement stop text-to-speech logic here
  };

  const endChat = () => {
    // Generate chat summary
    const summary = {
      duration: "30 minutes",
      topics: ["Anxiety", "Stress Management"],
      keyPoints: [
        "Discussed current stress levels",
        "Explored coping mechanisms",
        "Identified triggers"
      ],
      recommendations: [
        "Practice daily meditation",
        "Keep a stress journal",
        "Schedule regular check-ins"
      ]
    };
    setChatSummary(summary);
    navigate('/chat-summary', { state: { summary } });
  };

  return (
    <div className="chatbot-container">
      <div className="chat-header">
        <h1>AI Mental Health Assistant</h1>
        <p>Available 24/7 for support and guidance</p>
      </div>

      <div className="chat-interface">
        <div className="messages-container">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              <div className="message-content">
                <p>{message.text}</p>
                <span className="timestamp">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <div className="input-actions">
            <button
              className={`voice-button ${isRecording ? 'recording' : ''}`}
              onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
            >
              {isRecording ? 'Stop Recording' : 'Voice Input'}
            </button>
            <button
              className={`listen-button ${isListening ? 'listening' : ''}`}
              onClick={isListening ? stopListening : startListening}
            >
              {isListening ? 'Stop Listening' : 'Listen'}
            </button>
          </div>

          <div className="text-input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
            />
            <button onClick={() => handleSendMessage(input)}>Send</button>
          </div>
        </div>
      </div>

      <div className="chat-actions">
        <button className="end-chat-button" onClick={endChat}>
          End Chat & Get Summary
        </button>
      </div>
    </div>
  );
};

export default AIChatbot; 