import {
  ChevronRight,
  FileBarChart,
  AlertTriangle,
  CalendarCheck,
} from "lucide-react";
import Header from "../layouts/Header";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { QuickActionLink } from "./action/QuickActionLink";

import KpiCardFile from "./card/KpiCardContainer";
import WeeklyBarChartContainer from "./chart/WeeklyBarChartContainer";

// --- DUMMY DATA FOR SCHEDULING ---
const schedulesForReview = [
  { id: 1, facultyName: "Prof. Albie Cruz", courses: "IT-411, CS-301", status: "Submitted" },
  { id: 2, facultyName: "Dr. Maria Santos", courses: "DS-210, IT-101", status: "Submitted" },
  { id: 3, facultyName: "Prof. John Reyes", courses: "CS-412", status: "With Conflicts" },
];

const facultyLoadData = [
  { name: "A. Cruz", load: 15, color: "from-violet-500 to-fuchsia-500" },
  { name: "M. Santos", load: 12, color: "from-violet-400 to-fuchsia-400" },
  { name: "J. Reyes", load: 9, color: "from-violet-300 to-fuchsia-300" },
  { name: "E. Garcia", load: 12, color: "from-violet-400 to-fuchsia-400" },
  { name: "L. Gomez", load: 16, color: "from-violet-600 to-fuchsia-600" },
];

function DepartmentDashboardContainer() {
  const pendingCount = schedulesForReview.length;
  const conflictCount = schedulesForReview.filter((i) => i.status === "With Conflicts").length;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Hero / Heading */}
          <motion.div
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white shadow-lg"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

            <div className="relative p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold shadow-sm">
                    <CalendarCheck size={14} />
                    Scheduler Dashboard
                  </div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                    Department Scheduling Overview
                  </h1>
                  <p className="text-white/80">
                    Manage and oversee all faculty schedules for the department.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Link
                    to="/facultyscheduler/dean/schedules"
                    className="inline-flex items-center gap-2 rounded-xl bg-white text-purple-700 font-semibold px-4 py-2.5 shadow hover:shadow-md hover:-translate-y-0.5 transition"
                  >
                    View Full Schedule
                    <ChevronRight size={16} />
                  </Link>
                  <Link
                    to="/facultyscheduler/dean/conflicts"
                    className="inline-flex items-center gap-2 rounded-xl bg-purple-700/40 text-white font-semibold px-4 py-2.5 hover:bg-purple-700/50 hover:-translate-y-0.5 transition"
                  >
                    Resolve Conflicts
                    <AlertTriangle size={16} />
                  </Link>
                </div>
              </div>

              {/* Quick metrics */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 ring-1 ring-white/10">
                  <p className="text-sm text-white/80">Pending Reviews</p>
                  <p className="text-2xl font-extrabold">{pendingCount}</p>
                </div>
                <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 ring-1 ring-white/10">
                  <p className="text-sm text-white/80">With Conflicts</p>
                  <p className="text-2xl font-extrabold">{conflictCount}</p>
                </div>
                <div className="hidden sm:block rounded-xl bg-white/10 backdrop-blur-sm p-4 ring-1 ring-white/10">
                  <p className="text-sm text-white/80">This Week</p>
                  <p className="text-2xl font-extrabold">Overview</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* KPIs */}
          <KpiCardFile />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Center Column (span 2) */}
            <div className="space-y-8 lg:col-span-2">
              {/* Weekly Overview */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm"
              >
                <WeeklyBarChartContainer />
              </motion.div>

              {/* Schedules Awaiting Review */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Schedules Awaiting Review</h3>
                    <p className="text-sm text-gray-500">
                      Review recently submitted schedules and resolve conflicts.
                    </p>
                  </div>
                  <Link
                    to="/facultyscheduler/dean/schedules/review"
                    className="text-sm font-semibold text-purple-600 hover:underline flex items-center gap-1"
                  >
                    View All <ChevronRight size={14} />
                  </Link>
                </div>

                <div className="space-y-2">
                  {schedulesForReview.map((item, idx) => {
                    const isConflict = item.status === "With Conflicts";
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * idx }}
                        className="grid grid-cols-2 md:grid-cols-3 items-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                      >
                        {/* Avatar + Name */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                            {item.facultyName
                              .split(" ")
                              .map((w) => w[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <p className="font-semibold text-gray-700 truncate">{item.facultyName}</p>
                        </div>

                        {/* Courses */}
                        <p className="hidden md:block text-sm text-gray-500">{item.courses}</p>

                        {/* Status + Actions */}
                        <div className="flex justify-end items-center gap-3">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${
                              isConflict
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {isConflict && (
                              <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                              </span>
                            )}
                            {item.status}
                          </span>
                          <button className="px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full hover:from-violet-700 hover:to-fuchsia-700 shadow-sm">
                            Review
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 }}
                className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <QuickActionLink
                    to="/facultyscheduler/dean/schedules"
                    icon={<CalendarCheck size={20} />}
                    text="View Full Schedule"
                  />
                  <QuickActionLink
                    to="/facultyscheduler/dean/conflicts"
                    icon={<AlertTriangle size={20} />}
                    text="Resolve Conflicts"
                  />
                  <QuickActionLink
                    to="/facultyscheduler/dean/reports/load"
                    icon={<FileBarChart size={20} />}
                    text="Generate Load Reports"
                  />
                </div>
              </motion.div>

              {/* Faculty Load Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.2 }}
                className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-4">Faculty Load Distribution</h3>
                <div className="space-y-3">
                  {facultyLoadData.map((faculty, idx) => (
                    <div key={faculty.name} className="flex items-center gap-3">
                      <span className="w-14 text-sm font-medium text-gray-600">{faculty.name}</span>
                      <div className="flex-1 bg-gray-200/70 rounded-full h-4 overflow-hidden">
                        <motion.div
                          className={`h-4 rounded-full bg-gradient-to-r ${faculty.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(faculty.load / 20) * 100}%` }} // Assuming max load is 20
                          transition={{ duration: 0.6, delay: 0.1 + idx * 0.05 }}
                          title={`${faculty.load} hours`}
                        />
                      </div>
                      <span className="w-12 text-sm font-semibold text-gray-700 text-right">
                        {faculty.load}h
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs text-gray-500">Assuming max teaching load is 20 hours.</div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DepartmentDashboardContainer;