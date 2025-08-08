import { useState, useMemo } from 'react';
import { Bell, Megaphone, CalendarX, CalendarCheck, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// --- Dummy Data para sa Faculty ---
const initialFacultyNotifications = [
  { id: 1, type: 'announcement', title: 'Campus-wide Meeting', description: 'All faculty members are required to attend the meeting on Friday at 3 PM in the auditorium.', timestamp: '3 hours ago', read: false },
  { id: 2, type: 'cancellation', title: 'Class Cancellation Alert', description: 'Your class IT-412 (Project Management) for tomorrow has been cancelled due to a university event.', timestamp: 'Yesterday', read: false },
  { id: 3, type: 'schedule', title: 'Room Change Notification', description: 'Your class CS-101 has been moved to Room 505 for the rest of the semester.', timestamp: '2 days ago', read: true },
  { id: 4, type: 'announcement', title: 'Submission Deadline Extension', description: 'The deadline for final grade submission has been extended to June 5th.', timestamp: '4 days ago', read: true },
];

// --- Helper Component para sa Icons ---
const NotificationIcon = ({ type }: { type: string }) => {
    const iconProps = { size: 22, className: "text-white" };
    switch (type) {
        case 'announcement': return <Megaphone {...iconProps} />;
        case 'cancellation': return <CalendarX {...iconProps} />;
        case 'schedule': return <CalendarCheck {...iconProps} />;
        default: return <Bell {...iconProps} />;
    }
};

const iconBgColor: Record<string, string> = {
    'announcement': 'bg-sky-500',
    'cancellation': 'bg-rose-500',
    'schedule': 'bg-emerald-500',
};


function FacultyNotificationsPage() {
  const [notifications, setNotifications] = useState(initialFacultyNotifications);
  const [activeTab, setActiveTab] = useState('All');

  const filteredNotifications = useMemo(() => {
    switch (activeTab) {
      case 'Unread':
        return notifications.filter(n => !n.read);
      case 'All':
      default:
        return notifications;
    }
  }, [notifications, activeTab]);

  const toggleReadStatus = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    toast.success('Notification marked as read');
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-800">My Notifications</h1>
            <p className="text-slate-500 mt-1">Stay updated with the latest announcements and schedule changes.</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 overflow-hidden">
            {/* Tabs and Actions */}
            <div className="flex justify-between items-center p-4 border-b border-slate-200/80 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                {['All', 'Unread'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors
                      ${activeTab === tab 
                        ? 'bg-indigo-600 text-white shadow' 
                        : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    {tab}
                    {tab === 'Unread' && unreadCount > 0 && <span className="ml-2 bg-white text-indigo-600 text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>}
                  </button>
                ))}
              </div>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-sm font-semibold text-indigo-600 hover:underline">
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="divide-y divide-slate-200/80">
              <AnimatePresence>
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map(notif => (
                    <motion.div
                      key={notif.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className={`group relative flex items-start gap-4 p-5 transition-colors ${notif.read ? 'bg-white' : 'bg-indigo-50/50'}`}
                    >
                      {/* Icon */}
                      <div className={`flex-shrink-0 mt-1 p-3 rounded-full ${iconBgColor[notif.type] || 'bg-slate-500'}`}>
                        <NotificationIcon type={notif.type} />
                      </div>

                      {/* Content */}
                      <div className="flex-grow">
                        <p className={`font-semibold text-slate-800 ${!notif.read ? 'font-bold' : ''}`}>{notif.title}</p>
                        <p className="text-sm text-slate-600 mt-0.5">{notif.description}</p>
                        <p className="text-xs text-slate-400 mt-2">{notif.timestamp}</p>
                      </div>

                      {/* Action Button on Hover */}
                      {!notif.read && (
                          <div className="absolute top-4 right-4 flex-shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => toggleReadStatus(notif.id)} title="Mark as read" className="p-2 rounded-full bg-white shadow-sm border hover:bg-slate-100">
                                <Check size={18} className="text-slate-600" />
                            </button>
                          </div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  // Empty State
                  <div className="text-center py-20 px-6">
                    <Bell size={48} className="mx-auto text-slate-300" />
                    <h3 className="mt-4 text-lg font-semibold text-slate-700">No New Notifications</h3>
                    <p className="mt-1 text-sm text-slate-500">You're all caught up for now.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
        </div>
    </div>
  )
}

export default FacultyNotificationsPage;