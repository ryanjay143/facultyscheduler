import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarCheck, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

import type { DayKey } from "./data";
import { allClasses } from "./data";
import { KpiCards } from "./card/KpiCards";
import { WeeklyOverviewChart } from "./chart/WeeklyOverviewChart.tsx";
import { ClassBreakdown } from "./ClassBreakdown";
import { FacultyLoadChart } from "./chart/FacultyLoadChart.tsx";

function DeanDashboardContainer() {
  const [selectedDay, setSelectedDay] = useState<DayKey | null>(null);

  const handleDaySelect = (day: DayKey) => {
    setSelectedDay(currentDay => (currentDay === day ? null : day));
  };

  return (
    <div className="space-y-8">
      {/* Hero / Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-lg"
      >
        <div className="relative p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                <CalendarCheck size={14} />
                Dean's Dashboard
              </div>
              <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">Scheduling Overview</h1>
              <p className="text-white/80 max-w-2xl">Manage and oversee all faculty schedules for the department.</p>
            </div>
            <Link to="/facultyscheduler/dean/conflicts" className="hidden sm:inline-flex items-center gap-2 rounded-md bg-white/10 text-white font-semibold px-4 py-2 hover:bg-white/20 transition">
              <AlertTriangle size={16} /> Resolve Conflicts
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-2 space-y-8">
          <KpiCards />
          <WeeklyOverviewChart selectedDay={selectedDay} onDaySelect={handleDaySelect} />
          <AnimatePresence>
            {selectedDay && (
              <ClassBreakdown selectedDay={selectedDay} classes={allClasses} onClear={() => setSelectedDay(null)} />
            )}
          </AnimatePresence>
        </div>

        {/* Right Column (Sidebar-like content) */}
        <div className="lg:col-span-1 space-y-8">
          <FacultyLoadChart />
        </div>
      </div>
    </div>
  );
}

export default DeanDashboardContainer;