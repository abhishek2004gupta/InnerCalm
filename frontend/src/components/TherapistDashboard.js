import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TherapistDashboard.css';

const TherapistDashboard = () => {
    const [upcoming, setUpcoming] = useState([]);
    const [history, setHistory] = useState([]);
    const [therapist, setTherapist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('upcoming');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('therapist_token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                
                // Fetch therapist profile
                const profileRes = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/therapist/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    setTherapist(profileData.therapist);
                }

                // Fetch upcoming sessions
                const upcomingRes = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/therapist/sessions/upcoming`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const upcomingData = await upcomingRes.json();
                if (upcomingRes.ok) setUpcoming(upcomingData.sessions);
                else setError(upcomingData.error || 'Failed to load upcoming sessions');

                // Fetch session history
                const historyRes = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/therapist/sessions/history`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const historyData = await historyRes.json();
                if (historyRes.ok) setHistory(historyData.history);
                else setError(historyData.error || 'Failed to load session history');

            } catch (e) {
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('therapist_token');
        navigate('/login');
    };

    const handleJoinMeeting = async (meetingId, meetingLink) => {
        try {
            const token = localStorage.getItem('therapist_token');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/therapist/meeting/${meetingId}/join`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.ok) {
                // Open meeting link
                window.open(meetingLink, '_blank');
                // Refresh dashboard data
                window.location.reload();
            }
        } catch (error) {
            console.error('Failed to join meeting:', error);
        }
    };

    const handleEndSession = async (meetingId) => {
        try {
            const token = localStorage.getItem('therapist_token');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/therapist/meeting/${meetingId}/end`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.ok) {
                // Refresh dashboard data
                window.location.reload();
            }
        } catch (error) {
            console.error('Failed to end session:', error);
        }
    };

    if (loading) {
        return (
            <div className="therapist-dashboard">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="therapist-dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-content">
                    <div className="header-left">
                        <h1>🧑‍⚕️ Therapist Dashboard</h1>
                        <p>Welcome back, {therapist?.first_name || 'Therapist'}!</p>
                    </div>
                    <div className="header-right">
                        <div className="profile-info">
                            <span className="therapist-name">{therapist?.first_name} {therapist?.last_name}</span>
                            <span className="therapist-email">{therapist?.email}</span>
                        </div>
                        <button onClick={handleLogout} className="logout-btn">
                            <span>🚪</span> Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="stats-section">
                <div className="stat-card">
                    <div className="stat-icon">📅</div>
                    <div className="stat-content">
                        <h3>{upcoming.length}</h3>
                        <p>Upcoming Sessions</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <h3>{history.length}</h3>
                        <p>Completed Sessions</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <h3>{upcoming.length + history.length}</h3>
                        <p>Total Sessions</p>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="tab-navigation">
                <button 
                    className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
                    onClick={() => setActiveTab('upcoming')}
                >
                    📅 Upcoming Sessions
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    📊 Session History
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    👤 Profile
                </button>
            </div>

            {/* Content Sections */}
            <div className="dashboard-content">
                {activeTab === 'upcoming' && (
                    <div className="sessions-section">
                        <h2>📅 Upcoming Sessions</h2>
                        {upcoming.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">📭</div>
                                <h3>No upcoming sessions</h3>
                                <p>You don't have any scheduled sessions at the moment.</p>
                            </div>
                        ) : (
                            <div className="sessions-grid">
                                {upcoming.map((session, index) => (
                                    <div key={index} className="session-card upcoming">
                                        <div className="session-header">
                                            <div className="session-type">{session.therapy_type}</div>
                                            <div className="session-status scheduled">Scheduled</div>
                                        </div>
                                        <div className="session-details">
                                            <div className="detail-item">
                                                <span className="label">👤 Patient:</span>
                                                <span className="value">{session.username}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="label">📞 Emergency:</span>
                                                <span className="value">{session.emergency_contact}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="label">🕒 Time:</span>
                                                <span className="value">{new Date(session.session_time).toLocaleString()}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="label">🔗 Meeting ID:</span>
                                                <span className="value">{session.meeting_id}</span>
                                            </div>
                                        </div>
                                        <div className="session-actions">
                                            <button 
                                                className="join-meeting-btn"
                                                onClick={() => handleJoinMeeting(session.meeting_id, session.meeting_link)}
                                            >
                                                🎥 Join Meeting
                                            </button>
                                            <button 
                                                className="end-session-btn"
                                                onClick={() => handleEndSession(session.meeting_id)}
                                            >
                                                ✅ End Session
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="sessions-section">
                        <h2>📊 Session History</h2>
                        {history.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">📋</div>
                                <h3>No completed sessions</h3>
                                <p>Your completed sessions will appear here.</p>
                            </div>
                        ) : (
                            <div className="sessions-grid">
                                {history.map((session, index) => (
                                    <div key={index} className="session-card completed">
                                        <div className="session-header">
                                            <div className="session-type">{session.therapy_type}</div>
                                            <div className="session-status completed">Completed</div>
                                        </div>
                                        <div className="session-details">
                                            <div className="detail-item">
                                                <span className="label">👤 Patient:</span>
                                                <span className="value">{session.username}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="label">📞 Emergency:</span>
                                                <span className="value">{session.emergency_contact}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="label">🕒 Completed:</span>
                                                <span className="value">{new Date(session.session_time).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="session-actions">
                                            <button className="view-details-btn">
                                                📋 View Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="profile-section">
                        <h2>👤 Therapist Profile</h2>
                        <div className="profile-card">
                            <div className="profile-avatar">
                                <span className="avatar-text">{therapist?.first_name?.charAt(0)}{therapist?.last_name?.charAt(0)}</span>
                            </div>
                            <div className="profile-details">
                                <div className="detail-row">
                                    <span className="label">Name:</span>
                                    <span className="value">{therapist?.first_name} {therapist?.last_name}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Email:</span>
                                    <span className="value">{therapist?.email}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Username:</span>
                                    <span className="value">{therapist?.username}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Status:</span>
                                    <span className="value status-active">Active</span>
                                </div>
                            </div>
                            <div className="profile-actions">
                                <button className="edit-profile-btn">✏️ Edit Profile</button>
                                <button className="change-password-btn">🔒 Change Password</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="error-message">
                    <span>⚠️</span> {error}
                </div>
            )}
        </div>
    );
};

export default TherapistDashboard; 