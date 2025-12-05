// src/components/FacultyLoading/RedesignedMasterSchedule.tsx

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// --- Placeholder for null profile pictures ---
const PLACEHOLDER_AVATAR = "https://i.pravatar.cc/150?img=68";

// -------------------------------------------------------------------
// --- TYPE DEFINITIONS (Matching the component's needs) ---
// -------------------------------------------------------------------

// Faculty data structure from your API
interface FacultyApiData {
    id: number;
    name: string;
    profile_picture: string | null;
    expertise: string[];
    t_load_units: number; 
    regular_limit?: number; 
    assignedSubjects?: { id: number; total_units: number }[]; // Minimal required fields for load calculation
    availability?: { days: string[]; timeSlots: string[]; };
}

// Subject data structure from your API
interface SubjectApiData {
    id: number;
    subject_code: string;
    des_title: string;
    total_units: number;
}

// Component-specific Faculty type (extending API data)
interface FacultyWithAssignments extends FacultyApiData {
    currentLoad: number; 
    maxLoad: number;     
    maxSubjects: number; 
    assignedSubjects: { id: number; total_units: number }[]; 
    availability: { days: string[]; timeSlots: string[]; }; 
}

// Component-specific Subject type (extending API data)
interface ComponentSubject extends SubjectApiData {
    assignedTo: number | null; 
    expertise: string; 
    days: string[]; 
    schedule: string; 
    units: number; 
}


// --- PROPS INTERFACES ---
interface RedesignedMasterScheduleProps {
  subjects: ComponentSubject[];
  faculty: FacultyWithAssignments[];
  onAssignSubject: (subjectId: number, facultyId: number) => void;
}

interface AssignmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  subject: ComponentSubject | null;
  facultyList: FacultyWithAssignments[];
  onAssign: (facultyId: number) => void;
}

// -------------------------------------------------------------------
// --- UTILITY FUNCTIONS (UNCHANGED) ---
// -------------------------------------------------------------------

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const timeToMinutes = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return (hours * 60) + minutes;
};
const scheduleStartTime = timeToMinutes('08:30');
const slotHeight = 4; // rem

const getSubjectPosition = (schedule: string) => {
    try {
        const timePart = schedule.split(' ')[1];
        const [start, end] = timePart.split('-');
        const top = ((timeToMinutes(start) - scheduleStartTime) / 60) * slotHeight;
        const height = ((timeToMinutes(end) - timeToMinutes(start)) / 60) * slotHeight;
        return { top: `${top}rem`, height: `${height}rem` };
    } catch { return { top: 0, height: '3rem' }; }
};

// -------------------------------------------------------------------
// --- COMPONENTS (UPDATED IMAGE FALLBACK) ---
// -------------------------------------------------------------------

