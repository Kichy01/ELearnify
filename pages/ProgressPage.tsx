import React, { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { COURSE_CATALOG } from '../constants.ts';
import ProgressGraph from '../components/dashboard/ProgressGraph.tsx';
import { MenuIcon } from '../components/icons/IconComponents.tsx';

const ProgressPage: React.FC = () => {
    const { enrolledCourses, getCourseProgress } = useAuth();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const myCourses = COURSE_CATALOG.filter(c => enrolledCourses.includes(c.id));

    return (
        <div className="flex min-h-screen bg-gray-900">
            <Sidebar isOpen={isSidebarOpen} onToggle={() => setSidebarOpen(!isSidebarOpen)} />
            <main className="flex-1 p-4 sm:p-8 transition-all duration-300 lg:ml-64">
                <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-400 hover:text-white mb-4">
                    <MenuIcon className="w-6 h-6" />
                </button>
                <h1 className="text-4xl font-bold text-white mb-8">My Progress</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-lg">
                        <h2 className="text-2xl font-bold text-white mb-4">Course Completion</h2>
                        <div className="space-y-4">
                            {myCourses.length > 0 ? myCourses.map(course => {
                                const progress = getCourseProgress(course.id);
                                return (
                                    <div key={course.id}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-base font-medium text-white">{course.title}</span>
                                            <span className="text-sm font-medium text-cyan-400">{progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                                            <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <p className="text-gray-400">Enroll in courses to see your progress here.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-lg">
                        <h2 className="text-2xl font-bold text-white mb-4">Weekly XP (Demo)</h2>
                        <ProgressGraph />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProgressPage;
