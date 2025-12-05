// src/components/FacultyLoading/TimelineScheduleView.tsx

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, AlertTriangle, CalendarOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- PLACEHOLDER ---
const PLACEHOLDER_AVATAR = "https://i.pravatar.cc/150?img=40";


// -------------------------------------------------------------------
// --- TYPE DEFINITIONS (Based on assumed API/Component needs) ---
// -------------------------------------------------------------------

type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';

// Component's Subject type (extended for component logic)
export interface Subject {
    id: string; // Component uses string ID
    assignedTo: string | null; // Faculty ID string or null
    schedule: string; // e.g., "Mon 08:30-10:00"
    days: Day[]; // e.g., ['Mon', 'Wed', 'Fri']
    expertise: string; // Subject's required expertise
    units: number; // Subject's unit load

    // Fields derived from API (used for display in this component)
    subject_code: string; // API field
    des_title: string; // API field
}

// Component's Faculty type (extended for component logic)
export interface FacultyWithAssignments {
    id: string; // Component uses string ID
    name: string;
    profile_picture: string | null; // FIX: Use the correct field name
    expertise: string[];
    currentLoad: number;
    maxLoad: number;
    maxSubjects: number;
    assignedSubjects: any[]; // Minimal type needed for length check
    availability: {
        days: string[]; // e.g., ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    };
}


// --- PROPS INTERFACES ---

interface TimelineScheduleProps {
  subjects: Subject[];
  faculty: FacultyWithAssignments[];
  onAssignSubject: (subjectId: string, facultyId: string) => void;
}

interface AssignmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  subject: Subject | null;
  facultyList: FacultyWithAssignments[];
  onAssign: (facultyId: string) => void;
}


// --- HELPERS (UNCHANGED) ---
const daysOfWeek: Day[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
const timeToMinutes = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return (hours * 60) + minutes;
};
const scheduleStartTime = timeToMinutes('08:00');
const slotHeight = 5; // rem, for 1 hour

const getSubjectPosition = (schedule: string) => {
    try {
        const timePart = schedule.split(' ')[1];
        const [start, end] = timePart.split('-');
        const top = ((timeToMinutes(start) - scheduleStartTime) / 60) * slotHeight;
        const height = ((timeToMinutes(end) - timeToMinutes(start)) / 60) * slotHeight;
        return { top: `${top}rem`, height: `${height}rem` };
    } catch { return { top: 0, height: '3rem' }; }
};


