const db = require('../config/database');

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const result = await db.query('SELECT NOW()');
    console.log('✅ Database connection successful:', result.rows[0]);
    
    // Check if tables exist
    const tables = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    console.log('📋 Available tables:', tables.rows.map(row => row.table_name));
    
    // Check users table
    const users = await db.query('SELECT COUNT(*) as count FROM users');
    console.log('👥 Users count:', users.rows[0].count);
    
    // Check therapists table
    const therapists = await db.query('SELECT COUNT(*) as count FROM therapists');
    console.log('👨‍⚕️ Therapists count:', therapists.rows[0].count);
    
    // Check chat_sessions table
    const chatSessions = await db.query('SELECT COUNT(*) as count FROM chat_sessions');
    console.log('💬 Chat sessions count:', chatSessions.rows[0].count);
    
    // Check chat_messages table
    const chatMessages = await db.query('SELECT COUNT(*) as count FROM chat_messages');
    console.log('💭 Chat messages count:', chatMessages.rows[0].count);
    
    // Check chat_summaries table
    const chatSummaries = await db.query('SELECT COUNT(*) as count FROM chat_summaries');
    console.log('📝 Chat summaries count:', chatSummaries.rows[0].count);
    
    // Check therapist_meetings table
    const therapistMeetings = await db.query('SELECT COUNT(*) as count FROM therapist_meetings');
    console.log('🤝 Therapist meetings count:', therapistMeetings.rows[0].count);
    
    console.log('✅ Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    process.exit(0);
  }
}

testDatabase(); 