import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Info, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Swal from 'sweetalert2';

import { allFaculty, allSubjects } from './data/dummyData';
import type { FacultyType, Subject } from './type';
import { SubjectCard } from './components/SubjectCard';
import { AssignmentDialog } from './components/AssignmentDialog';
import { toast } from 'sonner';

function MainFacultyLoading() {
    const [faculty] = useState<FacultyType[]>(allFaculty);
    const [subjects, setSubjects] = useState<Subject[]>(allSubjects);
    const [subjectQuery, setSubjectQuery] = useState('');
    const [subjectFilter, setSubjectFilter] = useState<'ALL' | 'UNASSIGNED' | 'ASSIGNED'>('ALL');
    const [activeSubject, setActiveSubject] = useState<Subject | null>(null);

    // --- LOGIC FUNCTIONS (nananatili sa parent) ---
    const hasConflict = (facultyName: string, day: string, start: string, end: string) => {
      const facultySubjects = subjects.filter((s) => s.assigned?.faculty === facultyName);
      for (const sub of facultySubjects) {
        const assigned = sub.assigned?.time || '';
        const parts = assigned.split(';').map(s => s.trim()).filter(Boolean);
        for (const part of parts) {
          const [pDay, range] = part.split(' ');
          if (pDay !== day) continue;
          const [assignedStartTime, assignedEndTime] = (range || '').split('-');
          if (!assignedStartTime || !assignedEndTime) continue;
          if (start < assignedEndTime && assignedStartTime < end) {
            return { code: sub.code, name: sub.name, day: pDay, start: assignedStartTime, end: assignedEndTime };
          }
        }
      }
      return null;
    };

    const onAssign = (payload: { subjectId: number; facultyName: string; day: string; startTime: string; endTime: string }) => {
      const { subjectId, facultyName, day, startTime, endTime } = payload;
      const fac = faculty.find((f) => f.name === facultyName);
      if (!fac) return;

      const assignedCount = subjects.filter((s) => s.assigned?.faculty === fac.name).length;
      if (assignedCount >= fac.maxSubjects) {
        Swal.fire({ icon: 'warning', title: 'Maximum Load Reached', text: `${fac.name} has reached the max load.` });
        return;
      }

      const conflict = hasConflict(fac.name, day, startTime, endTime);
      if (conflict) {
        Swal.fire({ icon: 'error', title: 'Schedule Conflict', html: `Conflicts with <b>${conflict.code}</b> on ${conflict.day} from ${conflict.start} to ${conflict.end}.` });
        return;
      }

      setSubjects((prev) =>
        prev.map((s) => {
          if (s.id !== subjectId) return s;
          const newEntry = `${day} ${startTime}-${endTime}`;
          if (!s.assigned || s.assigned.faculty !== fac.name) {
            return { ...s, assigned: { faculty: fac.name, time: newEntry } };
          }
          const parts = s.assigned.time.split(';').map(p => p.trim()).filter(Boolean);
          const hasSame = parts.some(p => p === newEntry);
          const updated = hasSame ? parts : [...parts, newEntry];
          return { ...s, assigned: { faculty: fac.name, time: updated.join('; ') } };
        })
      );
      Swal.fire({ icon: 'success', title: 'Assigned!', timer: 900, showConfirmButton: false });
    };

    const onUnassign = (subjectId: number) => {
      setSubjects((prev) => prev.map((s) => (s.id === subjectId ? { ...s, assigned: null } : s)));
      toast.success("Subject has been unassigned.");
    };

    const filteredSubjects = useMemo(() => {
        let list = subjects;
        if (subjectFilter === 'UNASSIGNED') list = list.filter((s) => !s.assigned);
        if (subjectFilter === 'ASSIGNED') list = list.filter((s) => !!s.assigned);
        if (subjectQuery.trim()) {
            const q = subjectQuery.toLowerCase();
            list = list.filter(s => s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.expertise.toLowerCase().includes(q));
        }
        return list;
    }, [subjects, subjectFilter, subjectQuery]);
    
    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Faculty Loading</h1>
                <p className="text-muted-foreground mt-2">Assign subjects to faculty based on expertise and availability.</p>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-card p-4 md:p-6 rounded-lg shadow-sm border border-border"
            >
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                        <Input placeholder="Search subject code, name, or expertise..." value={subjectQuery} onChange={(e) => setSubjectQuery(e.target.value)} className="pl-10"/>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        {(['ALL', 'UNASSIGNED', 'ASSIGNED'] as const).map((f) => (
                            <Button
                                key={f}
                                variant={subjectFilter === f ? 'default' : 'outline'}
                                onClick={() => setSubjectFilter(f)}
                                className="flex-1 md:flex-none"
                            >
                                {f === 'ALL' ? 'All' : f === 'UNASSIGNED' ? 'Unassigned' : 'Assigned'}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 -mr-3">
                    {filteredSubjects.map((s, i) => (
                        <SubjectCard
                            key={s.id}
                            subject={s}
                            index={i}
                            onAssignClick={() => setActiveSubject(s)}
                            onUnassignClick={() => onUnassign(s.id)}
                        />
                    ))}
                    {!filteredSubjects.length && (
                        <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground rounded-lg border-2 border-dashed">
                            <Info size={32} className="mb-2" />
                            <p>No subjects found with the current filters.</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {activeSubject && (
                <AssignmentDialog
                    isOpen={!!activeSubject}
                    onClose={() => setActiveSubject(null)}
                    subject={activeSubject}
                    faculty={faculty}
                    subjects={subjects}
                    onAssign={onAssign}
                    onUnassign={onUnassign}
                />
            )}
        </>
    );
}

export default MainFacultyLoading;