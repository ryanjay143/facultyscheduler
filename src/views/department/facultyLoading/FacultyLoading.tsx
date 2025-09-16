// src/pages/FacultyLoading.tsx 

import { useState, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../layouts/Header';
import { Button } from '@/components/ui/button';

import ProgressBar from './ProgressBar'; 
import { ContentMain } from './contentMain';


// --- BAG-ONG DUMMY DATA ---

const initialSubjects = [
    // Original Subjects
    { id: 'subj-1', code: 'CS-301', title: 'Data Structures', schedule: 'MWF 9:00-10:00', days: ['Mon', 'Wed', 'Fri'], units: 3, expertise: 'Algorithms', assignedTo: null },
    { id: 'subj-2', code: 'IT-411', title: 'Advanced Programming', schedule: 'TTH 10:30-12:00', days: ['Tue', 'Thu'], units: 3, expertise: 'Programming', assignedTo: null },
    { id: 'subj-3', code: 'DS-210', title: 'Intro to Data Science', schedule: 'MWF 1:00-2:00', days: ['Mon', 'Wed', 'Fri'], units: 3, expertise: 'Data Science', assignedTo: null },
    { id: 'subj-4', code: 'CS-412', title: 'Machine Learning', schedule: 'TTH 2:30-4:00', days: ['Tue', 'Thu'], units: 3, expertise: 'Machine Learning', assignedTo: null },
    { id: 'subj-5', code: 'IT-205', title: 'Database Management', schedule: 'MWF 11:00-12:00', days: ['Mon', 'Wed', 'Fri'], units: 3, expertise: 'Database', assignedTo: 'fac-2' }, // ASSIGNED
    { id: 'subj-6', code: 'CS-101', title: 'Intro to Computing', schedule: 'TTH 8:30-10:00', days: ['Tue', 'Thu'], units: 3, expertise: 'Programming', assignedTo: null },
    { id: 'subj-7', code: 'SYS-300', title: 'Systems Architecture', schedule: 'MWF 10:00-11:00', days: ['Mon', 'Wed', 'Fri'], units: 3, expertise: 'Systems Architecture', assignedTo: null },
    
    // Gidugang nga mga Subjects
    { id: 'subj-8', code: 'SE-301', title: 'Software Engineering', schedule: 'TTH 1:00-2:30', days: ['Tue', 'Thu'], units: 3, expertise: 'Software Engineering', assignedTo: null },
    { id: 'subj-9', code: 'HCI-200', title: 'Human-Computer Interaction', schedule: 'MWF 3:00-4:00', days: ['Mon', 'Wed', 'Fri'], units: 3, expertise: 'HCI', assignedTo: null },
    { id: 'subj-10', code: 'NET-350', title: 'Computer Networks', schedule: 'TTH 11:00-12:30', days: ['Tue', 'Thu'], units: 3, expertise: 'Computer Networks', assignedTo: null },
    { id: 'subj-11', code: 'GAME-310', title: 'Game Development', schedule: 'MWF 1:00-2:00', days: ['Mon', 'Wed', 'Fri'], units: 3, expertise: 'Game Development', assignedTo: null },
    { id: 'subj-12', code: 'SEC-450', title: 'Cyber Security', schedule: 'TTH 4:00-5:30', days: ['Tue', 'Thu'], units: 3, expertise: 'Cyber Security', assignedTo: 'fac-4' }, // ASSIGNED
    { id: 'subj-13', code: 'CGV-410', title: 'Computer Graphics & Vision', schedule: 'MWF 11:00-12:00', days: ['Mon', 'Wed', 'Fri'], units: 3, expertise: 'Computer Graphics & Vision', assignedTo: null },
    { id: 'subj-14', code: 'SDEV-400', title: 'Mobile Software Development', schedule: 'TTH 8:30-10:00', days: ['Tue', 'Thu'], units: 3, expertise: 'Software Development', assignedTo: null }
];

const initialFaculty = [
    // Original Faculty
    { id: 'fac-1', name: 'Dr. Maria Santos', maxLoad: 12, maxSubjects: 4, expertise: ['Machine Learning', 'Data Science'], availability: { days: ['Tue', 'Thu'], note: 'Prefers TTH' }, imageUrl: 'https://i.pravatar.cc/150?u=maria.santos' },
    { id: 'fac-2', name: 'Prof. Albie Cruz', maxLoad: 15, maxSubjects: 4, expertise: ['Programming', 'Database', 'Algorithms'], availability: { days: ['Mon', 'Wed', 'Fri'], note: 'Prefers MWF AM' }, imageUrl: 'https://i.pravatar.cc/150?u=albie.cruz' },
    { id: 'fac-3', name: 'Prof. John Reyes', maxLoad: 12, maxSubjects: 4, expertise: ['Algorithms', 'Systems Architecture'], availability: { days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], note: 'Anytime' }, imageUrl: 'https://i.pravatar.cc/150?u=john.reyes' },
    
    // Gidugang nga mga Faculty
    { id: 'fac-4', name: 'Prof. Angela David', maxLoad: 12, maxSubjects: 4, expertise: ['Computer Networks', 'Cyber Security'], availability: { days: ['Tue', 'Thu'], note: 'Prefers TTH PM' }, imageUrl: 'https://i.pravatar.cc/150?u=angela.david' },
    { id: 'fac-5', name: 'Dr. Ben Castro', maxLoad: 15, maxSubjects: 4, expertise: ['Software Engineering', 'Software Development', 'Programming'], availability: { days: ['Mon', 'Wed', 'Fri'], note: 'Anytime' }, imageUrl: 'https://i.pravatar.cc/150?u=ben.castro' },
    { id: 'fac-6', name: 'Prof. Carla Espino', maxLoad: 12, maxSubjects: 4, expertise: ['HCI', 'Computer Graphics & Vision'], availability: { days: ['Mon', 'Wed', 'Fri'], note: 'Prefers MWF AM' }, imageUrl: 'https://i.pravatar.cc/150?u=carla.espino' },
    { id: 'fac-7', name: 'Dr. David Garcia', maxLoad: 12, maxSubjects: 4, expertise: ['Game Development', 'Programming', 'Computer Graphics & Vision'], availability: { days: ['Tue', 'Thu'], note: 'Anytime' }, imageUrl: 'https://i.pravatar.cc/150?u=david.garcia' },
];


