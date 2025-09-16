// src/components/FacultyLoading/ContentMain.tsx

import { AnimatePresence, motion } from 'framer-motion';
import { Book, CheckCircle2, Users } from 'lucide-react';
import { SubjectCard } from './card/SubjectCard';
import { FacultyCard } from './card/FacultyCard';

// Type definition para sa props nga iyang dawaton
interface ContentMainProps {
    unassignedSubjects: any[];
    facultyWithAssignments: any[];
    handleOpenAssignModal: (subject: any) => void;
    handleUnassignSubject: (subjectId: string) => void;
}

// Dawaton niya ang props
export function ContentMain({ 
    unassignedSubjects, 
    facultyWithAssignments, 
    handleOpenAssignModal, 
    handleUnassignSubject 
}: ContentMainProps) {

  // --- FIX 1: I-define ang left ug right columns dinhi ---
  // Gibahin nato ang faculty array sa duha para sa duha ka columns.
  const leftColumnFaculty = facultyWithAssignments.filter((_, index) => index % 2 === 0);
  const rightColumnFaculty = facultyWithAssignments.filter((_, index) => index % 2 !== 0);

  return (
    // --- FIX 2: Gi-usab ang main layout para responsive ---
    // Magpatong sa mobile (grid-cols-1), pero magtapad na sa large screens (lg:grid-cols-3).
    // Ang "Unassigned Subjects" mokuha ug 1 ka column, ug ang "Faculty" mokuha ug 2.
    <div className="grid grid-cols-1 gap-8 items-start mt-8">
      
        {/* === Unassigned Subjects Column === */}
        {/* Mokuha ni ug 1 ka column sa large screen (lg:col-span-1) */}
        <div >
            <div className="flex items-center gap-3 mb-4 p-2">
                <Book className="text-violet-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-900">Unassigned Subjects ({unassignedSubjects.length})</h2>
            </div>
            <AnimatePresence>
                {unassignedSubjects.length > 0 ? (
                // Gi-ayo ang grid para mas responsive
                <div className="grid grid-cols-3 md:grid-cols-1 gap-4">
                    {unassignedSubjects.map(subj => (
                        <SubjectCard key={subj.id} subject={subj} onAssignClick={() => handleOpenAssignModal(subj)} />
                    ))}
                </div>
                ) : (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className='text-center py-10 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-200 shadow-sm'>
                    <CheckCircle2 size={48} className='mx-auto text-green-500' />
                    <p className='mt-3 font-semibold text-lg text-gray-700'>All Subjects Assigned!</p>
                    <p className='text-sm text-gray-500'>Excellent work, all classes are covered.</p>
                </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* === Faculty Members Section === */}
        {/* Mokuha ni ug 2 ka columns sa large screen (lg:col-span-2) */}
        <div >
          <div className="flex items-center gap-3 mb-6 p-2">
            <Users className="text-indigo-600" size={28} />
            <h2 className="text-2xl font-bold text-gray-900">Faculty Members</h2>
          </div>

          {/* Ang container para sa duha ka faculty columns */}
          <div className="grid grid-cols-2 md:flex-row gap-6">
            
            {/* Left Column para sa Faculty */}
            <div className="w-full md:w-1/2 flex flex-col gap-6">
              {leftColumnFaculty.map(fac => (
                <FacultyCard 
                  key={fac.id} 
                  faculty={fac} 
                  onUnassign={handleUnassignSubject} 
                />
              ))}
            </div>
            
            {/* Right Column para sa Faculty */}
            <div className="w-full md:w-1/2 flex flex-col gap-6">
              {rightColumnFaculty.map(fac => (
                <FacultyCard 
                  key={fac.id} 
                  faculty={fac} 
                  onUnassign={handleUnassignSubject} 
                />
              ))}
            </div>

          </div>
        </div>
    </div>
  )
}