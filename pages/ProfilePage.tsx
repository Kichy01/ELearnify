import React, { useState, useRef } from 'react';
import Sidebar from '../components/dashboard/Sidebar.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { MenuIcon } from '../components/icons/IconComponents.tsx';

const ProfilePage: React.FC = () => {
    const { user, updateUserAvatar } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [isEditing, setIsEditing] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!user) {
        return (
            <div className="flex min-h-screen bg-gray-900">
                <Sidebar isOpen={isSidebarOpen} onToggle={() => setSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 p-8 text-center transition-all duration-300 lg:ml-64">
                    <h1 className="text-4xl font-bold text-white">Loading profile...</h1>
                </main>
            </div>
        );
    }

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateUserAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        // In a real app, you would have a context function to update the user's name
        console.log("Saving new name:", name);
        // This would be: updateUser({ ...user, name });
        setIsEditing(false);
    };

    return (
        <div className="flex min-h-screen bg-gray-900">
            <Sidebar isOpen={isSidebarOpen} onToggle={() => setSidebarOpen(!isSidebarOpen)} />
            <main className="flex-1 p-4 sm:p-8 transition-all duration-300 lg:ml-64">
                <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-400 hover:text-white mb-4">
                    <MenuIcon className="w-6 h-6" />
                </button>
                <h1 className="text-4xl font-bold text-white mb-8">My Profile</h1>
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 sm:p-8 max-w-2xl mx-auto shadow-lg">
                    <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0 text-center sm:text-left">
                        <div className="relative group flex-shrink-0">
                            <img 
                                src={user.avatarUrl} 
                                alt="User Avatar" 
                                className="w-24 h-24 rounded-full border-4 border-cyan-500 cursor-pointer group-hover:opacity-70 transition-opacity"
                                onClick={handleAvatarClick}
                            />
                             <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={handleAvatarClick}>
                                <p className="text-white text-sm font-semibold">Change</p>
                            </div>
                             <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                        <div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="text-3xl font-bold text-white bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-500 w-full"
                                />
                            ) : (
                                <h2 className="text-3xl font-bold text-white">{user.name}</h2>
                            )}
                            <p className="text-gray-400">{user.email}</p>
                        </div>
                    </div>
                    
                    <div className="mt-8 border-t border-gray-700 pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div>
                            <p className="text-sm text-gray-400">Level</p>
                            <p className="text-2xl font-bold text-cyan-400">{user.level}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Total XP</p>
                            <p className="text-2xl font-bold text-white">{user.xp.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Learning Streak</p>
                            <p className="text-2xl font-bold text-orange-400">{user.streak} days</p>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-gray-700 pt-6 flex justify-end">
                         {isEditing ? (
                             <>
                                <button onClick={() => setIsEditing(false)} className="px-6 py-2 font-semibold text-gray-300 bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors duration-300 mr-4">
                                    Cancel
                                </button>
                                <button onClick={handleSave} className="px-6 py-2 font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 transition-colors duration-300">
                                    Save Changes
                                </button>
                             </>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="px-6 py-2 font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 transition-colors duration-300">
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
