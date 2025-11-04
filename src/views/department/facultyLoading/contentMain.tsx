// src/components/FacultyLoading/ContentMain.tsx

import { AnimatePresence, motion } from 'framer-motion';
import { Book, CheckCircle2, Users } from 'lucide-react';
import { SubjectCard } from './card/SubjectCard';
import { FacultyCard } from './card/FacultyCard';

interface ContentMainProps {
    unassignedSubjects: any[];
    facultyWithAssignments: any[];
    handleOpenAssignModal: (subject: any) => void;
    handleUnassignSubject: (subjectId: string) => void;
}

export function ContentMain({
    unassignedSubjects,
    facultyWithAssignments,
    handleOpenAssignModal,
    handleUnassignSubject
}: ContentMainProps) {

  const leftColumnFaculty = facultyWithAssignments.filter((_, index) => index % 2 === 0);
  const rightColumnFaculty = facultyWithAssignments.filter((_, index) => index % 2 !== 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-6">
        <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4 p-2">
                <Book className="text-violet-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-900">Unassigned ({unassignedSubjects.length})</h2>
            </div>
            <AnimatePresence>
                {unassignedSubjects.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
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

        <div className='lg:col-span-2'>
          <div className="flex items-center gap-3 mb-4 p-2">
            <Users className="text-indigo-600" size={28} />
            <h2 className="text-2xl font-bold text-gray-900">Faculty Members</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full flex flex-col gap-6">
              {leftColumnFaculty.map(fac => (
                <FacultyCard
                  key={fac.id}
                  faculty={fac}
                  onUnassign={handleUnassignSubject}
                />
              ))}
            </div>
            <div className="w-full flex flex-col gap-6">
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