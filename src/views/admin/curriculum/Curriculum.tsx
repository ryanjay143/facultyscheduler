import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Calendar, Archive, Activity } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import axios from '../../../plugin/axios';

import { ProgramCard } from './components/ProgramCard';
import { SkeletonProgramCard } from './components/SkeletonProgramCard';
import { CurriculumDetailModal } from './modals/CurriculumDetailModal';
import { ProgramFormModal } from './modals/ProgramFormModal';
import { SemesterFormModal } from './modals/SemesterFormModal';
import { SemesterRenameModal } from './modals/SemesterRenameModal';
import { SubjectFormModal } from './modals/SubjectFormModal';
import { SemesterStatusModal } from './modals/SemesterStatusModal';
import type { Subject, Program, Semester } from './types';

function Curriculum() {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [yearFilter, setYearFilter] = useState('All Years');
    const [statusFilter, setStatusFilter] = useState('Active');
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

    const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
    const [editingProgram, setEditingProgram] = useState<Program | null>(null);
    
    const [isSemesterModalOpen, setIsSemesterModalOpen] = useState(false);
    const [isSemesterRenameModalOpen, setIsSemesterRenameModalOpen] = useState(false);
    const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
    const [isSemesterStatusModalOpen, setIsSemesterStatusModalOpen] = useState(false);
    const [refreshSemestersKey, setRefreshSemestersKey] = useState(0);
    // When updating/adding/deleting a subject we can indicate which semester row changed
    // so the detail modal can merge only that semester instead of replacing all semesters.
    const [refreshSemesterName, setRefreshSemesterName] = useState<string | null>(null);

    const [editingSubjectInfo, setEditingSubjectInfo] = useState<{ semester: string; semesterId?: number; subject: Subject | null } | null>(null);
    
    const [editingSemester, setEditingSemester] = useState<{ name: string | null; semester: Semester | null }>({ name: null, semester: null });
    const [renamingSemester, setRenamingSemester] = useState<{ id: number | null; name: string | null }>({ id: null, name: null });

    const navigate = useNavigate();

    const fetchPrograms = useCallback(async () => {
        setIsLoading(true);
        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast.error("Authentication required.");
            setIsLoading(false);
            navigate('/facultyscheduler/user-login');
            return;
        }
        try {
            const response = await axios.get('/program', { headers: { 'Authorization': `Bearer ${token}` } });
            const programList: any[] = Array.isArray(response.data.programs) ? response.data.programs : Object.values(response.data.programs || {});
            
            const transformedPrograms: Program[] = programList.map((program: any) => ({
                id: program.id,
                name: program.program_name,
                abbreviation: program.abbreviation,
                effectiveYear: `${program.year_from}-${program.year_to}`,
                total_subjects: program.total_subjects || 0,
                total_units: program.total_units || 0,
                isActive: program.status === 0,
                semesters: program.semesters ? Object.entries(program.semesters).reduce((acc, [key, value]: [string, any]) => {
                    acc[key] = {
                        id: value.id,
                        subjects: (value.subjects || []).map((subject: any) => ({
                            id: subject.id, // Important for delete
                            code: subject.subject_code,
                            name: subject.des_title,
                            unitsTotal: subject.total_units,
                            unitsLec: subject.lec_units,
                            unitsLab: subject.lab_units,
                            hoursTotal: subject.total_hrs,
                            hoursLec: subject.total_lec_hrs,
                            hoursLab: subject.total_lab_hrs,
                            prerequisite: subject.pre_requisite || ''
                        })),
                        isActive: value.status === 0,
                        startDate: value.start_date,
                        endDate: value.end_date
                    };
                    return acc;
                }, {} as { [key: string]: Semester }) : {},
                subjects: program.subjects || {}
            }));
            setPrograms(transformedPrograms);
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                toast.error("Unauthorized. Please log in again.");
                navigate('/facultyscheduler/user-login');
            } else {
                toast.error("Failed to fetch programs.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchPrograms();
    }, [fetchPrograms]);

    const handleOpenSemesterStatus = (semesterName: string, semesterData: Semester) => {
        setEditingSemester({ name: semesterName, semester: semesterData });
        setIsSemesterStatusModalOpen(true);
    };

    const handleEditSemester = (semesterId: number, semesterName: string) => {
        setRenamingSemester({ id: semesterId, name: semesterName });
        setIsSemesterRenameModalOpen(true);
    };
    
    const handleSaveProgram = (_savedProgram: Program) => {
        fetchPrograms();
        setIsProgramModalOpen(false);
    };

    const handleAddProgram = () => {
        setEditingProgram(null);
        setIsProgramModalOpen(true);
    };
    
    const handleEditProgram = (program: Program) => {
        setEditingProgram(program);
        setIsProgramModalOpen(true);
    };

    // Confirmation dialog state for shadcn Dialog-based confirmations
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        title: string;
        description?: string;
        confirmText?: string;
        confirmVariant?: 'destructive' | 'default' | 'outline';
        onConfirm: (() => Promise<void>) | null;
    } | null>(null);
    const [confirmProcessing, setConfirmProcessing] = useState(false);

    const handleDeleteProgram = (programId: number) => {
        setConfirmDialog({
            open: true,
            title: 'Archive Program',
            description: 'This program will be moved to the archives.',
            confirmText: 'Yes, archive it!',
            onConfirm: async () => {
                const token = localStorage.getItem('accessToken');
                if (!token) { toast.error('Authentication required.'); return; }
                try {
                    const response = await axios.post(`/delete-program/${programId}`, {}, { headers: { 'Authorization': `Bearer ${token}` } });
                    toast.success(response.data.message || 'Program archived successfully.');
                    await fetchPrograms();
                } catch (error) {
                    toast.error('Failed to archive program.');
                }
            }
        });
    };

    const handleRestoreProgram = (programId: number) => {
        setConfirmDialog({
            open: true,
            title: 'Restore Program',
            description: 'This will make the program active again.',
            confirmText: 'Yes, restore it!',
            onConfirm: async () => {
                const token = localStorage.getItem('accessToken');
                if (!token) { toast.error('Authentication required.'); return; }
                try {
                    const response = await axios.post(`/restore-program/${programId}`, {}, { headers: { 'Authorization': `Bearer ${token}` } });
                    toast.success(response.data.message || 'Program restored successfully.');
                    await fetchPrograms();
                } catch (error) {
                    toast.error('Failed to restore program.');
                }
            }
        });
    };

    const handleAddSubject = (semester: string, semesterId?: number) => {
        setEditingSubjectInfo({ semester, semesterId, subject: null });
        setIsSubjectModalOpen(true);
    };

    const handleEditSubject = (semester: string, subject: Subject) => {
        // Try to resolve the semester DB id from the selectedProgram or programs list
    const program = selectedProgram; // selectedProgram should be set when editing from the detail modal
    const semesterFromProgram = program?.semesters?.[semester];
        const semesterId = semesterFromProgram?.id;
        setEditingSubjectInfo({ semester, semesterId, subject });
        setIsSubjectModalOpen(true);
    };
    
    const handleDeleteSubject = (semesterName: string, subjectId?: number) => {
        if (!subjectId) {
            toast.error('Could not find subject ID to delete.');
            return;
        }

        // open shadcn confirm dialog for subject delete
        setConfirmDialog({
    open: true,
    title: 'Delete Subject',
    description: `This will permanently delete this subject. You won't be able to revert this!`,
            confirmText: 'Yes, delete it!',
            confirmVariant: 'destructive',
    onConfirm: async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) { toast.error('Authentication required.'); return; }
                try {
                    await axios.delete(`/subjects/${subjectId}`, { headers: { 'Authorization': `Bearer ${token}` } });
                    toast.success('Subject deleted successfully!');
                    setRefreshSemesterName(semesterName);
                    setRefreshSemestersKey(k => k + 1);
                    // Refresh parent programs so ProgramCard totals update
                    await fetchPrograms();
                } catch (error) {
                    toast.error('Failed to delete subject.');
                    console.error('Delete subject error:', error);
                }
    }
});
    };

    // Save subject (create or update) via API
    const handleSubjectModalSave = async (semesterName: string, semesterIdParam: number | undefined, subjectData: Subject, isEditing: boolean) => {
        if (!selectedProgram) {
            toast.error('No program selected.');
            return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast.error('Authentication required.');
            return;
        }

        try {
            // For creating a subject we must resolve the semester DB id.
            // For editing, the subject id is sufficient so don't require semesterId here
            let semesterId = semesterIdParam;
            if (!isEditing) {
                // Determine semester id: prefer explicit param, fall back to parent program state
                const program = programs.find(p => p.id === selectedProgram.id);
                const semesterFromProgram = program?.semesters?.[semesterName];
                semesterId = semesterId ?? semesterFromProgram?.id;

                // If still not found, try to search all programs for a matching semesterName
                if (!semesterId) {
                    for (const p of programs) {
                        const sem = p.semesters?.[semesterName];
                        if (sem?.id) { semesterId = sem.id; break; }
                    }
                }

                if (!semesterId) {
                    toast.error('Semester ID not found. Please refresh and try again.');
                    return;
                }
            }

            if (isEditing) {
                if (!subjectData.id) {
                    toast.error('Subject ID missing for update.');
                    return;
                }
                // Prepare payload matching backend field names
                const payload = {
                    subject_code: subjectData.code,
                    des_title: subjectData.name,
                    total_units: subjectData.unitsTotal,
                    lec_units: subjectData.unitsLec,
                    lab_units: subjectData.unitsLab,
                    total_hrs: subjectData.hoursTotal,
                    total_lec_hrs: subjectData.hoursLec,
                    total_lab_hrs: subjectData.hoursLab,
                    pre_requisite: subjectData.prerequisite || null
                };

                await axios.put(`/subjects/${subjectData.id}`, payload, { headers: { 'Authorization': `Bearer ${token}` } });
                toast.success('Subject updated successfully.');
                setRefreshSemesterName(semesterName);
                setRefreshSemestersKey(k => k + 1);
                // Refresh parent programs so ProgramCard totals update
                await fetchPrograms();
            } else {
                // Create subject under semester
                const payload = {
                    subject_code: subjectData.code,
                    des_title: subjectData.name,
                    total_units: subjectData.unitsTotal,
                    lec_units: subjectData.unitsLec,
                    lab_units: subjectData.unitsLab,
                    total_hrs: subjectData.hoursTotal,
                    total_lec_hrs: subjectData.hoursLec,
                    total_lab_hrs: subjectData.hoursLab,
                    pre_requisite: subjectData.prerequisite || null
                };

                try {
                    await axios.post(`/semesters/${semesterId}/subjects`, payload, { headers: { 'Authorization': `Bearer ${token}` } });
                    toast.success('Subject added successfully.');
                    setRefreshSemesterName(semesterName);
                    setRefreshSemestersKey(k => k + 1);
                    // Refresh parent programs so ProgramCard totals update
                    await fetchPrograms();
                } catch (err: any) {
                    // If backend says semester not found (404), refresh programs and surface a clearer message
                    if (err?.response?.status === 404) {
                        toast.error('Semester not found on server. Refreshing programs.');
                        await fetchPrograms();
                    } else {
                        throw err;
                    }
                }
            }
        } catch (error) {
            console.error('Save subject error:', error);
            toast.error('Failed to save subject.');
        }
    };
    
    const effectiveYears = useMemo(() => {
        const years = new Set(programs.map(p => p.effectiveYear));
        return ['All Years', ...Array.from(years).sort((a, b) => b.localeCompare(a))];
    }, [programs]);

    const filteredPrograms = useMemo(() => {
        return programs
            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.abbreviation.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(p => yearFilter === 'All Years' || p.effectiveYear === yearFilter)
            .filter(p => {
                if (statusFilter === 'All') return true;
                return statusFilter === 'Active' ? p.isActive : !p.isActive;
            });
    }, [programs, searchTerm, yearFilter, statusFilter]);

    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Curriculum Management</h1>
                <p className="text-muted-foreground mt-2">Manage academic programs, semesters, and their subjects.</p>
            </header>
            <div className="bg-card p-4 md:p-6 rounded-lg shadow-sm border border-border mb-8">
                 <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                        <Input type="text" placeholder="Search program..." className="pl-10 w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                        <Select value={yearFilter} onValueChange={setYearFilter}>
                            <SelectTrigger className="w-full sm:w-auto md:w-[180px]">
                                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                <SelectValue placeholder="Filter by A.Y." />
                            </SelectTrigger>
                            <SelectContent>
                                {effectiveYears.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-auto md:w-[180px]">
                                <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                                <SelectValue placeholder="Filter by Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={handleAddProgram} className="w-full sm:w-auto">
                            <Plus size={16} className="mr-2" /> Add Program
                        </Button>
                    </div>
                </div>
            </div>
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (<SkeletonProgramCard key={i} />))}
                </div>
            ) : (
                <AnimatePresence>
                    {filteredPrograms.length > 0 ? (
                        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPrograms.map((program, i) => (
                                <ProgramCard 
                                    key={program.id} 
                                    program={program} 
                                    index={i} 
                                    onEdit={handleEditProgram} 
                                    onDelete={handleDeleteProgram}
                                    onRestore={handleRestoreProgram} 
                                    onManage={() => setSelectedProgram(program)} 
                                />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20 text-muted-foreground">
                            <Archive size={56} className="mx-auto mb-4" />
                            <h4 className="font-semibold text-xl text-foreground">No Programs Found</h4>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}

            <ProgramFormModal isOpen={isProgramModalOpen} onClose={() => setIsProgramModalOpen(false)} onSave={handleSaveProgram} initialData={editingProgram} />
            {/* Confirmation dialog (shadcn) used instead of SweetAlert2 */}
            {confirmDialog && (
                <Dialog open={confirmDialog.open} onOpenChange={(open) => { if (!open) setConfirmDialog(null); }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{confirmDialog.title}</DialogTitle>
                            {confirmDialog.description && <DialogDescription>{confirmDialog.description}</DialogDescription>}
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" disabled={confirmProcessing}>Cancel</Button>
                            </DialogClose>
                            <Button
                                onClick={async () => {
                                    if (!confirmDialog?.onConfirm) return;
                                    setConfirmProcessing(true);
                                    try {
                                        await confirmDialog.onConfirm();
                                    } finally {
                                        setConfirmProcessing(false);
                                        setConfirmDialog(null);
                                    }
                                }}
                                disabled={confirmProcessing}
                                variant={confirmDialog.confirmVariant as any}
                            >{confirmProcessing ? 'Processing...' : (confirmDialog.confirmText || 'Confirm')}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {selectedProgram && (
                <CurriculumDetailModal 
                    isOpen={!!selectedProgram} 
                    onClose={() => setSelectedProgram(null)} 
                    program={selectedProgram} 
                    onAddSemester={() => setIsSemesterModalOpen(true)}
                    onEditSemester={handleEditSemester}
                    onDeleteSemester={() => {}}
                    onAddSubject={handleAddSubject}
                    onEditSubject={handleEditSubject}
                    onDeleteSubject={handleDeleteSubject}
                    onSetSemesterStatus={handleOpenSemesterStatus}
                    refreshKey={refreshSemestersKey}
                    refreshSemesterName={refreshSemesterName}
                />
            )}

            <SemesterFormModal
                isOpen={isSemesterModalOpen}
                onClose={() => setIsSemesterModalOpen(false)}
                onSave={() => setRefreshSemestersKey(k => k + 1)}
                programId={selectedProgram ? selectedProgram.id : 0}
            />

            <SemesterRenameModal 
                isOpen={isSemesterRenameModalOpen} 
                onClose={() => setIsSemesterRenameModalOpen(false)} 
                onSaveSuccess={() => setRefreshSemestersKey(k => k + 1)}
                semesterId={renamingSemester.id}
                initialData={renamingSemester.name}
            />

            {editingSubjectInfo && (
                <SubjectFormModal 
                    isOpen={isSubjectModalOpen} 
                    onClose={() => setIsSubjectModalOpen(false)} 
                    onSave={(subjectData: Subject, isEditing: boolean) => handleSubjectModalSave(editingSubjectInfo.semester, editingSubjectInfo.semesterId, subjectData, isEditing)}
                    initialData={editingSubjectInfo.subject}
                    programId={selectedProgram?.id ?? 0}
                    semesterName={editingSubjectInfo.semester}
                    semesterId={editingSubjectInfo.semesterId}
                />
            )}

            <SemesterStatusModal 
                isOpen={isSemesterStatusModalOpen} 
                onClose={() => setIsSemesterStatusModalOpen(false)} 
                onSaveSuccess={() => setRefreshSemestersKey(k => k + 1)}
                semesterId={editingSemester?.semester?.id || null} 
                semesterName={editingSemester?.name || null} 
                initialData={editingSemester?.semester || null} 
            />
        </>
    );
}

export default Curriculum;