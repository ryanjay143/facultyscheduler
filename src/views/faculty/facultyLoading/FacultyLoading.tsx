import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Book, Clock, Building2, Layers, CalendarDays } from 'lucide-react';
import Header from '../layouts/Header';

// --- TYPE DEFINITIONS ---
interface AssignedClass {
  id: number;
  code: string;
  name: string;
  schedule: string;
  room: string;
  program: string;
  units: {
    total: number;
    lec: number;
    lab: number;
  };
  contactHours: number;
}

// --- MOCK DATA ---
const facultyLoadData: AssignedClass[] = [
  { id: 1, code: 'CS101', name: 'Introduction to Programming', schedule: 'MW, 09:00-11:00', room: '101', program: 'BSIT', units: { total: 3, lec: 2, lab: 1 }, contactHours: 5 },
  { id: 2, code: 'AI401', name: 'Advanced AI', schedule: 'TTH, 11:00-13:00', room: 'Lab 3', program: 'BSCS', units: { total: 4, lec: 3, lab: 1 }, contactHours: 6 },
  { id: 3, code: 'CS205', name: 'Data Structures & Algorithms', schedule: 'MW, 10:00-12:00', room: '202', program: 'BSCS', units: { total: 3, lec: 2, lab: 1 }, contactHours: 5 },
  { id: 4, code: 'IT302', name: 'Networking Fundamentals', schedule: 'TTH, 14:00-16:00', room: '205', program: 'BSIT', units: { total: 3, lec: 2, lab: 1 }, contactHours: 5 },
  { id: 5, code: 'SE310', name: 'Software Engineering', schedule: 'F, 13:00-16:00', room: '301', program: 'BSIT', units: { total: 3, lec: 3, lab: 0 }, contactHours: 3 },
];

// --- Helpers ---
const getProgramAccent = (program: string) => {
  switch (program) {
    case 'BSIT':
      return {
        bar: 'from-indigo-500 to-violet-500',
        tag: 'bg-indigo-50 text-indigo-700',
        dot: 'bg-indigo-500',
        number: 'text-indigo-600',
      };
    case 'BSCS':
      return {
        bar: 'from-emerald-500 to-teal-500',
        tag: 'bg-emerald-50 text-emerald-700',
        dot: 'bg-emerald-500',
        number: 'text-emerald-600',
      };
    default:
      return {
        bar: 'from-sky-500 to-blue-500',
        tag: 'bg-sky-50 text-sky-700',
        dot: 'bg-sky-500',
        number: 'text-sky-600',
      };
  }
};

