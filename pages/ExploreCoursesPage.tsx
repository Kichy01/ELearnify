import React from 'react';
import { Link } from 'react-router-dom';
import { COURSE_CATALOG } from '../constants.ts';
import Logo from '../components/icons/Logo.tsx';

interface CourseCatalogItem {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
}

const CourseCard: React.FC<{ course: CourseCatalogItem }> = ({ course }) => (
    <Link to={`/course/${course.id}`} className="group bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden shadow-lg hover:border-cyan-500 hover:shadow-cyan-glow-sm transition-all duration-300 flex flex-col hover:scale-105">
        <img src={course.imageUrl} alt={course.title} className="w-full h-48 object-cover" />
        <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
            <p className="text-gray-400 text-sm flex-grow truncate" title={course.description}>
                {course.description}
            </p>
        </div>
    </Link>
);


const ExploreCoursesPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-900 bg-grid-cyan-500/10">
            <header className="py-6 px-4 sm:px-8 flex justify-between items-center">
                 <Link to="/" className="flex items-center gap-2">
                    <Logo className="w-8 h-8" />
                    <span className="text-2xl font-bold text-white hidden sm:inline">E-Learnify</span>
                </Link>
                 <div>
                    <Link to="/login" className="text-gray-300 hover:text-white mr-4 sm:mr-6 text-sm sm:text-base">Login</Link>
                    <Link to="/signup" className="px-4 py-2 sm:px-5 font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 transition-colors text-sm sm:text-base">Sign Up</Link>
                 </div>
            </header>
            <main className="p-4 sm:p-8">
                <h1 className="text-4xl sm:text-5xl font-bold text-white text-center mb-12">Explore Our Courses</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {COURSE_CATALOG.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default ExploreCoursesPage;