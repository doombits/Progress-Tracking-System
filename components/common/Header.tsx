
import React, { useState, useEffect } from 'react';
import { Bell, Menu, Sun, Moon, ChevronLeft, TrendingUp, LogOut } from 'lucide-react';
import { User, Notification } from '../../types';
import { db } from '../../services/dbService';

interface HeaderProps {
    user: User | null;
    darkMode: boolean;
    toggleTheme: () => void;
    toggleSidebar: () => void;
    canGoBack: boolean;
    onGoBack: () => void;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, darkMode, toggleTheme, toggleSidebar, canGoBack, onGoBack, onLogout }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showNotifs, setShowNotifs] = useState(false);

    useEffect(() => {
        if (user) {
            const interval = setInterval(() => {
                const data = db.getNotifications(user.id);
                setNotifications(data);
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleRead = () => {
        setShowNotifs(!showNotifs);
        if (!showNotifs) {
            notifications.forEach(n => {
                if(!n.read) db.markNotificationRead(n.id);
            });
        }
    };

    return (
        <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 p-4 sticky top-0 z-50 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button onClick={toggleSidebar} className="p-2 md:hidden text-gray-600 dark:text-gray-300">
                    <Menu size={24} />
                </button>
                {canGoBack && (
                    <button onClick={onGoBack} className="flex items-center gap-1 text-slate-500 hover:text-blue-600 font-medium transition">
                        <ChevronLeft size={20} /> <span className="hidden md:inline">Back</span>
                    </button>
                )}
                <h2 className="text-xl font-bold flex items-center gap-2 text-blue-600">
                    <TrendingUp className="text-blue-600" /> <span className="hidden md:inline">EduPro System</span>
                </h2>
            </div>

            <div className="flex items-center gap-4">
                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition text-gray-600 dark:text-gray-300">
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {user && (
                    <div className="relative">
                        <button onClick={handleRead} className="p-2 relative rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition text-gray-600 dark:text-gray-300">
                            <Bell size={20} />
                            {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
                        </button>
                        
                        {showNotifs && (
                            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50">
                                <div className="p-3 border-b dark:border-slate-700 font-bold text-sm">Notifications</div>
                                <div className="max-h-64 overflow-y-auto">
                                    {notifications.length === 0 && <div className="p-4 text-center text-xs text-gray-500">No notifications</div>}
                                    {notifications.map(n => (
                                        <div key={n.id} className={`p-3 border-b dark:border-slate-700 text-sm ${!n.read ? 'bg-blue-50 dark:bg-slate-700' : ''}`}>
                                            <div className="font-bold mb-1">{n.title}</div>
                                            <div className="text-gray-600 dark:text-gray-300 text-xs">{n.message}</div>
                                            <div className="text-xs text-gray-400 mt-1">{new Date(n.timestamp).toLocaleTimeString()}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                {user && (
                    <div className="flex items-center gap-3 border-l pl-4 dark:border-slate-700">
                        <div className="hidden md:block text-right">
                            <div className="text-sm font-bold text-gray-800 dark:text-white">{user.name}</div>
                            <div className="text-xs text-gray-500 capitalize">{user.role.toLowerCase()}</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
                            {user.name.charAt(0)}
                        </div>
                         <button onClick={onLogout} className="md:hidden p-2 text-red-500"><LogOut size={20}/></button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
