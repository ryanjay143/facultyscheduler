// src/components/dashboard/WeeklyOverviewChart.tsx

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Assuming these types are now available/imported from a common location like "../dashboard" or "@/types/dashboard"
import type { ApiScheduleClass, DayKey, ApiWeeklyOverview } from "../dashboard"; // Adjusted import path

interface ChartProps {
  // Fix 1: The component now receives the pre-calculated data and explicitly uses selectedDay
  weeklyOverviewData: ApiWeeklyOverview;
  // Fix 2: allClasses is still needed for a comprehensive dashboard logic, but not directly used for bar heights here. 
  // It's kept here as the parent passes it, though it's technically unused in this component.
  allClasses: ApiScheduleClass[]; 
  selectedDay: DayKey | null;
  onDaySelect: (day: DayKey) => void;
}

// Fix 3: Added selectedDay to the destructuring
export const WeeklyOverviewChart = ({ weeklyOverviewData, selectedDay, onDaySelect }: ChartProps) => {
    const [hoveredDay, setHoveredDay] = useState<DayKey | null>(null);

    // Using the data from the prop directly
    const dayEntries = useMemo(() => {
        // Convert the object structure to an array of [DayKey, count] pairs for mapping
        return Object.entries(weeklyOverviewData) as [DayKey, number][];
    }, [weeklyOverviewData]);

    const maxClassesInDay = useMemo(() => {
        // Calculate max classes from the prop data
        return Math.max(...Object.values(weeklyOverviewData), 1);
    }, [weeklyOverviewData]);
    
    const busiestDay = useMemo(() => {
        // Find the day with the highest count
        return dayEntries.reduce((a, b) => (b[1] > a[1] ? b : a))[0];
    }, [dayEntries]);

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