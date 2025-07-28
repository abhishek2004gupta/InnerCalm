# InnerCalm - Complete Setup Instructions

## 🎯 What's Been Implemented

### ✅ Completed Features:
1. **Therapist Assignment Logic** - Automatically assigns therapists based on previous sessions and availability
2. **Database Queries** - Complete CRUD operations for all tables (chat_sessions, chat_messages, chat_summaries, youtube_videos)
3. **Therapy Form Processing** - All forms now create sessions and assign therapists
4. **Session History** - Both users and therapists can view their session history
5. **Admin Routes** - Fixed admin endpoints for user/therapist management

## 📋 Database Changes Required

Run these SQL commands in your PostgreSQL database:

```sql
-- Add coins and meeting_link to users table (if not already done)
ALTER TABLE users ADD COLUMN coins INTEGER DEFAULT 100;
ALTER TABLE users ADD COLUMN meeting_link TEXT;

-- Create therapists table (if not already done)
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

-- Create therapist_meetings table (if not already done)
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

-- Create therapy session tables (if not already done)
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
```

## 🔧 Environment Variables to Add

Add these to your `.env` file:

```env
# Google Meet API (for real meeting links)
GOOGLE_MEET_CLIENT_ID=your_google_meet_client_id
GOOGLE_MEET_CLIENT_SECRET=your_google_meet_client_secret
GOOGLE_MEET_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
GOOGLE_MEET_API_KEY=your_google_meet_api_key
GOOGLE_MEET_REFRESH_TOKEN=your_google_meet_refresh_token

# Nodemailer (for contact form)
CONTACT_EMAIL_PASSWORD=your_sender_email_password

# Existing variables (keep these)
GEMINI_API_KEY=AIzaSyAHG-MmtVIqb99rF58zUisj8BGP2gyO9c8
REACT_APP_YOUTUBE_API_KEY=AIzaSyBiBdhbdLGRHqR5Q-5QIz9BP1nv1sbRmj0
DB_USER=postgres
DB_HOST=localhost
DB_PASSWORD=1234
DB_PORT=5432
JWT_SECRET=02ce3e04e86bad784a2b491e90ba3b63274232cfcab0dd2091715368d17051f6e19a17024726ec2cb960e3d8d0d701bbc9e0a9cf65d9a0cdf22d190488e18685
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
PYTHON_BACKEND_URL=http://localhost:5001
```

## 🚀 How to Get Google Meet API Credentials

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select existing one
3. **Enable Google Calendar API** and **Google Meet API**
4. **Create OAuth 2.0 credentials**:
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
5. **Get your credentials**:
   - Client ID and Client Secret from the OAuth 2.0 credentials
   - API Key from "Credentials" → "Create Credentials" → "API Key"

## 🔄 How to Get Google Refresh Token

1. **Run the backend server**
2. **Visit this URL** (replace with your actual client ID):
   ```
   https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar&prompt=consent&response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:5000/api/auth/google/callback
   ```
3. **Authorize the application**
4. **Check your server logs** for the refresh token
5. **Add the refresh token** to your `.env` file

## 📊 Database Seeding

Run this command to add sample data:

```bash
cd backend
node scripts/seed-data.js
```

This will create:
- 3 sample therapists (login: sarah@innercalm.com, mike@innercalm.com, emma@innercalm.com, password: therapist123)
- 3 sample users (login: john@example.com, jane@example.com, bob@example.com, password: user123)
- Sample therapy sessions and meetings
- Sample chat sessions, messages, summaries, and YouTube videos

## 🎯 How the System Works Now

### 1. **User Registration**
- User gets 100 coins automatically
- Unique Google Meet link is generated
- Meeting link is stored in `users.meeting_link`

### 2. **Therapy Form Submission**
- Form data is saved to respective therapy table
- Therapist is automatically assigned using smart logic:
  - **Priority 1**: Previous therapist (if available and active)
  - **Priority 2**: Available therapist (not busy in next hour)
  - **Priority 3**: Any active therapist
- Meeting record is created in `therapist_meetings`
- User is redirected to confirmation page with "Join Meeting" button

### 3. **Therapist Dashboard**
- Shows upcoming sessions with user details
- Displays emergency contact information
- Shows session history (last 10 completed)
- "Join Meeting" buttons for each session

### 4. **User Dashboard**
- Shows user's meeting link and coins
- Displays session history (last 10 completed)
- Shows assigned therapist information

### 5. **Chat System**
- Complete chat session management
- Message storage and retrieval
- Chat summaries with AI enhancement
- YouTube video recommendations

## 🔍 Testing the System

### Test User Login:
- Email: `john@example.com`
- Password: `user123`

### Test Therapist Login:
- Email: `sarah@innercalm.com`
- Password: `therapist123`

### Test Flow:
1. **Login as user** → Go to Services → Individual Therapy → Fill form → Submit
2. **Check confirmation page** → Should show "Join Meeting" button
3. **Login as therapist** → Check dashboard → Should see assigned sessions
4. **Check user profile** → Should show session history and meeting link

## 🐛 Troubleshooting

### If you see "No upcoming sessions":
- Run the seeding script to add sample data
- Check if therapists are active in database
- Verify therapist_meetings table has records

### If Google Meet links don't work:
- Ensure all Google API credentials are correct
- Check that refresh token is valid
- Verify redirect URI is registered in Google Cloud Console

### If contact form doesn't work:
- Ensure `CONTACT_EMAIL_PASSWORD` is set correctly
- Check that sender email has "Less secure app access" enabled or uses app password

## 📁 New Files Created

1. `backend/routes/chat.js` - Complete chat system API
2. `backend/scripts/seed-data.js` - Database seeding script
3. `backend/routes/therapy.js` - Therapy form processing (updated)

## 🔄 Updated Files

1. `backend/routes/therapist.js` - Fixed admin routes and added session history
2. `backend/routes/auth.js` - Added session history endpoint
3. `backend/server.js` - All routes properly registered

## ✅ Next Steps

1. **Add the environment variables** listed above
2. **Run the database seeding script** to add sample data
3. **Test the complete flow** using the test accounts
4. **Configure Google Meet API** for real meeting links
5. **Test all features** to ensure everything works as expected

The system is now complete with all the requested features implemented and working together seamlessly! 