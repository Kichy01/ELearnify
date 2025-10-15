import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Course, Lesson, Module, CourseProgress } from '../types.ts';
import { generateCourseOutline, generateLessonContent } from '../services/geminiService.ts';
import { COURSE_CATALOG } from '../constants.ts';

// Mock user data
const MOCK_USER: User = {
    id: '1',
    name: 'Alex Ryder',
    email: 'alex.ryder@example.com',
    avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=Alex`,
    xp: 1250,
    level: 2,
    streak: 5,
};

interface AuthContextType {
    user: User | null;
    login: (email: string) => void;
    signup: (name: string, email: string) => void;
    logout: () => void;
    enrolledCourses: string[];
    enrollInCourse: (courseId: string) => void;
    getCourseProgress: (courseId: string) => number; // Returns percentage
    updateUserAvatar: (avatarUrl: string) => void;
    getCourseOutline: (courseId: string) => Promise<Course>;
    getLessonContent: (courseId: string, moduleId: string, lessonId: string, isAssessment: boolean) => Promise<Lesson>;
    toggleLessonCompletion: (courseId: string, lessonId: string) => void;
    courseProgressDetails: CourseProgress;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [courseCache, setCourseCache] = useState<Record<string, Course>>({});
    const [courseProgressDetails, setCourseProgressDetails] = useState<CourseProgress>({});

    // Load from session storage on initial render
    useEffect(() => {
        const storedUser = sessionStorage.getItem('e-learnify-user');
        const storedCache = sessionStorage.getItem('e-learnify-cache');
        const storedProgress = sessionStorage.getItem('e-learnify-progress');
        
        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedCache) setCourseCache(JSON.parse(storedCache));
        if (storedProgress) setCourseProgressDetails(JSON.parse(storedProgress));

    }, []);
    
    // Persist to session storage whenever state changes
    useEffect(() => {
        if (user) sessionStorage.setItem('e-learnify-user', JSON.stringify(user));
        else sessionStorage.removeItem('e-learnify-user');
    }, [user]);
    
    useEffect(() => {
        sessionStorage.setItem('e-learnify-cache', JSON.stringify(courseCache));
    }, [courseCache]);

    useEffect(() => {
        sessionStorage.setItem('e-learnify-progress', JSON.stringify(courseProgressDetails));
    }, [courseProgressDetails]);


    const login = (email: string) => {
        const loggedInUser = { ...MOCK_USER, email };
        setUser(loggedInUser);
    };

    const signup = (name: string, email: string) => {
        const newUser: User = {
            id: Date.now().toString(), name, email,
            avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
            xp: 0, level: 1, streak: 0,
        };
        setUser(newUser);
        setCourseCache({});
        setCourseProgressDetails({});
    };

    const logout = () => {
        setUser(null);
        sessionStorage.clear();
    };
    
    const enrollInCourse = async (courseId: string) => {
        if (courseProgressDetails[courseId]) return; // Already enrolled

        const courseOutline = await getCourseOutline(courseId);
        const totalLessons = courseOutline.modules?.reduce((acc, module) => acc + module.lessons.length, 0) || 0;

        setCourseProgressDetails(prev => ({
            ...prev,
            [courseId]: { completedLessons: new Set(), totalLessons }
        }));
    };

    const enrolledCourses = Object.keys(courseProgressDetails);
    
    const getCourseProgress = (courseId: string): number => {
        const progress = courseProgressDetails[courseId];
        if (!progress || progress.totalLessons === 0) return 0;
        return Math.round((progress.completedLessons.size / progress.totalLessons) * 100);
    };
    
    const updateUserAvatar = (avatarUrl: string) => {
        if (user) {
            const updatedUser = { ...user, avatarUrl };
            setUser(updatedUser);
        }
    };
    
    const getCourseOutline = async (courseId: string): Promise<Course> => {
        const baseCourse = COURSE_CATALOG.find(c => c.id === courseId);
        if (!baseCourse) throw new Error("Course not found in catalog");

        if (courseCache[courseId]?.modules) {
            return courseCache[courseId];
        }

        const modules = await generateCourseOutline(baseCourse.title, baseCourse.moduleImagePool || []);
        const fullCourse = { ...baseCourse, modules };
        
        setCourseCache(prev => ({ ...prev, [courseId]: fullCourse }));
        return fullCourse;
    };

    const getLessonContent = async (courseId: string, moduleId: string, lessonId: string, isAssessment: boolean): Promise<Lesson> => {
        const cachedCourse = courseCache[courseId];
        const module = cachedCourse?.modules?.find(m => m.id === moduleId);
        const lesson = module?.lessons.find(l => l.id === lessonId);

        if (!lesson || !cachedCourse) throw new Error("Lesson or course not found");
        if (lesson.content) return lesson; // Return cached content if available

        const content = await generateLessonContent(cachedCourse.title, lesson.title, isAssessment);
        const updatedLesson = { ...lesson, content };

        // Update cache immutably
        const updatedModules = cachedCourse.modules!.map(m => 
            m.id === moduleId ? { ...m, lessons: m.lessons.map(l => l.id === lessonId ? updatedLesson : l) } : m
        );
        setCourseCache(prev => ({ ...prev, [courseId]: { ...cachedCourse, modules: updatedModules } }));

        return updatedLesson;
    };

    const toggleLessonCompletion = (courseId: string, lessonId: string) => {
        setCourseProgressDetails(prev => {
            const progress = prev[courseId];
            if (!progress) return prev;

            const newCompletedLessons = new Set(progress.completedLessons);
            if (newCompletedLessons.has(lessonId)) {
                newCompletedLessons.delete(lessonId);
            } else {
                newCompletedLessons.add(lessonId);
            }

            return {
                ...prev,
                [courseId]: { ...progress, completedLessons: newCompletedLessons }
            };
        });
    };


    const value = {
        user, login, signup, logout,
        enrolledCourses, enrollInCourse, getCourseProgress, updateUserAvatar,
        getCourseOutline, getLessonContent, toggleLessonCompletion, courseProgressDetails,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