export function TimelineScheduleView({ subjects, faculty, onAssignSubject }: TimelineScheduleProps) {
  const [activeDay, setActiveDay] = useState<Day>('Mon');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [currentTimePos, setCurrentTimePos] = useState(0);

  const subjectsForDay = useMemo(() => {
    return subjects.filter(subject => subject.days.includes(activeDay));
  }, [subjects, activeDay]);

  useEffect(() => {
    const updateCurrentTime = () => {
        const now = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        const top = ((nowMinutes - scheduleStartTime) / 60) * slotHeight;
        setCurrentTimePos(top);
    };
    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenDrawer = (subject: Subject) => {
    if (subject.assignedTo) return;
    setSelectedSubject(subject);
    setIsDrawerOpen(true);
  };
  
  const handleAssign = (facultyId: string) => {
    if (!selectedSubject) return;
    onAssignSubject(selectedSubject.id, facultyId);
    setIsDrawerOpen(false);
    setSelectedSubject(null);
  };

  return (
    <>
      <div className="bg-card border rounded-xl shadow-sm flex flex-col h-[85vh]">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Daily Timeline Schedule</h2>
            <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
              {daysOfWeek.map(day => (
                <Button key={day} variant={activeDay === day ? 'secondary' : 'ghost'} size="sm" onClick={() => setActiveDay(day)} className="w-20">
                  {day}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto relative p-4">
          <div className="relative h-full">
            <div className="absolute inset-y-0 left-0 w-16">
              {timeSlots.map(time => (
                <div key={time} className="relative text-right h-[5rem]">
                   <span className="absolute -top-2 right-2 text-xs text-muted-foreground">{time}</span>
                   <div className="absolute top-0 right-0 w-[calc(100vw)] h-px bg-border -z-10"></div>
                </div>
              ))}
            </div>
            {new Date().getDay() -1 === daysOfWeek.indexOf(activeDay) &&
                <div className="absolute left-16 right-0 z-20" style={{top: `${currentTimePos}rem`}}>
                    <div className="relative h-px bg-red-500"><div className="absolute -left-1.5 -top-1.5 w-3 h-3 bg-red-500 rounded-full"></div></div>
                </div>
            }
            <div className="relative ml-16 h-full">
              <AnimatePresence>
                {subjectsForDay.map(subject => {
                  const facultyMember = subject.assignedTo ? faculty.find(f => f.id === subject.assignedTo) : null;
                  const position = getSubjectPosition(subject.schedule);
                  return (
                    <motion.div
                      key={subject.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
                      className={`absolute w-full p-3 rounded-lg text-sm transition-all shadow-md cursor-pointer ${ facultyMember ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white' : 'bg-muted border border-dashed hover:bg-muted/80'}`}
                      style={{ top: position.top, height: position.height }}
                      onClick={() => handleOpenDrawer(subject)}
                    >
                      {/* FIX: Use API fields */}
                      <p className="font-bold truncate">{subject.subject_code}</p>
                      <p className={facultyMember ? 'text-white/80' : 'text-muted-foreground'}>{subject.des_title}</p>
                      {facultyMember && (
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/20">
                          {/* FIX: Use profile_picture with fallback */}
                          <img src={facultyMember.profile_picture || PLACEHOLDER_AVATAR} className="w-6 h-6 rounded-full border-2 border-white/50" alt={facultyMember.name} />
                          <span className="font-semibold">{facultyMember.name}</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {subjectsForDay.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground"><CalendarOff size={48} /><p className="mt-4 text-lg font-semibold">No classes scheduled for {activeDay}</p></div>
              )}
            </div>
          </div>
        </div>
      </div>
      <AssignmentDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} subject={selectedSubject} facultyList={faculty} onAssign={handleAssign} />
    </>
  );
}

// Assignment Drawer Component
function AssignmentDrawer({ isOpen, onClose, subject, facultyList, onAssign }: AssignmentDrawerProps) {
  if (!subject) return null;
  const getFacultySuitability = (faculty: FacultyWithAssignments) => {
    const hasExpertise = faculty.expertise.includes(subject.expertise);
    const isAvailable = subject.days.every((day: string) => faculty.availability.days.includes(day));
    const isOverloaded = faculty.currentLoad + subject.units > faculty.maxLoad;
    const isSubjectLimitReached = faculty.assignedSubjects.length >= faculty.maxSubjects;
    const canAssign = hasExpertise && isAvailable && !isOverloaded && !isSubjectLimitReached;
    let reason = '';
    if (isOverloaded) reason = "Overloaded";
    else if (isSubjectLimitReached) reason = "Subject limit reached";
    else if (!isAvailable) reason = "Schedule conflict";
    else if (!hasExpertise) reason = "Expertise mismatch";
    return { canAssign, reason, isGoodMatch: hasExpertise && isAvailable };
  };
  const sortedFaculty = useMemo(() => {
    if (!facultyList) return [];
    // FIX: Using facultyList directly in dependency array is safer than assuming it's stable
    return [...facultyList].sort((a, b) => { 
      const suitA = getFacultySuitability(a);
      const suitB = getFacultySuitability(b);
      // Sort logic
      if (suitA.canAssign && !suitB.canAssign) return -1;
      if (!suitA.canAssign && suitB.canAssign) return 1;
      if (suitA.isGoodMatch && !suitB.isGoodMatch) return -1; // Prioritize good matches
      if (!suitA.isGoodMatch && suitB.isGoodMatch) return 1;
      return 0;
    });
  }, [facultyList, subject]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l z-50 flex flex-col"
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold">Assign Subject: {subject.subject_code}</h2>
              <Button variant="ghost" size="icon" onClick={onClose}><X size={20} /></Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {sortedFaculty.map(faculty => {
                const { canAssign, reason, isGoodMatch } = getFacultySuitability(faculty);
                return (
                  <div key={faculty.id} className={`p-3 border rounded-lg flex items-center gap-4 transition-opacity ${!canAssign && 'opacity-50'}`}>
                    {/* FIX: Use profile_picture with fallback */}
                    <img src={faculty.profile_picture || PLACEHOLDER_AVATAR} alt={faculty.name} className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <p className="font-bold">{faculty.name}</p>
                      <div className="text-xs">
                        {isGoodMatch && !reason && <span className="flex items-center gap-1 text-green-500 font-semibold"><Sparkles size={14}/> Good Match</span>}
                        {reason && <span className="flex items-center gap-1 text-amber-500 font-semibold"><AlertTriangle size={14}/> {reason}</span>}
                      </div>
                    </div>
                    <Button onClick={() => onAssign(faculty.id)} disabled={!canAssign}>Assign</Button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}