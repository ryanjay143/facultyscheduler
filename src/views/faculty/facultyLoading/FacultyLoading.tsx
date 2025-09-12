import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Printer, Book, Clock, Building2, Layers, BarChart, CalendarDays } from 'lucide-react';
import Header from '../layouts/Header'; // Ensure this path is correct

// --- TYPE DEFINITIONS for a faculty's assigned class ---
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

// --- MOCK DATA for the logged-in faculty member ---
const facultyLoadData: AssignedClass[] = [
    { id: 1, code: 'CS101', name: 'Introduction to Programming', schedule: 'Monday, 09:00 - 11:00', room: '101', program: 'BSIT', units: { total: 3, lec: 2, lab: 1 }, contactHours: 5 },
    { id: 2, code: 'AI401', name: 'Advanced AI', schedule: 'Monday, 11:00 - 13:00', room: 'Lab 3', program: 'BSCS', units: { total: 4, lec: 3, lab: 1 }, contactHours: 6 },
    { id: 3, code: 'CS205', name: 'Data Structures & Algorithms', schedule: 'Wednesday, 10:00 - 12:00', room: '202', program: 'BSCS', units: { total: 3, lec: 2, lab: 1 }, contactHours: 5 },
    { id: 4, code: 'IT302', name: 'Networking Fundamentals', schedule: 'Wednesday, 14:00 - 16:00', room: '205', program: 'BSIT', units: { total: 3, lec: 2, lab: 1 }, contactHours: 5 },
    { id: 5, code: 'SE310', name: 'Software Engineering', schedule: 'Friday, 13:00 - 15:00', room: '301', program: 'BSIT', units: { total: 3, lec: 3, lab: 0 }, contactHours: 3 },
];

// --- MAIN COMPONENT ---
function FacultyLoading() {
    
    // Calculate totals for the summary cards
    const totalSubjects = facultyLoadData.length;
    const totalUnits = facultyLoadData.reduce((sum, subject) => sum + subject.units.total, 0);
    const totalContactHours = facultyLoadData.reduce((sum, subject) => sum + subject.contactHours, 0);

    const summaryCards = [
        { title: "Total Subjects", value: totalSubjects, icon: Layers, color: "text-blue-500", bgColor: "bg-blue-100" },
        { title: "Total Units", value: totalUnits, icon: Book, color: "text-purple-500", bgColor: "bg-purple-100" },
        { title: "Contact Hours / Week", value: totalContactHours, icon: Clock, color: "text-emerald-500", bgColor: "bg-emerald-100" },
    ];

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
            },
        }),
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50/50">
            <Header />

            {/* Main Content Area - Scrollable */}
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
                {/* --- Page Header --- */}
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800">My Teaching Load</h1>
                        <p className="text-gray-500 mt-1">A.Y. 2024-2025, 1st Semester</p>
                    </div>
                    <Button variant="outline" className="flex items-center gap-2 self-start md:self-center">
                        <Printer size={16} />
                        Print Load
                    </Button>
                </div>

                {/* --- Summary Cards --- */}
                <div className="grid grid-cols-3 md:grid-cols-1 gap-6 mb-8">
                    {summaryCards.map((card, index) => (
                        <div key={index} className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full ${card.bgColor}`}>
                                    <card.icon className={card.color} size={28} />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-800">{card.value}</div>
                                    <div className="text-md text-gray-500">{card.title}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- Assigned Subjects List --- */}
                <div className="grid grid-cols-2 md:grid-cols-1 gap-6">
                     {facultyLoadData.map((subject, index) => (
                        <motion.div
                            key={subject.id}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            custom={index}
                            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
                        >
                            {/* Subject Title */}
                            <div className="flex flex-col md:flex-row justify-between md:items-start">
                                <div>
                                    <p className="text-xs text-purple-600 font-semibold">{subject.code}</p>
                                    <h2 className="text-xl font-bold text-gray-800">{subject.name}</h2>
                                </div>
                                <div className="mt-2 md:mt-0 text-right">
                                    <p className="text-lg font-bold text-gray-800">{subject.units.total}</p>
                                    <p className="text-xs text-gray-500">
                                        Units ({subject.units.lec} Lec, {subject.units.lab} Lab)
                                    </p>
                                </div>
                            </div>

                            {/* Subject Details with Colored Icons */}
                            <div className="border-t mt-4 pt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-md">
                                <DetailItem icon={CalendarDays} label="Schedule" value={subject.schedule} color="text-gray-500" />
                                <DetailItem icon={Building2} label="Room" value={subject.room} color="text-fuchsia-500" />
                                <DetailItem icon={Layers} label="Program" value={subject.program} color="text-blue-500" />
                                <DetailItem icon={BarChart} label="Contact Hours" value={`${subject.contactHours} hrs/week`} color="text-emerald-500" />
                            </div>
                        </motion.div>
                     ))}
                </div>
            </main>
        </div>
    );
}

// --- UPDATED Reusable component to accept a color prop ---
const DetailItem = ({ icon: Icon, label, value, color }: { icon: React.ElementType, label: string, value: string, color: string }) => (
    <div className="flex items-center gap-3 text-gray-600">
        <Icon className={`h-6 w-6 ${color} flex-shrink-0`} />
        <div>
            <p className="text-xs text-gray-400">{label}</p>
            <p className="font-medium">{value}</p>
        </div>
    </div>
);

export default FacultyLoading;