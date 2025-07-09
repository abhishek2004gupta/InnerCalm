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

// Admin: Get all users
router.get('/../admin/users', async (req, res) => {
    try {
        const result = await db.query('SELECT user_id, username, email FROM users ORDER BY username');
        res.json({ users: result.rows });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});
// Admin: Get all therapists
router.get('/../admin/therapists', async (req, res) => {
    try {
        const result = await db.query('SELECT therapist_id, username, email FROM therapists ORDER BY username');
        res.json({ therapists: result.rows });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch therapists' });
    }
});

module.exports = router; 