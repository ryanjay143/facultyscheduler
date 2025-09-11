import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Printer, Download, BarChart3, Calendar, FileText, User } from 'lucide-react';

// --- MOCK DATA SIMULATING POST-ASSIGNMENT STATE ---
// In a real app, this data would be fetched or generated based on your database.

const facultyData = [
    { id: 1, name: "Dr. Evelyn Reed", department: "Computer Science" },
    { id: 2, name: "Dr. Samuel Grant", department: "Data Science" },
    { id: 3, name: "Prof. Alisha Chen", department: "Networking" },
    { id: 4, name: "Dr. Ben Carter", department: "Web Development" },
];

const assignedSubjects = [
    { id: 1, code: 'CS101', name: 'Introduction to Programming', units: 3, assignedTo: 1, schedule: { day: 'Monday', time: '09:00-11:00' } },
    { id: 2, code: 'CS205', name: 'Data Structures', units: 3, assignedTo: 1, schedule: { day: 'Wednesday', time: '10:00-12:00' } },
    { id: 3, code: 'DS301', name: 'Machine Learning', units: 4, assignedTo: 2, schedule: { day: 'Tuesday', time: '13:00-15:00' } },
    { id: 4, code: 'DB402', name: 'Advanced Databases', units: 4, assignedTo: 2, schedule: { day: 'Thursday', time: '09:00-11:00' } },
    { id: 5, code: 'NT201', name: 'Computer Networks', units: 3, assignedTo: 3, schedule: { day: 'Friday', time: '11:00-13:00' } },
    { id: 6, code: 'WD303', name: 'Modern Web Apps', units: 3, assignedTo: 4, schedule: { day: 'Monday', time: '14:00-16:00' } },
    { id: 7, code: 'AI401', name: 'Advanced AI', units: 4, assignedTo: 1, schedule: { day: 'Monday', time: '11:00-13:00' } },
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// --- MAIN REPORTS PAGE COMPONENT ---
function ReportsPage() {
    const [activeTab, setActiveTab] = useState('loading');

    const tabContentVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-screen">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800">Generate Reports</h1>
                <p className="text-gray-500 mt-1">View and export faculty loading, schedules, and workloads.</p>
            </header>

            {/* --- Tab Navigation --- */}
            <div className="flex border-b border-gray-200 mb-8">
                <TabButton id="loading" activeTab={activeTab} setActiveTab={setActiveTab} icon={<FileText />}>Faculty Loading</TabButton>
                <TabButton id="schedules" activeTab={activeTab} setActiveTab={setActiveTab} icon={<Calendar />}>Schedules</TabButton>
                <TabButton id="workloads" activeTab={activeTab} setActiveTab={setActiveTab} icon={<BarChart3 />}>Workloads</TabButton>
            </div>

            {/* --- Tab Content --- */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    variants={tabContentVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'loading' && <FacultyLoadingReport />}
                    {activeTab === 'schedules' && <FacultySchedulesView />}
                    {activeTab === 'workloads' && <FacultyWorkloadsView />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}


// --- INDIVIDUAL REPORT COMPONENTS ---

const FacultyLoadingReport = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
        <ReportHeader title="Faculty Loading Master Report" />
        <div className="rounded-md border overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50">
                        <TableHead>Subject Code</TableHead>
                        <TableHead>Subject Name</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Schedule</TableHead>
                        <TableHead className="text-center">Units</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {assignedSubjects.map(subject => {
                        const faculty = facultyData.find(f => f.id === subject.assignedTo);
                        return (
                            <TableRow key={subject.id} className="hover:bg-gray-50">
                                <TableCell className="font-semibold text-gray-800">{subject.code}</TableCell>
                                <TableCell>{subject.name}</TableCell>
                                <TableCell>{faculty?.name || 'Unassigned'}</TableCell>
                                <TableCell>{`${subject.schedule.day}, ${subject.schedule.time}`}</TableCell>
                                <TableCell className="text-center">{subject.units}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    </div>
);

const FacultySchedulesView = () => {
    const [selectedFacultyId, setSelectedFacultyId] = useState(facultyData[0]?.id.toString() || '');

    const facultySchedule = useMemo(() => {
        return assignedSubjects.filter(s => s.assignedTo.toString() === selectedFacultyId);
    }, [selectedFacultyId]);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
            <ReportHeader title="Faculty Schedules" controls={
                <Select value={selectedFacultyId} onValueChange={setSelectedFacultyId}>
                    <SelectTrigger className="w-full sm:w-72">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        <SelectValue placeholder="Select a faculty member..." />
                    </SelectTrigger>
                    <SelectContent>
                        {facultyData.map(f => (
                            <SelectItem key={f.id} value={f.id.toString()}>{f.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            }/>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6 border rounded-lg p-4 bg-gray-50/50">
                {daysOfWeek.map(day => (
                    <div key={day}>
                        <h3 className="font-bold text-center text-gray-700 mb-3 pb-2 border-b-2">{day}</h3>
                        <div className="space-y-3 min-h-[100px]">
                            {facultySchedule.filter(s => s.schedule.day === day).map(s => (
                                <div key={s.id} className="bg-purple-100 text-purple-800 p-3 rounded-lg shadow-sm text-sm">
                                    <p className="font-bold">{s.code}</p>
                                    <p className="text-xs">{s.name}</p>
                                    <p className="font-mono text-xs mt-1">{s.schedule.time}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const FacultyWorkloadsView = () => {
    const workloads = useMemo(() => {
        const loads = new Map<number, number>();
        assignedSubjects.forEach(subject => {
            loads.set(subject.assignedTo, (loads.get(subject.assignedTo) || 0) + subject.units);
        });
        return facultyData.map(f => ({ ...f, totalUnits: loads.get(f.id) || 0 }));
    }, []);

    const MAX_UNITS = 18; // Standard maximum load for visualization

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
            <ReportHeader title="Faculty Workload Overview" />
            <div className="space-y-6 mt-6">
                {workloads.map(faculty => {
                    const loadPercentage = (faculty.totalUnits / MAX_UNITS) * 100;
                    return (
                        <div key={faculty.id}>
                            <div className="flex justify-between items-center mb-1 text-sm">
                                <span className="font-semibold text-gray-800">{faculty.name}</span>
                                <span className="font-mono font-bold text-purple-700">{faculty.totalUnits} Units</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4">
                                <div
                                    className={`rounded-full h-4 transition-all duration-500 ${faculty.totalUnits > 15 ? 'bg-red-500' : 'bg-purple-500'}`}
                                    style={{ width: `${loadPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


// --- HELPER & UI COMPONENTS ---

const TabButton = ({ id, activeTab, setActiveTab, icon, children }: any) => (
    <button
        onClick={() => setActiveTab(id)}
        className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors duration-200
            ${activeTab === id ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-800'}`}
    >
        {icon}
        {children}
    </button>
);

const ReportHeader = ({ title, controls }: { title: string, controls?: React.ReactNode }) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b mb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">{title}</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {controls}
            <Button variant="outline"><Printer className="h-4 w-4 mr-2" />Print</Button>
            <Button><Download className="h-4 w-4 mr-2" />Download</Button>
        </div>
    </div>
);

export default ReportsPage;