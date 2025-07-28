const express = require('express');
const router = express.Router();
const db = require('../config/database');
const jwt = require('jsonwebtoken');

// Helper function to assign therapist to a session
async function assignTherapist(userId, sessionId, therapyType) {
  try {
    // First, check if user has a previous therapist
    const previousTherapist = await db.query(
      `SELECT therapist_id FROM therapist_meetings 
       WHERE user_id = $1 AND status = 'completed' 
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );

    let therapistId = null;
    
    if (previousTherapist.rows.length > 0) {
      // Assign to previous therapist if available
      therapistId = previousTherapist.rows[0].therapist_id;
      
      // Check if this therapist is active
      const therapistActive = await db.query(
        'SELECT therapist_id FROM therapists WHERE therapist_id = $1 AND is_active = true',
        [therapistId]
      );
      
      if (therapistActive.rows.length === 0) {
        therapistId = null; // Previous therapist is not active
      }
    }

    // If no previous therapist or previous therapist is inactive, find available therapist
    if (!therapistId) {
      const availableTherapist = await db.query(
        `SELECT t.therapist_id FROM therapists t
         WHERE t.is_active = true
         AND t.therapist_id NOT IN (
           SELECT DISTINCT tm.therapist_id FROM therapist_meetings tm
           WHERE tm.status = 'scheduled' 
           AND tm.start_time BETWEEN NOW() AND NOW() + INTERVAL '1 hour'
         )
         AND t.therapist_id NOT IN (
           SELECT DISTINCT tm.therapist_id FROM therapist_meetings tm
           WHERE tm.status = 'completed' 
           AND tm.end_time > NOW() - INTERVAL '1 hour'
         )
         ORDER BY (
           SELECT COUNT(*) FROM therapist_meetings tm2 
           WHERE tm2.therapist_id = t.therapist_id AND tm2.status = 'scheduled'
         ) ASC
         LIMIT 1`,
        []
      );
      
      if (availableTherapist.rows.length > 0) {
        therapistId = availableTherapist.rows[0].therapist_id;
      }
    }

    // If still no therapist found, assign to any active therapist who is not busy
    if (!therapistId) {
      const anyTherapist = await db.query(
        `SELECT therapist_id FROM therapists 
         WHERE is_active = true 
         AND therapist_id NOT IN (
           SELECT DISTINCT therapist_id FROM therapist_meetings 
           WHERE status = 'scheduled' OR (status = 'completed' AND end_time > NOW() - INTERVAL '1 hour')
         )
         LIMIT 1`,
        []
      );
      if (anyTherapist.rows.length > 0) {
        therapistId = anyTherapist.rows[0].therapist_id;
      }
    }

    if (therapistId) {
      // Get user's meeting link
      const userResult = await db.query('SELECT meeting_link FROM users WHERE user_id = $1', [userId]);
      const meetingLink = userResult.rows[0]?.meeting_link;
      
      if (meetingLink) {
        // Create therapist meeting record using user's existing meeting link
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour session
        
        const meetingResult = await db.query(
          `INSERT INTO therapist_meetings (user_id, therapist_id, meeting_link, start_time, end_time, status) 
           VALUES ($1, $2, $3, $4, $5, 'scheduled') RETURNING meeting_id`,
          [userId, therapistId, meetingLink, startTime, endTime]
        );
        
        if (meetingResult.rows.length > 0) {
          const meetingId = meetingResult.rows[0].meeting_id;
          
          // Update the session with the meeting_id
          if (therapyType === 'individual') {
            await db.query(
              'UPDATE individual_therapy_sessions SET session_id = $1 WHERE session_id = $2',
              [meetingId, sessionId]
            );
          } else if (therapyType === 'couples') {
            await db.query(
              'UPDATE couples_therapy_sessions SET session_id = $1 WHERE session_id = $2',
              [meetingId, sessionId]
            );
          } else if (therapyType === 'family') {
            await db.query(
              'UPDATE family_therapy_sessions SET session_id = $1 WHERE session_id = $2',
              [meetingId, sessionId]
            );
          }
        }
        
        return therapistId;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Therapist assignment error:', error);
    return null;
  }
}

// Individual Therapy Form Submission
router.post('/individual', async (req, res) => {
  try {
    const { userId, name, email, phone, age, occupation, mainConcerns, goals, emergencyContact } = req.body;
    
    // Get user's meeting link
    const userResult = await db.query('SELECT meeting_link FROM users WHERE user_id = $1', [userId]);
    const meetingLink = userResult.rows[0]?.meeting_link;
    
    // Insert therapy session
    const result = await db.query(
      `INSERT INTO individual_therapy_sessions (user_id, name, email, phone, age, occupation, main_concerns, goals, emergency_contact) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING session_id`,
      [userId, name, email, phone, age, occupation, mainConcerns, goals, emergencyContact]
    );
    
    const sessionId = result.rows[0].session_id;
    
    // Assign therapist to the session
    const therapistId = await assignTherapist(userId, sessionId, 'individual');
    
    res.json({ 
      success: true, 
      sessionId, 
      meetingLink,
      therapistAssigned: !!therapistId 
    });
  } catch (error) {
    console.error('Individual therapy form error:', error);
    res.status(500).json({ success: false, error: 'Failed to submit form.' });
  }
});

// Couples Therapy Form Submission
router.post('/couples', async (req, res) => {
  try {
    const { userId, partner1Name, partner2Name, email, phone, relationshipDuration, mainConcerns, goals, emergencyContact } = req.body;
    
    // Get user's meeting link
    const userResult = await db.query('SELECT meeting_link FROM users WHERE user_id = $1', [userId]);
    const meetingLink = userResult.rows[0]?.meeting_link;
    
    // Insert therapy session
    const result = await db.query(
      `INSERT INTO couples_therapy_sessions (user_id, partner1_name, partner2_name, email, phone, relationship_duration, main_concerns, goals, emergency_contact) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING session_id`,
      [userId, partner1Name, partner2Name, email, phone, relationshipDuration, mainConcerns, goals, emergencyContact]
    );
    
    const sessionId = result.rows[0].session_id;
    
    // Assign therapist to the session
    const therapistId = await assignTherapist(userId, sessionId, 'couples');
    
    res.json({ 
      success: true, 
      sessionId, 
      meetingLink,
      therapistAssigned: !!therapistId 
    });
  } catch (error) {
    console.error('Couples therapy form error:', error);
    res.status(500).json({ success: false, error: 'Failed to submit form.' });
  }
});

// Family Therapy Form Submission
router.post('/family', async (req, res) => {
  try {
    const { userId, familyName, email, phone, familySize, childrenAges, mainConcerns, goals, emergencyContact } = req.body;
    
    // Get user's meeting link
    const userResult = await db.query('SELECT meeting_link FROM users WHERE user_id = $1', [userId]);
    const meetingLink = userResult.rows[0]?.meeting_link;
    
    // Insert therapy session
    const result = await db.query(
      `INSERT INTO family_therapy_sessions (user_id, family_name, email, phone, family_size, children_ages, main_concerns, goals, emergency_contact) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING session_id`,
      [userId, familyName, email, phone, familySize, childrenAges, mainConcerns, goals, emergencyContact]
    );
    
    const sessionId = result.rows[0].session_id;
    
    // Assign therapist to the session
    const therapistId = await assignTherapist(userId, sessionId, 'family');
    
    res.json({ 
      success: true, 
      sessionId, 
      meetingLink,
      therapistAssigned: !!therapistId 
    });
  } catch (error) {
    console.error('Family therapy form error:', error);
    res.status(500).json({ success: false, error: 'Failed to submit form.' });
  }
});

module.exports = router; 