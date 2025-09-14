import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Printer, Clock, Building2, BookOpen, ChevronDown, ChevronUp, CalendarX2 } from 'lucide-react';

// --- TYPE DEFINITIONS & MOCK DATA (Updated with Saturday) ---
interface ScheduledClass {
  id: number;
  code: string;
  name: string;
  room: string;
  program: string;
  schedule: {
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
    time: string;
  };
  colors: {
    border: string;
    bg: string;
    text: string;
    iconBg: string;
  };
}

const facultyScheduleData: ScheduledClass[] = [
    // Lunes
    { id: 1, code: 'CS101', name: 'Intro to Programming', room: '101', program: 'BSIT', schedule: { day: 'Monday', time: '08:00 - 09:30' }, colors: { border: 'border-sky-500', bg: 'bg-sky-50', text: 'text-sky-800', iconBg: 'bg-sky-100' } },
    { id: 2, code: 'IT210', name: 'Web Development 1', room: 'Lab 2', program: 'BSIT', schedule: { day: 'Monday', time: '10:00 - 11:30' }, colors: { border: 'border-indigo-500', bg: 'bg-indigo-50', text: 'text-indigo-800', iconBg: 'bg-indigo-100' } },
    { id: 3, code: 'CS320', name: 'Software Engineering', room: '303', program: 'BSCS', schedule: { day: 'Monday', time: '13:00 - 14:30' }, colors: { border: 'border-purple-500', bg: 'bg-purple-50', text: 'text-purple-800', iconBg: 'bg-purple-100' } },
    { id: 4, code: 'DS401', name: 'Data Analytics', room: '401', program: 'BSDS', schedule: { day: 'Monday', time: '15:00 - 16:30' }, colors: { border: 'border-fuchsia-500', bg: 'bg-fuchsia-50', text: 'text-fuchsia-800', iconBg: 'bg-fuchsia-100' } },
    { id: 5, code: 'GN101', name: 'Purposive Communication', room: '201', program: 'General', schedule: { day: 'Monday', time: '17:00 - 18:30' }, colors: { border: 'border-slate-500', bg: 'bg-slate-50', text: 'text-slate-800', iconBg: 'bg-slate-100' } },

    // Martes
    { id: 6, code: 'CS102', name: 'Data Structures', room: '102', program: 'BSCS', schedule: { day: 'Tuesday', time: '08:00 - 09:30' }, colors: { border: 'border-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-800', iconBg: 'bg-emerald-100' } },
    { id: 7, code: 'IT220', name: 'Database Management', room: 'Lab 1', program: 'BSIT', schedule: { day: 'Tuesday', time: '10:00 - 11:30' }, colors: { border: 'border-teal-500', bg: 'bg-teal-50', text: 'text-teal-800', iconBg: 'bg-teal-100' } },
    { id: 8, code: 'CS330', name: 'Algorithms & Complexity', room: '304', program: 'BSCS', schedule: { day: 'Tuesday', time: '13:00 - 14:30' }, colors: { border: 'border-cyan-500', bg: 'bg-cyan-50', text: 'text-cyan-800', iconBg: 'bg-cyan-100' } },
    
    // Miyerkules
    { id: 11, code: 'CS205', name: 'Object-Oriented Prog.', room: '202', program: 'BSCS', schedule: { day: 'Wednesday', time: '08:00 - 09:30' }, colors: { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-800', iconBg: 'bg-green-100' } },

    // Sabado (Bag-ong data)
    { id: 12, code: 'PE4', name: 'Physical Education 4', room: 'Gym', program: 'General', schedule: { day: 'Saturday', time: '09:00 - 11:00' }, colors: { border: 'border-orange-500', bg: 'bg-orange-50', text: 'text-orange-800', iconBg: 'bg-orange-100' } },
];

const daysOfWeek: ScheduledClass['schedule']['day'][] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const INITIAL_DISPLAY_COUNT = 2;

// --- BAG-O: Color mapping para sa header sa matag adlaw ---
const dayColors: { [key: string]: { bg: string; text: string; badgeBg: string; badgeText: string } } = {
    Monday:    { bg: 'bg-sky-100',    text: 'text-sky-800',    badgeBg: 'bg-sky-200',    badgeText: 'text-sky-900'    },
    Tuesday:   { bg: 'bg-emerald-100', text: 'text-emerald-800', badgeBg: 'bg-emerald-200', badgeText: 'text-emerald-900' },
    Wednesday: { bg: 'bg-green-100',  text: 'text-green-800',  badgeBg: 'bg-green-200',  badgeText: 'text-green-900'  },
    Thursday:  { bg: 'bg-amber-100',  text: 'text-amber-800',  badgeBg: 'bg-amber-200',  badgeText: 'text-amber-900'  },
    Friday:    { bg: 'bg-indigo-100', text: 'text-indigo-800', badgeBg: 'bg-indigo-200', badgeText: 'text-indigo-900' },
    Saturday:  { bg: 'bg-orange-100', text: 'text-orange-800', badgeBg: 'bg-orange-200', badgeText: 'text-orange-900' },
    default:   { bg: 'bg-gray-100',   text: 'text-gray-800',   badgeBg: 'bg-gray-200',   badgeText: 'text-gray-900'   },
};

// --- Components (Walay Pagbabago) ---
const ScheduledClassCard = ({ item }: { item: ScheduledClass }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        whileHover={{ scale: 1.03, y: -4, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
        className={`rounded-lg shadow-sm bg-white border-l-4 cursor-pointer ${item.colors.border}`}
    >
        <div className="p-4">
            <p className={`font-bold text-sm ${item.colors.text}`}>{item.code}</p>
            <p className="font-bold text-base text-gray-800 truncate mb-3">{item.name}</p>
            <hr className="my-2" />
            <div className="space-y-2 text-sm text-gray-700">
                <DetailItem icon={Clock} text={item.schedule.time} colorClasses={item.colors} />
                <DetailItem icon={Building2} text={`Room ${item.room}`} colorClasses={item.colors} />
                <DetailItem icon={BookOpen} text={item.program} colorClasses={item.colors} />
            </div>
        </div>
    </motion.div>
);

const DetailItem = ({ icon: Icon, text, colorClasses }: { icon: React.ElementType, text: string, colorClasses: ScheduledClass['colors'] }) => (
    <div className="flex items-center gap-3">
        <Icon className={`h-4 w-4 flex-shrink-0 ${colorClasses.text}`} />
        <span>{text}</span>
    </div>
);

const EmptyStateCard = () => (
    <div className="flex flex-col items-center justify-center text-center text-sm text-gray-400 h-full py-10 bg-gray-50/50 rounded-lg">
        <CalendarX2 size={32} className="mb-2 text-gray-300" />
        <p>No classes scheduled.</p>
    </div>
);


// --- MAIN COMPONENT ---
function ViewSchedule() {
    const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

    const toggleDayExpansion = (day: string) => {
        setExpandedDays(prev => {
            const newSet = new Set(prev);
            if (newSet.has(day)) newSet.delete(day);
            else newSet.add(day);
            return newSet;
        });
    };

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            <header className="mb-8 bg-white p-6 rounded-xl shadow-md border">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Your Weekly Schedule</h1>
                        <p className="text-gray-600 mt-1">{today}</p>
                    </div>
                    <Button variant="outline" className="flex items-center gap-2 self-start md:self-center bg-white shadow-sm hover:bg-gray-100">
                        <Printer size={16} />
                        Print Schedule
                    </Button>
                </div>
            </header>
            
            <div className="grid grid-cols-3 gap-4 md:grid-cols-1 overflow-x-auto p-2 ">
                {daysOfWeek.map((day) => {
                    const classesForDay = facultyScheduleData.filter(c => c.schedule.day === day);
                    const isExpanded = expandedDays.has(day);
                    const itemsToShow = isExpanded ? classesForDay : classesForDay.slice(0, INITIAL_DISPLAY_COUNT);
                    
                    // Kuhaon ang kolor para sa adlaw
                    const colors = dayColors[day] || dayColors.default;

                    return (
                        <div key={day} className="bg-white rounded-xl shadow-md flex flex-col">
                            {/* GI-UPDATE NGA HEADER: Naggamit na sa color map */}
                            <div className={`flex justify-between items-center p-3 rounded-t-xl ${colors.bg}`}>
                                <h2 className={`font-bold text-lg ${colors.text}`}>{day}</h2>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${colors.badgeBg} ${colors.badgeText}`}>
                                    {classesForDay.length} {classesForDay.length === 1 ? 'Class' : 'Classes'}
                                </span>
                            </div>

                            {/* Ang content sa sulod sa column */}
                            <div className="p-4 space-y-4 flex-grow">
                                {classesForDay.length > 0 ? (
                                    <AnimatePresence>
                                        {itemsToShow.map((item) => <ScheduledClassCard key={item.id} item={item} />)}
                                    </AnimatePresence>
                                ) : (
                                    <EmptyStateCard />
                                )}
                            </div>
                            
                            {classesForDay.length > INITIAL_DISPLAY_COUNT && (
                                <div className="p-4 mt-auto border-t">
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