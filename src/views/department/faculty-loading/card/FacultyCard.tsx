import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  FileStack,
  X,
  Gauge,
  BookOpen,
  CheckCircle2,
  CalendarDays
} from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { FacultyScheduleModal } from './FacultyScheduleModal';


// Type definitions for props
type Subject = {
  id: string;
  code: string;
  title: string;
  schedule?: string;
  units?: number;
};

type Faculty = {
  name: string;
  imageUrl?: string | null;
  expertise: string[];
  currentLoad: number;
  maxLoad: number;
  assignedSubjects: Subject[];
  maxSubjects: number;
};

// Main Component
export function FacultyCard({
  faculty,
  onUnassign,
}: {
  faculty: Faculty;
  onUnassign: (subjectId: string) => void;
}) {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // --- CALCULATIONS ---
  const safeMaxLoad = Math.max(0, faculty.maxLoad || 0);
  const safeMaxSubjects = Math.max(1, faculty.maxSubjects || 1);

  const loadPercentage =
    safeMaxLoad > 0 ? (faculty.currentLoad / safeMaxLoad) * 100 : 0;
  const subjectsLoaded = faculty.assignedSubjects.length;
  const subjectPercentage = Math.min(
    (subjectsLoaded / safeMaxSubjects) * 100,
    100
  );

  const isOverloaded = loadPercentage > 100;
  const subjectLimitReached = subjectsLoaded >= safeMaxSubjects;

  // --- STATUS CONFIGURATION ---
  const status =
    isOverloaded ? 'overloaded' : subjectLimitReached ? 'limit' : 'ok';
  const statusConfig: Record<
    'overloaded' | 'limit' | 'ok',
    {
      label: string;
      icon: React.ElementType;
      text: string;
      bg: string;
      ring: string;
      dot: string;
    }
  > = {
    overloaded: {
      label: 'Overloaded',
      icon: AlertTriangle,
      text: 'text-red-700',
      bg: 'bg-red-50',
      ring: 'ring-1 ring-red-200',
      dot: 'bg-red-500',
    },
    limit: {
      label: 'Subject Limit Reached',
      icon: AlertTriangle,
      text: 'text-yellow-700',
      bg: 'bg-yellow-50',
      ring: 'ring-1 ring-yellow-200',
      dot: 'bg-yellow-500',
    },
    ok: {
      label: 'Available',
      icon: CheckCircle2,
      text: 'text-emerald-700',
      bg: 'bg-emerald-50',
      ring: 'ring-1 ring-emerald-200',
      dot: 'bg-emerald-500',
    },
  };
  const StatusIcon = statusConfig[status].icon;

  // --- HELPERS ---
  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();

  const progressTransition = { type: 'spring', stiffness: 140, damping: 20 } as const;

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.96, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`relative overflow-hidden rounded-2xl border bg-white/90 p-5 shadow-sm backdrop-blur-sm hover:shadow-lg ${statusConfig[status].ring}`}
      >
        {/* Header */}
        <div className="flex items-start gap-4">
          {faculty.imageUrl ? (
            <img
              src={faculty.imageUrl}
              alt={faculty.name}
              className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-md"
            />
          ) : (
            <div className="grid h-20 w-20 place-items-center rounded-full border-4 border-white bg-gradient-to-br from-violet-500 to-indigo-500 text-xl font-bold text-white shadow-md">
              {getInitials(faculty.name)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-xl font-bold text-gray-900">{faculty.name}</h3>
            {/* Status Pill */}
            <div
              className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${statusConfig[status].bg} ${statusConfig[status].text}`}
            >
              <StatusIcon size={12} />
              <span>{statusConfig[status].label}</span>
            </div>
            {/* Expertise */}
            {faculty.expertise?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {faculty.expertise.map((exp) => (
                  <span
                    key={exp}
                    className="rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Subject Load */}
          <div className={`rounded-lg border p-3 ${subjectLimitReached ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200 bg-gray-50'}`}>
            <div className="mb-1 flex items-center justify-between text-sm font-semibold">
              <span className="inline-flex items-center gap-1.5 text-gray-600"><BookOpen size={14} className="text-indigo-500" />Subject Load</span>
              <span className={subjectLimitReached ? 'text-yellow-700' : 'text-gray-800'}>{subjectsLoaded} / {safeMaxSubjects}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200/70">
              <motion.div initial={{ width: 0 }} animate={{ width: `${subjectPercentage}%` }} transition={progressTransition} className={`h-2 rounded-full ${subjectLimitReached ? 'bg-yellow-500' : 'bg-gradient-to-r from-violet-400 to-purple-500'}`} />
            </div>
          </div>
          {/* Unit Load */}
          <div className={`rounded-lg border p-3 ${isOverloaded ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
            <div className="mb-1 flex items-center justify-between text-sm font-semibold">
              <span className="inline-flex items-center gap-1.5 text-gray-600"><Gauge size={14} className="text-teal-500" />Unit Load</span>
              <span className={isOverloaded ? 'text-red-600' : 'text-gray-800'}>{faculty.currentLoad} / {safeMaxLoad}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200/70">
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(loadPercentage, 100)}%` }} transition={progressTransition} className={`h-2 rounded-full ${isOverloaded ? 'bg-red-500' : 'bg-gradient-to-r from-teal-400 to-cyan-500'}`} />
            </div>
          </div>
        </div>

        {/* Assigned Subjects Accordion */}
        <div className="mt-4 border-t border-gray-100 pt-2">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="assigned-subjects" className="border-b-0">
              <AccordionTrigger className="rounded-md px-2 py-1 text-md font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:no-underline">
                <div className="flex items-center gap-2">
                  <FileStack size={16} className="text-indigo-600" />
                  <span>View Assigned Subjects ({subjectsLoaded})</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-3">
                <div className="space-y-2">
                  {faculty.assignedSubjects.length > 0 ? (
                    faculty.assignedSubjects.map((subj) => (
                      <motion.div
                        key={subj.id} layout initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }}
                        className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-2.5 transition-colors hover:border-indigo-200"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-800">{subj.code} - {subj.title}</p>
                          <p className="text-xs text-gray-500">{subj.units} units</p>
                        </div>
                        <button onClick={() => onUnassign(subj.id)} title="Unassign subject" className="rounded-md p-1 text-gray-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100">
                          <X size={18} />
                        </button>
                      </motion.div>
                    ))
                  ) : (
                    <p className="py-4 text-center text-sm text-gray-400">No subjects assigned.</p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* View Schedule Button */}
        <div className="mt-4 border-t border-gray-100 pt-4">
          <Button
            onClick={() => setIsScheduleModalOpen(true)}
            className="w-full flex items-center gap-2"
            variant="outline"
          >
            <CalendarDays size={16} />
            View Weekly Schedule
          </Button>
        </div>
      </motion.div>

      {/* Modal Rendering */}
      <AnimatePresence>
        {isScheduleModalOpen && (
          <FacultyScheduleModal
            faculty={faculty}
            onClose={() => setIsScheduleModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}