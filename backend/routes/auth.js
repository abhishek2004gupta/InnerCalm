const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { google } = require('googleapis');

// Helper to create a Google Meet link via Calendar API
async function createGoogleMeetLink(email) {
    try {
        const oAuth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_MEET_CLIENT_ID,
            process.env.GOOGLE_MEET_CLIENT_SECRET,
            process.env.GOOGLE_MEET_REDIRECT_URI
        );
        // For demo: use a stored refresh token or prompt for consent (production: use a service account or user consent flow)
        // You must obtain a refresh token for a Google account with Calendar access and set it in .env as GOOGLE_MEET_REFRESH_TOKEN
        if (process.env.GOOGLE_MEET_REFRESH_TOKEN) {
            oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_MEET_REFRESH_TOKEN });
        } else {
            throw new Error('No Google refresh token set. Set GOOGLE_MEET_REFRESH_TOKEN in .env.');
        }
        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
        const event = {
            summary: 'Therapy Session',
            description: 'Scheduled via InnerCalm',
            start: { dateTime: new Date(Date.now() + 5 * 60000).toISOString() }, // 5 min from now
            end: { dateTime: new Date(Date.now() + 35 * 60000).toISOString() }, // 35 min from now
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

// Register
router.post('/register', async (req, res) => {
    try {
        console.log('Register request received:', req.body);
        const { username, email, password, firstName, lastName } = req.body;

        // Validate input
        if (!username || !email || !password) {
            console.log('Missing required fields');
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user already exists
        const userCheck = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (userCheck.rows.length > 0) {
            console.log('User already exists:', email);
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate real Google Meet link
        let meetingLink = await createGoogleMeetLink(email);
        if (!meetingLink) {
            meetingLink = `https://meet.google.com/${Math.random().toString(36).substring(2, 9)}`;
        }

        // Create user with coins and meeting_link
        const result = await db.query(
            'INSERT INTO users (username, email, password_hash, first_name, last_name, coins, meeting_link) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id, username, email, coins, meeting_link',
            [username, email, hashedPassword, firstName, lastName, 100, meetingLink]
        );

        // Generate token
        const token = jwt.sign(
            { userId: result.rows[0].user_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('User registered successfully:', email);
        res.status(201).json({
            token,
            user: {
                id: result.rows[0].user_id,
                username: result.rows[0].username,
                email: result.rows[0].email,
                coins: result.rows[0].coins,
                meeting_link: result.rows[0].meeting_link
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        console.log('Login request received:', req.body);
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            console.log('Missing email or password');
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Get user
        const result = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            console.log('User not found:', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // Check password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            console.log('Invalid password for user:', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login
        await db.query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1',
            [user.user_id]
        );

        // Generate token
        const token = jwt.sign(
            { userId: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('User logged in successfully:', email);
        res.json({
            token,
            user: {
                id: user.user_id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Get user profile
router.get('/profile', async (req, res) => {
    try {
        console.log('Profile request received');
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const result = await db.query(
            'SELECT user_id, username, email, first_name, last_name FROM users WHERE user_id = $1',
            [decoded.userId]
        );

        if (result.rows.length === 0) {
            console.log('User not found:', decoded.userId);
            return res.status(404).json({ error: 'User not found' });
        }

        console.log('Profile retrieved successfully for user:', decoded.userId);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Profile error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        res.status(500).json({ error: 'Server error while fetching profile' });
    }
});

// User Dashboard: Get meeting link and all sessions
router.get('/dashboard', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Get user info
        const userResult = await db.query('SELECT user_id, username, email, coins, meeting_link FROM users WHERE user_id = $1', [decoded.userId]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Get all meetings for this user
        const meetingsResult = await db.query(
            `SELECT tm.meeting_id, tm.therapist_id, t.username AS therapist_username, t.email AS therapist_email, tm.meeting_link, tm.start_time, tm.end_time, tm.status
             FROM therapist_meetings tm
             JOIN therapists t ON tm.therapist_id = t.therapist_id
             WHERE tm.user_id = $1
             ORDER BY tm.start_time DESC`,
            [decoded.userId]
        );
        res.json({
            user: userResult.rows[0],
            meetings: meetingsResult.rows
        });
    } catch (error) {
        console.error('User dashboard error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        res.status(500).json({ error: 'Server error while fetching dashboard' });
    }
});

// Google OAuth2 callback to get refresh token
router.get('/google/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send('No code provided');
  }
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_MEET_CLIENT_ID,
    process.env.GOOGLE_MEET_CLIENT_SECRET,
    process.env.GOOGLE_MEET_REDIRECT_URI
  );
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    console.log('Your refresh token is:', tokens.refresh_token);
    res.send('Refresh token received! Check your server logs and add it to your .env as GOOGLE_MEET_REFRESH_TOKEN.');
  } catch (err) {
    console.error('Error exchanging code for token:', err);
    res.status(500).send('Failed to get tokens');
  }
});

module.exports = router; 