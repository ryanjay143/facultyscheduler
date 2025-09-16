import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const weeklyOverviewData = {
    'MON': 18, 'TUE': 25, 'WED': 22, 'THU': 26, 'FRI': 15,
};
const dayEntries = Object.entries(weeklyOverviewData);
const maxClassesInDay = Math.max(...Object.values(weeklyOverviewData));
const busiestDay = dayEntries.reduce((a, b) => (b[1] > a[1] ? b : a))[0];

export const WeeklyBarChart = () => {
    const [hoveredDay, setHoveredDay] = useState<string | null>(null);

    return (
        <div className="flex justify-between items-end gap-3 h-48 pt-8">
            {dayEntries.map(([day, count]) => (
                <div
                    key={day}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className="relative flex-1 flex flex-col items-center gap-2 h-full cursor-pointer"
                >
                    <AnimatePresence>
                        {hoveredDay === day && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute -top-8 w-max px-2 py-1 bg-gray-800 text-white text-xs font-bold rounded-md"
                            >
                                {count} classes
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(count / maxClassesInDay) * 100}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className={`w-full rounded-t-lg transition-colors ${
                            day === busiestDay
                            ? 'bg-gradient-to-t from-amber-500 to-orange-400'
                            : 'bg-gradient-to-t from-purple-500 to-fuchsia-400'
                        }`}
                    ></motion.div>
                    <p className="text-xs font-bold text-gray-500">{day}</p>
                </div>
            ))}
        </div>
    );
};