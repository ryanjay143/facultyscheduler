import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  FileStack,
  X,
  Gauge,
  BookOpen,
  CheckCircle2,
  // ChevronDown is now handled by Shadcn's Accordion
} from 'lucide-react';
import React from 'react';

// Import the Shadcn UI Accordion components


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

export function FacultyCard({
  faculty,
  onUnassign,
}: {
  faculty: Faculty;
  onUnassign: (subjectId: string) => void;
}) {
  // REMOVED: No longer need manual state for the accordion
  // const [isAccordionOpen, setIsAccordionOpen] = useState(false);

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
      label: 'Subject limit reached',
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
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.997 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`relative overflow-hidden rounded-2xl border bg-white/90 p-5 shadow-sm backdrop-blur-sm hover:shadow-xl ${statusConfig[status].ring}`}
    >
      {/* Decorative gradient corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-indigo-200/50 via-purple-200/50 to-cyan-200/50 blur-2xl"
      />

      {/* Header */}
      <div className="flex items-start gap-4">
        {/* Avatar */}
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
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-xl font-bold text-gray-900">
                {faculty.name}
              </h3>
              {/* Status pill */}
              <div
                className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${statusConfig[status].bg} ${statusConfig[status].text}`}
              >
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full ${statusConfig[status].dot}`}
                />
                <StatusIcon size={12} />
                <span>{statusConfig[status].label}</span>
              </div>
            </div>
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
      <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-1">
        {/* Subject Load */}
        <div
          className={`rounded-lg border p-3 ${
            subjectLimitReached
              ? 'border-yellow-100 bg-yellow-50'
              : 'border-gray-100 bg-gray-50'
          }`}
        >
          <div className="mb-1 flex items-center justify-between text-sm font-semibold">
            <span className="inline-flex items-center gap-1 text-gray-600">
              <BookOpen size={14} className="text-indigo-500" /> Subject Load (
              {safeMaxSubjects} max)
            </span>
            <span
              className={
                subjectLimitReached ? 'text-yellow-700' : 'text-gray-800'
              }
            >
              {subjectsLoaded} / {safeMaxSubjects}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200/70">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${subjectPercentage}%` }}
              transition={progressTransition}
              className={`h-2 rounded-full ${
                subjectLimitReached
                  ? 'bg-yellow-500'
                  : 'bg-gradient-to-r from-violet-400 to-purple-500'
              }`}
            />
          </div>
          {subjectLimitReached && subjectsLoaded > 0 && (
            <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-yellow-700">
              <AlertTriangle size={14} /> Limit reached
            </div>
          )}
        </div>

        {/* Unit Load */}
        <div
          className={`rounded-lg border p-3 ${
            isOverloaded
              ? 'border-red-100 bg-red-50'
              : 'border-gray-100 bg-gray-50'
          }`}
        >
          <div className="mb-1 flex items-center justify-between text-sm font-semibold">
            <span className="inline-flex items-center gap-1 text-gray-600">
              <Gauge size={14} className="text-teal-500" /> Unit Load
            </span>
            <span
              className={isOverloaded ? 'text-red-600' : 'text-gray-800'}
            >
              {faculty.currentLoad} / {safeMaxLoad}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200/70">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(loadPercentage, 100)}%` }}
              transition={progressTransition}
              className={`h-2 rounded-full ${
                isOverloaded
                  ? 'bg-red-500'
                  : 'bg-gradient-to-r from-teal-400 to-cyan-500'
              }`}
            />
          </div>
          {isOverloaded && (
            <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600">
              <AlertTriangle size={14} /> Overloaded
            </div>
          )}
        </div>
      </div>

      {/* --- REFACTORED: Assigned Subjects Accordion using Shadcn UI --- */}
      <div className="mt-6 border-t border-gray-200 pt-3">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="assigned-subjects" className="border-b-0">
            {/* The trigger now acts as our clickable header */}
            <AccordionTrigger className="rounded-md px-2 py-1 text-md font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
              <div className="flex flex-1 items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileStack size={16} className="text-indigo-600" />
                  <span>View Assigned Subjects</span>
                  <span className="ml-1 rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                    {subjectsLoaded}
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            
            {/* The content holds the list of subjects */}
            <AccordionContent className="pt-3">
              <div className="space-y-2">
                {faculty.assignedSubjects.length > 0 ? (
                  faculty.assignedSubjects.map((subj) => (
                    // You can keep framer-motion here for the list item animation
                    <motion.div
                      key={subj.id}
                      layout
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-2.5 transition-colors hover:border-indigo-200 hover:bg-indigo-50/40"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-800">
                          {subj.code} - {subj.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {subj.schedule || 'TBA'}
                          <span className="mx-1.5 text-gray-300">•</span>
                          {typeof subj.units === 'number'
                            ? `${subj.units} units`
                            : '—'}
                        </p>
                      </div>
                      <button
                        onClick={() => onUnassign(subj.id)}
                        title="Unassign subject"
                        aria-label={`Unassign ${subj.code}`}
                        className="rounded-md p-1 text-gray-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                      >
                        <X size={18} />
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <p className="py-4 text-center text-sm text-gray-400">
                    No subjects assigned yet.
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </motion.div>
  );
}