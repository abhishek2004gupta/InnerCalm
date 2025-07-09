import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TherapistDashboard = () => {
    const [meetings, setMeetings] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('therapist_token');
        if (!token) {
            navigate('/login');
            return;
        }
        const fetchMeetings = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/therapist/dashboard`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) setMeetings(data.meetings);
                else setError(data.error || 'Failed to load meetings');
            } catch (e) {
                setError('Failed to load meetings');
            }
        };
        fetchMeetings();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('therapist_token');
        navigate('/login');
    };

    if (error) return <div className="profile-error">{error}</div>;
    return (
        <div className="profile-page">
            <div className="profile-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Therapist Dashboard</h2>
                    <button onClick={handleLogout} className="profile-edit-btn">Logout</button>
                </div>
                <div className="profile-info-section">
                    <h3>Assigned Sessions</h3>
                    {meetings.length === 0 ? <div>No sessions assigned.</div> : (
                        <table className="profile-meetings-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Status</th>
                                    <th>Start</th>
                                    <th>End</th>
                                    <th>Link</th>
                                </tr>
                            </thead>
                            <tbody>
                                {meetings.map(m => (
                                    <tr key={m.meeting_id}>
                                        <td>{m.username} ({m.email})</td>
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

export default TherapistDashboard; 