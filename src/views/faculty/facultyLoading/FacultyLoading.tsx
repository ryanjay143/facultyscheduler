import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Book, Clock, Building2, Layers, CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// --- TYPE DEFINITIONS ---
interface AssignedClass {
  id: number;
  code: string;
  name: string;
  schedule: string;
  room: string;
  program: string;
  units: number;
  contactHours: number;
  color: 'sky' | 'emerald' | 'indigo' | 'rose' | 'amber';
}

// --- MOCK DATA ---
const facultyLoadData: AssignedClass[] = [
  { id: 1, code: 'CS101', name: 'Introduction to Programming', schedule: 'MWF 09:00-10:00', room: '101', program: 'BSIT', units: 3, contactHours: 3, color: 'sky' },
  { id: 2, code: 'AI401', name: 'Advanced AI', schedule: 'TTH 11:00-12:30', room: 'Lab 3', program: 'BSCS', units: 3, contactHours: 5, color: 'emerald' },
  { id: 3, code: 'CS205', name: 'Data Structures & Algorithms', schedule: 'MWF 10:00-11:00', room: '202', program: 'BSCS', units: 3, contactHours: 3, color: 'emerald' },
  { id: 4, code: 'IT302', name: 'Networking Fundamentals', schedule: 'TTH 14:00-15:30', room: '205', program: 'BSIT', units: 3, contactHours: 5, color: 'sky' },
  { id: 5, code: 'SE310', name: 'Software Engineering', schedule: 'F 13:00-16:00', room: '301', program: 'BSIT', units: 3, contactHours: 3, color: 'indigo' },
  { id: 6, code: 'DS301', name: 'Intro to Data Science', schedule: 'TTH 09:30-11:00', room: 'Lab 1', program: 'BSCS', units: 3, contactHours: 5, color: 'rose'},
];

// Color mapping para sa UI
const colorMap = {
    sky: { gradient: 'from-sky-500 to-cyan-400', text: 'text-sky-600', bg: 'bg-sky-50' },
    emerald: { gradient: 'from-emerald-500 to-green-400', text: 'text-emerald-600', bg: 'bg-emerald-50' },
    indigo: { gradient: 'from-indigo-500 to-purple-400', text: 'text-indigo-600', bg: 'bg-indigo-50' },
    rose: { gradient: 'from-rose-500 to-pink-400', text: 'text-rose-600', bg: 'bg-rose-50' },
    amber: { gradient: 'from-amber-500 to-orange-400', text: 'text-amber-600', bg: 'bg-amber-50' },
};

// --- MAIN COMPONENT ---
function FacultyLoading() {
  const totalSubjects = facultyLoadData.length;
  const totalUnits = facultyLoadData.reduce((sum, subject) => sum + subject.units, 0);
  const totalContactHours = facultyLoadData.reduce((sum, subject) => sum + subject.contactHours, 0);

  const summaryCards = [
    { title: 'Assigned Subjects', value: totalSubjects, icon: Layers },
    { title: 'Total Units', value: totalUnits, icon: Book },
    { title: 'Contact Hours/Week', value: totalContactHours, icon: Clock },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-8">
      {/* Hero / Page Header */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-lg">
        <div className="relative p-6 md:p-8 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            <CalendarDays size={14} /> Faculty Loading
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">My Teaching Load</h1>
          <p className="text-white/80">A.Y. 2024-2025 • 1st Semester</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/20">
            {summaryCards.map((card) => (
              <div key={card.title} className="p-4 text-center">
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-xs opacity-80">{card.title}</p>
              </div>
            ))}
        </div>
      </motion.div>

      {/* Assigned Subjects Grid */}
      <AnimatePresence>
        {facultyLoadData.length > 0 ? (
          // FIX 1: Gihimong grid nga naay 1, 2, ug 3 columns
          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facultyLoadData.map((subject) => {
              const accent = colorMap[subject.color] || colorMap.sky;
              return (
                <motion.div key={subject.id} variants={itemVariants}>
                  {/* FIX 2: Gi-ayo ang card design para sa grid */}
                  <div className="bg-card rounded-lg border shadow-sm h-full flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                    <div className={`h-2 w-full rounded-t-lg bg-gradient-to-r ${accent.gradient}`}></div>
                    <div className="p-5 flex-grow flex flex-col">
                        <div className="flex justify-between items-start">
                            <Badge className={`${accent.bg} ${accent.text} hover:${accent.bg}`}>{subject.code}</Badge>
                            <Badge variant="outline">{subject.program}</Badge>
                        </div>
                        <h3 className="mt-2 text-lg font-bold text-foreground leading-snug flex-grow">
                            {subject.name}
                        </h3>
                        <div className="mt-4 pt-4 border-t space-y-2 text-sm text-muted-foreground">
                             <p className="flex items-center gap-2"><Clock size={14}/> {subject.schedule}</p>
                             <p className="flex items-center gap-2"><Building2 size={14}/> {subject.room}</p>
                        </div>
                        <div className="mt-3 pt-3 border-t flex justify-between items-center text-sm font-medium">
                            <span className={accent.text}>Units: {subject.units}</span>
                            <span className="text-muted-foreground">Hrs/Wk: {subject.contactHours}</span>
                        </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div variants={itemVariants} className="mt-10 rounded-lg border-2 border-dashed bg-card p-10 text-center text-muted-foreground">
            <Layers className="mx-auto mb-3" />
            <p className="font-semibold text-foreground">No assigned subjects yet</p>
            <p className="text-sm">Please check back later or contact your program head.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default FacultyLoading;