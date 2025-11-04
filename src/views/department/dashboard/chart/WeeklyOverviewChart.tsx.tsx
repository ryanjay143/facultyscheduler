import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DayKey, ScheduleClass } from "../data";
import { allClasses } from "../data";

interface ChartProps {
  selectedDay: DayKey | null;
  onDaySelect: (day: DayKey) => void;
}

export const WeeklyOverviewChart = ({ selectedDay, onDaySelect }: ChartProps) => {
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
        <div className="bg-card p-6 rounded-xl border shadow-sm">
            <h3 className="text-lg font-bold text-foreground mb-1">Weekly Schedule Overview</h3>
            <p className="text-sm text-muted-foreground mb-6">Click a bar to see the detailed schedule for that day.</p>
            <div className="flex justify-between items-end gap-3 h-48 pt-8">
                {dayEntries.map(([day, count]) => (
                    <div key={day} onMouseEnter={() => setHoveredDay(day)} onMouseLeave={() => setHoveredDay(null)} onClick={() => onDaySelect(day)}
                        className="relative flex-1 flex flex-col items-center gap-2 h-full cursor-pointer group">
                        <AnimatePresence>
                            {hoveredDay === day && (
                                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                                    className="absolute -top-8 w-max px-2 py-1 bg-foreground text-background text-xs font-bold rounded-md z-10">
                                    {count} classes
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <motion.div initial={{ height: 0 }} animate={{ height: `${(count / maxClassesInDay) * 100}%` }} transition={{ duration: 0.5, ease: 'easeOut' }}
                            className={`w-full rounded-t-md transition-all duration-300 ${day === busiestDay && count > 0 ? 'bg-amber-400' : 'bg-primary'} ${selectedDay && selectedDay !== day ? 'opacity-40' : ''}`}
                        ></motion.div>
                        <p className={`text-xs font-bold transition-colors ${selectedDay === day ? 'text-primary' : 'text-muted-foreground'}`}>{day}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};