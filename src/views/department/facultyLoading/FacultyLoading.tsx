// src/pages/FacultyLoading.tsx

import { useState, useMemo } from 'react';
import { Sparkles, Calendar, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { TimelineScheduleView } from './TimelineScheduleView';
import { RedesignedFacultyView } from './FacultyView';


// --- TYPE DEFINITIONS ---
// Exporting these allows other files to import and use them
export interface Subject {
  id: string;
  code: string;
  title: string;
  schedule: string;
  days: string[];
  units: number;
  expertise: string;
  assignedTo: string | null;
}

export interface Faculty {
  id: string;
  name: string;
  maxLoad: number;
  maxSubjects: number;
  expertise: string[];
  availability: {
    days: string[];
    note: string;
  };
  imageUrl: string;
}

export interface FacultyWithAssignments extends Faculty {
  assignedSubjects: Subject[];
  currentLoad: number;
}


// --- DUMMY DATA ---
const initialSubjects: Subject[] = [
    { id: 'subj-1', code: 'CS-301', title: 'Data Structures', schedule: 'MWF 9:00-10:00', days: ['Mon', 'Wed', 'Fri'], units: 3, expertise: 'Algorithms', assignedTo: null },
    { id: 'subj-2', code: 'IT-411', title: 'Advanced Programming', schedule: 'TTH 10:30-12:00', days: ['Tue', 'Thu'], units: 3, expertise: 'Programming', assignedTo: null },
    { id: 'subj-3', code: 'DS-210', title: 'Intro to Data Science', schedule: 'MWF 1:00-2:00', days: ['Mon', 'Wed', 'Fri'], units: 3, expertise: 'Data Science', assignedTo: null },
    { id: 'subj-4', code: 'CS-412', title: 'Machine Learning', schedule: 'TTH 2:30-4:00', days: ['Tue', 'Thu'], units: 3, expertise: 'Machine Learning', assignedTo: null },
    { id: 'subj-5', code: 'IT-205', title: 'Database Management', schedule: 'MWF 11:00-12:00', days: ['Mon', 'Wed', 'Fri'], units: 3, expertise: 'Database', assignedTo: 'fac-2' },
    { id: 'subj-6', code: 'CS-101', title: 'Intro to Computing', schedule: 'TTH 8:30-10:00', days: ['Tue', 'Thu'], units: 3, expertise: 'Programming', assignedTo: null },
    { id: 'subj-7', code: 'SYS-300', title: 'Systems Architecture', schedule: 'MWF 10:00-11:00', days: ['Mon', 'Wed', 'Fri'], units: 3, expertise: 'Systems Architecture', assignedTo: null },
    { id: 'subj-8', code: 'SE-301', title: 'Software Engineering', schedule: 'TTH 1:00-2:30', days: ['Tue', 'Thu'], units: 3, expertise: 'Software Engineering', assignedTo: null },
    { id: 'subj-9', code: 'HCI-200', title: 'Human-Computer Interaction', schedule: 'MWF 3:00-4:00', days: ['Mon', 'Wed', 'Fri'], units: 3, expertise: 'HCI', assignedTo: null },
];
const initialFaculty: Faculty[] = [
    { id: 'fac-1', name: 'Dr. Maria Santos', maxLoad: 12, maxSubjects: 4, expertise: ['Machine Learning', 'Data Science'], availability: { days: ['Tue', 'Thu'], note: 'Prefers TTH' }, imageUrl: 'https://i.pravatar.cc/150?u=maria.santos' },
    { id: 'fac-2', name: 'Prof. Albie Cruz', maxLoad: 15, maxSubjects: 4, expertise: ['Programming', 'Database', 'Algorithms'], availability: { days: ['Mon', 'Wed', 'Fri'], note: 'Prefers MWF AM' }, imageUrl: 'https://i.pravatar.cc/150?u=albie.cruz' },
    { id: 'fac-3', name: 'Prof. John Reyes', maxLoad: 12, maxSubjects: 4, expertise: ['Algorithms', 'Systems Architecture'], availability: { days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], note: 'Anytime' }, imageUrl: 'https://i.pravatar.cc/150?u=john.reyes' },
    { id: 'fac-4', name: 'Prof. Angela David', maxLoad: 12, maxSubjects: 4, expertise: ['Computer Networks', 'Cyber Security'], availability: { days: ['Tue', 'Thu'], note: 'Prefers TTH PM' }, imageUrl: 'https://i.pravatar.cc/150?u=angela.david' },
    { id: 'fac-5', name: 'Dr. Ben Castro', maxLoad: 15, maxSubjects: 4, expertise: ['Software Engineering', 'Software Development', 'Programming'], availability: { days: ['Mon', 'Wed', 'Fri'], note: 'Anytime' }, imageUrl: 'https://i.pravatar.cc/150?u=ben.castro' },
];


function FacultyLoading() {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [faculty, _setFaculty] = useState<Faculty[]>(initialFaculty);
  const [activeView, setActiveView] = useState<'schedule' | 'faculty'>('schedule');

  const handleAssignSubject = (subjectId: string, facultyId: string) => {
    setSubjects(prev =>
      prev.map(s => (s.id === subjectId ? { ...s, assignedTo: facultyId } : s))
    );
  };

  const handleUnassignSubject = (subjectId: string) => {
    setSubjects(prev =>
        prev.map(s => (s.id === subjectId ? { ...s, assignedTo: null } : s))
    );
  };

  const facultyWithAssignments = useMemo((): FacultyWithAssignments[] => {
    return faculty.map((fac: Faculty) => {
      const assigned = subjects.filter((s: Subject) => s.assignedTo === fac.id);
      const currentLoad = assigned.reduce((sum, s) => sum + s.units, 0);
      return { ...fac, assignedSubjects: assigned, currentLoad };
    });
  }, [subjects, faculty]);

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white shadow-lg p-6 md:p-8"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold shadow-sm">
          <Sparkles size={14} /> Faculty Loading
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Assign Subjects, Balance Loads</h1>
        <p className="text-white/85 max-w-2xl">Use the master schedule to assign subjects or view individual faculty loads.</p>
      </motion.div>

      {/* View Toggles */}
      <div className="flex justify-center">
        <div className="p-1 bg-muted rounded-lg flex items-center gap-1">
          <Button
            onClick={() => setActiveView('schedule')}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${activeView === 'schedule' ? 'bg-background text-primary shadow-sm' : 'bg-transparent text-muted-foreground hover:text-primary'}`}
            variant="ghost"
          >
            <Calendar size={16} /> Master Schedule
          </Button>
          <Button
            onClick={() => setActiveView('faculty')}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${activeView === 'faculty' ? 'bg-background text-primary shadow-sm' : 'bg-transparent text-muted-foreground hover:text-primary'}`}
            variant="ghost"
          >
            <Users size={16} /> Faculty View
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeView === 'schedule' ? (
            <TimelineScheduleView
              subjects={subjects}
              faculty={facultyWithAssignments}
              onAssignSubject={handleAssignSubject}
            />
          ) : (
            <RedesignedFacultyView
              faculty={facultyWithAssignments}
              subjects={subjects}
              onUnassignSubject={handleUnassignSubject}
              onAssignSubject={handleAssignSubject}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default FacultyLoading;