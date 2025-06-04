const API_URL = 'http://localhost:5000/api';

// Event emitter for auth state changes
const authStateChangeListeners = new Set();

const notifyAuthStateChange = () => {
    authStateChangeListeners.forEach(listener => listener());
};

export const addAuthStateChangeListener = (listener) => {
    authStateChangeListeners.add(listener);
    return () => authStateChangeListeners.delete(listener);
};

export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        // Store token and user data in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Notify listeners of auth state change
        notifyAuthStateChange();
        
        return data;
    } catch (error) {
        throw error;
    }
};

export const register = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }

        // Store token and user data in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Notify listeners of auth state change
        notifyAuthStateChange();
        
        return data;
    } catch (error) {
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Notify listeners of auth state change
    notifyAuthStateChange();
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const getToken = () => {
    return localStorage.getItem('token');
};

export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getUserProfile = async () => {
    try {
        const response = await fetch(`${API_URL}/auth/profile`, {
            headers: {
                ...getAuthHeader(),
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch profile');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

export const updateUserProfile = async (profileData) => {
    try {
        const response = await fetch(`${API_URL}/auth/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(),
            },
            body: JSON.stringify(profileData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to update profile');
        }

        // Update stored user data
        const currentUser = getCurrentUser();
        if (currentUser) {
            localStorage.setItem('user', JSON.stringify({ ...currentUser, ...data }));
            notifyAuthStateChange();
        }

        return data;
    } catch (error) {
        throw error;
    }
}; 