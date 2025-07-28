const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { google } = require('googleapis');

// Therapist Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const result = await db.query('SELECT * FROM therapists WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const therapist = result.rows[0];
        const validPassword = await bcrypt.compare(password, therapist.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Update last login
        await db.query('UPDATE therapists SET last_login = CURRENT_TIMESTAMP WHERE therapist_id = $1', [therapist.therapist_id]);
        // Generate token
        const token = jwt.sign({ therapistId: therapist.therapist_id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({
            token,
            therapist: {
                id: therapist.therapist_id,
                username: therapist.username,
                email: therapist.email,
                first_name: therapist.first_name,
                last_name: therapist.last_name
            }
        });
    } catch (error) {
        console.error('Therapist login error:', error);
        res.status(500).json({ error: 'Server error during therapist login' });
    }
});

// Therapist Dashboard: List all assigned meetings
router.get('/dashboard', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const therapistId = decoded.therapistId;
        // Get all meetings for this therapist
        const result = await db.query(
            `SELECT tm.meeting_id, tm.user_id, u.username, u.email, tm.meeting_link, tm.start_time, tm.end_time, tm.status
             FROM therapist_meetings tm
             JOIN users u ON tm.user_id = u.user_id
             WHERE tm.therapist_id = $1
             ORDER BY tm.start_time DESC`,
            [therapistId]
        );
        res.json({ meetings: result.rows });
    } catch (error) {
        console.error('Therapist dashboard error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        res.status(500).json({ error: 'Server error while fetching dashboard' });
    }
});

// Helper to create a Google Meet link via Calendar API
async function createGoogleMeetLink(email) {
    try {
        const oAuth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_MEET_CLIENT_ID,
            process.env.GOOGLE_MEET_CLIENT_SECRET,
            process.env.GOOGLE_MEET_REDIRECT_URI
        );
        if (process.env.GOOGLE_MEET_REFRESH_TOKEN) {
            oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_MEET_REFRESH_TOKEN });
        } else {
            throw new Error('No Google refresh token set. Set GOOGLE_MEET_REFRESH_TOKEN in .env.');
        }
        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
        const event = {
            summary: 'Therapy Session',
            description: 'Scheduled via InnerCalm',
            start: { dateTime: new Date(Date.now() + 5 * 60000).toISOString() },
            end: { dateTime: new Date(Date.now() + 35 * 60000).toISOString() },
            attendees: [{ email }],
            conferenceData: { createRequest: { requestId: Math.random().toString(36).substring(2, 15) } },
        };
        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
            conferenceDataVersion: 1,
        });
        return response.data.hangoutLink || null;
    } catch (err) {
        console.error('Google Meet link generation failed:', err.message);
        return null;
    }
}

// Schedule a new meeting (admin/system only)
router.post('/schedule-meeting', async (req, res) => {
    try {
        const { user_id, therapist_id, start_time, end_time } = req.body;
        if (!user_id || !therapist_id || !start_time || !end_time) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        // Get user email
        const userResult = await db.query('SELECT email FROM users WHERE user_id = $1', [user_id]);
        const userEmail = userResult.rows[0]?.email;
        // Generate real Google Meet link
        let meetingLink = await createGoogleMeetLink(userEmail);
        if (!meetingLink) {
            meetingLink = `https://meet.google.com/${Math.random().toString(36).substring(2, 9)}`;
        }
        // Create meeting
        const result = await db.query(
            `INSERT INTO therapist_meetings (user_id, therapist_id, meeting_link, start_time, end_time, status) VALUES ($1, $2, $3, $4, $5, 'scheduled') RETURNING *`,
            [user_id, therapist_id, meetingLink, start_time, end_time]
        );
        res.status(201).json({ meeting: result.rows[0] });
    } catch (error) {
        console.error('Schedule meeting error:', error);
        res.status(500).json({ error: 'Server error while scheduling meeting' });
    }
});

// Get therapist profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const therapistId = decoded.therapistId;
    
    const result = await db.query(
      'SELECT therapist_id, username, email, first_name, last_name, created_at, last_login, is_active FROM therapists WHERE therapist_id = $1',
      [therapistId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Therapist not found' });
    }
    
    res.json({ therapist: result.rows[0] });
  } catch (error) {
    console.error('Get therapist profile error:', error);
    res.status(500).json({ error: 'Failed to get therapist profile' });
  }
});

