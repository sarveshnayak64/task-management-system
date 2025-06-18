import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../api';

const AuthContext = createContext(null);

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user'); 

        if (storedToken && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            } catch (e) {
                console.error("Failed to parse user from local storage:", e);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false); 
    }, []);

    const login = async (username, password) => {
        try {
            const data = await apiRequest('/login', 'POST', { username, password });
            const { token: receivedToken, userId, username: receivedUsername } = data;

            setUser({ id: userId, username: receivedUsername });
            setToken(receivedToken);

            localStorage.setItem('token', receivedToken);
            localStorage.setItem('user', JSON.stringify({ id: userId, username: receivedUsername }));

            return true; 
        } catch (error) {
            console.error('Login failed:', error.message);
            throw error; 
        }
    };

    const signup = async (username, password) => {
        try {
            await apiRequest('/signup', 'POST', { username, password });
            return true; 
        } catch (error) {
            console.error('Signup failed:', error.message);
            throw error; 
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token, 
        login,
        signup,
        logout,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-lg font-semibold text-gray-700">Loading authentication...</p>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
