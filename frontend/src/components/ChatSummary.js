import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateChatSummary, generateSuggestions } from '../services/geminiService';
import { saveChatSummary } from '../services/chatService';
import '../styles/ChatSummary.css';
import { jsPDF } from 'jspdf';

const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

const fetchYouTubeVideos = async (queries) => {
  if (!YOUTUBE_API_KEY) return [];
  let videos = [];
  for (const query of queries) {
    if (!query.trim()) continue;
    // Add mental health context to the search query
    const mentalHealthQuery = `mental health tips for ${query}`;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(mentalHealthQuery)}&key=${YOUTUBE_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.items && data.items.length > 0) {
      videos.push({
        id: data.items[0].id.videoId,
        title: data.items[0].snippet.title,
        thumbnail: data.items[0].snippet.thumbnails.medium.url,
        link: `https://www.youtube.com/watch?v=${data.items[0].id.videoId}`
      });
    }
    if (videos.length >= 3) break;
  }
  return videos;
};

const ChatSummary = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem('chatSummary');
    if (storedData) {
      const parsed = JSON.parse(storedData);
      setSummaryData(parsed);

      const fetchVideosForSuggestions = async (suggestionsText) => {
        if (!suggestionsText) return;
        const suggestionLines = suggestionsText.split('\n').filter(line => line.trim());
        const videos = await fetchYouTubeVideos(suggestionLines);
        setYoutubeVideos(videos);
      };

      if (parsed.summary.status === 'pending') {
        setLoading(true);
        (async () => {
          try {
            const enhancedSummary = await generateChatSummary(parsed.messages);
            const suggestions = await generateSuggestions(parsed.messages);
            
            // Save complete summary to database
            try {
              // Create a temporary session ID for this summary
              const tempSessionId = Date.now().toString();
              await saveChatSummary(tempSessionId, enhancedSummary, suggestions);
            } catch (dbError) {
              console.error('Failed to save summary to database:', dbError);
            }
            
            const updated = {
              ...parsed,
              summary: {
                ...parsed.summary,
                status: 'done',
                enhancedSummary,
                suggestions,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                duration: parsed.messages.length
              }
            };
            localStorage.setItem('chatSummary', JSON.stringify(updated));
            setSummaryData(updated);
            await fetchVideosForSuggestions(suggestions);
          } catch (err) {
            setError('Failed to generate summary. Please try again later.');
          } finally {
            setLoading(false);
          }
        })();
      } else if (parsed.summary.suggestions) {
        fetchVideosForSuggestions(parsed.summary.suggestions);
      }
    } else {
      navigate('/chatbot');
    }
  }, [navigate]);

  const formatSummary = (text) => {
    if (!text) return [];
    return text.split('\n').map((line, index) => {
      if (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.')) {
        return <li key={index}>{line.substring(3).trim()}</li>;
      }
      return <p key={index}>{line}</p>;
    });
  };

  const handleDownload = () => {
    if (!summaryData) return;
    const doc = new jsPDF();
    let y = 10;
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Chat Summary', 10, y);
    y += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Conversation Analysis:', 10, y);
    doc.setFont('helvetica', 'normal');
    y += 8;
    summaryData.summary.enhancedSummary?.split('\n').forEach(line => {
      doc.text(line, 10, y);
      y += 7;
    });
    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Professional Suggestions:', 10, y);
    doc.setFont('helvetica', 'normal');
    y += 8;
    summaryData.summary.suggestions?.split('\n').forEach(line => {
      doc.text(line, 10, y);
      y += 7;
    });
    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Full Conversation:', 10, y);
    doc.setFont('helvetica', 'normal');
    y += 8;
    summaryData.messages.forEach(msg => {
      const sender = msg.sender === 'user' ? 'You' : 'AI Assistant';
      doc.text(`${sender} (${msg.timestamp}):`, 10, y);
      y += 6;
      doc.text(msg.text, 14, y);
      y += 8;
      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });
    doc.save(`chat-summary-${new Date().toISOString()}.pdf`);
  };

  const handleNewChat = () => {
    localStorage.removeItem('chatSummary');
    localStorage.removeItem('chatbotMessages');
    navigate('/chatbot');
  };

  if (!summaryData) return null;

  return (
    <div className="summary-container">
      <section className="summary-hero">
        <div className="hero-content">
          <h1>Chat Summary</h1>
          <p>Review your conversation and professional insights</p>
        </div>
      </section>

      <div className="summary-content">
        <div className="summary-card">
          <div className="summary-header">
            <h2>Conversation Overview</h2>
            <div className="summary-meta">
              <span><i className="fas fa-calendar"></i> {summaryData.summary.date}</span>
              <span><i className="fas fa-clock"></i> {summaryData.summary.time}</span>
              <span><i className="fas fa-comments"></i> {summaryData.summary.duration} messages</span>
            </div>
          </div>

          {loading ? (
            <div className="loading-animation">
              <p>Generating summary, please wait...</p>
            </div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <>
              <div className="summary-section">
                <h3>Conversation Analysis</h3>
                <div className="analysis-content">
                  {formatSummary(summaryData.summary.enhancedSummary)}
                </div>
              </div>

              <div className="summary-section">
                <h3>Professional Suggestions</h3>
                <div className="suggestions-content">
                  {formatSummary(summaryData.summary.suggestions)}
                </div>
              </div>

              {youtubeVideos.length > 0 && (
                <div className="summary-section">
                  <h3>Recommended Resources</h3>
                  <div className="youtube-videos">
                    {youtubeVideos.map((video, index) => (
                      <div key={index} className="video-card">
                        <div className="video-thumbnail">
                          <img src={video.thumbnail} alt={video.title} />
                          <div className="video-duration">{video.title}</div>
                        </div>
                        <div className="video-info">
                          <h4>{video.title}</h4>
                          <a 
                            href={video.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="watch-button"
                          >
                            <i className="fab fa-youtube"></i> Watch Video
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="summary-section">
                <h3>Full Conversation</h3>
                <div className="conversation-log">
                  {summaryData.messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender}-message`}>
                      <div className="message-header">
                        <span className="sender">{message.sender === 'user' ? 'You' : 'AI Assistant'}</span>
                        <span className="timestamp">{message.timestamp}</span>
                      </div>
                      <div className="message-content">{message.text}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="summary-actions">
                <button className="download-btn" onClick={handleDownload}>
                  <i className="fas fa-download"></i> Download Transcript
                </button>
                <button className="new-chat-btn" onClick={handleNewChat}>
                  <i className="fas fa-plus-circle"></i> Start New Chat
                </button>
              </div>
            </>
          )}
        </div>

        <div className="summary-sidebar">
          <div className="sidebar-section">
            <h3>Next Steps</h3>
            <ul className="next-steps-list">
              <li>
                <i className="fas fa-check-circle"></i>
                Review the conversation analysis
              </li>
              <li>
                <i className="fas fa-lightbulb"></i>
                Consider the professional suggestions
              </li>
              <li>
                <i className="fas fa-download"></i>
                Download the transcript for your records
              </li>
              <li>
                <i className="fas fa-calendar-check"></i>
                Schedule a follow-up session if needed
              </li>
            </ul>
          </div>

          <div className="sidebar-section">
            <h3>Need More Support?</h3>
            <p>If you need additional assistance, consider:</p>
            <ul className="support-list">
              <li>
                <i className="fas fa-user-md"></i>
                Schedule a session with a therapist
              </li>
              <li>
                <i className="fas fa-users"></i>
                Join a support group
              </li>
              <li>
                <i className="fas fa-phone"></i>
                Contact emergency services if needed
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSummary; 