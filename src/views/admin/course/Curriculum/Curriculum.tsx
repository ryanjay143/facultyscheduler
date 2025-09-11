import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Search, Book, Plus, Edit, Trash2, Hash, Star, Layers } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";

// --- TYPE DEFINITIONS ---
type Subject = {
    code: string;
    name: string;
    units: number;
};

type Program = {
    id: number;
    name:string;
    abbreviation: string;
    subjects: {
        [semester: string]: Subject[];
    };
};

// --- INITIAL MOCK DATA ---
const initialProgramsData: Program[] = [
    { id: 1, name: 'Bachelor of Science in Information Technology', abbreviation: 'BSIT', subjects: { '1st Year, 1st Semester': [{ code: 'IT101', name: 'Introduction to Computing', units: 3 }, { code: 'CS101', name: 'Computer Programming 1', units: 3 }], '1st Year, 2nd Semester': [{ code: 'IT102', name: 'Fundamentals of Database Systems', units: 3 }] } },
    { id: 2, name: 'Bachelor of Science in Computer Science', abbreviation: 'BSCS', subjects: { '1st Year, 1st Semester': [{ code: 'CS110', name: 'Discrete Mathematics', units: 3 }] } },
    { id: 3, name: 'Bachelor of Science in Business Administration', abbreviation: 'BSBA', subjects: { '1st Year, 1st Semester': [{ code: 'BA101', name: 'Principles of Management', units: 3 }] } },
    { id: 4, name: 'Bachelor of Arts in Communication', abbreviation: 'BA Comm', subjects: { '1st Year, 1st Semester': [{ code: 'COMM101', name: 'Intro to Mass Communication', units: 3 }] } },
];


// --- COLOR PALETTE FOR PROGRAM CARDS ---
const programColorClasses = [
    'from-purple-600 to-indigo-600',
    'from-blue-500 to-teal-400',
    'from-pink-500 to-rose-500',
    'from-orange-500 to-amber-500',
    'from-green-500 to-lime-500',
    'from-cyan-500 to-sky-500'
];


// --- ANIMATION VARIANTS for Framer Motion ---
const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.05, type: 'spring', stiffness: 100 },
    }),
};

const modalOverlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
};

const modalContentVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
};


