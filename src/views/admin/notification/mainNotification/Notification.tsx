import { motion, AnimatePresence } from 'framer-motion';
import { Check, Archive, UserPlus, FileText, AlertTriangle, Bell } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

// --- DUMMY DATA ---
const initialNotifications = [
  { id: 1, type: 'new_user', title: 'New Faculty Registration', description: 'Dr. Evelyn Reed has registered and is awaiting approval.', timestamp: '15 minutes ago', read: false, archived: false },
  { id: 2, type: 'report', title: 'Weekly Analytics Report', description: 'Your weekly user engagement report is ready for download.', timestamp: '2 hours ago', read: false, archived: false },
  { id: 3, type: 'alert', title: 'High Server Load', description: 'CPU usage has exceeded 90% in the last hour.', timestamp: 'Yesterday', read: true, archived: false },
  { id: 4, type: 'new_user', title: 'New Faculty Registration', description: 'Prof. Marcus Thorne has registered.', timestamp: '2 days ago', read: true, archived: false },
  { id: 5, type: 'report', title: 'Monthly Schedule Report', description: 'The schedule conflict report for October is available.', timestamp: '3 days ago', read: true, archived: true },
];

// --- FIX #1: ADD THE MISSING HELPER COMPONENT FOR ICONS ---
const NotificationIcon = ({ type }: { type: string }) => {
    const iconProps = { size: 22, className: "text-white" };
    switch (type) {
        case 'new_user': return <UserPlus {...iconProps} />;
        case 'report': return <FileText {...iconProps} />;
        case 'alert': return <AlertTriangle {...iconProps} />;
        default: return <Bell {...iconProps} />;
    }
};

// --- FIX #2: ADD THE MISSING CONSTANT FOR ICON BACKGROUND COLORS ---
const iconBgColor: Record<string, string> = {
    'new_user': 'bg-sky-500',
    'report': 'bg-indigo-500',
    'alert': 'bg-rose-500',
};


function Notification() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState('All');

  const filteredNotifications = useMemo(() => {
    switch (activeTab) {
      case 'Unread':
        return notifications.filter(n => !n.read && !n.archived);
      case 'Archived':
        return notifications.filter(n => n.archived);
      case 'All':
      default:
        return notifications.filter(n => !n.archived);
    }
  }, [notifications, activeTab]);

  const toggleReadStatus = (id: number) => {
    const notif = notifications.find(n => n.id === id);
    if (notif) {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: !n.read } : n));
        toast.success(notif.read ? 'Marked as unread' : 'Marked as read');
    }
  };

  const archiveNotification = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, archived: true } : n));
    toast.info('Notification archived');
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => n.archived ? n : { ...n, read: true }));
    toast.success('All notifications marked as read');
  }

  const unreadCount = notifications.filter(n => !n.read && !n.archived).length;


  return (
     <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-800">Notification Center</h1>
            <p className="text-slate-500 mt-1">Manage and view all system notifications.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-200/80 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                {['All', 'Unread', 'Archived'].map(tab => (
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
              {activeTab !== 'Archived' && unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-sm font-semibold text-indigo-600 hover:underline">
                  Mark all as read
                </button>
              )}
            </div>

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
                      className="group flex items-start gap-4 p-5 transition-colors hover:bg-slate-50/50"
                    >
                      <div className={`relative flex-shrink-0 mt-1 p-3 rounded-full ${iconBgColor[notif.type] || 'bg-slate-500'}`}>
                        {!notif.read && <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-blue-500 border-2 border-white" />}
                        <NotificationIcon type={notif.type} />
                      </div>

                      <div className="flex-grow">
                        <p className={`font-semibold text-slate-800 ${!notif.read ? 'font-bold' : ''}`}>{notif.title}</p>
                        <p className="text-sm text-slate-600 mt-0.5">{notif.description}</p>
                        <p className="text-xs text-slate-400 mt-2">{notif.timestamp}</p>
                      </div>

                      <div className="flex-shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         {activeTab !== 'Archived' && (
                             <button onClick={() => toggleReadStatus(notif.id)} title={notif.read ? 'Mark as unread' : 'Mark as read'} className="p-2 rounded-full hover:bg-slate-200">
                                <Check size={18} className="text-slate-600" />
                            </button>
                         )}
                         {activeTab !== 'Archived' && (
                            <button onClick={() => archiveNotification(notif.id)} title="Archive" className="p-2 rounded-full hover:bg-slate-200">
                                <Archive size={18} className="text-slate-600" />
                            </button>
                         )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-20 px-6">
                    <Bell size={48} className="mx-auto text-slate-300" />
                    <h3 className="mt-4 text-lg font-semibold text-slate-700">You're all caught up!</h3>
                    <p className="mt-1 text-sm text-slate-500">There are no notifications in this tab.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
  )
}

export default Notification;