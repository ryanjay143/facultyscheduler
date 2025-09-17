
import { motion } from "framer-motion";


type DayKey = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';
interface ChartProps {
  selectedDay: DayKey | null;
  onDaySelect: (day: DayKey) => void;
}

// --- Dawaton ang selectedDay ug onDaySelect isip props ---
const WeeklyBarChartContainer = ({ selectedDay, onDaySelect }: ChartProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-fuchsia-100 blur-3xl opacity-60" />
      <div className="pointer-events-none absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-violet-100 blur-3xl opacity-60" />
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="relative p-6 pb-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold tracking-tight text-gray-900 mb-1">
              Department Schedule Overview
            </h3>
            <p className="text-sm text-gray-500">
              Class density throughout the week. Click a bar to see details.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start md:self-center">
            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2.5 py-1">
              <span className="inline-block h-3 w-3 rounded-sm bg-gradient-to-t from-purple-500 to-fuchsia-400" />
              <span className="text-xs font-medium text-gray-600">Normal</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2.5 py-1">
              <span className="inline-block h-3 w-3 rounded-sm bg-gradient-to-t from-amber-500 to-orange-400" />
              <span className="text-xs font-medium text-gray-600">Busiest Day</span>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="mx-6 mb-4 border-t border-dashed border-gray-200" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, delay: 0.05 }} className="relative px-4 pb-6">
        <WeeklyBarChartContainer selectedDay={selectedDay} onDaySelect={onDaySelect} />
      </motion.div>
    </div>
  );
};


export default WeeklyBarChartContainer;