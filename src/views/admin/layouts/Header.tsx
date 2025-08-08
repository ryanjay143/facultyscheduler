import React, { useState, useRef, useEffect } from 'react';
import { BarChart3, User, LogOut, Bell, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// --- Dummy Data for Notifications (can be replaced with real data) ---
const dummyNotifications = [
    { id: 1, type: 'New User', message: 'A new user "John Doe" has registered.', time: '15m ago', read: false },
    { id: 2, type: 'Report', message: 'Weekly sales report is ready for download.', time: '1h ago', read: false },
    { id: 3, type: 'Alert', message: 'Server CPU usage is at 92%.', time: '3h ago', read: true },
    { id: 4, type: 'New User', message: 'A new user "Jane Smith" has registered.', time: '1d ago', read: true },
];

// --- Notification Icon Helper ---
const NotificationIcon: React.FC<{ type: string }> = ({ type }) => {
    const baseClass = "h-5 w-5 text-white";
    if (type === 'New User') return <User className={baseClass} />;
    if (type === 'Report') return <BarChart3 className={baseClass} />;
    if (type === 'Alert') return <Bell className={baseClass} />;
    return <Bell className={baseClass} />;
};

const iconBgColor: Record<string, string> = {
    'New User': 'bg-sky-500',
    'Report': 'bg-indigo-500',
    'Alert': 'bg-rose-500',
};

const Header: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(dummyNotifications);

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // --- Dynamic User Data from localStorage ---
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { name: 'Admin User', email: 'admin@example.com' };

  // --- Effect to close dropdowns on outside click ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllAsRead = () => {
      setNotifications(notifications.map(n => ({...n, read: true})));
      toast.info("All notifications marked as read.");
  }

  // --- Logout Function ---
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
    navigate('/facultyscheduler/user-login');
    setIsProfileOpen(false);
  };

  // --- Animation Variants for Dropdowns ---
  const dropdownVariants = {
    hidden: { opacity: 0, y: -15, scale: 0.98, transition: { duration: 0.15 } },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: "easeOut" as const } },
    exit: { opacity: 0, y: -15, scale: 0.98, transition: { duration: 0.15, ease: "easeIn" as const } }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 md:bg-primary">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left Section: Logo and Title */}
        <div className="flex items-center gap-4">
          <Link to="/facultyscheduler/admin/user-dashboard" className="flex items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: -5 }} 
              className="flex items-center justify-center w-9 h-9 bg-primary rounded-lg shadow-md"
            >
              <BarChart3 className="text-white" size={20} />
            </motion.div>
            <span className="hidden sm:inline text-lg font-semibold text-slate-100 tracking-wider">Admin Panel</span>
          </Link>
        </div>

        {/* Right Section: Actions and Profile */}
        <div className="flex items-center gap-3 sm:gap-5">
            {/* Notification Bell */}
            <div className="relative" ref={notifDropdownRef}>
                <button 
                    onClick={() => { setIsNotifOpen(p => !p); setIsProfileOpen(false); }} 
                    className="relative p-2 rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-700/50 transition-colors duration-200"
                >
                    <Bell size={22} />
                    {unreadCount > 0 && (
                        <div className="absolute top-1.5 right-1.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-rose-500 rounded-full border-2 border-slate-900">
                           {unreadCount}
                        </div>
                    )}
                </button>

                <AnimatePresence>
                    {isNotifOpen && (
                        <motion.div 
                            variants={dropdownVariants} initial="hidden" animate="visible" exit="exit"
                            className="absolute right-0 mt-3 w-80 sm:w-96 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 z-50 overflow-hidden"
                        >
                           <div className="flex justify-between items-center p-4 border-b border-slate-700">
                                <h4 className="font-bold text-slate-100">Notifications</h4>
                                {unreadCount > 0 && <button onClick={handleMarkAllAsRead} className="text-xs font-semibold text-indigo-400 hover:underline">Mark all as read</button>}
                           </div>
                           <div className="max-h-80 overflow-y-auto divide-y divide-slate-700/50">
                                {notifications.length > 0 ? (
                                    notifications.map(notif => (
                                        <div key={notif.id} className={`flex items-start gap-4 p-4 ${!notif.read ? 'bg-indigo-500/10' : ''} hover:bg-slate-700/50 transition-colors duration-200`}>
                                            <div className={`mt-1 p-2 rounded-full flex-shrink-0 ${iconBgColor[notif.type] || 'bg-slate-600'}`}>
                                                <NotificationIcon type={notif.type} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-200">{notif.message}</p>
                                                <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                                            </div>
                                            {!notif.read && <div className="w-2 h-2 rounded-full bg-indigo-400 mt-2 ml-auto flex-shrink-0"></div>}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 px-4">
                                        <Bell size={40} className="mx-auto text-slate-500"/>
                                        <p className="mt-3 font-semibold text-slate-300">No new notifications</p>
                                        <p className="text-sm text-slate-400 mt-1">You're all caught up!</p>
                                    </div>
                                )}
                           </div>
                           <div className="text-center p-2 bg-slate-900/50 border-t border-slate-700">
                                <Link to="/facultyscheduler/admin/notifications" onClick={() => setIsNotifOpen(false)} className="text-sm font-bold text-indigo-400 hover:underline">
                                    View all
                                </Link>
                           </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
                <button 
                    onClick={() => { setIsProfileOpen(p => !p); setIsNotifOpen(false); }} 
                    className="flex items-center gap-2 rounded-full p-1 pl-2 hover:bg-slate-700/50 transition-colors duration-200"
                >
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="font-semibold text-sm text-slate-200">{user.name}</span>
                        <span className="text-xs text-slate-400">Administrator</span>
                    </div>
                    <img src={`https://i.pravatar.cc/150?u=${user.email}`} alt="Profile" className="w-9 h-9 rounded-full border-2 border-slate-600"/>
                </button>
            
                <AnimatePresence>
                    {isProfileOpen && (
                        <motion.div 
                            variants={dropdownVariants} initial="hidden" animate="visible" exit="exit"
                            className="absolute right-0 mt-3 w-64 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 z-50 overflow-hidden"
                        >
                            <div className="flex items-center gap-4 p-4 border-b border-slate-700">
                                <img src={`https://i.pravatar.cc/150?u=${user.email}`} alt="Profile" className="w-12 h-12 rounded-full"/>
                                <div>
                                    <p className="font-bold text-slate-100">{user.name}</p>
                                    <p className="text-sm text-slate-400 truncate">{user.email}</p>
                                </div>
                            </div>
                            <div className="p-2">
                                <Link to="/facultyscheduler/admin/profile" onClick={() => setIsProfileOpen(false)} className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors">
                                    <User size={18} /><span>Profile</span>
                                </Link>
                                <Link to="/facultyscheduler/admin/settings" onClick={() => setIsProfileOpen(false)} className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors">
                                    <Settings size={18} /><span>Settings</span>
                                </Link>
                                <hr className="border-t border-slate-700 my-1" />
                                <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-md text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-colors">
                                    <LogOut size={18} /><span>Logout</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </div>
    </header>
  );
}

export default Header;