// Update meeting status when link is clicked
router.put('/meeting/:meetingId/join', async (req, res) => {
  try {
    const { meetingId } = req.params;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const therapistId = decoded.therapistId;
    
    // Update meeting status to completed and mark therapist as busy
    const result = await db.query(
      `UPDATE therapist_meetings 
       SET status = 'completed', end_time = CURRENT_TIMESTAMP 
       WHERE meeting_id = $1 AND therapist_id = $2 
       RETURNING *`,
      [meetingId, therapistId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Meeting not found or not assigned to this therapist' });
    }
    
    // Mark therapist as busy (not available)
    await db.query(
      'UPDATE therapists SET is_active = false WHERE therapist_id = $1',
      [therapistId]
    );
    
    res.json({ 
      success: true, 
      message: 'Meeting marked as completed',
      meeting: result.rows[0]
    });
  } catch (error) {
    console.error('Join meeting error:', error);
    res.status(500).json({ error: 'Failed to update meeting status' });
  }
});

// End session and mark therapist as available
router.put('/meeting/:meetingId/end', async (req, res) => {
  try {
    const { meetingId } = req.params;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const therapistId = decoded.therapistId;
    
    // Mark therapist as available
    await db.query(
      'UPDATE therapists SET is_active = true WHERE therapist_id = $1',
      [therapistId]
    );
    
    res.json({ 
      success: true, 
      message: 'Therapist marked as available'
    });
  } catch (error) {
    console.error('End session error:', error);
    res.status(500).json({ error: 'Failed to end session' });
  }
});

// Get upcoming sessions for therapist
router.get('/sessions/upcoming', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const therapistId = decoded.therapistId;
    
    // Fetch upcoming sessions with proper meeting_id
    const result = await db.query(`
      SELECT 
        tm.meeting_id,
        u.username,
        s.emergency_contact,
        CASE 
          WHEN s.session_id IS NOT NULL THEN 'Individual'
          WHEN c.session_id IS NOT NULL THEN 'Couples'
          WHEN f.session_id IS NOT NULL THEN 'Family'
        END AS therapy_type,
        tm.start_time AS session_time,
        u.meeting_link
      FROM therapist_meetings tm
      JOIN users u ON tm.user_id = u.user_id
      LEFT JOIN individual_therapy_sessions s ON tm.meeting_id = s.session_id
      LEFT JOIN couples_therapy_sessions c ON tm.meeting_id = c.session_id
      LEFT JOIN family_therapy_sessions f ON tm.meeting_id = f.session_id
      WHERE tm.therapist_id = $1 AND tm.status = 'scheduled'
      ORDER BY tm.start_time ASC
    `, [therapistId]);
    
    res.json({
      sessions: result.rows
    });
  } catch (error) {
    console.error('Therapist upcoming sessions error:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Get last 10 completed sessions for therapist
router.get('/sessions/history', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const therapistId = decoded.therapistId;
    // Fetch last 10 completed sessions from all therapy tables
    const individual = await db.query(
      `SELECT s.session_id, u.username, s.emergency_contact, 'Individual' AS therapy_type, s.created_at AS session_time, u.meeting_link
       FROM individual_therapy_sessions s JOIN users u ON s.user_id = u.user_id
       WHERE s.session_id IN (SELECT meeting_id FROM therapist_meetings WHERE therapist_id = $1 AND status = 'completed')
       ORDER BY s.created_at DESC LIMIT 10`, [therapistId]);
    const couples = await db.query(
      `SELECT s.session_id, u.username, s.emergency_contact, 'Couples' AS therapy_type, s.created_at AS session_time, u.meeting_link
       FROM couples_therapy_sessions s JOIN users u ON s.user_id = u.user_id
       WHERE s.session_id IN (SELECT meeting_id FROM therapist_meetings WHERE therapist_id = $1 AND status = 'completed')
       ORDER BY s.created_at DESC LIMIT 10`, [therapistId]);
    const family = await db.query(
      `SELECT s.session_id, u.username, s.emergency_contact, 'Family' AS therapy_type, s.created_at AS session_time, u.meeting_link
       FROM family_therapy_sessions s JOIN users u ON s.user_id = u.user_id
       WHERE s.session_id IN (SELECT meeting_id FROM therapist_meetings WHERE therapist_id = $1 AND status = 'completed')
       ORDER BY s.created_at DESC LIMIT 10`, [therapistId]);
    // Merge and sort by session_time, limit to 10
    const all = [...individual.rows, ...couples.rows, ...family.rows]
      .sort((a, b) => new Date(b.session_time) - new Date(a.session_time))
      .slice(0, 10);
    res.json({
      history: all
    });
  } catch (error) {
    console.error('Therapist session history error:', error);
    res.status(500).json({ error: 'Failed to fetch session history' });
  }
});

// Admin: Get all users
router.get('/admin/users', async (req, res) => {
    try {
        const result = await db.query('SELECT user_id, username, email FROM users ORDER BY username');
        res.json({ users: result.rows });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Admin: Get all therapists
router.get('/admin/therapists', async (req, res) => {
    try {
        const result = await db.query('SELECT therapist_id, username, email FROM therapists ORDER BY username');
        res.json({ therapists: result.rows });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch therapists' });
    }
});

module.exports = router; 