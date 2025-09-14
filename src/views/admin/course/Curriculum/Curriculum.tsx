import React, { useState, useEffect, useMemo } from 'react';
import type { Variants } from 'framer-motion';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit, Trash2, Layers, Calendar, AlertCircle, BookCopy, BarChart3, Archive } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";

// --- TYPE DEFINITIONS ---
type Subject = {
    code: string;
    name: string;
    unitsTotal: number;
    unitsLec: number;
    unitsLab: number;
    hoursTotal: number;
    hoursLec: number;
    hoursLab: number;
    prerequisite: string;
};

type Program = {
    id: number;
    name:string;
    abbreviation: string;
    effectiveYear: string;
    subjects: {
        [semester: string]: Subject[];
    };
};

// --- INITIAL MOCK DATA ---
const initialProgramsData: Program[] = [
    { id: 1, name: 'Bachelor of Science in Information Technology', abbreviation: 'BSIT', effectiveYear: '2024-2025', subjects: { 'First Year, First Semester': [{ code: 'IT101', name: 'Introduction to Computing', unitsTotal: 3, unitsLec: 2, unitsLab: 1, hoursTotal: 5, hoursLec: 2, hoursLab: 3, prerequisite: 'None' }], 'First Year, Second Semester': [{ code: 'IT102', name: 'Fundamentals of Database Systems', unitsTotal: 3, unitsLec: 2, unitsLab: 1, hoursTotal: 5, hoursLec: 2, hoursLab: 3, prerequisite: 'IT101' }] } },
    { id: 2, name: 'Bachelor of Science in Computer Science', abbreviation: 'BSCS', effectiveYear: '2023-2024', subjects: { 'First Year, First Semester': [{ code: 'CS110', name: 'Discrete Mathematics', unitsTotal: 3, unitsLec: 3, unitsLab: 0, hoursTotal: 3, hoursLec: 3, hoursLab: 0, prerequisite: 'None' }] } },
    { id: 3, name: 'Bachelor of Science in Business Administration', abbreviation: 'BSBA', effectiveYear: '2024-2025', subjects: { 'First Year, First Semester': [{ code: 'BA101', name: 'Principles of Management', unitsTotal: 3, unitsLec: 3, unitsLab: 0, hoursTotal: 3, hoursLec: 3, hoursLab: 0, prerequisite: 'None' }] } },
];

// --- COLOR PALETTE FOR PROGRAM CARDS ---
const programColorClasses = [ 'from-purple-600 to-indigo-600', 'from-blue-500 to-teal-400', 'from-pink-500 to-rose-500', 'from-orange-500 to-amber-500', 'from-green-500 to-lime-500', 'from-cyan-500 to-sky-500' ];

// --- ANIMATION VARIANTS for Framer Motion ---
const cardVariants: Variants = { hidden: { opacity: 0, y: 30 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, type: 'spring', stiffness: 120, damping: 14 } }) };
const modalVariants: Variants = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 } };

