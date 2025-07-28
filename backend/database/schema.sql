-- Create database
CREATE DATABASE innercalm;

-- Connect to the database
\c innercalm;

-- Create users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- Create chat_sessions table
CREATE TABLE chat_sessions (
    session_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create chat_messages table
CREATE TABLE chat_messages (
    message_id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES chat_sessions(session_id),
    sender_type VARCHAR(10) CHECK (sender_type IN ('user', 'bot')),
    message_text TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create chat_summaries table
CREATE TABLE chat_summaries (
    summary_id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES chat_sessions(session_id),
    enhanced_summary TEXT,
    suggestions TEXT,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create youtube_videos table
CREATE TABLE youtube_videos (
    video_id SERIAL PRIMARY KEY,
    summary_id INTEGER REFERENCES chat_summaries(summary_id),
    youtube_video_id VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    thumbnail_url TEXT,
    video_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create meeting_schedules table
CREATE TABLE meeting_schedules (
    meeting_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_preferences table
CREATE TABLE user_preferences (
    preference_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    theme VARCHAR(20) DEFAULT 'light',
    notification_enabled BOOLEAN DEFAULT true,
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add coins and meeting_link to users table
ALTER TABLE users ADD COLUMN coins INTEGER DEFAULT 100;
ALTER TABLE users ADD COLUMN meeting_link TEXT;

-- Therapists table
CREATE TABLE therapists (
    therapist_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- Therapist meetings table
CREATE TABLE therapist_meetings (
    meeting_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    therapist_id INTEGER REFERENCES therapists(therapist_id),
    meeting_link TEXT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_summaries_session_id ON chat_summaries(session_id);
CREATE INDEX idx_youtube_videos_summary_id ON youtube_videos(summary_id);
CREATE INDEX idx_meeting_schedules_user_id ON meeting_schedules(user_id);
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 


-- schema for the meetings table --
CREATE TABLE individual_therapy_sessions (
    session_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    age INTEGER,
    occupation VARCHAR(100),
    main_concerns TEXT,
    goals TEXT,
    emergency_contact VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE couples_therapy_sessions (
    session_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    partner1_name VARCHAR(100) NOT NULL,
    partner2_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    relationship_duration VARCHAR(50),
    main_concerns TEXT,
    goals TEXT,
    emergency_contact VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE family_therapy_sessions (
    session_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    family_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    family_size VARCHAR(10),
    children_ages VARCHAR(100),
    main_concerns TEXT,
    goals TEXT,
    emergency_contact VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);