// --- UTILITY FUNCTION ---
const isAvailable = (subjectDays: string[], facultyDays: string[]) => {
    if (!subjectDays || !facultyDays) return true;
    return subjectDays.every(day => facultyDays.includes(day));
};

// --- MAIN COMPONENT ---
function FacultyLoading() {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [faculty, _setFaculty] = useState(initialFaculty);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<any | null>(null);
  
  const unassignedSubjects = subjects.filter(s => s.assignedTo === null);
  const totalUnits = useMemo(() => subjects.reduce((sum, s) => sum + s.units, 0), [subjects]);
  const assignedUnits = useMemo(() => subjects.filter(s => s.assignedTo !== null).reduce((sum, s) => sum + s.units, 0), [subjects]);
  const assignmentProgress = totalUnits > 0 ? (assignedUnits / totalUnits) * 100 : 0;

  const handleOpenAssignModal = (subject: any) => {
    setSelectedSubject(subject);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSubject(null);
  };

  const handleAssignSubject = (facultyId: string) => {
    if (!selectedSubject) return;
    setSubjects(prev =>
      prev.map(s => (s.id === selectedSubject.id ? { ...s, assignedTo: facultyId } : s))
    );
    handleCloseModal();
  };

  const handleUnassignSubject = (subjectId: string) => {
    setSubjects(prev =>
        prev.map(s => (s.id === subjectId ? { ...s, assignedTo: null } : s))
    );
  };

  const facultyWithAssignments = useMemo(() => {
    return faculty.map(fac => {
      const assigned = subjects.filter(s => s.assignedTo === fac.id);
      const currentLoad = assigned.reduce((sum, s) => sum + s.units, 0);
      return { ...fac, assignedSubjects: assigned, currentLoad };
    });
  }, [subjects, faculty]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8 flex-grow">
        <div className="max-w-screen-2xl mx-auto">
          {/* Page Header */}
          <div className='mb-6'>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Faculty Loading Dashboard</h1>
            <p className="text-gray-600 mt-1">Efficiently assign subjects and manage faculty workloads.</p>
          </div>
          
          <ProgressBar assignmentProgress={assignmentProgress}/>
          
          <ContentMain 
            unassignedSubjects={unassignedSubjects}
            facultyWithAssignments={facultyWithAssignments}
            handleOpenAssignModal={handleOpenAssignModal}
            handleUnassignSubject={handleUnassignSubject}
          />
        </div>
      </main>

      <AnimatePresence>
        {isModalOpen && selectedSubject && (
          <AssignmentModal
            onClose={handleCloseModal}
            subject={selectedSubject}
            facultyList={facultyWithAssignments}
            onAssign={handleAssignSubject}
          />
        )}
      </AnimatePresence>
    </div>
  );
}


