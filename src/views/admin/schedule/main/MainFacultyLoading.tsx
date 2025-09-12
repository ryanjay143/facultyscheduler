// src/components/MainFacultyLoading.tsx

import { useState } from 'react';
import { BookOpen, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import FacultyLoading from './faculty/FacultyLoading';

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
};

export type Subject = {
    id: number;
    code: string;
    name: string;
    expertise: string;
    assigned: AssignedInfo | null;
};

// --- Mock Data ---
const allFaculty: FacultyType[] = [
    { id: 1, name: 'Dr. Evelyn Reed', expertise: ['Software Engineering', 'AI', 'Machine Learning'], availability: { 'Monday': ['09:00-11:00', '14:00-16:00'], 'Wednesday': ['10:00-12:00'] } },
    { id: 2, name: 'Dr. Samuel Grant', expertise: ['Data Science', 'Databases', 'Big Data'], availability: { 'Tuesday': ['13:00-15:00'], 'Thursday': ['09:00-11:00'] } },
    { id: 3, name: 'Prof. Alisha Chen', expertise: ['Networking', 'Cybersecurity'], availability: { 'Friday': ['11:00-13:00'] } },
    { id: 4, name: 'Dr. Ben Carter', expertise: ['Web Development', 'UI/UX Design'], availability: { 'Monday': ['10:00-12:00'], 'Wednesday': ['14:00-16:00'] } },
];

const allSubjects: Subject[] = [
    { id: 1, code: 'CS101', name: 'Introduction to Programming', expertise: 'Software Engineering', assigned: null },
    { id: 2, code: 'CS205', name: 'Data Structures and Algorithms', expertise: 'Software Engineering', assigned: null },
    { id: 3, code: 'DS301', name: 'Machine Learning Fundamentals', expertise: 'AI', assigned: { faculty: 'Dr. Evelyn Reed', time: 'Monday 09:00-11:00' } },
    { id: 4, code: 'DB402', name: 'Advanced Database Systems', expertise: 'Databases', assigned: null },
    { id: 5, code: 'NT201', name: 'Computer Networks', expertise: 'Networking', assigned: null },
    { id: 6, code: 'WD303', name: 'Modern Web Applications', expertise: 'Web Development', assigned: null },
];

const timeSlots = ['09:00-11:00', '11:00-13:00', '14:00-16:00'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];


function MainFacultyLoading() {
    const [faculty] = useState<FacultyType[]>(allFaculty);
    const [subjects, setSubjects] = useState<Subject[]>(allSubjects);
    const [selectedFaculty, setSelectedFaculty] = useState<FacultyType | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [assignmentDetails, setAssignmentDetails] = useState({ day: '', time: '' });

    const handleAssign = () => {
        if (selectedFaculty && selectedSubject && assignmentDetails.day && assignmentDetails.time) {
            setSubjects(subjects.map(s =>
                s.id === selectedSubject.id
                    ? { ...s, assigned: { faculty: selectedFaculty.name, time: `${assignmentDetails.day} ${assignmentDetails.time}` } }
                    : s
            ));
            setIsModalOpen(false);
            setSelectedFaculty(null); // Deselect faculty after assignment for a cleaner flow
            setSelectedSubject(null);
            setAssignmentDetails({ day: '', time: '' });
        }
    };


    const modalVariants: Variants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800">Faculty Loading</h1>
                <p className="text-gray-500 mt-1">Assign subjects to faculty based on expertise and availability.</p>
            </header>

            {/* Pass all necessary state and functions, including the new onAddSubject handler */}
            <FacultyLoading
                faculty={faculty}
                subjects={subjects}
                selectedFaculty={selectedFaculty}
                setSelectedFaculty={setSelectedFaculty}
                setSelectedSubject={setSelectedSubject}
                setIsModalOpen={setIsModalOpen}
            />

            {/* The "Assign Time Slot" modal remains here as it's part of the main page's logic */}
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
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                            </div>
                            <div>
                                <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                                    <p className="mb-2 font-semibold flex items-center"><User className="inline mr-2 text-indigo-500" />{selectedFaculty.name}</p>
                                    <p className="font-semibold flex items-center"><BookOpen className="inline mr-2 text-purple-500" />{selectedSubject.name}</p>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                                        <select onChange={(e) => setAssignmentDetails({ ...assignmentDetails, day: e.target.value })} className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition">
                                            <option value="">Select a day</option>
                                            {days.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                        <select onChange={(e) => setAssignmentDetails({ ...assignmentDetails, time: e.target.value })} className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition">
                                            <option value="">Select a time</option>
                                            {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-8">
                                    <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                                    <button onClick={handleAssign} className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">Confirm Assignment</button>
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