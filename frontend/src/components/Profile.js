import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../services/authService';
import '../styles/Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await getUserProfile();
            setProfile(data);
        } catch (error) {
            setError('Failed to load profile');
        }
    };

    const handleChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await updateUserProfile(profile);
            setSuccess('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            setError('Failed to update profile');
        }
    };

    return (
        <div className="profile-page">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar-lg">{profile.firstName?.[0] || 'U'}</div>
                    <div>
                        <h2>{profile.firstName} {profile.lastName}</h2>
                        <p className="profile-username">@{profile.username}</p>
                    </div>
                </div>
                <hr className="profile-divider" />
                {!isEditing ? (
                    <div className="profile-info-section">
                        <h3>Profile Information</h3>
                        <div className="profile-info-row"><span>Email:</span> <span>{profile.email}</span></div>
                        <div className="profile-info-row"><span>First Name:</span> <span>{profile.firstName}</span></div>
                        <div className="profile-info-row"><span>Last Name:</span> <span>{profile.lastName}</span></div>
                        <div className="profile-info-row"><span>Username:</span> <span>{profile.username}</span></div>
                        <button className="profile-edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
                        {success && <div className="profile-success">{success}</div>}
                        {error && <div className="profile-error">{error}</div>}
                    </div>
                ) : (
                    <form className="profile-edit-form" onSubmit={handleSubmit}>
                        <h3>Edit Profile</h3>
                        <div className="profile-form-group">
                            <label htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={profile.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="profile-form-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={profile.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="profile-form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={profile.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="profile-form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={profile.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="profile-edit-actions">
                            <button type="submit" className="profile-save-btn">Save</button>
                            <button type="button" className="profile-cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                        {success && <div className="profile-success">{success}</div>}
                        {error && <div className="profile-error">{error}</div>}
                    </form>
                )}
            </div>
        </div>
    );
};

export default Profile; 