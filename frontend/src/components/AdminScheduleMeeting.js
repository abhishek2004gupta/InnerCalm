import React, { useEffect, useState } from 'react';

const AdminScheduleMeeting = () => {
    const [users, setUsers] = useState([]);
    const [therapists, setTherapists] = useState([]);
    const [form, setForm] = useState({ user_id: '', therapist_id: '', start_time: '', end_time: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch all users
        fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/admin/users`)
            .then(res => res.json())
            .then(data => setUsers(data.users || []));
        // Fetch all therapists
        fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/admin/therapists`)
            .then(res => res.json())
            .then(data => setTherapists(data.therapists || []));
    }, []);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/therapist/schedule-meeting`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to schedule meeting');
            setMessage('Meeting scheduled successfully!');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="profile-page">
            <div className="profile-card">
                <h2>Admin: Schedule Meeting</h2>
                <form onSubmit={handleSubmit}>
                    <div className="profile-info-row">
                        <label>User:</label>
                        <select name="user_id" value={form.user_id} onChange={handleChange} required>
                            <option value="">Select User</option>
                            {users.map(u => <option key={u.user_id} value={u.user_id}>{u.username} ({u.email})</option>)}
                        </select>
                    </div>
                    <div className="profile-info-row">
                        <label>Therapist:</label>
                        <select name="therapist_id" value={form.therapist_id} onChange={handleChange} required>
                            <option value="">Select Therapist</option>
                            {therapists.map(t => <option key={t.therapist_id} value={t.therapist_id}>{t.username} ({t.email})</option>)}
                        </select>
                    </div>
                    <div className="profile-info-row">
                        <label>Start Time:</label>
                        <input type="datetime-local" name="start_time" value={form.start_time} onChange={handleChange} required />
                    </div>
                    <div className="profile-info-row">
                        <label>End Time:</label>
                        <input type="datetime-local" name="end_time" value={form.end_time} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="profile-edit-btn">Schedule Meeting</button>
                </form>
                {message && <div className="profile-success">{message}</div>}
                {error && <div className="profile-error">{error}</div>}
            </div>
        </div>
    );
};

export default AdminScheduleMeeting; 