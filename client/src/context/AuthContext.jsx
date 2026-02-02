import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('userInfo');

        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            if (storedUser) {
                setUser(JSON.parse(storedUser));
                // If we have stored user, we can set loading to false immediately
                // to prevent flicker, while we fetch fresh data in background
                setLoading(false);
            }
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/auth/me');
            setUser(data.data);
            localStorage.setItem('userInfo', JSON.stringify(data.data));
        } catch (error) {
            console.error('Error fetching user:', error);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('userInfo');
                delete axios.defaults.headers.common['Authorization'];
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const { data } = await axios.post('/api/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        // Store user info for optimistic loading
        const userInfo = {
            _id: data._id,
            username: data.username,
            email: data.email,
            reputation: data.reputation
        };
        localStorage.setItem('userInfo', JSON.stringify(userInfo));

        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        setUser(data);
        return data;
    };

    const register = async (userData) => {
        const { data } = await axios.post('/api/auth/register', userData);
        if (data.token) {
            localStorage.setItem('token', data.token);
            // Store user info for optimistic loading
            const userInfo = {
                _id: data._id,
                username: data.username,
                email: data.email
            };
            localStorage.setItem('userInfo', JSON.stringify(userInfo));

            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            setUser(data);
        }
        return data;
    };

    const verifyEmail = async (email, otp) => {
        const { data } = await axios.post('/api/auth/verify-email', { email, otp });
        localStorage.setItem('token', data.token);
        // Store user info
        const userInfo = {
            _id: data._id,
            username: data.username,
            email: data.email,
            reputation: data.reputation
        };
        localStorage.setItem('userInfo', JSON.stringify(userInfo));

        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        setUser(data);
        return data;
    };

    const loginOTPInit = async (email) => {
        const { data } = await axios.post('/api/auth/login-otp-init', { email });
        return data;
    };

    const loginOTPVerify = async (email, otp) => {
        const { data } = await axios.post('/api/auth/login-otp-verify', { email, otp });
        localStorage.setItem('token', data.token);
        // Store user info
        const userInfo = {
            _id: data._id,
            username: data.username,
            email: data.email,
            reputation: data.reputation
        };
        localStorage.setItem('userInfo', JSON.stringify(userInfo));

        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        setUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        register,
        verifyEmail,
        loginOTPInit,
        loginOTPVerify,
        logout,
        isAuthenticated: !!user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
