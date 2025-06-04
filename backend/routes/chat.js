const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/database');
const fetch = require('node-fetch');

// Python backend URL
const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'http://localhost:5001';

// Send message
router.post('/message', auth, async (req, res) => {
    try {
        const { message, sessionId } = req.body;
        const userId = req.user.userId;

        // Get chat session
        const sessionResult = await db.query(
            'SELECT * FROM chat_sessions WHERE session_id = $1 AND user_id = $2',
            [sessionId, userId]
        );

        if (sessionResult.rows.length === 0) {
            return res.status(404).json({ error: 'Chat session not found' });
        }

        // Save user message
        await db.query(
            'INSERT INTO chat_messages (session_id, message_text, sender_type) VALUES ($1, $2, $3)',
            [sessionId, message, 'user']
        );

        // Get response from Python backend
        const response = await fetch(`${PYTHON_BACKEND_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            throw new Error('Failed to get chatbot response');
        }

        const data = await response.json();

        // Save bot response
        await db.query(
            'INSERT INTO chat_messages (session_id, message_text, sender_type) VALUES ($1, $2, $3)',
            [sessionId, data.response, 'bot']
        );

        res.json({ response: data.response });
    } catch (error) {
        console.error('Error in chat:', error);
        res.status(500).json({ error: 'Failed to process chat message' });
    }
});

// Get chat history
router.get('/history/:sessionId', auth, async (req, res) => {
    try {
        const { sessionId } = req.params;
        const userId = req.user.userId;

        // Verify session belongs to user
        const sessionResult = await db.query(
            'SELECT * FROM chat_sessions WHERE session_id = $1 AND user_id = $2',
            [sessionId, userId]
        );

        if (sessionResult.rows.length === 0) {
            return res.status(404).json({ error: 'Chat session not found' });
        }

        // Get messages
        const messagesResult = await db.query(
            'SELECT message_id, session_id, sender_type, message_text, timestamp FROM chat_messages WHERE session_id = $1 ORDER BY timestamp ASC',
            [sessionId]
        );

        res.json({ messages: messagesResult.rows });
    } catch (error) {
        console.error('Error getting chat history:', error);
        res.status(500).json({ error: 'Failed to get chat history' });
    }
});

// Create new chat session
router.post('/session', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { title } = req.body;

        const result = await db.query(
            'INSERT INTO chat_sessions (user_id, status) VALUES ($1, $2) RETURNING session_id, user_id, start_time, status',
            [userId, 'active']
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error creating chat session:', error);
        res.status(500).json({ error: 'Failed to create chat session' });
    }
});

// Get user's chat sessions
router.get('/sessions', auth, async (req, res) => {
    try {
        const userId = req.user.userId;

        const result = await db.query(
            'SELECT session_id, user_id, start_time, end_time, status FROM chat_sessions WHERE user_id = $1 ORDER BY start_time DESC',
            [userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error getting chat sessions:', error);
        res.status(500).json({ error: 'Failed to get chat sessions' });
    }
});

module.exports = router; 