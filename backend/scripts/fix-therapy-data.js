const db = require('../config/database');

async function fixTherapyData() {
  try {
    console.log('🔧 Fixing therapy data...');
    
    // Fix individual therapy sessions
    console.log('📋 Fixing individual therapy sessions...');
    const individualSessions = await db.query(`
      SELECT s.session_id, tm.meeting_id, tm.meeting_link
      FROM individual_therapy_sessions s
      JOIN therapist_meetings tm ON s.user_id = tm.user_id 
      WHERE tm.status = 'scheduled' 
      AND s.session_id != tm.meeting_id
    `);
    
    for (const session of individualSessions.rows) {
      await db.query(
        'UPDATE individual_therapy_sessions SET session_id = $1 WHERE session_id = $2',
        [session.meeting_id, session.session_id]
      );
      console.log(`✅ Fixed individual session: ${session.session_id} → ${session.meeting_id}`);
    }
    
    // Fix couples therapy sessions
    console.log('📋 Fixing couples therapy sessions...');
    const couplesSessions = await db.query(`
      SELECT s.session_id, tm.meeting_id, tm.meeting_link
      FROM couples_therapy_sessions s
      JOIN therapist_meetings tm ON s.user_id = tm.user_id 
      WHERE tm.status = 'scheduled' 
      AND s.session_id != tm.meeting_id
    `);
    
    for (const session of couplesSessions.rows) {
      await db.query(
        'UPDATE couples_therapy_sessions SET session_id = $1 WHERE session_id = $2',
        [session.meeting_id, session.session_id]
      );
      console.log(`✅ Fixed couples session: ${session.session_id} → ${session.meeting_id}`);
    }
    
    // Fix family therapy sessions
    console.log('📋 Fixing family therapy sessions...');
    const familySessions = await db.query(`
      SELECT s.session_id, tm.meeting_id, tm.meeting_link
      FROM family_therapy_sessions s
      JOIN therapist_meetings tm ON s.user_id = tm.user_id 
      WHERE tm.status = 'scheduled' 
      AND s.session_id != tm.meeting_id
    `);
    
    for (const session of familySessions.rows) {
      await db.query(
        'UPDATE family_therapy_sessions SET session_id = $1 WHERE session_id = $2',
        [session.meeting_id, session.session_id]
      );
      console.log(`✅ Fixed family session: ${session.session_id} → ${session.meeting_id}`);
    }
    
    console.log('🎉 All therapy data has been fixed!');
    
    // Show summary
    const individualCount = await db.query('SELECT COUNT(*) as count FROM individual_therapy_sessions');
    const couplesCount = await db.query('SELECT COUNT(*) as count FROM couples_therapy_sessions');
    const familyCount = await db.query('SELECT COUNT(*) as count FROM family_therapy_sessions');
    const meetingsCount = await db.query('SELECT COUNT(*) as count FROM therapist_meetings');
    
    console.log(`📊 Summary:`);
    console.log(`   Individual sessions: ${individualCount.rows[0].count}`);
    console.log(`   Couples sessions: ${couplesCount.rows[0].count}`);
    console.log(`   Family sessions: ${familyCount.rows[0].count}`);
    console.log(`   Therapist meetings: ${meetingsCount.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error fixing therapy data:', error);
  } finally {
    process.exit(0);
  }
}

fixTherapyData(); 