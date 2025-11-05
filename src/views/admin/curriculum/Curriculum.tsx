import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Calendar, Archive } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import axios from '../../../plugin/axios';

// Import sa mga components
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
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

    const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
    const [editingProgram, setEditingProgram] = useState<Program | null>(null);
    
    const [isSemesterModalOpen, setIsSemesterModalOpen] = useState(false);
    const [refreshSemestersKey, setRefreshSemestersKey] = useState(0);
    const [isSemesterRenameModalOpen, setIsSemesterRenameModalOpen] = useState(false);
    const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
    const [isSemesterStatusModalOpen, setIsSemesterStatusModalOpen] = useState(false);

    const [editingSemesterName, setEditingSemesterName] = useState<string | null>(null);
    const [editingSubjectInfo, setEditingSubjectInfo] = useState<{ semester: string; subject: Subject | null } | null>(null);
    const [editingSemester, setEditingSemester] = useState<{ name: string; semester: Semester } | null>(null);

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
                semesters: program.semesters ? Object.entries(program.semesters).reduce((acc, [key, value]: [string, any]) => {
                    acc[key] = {
                        subjects: (value.subjects || []).map((subject: any) => ({
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
                        isActive: value.isActive ?? true,
                        startDate: value.startDate,
                        endDate: value.endDate
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

    const handleSaveProgram = (savedProgram: Program) => {
        const isEditing = !!editingProgram;
        if (isEditing) {
            setPrograms(prev => prev.map(p => (p.id === savedProgram.id ? savedProgram : p)));
        } else {
            setPrograms(prev => [savedProgram, ...prev]);
        }
        setIsProgramModalOpen(false);
    };

    const handleAddProgram = () => { setEditingProgram(null); setIsProgramModalOpen(true); };
    const handleEditProgram = (program: Program) => { setEditingProgram(program); setIsProgramModalOpen(true); };

    const handleDeleteProgram = (programId: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This program will be moved to the archives.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, archive it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    toast.error("Authentication required.");
                    return;
                }
                try {
                    const response = await axios.post(`/delete-program/${programId}`, {}, { headers: { 'Authorization': `Bearer ${token}` } });
                    toast.success(response.data.message || "Program archived successfully.");
                    setPrograms(prev => prev.filter(p => p.id !== programId));
                } catch (error) {
                    toast.error("Failed to archive program.");
                    console.error("Error deleting program:", error);
                }
            }
        });
    };
    
    const handleSaveSemester = async (_semesterName: string, _subjects: Subject[], created?: boolean) => {
        if (!selectedProgram) return;
        if (created) {
            await fetchPrograms();
            setRefreshSemestersKey(k => k + 1);
        }
        setIsSemesterModalOpen(false);
    };
    
    const handleSaveSubject = (semesterName: string, subjectData: Subject, isEditing: boolean) => {
        if (!selectedProgram) return;
    
        const updatedProgram = { ...selectedProgram, semesters: { ...selectedProgram.semesters } };
        const semesterToUpdate = { ...(updatedProgram.semesters[semesterName] || { subjects: [], isActive: true }) };
    
        if (isEditing) {
            semesterToUpdate.subjects = semesterToUpdate.subjects.map(s => s.code === subjectData.code ? subjectData : s);
        } else {
            semesterToUpdate.subjects = [...semesterToUpdate.subjects, subjectData];
        }
    
        updatedProgram.semesters[semesterName] = semesterToUpdate;
    
        setPrograms(programs.map(p => p.id === updatedProgram.id ? updatedProgram : p));
        setSelectedProgram(updatedProgram);
        setIsSubjectModalOpen(false);
        toast.success(`Subject successfully ${isEditing ? 'updated' : 'added'}!`);
    };

    const handleOpenSemesterStatus = (program: Program, semesterName: string) => {
        const semesterData = program.semesters[semesterName];
        if (semesterData) {
            setEditingSemester({ name: semesterName, semester: semesterData });
            setSelectedProgram(program);
            setIsSemesterStatusModalOpen(true);
        }
    };

    const handleSaveSemesterStatus = (semesterName: string, isActive: boolean, startDate: string, endDate: string) => {
        if (selectedProgram) {
            const updatedProgram = { ...selectedProgram };
            const updatedSemesters = { ...updatedProgram.semesters };
            if (updatedSemesters[semesterName]) {
                updatedSemesters[semesterName] = { ...updatedSemesters[semesterName], isActive, startDate, endDate };
            }
            updatedProgram.semesters = updatedSemesters;
            
            setPrograms(programs.map(p => p.id === updatedProgram.id ? updatedProgram : p));
            setSelectedProgram(updatedProgram);
            toast.success(`Status for "${semesterName}" has been updated.`);
        }
        setIsSemesterStatusModalOpen(false);
    };
    
    // Handlers para ma-trigger ang mga modal
    const handleAddSemester = () => setIsSemesterModalOpen(true);
    const handleEditSemester = (semesterName: string) => { setEditingSemesterName(semesterName); setIsSemesterRenameModalOpen(true); };
    const handleDeleteSemester = (semesterName: string) => { console.log("Deleting:", semesterName); };
    const handleRenameSemester = (newName: string) => { console.log("Renaming to:", newName); };
    const handleAddSubject = (semester: string) => { setEditingSubjectInfo({ semester, subject: null }); setIsSubjectModalOpen(true); };
    const handleEditSubject = (semester: string, subject: Subject) => { setEditingSubjectInfo({ semester, subject }); setIsSubjectModalOpen(true); };
    const handleDeleteSubject = (semester: string, code: string) => { console.log(`Deleting ${code} from ${semester}`); };

    const effectiveYears = useMemo(() => {
        const years = new Set(programs.map(p => p.effectiveYear));
        return ['All Years', ...Array.from(years).sort((a, b) => b.localeCompare(a))];
    }, [programs]);

    const filteredPrograms = useMemo(() => {
        return programs
            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.abbreviation.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(p => yearFilter === 'All Years' || p.effectiveYear === yearFilter);
    }, [programs, searchTerm, yearFilter]);

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
                                <ProgramCard key={program.id} program={program} index={i} onEdit={handleEditProgram} onDelete={handleDeleteProgram} onManage={() => setSelectedProgram(program)} />
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
            
            {selectedProgram && (
                <CurriculumDetailModal 
                    isOpen={!!selectedProgram} 
                    onClose={() => setSelectedProgram(null)} 
                    program={selectedProgram} 
                    onAddSemester={handleAddSemester} 
                    onEditSemester={handleEditSemester} 
                    onDeleteSemester={handleDeleteSemester} 
                    onAddSubject={handleAddSubject} 
                    onEditSubject={handleEditSubject} 
                    onDeleteSubject={handleDeleteSubject} 
                    onSetSemesterStatus={handleOpenSemesterStatus}
                    refreshKey={refreshSemestersKey} 
                />
            )}

            <SemesterFormModal
                isOpen={isSemesterModalOpen}
                onClose={() => setIsSemesterModalOpen(false)}
                onSave={handleSaveSemester}
                programId={selectedProgram ? selectedProgram.id : 0}
            />

            <SemesterRenameModal 
                isOpen={isSemesterRenameModalOpen} 
                onClose={() => setIsSemesterRenameModalOpen(false)} 
                onSave={handleRenameSemester} 
                initialData={editingSemesterName} 
            />

            {editingSubjectInfo && (
                <SubjectFormModal 
                    isOpen={isSubjectModalOpen} 
                    onClose={() => setIsSubjectModalOpen(false)} 
                    // FIX: Gisulbad ang type error pinaagi sa pag-define sa type sa mga parameters
                    onSave={(subjectData: Subject, isEditing: boolean) => 
                        handleSaveSubject(editingSubjectInfo.semester, subjectData, isEditing)
                    } 
                    initialData={editingSubjectInfo.subject}
                    semesterName={editingSubjectInfo.semester}
                    programId={selectedProgram?.id ?? 0}
                />
            )}

            <SemesterStatusModal 
                isOpen={isSemesterStatusModalOpen} 
                onClose={() => setIsSemesterStatusModalOpen(false)} 
                onSave={handleSaveSemesterStatus} 
                semesterName={editingSemester?.name || null} 
                initialData={editingSemester?.semester || null} 
            />
        </>
    );
}

export default Curriculum;