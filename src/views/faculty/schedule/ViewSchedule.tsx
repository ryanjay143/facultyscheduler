import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Printer, Clock, Building2, BookOpen, ChevronDown, ChevronUp, CalendarX2 } from 'lucide-react';

// --- TYPE DEFINITIONS & MOCK DATA ---
interface ScheduledClass {
  id: number;
  code: string;
  name: string;
  room: string;
  program: string;
  schedule: {
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
    time: string;
  };
  // Gipa-ayo nga color system para mas nindot tan-awon
  colors: {
    border: string;
    bg: string;
    text: string;
    iconBg: string;
  };
}

const facultyScheduleData: ScheduledClass[] = [
    // Lunes (5 Subjects)
    { id: 1, code: 'CS101', name: 'Intro to Programming', room: '101', program: 'BSIT', schedule: { day: 'Monday', time: '08:00 - 09:30' }, colors: { border: 'border-sky-500', bg: 'bg-sky-50', text: 'text-sky-800', iconBg: 'bg-sky-100' } },
    { id: 2, code: 'IT210', name: 'Web Development 1', room: 'Lab 2', program: 'BSIT', schedule: { day: 'Monday', time: '10:00 - 11:30' }, colors: { border: 'border-indigo-500', bg: 'bg-indigo-50', text: 'text-indigo-800', iconBg: 'bg-indigo-100' } },
    { id: 3, code: 'CS320', name: 'Software Engineering', room: '303', program: 'BSCS', schedule: { day: 'Monday', time: '13:00 - 14:30' }, colors: { border: 'border-purple-500', bg: 'bg-purple-50', text: 'text-purple-800', iconBg: 'bg-purple-100' } },
    { id: 4, code: 'DS401', name: 'Data Analytics', room: '401', program: 'BSDS', schedule: { day: 'Monday', time: '15:00 - 16:30' }, colors: { border: 'border-fuchsia-500', bg: 'bg-fuchsia-50', text: 'text-fuchsia-800', iconBg: 'bg-fuchsia-100' } },
    { id: 5, code: 'GN101', name: 'Purposive Communication', room: '201', program: 'General', schedule: { day: 'Monday', time: '17:00 - 18:30' }, colors: { border: 'border-slate-500', bg: 'bg-slate-50', text: 'text-slate-800', iconBg: 'bg-slate-100' } },

    // Martes (3 Subjects)
    { id: 6, code: 'CS102', name: 'Data Structures', room: '102', program: 'BSCS', schedule: { day: 'Tuesday', time: '08:00 - 09:30' }, colors: { border: 'border-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-800', iconBg: 'bg-emerald-100' } },
    { id: 7, code: 'IT220', name: 'Database Management', room: 'Lab 1', program: 'BSIT', schedule: { day: 'Tuesday', time: '10:00 - 11:30' }, colors: { border: 'border-teal-500', bg: 'bg-teal-50', text: 'text-teal-800', iconBg: 'bg-teal-100' } },
    { id: 8, code: 'CS330', name: 'Algorithms & Complexity', room: '304', program: 'BSCS', schedule: { day: 'Tuesday', time: '13:00 - 14:30' }, colors: { border: 'border-cyan-500', bg: 'bg-cyan-50', text: 'text-cyan-800', iconBg: 'bg-cyan-100' } },
    
    // Miyerkules (1 Subject)
    { id: 11, code: 'CS205', name: 'Object-Oriented Prog.', room: '202', program: 'BSCS', schedule: { day: 'Wednesday', time: '08:00 - 09:30' }, colors: { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-800', iconBg: 'bg-green-100' } },
];

const daysOfWeek: ScheduledClass['schedule']['day'][] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const INITIAL_DISPLAY_COUNT = 1; // Ipakita ang 2 ka cards sa sugod

// --- Gibuhat nga bulag nga Component para sa Class Card ---
const ScheduledClassCard = ({ item }: { item: ScheduledClass }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white border-t-4 ${item.colors.border}`}
        >
            <div className="p-4">
                <p className={`font-semibold text-sm ${item.colors.text}`}>{item.code}</p>
                <p className="font-bold text-lg text-gray-800 truncate mb-3">{item.name}</p>
                
                <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-3">
                        <span className={`p-1.5 rounded-full ${item.colors.iconBg} ${item.colors.text}`}>
                            <Clock size={16} />
                        </span>
                        <span>{item.schedule.time}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`p-1.5 rounded-full ${item.colors.iconBg} ${item.colors.text}`}>
                            <Building2 size={16} />
                        </span>
                        <span>Room {item.room}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`p-1.5 rounded-full ${item.colors.iconBg} ${item.colors.text}`}>
                           <BookOpen size={16} />
                        </span>
                        <span>{item.program}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// --- MAIN COMPONENT ---
function ViewSchedule() {
    const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

    const toggleDayExpansion = (day: string) => {
        const newSet = new Set(expandedDays);
        if (newSet.has(day)) {
            newSet.delete(day);
        } else {
            newSet.add(day);
        }
        setExpandedDays(newSet);
    };

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="p-4 md:p-6 min-h-screen">
            <header className="mb-10">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Your Weekly Schedule</h1>
                        <p className="text-gray-500 mt-1 text-base">{today}</p>
                    </div>
                    <Button className="flex items-center gap-2 self-start md:self-center bg-white text-gray-700 border shadow-md hover:bg-gray-50">
                        <Printer size={16} />
                        Print Schedule
                    </Button>
                </div>
            </header>
            
            {/* 
              KINI NGA CONTAINER ANG NAGKONTROL SA LAYOUT.
              Ang `items-start` mao ang nagseguro nga kung motaas ang usa ka column (e.g., Lunes),
              ang uban (e.g., Martes, Miyerkules) dili maapektuhan ug magpabilin sa ilang gitas-on.
            */}
            <div className="grid grid-cols-3 md:grid-cols-1 gap-6 items-start">
                {daysOfWeek.map((day) => {
                    const classesForDay = facultyScheduleData.filter(c => c.schedule.day === day);
                    const isExpanded = expandedDays.has(day);
                    const itemsToShow = isExpanded ? classesForDay : classesForDay.slice(0, INITIAL_DISPLAY_COUNT);

                    return (
                        <div key={day} className="bg-slate-50 p-4 rounded-xl shadow-lg h-full flex flex-col">
                            <h2 className="font-extrabold text-xl text-center text-gray-700 pb-3 mb-4 border-b-2">{day}</h2>
                            <div className="space-y-4 flex-grow">
                                {classesForDay.length > 0 ? (
                                    <AnimatePresence>
                                        {itemsToShow.map((item) => (
                                            <ScheduledClassCard key={item.id} item={item} />
                                        ))}
                                    </AnimatePresence>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-center text-sm text-gray-400 h-full py-10">
                                        <CalendarX2 size={40} className="mb-2" />
                                        <p>No classes scheduled.</p>
                                    </div>
                                )}
                            </div>
                            
                            {classesForDay.length > INITIAL_DISPLAY_COUNT && (
                                <div className="mt-4 pt-4 border-t">
                                    <Button
                                        variant="ghost"
                                        className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-semibold"
                                        onClick={() => toggleDayExpansion(day)}
                                    >
                                        {isExpanded ? 'View Less' : `View ${classesForDay.length - INITIAL_DISPLAY_COUNT} More`}
                                        {isExpanded ? <ChevronUp size={16} className="ml-2" /> : <ChevronDown size={16} className="ml-2" />}
                                    </Button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ViewSchedule;