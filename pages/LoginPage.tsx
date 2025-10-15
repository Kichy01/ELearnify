
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // Password state for UI, not used in mock login

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        login(email);
        navigate('/dashboard');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800/50 border border-gray-700 rounded-2xl shadow-cyan-glow">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white">
                        Welcome Back to <span className="text-cyan-400">E-Learnify</span>
                    </h1>
                    <p className="mt-2 text-gray-400">Log in to continue your journey.</p>
                </div>
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email" className="text-sm font-bold text-gray-300 tracking-wider">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            className="w-full p-3 mt-2 text-gray-200 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password"className="text-sm font-bold text-gray-300 tracking-wider">Password</label>
                         <input
                            type="password"
                            name="password"
                            id="password"
                            required
                            className="w-full p-3 mt-2 text-gray-200 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="••••••••"
                             value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition-colors duration-300"
                    >
                        Log In
                    </button>
                </form>
                 <p className="text-center text-gray-400">
                    Don't have an account? <Link to="/signup" className="font-medium text-cyan-400 hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;