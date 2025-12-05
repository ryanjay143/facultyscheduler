// src/components/FacultyLoading/RedesignedFacultyView.tsx

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Search, X, Gauge, BookOpen, PlusCircle, Sparkles, AlertTriangle, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { FacultyWithAssignments, Subject } from './FacultyLoading';


// --- PROPS INTERFACES ---
interface RedesignedFacultyViewProps {
  faculty: FacultyWithAssignments[];
  subjects: Subject[];
  onUnassignSubject: (subjectId: string) => void;
  onAssignSubject: (subjectId: string, facultyId: string) => void;
}

interface FacultyDetailViewProps {
  faculty: FacultyWithAssignments;
  onUnassignSubject: (subjectId: string) => void;
  onOpenAssignModal: () => void;
}

interface AssignSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  faculty: FacultyWithAssignments;
  unassignedSubjects: Subject[];
  onAssign: (subjectId: string, facultyId: string) => void;
}


export function RedesignedFacultyView({ faculty, subjects, onUnassignSubject, onAssignSubject }: RedesignedFacultyViewProps) {
  const [selectedFacultyId, setSelectedFacultyId] = useState<string | null>(faculty[0]?.id || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const filteredFaculty = faculty.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const selectedFaculty = faculty.find(f => f.id === selectedFacultyId);

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
                <img src={fac.imageUrl} alt={fac.name} className="w-12 h-12 rounded-full" />
                <div>
                  <p className="font-bold">{fac.name}</p>
                  <p className="text-sm text-muted-foreground">Load: {fac.currentLoad}/{fac.maxLoad} units</p>
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
  const loadPercentage = (faculty.currentLoad / faculty.maxLoad) * 100;
  const subjectPercentage = (faculty.assignedSubjects.length / faculty.maxSubjects) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <img src={faculty.imageUrl} alt={faculty.name} className="w-24 h-24 rounded-full border-4 border-background shadow-md" />
        <div>
          <h2 className="text-2xl font-bold">{faculty.name}</h2>
          <div className="mt-2 flex flex-wrap gap-2">{faculty.expertise.map(exp => (<span key={exp} className="px-2.5 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">{exp}</span>))}</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border bg-background">
          <div className="flex justify-between items-center mb-1 font-semibold text-sm"><span className="flex items-center gap-1.5 text-muted-foreground"><Gauge size={14}/>Unit Load</span> <span>{faculty.currentLoad} / {faculty.maxLoad}</span></div>
          <div className="w-full h-2 bg-muted rounded-full"><motion.div className="h-2 rounded-full bg-primary" initial={{width:0}} animate={{width: `${loadPercentage}%`}}/></div>
        </div>
        <div className="p-4 rounded-lg border bg-background">
          <div className="flex justify-between items-center mb-1 font-semibold text-sm"><span className="flex items-center gap-1.5 text-muted-foreground"><BookOpen size={14}/>Subject Load</span> <span>{faculty.assignedSubjects.length} / {faculty.maxSubjects}</span></div>
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
              <div><p className="font-semibold">{subj.code} - {subj.title}</p><p className="text-sm text-muted-foreground">{subj.schedule} • {subj.units} units</p></div>
              <Button variant="ghost" size="icon" className="text-muted-foreground opacity-0 group-hover:opacity-100" onClick={() => onUnassignSubject(subj.id)}><X size={16}/></Button>
            </div>
          )) : <p className="text-center py-4 border rounded-md border-dashed text-muted-foreground">No subjects assigned.</p>}
        </div>
      </div>
    </div>
  );
}


function AssignSubjectModal({ isOpen, onClose, faculty, unassignedSubjects, onAssign }: AssignSubjectModalProps) {
  const getSubjectSuitability = (subject: Subject) => {
    const hasExpertise = faculty.expertise.includes(subject.expertise);
    const isAvailable = subject.days.every(day => faculty.availability.days.includes(day));
    const isOverloaded = faculty.currentLoad + subject.units > faculty.maxLoad;
    const isSubjectLimitReached = faculty.assignedSubjects.length >= faculty.maxSubjects;
    const canAssign = isAvailable && !isOverloaded && !isSubjectLimitReached;
    let reason = '';
    if (isOverloaded) reason = "Faculty is overloaded";
    else if (isSubjectLimitReached) reason = "Subject limit reached";
    else if (!isAvailable) reason = "Schedule conflict";
    return { canAssign, reason, hasExpertise };
  };
  
  const handleAssign = (subjectId: string) => {
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
                  <div key={subject.id} className={`p-3 border rounded-lg flex items-center gap-4 transition-opacity ${!canAssign && 'opacity-50'}`}>
                    <div className="flex-1">
                      <p className="font-bold">{subject.code} - {subject.title}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span className={`inline-flex items-center gap-1.5 font-semibold ${hasExpertise ? 'text-green-500' : 'text-amber-500'}`}>
                          {hasExpertise ? <Sparkles size={14}/> : <BrainCircuit size={14}/>}
                          {subject.expertise} {hasExpertise ? '' : '(Mismatch)'}
                        </span>
                        <span>{subject.schedule}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      {reason ? (
                        <span className="text-xs font-semibold text-destructive flex items-center gap-1"><AlertTriangle size={14}/> {reason}</span>
                      ) : (
                        <Button onClick={() => handleAssign(subject.id)} disabled={!canAssign}>Assign</Button>
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