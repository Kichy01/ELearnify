import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import { Course } from '../types.ts';
import { CheckCircleIcon } from '../components/icons/IconComponents.tsx';
import { COURSE_CATALOG } from '../constants.ts';

const CourseDetailPage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const { user, enrollInCourse, enrolledCourses, getCourseOutline } = useAuth();
    const navigate = useNavigate();
    
    const [course, setCourse] = useState<Course | null>(COURSE_CATALOG.find(c => c.id === courseId) || null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!courseId) {
            setIsLoading(false);
            return;
        }
        
        getCourseOutline(courseId)
            .then(outline => setCourse(outline))
            .catch(err => console.error("Failed to load course outline", err))
            .finally(() => setIsLoading(false));

    }, [courseId, getCourseOutline]);
    
    if (isLoading && !course?.modules) {
        // Show a more detailed loading state
        const baseCourse = COURSE_CATALOG.find(c => c.id === courseId);
         return (
             <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
                <div className="text-center">
                    <h1 className="text-3xl">Generating curriculum for {baseCourse?.title}...</h1>
                    <p className="text-cyan-400">This may take a moment.</p>
                </div>
            </div>
         )
    }
    
    if (!course) {
        return (
            <div className="flex items-center justify-center min-h-screen text-white">
                <h1 className="text-3xl">Course not found.</h1>
            </div>
        );
    }
    
    const isEnrolled = enrolledCourses.includes(course.id);
    
    const handleEnroll = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        await enrollInCourse(course.id);
        navigate(`/course/${course.id}/curriculum`);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="relative h-96">
                <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-12">
                     <h1 className="text-5xl font-extrabold text-white">{course.title}</h1>
                     <p className="mt-2 text-xl text-gray-300 max-w-3xl">{course.description}</p>
                </div>
                 <Link to={user ? "/courses" : "/explore"} className="absolute top-8 left-8 px-5 py-2 font-semibold text-white bg-gray-800/50 rounded-lg hover:bg-gray-700 transition-colors">
                    &larr; Back to Courses
                 </Link>
            </div>
            
            <div className="max-w-7xl mx-auto px-12 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <h2 className="text-3xl font-bold mb-4 text-cyan-400">About this course</h2>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">{course.longDescription}</p>

                    <h2 className="text-3xl font-bold mt-12 mb-4 text-cyan-400">What you'll learn</h2>
                     {isLoading ? <p className="text-gray-400">Loading curriculum...</p> : (
                        <ul className="space-y-4">
                           {course.modules?.map(module => (
                                <li key={module.id} className="flex items-center">
                                   <CheckCircleIcon className="w-5 h-5 text-cyan-500 mr-3 flex-shrink-0" />
                                   <span>{module.title}</span>
                               </li>
                           ))}
                           <li className="text-gray-400">...and much more!</li>
                       </ul>
                     )}
                </div>
                
                <div className="lg:col-span-1">
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 sticky top-8">
                        <h3 className="text-2xl font-bold mb-6">Course Curriculum</h3>
                        {isLoading ? <p className="text-gray-400">Loading...</p> : (
                            <ul className="space-y-3">
                            {course.modules?.map(module => (
                                <li key={module.id} className="text-gray-300">
                                    <span className="font-semibold text-white block">{module.title}</span>
                                    <span className="text-sm text-gray-400">{module.lessons.length} lessons</span>
                                </li>
                            ))}
                            </ul>
                        )}
                         <div className="mt-8">
                             {isEnrolled ? (
                                 <Link to={`/course/${course.id}/curriculum`} className="w-full block text-center py-3 font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 transition-colors duration-300">
                                     Go to Course
                                 </Link>
                             ) : (
                                <button onClick={handleEnroll} className="w-full py-3 font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 transition-colors duration-300">
                                    {user ? 'Enroll Now' : 'Log in to Enroll'}
                                </button>
                             )}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailPage;
