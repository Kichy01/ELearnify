import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar.tsx';
import XPTracker from '../components/dashboard/XPTracker.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { COURSE_CATALOG } from '../constants.ts';
import { MenuIcon } from '../components/icons/IconComponents.tsx';


const DashboardPage: React.FC = () => {
    const { enrolledCourses, getCourseProgress } = useAuth();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const myCourses = COURSE_CATALOG.filter(c => enrolledCourses.includes(c.id));

    return (
        <div className="flex min-h-screen bg-gray-900 bg-grid-cyan-500/10">
            <Sidebar isOpen={isSidebarOpen} onToggle={() => setSidebarOpen(!isSidebarOpen)} />
            <main className={`flex-1 p-4 sm:p-8 transition-all duration-300 lg:ml-64`}>
                 <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-400 hover:text-white mb-4">
                    <MenuIcon className="w-6 h-6" />
                </button>
                <XPTracker />

                <div className="mt-8">
                    <h2 className="text-3xl font-bold text-white mb-4">My Courses</h2>
                    {myCourses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myCourses.map(course => {
                                const progress = getCourseProgress(course.id);
                                return (
                                    <div key={course.id} className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden shadow-lg flex flex-col">
                                        <img src={course.imageUrl} alt={course.title} className="w-full h-40 object-cover" />
                                        <div className="p-5 flex flex-col flex-grow">
                                            <h3 className="text-lg font-bold text-white mb-2 flex-grow">{course.title}</h3>
                                            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                                                <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                                            </div>
                                            <p className="text-right text-xs text-gray-400 mt-1">{progress}% complete</p>
                                            <Link to={`/course/${course.id}/curriculum`} className="mt-4 w-full text-center block py-2 font-semibold text-sm text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 transition-colors duration-300">
                                                Continue Learning
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-16 px-4 bg-gray-800/50 border border-gray-700 rounded-xl">
                            <h2 className="text-2xl font-bold text-white">Start Your Learning Journey!</h2>
                            <p className="mt-2 max-w-md mx-auto">You haven't enrolled in any courses yet. Browse our catalog to find the perfect course for you.</p>
                            <Link to="/courses" className="mt-6 inline-block px-8 py-3 font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 transition-colors duration-300 shadow-cyan-glow">
                                Explore Courses
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
