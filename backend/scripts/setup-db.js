const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'innercalm',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function setupDatabase() {
    try {
        // Read SQL file
        const sqlFile = path.join(__dirname, '../config/database.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');

        // Execute SQL commands
        await pool.query(sql);
        console.log('Database setup completed successfully');
    } catch (error) {
        console.error('Error setting up database:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

setupDatabase(); 