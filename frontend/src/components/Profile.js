import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../services/authService';
import '../styles/Profile.css';

const Profile = () => {
    const [dashboard, setDashboard] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/auth/dashboard`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) setDashboard(data);
                else setError(data.error || 'Failed to load dashboard');
            } catch (e) {
                setError('Failed to load dashboard');
            }
        };
        fetchDashboard();
    }, []);

    if (error) return <div className="profile-error">{error}</div>;
    if (!dashboard) return <div>Loading...</div>;
    const { user, meetings } = dashboard;
    return (
        <div className="profile-page">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar-lg">{user.first_name?.[0] || 'U'}</div>
                    <div>
                        <h2>{user.first_name} {user.last_name}</h2>
                        <p className="profile-username">@{user.username}</p>
                        <div>Coins: <b>{user.coins}</b></div>
                    </div>
                </div>
                <hr className="profile-divider" />
                    <div className="profile-info-section">
                    <h3>Meeting Link</h3>
                    <div className="profile-info-row">
                        <span>Meeting Link:</span>
                        <a href={user.meeting_link} target="_blank" rel="noopener noreferrer">Join Meeting</a>
                    </div>
                        </div>
                <div className="profile-info-section">
                    <h3>Therapist Sessions</h3>
                    {meetings.length === 0 ? <div>No sessions scheduled.</div> : (
                        <table className="profile-meetings-table">
                            <thead>
                                <tr>
                                    <th>Therapist</th>
                                    <th>Status</th>
                                    <th>Start</th>
                                    <th>End</th>
                                    <th>Link</th>
                                </tr>
                            </thead>
                            <tbody>
                                {meetings.map(m => (
                                    <tr key={m.meeting_id}>
                                        <td>{m.therapist_username} ({m.therapist_email})</td>
                                        <td>{m.status}</td>
                                        <td>{m.start_time ? new Date(m.start_time).toLocaleString() : '-'}</td>
                                        <td>{m.end_time ? new Date(m.end_time).toLocaleString() : '-'}</td>
                                        <td><a href={m.meeting_link} target="_blank" rel="noopener noreferrer">Join</a></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                        </div>
            </div>
        </div>
    );
};

export default Profile; 