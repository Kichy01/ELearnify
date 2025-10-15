import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { Course, Lesson, Module } from '../types.ts';
import { BookOpenIcon, CheckCircleIcon, ChevronDownIcon, ClipboardCheckIcon, ArrowLeftIcon, ArrowRightIcon, MenuIcon, ChevronLeftIcon, ChevronRightIcon } from '../components/icons/IconComponents.tsx';

// --- NEW TYPES FOR STRUCTURED CONTENT ---
interface DailyQuizQuestion {
    question: string;
    options: string[];
    answer: string;
}

interface DailyPlan {
    day: number;
    title: string;
    contentHTML: string;
    quiz: DailyQuizQuestion[];
}

interface StructuredLessonContent {
    lessonTitle: string;
    dailyPlans: DailyPlan[];
    summaryHTML: string;
}

// --- NEW & REFACTORED COMPONENTS ---

const LessonContentSkeleton: React.FC = () => (
    <div className="animate-pulse p-4">
        <div className="h-9 bg-gray-700 rounded-lg w-3/4 mb-6"></div>
        <div className="flex space-x-2 mb-8">
            <div className="h-10 bg-gray-700 rounded-md w-24"></div>
            <div className="h-10 bg-gray-700/50 rounded-md w-24"></div>
            <div className="h-10 bg-gray-700/50 rounded-md w-24"></div>
        </div>
        <div className="space-y-4">
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4 mt-6"></div>
        </div>
        <div className="mt-12">
             <div className="h-6 bg-gray-700 rounded-lg w-1/2 mb-4"></div>
             <div className="h-12 bg-gray-700 rounded-lg w-full mb-2"></div>
             <div className="h-12 bg-gray-700 rounded-lg w-full"></div>
        </div>
    </div>
);


