
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.tsx';
import ProtectedRoute from './components/auth/ProtectedRoute.tsx';

// Import pages
import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import SignupPage from './pages/SignupPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import MyCoursesPage from './pages/MyCoursesPage.tsx';
import ProgressPage from './pages/ProgressPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import ExploreCoursesPage from './pages/ExploreCoursesPage.tsx';
import CourseDetailPage from './pages/CourseDetailPage.tsx';
import CourseCurriculumPage from './pages/CourseCurriculumPage.tsx';
import AIAssistantPage from './pages/AIAssistantPage.tsx';
import CoursesPage from './pages/CoursesPage.tsx';


const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-gray-900 text-white min-h-screen font-sans">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/explore" element={<ExploreCoursesPage />} />
            <Route path="/course/:courseId" element={<CourseDetailPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
             <Route
              path="/my-courses"
              element={
                <ProtectedRoute>
                  <MyCoursesPage />
                </ProtectedRoute>
              }
            />
             <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <CoursesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <ProgressPage />
                </ProtectedRoute>
              }
            />
             <Route
              path="/ai-assistant"
              element={
                <ProtectedRoute>
                  <AIAssistantPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/:courseId/curriculum"
              element={
                <ProtectedRoute>
                  <CourseCurriculumPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
