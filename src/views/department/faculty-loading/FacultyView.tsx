// src/components/FacultyLoading/RedesignedFacultyView.tsx

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Search, X, Gauge, BookOpen, PlusCircle, Sparkles, AlertTriangle, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// -------------------------------------------------------------------
// --- IMPORTED/PROVIDED DATA INTERFACES (From user's data) ---
// -------------------------------------------------------------------

// Note: These interfaces are assumed to be imported or defined in the scope.
// Since you provided them, I'll define them here, ensuring compatibility.

export interface Semester {
  id: number;
  program_id: number;
  year_level: string;
  semester_level: string;
  status: number;
  start_date: string;
  end_date: string;
}

export interface SubjectApiData { // Renamed to distinguish from component's Subject type
  id: number;
  semester_id: number;
  subject_code: string;
  des_title: string;
  total_units: number;
  lec_units: number;
  lab_units: number;
  total_hrs: number;
  total_lec_hrs: number;
  total_lab_hrs: number;
  pre_requisite: string;
  semester: Semester;
  units: number; 
}

// Helper types for Faculty Assigned Subjects (used in Dialogs)
export interface Schedule {
    day: string;
    time: string; // e.g., "MWF 08:30-09:30"
}

export interface AssignedSubject {
    id: number;
    subject_code: string;
    des_title: string;
    schedule: Schedule; // Simplified schedule structure
    total_units: number; // Use total_units from SubjectApiData
}

export interface Faculty {
    id: number;
    name: string;
    department: string;
    profile_picture: string | null; 
    expertise: string[];
    
    t_load_units: number;  
    deload_units: number;  
    overload_units: number;
    
    // Limits
    regular_limit?: number; // Should be the source of maxLoad
    deload_limit?: number;
    overload_limit?: number;
    
    // Component Specific Fields (Retained for UI Logic)
    assignedSubjects?: AssignedSubject[]; 
    availability?: any; 
}

export interface ClassSchedule {
    id: number;
    faculty_id: number;
    subject_id: number;
    room_id: number;
    type: 'LEC' | 'LAB';
    day: string;
    start_time: string; 
    end_time: string;  
    subject: {
        id: number;
        subject_code: string;
        des_title: string;
    };
    room: {
        id: number;
        roomNumber: string; 
    };
}


// --- INTERFACE EXTENSIONS FOR COMPONENT LOGIC (FIX) ---

// Define the subject format required by the component's internal logic
export interface ComponentSubject extends SubjectApiData {
    // These fields are required by the AssignSubjectModal and FacultyDetailView
    assignedTo: number | null; // faculty_id or null
    expertise: string; // The specific expertise related to this subject (for Mismatch logic)
    days: string[]; // e.g., ['Mon', 'Wed', 'Fri'] for conflict check
    schedule: string; // Formatted schedule string for display
}


// Define the extended faculty type required by the component's props
interface FacultyWithAssignments extends Faculty {
    imageUrl: string; // The component uses 'imageUrl' but the data uses 'profile_picture'
    currentLoad: number; // Sum of units from assignedSubjects
    maxLoad: number; // The regular limit for the progress bar
    maxSubjects: number; // A hardcoded max subject limit (or derived)
    assignedSubjects: AssignedSubject[];
    availability: { // Simplified availability check for conflict
        days: string[]; // e.g., ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
        timeSlots: string[]; // e.g., ['08:00-12:00', '13:00-17:00']
    };
}


// --- PROPS INTERFACES ---
interface RedesignedFacultyViewProps {
  faculty: FacultyWithAssignments[];
  subjects: ComponentSubject[]; // Use the extended subject type
  onUnassignSubject: (subjectId: number) => void; // IDs are numbers in the new data
  onAssignSubject: (subjectId: number, facultyId: number) => void; // IDs are numbers
}

interface FacultyDetailViewProps {
  faculty: FacultyWithAssignments;
  onUnassignSubject: (subjectId: number) => void;
  onOpenAssignModal: () => void;
}

interface AssignSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  faculty: FacultyWithAssignments;
  unassignedSubjects: ComponentSubject[];
  onAssign: (subjectId: number, facultyId: number) => void;
}


// -------------------------------------------------------------------
// --- COMPONENTS (REFLECTING NEW DATA STRUCTURE) ---
// -------------------------------------------------------------------


