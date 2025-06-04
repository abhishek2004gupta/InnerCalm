const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/database');
const fetch = require('node-fetch');

// Python backend URL
const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'http://localhost:5001';

// Generate summary for a chat session
router.post('/sessions/:sessionId/summary', auth, async (req, res) => {
    try {
        // Verify session belongs to user
        const sessionCheck = await db.query(
            'SELECT * FROM chat_sessions WHERE session_id = $1 AND user_id = $2',
            [req.params.sessionId, req.user.userId]
        );

        if (sessionCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Session not found' });
        }

        // Get all messages for the session
        const messagesResult = await db.query(
            'SELECT message_id, session_id, sender_type, message_text, timestamp FROM chat_messages WHERE session_id = $1 ORDER BY timestamp ASC',
            [req.params.sessionId]
        );

        const messages = messagesResult.rows;
        
        // Call Python service for summary and suggestions
        const [summaryResponse, suggestionsResponse] = await Promise.all([
            fetch(`${PYTHON_BACKEND_URL}/generate_summary`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages })
            }),
            fetch(`${PYTHON_BACKEND_URL}/generate_suggestions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages })
            })
        ]);

        const [summaryData, suggestionsData] = await Promise.all([
            summaryResponse.json(),
            suggestionsResponse.json()
        ]);

        if (!summaryResponse.ok || !suggestionsResponse.ok) {
            throw new Error('Failed to generate summary or suggestions');
        }

        // Store summary in database
        const summaryResult = await db.query(
            'INSERT INTO chat_summaries (session_id, enhanced_summary, suggestions) VALUES ($1, $2, $3) RETURNING summary_id, session_id, enhanced_summary, suggestions, generated_at',
            [req.params.sessionId, summaryData.summary, suggestionsData.suggestions]
        );

        res.status(201).json(summaryResult.rows[0]);
    } catch (error) {
        console.error('Generate summary error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get summary for a chat session
router.get('/sessions/:sessionId/summary', auth, async (req, res) => {
    try {
        // Verify session belongs to user
        const sessionCheck = await db.query(
            'SELECT * FROM chat_sessions WHERE session_id = $1 AND user_id = $2',
            [req.params.sessionId, req.user.userId]
        );

        if (sessionCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Session not found' });
        }

        const result = await db.query(
            'SELECT summary_id, session_id, enhanced_summary, suggestions, generated_at FROM chat_summaries WHERE session_id = $1',
            [req.params.sessionId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Summary not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Get summary error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get YouTube videos for a summary
router.get('/summaries/:summaryId/videos', auth, async (req, res) => {
    try {
        // Verify summary belongs to user's session
        const summaryCheck = await db.query(
            `SELECT cs.* FROM chat_summaries cs
            JOIN chat_sessions s ON cs.session_id = s.session_id
            WHERE cs.summary_id = $1 AND s.user_id = $2`,
            [req.params.summaryId, req.user.userId]
        );

        if (summaryCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Summary not found' });
        }

        const result = await db.query(
            'SELECT video_id, summary_id, youtube_video_id, title, thumbnail_url, video_url FROM youtube_videos WHERE summary_id = $1',
            [req.params.summaryId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Get videos error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Generate summary
router.post('/', auth, async (req, res) => {
    try {
        const response = await fetch(`${PYTHON_BACKEND_URL}/generate_summary`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            throw new Error('Failed to generate summary');
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error generating summary:', error);
        res.status(500).json({ error: 'Failed to generate summary' });
    }
});

// Generate suggestions
router.post('/suggestions', auth, async (req, res) => {
    try {
        const response = await fetch(`${PYTHON_BACKEND_URL}/generate_suggestions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            throw new Error('Failed to generate suggestions');
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error generating suggestions:', error);
        res.status(500).json({ error: 'Failed to generate suggestions' });
    }
});

module.exports = router; 