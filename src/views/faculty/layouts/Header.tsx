import { useState, useRef, useEffect } from 'react';
// --- 1. Gidugang ang Settings icon ---
import { BarChart3, ChevronDown, User, LogOut, Bell, Megaphone, CalendarCheck, FileText, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// --- Dummy Data para sa Notifications ---
const dummyNotifications = [
    { id: 1, type: 'announcement', title: 'Midterm Exam schedule is now available.', timestamp: '2 hours ago', read: false },
    { id: 2, type: 'schedule', title: 'Your Friday class (IT-412) has been moved to Room 501.', timestamp: '1 day ago', read: false },
    { id: 3, type: 'report', title: 'Your Q2 Performance Report is ready.', timestamp: '3 days ago', read: true },
    { id: 4, type: 'announcement', title: 'System maintenance scheduled for this weekend.', timestamp: '4 days ago', read: true },
];


function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const navigate = useNavigate();

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  // --- 3. Gihimong dinamiko ang user info gikan sa localStorage ---
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { name: 'Faculty Member', email: 'faculty@university.edu' };


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 }
  };

  // --- 4. Gipaayo ang logout function ---
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
    navigate('/facultyscheduler/user-login');
    setIsProfileOpen(false);
  };

  // Helper para sa icons sa notif
  const NotificationIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'announcement': return <Megaphone className="text-white"/>;
        case 'schedule': return <CalendarCheck className="text-white"/>;
        case 'report': return <FileText className="text-white"/>;
        default: return <Bell className="text-white"/>;
    }
  };
  const iconBgColor: Record<string, string> = {
      announcement: 'bg-rose-500',
      schedule: 'bg-amber-500',
      report: 'bg-sky-500',
  }

  const unreadCount = dummyNotifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="flex items-center justify-between py-3 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Link to="/facultyscheduler/faculty/user-dashboard" className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.1, rotate: -10 }} className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-fuchsia-500 shadow-lg">
              <BarChart3 className="text-white" size={22} />
            </motion.div>
            <span className="text-xl font-bold text-gray-800 tracking-wide">Faculty Portal</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
            <div className="relative" ref={notifDropdownRef}>
                <button onClick={() => { setIsNotifOpen(prev => !prev); setIsProfileOpen(false); }} className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Bell size={20} className="text-gray-600"/>
                    {unreadCount > 0 && <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>}
                </button>

                <AnimatePresence>
                    {isNotifOpen && (
                        <motion.div variants={dropdownVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="absolute right-0 md:left-[-150px] md:mt-5 top-full mt-3 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-200/80 z-50 overflow-hidden"
                        >
                           <div className="flex justify-between items-center p-3 border-b border-gray-200/80">
                                <h4 className="font-bold text-gray-800">Notifications</h4>
                                <button className="text-xs font-semibold text-purple-600 hover:underline">Mark all as read</button>
                           </div>
                           <div className="max-h-[350px] overflow-y-auto">
                                {dummyNotifications.length > 0 ? (
                                    dummyNotifications.map(notif => (
                                        <div key={notif.id} className={`flex items-start gap-3 p-3 hover:bg-gray-50/80 border-b border-gray-100 ${!notif.read ? 'bg-indigo-50/50' : ''}`}>
                                            <div className={`p-2 rounded-full flex-shrink-0 ${iconBgColor[notif.type] || 'bg-gray-500'}`}>
                                                <NotificationIcon type={notif.type} />
                                            </div>
                                            <div>
                                                <p className={`text-sm text-gray-800 ${!notif.read ? 'font-semibold' : 'font-medium'}`}>{notif.title}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{notif.timestamp}</p>
                                            </div>
                                             {!notif.read && <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 ml-auto flex-shrink-0"></div>}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <Bell size={40} className="mx-auto text-gray-300"/>
                                        <p className="mt-2 font-semibold text-gray-600">No new notifications</p>
                                        <p className="text-sm text-gray-400">You're all caught up!</p>
                                    </div>
                                )}
                           </div>
                           <div className="text-center p-2 bg-gray-50">
                                <Link to="/facultyscheduler/faculty/notifications" onClick={() => setIsNotifOpen(false)} className="text-sm font-bold text-purple-600 hover:underline">
                                    View all notifications
                                </Link>
                           </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="relative" ref={profileDropdownRef}>
                <button onClick={() => { setIsProfileOpen(prev => !prev); setIsNotifOpen(false); }} className="flex items-center gap-2 focus:outline-none group">
                   <img src={`https://i.pravatar.cc/150?u=${user.email}`} alt="Profile" className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-purple-400 transition-colors duration-300"/>
                    <div className="hidden md:flex flex-col items-start">
                        <span className="font-semibold text-sm text-gray-800">{user.name}</span>
                        <span className="text-xs text-gray-500">Faculty</span>
                    </div>
                    <ChevronDown size={18} className={`text-gray-500 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`}/>
                </button>
            
                <AnimatePresence>
                    {isProfileOpen && (
                        <motion.div variants={dropdownVariants} initial="hidden" animate="visible" exit="exit"
                            className="absolute right-0 top-full mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-200/80 z-50 overflow-hidden"
                        >
                            <div className="p-4 border-b border-gray-200/80">
                                <p className="font-bold text-gray-800">{user.name}</p>
                                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                            </div>
                            <div className="p-2">
                                <Link to="/facultyscheduler/faculty/profile" onClick={() => setIsProfileOpen(false)} className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
                                    <User size={16} /><span>My Profile</span>
                                </Link>
                                {/* --- 2. GIDUGANG NGA SETTINGS LINK --- */}
                                <Link to="/facultyscheduler/faculty/settings" onClick={() => setIsProfileOpen(false)} className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
                                    <Settings size={16} /><span>Settings</span>
                                </Link>
                                <hr className="border-t border-gray-200/80 my-1" />
                                <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-md text-red-600 hover:bg-red-50 transition-colors">
                                    <LogOut size={16} /><span>Logout</span>
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