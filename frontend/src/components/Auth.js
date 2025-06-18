import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal'; 

const Auth = () => {
    const { login, signup } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); 
        try {
            if (isLogin) {
                await login(username, password);
                setMessage('Logged in successfully!');
            } else {
                await signup(username, password);
                setMessage('Account created successfully! You can now log in.');
                setIsLogin(true); 
            }
            setIsMessageModalOpen(true);
            if (isLogin) {
                setUsername('');
                setPassword('');
            }
        } catch (error) {
            setMessage(error.message || 'An error occurred.');
            setIsMessageModalOpen(true);
            console.error('Auth error:', error);
        }
    };

    const closeMessageModal = () => {
        setIsMessageModalOpen(false);
        setMessage('');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-105">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
                    {isLogin ? 'Login' : 'Sign Up'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5"
                    >
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                        {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
                    </button>
                </div>
            </div>

            {/* Message Modal */}
            <Modal isOpen={isMessageModalOpen} onClose={closeMessageModal} title="Message">
                <p className="text-center text-lg">{message}</p>
                <div className="mt-6 text-center">
                    <button
                        onClick={closeMessageModal}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                    >
                        Close
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Auth;
