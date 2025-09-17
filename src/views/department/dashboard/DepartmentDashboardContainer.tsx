import  { useState, useMemo, type ReactNode } from "react"; // Gi-import ang React ug types
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  FileBarChart,
  AlertTriangle,
  CalendarCheck,
  Clock,
  User,
  MapPin,
  X,
  CalendarDays, // Gidugang ang import
} from "lucide-react";
import Header from "../layouts/Header";

// --- START: TYPE DEFINITIONS (Para ma-fix ang 'any' type errors) ---

type DayKey = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';

interface ScheduleClass {
  id: number;
  code: string;
  title: string;
  facultyName: string;
  time: string;
  room: string;
  day: DayKey;
}

interface FacultyLoad {
  name: string;
  load: number;
  color: string;
}

interface ScheduleReview {
  id: number;
  facultyName: string;
  courses: string;
  status: 'Submitted' | 'With Conflicts';
}

// --- END: TYPE DEFINITIONS ---


// --- START: DUMMY DATA (Gibutangan og types) ---

const schedulesForReview: ScheduleReview[] = [
  { id: 1, facultyName: "Prof. Albie Cruz", courses: "IT-411, CS-301", status: "Submitted" },
  { id: 2, facultyName: "Dr. Maria Santos", courses: "DS-210, IT-101", status: "Submitted" },
  { id: 3, facultyName: "Prof. John Reyes", courses: "CS-412", status: "With Conflicts" },
];

const facultyLoadData: FacultyLoad[] = [
  { name: "A. Cruz", load: 15, color: "from-violet-500 to-fuchsia-500" },
  { name: "M. Santos", load: 12, color: "from-violet-400 to-fuchsia-400" },
  { name: "J. Reyes", load: 9, color: "from-violet-300 to-fuchsia-300" },
  { name: "E. Garcia", load: 12, color: "from-violet-400 to-fuchsia-400" },
  { name: "L. Gomez", load: 16, color: "from-violet-600 to-fuchsia-600" },
];

const allClasses: ScheduleClass[] = [
    // Monday
    { id: 101, code: 'IT-411', title: 'Web Systems & Tech', facultyName: 'Albie Cruz', time: '8:00 - 9:30 AM', room: 'A-301', day: 'MON' },
    { id: 102, code: 'CS-301', title: 'Data Structures', facultyName: 'Albie Cruz', time: '10:00 - 11:30 AM', room: 'A-302', day: 'MON' },
    { id: 103, code: 'DS-210', title: 'Intro to Data Science', facultyName: 'Maria Santos', time: '1:00 - 2:30 PM', room: 'B-105', day: 'MON' },
    { id: 104, code: 'ENG-101', title: 'Academic Writing', facultyName: 'E. Garcia', time: '3:00 - 4:00 PM', room: 'D-404', day: 'MON' },
    { id: 105, code: 'MATH-101', title: 'Calculus I', facultyName: 'L. Gomez', time: '4:00 - 5:30 PM', room: 'E-110', day: 'MON' },
    
    // Tuesday
    { id: 201, code: 'IT-101', title: 'Intro to Computing', facultyName: 'Maria Santos', time: '9:00 - 10:30 AM', room: 'B-101', day: 'TUE' },
    { id: 202, code: 'CS-412', title: 'Operating Systems', facultyName: 'John Reyes', time: '11:00 - 12:30 PM', room: 'C-210', day: 'TUE' },
    { id: 203, code: 'MATH-201', title: 'Calculus II', facultyName: 'L. Gomez', time: '2:00 - 3:30 PM', room: 'E-112', day: 'TUE' },
    { id: 204, code: 'CS-301', title: 'Data Structures', facultyName: 'Albie Cruz', time: '4:00 - 5:30 PM', room: 'A-302', day: 'TUE' },

    // Wednesday
    { id: 301, code: 'IT-411', title: 'Web Systems & Tech', facultyName: 'Albie Cruz', time: '8:00 - 9:30 AM', room: 'A-301', day: 'WED' },
    { id: 302, code: 'PE-4', title: 'Physical Education', facultyName: 'E. Garcia', time: '1:00 - 2:00 PM', room: 'GYM', day: 'WED' },
    { id: 303, code: 'DS-210', title: 'Intro to Data Science', facultyName: 'Maria Santos', time: '3:00 - 4:30 PM', room: 'B-105', day: 'WED' },
    
    // Thursday
    { id: 401, code: 'IT-101', title: 'Intro to Computing', facultyName: 'Maria Santos', time: '9:00 - 10:30 AM', room: 'B-101', day: 'THU' },
    { id: 402, code: 'CS-412', title: 'Operating Systems', facultyName: 'John Reyes', time: '11:00 - 12:30 PM', room: 'C-210', day: 'THU' },
    { id: 403, code: 'MATH-201', title: 'Calculus II', facultyName: 'L. Gomez', time: '2:00 - 3:30 PM', room: 'E-112', day: 'THU' },
];

const dayMap: { [key in DayKey]: string } = { MON: "Monday", TUE: "Tuesday", WED: "Wednesday", THU: "Thursday", FRI: "Friday", SAT: "Saturday" };

