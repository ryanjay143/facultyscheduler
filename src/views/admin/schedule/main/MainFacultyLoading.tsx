import { useState } from 'react';
import { BookOpen, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import Swal from 'sweetalert2';
import FacultyLoading from './faculty/FacultyLoading';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


// --- We 'export' these types so other files can import and use them ---
export type AssignedInfo = {
    faculty: string;
    time: string;
};

export type FacultyType = {
    id: number;
    name: string;
    expertise: string[];
    availability: { [day: string]: string[] };
    maxSubjects: number; // Max number of subjects they can handle
};

export type Subject = {
    id: number;
    code: string;
    name: string;
    expertise: string;
    assigned: AssignedInfo | null;
};

// --- UPDATED Mock Data ---
// Gigamit na nato ang expertise gikan sa imong lista
const allFaculty: FacultyType[] = [
    { id: 1, name: 'Dr. Evelyn Reed', expertise: ['Software Engineering', 'Software Development', 'Programming'], availability: { 'Monday': ['09:00-11:00', '14:00-16:00'], 'Wednesday': ['10:00-12:00'] }, maxSubjects: 4 },
    { id: 2, name: 'Dr. Samuel Grant', expertise: ['Cyber Security', 'Computer Networks'], availability: { 'Tuesday': ['13:00-15:00'], 'Thursday': ['09:00-11:00'] }, maxSubjects: 4 },
    { id: 3, name: 'Prof. Alisha Chen', expertise: ['HCI', 'Game Development'], availability: { 'Friday': ['11:00-13:00'] }, maxSubjects: 3 },
    { id: 4, name: 'Dr. Ben Carter', expertise: ['Computer Graphics & Vision', 'Programming'], availability: { 'Monday': ['10:00-12:00'], 'Wednesday': ['14:00-16:00'] }, maxSubjects: 4 },
];

// Gi-adjust sad ang expertise sa subjects para motakdo sa bag-ong faculty data
const allSubjects: Subject[] = [
    { id: 1, code: 'CS101', name: 'Introduction to Programming', expertise: 'Programming', assigned: null },
    { id: 2, code: 'CS205', name: 'Data Structures and Algorithms', expertise: 'Programming', assigned: null },
    { id: 3, code: 'SE301', name: 'Agile Development', expertise: 'Software Engineering', assigned: { faculty: 'Dr. Evelyn Reed', time: 'Monday 09:00-11:00' } },
    { id: 4, code: 'CS402', name: 'Information Security', expertise: 'Cyber Security', assigned: null },
    { id: 5, code: 'NT201', name: 'Fundamentals of Computer Networks', expertise: 'Computer Networks', assigned: null },
    { id: 6, code: 'GD303', name: 'Intro to Game Design', expertise: 'Game Development', assigned: null },
    { id: 7, code: 'HCI250', name: 'UI/UX Principles', expertise: 'HCI', assigned: null },
];


const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


function MainFacultyLoading() {
    const [faculty] = useState<FacultyType[]>(allFaculty);
    const [subjects, setSubjects] = useState<Subject[]>(allSubjects);
    const [selectedFaculty, setSelectedFaculty] = useState<FacultyType | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [assignmentDetails, setAssignmentDetails] = useState({ day: '', startTime: '', endTime: '' });
    const [errors, setErrors] = useState({ day: '', startTime: '', endTime: '' });

    const validateDetails = () => {
        const newErrors = { day: '', startTime: '', endTime: '' };
        let isValid = true;

        if (!assignmentDetails.day) {
            newErrors.day = 'Day is required.';
            isValid = false;
        }
        if (!assignmentDetails.startTime) {
            newErrors.startTime = 'Start time is required.';
            isValid = false;
        }
        if (!assignmentDetails.endTime) {
            newErrors.endTime = 'End time is required.';
            isValid = false;
        }
        
        if (assignmentDetails.startTime && assignmentDetails.endTime && assignmentDetails.startTime >= assignmentDetails.endTime) {
            newErrors.endTime = 'End time must be after start time.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleAssign = () => {
        if (!validateDetails()) {
            return;
        }

        if (selectedFaculty && selectedSubject) {
            const assignedCount = subjects.filter(s => s.assigned?.faculty === selectedFaculty.name).length;
            if (assignedCount >= selectedFaculty.maxSubjects) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Maximum Load Reached',
                    text: `${selectedFaculty.name} has already been assigned the maximum number of subjects (${selectedFaculty.maxSubjects}).`,
                    confirmButtonColor: '#4f46e5',
                });
                return;
            }
            
            const newStartTime = assignmentDetails.startTime;
            const newEndTime = assignmentDetails.endTime;
            const newDay = assignmentDetails.day;

            const facultySubjects = subjects.filter(s => s.assigned?.faculty === selectedFaculty.name);

            for (const assignedSub of facultySubjects) {
                if (assignedSub.assigned) {
                    const [assignedDay, timeRange] = assignedSub.assigned.time.split(' ');
                    const [assignedStartTime, assignedEndTime] = timeRange.split('-');

                    if (assignedDay === newDay) {
                        if (newStartTime < assignedEndTime && assignedStartTime < newEndTime) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Schedule Conflict Detected',
                                html:
                                    `The selected time slot conflicts with an existing class:<br/><br/>` +
                                    `<b>${assignedSub.code} - ${assignedSub.name}</b><br/>` +
                                    `Scheduled on ${assignedDay} from ${assignedStartTime} to ${assignedEndTime}.`,
                                confirmButtonColor: '#4f46e5',
                                confirmButtonText: 'Okay'
                            });
                            return;
                        }
                    }
                }
            }

            setSubjects(subjects.map(s =>
                s.id === selectedSubject.id
                    ? { ...s, assigned: { faculty: selectedFaculty.name, time: `${assignmentDetails.day} ${assignmentDetails.startTime}-${assignmentDetails.endTime}` } }
                    : s
            ));
            
            closeModal();
            setSelectedFaculty(null);
            setSelectedSubject(null);
            setAssignmentDetails({ day: '', startTime: '', endTime: '' });
        }
    };

    const handleUnassign = (subjectId: number) => {
        setSubjects(subjects.map(s =>
            s.id === subjectId ? { ...s, assigned: null } : s
        ));
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setErrors({ day: '', startTime: '', endTime: '' });
    };

    const modalVariants: Variants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 }
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 min-h-screen">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800">Faculty Loading</h1>
                <p className="text-gray-500 mt-1">Assign subjects to faculty based on expertise and availability.</p>
            </header>

            <FacultyLoading
                faculty={faculty}
                subjects={subjects}
                selectedFaculty={selectedFaculty}
                setSelectedFaculty={setSelectedFaculty}
                setSelectedSubject={setSelectedSubject}
                setIsModalOpen={setIsModalOpen}
                onUnassign={handleUnassign}
            />

            <AnimatePresence>
                {isModalOpen && selectedFaculty && selectedSubject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4"
                    >
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-800">Assign Time Slot</h3>
                                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                            </div>
                            <div>
                                <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                                    <p className="mb-2 font-semibold flex items-center"><User className="inline mr-2 text-indigo-500" />{selectedFaculty.name}</p>
                                    <p className="font-semibold flex items-center"><BookOpen className="inline mr-2 text-purple-500" />{selectedSubject.name}</p>
                                </div>
                                
                                <div className="space-y-4">
                                    <div >
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                                        <Select
                                            value={assignmentDetails.day}
                                            onValueChange={(value) => {
                                                setAssignmentDetails({ ...assignmentDetails, day: value });
                                                if (errors.day) setErrors({ ...errors, day: '' });
                                            }}
                                        >
                                            <SelectTrigger className={errors.day ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Select a day" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {days.map(d => (
                                                    <SelectItem key={d} value={d}>{d}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.day && <p className="text-red-500 text-xs mt-1">{errors.day}</p>}
                                    </div>
                                    
                                    <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                        <Input
                                            type="time"
                                            value={assignmentDetails.startTime}
                                            onChange={(e) => {
                                                setAssignmentDetails({ ...assignmentDetails, startTime: e.target.value });
                                                if (errors.startTime || errors.endTime) {
                                                    setErrors({ ...errors, startTime: '', endTime: '' });
                                                }
                                            }}
                                            className={`block w-full p-2.5 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition ${errors.startTime ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>}
                                    </div>

                                    <div >
                                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                        <Input
                                            type="time"
                                            value={assignmentDetails.endTime}
                                            onChange={(e) => {
                                                setAssignmentDetails({ ...assignmentDetails, endTime: e.target.value });
                                                if (errors.endTime) {
                                                    setErrors({ ...errors, endTime: '' });
                                                }
                                            }}
                                            className={`block w-full p-2.5 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition ${errors.endTime ? 'border-red-500' : 'border-gray-300'}`}
                                       /> 
                                        {errors.endTime && <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>}
                                    </div>
                                </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-8">
                                    <Button onClick={closeModal} className="px-5 py-2.5 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">Cancel</Button>
                                    <Button onClick={handleAssign} className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">Confirm Assignment</Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default MainFacultyLoading;