export function RedesignedFacultyView({ faculty, subjects, onUnassignSubject, onAssignSubject }: RedesignedFacultyViewProps) {
  // Change state types to number
  const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(faculty[0]?.id || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const filteredFaculty = faculty.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const selectedFaculty = faculty.find(f => f.id === selectedFacultyId);

  // Filter subjects based on the new 'assignedTo' property
  const unassignedSubjects = useMemo(() => subjects.filter(s => s.assignedTo === null), [subjects]);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[75vh]">
        {/* Left Column: Faculty List */}
        <div className="lg:col-span-1 bg-card border rounded-xl shadow-sm flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input placeholder="Search faculty..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredFaculty.map(fac => (
              <button
                key={fac.id}
                className={`flex items-center gap-4 w-full text-left p-4 border-b transition-colors ${selectedFacultyId === fac.id ? 'bg-primary/10' : 'hover:bg-muted/50'}`}
                onClick={() => setSelectedFacultyId(fac.id)}
              >
                {/* Use profile_picture or a fallback */}
                <img src={fac.profile_picture || fac.imageUrl} alt={fac.name} className="w-12 h-12 rounded-full" />
                <div>
                  <p className="font-bold">{fac.name}</p>
                  {/* Use t_load_units and regular_limit (fallback to currentLoad/maxLoad if regular_limit is undefined) */}
                  <p className="text-sm text-muted-foreground">Load: {fac.t_load_units} / {fac.regular_limit || fac.maxLoad} units</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Faculty Detail */}
        <div className="lg:col-span-2 bg-card border rounded-xl shadow-sm h-full overflow-y-auto p-6">
          {selectedFaculty ? (
            <FacultyDetailView
              faculty={selectedFaculty}
              onUnassignSubject={onUnassignSubject}
              onOpenAssignModal={() => setIsAssignModalOpen(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <User size={48} />
              <p className="mt-4 text-lg font-semibold">Select a faculty to see details</p>
            </div>
          )}
        </div>
      </div>

      {/* Render the assignment modal */}
      {selectedFaculty && (
        <AssignSubjectModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          faculty={selectedFaculty}
          unassignedSubjects={unassignedSubjects}
          onAssign={onAssignSubject}
        />
      )}
    </>
  );
}


function FacultyDetailView({ faculty, onUnassignSubject, onOpenAssignModal }: FacultyDetailViewProps) {
  // Use t_load_units and regular_limit/maxLoad
  const currentLoad = faculty.t_load_units;
  const maxLoad = faculty.regular_limit || faculty.maxLoad || 18; // Default to 18 if limit is missing
  const maxSubjects = faculty.maxSubjects || 5; // Default to 5 if limit is missing
  
  const loadPercentage = (currentLoad / maxLoad) * 100;
  const subjectPercentage = (faculty.assignedSubjects.length / maxSubjects) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {/* Use profile_picture or a fallback */}
        <img src={faculty.profile_picture || faculty.imageUrl} alt={faculty.name} className="w-24 h-24 rounded-full border-4 border-background shadow-md" />
        <div>
          <h2 className="text-2xl font-bold">{faculty.name}</h2>
          <div className="mt-2 flex flex-wrap gap-2">{faculty.expertise.map(exp => (<span key={exp} className="px-2.5 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">{exp}</span>))}</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border bg-background">
          <div className="flex justify-between items-center mb-1 font-semibold text-sm"><span className="flex items-center gap-1.5 text-muted-foreground"><Gauge size={14}/>Unit Load</span> <span>{currentLoad} / {maxLoad}</span></div>
          <div className="w-full h-2 bg-muted rounded-full"><motion.div className="h-2 rounded-full bg-primary" initial={{width:0}} animate={{width: `${loadPercentage}%`}}/></div>
        </div>
        <div className="p-4 rounded-lg border bg-background">
          <div className="flex justify-between items-center mb-1 font-semibold text-sm"><span className="flex items-center gap-1.5 text-muted-foreground"><BookOpen size={14}/>Subject Load</span> <span>{faculty.assignedSubjects.length} / {maxSubjects}</span></div>
          <div className="w-full h-2 bg-muted rounded-full"><motion.div className="h-2 rounded-full bg-violet-500" initial={{width:0}} animate={{width: `${subjectPercentage}%`}}/></div>
        </div>
      </div>

      {/* Assigned Subjects List */}
      <div>
        <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold">Assigned Subjects</h3>
            <Button size="sm" onClick={onOpenAssignModal}><PlusCircle size={16} className="mr-2"/>Assign New Subject</Button>
        </div>
        <div className="space-y-2">
          {faculty.assignedSubjects.length > 0 ? faculty.assignedSubjects.map(subj => (
            <div key={subj.id} className="group flex items-center justify-between p-3 rounded-md border bg-background">
              {/* Use subject_code and des_title */}
              <div><p className="font-semibold">{subj.subject_code} - {subj.des_title}</p><p className="text-sm text-muted-foreground">{subj.schedule.day} {subj.schedule.time} • {subj.total_units || 'N/A'} units</p></div>
              <Button variant="ghost" size="icon" className="text-muted-foreground opacity-0 group-hover:opacity-100" onClick={() => onUnassignSubject(subj.id)}><X size={16}/></Button>
            </div>
          )) : <p className="text-center py-4 border rounded-md border-dashed text-muted-foreground">No subjects assigned.</p>}
        </div>
      </div>
    </div>
  );
}


function AssignSubjectModal({ isOpen, onClose, faculty, unassignedSubjects, onAssign }: AssignSubjectModalProps) {
  
  const currentLoad = faculty.t_load_units;
  const maxLoad = faculty.regular_limit || faculty.maxLoad || 18; 
  const maxSubjects = faculty.maxSubjects || 5; 
  
  const getSubjectSuitability = (subject: ComponentSubject) => {
    // Assuming simple checks based on the component's existing logic
    
    // Day/Time Conflict Check (Simplistic based on component's existing logic)
    // NOTE: A real-world check would be complex, comparing faculty's assigned class schedules (day + time range)
    // Here, we just check if the subject's day/time is within faculty availability days/time.
    const facultyDays = faculty.availability?.days?.join(',') || '';
    const subjectDaysConflict = subject.days.some(day => !facultyDays.includes(day));

    const hasExpertise = faculty.expertise.includes(subject.expertise);
    const isAvailable = !subjectDaysConflict; // Simplistic availability check
    const isOverloaded = currentLoad + subject.units > maxLoad; // Use subject.units (total_units)
    const isSubjectLimitReached = faculty.assignedSubjects.length >= maxSubjects;
    
    const canAssign = isAvailable && !isOverloaded && !isSubjectLimitReached;
    
    let reason = '';
    if (isOverloaded) reason = "Unit load max reached";
    else if (isSubjectLimitReached) reason = "Subject count max reached";
    else if (!isAvailable) reason = "Schedule conflict";

    return { canAssign, reason, hasExpertise };
  };
  
  const handleAssign = (subjectId: number) => {
    onAssign(subjectId, faculty.id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            className="bg-card rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold">Assign Subject to {faculty.name}</h2>
              <p className="text-sm text-muted-foreground">Showing available unassigned subjects.</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {unassignedSubjects.map(subject => {
                const { canAssign, reason, hasExpertise } = getSubjectSuitability(subject);
                return (
                  <div key={subject.id} className={`p-3 border rounded-lg flex items-center gap-4 transition-opacity ${!canAssign ? 'opacity-50' : 'hover:bg-muted/50'}`}>
                    <div className="flex-1">
                      {/* Use subject_code and des_title */}
                      <p className="font-bold">{subject.subject_code} - {subject.des_title}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span className={`inline-flex items-center gap-1.5 font-semibold ${hasExpertise ? 'text-green-500' : 'text-amber-500'}`}>
                          {hasExpertise ? <Sparkles size={14}/> : <BrainCircuit size={14}/>}
                          {subject.expertise} {hasExpertise ? '' : '(Mismatch)'}
                        </span>
                        {/* Use the combined schedule string from the extended subject type */}
                        <span>{subject.schedule}</span> 
                      </div>
                    </div>
                    <div className="text-right">
                      {canAssign ? (
                        <Button onClick={() => handleAssign(subject.id)} disabled={!canAssign}>Assign</Button>
                      ) : (
                        <span className="text-xs font-semibold text-destructive flex items-center gap-1"><AlertTriangle size={14}/> {reason}</span>
                      )}
                    </div>
                  </div>
                );
              })}
              {unassignedSubjects.length === 0 && (
                <p className="text-center py-8 text-muted-foreground">No unassigned subjects available.</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
