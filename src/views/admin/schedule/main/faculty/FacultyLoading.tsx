import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
// UPDATED: Gidugang ang 'X' icon
import { BookOpen, Briefcase, Check, CheckCircle, ChevronRight, ChevronsUpDown, Info, User, X, XCircle, Slash } from 'lucide-react';
import type { FacultyType, Subject } from '../MainFacultyLoading';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

// Define the shape of the props this component expects
interface FacultyLoadingProps {
    faculty: FacultyType[];
    subjects: Subject[];
    selectedFaculty: FacultyType | null;
    setSelectedFaculty: (faculty: FacultyType | null) => void;
    setSelectedSubject: (subject: Subject) => void;
    setIsModalOpen: (isOpen: boolean) => void;
    onUnassign: (subjectId: number) => void;
}

function FacultyLoading({ faculty, subjects, selectedFaculty, setSelectedFaculty, setSelectedSubject, setIsModalOpen, onUnassign }: FacultyLoadingProps) {
    const [openPopover, setOpenPopover] = useState(false);

    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.05,
                type: 'spring',
                stiffness: 120,
                damping: 14
            },
        }),
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* --- Faculty Panel --- */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: "circOut" }}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
            >
                 <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-gray-800">
                    <User className="text-indigo-500" /> Select Faculty
                </h2>
                
                {/* --- UPDATED: Searchable Dropdown with Clear Button --- */}
                <div className="relative mb-4">
                     <Popover open={openPopover} onOpenChange={setOpenPopover}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openPopover}
                                className="w-full justify-between h-12 text-base group" // Gidugang ang 'group' para sa styling
                            >
                                <span className="truncate">
                                    {selectedFaculty
                                        ? selectedFaculty.name
                                        : "Select faculty..."}
                                </span>
                                
                                {/* Container para sa mga icon */}
                                <div className="flex items-center">
                                    {/* Mogawas lang kon naay selectedFaculty */}
                                    {selectedFaculty && (
                                        <button
                                            aria-label="Clear selection"
                                            className="p-1 rounded-full hover:bg-red-200 mr-1 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Aron dili mo-abli ang popover
                                                setSelectedFaculty(null);
                                            }}
                                        >
                                            <X className="h-4 w-4 text-red-500 hover:text-red-800" />
                                        </button>
                                    )}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </div>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                                <CommandInput placeholder="Search faculty by name..." />
                                <CommandList>
                                    <CommandEmpty>No faculty found.</CommandEmpty>
                                    <CommandGroup>
                                        {faculty.map((f) => (
                                            <CommandItem
                                                key={f.id}
                                                value={f.name}
                                                onSelect={(currentValue) => {
                                                    const facultyToSet = faculty.find(fac => fac.name.toLowerCase() === currentValue.toLowerCase());
                                                    setSelectedFaculty(facultyToSet || null);
                                                    setOpenPopover(false);
                                                }}
                                            >
                                                <Check
                                                    className={`mr-2 h-4 w-4 ${selectedFaculty?.name === f.name ? "opacity-100" : "opacity-0"}`}
                                                />
                                                {f.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
                
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-2 -mr-2">
                    {faculty.map((f, i) => {
                        const assignedCount = subjects.filter(s => s.assigned?.faculty === f.name).length;
                        const isMaxedOut = assignedCount >= f.maxSubjects;
                        return(
                        <motion.div
                            key={f.id}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                            whileTap={{ scale: 0.98 }}
                            custom={i}
                            onClick={() => setSelectedFaculty(f)}
                            className={`p-4 border-l-4 rounded-lg cursor-pointer transition-all duration-300 group relative overflow-hidden ${selectedFaculty?.id === f.id ? 'bg-indigo-50 border-indigo-500 shadow-indigo-100 shadow-md' : 'border-gray-200 hover:bg-gray-50 hover:border-indigo-400'}`}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-800 text-lg">{f.name}</p>
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {f.expertise.map(exp => (
                                            <span key={exp} className="text-xs font-medium text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-full">{exp}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2 z-10">
                                    <div className={`text-xs font-bold px-3 py-1.5 rounded-full ${isMaxedOut ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                        Load: {assignedCount} / {f.maxSubjects}
                                    </div>
                                    <ChevronRight className={`text-gray-400 transition-transform duration-300 ${selectedFaculty?.id === f.id ? 'translate-x-1' : 'group-hover:translate-x-1'}`} />
                                </div>
                            </div>
                        </motion.div>
                    )})}
                </div>
            </motion.div>

            {/* --- Subject Panel (Walay kausaban dinhi) --- */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: "circOut" }}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
            >
                <div className="flex justify-between items-center mb-4">
                     <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-800">
                        <BookOpen className="text-purple-500" /> Assign Subjects
                    </h2>
                </div>
                
                {!selectedFaculty ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 rounded-lg p-8">
                       <Info size={48} className="text-gray-300 mb-4" />
                       <h3 className="font-bold text-lg text-gray-700">Select a Faculty Member</h3>
                       <p className="max-w-xs mx-auto">Choose a faculty from the list on the left to see which subjects they are eligible to teach.</p>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 -mr-2">
                        {subjects.map((s, i) => {
                            const isEligible = selectedFaculty.expertise.includes(s.expertise);
                            const assignedCount = subjects.filter(sub => sub.assigned?.faculty === selectedFaculty.name).length;
                            const isFacultyMaxedOut = assignedCount >= selectedFaculty.maxSubjects;

                            return (
                            <motion.div
                                key={s.id}
                                layout
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                custom={i}
                                className={`p-4 rounded-lg transition-all duration-300 border-l-4 ${s.assigned ? 'bg-green-50 border-green-500' : 'bg-white border-gray-200'}`}
                            >
                                <div className="flex justify-between items-center gap-4">
                                    <div className="flex-grow">
                                        <p className="font-semibold text-gray-800">{s.code} - {s.name}</p>
                                        <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                                            <Briefcase size={14} className="text-purple-400"/> Required: <span className="font-medium text-purple-800">{s.expertise}</span>
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0">
                                    {s.assigned ? (
                                        <div className="text-right">
                                            <div className="text-sm mb-2">
                                                <p className="font-semibold text-green-700 flex items-center gap-1.5 justify-end"><CheckCircle size={16}/> Assigned To</p>
                                                <p className="text-gray-600 font-medium">{s.assigned.faculty}</p>
                                                <p className="text-gray-500 text-xs">{s.assigned.time}</p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onUnassign(s.id)}
                                                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors"
                                            >
                                                <XCircle size={16} className="mr-2"/>
                                                Unassign
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button 
                                            size="sm"
                                            onClick={() => { setSelectedSubject(s); setIsModalOpen(true); }}
                                            disabled={!isEligible || isFacultyMaxedOut}
                                            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white shadow-lg shadow-indigo-500/20"
                                        >
                                            Assign
                                        </Button>
                                    )}
                                    </div>
                                </div>
                                {!s.assigned && !isEligible && (
                                    <div className="flex items-center gap-2 text-xs text-orange-600 mt-2 p-2 bg-orange-50 rounded-md">
                                        <Slash size={14} />
                                        <span>Faculty lacks the required <b>{s.expertise}</b> expertise.</span>
                                    </div>
                                )}
                                 {!s.assigned && isEligible && isFacultyMaxedOut && (
                                     <div className="flex items-center gap-2 text-xs text-red-600 mt-2 p-2 bg-red-50 rounded-md">
                                        <Info size={14} />
                                        <span>Faculty has reached the maximum teaching load.</span>
                                    </div>
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