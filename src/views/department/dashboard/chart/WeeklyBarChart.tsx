
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
// Note: CalendarDays dili gigamit dinhi, pero anaa sa parent component
// import { CalendarDays } from "lucide-react"; 

// --- START: Type Definitions ---
// Maghimo ta og type para sa mga adlaw para magamit pag-usab
type DayKey = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';

interface ChartProps {
  selectedDay: DayKey | null;
  onDaySelect: (day: DayKey) => void;
}

interface ScheduleClass {
  id: number;
  code: string;
  title: string;
  facultyName: string;
  time: string;
  room: string;
  day: DayKey;
}

const allClasses: ScheduleClass[] = [
    { id: 101, code: 'IT-411', title: 'Web Systems & Tech', facultyName: 'Albie Cruz', time: '8:00 - 9:30 AM', room: 'A-301', day: 'MON' },
    { id: 102, code: 'CS-301', title: 'Data Structures', facultyName: 'Albie Cruz', time: '10:00 - 11:30 AM', room: 'A-302', day: 'MON' },
    { id: 103, code: 'DS-210', title: 'Intro to Data Science', facultyName: 'Maria Santos', time: '1:00 - 2:30 PM', room: 'B-105', day: 'MON' },
    { id: 104, code: 'ENG-101', title: 'Academic Writing', facultyName: 'E. Garcia', time: '3:00 - 4:00 PM', room: 'D-404', day: 'MON' },
    { id: 105, code: 'MATH-101', title: 'Calculus I', facultyName: 'L. Gomez', time: '4:00 - 5:30 PM', room: 'E-110', day: 'MON' },
    { id: 201, code: 'IT-101', title: 'Intro to Computing', facultyName: 'Maria Santos', time: '9:00 - 10:30 AM', room: 'B-101', day: 'TUE' },
    { id: 202, code: 'CS-412', title: 'Operating Systems', facultyName: 'John Reyes', time: '11:00 - 12:30 PM', room: 'C-210', day: 'TUE' },
    { id: 203, code: 'MATH-201', title: 'Calculus II', facultyName: 'L. Gomez', time: '2:00 - 3:30 PM', room: 'E-112', day: 'TUE' },
    { id: 204, code: 'CS-301', title: 'Data Structures', facultyName: 'Albie Cruz', time: '4:00 - 5:30 PM', room: 'A-302', day: 'TUE' },
    { id: 301, code: 'IT-411', title: 'Web Systems & Tech', facultyName: 'Albie Cruz', time: '8:00 - 9:30 AM', room: 'A-301', day: 'WED' },
    { id: 302, code: 'PE-4', title: 'Physical Education', facultyName: 'E. Garcia', time: '1:00 - 2:00 PM', room: 'GYM', day: 'WED' },
    { id: 303, code: 'DS-210', title: 'Intro to Data Science', facultyName: 'Maria Santos', time: '3:00 - 4:30 PM', room: 'B-105', day: 'WED' },
    { id: 401, code: 'IT-101', title: 'Intro to Computing', facultyName: 'Maria Santos', time: '9:00 - 10:30 AM', room: 'B-101', day: 'THU' },
    { id: 402, code: 'CS-412', title: 'Operating Systems', facultyName: 'John Reyes', time: '11:00 - 12:30 PM', room: 'C-210', day: 'THU' },
    { id: 403, code: 'MATH-201', title: 'Calculus II', facultyName: 'L. Gomez', time: '2:00 - 3:30 PM', room: 'E-112', day: 'THU' },
];



// --- Gamiton ang gi-define nga 'WeeklyBarChartContainerProps' para sa atong props ---
const WeeklyBarChart = ({ selectedDay, onDaySelect }: ChartProps) => {
    const [hoveredDay, setHoveredDay] = useState<DayKey | null>(null);

    const weeklyOverviewData = useMemo(() => {
        const counts: { [key in DayKey]: number } = { MON: 0, TUE: 0, WED: 0, THU: 0, FRI: 0, SAT: 0 };
        allClasses.forEach((c: ScheduleClass) => {
            if (counts[c.day] !== undefined) counts[c.day]++;
        });
        return counts;
    }, []);

    const dayEntries = Object.entries(weeklyOverviewData) as [DayKey, number][];
    const maxClassesInDay = Math.max(...Object.values(weeklyOverviewData), 1);
    const busiestDay = dayEntries.reduce((a, b) => (b[1] > a[1] ? b : a))[0];

    return (
        <div className="flex justify-between items-end gap-3 h-48 pt-8">
            {dayEntries.map(([day, count]) => (
                <div
                    key={day}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    onClick={() => onDaySelect(day)}
                    className="relative flex-1 flex flex-col items-center gap-2 h-full cursor-pointer group"
                >
                    <AnimatePresence>
                        {hoveredDay === day && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute -top-8 w-max px-2 py-1 bg-gray-800 text-white text-xs font-bold rounded-md shadow-lg z-10"
                            >
                                {count} classes
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(count / maxClassesInDay) * 100}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className={`w-full rounded-t-lg transition-all duration-300 group-hover:scale-y-105 ${
                            day === busiestDay && count > 0 ? 'bg-gradient-to-t from-amber-500 to-orange-400' : 'bg-gradient-to-t from-purple-500 to-fuchsia-400'
                        } ${
                            selectedDay && selectedDay !== day ? 'opacity-40' : 'opacity-100'
                        } ${
                            selectedDay === day ? 'ring-2 ring-offset-2 ring-purple-500' : ''
                        }`}
                    ></motion.div>
                    <p className={`text-xs font-bold transition-colors ${selectedDay === day ? 'text-purple-700' : 'text-gray-500'}`}>{day}</p>
                </div>
            ))}
        </div>
    );
};

export default WeeklyBarChart;