import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/icons/Logo.tsx';

const HomePage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-grid-cyan-500/10">
            <Logo className="w-40 h-40 mb-6"/>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
                Welcome to <span className="text-cyan-400">E-Learnify</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
                Your personalized AI-powered learning platform. Master new skills, track your progress, and unlock your full potential.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/signup" className="px-8 py-3 font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 transition-colors duration-300">
                    Get Started
                </Link>
                <Link to="/login" className="px-8 py-3 font-bold text-gray-800 bg-gray-200 rounded-lg hover:bg-white transition-colors duration-300">
                    Log In
                </Link>
            </div>
             <div className="mt-16">
                <Link to="/explore" className="text-cyan-400 hover:underline">
                    Or explore our courses &rarr;
                </Link>
            </div>
        </div>
    );
};

export default HomePage;