// --- MAIN CURRICULUM COMPONENT ---
function Curriculum() {
    // --- STATE MANAGEMENT ---
    const [programs, setPrograms] = useState<Program[]>(initialProgramsData);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

    // Modal States
    const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
    const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
    const [isSemesterModalOpen, setIsSemesterModalOpen] = useState(false);

    // States for tracking what is being edited
    const [editingProgram, setEditingProgram] = useState<Program | null>(null);
    const [editingSubjectInfo, setEditingSubjectInfo] = useState<{ semester: string; subject: Subject | null } | null>(null);
    const [editingSemesterName, setEditingSemesterName] = useState<string | null>(null);

    // --- CRUD HANDLER FUNCTIONS ---

    // PROGRAM HANDLERS
    const handleAddProgram = () => {
        setEditingProgram(null);
        setIsProgramModalOpen(true);
    };

    const handleEditProgram = (program: Program) => {
        setEditingProgram(program);
        setIsProgramModalOpen(true);
    };

    const handleDeleteProgram = (programId: number) => {
        if (window.confirm('Are you sure you want to delete this program and all its subjects? This action cannot be undone.')) {
            setPrograms(programs.filter(p => p.id !== programId));
        }
    };

    const handleSaveProgram = (programData: Omit<Program, 'id' | 'subjects'>) => {
        if (editingProgram) {
            setPrograms(programs.map(p => (p.id === editingProgram.id ? { ...p, ...programData } : p)));
        } else {
            const newProgram: Program = {
                id: Date.now(),
                ...programData,
                subjects: { '1st Year, 1st Semester': [] },
            };
            setPrograms([...programs, newProgram]);
        }
        setIsProgramModalOpen(false);
    };

    // SUBJECT HANDLERS
    const handleAddSubject = (semester: string) => {
        setEditingSubjectInfo({ semester, subject: null });
        setIsSubjectModalOpen(true);
    };
    
    const handleEditSubject = (semester: string, subject: Subject) => {
        setEditingSubjectInfo({ semester, subject });
        setIsSubjectModalOpen(true);
    };

    const handleDeleteSubject = (programId: number, semester: string, subjectCode: string) => {
        if (!window.confirm(`Are you sure you want to delete subject ${subjectCode}?`)) return;

        const updatedPrograms = programs.map(p => {
            if (p.id === programId) {
                const updatedProgram = { ...p };
                updatedProgram.subjects[semester] = updatedProgram.subjects[semester].filter(s => s.code !== subjectCode);
                return updatedProgram;
            }
            return p;
        });
        setPrograms(updatedPrograms);
    };

    const handleSaveSubject = (semester: string, subjectData: Subject) => {
        if (!selectedProgram) return;
        const isEditing = !!editingSubjectInfo?.subject;
        const updatedPrograms = programs.map(p => {
            if (p.id === selectedProgram.id) {
                const updatedProgram = { ...p, subjects: { ...p.subjects } };
                if (isEditing) {
                    const originalCode = editingSubjectInfo!.subject!.code;
                    updatedProgram.subjects[semester] = updatedProgram.subjects[semester].map(s => s.code === originalCode ? subjectData : s);
                } else {
                    updatedProgram.subjects[semester].push(subjectData);
                }
                return updatedProgram;
            }
            return p;
        });
        setPrograms(updatedPrograms);
        setIsSubjectModalOpen(false);
    };

    // SEMESTER HANDLERS
    const handleAddSemester = () => {
        setEditingSemesterName(null);
        setIsSemesterModalOpen(true);
    };

    const handleEditSemester = (semesterName: string) => {
        setEditingSemesterName(semesterName);
        setIsSemesterModalOpen(true);
    };

    const handleDeleteSemester = (semesterName: string) => {
        if (!selectedProgram || !window.confirm(`Are you sure you want to delete the semester "${semesterName}" and all its subjects? This action cannot be undone.`)) return;

        setPrograms(programs.map(p => {
            if (p.id === selectedProgram.id) {
                const newSubjects = { ...p.subjects };
                delete newSubjects[semesterName];
                return { ...p, subjects: newSubjects };
            }
            return p;
        }));
    };

    const handleSaveSemester = (newSemesterName: string) => {
        if (!selectedProgram || !newSemesterName.trim()) return;
        const isEditing = !!editingSemesterName;
        setPrograms(programs.map(p => {
            if (p.id === selectedProgram.id) {
                const newSubjects = { ...p.subjects };
                if (newSubjects[newSemesterName] && newSemesterName !== editingSemesterName) {
                    alert('A semester with this name already exists.');
                    return p;
                }
                if (isEditing) {
                    const subjectsToKeep = newSubjects[editingSemesterName!];
                    delete newSubjects[editingSemesterName!];
                    newSubjects[newSemesterName] = subjectsToKeep;
                } else {
                    newSubjects[newSemesterName] = [];
                }
                return { ...p, subjects: newSubjects };
            }
            return p;
        }));
        setIsSemesterModalOpen(false);
    };
    
    const filteredPrograms = programs.filter(program =>
        program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.abbreviation.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (selectedProgram) {
            const updatedSelectedProgram = programs.find(p => p.id === selectedProgram.id);
            setSelectedProgram(updatedSelectedProgram || null);
        }
    }, [programs, selectedProgram]);


    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen ">
            <header className="mb-8 flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">Curriculum Management</h1>
                    <p className="text-gray-500 mt-1">Add, edit, and manage academic programs and their subjects.</p>
                </div>
                <Button onClick={handleAddProgram} className="flex items-center gap-2 bg-purple-600 text-white font-semibold px-5 py-3 rounded-lg shadow-lg hover:bg-purple-700 transition-transform hover:scale-105">
                    <Plus size={20} /> Add Program
                </Button>
            </header>

            <div className="mb-8 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
                <Input
                    type="text"
                    placeholder="Search for a program..."
                    className="pl-12 pr-4 py-3 border border-gray-200 rounded-full w-full max-w-lg focus:ring-2 focus:ring-purple-400 transition shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <motion.div className="grid grid-cols-1 md:grid-cols-1 gap-8" initial="hidden" animate="visible">
                {filteredPrograms.map((program, i) => (
                    <motion.div
                        key={program.id}
                        variants={cardVariants}
                        custom={i}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-2xl flex flex-col"
                    >
                        {/* --- DYNAMIC COLOR APPLIED HERE --- */}
                        <div className={`p-6 bg-gradient-to-br text-white relative ${programColorClasses[i % programColorClasses.length]}`}>
                            <h2 className="text-2xl font-bold">{program.abbreviation}</h2>
                            <p className="opacity-80 truncate">{program.name}</p>
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEditProgram(program)} className="p-2 bg-black/20 rounded-full hover:bg-black/40 transition-colors"><Edit size={16} /></button>
                                <button onClick={() => handleDeleteProgram(program.id)} className="p-2 bg-black/20 rounded-full hover:bg-red-500/80 transition-colors"><Trash2 size={16} /></button>
                            </div>
                        </div>
                        <div className="p-6 flex-grow flex flex-col justify-between">
                             <div className="flex justify-between items-center text-gray-600 mb-4">
                                <span className="font-semibold">Total Subjects</span>
                                <span className="px-3 py-1 bg-gray-300 text-gray-700 rounded-full font-bold text-sm">
                                    {Object.values(program.subjects).flat().length}
                                </span>
                            </div>
                            <Button onClick={() => setSelectedProgram(program)} variant="outline" className="w-full mt-2 shadow-lg hover:bg-primary hover:text-white transition-colors">
                                Manage Subjects
                            </Button>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* --- MODALS SECTION --- */}
            
            <AnimatePresence>
                {selectedProgram && (
                    <motion.div
                        variants={modalOverlayVariants}
                        initial="hidden" animate="visible" exit="exit"
                        className="fixed inset-0 bg-black/70 flex justify-center items-center z-[100] p-4"
                        onClick={() => setSelectedProgram(null)}
                    >
                        <motion.div
                            variants={modalContentVariants}
                            className="bg-gray-100 p-8 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6 pb-4 border-b">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800">{selectedProgram.name}</h3>
                                    <p className="text-purple-600 font-semibold">{selectedProgram.abbreviation}</p>
                                </div>
                                <Button onClick={handleAddSemester} className="flex items-center gap-2 bg-primary">
                                    <Layers size={16}/> Add New Semester
                                </Button>
                            </div>
                            <div className="overflow-y-auto space-y-6 pr-4">
                                {Object.keys(selectedProgram.subjects).length === 0 ? (
                                    <div className="text-center py-16 text-gray-500">
                                        <Layers size={48} className="mx-auto mb-4 text-gray-400"/>
                                        <h4 className="font-semibold text-lg">No Semesters Found</h4>
                                        <p>Click "Add New Semester" to get started.</p>
                                    </div>
                                ) : (
                                    Object.entries(selectedProgram.subjects).map(([semester, subjects]) => (
                                        <div key={semester} className="group/semester">
                                            <div className="flex justify-between items-center mb-3 top-0 bg-gray-100 py-2 -mx-8 px-8 border-b border-t">
                                                <h4 className="text-xl font-semibold text-gray-700">{semester}</h4>
                                                <div className="flex items-center gap-2 opacity-0 group-hover/semester:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditSemester(semester)}>
                                                        <Edit size={16}/>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-100 hover:text-red-600" onClick={() => handleDeleteSemester(semester)}>
                                                        <Trash2 size={16}/>
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                {subjects.map(subject => (
                                                    <div key={subject.code} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center border border-gray-200 group/subject">
                                                        <div className="flex items-center gap-4">
                                                            <div className="p-3 bg-purple-100 rounded-lg text-purple-600"><Book /></div>
                                                            <div>
                                                                <p className="font-bold text-gray-800">{subject.name}</p>
                                                                <p className="text-sm text-gray-500 flex items-center gap-4">
                                                                    <span className="flex items-center gap-1.5"><Hash size={14}/>{subject.code}</span>
                                                                    <span className="flex items-center gap-1.5"><Star size={14}/>{subject.units} Units</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2 opacity-0 group-hover/subject:opacity-100 transition-opacity">
                                                            <button onClick={() => handleEditSubject(semester, subject)} className="p-2 text-gray-500 hover:text-blue-600"><Edit size={18} /></button>
                                                            <button onClick={() => handleDeleteSubject(selectedProgram.id, semester, subject.code)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 size={18} /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                                {subjects.length === 0 && <p className="text-gray-500 italic text-center py-4">No subjects added for this semester.</p>}
                                            </div>
                                            <Button onClick={() => handleAddSubject(semester)} variant="link" className="mt-2 text-purple-600 px-0">
                                                <Plus size={16} className="mr-1"/> Add Subject to this Semester
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <AnimatePresence>
                {isProgramModalOpen && ( <ProgramFormModal onClose={() => setIsProgramModalOpen(false)} onSave={handleSaveProgram} initialData={editingProgram} /> )}
            </AnimatePresence>

            <AnimatePresence>
                {isSubjectModalOpen && editingSubjectInfo && ( <SubjectFormModal onClose={() => setIsSubjectModalOpen(false)} onSave={(subjectData) => handleSaveSubject(editingSubjectInfo.semester, subjectData)} initialData={editingSubjectInfo.subject} /> )}
            </AnimatePresence>

            <AnimatePresence>
                {isSemesterModalOpen && ( <SemesterFormModal onClose={() => setIsSemesterModalOpen(false)} onSave={handleSaveSemester} initialData={editingSemesterName} /> )}
            </AnimatePresence>
        </div>
    );
}

// --- REUSABLE MODAL FORM COMPONENTS ---

type ProgramFormProps = { onClose: () => void; onSave: (data: { name: string; abbreviation: string }) => void; initialData: Program | null; };
function ProgramFormModal({ onClose, onSave, initialData }: ProgramFormProps) {
    const [name, setName] = useState(initialData?.name || '');
    const [abbreviation, setAbbreviation] = useState(initialData?.abbreviation || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && abbreviation) onSave({ name, abbreviation });
    };

    return (
        <motion.div variants={modalOverlayVariants} initial="hidden" animate="visible" exit="exit" className="fixed inset-0 bg-black/60 flex justify-center items-center z-[101] p-4" onClick={onClose}>
            <motion.div variants={modalContentVariants} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">{initialData ? 'Edit Program' : 'Add New Program'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Label htmlFor="progName" className="block text-sm font-medium text-gray-700 mb-1">Program Name</Label>
                        <Input id="progName" type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400" required />
                    </div>
                    <div className="mb-6">
                        <Label htmlFor="progAbbr" className="block text-sm font-medium text-gray-700 mb-1">Abbreviation (e.g., BSIT)</Label>
                        <Input id="progAbbr" type="text" value={abbreviation} onChange={e => setAbbreviation(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400" required />
                    </div>
                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Save Program</Button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

type SubjectFormProps = { onClose: () => void; onSave: (data: Subject) => void; initialData: Subject | null; };
function SubjectFormModal({ onClose, onSave, initialData }: SubjectFormProps) {
    const [code, setCode] = useState(initialData?.code || '');
    const [name, setName] = useState(initialData?.name || '');
    const [units, setUnits] = useState(initialData?.units || 3);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (code && name && units > 0) onSave({ code, name, units });
    };

    return (
        <motion.div variants={modalOverlayVariants} initial="hidden" animate="visible" exit="exit" className="fixed inset-0 bg-black/60 flex justify-center items-center z-[101] p-4" onClick={onClose}>
            <motion.div variants={modalContentVariants} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">{initialData ? 'Edit Subject' : 'Add New Subject'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Label htmlFor="subCode" className="block text-sm font-medium text-gray-700 mb-1">Subject Code</Label>
                        <Input id="subCode" type="text" value={code} onChange={e => setCode(e.target.value)} disabled={!!initialData} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 disabled:bg-gray-100" required />
                        {!!initialData && <p className="text-xs text-gray-500 mt-1">Subject code cannot be changed.</p>}
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="subName" className="block text-sm font-medium text-gray-700 mb-1">Subject Name</Label>
                        <Input id="subName" type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400" required />
                    </div>
                    <div className="mb-6">
                        <Label htmlFor="subUnits" className="block text-sm font-medium text-gray-700 mb-1">Units</Label>
                        <Input id="subUnits" type="number" min="1" value={units} onChange={e => setUnits(Number(e.target.value))} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400" required />
                    </div>
                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Save Subject</Button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

type SemesterFormProps = { onClose: () => void; onSave: (semesterName: string) => void; initialData: string | null; };
function SemesterFormModal({ onClose, onSave, initialData }: SemesterFormProps) {
    const [name, setName] = useState(initialData || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(name);
    };

    return (
        <motion.div variants={modalOverlayVariants} initial="hidden" animate="visible" exit="exit" className="fixed inset-0 bg-black/60 flex justify-center items-center z-[101] p-4" onClick={onClose}>
            <motion.div variants={modalContentVariants} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">{initialData ? 'Edit Semester' : 'Add New Semester'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Label htmlFor="semesterName" className="block text-sm font-medium text-gray-700 mb-1">Semester Name</Label>
                        <Input id="semesterName" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., 2nd Year, 1st Semester" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400" required />
                    </div>
                    <div className="flex justify-end gap-4 mt-8">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Save Semester</Button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

export default Curriculum;