// --- AssignmentModal ---
function AssignmentModal({ onClose, subject, facultyList, onAssign }: { onClose: () => void; subject: any; facultyList: any[]; onAssign: (facultyId: string) => void; }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: -20 }}
                className="bg-white border border-gray-200 rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-5 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Assign Subject to Faculty</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Select a faculty for <span className="font-semibold text-indigo-600">{subject.code} - {subject.title}</span> ({subject.units} units)
                    </p>
                </div>
                <div className="p-3 md:p-5 overflow-y-auto space-y-3">
                    {facultyList.map(faculty => {
                        const hasExpertise = faculty.expertise.includes(subject.expertise);
                        const isTimeAvailable = isAvailable(subject.days, faculty.availability.days);
                        const isGoodMatch = hasExpertise && isTimeAvailable;

                        const isOverloaded = faculty.currentLoad + subject.units > faculty.maxLoad;
                        const isSubjectLimitReached = faculty.assignedSubjects.length >= faculty.maxSubjects;
                        
                        const isDisabled = isOverloaded || isSubjectLimitReached || !isTimeAvailable;
                        let buttonText = "Assign";
                        if (isOverloaded) {
                            buttonText = "Overloaded";
                        } else if (isSubjectLimitReached) {
                            buttonText = "Limit Reached";
                        } else if (!isTimeAvailable) {
                            buttonText = "Conflict";
                        }
                        
                        const rowStyle = isGoodMatch 
                            ? 'bg-green-50 border-green-200' 
                            : !isTimeAvailable 
                                ? 'bg-amber-50 border-amber-200'
                                : 'bg-white';

                        return (
                            <div
                                key={faculty.id}
                                className={`p-4 border rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${rowStyle}`}
                            >
                                <div className="flex items-center gap-4">
                                    <img src={faculty.imageUrl} alt={faculty.name} className="w-12 h-12 rounded-full"/>
                                    <div>
                                        <p className="font-bold text-gray-800">{faculty.name}</p>
                                        <p className="text-sm text-gray-500">Units: {faculty.currentLoad}/{faculty.maxLoad} | Subjects: {faculty.assignedSubjects.length}/{faculty.maxSubjects}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 sm:gap-4 self-end sm:self-center">
                                    <div className='flex flex-col items-end text-xs'>
                                        {isGoodMatch ? (
                                            <span className="flex items-center gap-1 font-semibold text-green-700">
                                                <Sparkles size={14} /> Good Match
                                            </span>
                                        ) : <>
                                            {!hasExpertise && <span className='text-yellow-700'>Mismatched Expertise</span>}
                                            {!isTimeAvailable && <span className='text-amber-700 font-semibold'>Schedule Conflict</span>}
                                        </>}
                                    </div>
                                    <Button
                                        onClick={() => onAssign(faculty.id)}
                                        disabled={isDisabled}
                                        className="px-4 py-2 w-32 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {buttonText}
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="p-4 border-t border-gray-200 flex justify-end">
                    <Button onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default FacultyLoading;