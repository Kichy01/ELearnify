import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DashboardIcon, CoursesIcon, ProgressIcon, ProfileIcon, LogoutIcon, AIIcon, MenuIcon, XIcon } from '../icons/IconComponents.tsx';
import Logo from '../icons/Logo.tsx';
import { useAuth } from '../../contexts/AuthContext.tsx';

const NavLink: React.FC<{ to: string; icon: React.ReactNode; children: React.ReactNode; onClick?: () => void; as?: 'button' | 'a' }> = ({ to, icon, children, onClick, as = 'a' }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    const classNames = `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 w-full text-left ${isActive ? 'bg-cyan-500/20 text-cyan-300 shadow-cyan-glow-sm' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`;

    if (as === 'button') {
        return (
            <button onClick={onClick} className={classNames}>
                {icon}
                <span className="ml-4 font-semibold">{children}</span>
            </button>
        );
    }

    return (
        <Link to={to} className={classNames}>
            {icon}
            <span className="ml-4 font-semibold">{children}</span>
        </Link>
    );
};

const Sidebar: React.FC<{ isOpen: boolean; onToggle: () => void }> = ({ isOpen, onToggle }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && <div onClick={onToggle} className="fixed inset-0 bg-black/60 z-30 lg:hidden" />}

            <aside className={`w-64 bg-gray-900/70 backdrop-blur-sm border-r border-gray-800 fixed h-full flex flex-col z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="px-6 py-8 flex items-center justify-between">
                    <Link to="/dashboard" className="flex items-center gap-2">
                        <Logo className="w-8 h-8" />
                        <span className="text-2xl font-bold text-white">E-Learnify</span>
                    </Link>
                    <button onClick={onToggle} className="lg:hidden text-gray-400 hover:text-white">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    <NavLink to="/dashboard" icon={<DashboardIcon />}>Dashboard</NavLink>
                    <NavLink to="/my-courses" icon={<CoursesIcon />}>My Courses</NavLink>
                    <NavLink to="/courses" icon={<CoursesIcon />}>Courses</NavLink>
                    <NavLink to="/progress" icon={<ProgressIcon />}>Progress</NavLink>
                    <NavLink to="/ai-assistant" icon={<AIIcon />}>AI Assistant</NavLink>
                    <NavLink to="/profile" icon={<ProfileIcon />}>Profile</NavLink>
                </nav>
                <div className="px-4 py-6">
                    <NavLink to="#" icon={<LogoutIcon />} onClick={handleLogout} as="button">Logout</NavLink>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;