export function MasterScheduleView({ subjects, faculty, onAssignSubject }: RedesignedMasterScheduleProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showUnassignedOnly, setShowUnassignedOnly] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<ComponentSubject | null>(null);

  const filteredSubjects = useMemo(() => {
    return subjects.filter((subject: ComponentSubject) => {
      const searchMatch = searchTerm === '' ||
        subject.subject_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.des_title.toLowerCase().includes(searchTerm.toLowerCase());
      const assignmentMatch = !showUnassignedOnly || subject.assignedTo === null;
      return searchMatch && assignmentMatch;
    });
  }, [subjects, searchTerm, showUnassignedOnly]);

  const handleOpenDrawer = (subject: ComponentSubject) => {
    setSelectedSubject(subject);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedSubject(null);
  };

  const handleAssign = (facultyId: number) => {
    if (!selectedSubject) return;
    onAssignSubject(selectedSubject.id, facultyId);
    handleCloseDrawer();
  };

  return (
    <>
      <div className="bg-card border rounded-xl shadow-sm p-4 space-y-4">
        {/* Filter Bar */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search by code or title..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant={showUnassignedOnly ? 'secondary' : 'outline'}
            onClick={() => setShowUnassignedOnly(prev => !prev)}
          >
            Show Unassigned Only
          </Button>
        </div>

        {/* Schedule Grid */}
        <div className="relative grid grid-cols-5 min-w-[700px] gap-x-2 overflow-x-auto">
          {daysOfWeek.map(day => (
            <div key={day} className="relative border-l">
              <h3 className="text-center font-bold p-2 sticky top-0 bg-card/80 backdrop-blur-sm z-10">{day}</h3>
              <div className="h-[48rem] relative">
                {filteredSubjects.filter((s: ComponentSubject) => s.days.includes(day)).map((subject: ComponentSubject) => {
                  const facultyMember = subject.assignedTo ? faculty.find((f: FacultyWithAssignments) => f.id === subject.assignedTo) : null;
                  const position = getSubjectPosition(subject.schedule);
                  return (
                    <motion.div
                      key={subject.id}
                      layout
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className={`absolute w-[calc(100%-0.5rem)] ml-1 p-2 rounded-lg text-xs leading-tight shadow-sm transition-all cursor-pointer ${
                        facultyMember ? 'bg-primary/10 text-primary-foreground border border-primary/20 hover:bg-primary/20' : 'bg-muted/50 border border-dashed hover:bg-muted'
                      }`}
                      style={{ top: position.top, height: position.height }}
                      onClick={() => !facultyMember && handleOpenDrawer(subject)}
                    >
                      {/* Use subject_code and des_title */}
                      <p className="font-bold truncate">{subject.subject_code} - {subject.des_title}</p> 
                      {facultyMember ? (
                        <div className="flex items-center gap-1.5 mt-1">
                          {/* FIX: Use profile_picture with PLACEHOLDER_AVATAR fallback */}
                          <img src={facultyMember.profile_picture || PLACEHOLDER_AVATAR} className="w-4 h-4 rounded-full" alt={facultyMember.name} />
                          <span className="font-semibold">{facultyMember.name}</span>
                        </div>
                      ) : <span className="text-muted-foreground font-medium">Click to Assign</span>}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <AssignmentDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        subject={selectedSubject}
        facultyList={faculty}
        onAssign={handleAssign}
      />
    </>
  );
}

function AssignmentDrawer({ isOpen, onClose, subject, facultyList, onAssign }: AssignmentDrawerProps) {
  // Use ComponentSubject
  if (!subject) return null;

  const getFacultySuitability = (faculty: FacultyWithAssignments) => {
    // Use t_load_units and regular_limit/maxLoad
    const currentLoad = faculty.t_load_units;
    const maxLoad = faculty.regular_limit || faculty.maxLoad || 18; 
    const maxSubjects = faculty.maxSubjects || 5; 
    
    // Logic update: use subject.total_units
    const hasExpertise = faculty.expertise.includes(subject.expertise);
    const isAvailable = subject.days.every((day: string) => faculty.availability.days.includes(day));
    const isOverloaded = currentLoad + subject.total_units > maxLoad; 
    const isSubjectLimitReached = (faculty.assignedSubjects?.length || 0) >= maxSubjects;
    
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
    return [...facultyList].sort((a, b) => {
      const suitA = getFacultySuitability(a);
      const suitB = getFacultySuitability(b);
      // Sort logic
      if (suitA.canAssign && !suitB.canAssign) return -1;
      if (!suitA.canAssign && suitB.canAssign) return 1;
      if (suitA.isGoodMatch && !suitB.isGoodMatch) return -1;
      if (!suitA.isGoodMatch && suitB.isGoodMatch) return 1;
      return 0;
    });
  }, [facultyList, subject]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40" onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l z-50 flex flex-col"
          >
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Assign Subject</h2>
                {/* Use subject_code and des_title */}
                <p className="text-sm text-primary font-semibold">{subject.subject_code} - {subject.des_title}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}><X size={20} /></Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {sortedFaculty.map((faculty: FacultyWithAssignments) => {
                const { canAssign, reason, isGoodMatch } = getFacultySuitability(faculty);
                return (
                  <div key={faculty.id} className={`p-3 border rounded-lg flex items-center gap-4 ${!canAssign && 'opacity-50'}`}>
                    {/* FIX: Use profile_picture with PLACEHOLDER_AVATAR fallback */}
                    <img src={faculty.profile_picture || PLACEHOLDER_AVATAR} alt={faculty.name} className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <p className="font-bold">{faculty.name}</p>
                      <div className="text-xs text-muted-foreground">
                        {isGoodMatch && !reason && <span className="flex items-center gap-1 text-green-500"><Sparkles size={14}/> Good Match</span>}
                        {reason && <span className="flex items-center gap-1 text-amber-500"><AlertTriangle size={14}/> {reason}</span>}
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