import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { BookOpen, Briefcase, CheckCircle, ChevronRight, Info, Search, User } from 'lucide-react';
import type { FacultyType, Subject } from '../MainFacultyLoading';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Define the shape of the props this component expects
interface FacultyLoadingProps {
    faculty: FacultyType[];
    subjects: Subject[];
    selectedFaculty: FacultyType | null;
    setSelectedFaculty: (faculty: FacultyType) => void;
    setSelectedSubject: (subject: Subject) => void;
    setIsModalOpen: (isOpen: boolean) => void;
}

function FacultyLoading({ faculty, subjects, selectedFaculty, setSelectedFaculty, setSelectedSubject, setIsModalOpen }: FacultyLoadingProps) {

    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.05,
                type: 'spring',
                stiffness: 100
            },
        }),
    };

    return (
        <div className="grid grid-cols-1 gap-8">
            {/* --- Faculty Panel --- */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 rounded-2xl shadow-lg"
            >
                 <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <User className="text-indigo-500" /> Select Faculty
                </h2>
                <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <Input type="text" placeholder="Search faculty..." className="pl-12 pr-4 py-3 border border-gray-200 rounded-full w-full focus:ring-2 focus:ring-indigo-400 transition" />
                </div>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {faculty.map((f, i) => (
                        <motion.div
                            key={f.id}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            custom={i}
                            onClick={() => setSelectedFaculty(f)}
                            className={`p-4 border-l-4 rounded-lg cursor-pointer transition-all duration-300 group ${selectedFaculty?.id === f.id ? 'bg-indigo-100 border-indigo-500 shadow-md' : 'border-gray-200 hover:bg-gray-100 hover:border-indigo-400'}`}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-800">{f.name}</p>
                                    <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                                        <Briefcase size={14} />
                                        {f.expertise.join(', ')}
                                    </div>
                                </div>
                                <ChevronRight className={`text-gray-400 transition-transform duration-300 ${selectedFaculty?.id === f.id ? 'translate-x-1' : 'group-hover:translate-x-1'}`} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* --- Subject Panel --- */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 rounded-2xl shadow-lg"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-2">
                        <BookOpen className="text-purple-500" /> Assign Subjects
                    </h2>
                </div>
                
                {!selectedFaculty ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 rounded-lg p-8">
                       <Info size={48} className="text-gray-400 mb-4" />
                       <h3 className="font-semibold text-lg">Select a Faculty Member</h3>
                       <p>Choose a faculty from the list to see eligible subjects for assignment.</p>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                        {subjects.map((s, i) => {
                            const isEligible = selectedFaculty.expertise.includes(s.expertise);
                            return (
                            <motion.div
                                key={s.id}
                                layout
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                custom={i}
                                className={`p-4 rounded-lg transition-all duration-300 ${s.assigned ? 'bg-green-50 border-l-4 border-green-400' : 'bg-white border border-gray-200'}`}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-gray-800">{s.code} - {s.name}</p>
                                        <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                                            <Briefcase size={14} /> Required: {s.expertise}
                                        </p>
                                    </div>
                                    {s.assigned ? (
                                        <div className="text-right text-sm">
                                            <p className="font-semibold text-green-700 flex items-center gap-1"><CheckCircle size={16}/> Assigned</p>
                                            <p className="text-gray-600">{s.assigned.faculty}</p>
                                            <p className="text-gray-500">{s.assigned.time}</p>
                                        </div>
                                    ) : (
                                        <Button 
                                            size="sm"
                                            onClick={() => { setSelectedSubject(s); setIsModalOpen(true); }}
                                            disabled={!isEligible}
                                        >
                                            Assign
                                        </Button>
                                    )}
                                </div>
                                {!s.assigned && !isEligible && (
                                    <p className="text-xs text-orange-600 mt-2">Faculty does not have the required expertise.</p>
                                )}
                            </motion.div>
                        )})}
                    </div>
                )}
            </motion.div>
        </div>
    )
}

export default FacultyLoading;