// --- MAIN COMPONENT ---
function FacultyLoading() {
  // Totals
  const totalSubjects = facultyLoadData.length;
  const totalUnits = facultyLoadData.reduce((sum, subject) => sum + subject.units.total, 0);
  const totalContactHours = facultyLoadData.reduce((sum, subject) => sum + subject.contactHours, 0);
  const uniquePrograms = new Set(facultyLoadData.map((s) => s.program)).size;

  const summaryCards = [
    { title: 'Total Subjects', value: totalSubjects, icon: Layers, color: 'text-blue-600', spot: 'bg-blue-500/10', accent: 'from-blue-500/20 to-indigo-500/20' },
    { title: 'Total Units', value: totalUnits, icon: Book, color: 'text-purple-600', spot: 'bg-purple-500/10', accent: 'from-purple-500/20 to-fuchsia-500/20' },
    { title: 'Contact Hours / Week', value: totalContactHours, icon: Clock, color: 'text-emerald-600', spot: 'bg-emerald-500/10', accent: 'from-emerald-500/20 to-teal-500/20' },
    { title: 'Programs', value: uniquePrograms, icon: Building2, color: 'text-amber-600', spot: 'bg-amber-500/10', accent: 'from-amber-500/20 to-orange-500/20' },
  ] as const;

  // Animations
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 16 } },
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="mx-auto max-w-7xl">
          {/* Hero / Page Header */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white shadow-xl mb-8"
          >
            {/* Soft glow orbs */}
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

            <div className="relative p-6 md:p-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold shadow-sm ring-1 ring-white/10">
                <CalendarDays size={14} />
                Faculty Loading
              </div>

              <div className="mt-3 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">My Teaching Load</h1>
                  <p className="text-white/85">A.Y. 2024-2025 • 1st Semester</p>
                </div>
              </div>

              {/* KPI strip inside hero */}
              <div className="grid grid-cols-2 md:grid-cols-1 gap-3 mt-6">
                {summaryCards.map((card) => (
                  <div
                    key={card.title}
                    className="group relative rounded-xl bg-white/15 border border-white/20 backdrop-blur-md p-4 shadow-sm hover:shadow transition-all"
                  >
                    {/* Accent background gradient */}
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${card.accent} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    <div className="relative flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs opacity-90">{card.title}</p>
                        <p className="text-2xl font-extrabold leading-tight">{card.value}</p>
                      </div>
                      <div className={`p-2 rounded-lg ${card.spot}`}>
                        <card.icon className={`${card.color} drop-shadow`} size={20} />
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Section Header */}
          <motion.div variants={itemVariants} className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-800">Assigned Subjects</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                {facultyLoadData.length} offerings
              </span>
            </div>
            {/* <p className="text-sm text-gray-500 hidden md:block">
              {uniquePrograms} programs • {totalUnits} units • {totalContactHours} hrs/wk
            </p> */}
          </motion.div>

          {/* Assigned Subjects List */}
          <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-1 gap-4">
            {facultyLoadData.map((subject) => {
              const accent = getProgramAccent(subject.program);
              return (
                <motion.div
                  key={subject.id}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  className="group relative rounded-2xl"
                >
                  {/* Gradient border frame */}
                  <div className="bg-gradient-to-br from-gray-100 to-white p-[1px] rounded-2xl shadow-sm group-hover:shadow-md transition-shadow">
                    <div className="relative bg-white rounded-2xl border border-gray-200">
                      {/* Accent bar */}
                      <div className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-gradient-to-b ${accent.bar}`} />

                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          {/* Left: Course Details */}
                          <div className="flex-grow min-w-0">
                            <span className={`inline-flex items-center gap-2 ${accent.tag} text-[11px] font-bold rounded-full px-2.5 py-1`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
                              {subject.code}
                            </span>
                            <h3 className="mt-2 text-lg font-bold text-gray-900 leading-snug truncate">
                              {subject.name}
                            </h3>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-700 px-2 py-1">
                                <CalendarDays className="h-3.5 w-3.5" />
                                {subject.schedule}
                              </span>
                              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-700 px-2 py-1">
                                <Building2 className="h-3.5 w-3.5" />
                                Room {subject.room}
                              </span>
                              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-700 px-2 py-1">
                                <Layers className="h-3.5 w-3.5" />
                                {subject.program}
                              </span>
                            </div>
                          </div>

                          {/* Right: Units */}
                          <div className="text-right flex-shrink-0">
                            <p className={`text-3xl font-extrabold ${accent.number}`}>{subject.units.total}</p>
                            <p className="text-xs text-gray-500">Units ({subject.units.lec} Lec, {subject.units.lab} Lab)</p>
                          </div>
                        </div>

                        {/* Details strip */}
                        <div className="border-t mt-5 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-5">
                          <DetailItem icon={CalendarDays} label="Schedule" value={subject.schedule} />
                          <DetailItem icon={Building2} label="Room" value={subject.room} />
                          <DetailItem icon={Clock} label="Contact Hours" value={`${subject.contactHours} hrs/wk`} />
                        </div>
                      </div>

                      {/* Accent ring on hover */}
                      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-indigo-200/0 group-hover:ring-indigo-300/70 transition-all" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Empty state (if no data) */}
          {facultyLoadData.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="mt-10 rounded-2xl border bg-white p-10 text-center text-gray-600 shadow-sm"
            >
              <Layers className="mx-auto mb-3 text-gray-400" />
              <p className="font-semibold">No assigned subjects yet</p>
              <p className="text-sm text-gray-500">Please check back later.</p>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

// --- Reusable DetailItem Component ---
const DetailItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3 text-sm">
    <div className="mt-0.5 h-9 w-9 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center flex-shrink-0 ring-1 ring-inset ring-gray-200">
      <Icon className="h-4.5 w-4.5" />
    </div>
    <div className="min-w-0">
      <p className="font-semibold text-gray-800 truncate">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  </div>
);

export default FacultyLoading;