const express = require('express');
const router = express.Router();
const db = require('../config/database');
const jwt = require('jsonwebtoken');

// Create a new chat session
router.post('/session', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    
    const result = await db.query(
      'INSERT INTO chat_sessions (user_id, status) VALUES ($1, $2) RETURNING session_id',
      [userId, 'active']
    );
    
    res.json({ 
      success: true, 
      sessionId: result.rows[0].session_id 
    });
  } catch (error) {
    console.error('Create chat session error:', error);
    res.status(500).json({ error: 'Failed to create chat session' });
  }
});

// End a chat session
router.put('/session/:sessionId/end', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    
    // Verify session belongs to user
    const sessionCheck = await db.query(
      'SELECT session_id FROM chat_sessions WHERE session_id = $1 AND user_id = $2',
      [sessionId, userId]
    );
    
    if (sessionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    await db.query(
      'UPDATE chat_sessions SET status = $1, end_time = CURRENT_TIMESTAMP WHERE session_id = $2',
      ['completed', sessionId]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('End chat session error:', error);
    res.status(500).json({ error: 'Failed to end chat session' });
  }
});

// Save a chat message
router.post('/message', async (req, res) => {
  try {
    const { sessionId, senderType, messageText } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    
    // Verify session belongs to user
    const sessionCheck = await db.query(
      'SELECT session_id FROM chat_sessions WHERE session_id = $1 AND user_id = $2',
      [sessionId, userId]
    );
    
    if (sessionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    const result = await db.query(
      'INSERT INTO chat_messages (session_id, sender_type, message_text) VALUES ($1, $2, $3) RETURNING message_id',
      [sessionId, senderType, messageText]
    );
    
    res.json({ 
      success: true, 
      messageId: result.rows[0].message_id 
    });
  } catch (error) {
    console.error('Save chat message error:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// Get chat messages for a session
router.get('/messages/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    
    // Verify session belongs to user
    const sessionCheck = await db.query(
      'SELECT session_id FROM chat_sessions WHERE session_id = $1 AND user_id = $2',
      [sessionId, userId]
    );
    
    if (sessionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    const result = await db.query(
      'SELECT * FROM chat_messages WHERE session_id = $1 ORDER BY timestamp ASC',
      [sessionId]
    );
    
    res.json({ messages: result.rows });
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// Save chat summary
router.post('/summary', async (req, res) => {
  try {
    const { sessionId, enhancedSummary, suggestions } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    
    // Verify session belongs to user
    const sessionCheck = await db.query(
      'SELECT session_id FROM chat_sessions WHERE session_id = $1 AND user_id = $2',
      [sessionId, userId]
    );
    
    if (sessionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    const result = await db.query(
      'INSERT INTO chat_summaries (session_id, enhanced_summary, suggestions) VALUES ($1, $2, $3) RETURNING summary_id',
      [sessionId, enhancedSummary, suggestions]
    );
    
    res.json({ 
      success: true, 
      summaryId: result.rows[0].summary_id 
    });
  } catch (error) {
    console.error('Save chat summary error:', error);
    res.status(500).json({ error: 'Failed to save summary' });
  }
});

// Get chat summary
router.get('/summary/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    
    // Verify session belongs to user
    const sessionCheck = await db.query(
      'SELECT session_id FROM chat_sessions WHERE session_id = $1 AND user_id = $2',
      [sessionId, userId]
    );
    
    if (sessionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    const result = await db.query(
      'SELECT * FROM chat_summaries WHERE session_id = $1 ORDER BY generated_at DESC LIMIT 1',
      [sessionId]
    );
    
    res.json({ summary: result.rows[0] || null });
  } catch (error) {
    console.error('Get chat summary error:', error);
    res.status(500).json({ error: 'Failed to get summary' });
  }
});

// Save YouTube video recommendation
router.post('/youtube-video', async (req, res) => {
  try {
    const { summaryId, youtubeVideoId, title, thumbnailUrl, videoUrl } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    
    // Verify summary belongs to user's session
    const summaryCheck = await db.query(
      `SELECT cs.summary_id FROM chat_summaries cs
       JOIN chat_sessions chs ON cs.session_id = chs.session_id
       WHERE cs.summary_id = $1 AND chs.user_id = $2`,
      [summaryId, userId]
    );
    
    if (summaryCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Summary not found' });
    }
    
    const result = await db.query(
      'INSERT INTO youtube_videos (summary_id, youtube_video_id, title, thumbnail_url, video_url) VALUES ($1, $2, $3, $4, $5) RETURNING video_id',
      [summaryId, youtubeVideoId, title, thumbnailUrl, videoUrl]
    );
    
    res.json({ 
      success: true, 
      videoId: result.rows[0].video_id 
    });
  } catch (error) {
    console.error('Save YouTube video error:', error);
    res.status(500).json({ error: 'Failed to save video' });
  }
});

// Get YouTube videos for a summary
router.get('/youtube-videos/:summaryId', async (req, res) => {
  try {
    const { summaryId } = req.params;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    
    // Verify summary belongs to user's session
    const summaryCheck = await db.query(
      `SELECT cs.summary_id FROM chat_summaries cs
       JOIN chat_sessions chs ON cs.session_id = chs.session_id
       WHERE cs.summary_id = $1 AND chs.user_id = $2`,
      [summaryId, userId]
    );
    
    if (summaryCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Summary not found' });
    }
    
    const result = await db.query(
      'SELECT * FROM youtube_videos WHERE summary_id = $1 ORDER BY created_at DESC',
      [summaryId]
    );
    
    res.json({ videos: result.rows });
  } catch (error) {
    console.error('Get YouTube videos error:', error);
    res.status(500).json({ error: 'Failed to get videos' });
  }
});

// Get user's chat sessions
router.get('/sessions', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    
    const result = await db.query(
      'SELECT * FROM chat_sessions WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    
    res.json({ sessions: result.rows });
  } catch (error) {
    console.error('Get chat sessions error:', error);
    res.status(500).json({ error: 'Failed to get sessions' });
  }
});

module.exports = router; 