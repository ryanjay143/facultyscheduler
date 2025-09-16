import { WeeklyBarChart } from "./WeeklyBarChart";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";

function WeeklyBarChartContainer() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
      {/* Decorative background glows */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-fuchsia-100 blur-3xl opacity-60" />
      <div className="pointer-events-none absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-violet-100 blur-3xl opacity-60" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative p-6 pb-3"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold tracking-tight text-gray-900 mb-1">
              Department Schedule Overview
            </h3>
            <p className="text-sm text-gray-500">
              Class density throughout the week. Hover for details.
            </p>
          </div>

          {/* Legend + Range chip */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2.5 py-1">
              <span className="inline-block h-3 w-3 rounded-sm bg-gradient-to-t from-purple-500 to-fuchsia-400" />
              <span className="text-xs font-medium text-gray-600">Normal</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2.5 py-1">
              <span className="inline-block h-3 w-3 rounded-sm bg-gradient-to-t from-amber-500 to-orange-400" />
              <span className="text-xs font-medium text-gray-600">Busiest Day</span>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
              <CalendarDays size={14} />
              Mon–Sat
            </span>
          </div>
        </div>
      </motion.div>

      {/* Soft divider */}
      <div className="mx-6 mb-4 border-t border-dashed border-gray-200" />

      {/* Chart wrapper with slight padding and fade-in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="relative px-4 pb-6"
      >
        <WeeklyBarChart />
      </motion.div>
    </div>
  );
}

export default WeeklyBarChartContainer;