// --- END: DUMMY DATA ---


// --- START: PLACEHOLDER COMPONENTS (Gibutangan og types ang props) ---



const KpiCardFile = () => (
  <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"><p className="text-sm text-gray-500">Total Faculty</p><p className="text-2xl font-bold">12</p></div>
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"><p className="text-sm text-gray-500">Total Classes</p><p className="text-2xl font-bold">35</p></div>
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"><p className="text-sm text-gray-500">Rooms Used</p><p className="text-2xl font-bold">8</p></div>
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"><p className="text-sm text-gray-500">Avg. Load</p><p className="text-2xl font-bold">12.5h</p></div>
  </div>
);

interface QuickActionLinkProps {
  to: string;
  icon: ReactNode;
  text: string;
}

const QuickActionLink = ({ to, icon, text }: QuickActionLinkProps) => (
  <Link
    to={to}
    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-semibold"
  >
    <span className="text-purple-600">{icon}</span>
    {text}
  </Link>
);

// --- END: PLACEHOLDER COMPONENTS ---


// --- START: CHART COMPONENTS (Gibutangan og types ang props) ---

interface ChartProps {
  selectedDay: DayKey | null;
  onDaySelect: (day: DayKey) => void;
}

const WeeklyBarChart = ({ selectedDay, onDaySelect }: ChartProps) => {
    const [hoveredDay, setHoveredDay] = useState<DayKey | null>(null);

    const weeklyOverviewData = useMemo(() => {
        const counts: { [key in DayKey]: number } = { MON: 0, TUE: 0, WED: 0, THU: 0, FRI: 0, SAT: 0 };
        allClasses.forEach((c: ScheduleClass) => {
            if (counts[c.day] !== undefined) {
                counts[c.day]++;
            }
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
                            day === busiestDay && count > 0
                            ? 'bg-gradient-to-t from-amber-500 to-orange-400'
                            : 'bg-gradient-to-t from-purple-500 to-fuchsia-400'
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

const WeeklyBarChartContainer = ({ selectedDay, onDaySelect }: ChartProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-fuchsia-100 blur-3xl opacity-60" />
      <div className="pointer-events-none absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-violet-100 blur-3xl opacity-60" />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative p-6 pb-3"
      >
        <div className="flex flex-col gap-3">
          <div>
            <h3 className="text-lg font-extrabold tracking-tight text-gray-900 mb-1">
              Department Schedule Overview
            </h3>
            <p className="text-sm text-gray-500">
              Class density throughout the week. Click a bar to see details.
            </p>
          </div>
          <div className="flex items-center gap-3 md:hidden">
            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2.5 py-1">
              <span className="inline-block h-3 w-3 rounded-sm bg-gradient-to-t from-purple-500 to-fuchsia-400" />
              <span className="text-xs font-medium text-gray-600">Normal</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2.5 py-1">
              <span className="inline-block h-3 w-3 rounded-sm bg-gradient-to-t from-amber-500 to-orange-400" />
              <span className="text-xs font-medium text-gray-600">Busiest Day</span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
              <CalendarDays size={14} />
              Mon-Sat
            </span>
          </div>
        </div>
      </motion.div>
      <div className="mx-6 mb-4 border-t border-dashed border-gray-200" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="relative px-4 pb-6"
      >
        <WeeklyBarChart 
          selectedDay={selectedDay}
          onDaySelect={onDaySelect}
        />
      </motion.div>
    </div>
  );
};

// --- END: CHART COMPONENTS ---


// --- START: CLASS BREAKDOWN COMPONENT (Gibutangan og types ang props) ---

interface ClassBreakdownProps {
  selectedDay: DayKey;
  classes: ScheduleClass[];
  onClear: () => void;
}

const ClassBreakdown = ({ selectedDay, classes, onClear }: ClassBreakdownProps) => {
  const classesForDay = classes.filter((c: ScheduleClass) => c.day === selectedDay);
  const fullDayName = dayMap[selectedDay] || "Selected Day";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: 15, height: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm"
    >
      {/* Decorative gradient top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500" />

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 p-2 text-white shadow-sm">
            <CalendarDays size={16} />
          </span>
          <h3 className="text-lg font-extrabold tracking-tight text-gray-900">
            Class Schedule for{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {fullDayName}
            </span>
          </h3>
        </div>

        <button
          onClick={onClear}
          aria-label="Close class schedule"
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-red-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:text-white hover:shadow-md active:scale-[0.98]"
        >
          <X size={14} />
          Close
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3.5">
        {classesForDay.length > 0 ? (
          classesForDay.map((cls: ScheduleClass, idx: number) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.04 * idx }}
              className="group relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-xl border border-gray-200/70 bg-white p-4 shadow-xs transition-all hover:border-purple-200 hover:shadow-md"
            >
              {/* Accent bar on hover */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-1 rounded-l-xl bg-gradient-to-b from-purple-500 via-fuchsia-500 to-indigo-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              />

              <div className="min-w-0">
                <p className="truncate font-semibold text-gray-900">
                  <span className="text-gray-700">{cls.code}</span>{" "}
                  <span className="mx-1 text-gray-300">•</span>
                  <span className="font-medium text-gray-800">{cls.title}</span>
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                  <span className="inline-flex items-center gap-1.5">
                    <User size={14} /> {cls.facultyName}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={14} /> Room: {cls.room}
                  </span>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-sm font-semibold text-purple-700 ring-1 ring-purple-200">
                <Clock size={14} />
                <span>{cls.time}</span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="relative overflow-hidden rounded-xl border border-dashed border-gray-200/80 bg-gradient-to-br from-gray-50 to-white py-10 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-sm ring-4 ring-white/70">
              <CalendarDays size={18} />
            </div>
            <p className="font-semibold text-gray-700">
              No classes scheduled for this day.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Select another day from the chart above to view its schedule.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- END: CLASS BREAKDOWN COMPONENT ---


// --- START: MAIN DASHBOARD CONTAINER ---

function DepartmentDashboardContainer() {
  const pendingCount = schedulesForReview.length;
  const conflictCount = schedulesForReview.filter((i) => i.status === "With Conflicts").length;
  
  // Gibutangan og type ang state: DayKey (e.g., 'MON') o null
  const [selectedDay, setSelectedDay] = useState<DayKey | null>(null);

  const handleDaySelect = (day: DayKey) => {
    setSelectedDay(currentDay => (currentDay === day ? null : day));
  };

  return (
    <div className="flex flex-col min-h-0 bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="flex-1 min-h-0 p-8 md:p-4">
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
            <div className="relative p-8 md:p-6">
              <div className="flex items-start justify-between gap-6 md:flex-col md:items-start">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold shadow-sm">
                    <CalendarCheck size={14} />
                    Scheduler Dashboard
                  </div>
                  <h1 className="text-4xl md:text-3xl font-extrabold tracking-tight">
                    Department Scheduling Overview
                  </h1>
                  <p className="text-white/80">
                    Manage and oversee all faculty schedules for the department.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 md:w-full">
                  <Link
                    to="/facultyscheduler/dean/schedules"
                    className="inline-flex items-center gap-2 rounded-xl bg-white text-purple-700 font-semibold px-4 py-2.5 shadow hover:shadow-md hover:-translate-y-0.5 transition w-auto md:w-full md:justify-center"
                  >
                    View Full Schedule
                    <ChevronRight size={16} />
                  </Link>
                  <Link
                    to="/facultyscheduler/dean/conflicts"
                    className="inline-flex items-center gap-2 rounded-xl bg-purple-700/40 text-white font-semibold px-4 py-2.5 hover:bg-purple-700/50 hover:-translate-y-0.5 transition w-auto md:w-full md:justify-center"
                  >
                    Resolve Conflicts
                    <AlertTriangle size={16} />
                  </Link>
                </div>
              </div>
              <div className="mt-6 grid [grid-template-columns:repeat(auto-fit,minmax(140px,1fr))] gap-3">
                <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 ring-1 ring-white/10">
                  <p className="text-sm text-white/80">Pending Reviews</p>
                  <p className="text-2xl font-extrabold">{pendingCount}</p>
                </div>
                <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 ring-1 ring-white/10">
                  <p className="text-sm text-white/80">With Conflicts</p>
                  <p className="text-2xl font-extrabold">{conflictCount}</p>
                </div>
                <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 ring-1 ring-white/10">
                  <p className="text-sm text-white/80">This Week</p>
                  <p className="text-2xl font-extrabold">Overview</p>
                </div>
              </div>
            </div>
          </motion.div>

          <KpiCardFile />

          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-8">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}>
                <WeeklyBarChartContainer 
                  selectedDay={selectedDay}
                  onDaySelect={handleDaySelect}
                />
              </motion.div>

              <AnimatePresence>
                {selectedDay && (
                  <ClassBreakdown
                    selectedDay={selectedDay}
                    classes={allClasses}
                    onClear={() => setSelectedDay(null)}
                  />
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm"
              >
                <div className="flex justify-between items-center mb-4 md:flex-col md:items-start md:gap-2">
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
                        className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200 md:flex-col md:items-start"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                            {item.facultyName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          <p className="font-semibold text-gray-700 truncate">{item.facultyName}</p>
                        </div>
                        <p className="text-sm text-gray-500 md:hidden">{item.courses}</p>
                        <div className="flex justify-end items-center gap-3 self-end md:self-stretch">
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

            <div className="space-y-8 ">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 }}
                className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <QuickActionLink to="/facultyscheduler/dean/schedules" icon={<CalendarCheck size={20} />} text="View Full Schedule" />
                  <QuickActionLink to="/facultyscheduler/dean/conflicts" icon={<AlertTriangle size={20} />} text="Resolve Conflicts" />
                  <QuickActionLink to="/facultyscheduler/dean/reports/load" icon={<FileBarChart size={20} />} text="Generate Load Reports" />
                </div>
              </motion.div>

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
                          animate={{ width: `${(faculty.load / 20) * 100}%` }}
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