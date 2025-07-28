import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../services/authService';
import '../styles/Profile.css';

const Profile = () => {
    const [dashboard, setDashboard] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('overview');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                
                // Fetch dashboard data
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/auth/dashboard`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) setDashboard(data);
                else setError(data.error || 'Failed to load dashboard');

                // Fetch session history
                const historyRes = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/auth/sessions/history`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const historyData = await historyRes.json();
                if (historyRes.ok) setHistory(historyData.history);
            } catch (e) {
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleJoinMeeting = async (meetingId, meetingLink) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/auth/meeting/${meetingId}/join`, {
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

    if (loading) {
        return (
            <div className="user-dashboard">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) return <div className="profile-error">{error}</div>;
    if (!dashboard) return <div>Loading...</div>;

    const { user, meetings } = dashboard;

    return (
        <div className="user-dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-content">
                    <div className="header-left">
                        <h1>👤 User Dashboard</h1>
                        <p>Welcome back, {user.first_name || 'User'}!</p>
                    </div>
                    <div className="header-right">
                        <div className="profile-info">
                            <span className="user-name">{user.first_name} {user.last_name}</span>
                            <span className="user-email">{user.email}</span>
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
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                        <h3>{user.coins}</h3>
                        <p>Available Coins</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📅</div>
                    <div className="stat-content">
                        <h3>{meetings.filter(m => m.status === 'scheduled').length}</h3>
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
            </div>

            {/* Navigation Tabs */}
            <div className="tab-navigation">
                <button 
                    className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    📊 Overview
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'sessions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('sessions')}
                >
                    📅 My Sessions
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    📋 Session History
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
                {activeTab === 'overview' && (
                    <div className="overview-section">
                        <h2>📊 Dashboard Overview</h2>
                        <div className="overview-grid">
                            <div className="overview-card">
                                <h3>🎥 Your Meeting Link</h3>
                                <div className="meeting-link-container">
                                    <a href={user.meeting_link} target="_blank" rel="noopener noreferrer" className="meeting-link-btn">
                                        🎥 Join Your Meeting
                                    </a>
                                    <p className="meeting-info">Share this link with your therapist when needed</p>
                                </div>
                            </div>
                            <div className="overview-card">
                                <h3>💰 Coin Balance</h3>
                                <div className="coin-display">
                                    <span className="coin-amount">{user.coins}</span>
                                    <span className="coin-label">coins available</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'sessions' && (
                    <div className="sessions-section">
                        <h2>📅 My Sessions</h2>
                        {meetings.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">📭</div>
                                <h3>No scheduled sessions</h3>
                                <p>You don't have any scheduled sessions at the moment.</p>
                            </div>
                        ) : (
                            <div className="sessions-grid">
                                {meetings.map((meeting, index) => (
                                    <div key={index} className="session-card">
                                        <div className="session-header">
                                            <div className="session-type">Therapy Session</div>
                                            <div className={`session-status ${meeting.status}`}>{meeting.status}</div>
                                        </div>
                                        <div className="session-details">
                                            <div className="detail-item">
                                                <span className="label">👨‍⚕️ Therapist:</span>
                                                <span className="value">{meeting.therapist_username}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="label">📧 Email:</span>
                                                <span className="value">{meeting.therapist_email}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="label">🕒 Start:</span>
                                                <span className="value">{meeting.start_time ? new Date(meeting.start_time).toLocaleString() : 'TBD'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="label">⏰ End:</span>
                                                <span className="value">{meeting.end_time ? new Date(meeting.end_time).toLocaleString() : 'TBD'}</span>
                                            </div>
                                        </div>
                                        <div className="session-actions">
                                            <button 
                                                className="join-meeting-btn"
                                                onClick={() => handleJoinMeeting(meeting.meeting_id, meeting.meeting_link)}
                                            >
                                                🎥 Join Meeting
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
                        <h2>📋 Session History</h2>
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
                                                <span className="label">👨‍⚕️ Therapist:</span>
                                                <span className="value">{session.therapist_name}</span>
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
                        <h2>👤 User Profile</h2>
                        <div className="profile-card">
                            <div className="profile-avatar">
                                <span className="avatar-text">{user.first_name?.charAt(0)}{user.last_name?.charAt(0)}</span>
                            </div>
                            <div className="profile-details">
                                <div className="detail-row">
                                    <span className="label">Name:</span>
                                    <span className="value">{user.first_name} {user.last_name}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Email:</span>
                                    <span className="value">{user.email}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Username:</span>
                                    <span className="value">{user.username}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Coins:</span>
                                    <span className="value coin-value">{user.coins}</span>
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

export default Profile; 