const DailyQuiz: React.FC<{
    quiz: DailyQuizQuestion[];
    onPass: () => void;
}> = ({ quiz, onPass }) => {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const handleSubmit = () => {
        let correctAnswers = 0;
        quiz.forEach((q, index) => {
            if (answers[index] === q.answer) {
                correctAnswers++;
            }
        });
        const finalScore = (correctAnswers / quiz.length) * 100;
        setScore(finalScore);
        setSubmitted(true);
        if (finalScore >= 50) { // Passing score
            onPass();
        }
    };

    const getOptionClass = (option: string, index: number) => {
        if (!submitted) return 'hover:bg-gray-600';
        const isCorrect = option === quiz[index].answer;
        const isSelected = answers[index] === option;
        if (isCorrect) return 'bg-green-500/30 border-green-500';
        if (isSelected && !isCorrect) return 'bg-red-500/30 border-red-500';
        return 'border-gray-600';
    };

    return (
        <div className="mt-12 pt-8 border-t-2 border-dashed border-gray-700">
            <h3 className="text-2xl font-bold text-cyan-300 mb-4">✅ Daily Check-in</h3>
            {quiz.map((q, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-800/60 rounded-lg">
                    <p className="font-semibold mb-3">{index + 1}. {q.question}</p>
                    <div className="space-y-2">
                        {q.options.map(option => (
                            <button
                                key={option}
                                disabled={submitted}
                                onClick={() => setAnswers(prev => ({...prev, [index]: option}))}
                                className={`w-full text-left p-3 rounded-md border transition-colors duration-200 disabled:cursor-not-allowed ${answers[index] === option ? 'bg-cyan-600/50 border-cyan-500' : 'border-gray-600'} ${getOptionClass(option, index)}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
            {!submitted ? (
                 <button onClick={handleSubmit} className="px-6 py-2 font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 transition-colors">Submit Answers</button>
            ) : (
                <div className={`p-4 rounded-lg ${score >= 50 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    <h4 className="font-bold text-lg">Your score: {score.toFixed(0)}%</h4>
                    {score < 50 && <p>You need at least 50% to unlock the next day. Please review the material and try again.</p>}
                    {score >= 50 && <p>Great job! You've unlocked the next day's content.</p>}
                    <button onClick={() => setSubmitted(false)} className="mt-2 px-4 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 text-sm">Try Again</button>
                </div>
            )}
        </div>
    );
};


const DailyContentDisplay: React.FC<{
    content: StructuredLessonContent;
}> = ({ content }) => {
    const [currentDay, setCurrentDay] = useState(1);
    const [unlockedDays, setUnlockedDays] = useState(new Set([1]));

    const handlePassQuiz = () => {
        const nextDay = currentDay + 1;
        if (nextDay <= 5) {
            setUnlockedDays(prev => new Set(prev).add(nextDay));
            setCurrentDay(nextDay);
        }
    };

    const isLessonComplete = unlockedDays.size > 5;
    const activePlan = content.dailyPlans.find(p => p.day === currentDay);

    return (
        <div>
             <h2 className="text-2xl md:text-3xl font-bold mb-2 text-cyan-300">{content.lessonTitle}</h2>
             <p className="text-gray-400 mb-6">{activePlan?.title}</p>
            <div className="flex border-b border-gray-700 mb-6 overflow-x-auto">
                {content.dailyPlans.map(plan => (
                    <button
                        key={plan.day}
                        onClick={() => setCurrentDay(plan.day)}
                        disabled={!unlockedDays.has(plan.day)}
                        className={`flex-shrink-0 px-3 md:px-4 py-2 font-semibold border-b-2 transition-colors text-sm md:text-base ${currentDay === plan.day ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-gray-500 hover:text-white disabled:hover:text-gray-500 disabled:cursor-not-allowed'}`}
                    >
                        Day {plan.day}
                        {unlockedDays.has(plan.day + 1) || (plan.day === 5 && isLessonComplete) ? <span className="ml-2">✓</span> : ''}
                    </button>
                ))}
                 <button
                    key="summary"
                    onClick={() => setCurrentDay(6)} // Use 6 for summary view
                    disabled={!isLessonComplete}
                    className={`flex-shrink-0 px-3 md:px-4 py-2 font-semibold border-b-2 transition-colors text-sm md:text-base ${currentDay === 6 ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-gray-500 hover:text-white disabled:hover:text-gray-500 disabled:cursor-not-allowed'}`}
                >
                    Summary
                </button>
            </div>

            {currentDay <= 5 && activePlan && (
                <>
                    <div dangerouslySetInnerHTML={{ __html: activePlan.contentHTML }} />
                    <DailyQuiz quiz={activePlan.quiz} onPass={handlePassQuiz} />
                </>
            )}
            {currentDay === 6 && isLessonComplete && (
                 <div dangerouslySetInnerHTML={{ __html: content.summaryHTML }} />
            )}
        </div>
    );
};


type LessonItemWithModule = { lesson: Lesson; module: Module };

const ModuleItem: React.FC<{ module: Module; isOpen: boolean; onToggle: () => void; children: React.ReactNode }> = ({ module, isOpen, onToggle, children }) => (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
        <button onClick={onToggle} className="w-full flex justify-between items-center p-4 text-left font-bold text-lg text-white hover:bg-gray-700/50 transition-colors">
            <span>{module.title}</span>
            <ChevronDownIcon className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
            <div>
                {module.imageUrl && <img src={module.imageUrl} alt={module.title} className="w-full h-40 object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />}
                <div className="p-2 space-y-1">{children}</div>
            </div>
        )}
    </div>
);

const LessonItem: React.FC<{ lesson: Lesson; isActive: boolean; onClick: () => void; isCompleted: boolean; onToggleCompletion: () => void; }> = ({ lesson, isActive, onClick, isCompleted, onToggleCompletion }) => {
    const Icon = lesson.isAssessment ? ClipboardCheckIcon : BookOpenIcon;

    return (
        <div className={`w-full flex items-center gap-3 p-3 rounded-md text-left text-sm transition-colors cursor-pointer ${isActive ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-300 hover:bg-gray-700/50'}`} onClick={onClick}>
            <Icon className={`w-5 h-5 flex-shrink-0 ${lesson.isAssessment ? 'text-amber-400' : 'text-cyan-400'}`} />
            <span className="flex-grow">{lesson.title}</span>
            <button onClick={(e) => { e.stopPropagation(); onToggleCompletion(); }} className="ml-auto p-1 rounded-full hover:bg-gray-600">
                <CheckCircleIcon className={`w-5 h-5 transition-colors ${isCompleted ? 'text-green-500' : 'text-gray-500 hover:text-green-400'}`} />
            </button>
        </div>
    );
};

const LessonNavigation: React.FC<{ onNavigate: (direction: 'prev' | 'next') => void; prevLesson: LessonItemWithModule | null; nextLesson: LessonItemWithModule | null; }> = ({ onNavigate, prevLesson, nextLesson }) => (
    <div className="mt-8 pt-6 border-t border-gray-700 flex justify-between items-center">
        <button
            onClick={() => onNavigate('prev')}
            disabled={!prevLesson}
            className="flex items-center gap-2 px-4 py-2 font-semibold text-white bg-gray-700/50 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Previous</span>
        </button>
        <button
            onClick={() => onNavigate('next')}
            disabled={!nextLesson}
            className="flex items-center gap-2 px-4 py-2 font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
            <span className="hidden sm:inline">Next Lesson</span>
            <ArrowRightIcon className="w-5 h-5" />
        </button>
    </div>
);


const CourseCurriculumPage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const { getCourseOutline, getLessonContent, getCourseProgress, courseProgressDetails, toggleLessonCompletion, enrolledCourses } = useAuth();
    const navigate = useNavigate();

    const [course, setCourse] = useState<Course | null>(null);
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
    const [structuredContent, setStructuredContent] = useState<StructuredLessonContent | null>(null);
    const [isViewingAssessment, setIsViewingAssessment] = useState(false);
    const [assessmentContent, setAssessmentContent] = useState<string | null>(null);
    const [openModules, setOpenModules] = useState<Set<string>>(new Set());
    const [isLoadingOutline, setIsLoadingOutline] = useState(true);
    const [isLoadingContent, setIsLoadingContent] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(true);

    const handleLessonClick = async (courseIdParam: string, module: Module, lesson: Lesson) => {
        setIsLoadingContent(true);
        setActiveLesson(lesson);
        setStructuredContent(null);
        setAssessmentContent(null);
        setIsViewingAssessment(lesson.isAssessment);
        setOpenModules(prev => new Set(prev).add(module.id)); 
        
        try {
            const updatedLesson = await getLessonContent(courseIdParam, module.id, lesson.id, lesson.isAssessment);
            const contentString = updatedLesson.content;

            if (!contentString) {
                throw new Error("Failed to retrieve lesson content string.");
            }
            
            if(lesson.isAssessment) {
                setAssessmentContent(contentString);
            } else {
                const parsedContent = JSON.parse(contentString);
                if (parsedContent.error) {
                    throw new Error(parsedContent.error);
                }
                setStructuredContent(parsedContent);
            }
        } catch (error) {
            console.error("Failed to load or parse lesson content", error);
            setAssessmentContent(`<p class="text-red-400">Sorry, there was an error loading this lesson. The AI may be busy or the content is malformed. Please try again later.</p>`);
            setIsViewingAssessment(true);
        } finally {
            setIsLoadingContent(false);
        }
    };

    useEffect(() => {
        if (!courseId || !enrolledCourses.includes(courseId)) {
            navigate('/my-courses');
            return;
        }

        setIsLoadingOutline(true);
        getCourseOutline(courseId)
            .then(courseData => {
                setCourse(courseData);
                if (courseData.modules && courseData.modules.length > 0) {
                    setOpenModules(new Set([courseData.modules[0].id]));
                    
                    const allLessonsFlat = courseData.modules.flatMap(m => m.lessons.map(l => ({ lesson: l, module: m })));
                    const progress = courseProgressDetails[courseId];
                    const firstIncompleteLesson = allLessonsFlat.find(item => !progress?.completedLessons.has(item.lesson.id));
                    
                    if (firstIncompleteLesson) {
                        handleLessonClick(courseData.id, firstIncompleteLesson.module, firstIncompleteLesson.lesson);
                    }
                }
            })
            .catch(err => console.error("Failed to load course", err))
            .finally(() => setIsLoadingOutline(false));
    }, [courseId, getCourseOutline, enrolledCourses, navigate]);
    
    const allLessons = useMemo(() => {
      return course?.modules?.flatMap(m => m.lessons.map(l => ({ lesson: l, module: m }))) || [];
    }, [course]);
    
    const lessonNavigation = useMemo(() => {
        if (!activeLesson || allLessons.length === 0) return { currentIndex: -1, prevLesson: null, nextLesson: null };
        const currentIndex = allLessons.findIndex(item => item.lesson.id === activeLesson.id);
        const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
        const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
        return { currentIndex, prevLesson, nextLesson };
    }, [activeLesson, allLessons]);

    const handleNavigation = (direction: 'prev' | 'next') => {
        if (!course || !activeLesson) return;

        const { prevLesson, nextLesson } = lessonNavigation;
        const targetLesson = direction === 'next' ? nextLesson : prevLesson;

        if (targetLesson) {
             if (direction === 'next' && !courseProgressDetails[course.id]?.completedLessons.has(activeLesson.id)) {
                toggleLessonCompletion(course.id, activeLesson.id);
             }
            handleLessonClick(course.id, targetLesson.module, targetLesson.lesson);
        }
    };
    
    const toggleModule = (moduleId: string) => setOpenModules(prev => {
        const newSet = new Set(prev);
        newSet.has(moduleId) ? newSet.delete(moduleId) : newSet.add(moduleId);
        return newSet;
    });
    
    if (isLoadingOutline) {
         return (
            <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
                <Sidebar isOpen={isSidebarOpen} onToggle={() => setSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 p-8 text-center flex justify-center items-center transition-all duration-300 lg:ml-64">
                    <h1 className="text-4xl font-bold text-white">Loading curriculum...</h1>
                </main>
            </div>
        );
    }
    
    if (!course) return ( /* Render course not found */ <div/> );

    const progress = getCourseProgress(course.id);
    const currentProgressDetails = courseProgressDetails[course.id];

    return (
        <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} onToggle={() => setSidebarOpen(!isSidebarOpen)} />

            <div className={`flex-1 flex overflow-hidden transition-all duration-300 lg:ml-64`}>
                <main className="flex-1 p-4 sm:p-8 overflow-y-auto flex flex-col">
                     <header className="flex-col md:flex-row flex justify-between items-start mb-6">
                        <div className="flex items-center mb-4 md:mb-0">
                            <button onClick={() => setSidebarOpen(true)} title="Toggle Sidebar" className="lg:hidden mr-4 p-2 rounded-full hover:bg-gray-700 transition-colors">
                               <MenuIcon className="w-6 h-6" />
                            </button>
                            <div>
                                <Link to="/my-courses" className="text-sm text-cyan-400 hover:underline mb-2 block">&larr; Back to My Courses</Link>
                                <h1 className="text-3xl lg:text-4xl font-bold">{course.title}</h1>
                            </div>
                        </div>
                         <div className="w-full md:w-1/4 flex-shrink-0">
                             <div className="flex justify-between mb-1">
                                <span className="text-base font-medium text-white">Progress</span>
                                <span className="text-sm font-medium text-cyan-400">{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                    </header>
                   
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 sm:p-8 flex-grow flex flex-col">
                         {isLoadingContent ? (
                             <LessonContentSkeleton />
                         ) : isViewingAssessment ? (
                             <div>
                                <h2 className="text-3xl font-bold mb-6 text-cyan-300">{activeLesson?.title}</h2>
                                <div dangerouslySetInnerHTML={{ __html: assessmentContent || '' }} />
                             </div>
                         ) : structuredContent ? (
                            <DailyContentDisplay content={structuredContent} />
                         ) : (
                            <div className="text-center flex flex-col justify-center items-center flex-grow">
                                <BookOpenIcon className="w-16 h-16 text-gray-600 mb-4" />
                                <h2 className="text-2xl font-bold">Welcome to {course.title}</h2>
                                <p className="text-gray-400 mt-2">Select a lesson from the curriculum to get started.</p>
                            </div>
                        )}
                        {activeLesson && (
                            <LessonNavigation onNavigate={handleNavigation} prevLesson={lessonNavigation.prevLesson} nextLesson={lessonNavigation.nextLesson} />
                        )}
                    </div>
                </main>

                <aside className={`fixed lg:relative inset-y-0 right-0 z-30 transition-transform duration-300 transform ${isRightSidebarVisible ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 bg-gray-900/70 backdrop-blur-sm border-l border-gray-800 w-full sm:w-[450px] lg:w-auto flex-shrink-0`}>
                     <div className="w-full sm:w-[450px] h-full flex flex-col overflow-hidden">
                        <div className="p-6 flex justify-between items-center border-b border-gray-800 flex-shrink-0">
                            <h2 className="text-2xl font-bold">Curriculum</h2>
                            <button onClick={() => setIsRightSidebarVisible(false)} title="Hide Curriculum" className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                                <ChevronRightIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 overflow-y-auto">
                            {course.modules?.map(module => (
                                <ModuleItem key={module.id} module={module} isOpen={openModules.has(module.id)} onToggle={() => toggleModule(module.id)}>
                                    {module.lessons.map(lesson => (
                                        <LessonItem
                                            key={lesson.id}
                                            lesson={lesson}
                                            isActive={activeLesson?.id === lesson.id}
                                            isCompleted={currentProgressDetails?.completedLessons.has(lesson.id) || false}
                                            onClick={() => {
                                                handleLessonClick(course.id, module, lesson);
                                                if(window.innerWidth < 1024) setIsRightSidebarVisible(false); // Close on mobile
                                            }}
                                            onToggleCompletion={() => toggleLessonCompletion(course.id, lesson.id)}
                                        />
                                    ))}
                                </ModuleItem>
                            ))}
                        </div>
                    </div>
                </aside>
                
                {!isRightSidebarVisible && (
                     <button onClick={() => setIsRightSidebarVisible(true)} title="Show Curriculum" className="fixed top-6 right-6 z-20 p-2 bg-gray-800 border border-gray-700 rounded-full hover:bg-cyan-500/20 text-white transition-colors">
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default CourseCurriculumPage;
