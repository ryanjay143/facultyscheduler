import React, { useState } from 'react';
import { Clock, XCircle, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// Initial data for the schedule, can be fetched from an API
const initialSchedule = [
  { id: 1, time: "08:30 AM - 10:00 AM", subject: "IT-321: Advanced Web Dev", room: "Room 404", cancelled: false },
  { id: 2, time: "10:00 AM - 11:30 AM", subject: "CS-101: Intro to Programming", room: "Room 301", cancelled: false },
  { id: 3, time: "01:00 PM - 02:30 PM", subject: "IT-412: Project Management", room: "Lab 2", cancelled: false },
  { id: 4, time: "03:00 PM - 04:30 PM", subject: "DS-202: Data Structures", room: "Room 505", cancelled: true }, // Example of an already cancelled class
];

const UpcomingSchedule: React.FC = () => {
  const [schedule, setSchedule] = useState(initialSchedule);

  // Function to toggle the cancellation status of a schedule item
  const toggleCancelStatus = (id: number) => {
    const targetClass = schedule.find(item => item.id === id);
    if (!targetClass) return; // Safety check

    // --- FIX: This logic now correctly determines which toast to show ---
    // If the class is currently NOT cancelled, it means the user is CANCELLING it.
    if (!targetClass.cancelled) {
        toast.error(`Class Cancelled: ${targetClass.subject}`);
    } else {
        // Otherwise, the user is RESTORING the class.
        toast.success(`Class Restored: ${targetClass.subject}`);
    }

    // Now, update the state
    setSchedule(prevSchedule =>
      prevSchedule.map(item =>
        item.id === id ? { ...item, cancelled: !item.cancelled } : item
      )
    );
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg h-full border border-slate-200/80">
      <h3 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">
        <Clock size={24} className="text-indigo-500" />
        Today's Schedule
      </h3>
      <div className="space-y-4">
        <AnimatePresence>
          {schedule.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`flex items-center p-4 rounded-xl transition-all duration-300
                ${item.cancelled 
                  ? 'bg-rose-50 border-l-4 border-rose-400' 
                  : 'bg-slate-50 border-l-4 border-indigo-500 hover:shadow-md hover:border-indigo-600'
                }`
              }
            >
              <div className="flex-shrink-0 w-32">
                <p className={`text-sm font-semibold transition-colors duration-300
                  ${item.cancelled ? 'text-rose-600 line-through' : 'text-indigo-700'}`
                }>
                  {item.time}
                </p>
              </div>

              <div className={`ml-4 flex-grow transition-all duration-300 ${item.cancelled ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                <p className={`font-bold ${item.cancelled ? 'text-rose-800' : 'text-slate-800'}`}>
                  {item.subject}
                </p>
                <p className="text-sm">
                  {item.room}
                </p>
              </div>

              <div className="ml-4">
                {item.cancelled ? (
                  // --- UNDO BUTTON ---
                   <button
                    onClick={() => toggleCancelStatus(item.id)}
                    aria-label={`Undo cancellation for ${item.subject}`}
                    className="group flex items-center gap-2 text-green-600 hover:text-green-800 transition-colors duration-200"
                  >
                    <RotateCcw size={20} className="transition-transform duration-200 group-hover:rotate-[-45deg]" />
                    <span className="text-sm font-semibold hidden sm:inline">Undo</span>
                  </button>
                ) : (
                  // --- CANCEL BUTTON ---
                  <button
                    onClick={() => toggleCancelStatus(item.id)}
                    aria-label={`Cancel class ${item.subject}`}
                    className="group flex items-center gap-2 text-slate-500 hover:text-rose-600 transition-colors duration-200"
                  >
                    <XCircle size={20} className="transition-transform duration-200 group-hover:scale-110" />
                    <span className="text-sm font-semibold hidden sm:inline group-hover:inline">Cancel</span>
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default UpcomingSchedule;