// --- MAIN CURRICULUM COMPONENT ---
function Curriculum() {
    // --- STATE MANAGEMENT ---
    const [programs, setPrograms] = useState<Program[]>(initialProgramsData);
    const [searchTerm, setSearchTerm] = useState('');
    const [yearFilter, setYearFilter] = useState('All Years');
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

    const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
    const [isSemesterModalOpen, setIsSemesterModalOpen] = useState(false);
    const [isSemesterRenameModalOpen, setIsSemesterRenameModalOpen] = useState(false);
    const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

    const [editingProgram, setEditingProgram] = useState<Program | null>(null);
    const [editingSemesterName, setEditingSemesterName] = useState<string | null>(null);
    const [editingSubjectInfo, setEditingSubjectInfo] = useState<{ semester: string; subject: Subject | null } | null>(null);

    // --- CRUD HANDLER FUNCTIONS (No changes here) ---
    const handleAddProgram = () => { setEditingProgram(null); setIsProgramModalOpen(true); };
    const handleEditProgram = (program: Program) => { setEditingProgram(program); setIsProgramModalOpen(true); };
    const handleDeleteProgram = (programId: number) => { if (window.confirm('Delete this program and all its contents?')) { setPrograms(programs.filter(p => p.id !== programId)); } };
    const handleSaveProgram = (programData: Omit<Program, 'id' | 'subjects'>) => { if (editingProgram) { setPrograms(programs.map(p => (p.id === editingProgram.id ? { ...p, ...programData } : p))); } else { const newProgram: Program = { id: Date.now(), ...programData, subjects: {} }; setPrograms([newProgram, ...programs]); } setIsProgramModalOpen(false); };
    const handleAddSemesterAndSubjects = () => setIsSemesterModalOpen(true);
    const handleSaveSemesterAndSubjects = (semesterName: string, subjects: Subject[]) => { if (!selectedProgram || !semesterName.trim()) return; setPrograms(programs.map(p => { if (p.id === selectedProgram.id) { if (p.subjects[semesterName]) { alert('A semester with this name already exists.'); return p; } const updatedProgram = { ...p, subjects: { ...p.subjects }}; const processedSubjects = subjects.filter(s => s.code && s.name).map(s => ({ ...s, prerequisite: s.prerequisite.trim() === '' ? 'None' : s.prerequisite })); updatedProgram.subjects[semesterName] = processedSubjects; return updatedProgram; } return p; })); setIsSemesterModalOpen(false); };
    const handleEditSemester = (semesterName: string) => { setEditingSemesterName(semesterName); setIsSemesterRenameModalOpen(true); };
    const handleDeleteSemester = (semesterName: string) => { if (!selectedProgram || !window.confirm(`Delete semester "${semesterName}" and all its subjects?`)) return; setPrograms(programs.map(p => { if (p.id === selectedProgram.id) { const newSubjects = { ...p.subjects }; delete newSubjects[semesterName]; return { ...p, subjects: newSubjects }; } return p; })); };
    const handleRenameSemester = (newSemesterName: string) => { if (!selectedProgram || !editingSemesterName || !newSemesterName.trim()) return; setPrograms(programs.map(p => { if (p.id === selectedProgram.id) { const newSubjects = { ...p.subjects }; if (newSubjects[newSemesterName] && newSemesterName !== editingSemesterName) { alert('A semester with this name already exists.'); return p; } const subjectsToKeep = newSubjects[editingSemesterName]; delete newSubjects[editingSemesterName]; newSubjects[newSemesterName] = subjectsToKeep; return { ...p, subjects: newSubjects }; } return p; })); setIsSemesterRenameModalOpen(false); };
    const handleAddSubject = (semester: string) => { setEditingSubjectInfo({ semester, subject: null }); setIsSubjectModalOpen(true); };
    const handleEditSubject = (semester: string, subject: Subject) => { setEditingSubjectInfo({ semester, subject }); setIsSubjectModalOpen(true); };
    const handleDeleteSubject = (semester: string, subjectCode: string) => { if (!selectedProgram || !window.confirm(`Delete subject ${subjectCode}?`)) return; setPrograms(programs.map(p => { if (p.id === selectedProgram.id) { const updatedProgram = { ...p }; updatedProgram.subjects[semester] = updatedProgram.subjects[semester].filter(s => s.code !== subjectCode); return updatedProgram; } return p; })); };
    const handleSaveSubject = (semester: string, subjectData: Subject) => { if (!selectedProgram) return; const isEditing = !!editingSubjectInfo?.subject; const processedSubject = { ...subjectData, prerequisite: subjectData.prerequisite.trim() === '' ? 'None' : subjectData.prerequisite }; setPrograms(programs.map(p => { if (p.id === selectedProgram.id) { const updatedProgram = { ...p, subjects: { ...p.subjects } }; if (isEditing) { const originalCode = editingSubjectInfo!.subject!.code; updatedProgram.subjects[semester] = updatedProgram.subjects[semester].map(s => s.code === originalCode ? processedSubject : s); } else { updatedProgram.subjects[semester].push(processedSubject); } return updatedProgram; } return p; })); setIsSubjectModalOpen(false); };

    const effectiveYears = useMemo(() => {
        const years = new Set(programs.map(p => p.effectiveYear));
        return ['All Years', ...Array.from(years).sort().reverse()];
    }, [programs]);

    const filteredPrograms = useMemo(() => {
        return programs
            .filter(program =>
                program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                program.abbreviation.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter(program =>
                yearFilter === 'All Years' || program.effectiveYear === yearFilter
            );
    }, [programs, searchTerm, yearFilter]);

    useEffect(() => { if (selectedProgram) { setSelectedProgram(programs.find(p => p.id === selectedProgram.id) || null); } }, [programs, selectedProgram]);

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <header className="mb-8 flex flex-wrap justify-between items-center gap-4">
                <div><h1 className="text-4xl font-bold text-gray-800">Curriculum Management</h1><p className="text-gray-500 mt-1">Manage academic programs and their subjects.</p></div>
                <Button onClick={handleAddProgram} className="flex items-center gap-2 bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-semibold px-5 py-3 rounded-lg shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-0.5"><Plus size={20} /> Add New Program</Button>
            </header>
            
            {/* --- UPDATED: Search and Filter Panel --- */}
            <div className="bg-white p-4 rounded-xl shadow-md mb-8 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-grow w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><Input type="text" placeholder="Search for a program by name or abbreviation..." className="pl-12 pr-4 py-3 bg-gray-50 border-gray-200 rounded-full w-full focus:ring-2 focus:ring-purple-400 transition-all duration-300" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="flex-shrink-0 w-full md:w-auto">
                    <Select value={yearFilter} onValueChange={setYearFilter}><SelectTrigger className="w-full md:w-[220px] h-12 rounded-full bg-gray-50 border-gray-200"><Calendar className="h-4 w-4 mr-2 text-gray-500" /><SelectValue placeholder="Filter by A.Y." /></SelectTrigger><SelectContent>{effectiveYears.map(year => (<SelectItem key={year} value={year}>{year}</SelectItem>))}</SelectContent></Select>
                </div>
            </div>
            
            {/* --- UPDATED: Program Cards Grid --- */}
            <AnimatePresence>
                {filteredPrograms.length > 0 ? (
                    <motion.div 
                        className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        initial="hidden"
                        animate="visible"
                    >
                        {filteredPrograms.map((program, i) => (
                            <motion.div 
                                key={program.id} 
                                variants={cardVariants} 
                                custom={i} 
                                className="bg-white rounded-2xl shadow-md overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col"
                            >
                                <div className={`p-5 bg-gradient-to-br text-white relative ${programColorClasses[i % programColorClasses.length]}`}>
                                    <h2 className="text-2xl font-bold">{program.abbreviation}</h2>
                                    <p className="opacity-80 truncate h-6">{program.name}</p>
                                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); handleEditProgram(program) }} className="h-9 w-9 bg-black/20 rounded-full hover:bg-black/40"><Edit size={16} /></Button>
                                        <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); handleDeleteProgram(program.id) }} className="h-9 w-9 bg-black/20 rounded-full hover:bg-red-500/80"><Trash2 size={16} /></Button>
                                    </div>
                                </div>
                                <div className="p-5 flex-grow flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 text-md text-gray-500 mb-4"><Calendar size={16} /><span>Effective A.Y. {program.effectiveYear}</span></div>
                                        <div className="space-y-3 text-md">
                                            <div className="flex justify-between items-center text-gray-600">
                                                <div className="flex items-center gap-2 font-semibold"><BookCopy size={16} className="text-purple-500" /><span>Total Subjects</span></div>
                                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-bold text-sm">
                                                    {Object.values(program.subjects).flat().length}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-gray-600">
                                                <div className="flex items-center gap-2 font-semibold"><BarChart3 size={16} className="text-indigo-500"/><span>Total Units</span></div>
                                                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-bold text-sm">
                                                    {Object.values(program.subjects).flat().reduce((total, subject) => total + subject.unitsTotal, 0)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button onClick={() => setSelectedProgram(program)} className="w-full mt-5 bg-gray-100 hover:bg-gray-200 text-black shadow-md">Manage Curriculum</Button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center col-span-full py-20 text-gray-500"
                    >
                        <Archive size={64} className="mx-auto mb-6 text-gray-300"/>
                        <h4 className="font-bold text-2xl text-gray-700">No Programs Found</h4>
                        <p className="max-w-md mx-auto mt-2">
                            No programs match your search criteria. Try a different search term or add a new program.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- MODALS SECTION --- */}
            <AnimatePresence>
                {selectedProgram && (
                    <Dialog open={!!selectedProgram} onOpenChange={(isOpen) => !isOpen && setSelectedProgram(null)}>
                        <DialogContent className="max-w-7xl max-h-[90vh] flex flex-col p-0">
                            <DialogHeader className="p-6 pb-4 bg-gray-50 border-b rounded-t-lg">
                                <DialogTitle className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                                    {selectedProgram?.name}
                                    <span className="text-sm font-semibold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">{selectedProgram?.abbreviation}</span>
                                </DialogTitle>
                                <DialogDescription>Academic Year of Effectivity: {selectedProgram?.effectiveYear}</DialogDescription>
                            </DialogHeader>
                            <div className="flex-grow overflow-y-auto px-6 py-4 space-y-8">
                                {Object.keys(selectedProgram.subjects).length === 0 ? (
                                    <div className="text-center py-20 text-gray-500 flex flex-col items-center justify-center">
                                        <Layers size={64} className="mx-auto mb-6 text-gray-300"/>
                                        <h4 className="font-bold text-2xl text-gray-700">No Semesters Found</h4>
                                        <p className="max-w-md mx-auto mt-2">This curriculum is currently empty. Start by adding a semester and its corresponding subjects in bulk.</p>
                                        <Button onClick={handleAddSemesterAndSubjects} className="mt-6 flex items-center gap-2"><Layers size={16}/> Add Year/Semester</Button>
                                    </div>
                                ) : (
                                    Object.entries(selectedProgram.subjects).map(([semester, subjects]) => (
                                        <div key={semester} className="group/semester bg-white border rounded-xl overflow-hidden">
                                            <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
                                                <h4 className="text-xl font-semibold text-gray-700">{semester}</h4>
                                                <div className="flex items-center gap-1 opacity-0 group-hover/semester:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600" onClick={() => handleEditSemester(semester)}><Edit size={16}/></Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-600" onClick={() => handleDeleteSemester(semester)}><Trash2 size={16}/></Button>
                                                </div>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <Table><TableHeader><TableRow className="bg-gray-100 hover:bg-gray-100"><TableHead>Code</TableHead><TableHead className="w-2/5">Descriptive Title</TableHead><TableHead className="text-center">Total Units</TableHead><TableHead className="text-center">Lec</TableHead><TableHead className="text-center">Lab</TableHead><TableHead className="text-center">Total Hours</TableHead><TableHead className="text-center">Lec</TableHead><TableHead className="text-center">Lab</TableHead><TableHead>Pre-requisite</TableHead><TableHead className="text-right w-[100px]">Actions</TableHead></TableRow></TableHeader>
                                                    <TableBody>
                                                        {subjects.map((subject, idx) => (
                                                            <TableRow key={subject.code} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                                                                <TableCell className="font-semibold">{subject.code}</TableCell>
                                                                <TableCell>{subject.name}</TableCell>
                                                                <TableCell className="text-center font-bold text-purple-700">{subject.unitsTotal}</TableCell>
                                                                <TableCell className="text-center">{subject.unitsLec}</TableCell>
                                                                <TableCell className="text-center">{subject.unitsLab}</TableCell>
                                                                <TableCell className="text-center font-bold text-indigo-700">{subject.hoursTotal}</TableCell>
                                                                <TableCell className="text-center">{subject.hoursLec}</TableCell>
                                                                <TableCell className="text-center">{subject.hoursLab}</TableCell>
                                                                <TableCell>{subject.prerequisite}</TableCell>
                                                                <TableCell className="text-right">
                                                                    <div className="flex justify-end gap-0">
                                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600" onClick={() => handleEditSubject(semester, subject)}><Edit size={16}/></Button>
                                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-600" onClick={() => handleDeleteSubject(semester, subject.code)}><Trash2 size={16}/></Button>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                    <TableFooter>
                                                        <TableRow className="bg-gray-100 hover:bg-gray-200 font-bold">
                                                            <TableCell colSpan={2} className="text-right text-gray-700">SEMESTER TOTALS</TableCell>
                                                            <TableCell className="text-center text-xl text-purple-700">{subjects.reduce((t, s) => t + s.unitsTotal, 0)}</TableCell>
                                                            <TableCell className="text-center text-gray-600">{subjects.reduce((t, s) => t + s.unitsLec, 0)}</TableCell>
                                                            <TableCell className="text-center text-gray-600">{subjects.reduce((t, s) => t + s.unitsLab, 0)}</TableCell>
                                                            <TableCell className="text-center text-xl text-indigo-700">{subjects.reduce((t, s) => t + s.hoursTotal, 0)}</TableCell>
                                                            <TableCell className="text-center text-gray-600">{subjects.reduce((t, s) => t + s.hoursLec, 0)}</TableCell>
                                                            <TableCell className="text-center text-gray-600">{subjects.reduce((t, s) => t + s.hoursLab, 0)}</TableCell>
                                                            <TableCell colSpan={2}></TableCell>
                                                        </TableRow>
                                                    </TableFooter>
                                                </Table>
                                            </div>
                                            <div className="p-2"><Button onClick={() => handleAddSubject(semester)} variant="link" className="text-purple-600 hover:text-purple-800"><Plus size={16} className="mr-1"/> Add Subject to this Semester</Button></div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <DialogFooter className="mt-auto p-6 bg-gray-50 border-t rounded-b-lg"><Button onClick={handleAddSemesterAndSubjects} variant="outline" className="flex items-center gap-2"><Layers size={16}/> Add Year/Semester (Bulk)</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </AnimatePresence>

            {/* --- CHILD MODALS (No major changes, but will benefit from consistent ShadCN styling) --- */}
            <ProgramFormModal isOpen={isProgramModalOpen} onClose={() => setIsProgramModalOpen(false)} onSave={handleSaveProgram} initialData={editingProgram} />
            <SemesterAndSubjectsFormModal isOpen={isSemesterModalOpen} onClose={() => setIsSemesterModalOpen(false)} onSave={handleSaveSemesterAndSubjects} />
            <SemesterRenameModal isOpen={isSemesterRenameModalOpen} onClose={() => setIsSemesterRenameModalOpen(false)} onSave={handleRenameSemester} initialData={editingSemesterName} />
            {editingSubjectInfo && <SubjectFormModal isOpen={isSubjectModalOpen} onClose={() => setIsSubjectModalOpen(false)} onSave={(subjectData) => handleSaveSubject(editingSubjectInfo.semester, subjectData)} initialData={editingSubjectInfo.subject} />}
        </div>
    );
}


// --- REUSABLE MODAL FORM COMPONENTS (No functional changes, but UI is more consistent) ---

type ProgramFormProps = { isOpen: boolean; onClose: () => void; onSave: (data: Omit<Program, 'id' | 'subjects'>) => void; initialData: Program | null; };
function ProgramFormModal({ isOpen, onClose, onSave, initialData }: ProgramFormProps) {
    const [name, setName] = useState(''); const [abbreviation, setAbbreviation] = useState(''); const [effectiveYear, setEffectiveYear] = useState('');
    useEffect(() => { if (initialData) { setName(initialData.name); setAbbreviation(initialData.abbreviation); setEffectiveYear(initialData.effectiveYear); } else { setName(''); setAbbreviation(''); setEffectiveYear(''); } }, [initialData, isOpen]);
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (name && abbreviation && effectiveYear) onSave({ name, abbreviation, effectiveYear }); };
    return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Program' : 'Add New Program'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
              <Label htmlFor="progName">Program Name</Label>
              <Input id="progName" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Bachelor of Science..." required />
            </div>
            <div>
              <Label htmlFor="progAbbr">Abbreviation</Label>
              <Input id="progAbbr" value={abbreviation} onChange={e => setAbbreviation(e.target.value)} placeholder="e.g., BSIT" required />
            </div>
            <div>
              <Label htmlFor="effectiveYear">Effectivity A.Y.</Label>
              <Input id="effectiveYear" value={effectiveYear} onChange={e => setEffectiveYear(e.target.value)} placeholder="e.g., 2024-2025" required />
            </div>
            <DialogFooter className='pt-4 flex flex-col gap-2'>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
               <Button type="submit">Save Program</Button >
            </DialogFooter>
          </form>
      </DialogContent>
    </Dialog>
    );
}

type SemesterAndSubjectsFormProps = { isOpen: boolean; onClose: () => void; onSave: (semesterName: string, subjects: Subject[]) => void; };
type SubjectError = { unitError: string | null; hourError: string | null; };
function SemesterAndSubjectsFormModal({ isOpen, onClose, onSave }: SemesterAndSubjectsFormProps) {
    const [semesterName, setSemesterName] = useState('');
    const [subjects, setSubjects] = useState<Subject[]>([{ code: '', name: '', unitsTotal: 0, unitsLec: 0, unitsLab: 0, hoursTotal: 0, hoursLec: 0, hoursLab: 0, prerequisite: '' }]);
    const [errors, setErrors] = useState<SubjectError[]>([]);
    useEffect(() => { const newErrors = subjects.map(s => ({ unitError: (s.unitsLec + s.unitsLab) > s.unitsTotal ? "Lec+Lab units > Total." : null, hourError: (s.hoursLec + s.hoursLab) > s.hoursTotal ? "Lec+Lab hours > Total." : null })); setErrors(newErrors); }, [subjects]);
    const hasErrors = useMemo(() => errors.some(e => e.unitError || e.hourError), [errors]);
    const handleAddSubjectRow = () => setSubjects([...subjects, { code: '', name: '', unitsTotal: 0, unitsLec: 0, unitsLab: 0, hoursTotal: 0, hoursLec: 0, hoursLab: 0, prerequisite: '' }]);
    const handleRemoveSubjectRow = (index: number) => setSubjects(subjects.filter((_, i) => i !== index));
    const handleSubjectChange = (index: number, field: keyof Subject, value: string | number) => setSubjects(subjects.map((s, i) => i === index ? { ...s, [field]: value } : s));
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (hasErrors) { alert("Fix errors before saving."); return; } onSave(semesterName, subjects); };
    useEffect(() => { if(isOpen) { setSemesterName(''); setSubjects([{ code: '', name: '', unitsTotal: 0, unitsLec: 0, unitsLab: 0, hoursTotal: 0, hoursLec: 0, hoursLab: 0, prerequisite: '' }]); } }, [isOpen]);
    return (<Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New Semester and Subjects</DialogTitle>
          <DialogDescription>Add subjects in bulk for a specific semester. Errors in totals will be highlighted.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex-grow flex flex-col min-h-0 py-4">
            <div className="mb-4">
              <Label htmlFor="semesterName" className="text-base">Year Level and Semester</Label>
              <Input id="semesterName" value={semesterName} onChange={e => setSemesterName(e.target.value)} placeholder="e.g., First Year, Second Semester" required className="mt-1" />
            </div>
            <div className="flex-grow overflow-y-auto border rounded-lg p-2 bg-gray-50 -mx-2 px-2">
              <div className="grid grid-cols-[1fr,3fr,0.5fr,0.5fr,0.5fr,0.5fr,0.5fr,0.5fr,1.5fr,auto] gap-2 px-2 pb-2 border-b font-semibold text-xs text-gray-500 uppercase sticky top-0 bg-gray-50 py-2">
                <div>Code</div>
                <div>Title</div>
                <div className="text-center">Units</div>
                <div className="text-center">Lec</div>
                <div className="text-center">Lab</div>
                <div className="text-center">Hrs</div>
                <div className="text-center">Lec</div>
                <div className="text-center">Lab</div>
                <div>Pre-req</div>
                </div>
                <div className="space-y-2 pt-2">
                  {subjects.map((s, index) => (<div key={index} className={`p-2 rounded-md transition-colors ${errors[index]?.unitError || errors[index]?.hourError ? 'bg-red-50 border border-red-200' : ''}`}>
                    <div className="grid grid-cols-[1fr,3fr,0.5fr,0.5fr,0.5fr,0.5fr,0.5fr,0.5fr,1.5fr,auto] gap-2 items-center">
                      <Input placeholder="Code" value={s.code} onChange={e => handleSubjectChange(index, 'code', e.target.value)} /><Input placeholder="Title" value={s.name} onChange={e => handleSubjectChange(index, 'name', e.target.value)} /><Input type="number" value={s.unitsTotal || ''} onChange={e => handleSubjectChange(index, 'unitsTotal', Number(e.target.value) || 0)} className={`text-center ${errors[index]?.unitError ? 'border-red-500' : ''}`} /><Input type="number" value={s.unitsLec || ''} onChange={e => handleSubjectChange(index, 'unitsLec', Number(e.target.value) || 0)} className={`text-center ${errors[index]?.unitError ? 'border-red-500' : ''}`} /><Input type="number" value={s.unitsLab || ''} onChange={e => handleSubjectChange(index, 'unitsLab', Number(e.target.value) || 0)} className={`text-center ${errors[index]?.unitError ? 'border-red-500' : ''}`} /><Input type="number" value={s.hoursTotal || ''} onChange={e => handleSubjectChange(index, 'hoursTotal', Number(e.target.value) || 0)} className={`text-center ${errors[index]?.hourError ? 'border-red-500' : ''}`} /><Input type="number" value={s.hoursLec || ''} onChange={e => handleSubjectChange(index, 'hoursLec', Number(e.target.value) || 0)} className={`text-center ${errors[index]?.hourError ? 'border-red-500' : ''}`} /><Input type="number" value={s.hoursLab || ''} onChange={e => handleSubjectChange(index, 'hoursLab', Number(e.target.value) || 0)} className={`text-center ${errors[index]?.hourError ? 'border-red-500' : ''}`} /><Input placeholder="None" value={s.prerequisite} onChange={e => handleSubjectChange(index, 'prerequisite', e.target.value)} /><Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveSubjectRow(index)} className="text-red-500 h-8 w-8 shrink-0"><Trash2 size={16} /></Button></div>{(errors[index]?.unitError || errors[index]?.hourError) && (<div className="flex items-center gap-2 text-red-600 text-xs mt-1 px-1"><AlertCircle size={14} /><span>{errors[index].unitError} {errors[index].hourError}</span></div>)}</div>))}</div></div>
    <Button type="button" variant="outline" onClick={handleAddSubjectRow} className="mt-4 flex items-center gap-2 self-start"><Plus size={16} /> Add Subject Row</Button>
    <DialogFooter className="mt-5 pt-4 border-t flex flex-col gap-2">
      <DialogClose asChild>
        <Button type="button" variant="outline">Cancel</Button>
        </DialogClose><Button type="submit" disabled={hasErrors}>{hasErrors ? "Fix Errors to Save" : "Save Curriculum"}</Button>
    </DialogFooter>
    </form>
    </DialogContent>
    </Dialog>
    );
}

type SemesterRenameModalProps = { isOpen: boolean; onClose: () => void; onSave: (semesterName: string) => void; initialData: string | null; };
function SemesterRenameModal({ isOpen, onClose, onSave, initialData }: SemesterRenameModalProps) {
    const [name, setName] = useState('');
    useEffect(() => { if(isOpen) setName(initialData || '') }, [isOpen, initialData]);
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(name); };
    return (<Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent><DialogHeader>
        <DialogTitle>Rename Semester</DialogTitle>
        </DialogHeader><form onSubmit={handleSubmit} className="py-4">
          <div className="mb-4"><Label htmlFor="semesterName">Semester Name</Label><Input id="semesterName" value={name} onChange={e => setName(e.target.value)} required /></div>
    <DialogFooter className="pt-4">
      <DialogClose asChild>
        <Button type="button" variant="outline">Cancel</Button>
        </DialogClose><Button type="submit">Save Changes</Button>
        </DialogFooter>
      </form>
      </DialogContent>
      </Dialog>
      );
}

type SubjectFormProps = { isOpen: boolean; onClose: () => void; onSave: (data: Subject) => void; initialData: Subject | null; };
function SubjectFormModal({ isOpen, onClose, onSave, initialData }: SubjectFormProps) {
    const [subject, setSubject] = useState<Subject>({ code: '', name: '', unitsTotal: 0, unitsLec: 0, unitsLab: 0, hoursTotal: 0, hoursLec: 0, hoursLab: 0, prerequisite: '' });
    const [errors, setErrors] = useState<SubjectError | null>(null);
    useEffect(() => { const unitError = (subject.unitsLec + subject.unitsLab) > subject.unitsTotal ? "Lec+Lab units > Total." : null; const hourError = (subject.hoursLec + subject.hoursLab) > subject.hoursTotal ? "Lec+Lab hours > Total." : null; if(unitError || hourError) { setErrors({ unitError, hourError }); } else { setErrors(null); } }, [subject]);
    useEffect(() => { if(isOpen) setSubject(initialData || { code: '', name: '', unitsTotal: 0, unitsLec: 0, unitsLab: 0, hoursTotal: 0, hoursLec: 0, hoursLab: 0, prerequisite: '' }) }, [isOpen, initialData]);
    const handleChange = (field: keyof Subject, value: string | number) => setSubject(s => ({ ...s, [field]: value }));
    const handleNumberChange = (field: keyof Subject, value: string) => handleChange(field, Number(value) || 0);
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if(errors) { alert("Please fix the errors before saving."); return; } onSave(subject); };
    return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initialData ? `Edit Subject: ${initialData.code}` : 'Add New Subject'}</DialogTitle>
          </DialogHeader><form onSubmit={handleSubmit} className="py-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Course Code</Label>
                  <Input value={subject.code} onChange={e => handleChange('code', e.target.value)} disabled={!!initialData} required />
                  {!!initialData && <p className="text-xs text-gray-500 mt-1">Course code cannot be edited.</p>}
                </div>
                <div>
                  <Label>Pre-requisite</Label>
                  <Input value={subject.prerequisite} onChange={e => handleChange('prerequisite', e.target.value)} placeholder="None" />
                </div>
              </div>
              <div>
                <Label>Descriptive Title</Label>
                <Input value={subject.name} onChange={e => handleChange('name', e.target.value)} required />
              </div>
              <div className="pt-4 space-y-2">
                <Label className="font-semibold">Unit Allocation</Label>
                <div className="grid grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50/50">
                    <div><Label>Total</Label><Input type="number" value={subject.unitsTotal || ''} onChange={e => handleNumberChange('unitsTotal', e.target.value)} className={errors?.unitError ? 'border-red-500' : ''} /></div>
                    <div><Label>Lec</Label><Input type="number" value={subject.unitsLec || ''} onChange={e => handleNumberChange('unitsLec', e.target.value)} className={errors?.unitError ? 'border-red-500' : ''} /></div>
                    <div><Label>Lab</Label><Input type="number" value={subject.unitsLab || ''} onChange={e => handleNumberChange('unitsLab', e.target.value)} className={errors?.unitError ? 'border-red-500' : ''} /></div>
                </div>
              </div>
              {errors?.unitError && <p className="text-red-600 text-xs flex items-center gap-2"><AlertCircle size={14}/>{errors.unitError}</p>}
              
              <div className="pt-2 space-y-2">
                <Label className="font-semibold">Hour Allocation</Label>
                <div className="grid grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50/50">
                    <div><Label>Total</Label><Input type="number" value={subject.hoursTotal || ''} onChange={e => handleNumberChange('hoursTotal', e.target.value)} className={errors?.hourError ? 'border-red-500' : ''} /></div>
                    <div><Label>Lec</Label><Input type="number" value={subject.hoursLec || ''} onChange={e => handleNumberChange('hoursLec', e.target.value)} className={errors?.hourError ? 'border-red-500' : ''} /></div>
                    <div><Label>Lab</Label><Input type="number" value={subject.hoursLab || ''} onChange={e => handleNumberChange('hoursLab', e.target.value)} className={errors?.hourError ? 'border-red-500' : ''} /></div>
                </div>
              </div>
              {errors?.hourError && <p className="text-red-600 text-xs flex items-center gap-2"><AlertCircle size={14}/>{errors.hourError}</p>}
            </div>
            <DialogFooter className="mt-8 pt-4 border-t flex flex-col gap-2">
              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button type="submit" disabled={!!errors}>{errors ? "Fix Errors" : "Save Subject"}</Button>
            </DialogFooter>
          </form>
      </DialogContent>
    </Dialog>
    );
}

export default Curriculum;