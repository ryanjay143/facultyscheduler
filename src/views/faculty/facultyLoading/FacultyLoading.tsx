import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Printer, Book, Clock, Building2, Layers, BarChart, CalendarDays } from 'lucide-react';
import Header from '../layouts/Header'; // Tiyaking tama ang path na ito

// --- TYPE DEFINITIONS (Walang Pagbabago) ---
interface AssignedClass {
  id: number;
  code: string;
  name: string;
  schedule: string;
  room: string;
  program: string;
  units: {
    total: number;
    lec: number;
    lab: number;
  };
  contactHours: number;
}

// --- MOCK DATA (Walang Pagbabago) ---
const facultyLoadData: AssignedClass[] = [
    { id: 1, code: 'CS101', name: 'Introduction to Programming', schedule: 'MW, 09:00-11:00', room: '101', program: 'BSIT', units: { total: 3, lec: 2, lab: 1 }, contactHours: 5 },
    { id: 2, code: 'AI401', name: 'Advanced AI', schedule: 'TTH, 11:00-13:00', room: 'Lab 3', program: 'BSCS', units: { total: 4, lec: 3, lab: 1 }, contactHours: 6 },
    { id: 3, code: 'CS205', name: 'Data Structures & Algorithms', schedule: 'MW, 10:00-12:00', room: '202', program: 'BSCS', units: { total: 3, lec: 2, lab: 1 }, contactHours: 5 },
    { id: 4, code: 'IT302', name: 'Networking Fundamentals', schedule: 'TTH, 14:00-16:00', room: '205', program: 'BSIT', units: { total: 3, lec: 2, lab: 1 }, contactHours: 5 },
    { id: 5, code: 'SE310', name: 'Software Engineering', schedule: 'F, 13:00-16:00', room: '301', program: 'BSIT', units: { total: 3, lec: 3, lab: 0 }, contactHours: 3 },
];

// --- MAIN COMPONENT (Gidesinyo Pag-usab) ---
function FacultyLoading() {
    
    // --- Data Calculation (Walang Pagbabago) ---
    const totalSubjects = facultyLoadData.length;
    const totalUnits = facultyLoadData.reduce((sum, subject) => sum + subject.units.total, 0);
    const totalContactHours = facultyLoadData.reduce((sum, subject) => sum + subject.contactHours, 0);

    const summaryCards = [
        { title: "Total Subjects", value: totalSubjects, icon: Layers, color: "text-blue-600", borderColor: "border-blue-500", bgColor: "bg-blue-100" },
        { title: "Total Units", value: totalUnits, icon: Book, color: "text-purple-600", borderColor: "border-purple-500", bgColor: "bg-purple-100" },
        { title: "Contact Hours / Week", value: totalContactHours, icon: Clock, color: "text-emerald-600", borderColor: "border-emerald-500", bgColor: "bg-emerald-100" },
    ];

    // --- Animation Variants (Walang Pagbabago) ---
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gray-100">
            <Header />

            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                    
                    {/* --- Gipa-ayo nga Page Header --- */}
                    <motion.header 
                        variants={itemVariants} 
                        className="bg-white p-6 rounded-xl shadow-sm border mb-8"
                    >
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">My Teaching Load</h1>
                                <p className="text-gray-500 mt-1">A.Y. 2024-2025, 1st Semester</p>
                            </div>
                            <Button variant="outline" className="flex items-center gap-2 self-start md:self-center bg-white shadow-sm hover:bg-gray-50">
                                <Printer size={16} />
                                Print Load
                            </Button>
                        </div>
                    </motion.header>

                    {/* --- Gidesinyo Pag-usab nga Summary Cards --- */}
                    <motion.div
                        variants={containerVariants}
                        className="grid grid-cols-3 md:grid-cols-1 gap-6 mb-10"
                    >
                        {summaryCards.map((card, index) => (
                            <motion.div 
                                key={index} 
                                variants={itemVariants} 
                                className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${card.borderColor} relative`}
                            >
                                <div className={`absolute top-4 right-4 p-3 rounded-lg ${card.bgColor}`}>
                                    <card.icon className={card.color} size={24} />
                                </div>
                                <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
                                <p className="text-4xl font-bold text-gray-800">{card.value}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                    
                    {/* --- Page Subheader --- */}
                    <motion.h2 variants={itemVariants} className="text-2xl font-bold text-gray-700 mb-6">Assigned Subjects</motion.h2>

                    {/* --- Gidesinyo Pag-usab nga Assigned Subjects List --- */}
                    <motion.div
                        variants={containerVariants}
                        className="grid grid-cols-2 md:grid-cols-1 gap-6"
                    >
                         {facultyLoadData.map((subject) => (
                            <motion.div
                                key={subject.id}
                                variants={itemVariants}
                                whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="bg-white p-6 rounded-xl shadow-sm border border-transparent hover:border-indigo-500"
                            >
                                <div className="flex justify-between items-start gap-4">
                                    {/* Left Side: Course Details */}
                                    <div className="flex-grow">
                                        <p className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full px-3 py-1 mb-2">{subject.code}</p>
                                        <h3 className="text-lg font-bold text-gray-800">{subject.name}</h3>
                                        <p className="text-sm text-gray-500">{subject.program}</p>
                                    </div>
                                    {/* Right Side: Units */}
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-2xl font-bold text-indigo-600">{subject.units.total}</p>
                                        <p className="text-xs text-gray-500">
                                            Units ({subject.units.lec} Lec, {subject.units.lab} Lab)
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t mt-4 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-5">
                                    <DetailItem icon={CalendarDays} label="Schedule" value={subject.schedule} />
                                    <DetailItem icon={Building2} label="Room" value={subject.room} />
                                    <DetailItem icon={Clock} label="Contact Hours" value={`${subject.contactHours} hrs/wk`} />
                                </div>
                            </motion.div>
                         ))}
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
}

// --- Reusable DetailItem Component (Gihimong mas simple) ---
const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
    <div className="flex items-center gap-3 text-sm text-gray-700">
        <Icon className="h-5 w-5 text-gray-400 flex-shrink-0" />
        <div>
            <p className="font-semibold">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
        </div>
    </div>
);

export default FacultyLoading;