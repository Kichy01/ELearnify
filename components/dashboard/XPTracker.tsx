
import React from 'react';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { XPIcon, StreakIcon } from '../icons/IconComponents.tsx';

const XPTracker: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return ( // Fallback while user is loading or null
             <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-lg animate-pulse">
                <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
        )
    }

    const xpForNextLevel = user.level * 1000;
    // Fix: Correctly calculate the base XP for the current level.
    const currentLevelBaseXP = (user.level - 1) * 1000;
    const currentLevelXP = user.xp - currentLevelBaseXP;
    const currentLevelTotalXP = xpForNextLevel - currentLevelBaseXP;

    const progressPercentage = currentLevelTotalXP > 0 ? (currentLevelXP / currentLevelTotalXP) * 100 : 0;

    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Welcome back, {user.name}!</h2>
                    <p className="text-gray-400">You're on a roll. Keep up the great work!</p>
                </div>
                <img src={user.avatarUrl} alt="User Avatar" className="w-16 h-16 rounded-full border-2 border-cyan-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Level & XP */}
                <div>
                    <div className="flex justify-between items-baseline mb-1">
                        <span className="font-bold text-cyan-400">Level {user.level}</span>
                        <span className="text-sm text-gray-400">{user.xp.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-cyan-500 h-2.5 rounded-full shadow-cyan-glow-sm" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                </div>

                {/* Streak */}
                <div className="flex items-center justify-center bg-gray-700/50 p-4 rounded-lg">
                    <StreakIcon className="w-8 h-8 text-orange-400 mr-4"/>
                    <div>
                        <div className="text-2xl font-bold text-white">{user.streak} Day</div>
                        <div className="text-sm text-gray-400">Learning Streak</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default XPTracker;