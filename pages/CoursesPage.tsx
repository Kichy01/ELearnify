import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar.tsx';
import { COURSE_CATALOG } from '../constants.ts';
import { useAuth } from '../contexts/AuthContext.tsx';
import { CheckCircleIcon, MenuIcon } from '../components/icons/IconComponents.tsx';

const CoursesPage: React.FC = () => {
    const { enrolledCourses } = useAuth();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-900">
            <Sidebar isOpen={isSidebarOpen} onToggle={() => setSidebarOpen(!isSidebarOpen)} />
            <main className="flex-1 p-4 sm:p-8 transition-all duration-300 lg:ml-64">
                 <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-400 hover:text-white mb-4">
                    <MenuIcon className="w-6 h-6" />
                </button>
                <h1 className="text-4xl font-bold text-white mb-8">Course Catalog</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {COURSE_CATALOG.map(course => {
                        const isEnrolled = enrolledCourses.includes(course.id);
                        return (
                            <Link
                                key={course.id}
                                to={`/course/${course.id}`}
                                className="group bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden shadow-lg flex flex-col transition-all duration-300 hover:border-cyan-500 hover:shadow-cyan-glow-sm hover:scale-105"
                            >
                                <img src={course.imageUrl} alt={course.title} className="w-full h-48 object-cover" />
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold text-white mb-2 flex-grow">{course.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4 truncate" title={course.description}>
                                        {course.description}
                                    </p>
                                    
                                    <div className="mt-auto">
                                        {isEnrolled ? (
                                            <div className="flex items-center justify-center py-2 font-semibold text-green-400 bg-green-500/10 rounded-lg">
                                                <CheckCircleIcon className="w-5 h-5 mr-2" />
                                                Enrolled
                                            </div>
                                        ) : (
                                            <div className="block w-full text-center py-2 font-bold text-white bg-cyan-600 rounded-lg group-hover:bg-cyan-500 transition-colors duration-300">
                                                View Details
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default CoursesPage;
