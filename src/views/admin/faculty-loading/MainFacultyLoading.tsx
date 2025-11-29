import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Info, Search } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from '../../../plugin/axios';
import { Input } from '@/components/ui/input';
import type { Faculty, Subject } from './type';
import { FacultyCardSkeleton } from './components/card/FacultyCardSkeleton';
import { AssignSubjectDialog } from './components/AssignSubjectDialog';
import { ViewAssignedSubjectsDialog } from './components/ViewAssignedSubjectsDialog';
import { FacultyCard } from './components/card/FacultyCard';


function MainFacultyLoading() {
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
    const [subjectsForModal, setSubjectsForModal] = useState<Subject[]>([]);
    const [facultyQuery, setFacultyQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    
    // State for Assign Subject Dialog
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

    // New State for View Assigned Subjects Dialog
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [facultyForViewModal, setFacultyForViewModal] = useState<Faculty | null>(null);


    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    Swal.fire({ icon: 'warning', title: 'Authentication Error', text: 'You must be logged in.' });
                    setIsLoading(false);
                    return;
                }
                const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

                const [facultyRes, subjectRes] = await Promise.all([
                    axios.get(`/faculties`, axiosConfig),
                    axios.get(`/get-subjects`, axiosConfig)
                ]);

                // --- DEMO DATA FOR ASSIGNED SUBJECTS ---
                // In your real app, this data would come from the API
                const demoAssignedSubjects = [
                    { id: 101, subject_code: 'CS 101', des_title: 'Intro to Programming', schedule: { day: 'MWF', time: '10:00 - 11:00 AM' } },
                    { id: 102, subject_code: 'IT 203', des_title: 'Database Systems', schedule: { day: 'TTH', time: '1:00 - 2:30 PM' } },
                ];
                // --- END DEMO DATA ---

               const mappedFaculties: Faculty[] = facultyRes.data.faculties.map((f: any, index: number) => ({
                    id: f.id,
                    name: f.user.name, 
                    
                    // Siguradoa nga string ni siya
                    department: f.department || "No Department", 

                    // Map expertise
                    expertise: f.expertises ? f.expertises.map((e: any) => e.list_of_expertise) : [],
                    
                    profile_picture: f.profile_picture,

                    // [FIX HERE] - Kuhaa ang exact values gikan sa backend response (f)
                    t_load_units: f.t_load_units ?? 0,    // Mao ni ang Teaching Load
                    deload_units: f.deload_units ?? 0,    // Mao ni ang Deload
                    overload_units: f.overload_units ?? 0,// Mao ni ang Overload

                    // Required fields (Pwede ra i-set as blank/default kung wala sa backend)
                    availability: {},
                    assignedSubjects: index === 0 ? demoAssignedSubjects : [], 
                }));

                setFaculties(mappedFaculties);
                setAllSubjects(subjectRes.data.subject || []);

            } catch (error) {
                console.error("Error fetching data:", error);
                Swal.fire({ icon: 'error', title: 'Fetch Error', text: 'Failed to retrieve data from the server.' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const filteredFaculties = faculties.filter(f =>
        f.name.toLowerCase().includes(facultyQuery.toLowerCase()) ||
        f.expertise.some(e => e.toLowerCase().includes(facultyQuery.toLowerCase()))
    );

    // Handlers for Assigning Subjects
    const handleOpenAssignModal = (faculty: Faculty) => {
        const facultyExpertise = faculty.expertise.map(e => e.toLowerCase().trim());
        if (facultyExpertise.length === 0) {
            setSubjectsForModal(allSubjects);
        } else {
            const relevantSubjects = allSubjects.filter(subject => {
                const subjectText = `${subject.des_title} ${subject.subject_code}`.toLowerCase();
                return facultyExpertise.some(exp => subjectText.includes(exp));
            });
            setSubjectsForModal(relevantSubjects);
        }
        setSelectedFaculty(faculty);
        setIsAssignModalOpen(true);
    };

    const handleCloseAssignModal = () => {
        setIsAssignModalOpen(false);
        setSelectedFaculty(null);
        setSubjectsForModal([]);
    };

    // New Handlers for Viewing Subjects
    const handleOpenViewModal = (faculty: Faculty) => {
        setFacultyForViewModal(faculty);
        setIsViewModalOpen(true);
    };

    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
        setFacultyForViewModal(null);
    };


    const handleAssignSubject = (facultyId: number, subjectId: number, schedules: { type: 'LEC' | 'LAB'; day: string; time: string; roomId: number }[]) => {
        console.log("Assigning Subject:", { facultyId, subjectId, schedules });

        // const _scheduleSummary = schedules
        //     .map(s => `${s.type} ${s.day} at ${s.time}${s.roomId ? ` (Room ${s.roomId})` : ''}`)
        //     .join('; ');

        // Swal.fire({
        //     icon: 'success',
        //     title: 'Assignment Recorded',
        //     text: `Subject ${subjectId} assigned to faculty ${facultyId}: ${scheduleSummary}`,
        //     timer: 2000,
        //     showConfirmButton: false
        // });
    };

    return (
        <>
            <AnimatePresence>
                {isAssignModalOpen && selectedFaculty && (
                    <AssignSubjectDialog
                        isOpen={isAssignModalOpen}
                        onClose={handleCloseAssignModal}
                        faculty={selectedFaculty}
                        availableSubjects={subjectsForModal}
                        onAssign={handleAssignSubject}
                    />
                )}
                {isViewModalOpen && facultyForViewModal && (
                    <ViewAssignedSubjectsDialog
                        isOpen={isViewModalOpen}
                        onClose={handleCloseViewModal}
                        faculty={facultyForViewModal}
                    />
                )}
            </AnimatePresence>
            
            <header className="mb-8 text-start">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Faculty Loading</h1>
                <p className="text-muted-foreground mt-3 ">
                    Assign subjects to faculty based on expertise and availability.
                </p>
            </header>

            <div className="bg-card p-4 md:p-6 rounded-xl shadow-sm border border-border">
                <div className="flex justify-start mb-8">
                    <div className="relative w-full md:max-w-lg">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                        <Input
                            placeholder="Search by faculty name or expertise..."
                            value={facultyQuery}
                            onChange={(e) => setFacultyQuery(e.target.value)}
                            className="pl-12 h-12 rounded-full text-base"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <FacultyCardSkeleton key={index} />
                        ))}
                    </div>
                ) : filteredFaculties.length > 0 ? (
                    <FacultyCard
                        data={filteredFaculties}
                        onAssignClick={handleOpenAssignModal}
                        onViewSubjectsClick={handleOpenViewModal}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground bg-muted/50 rounded-lg border-2 border-dashed">
                        <Info size={40} className="mb-4 text-primary" />
                        <h3 className="text-xl font-semibold text-foreground">No Faculty Found</h3>
                        <p>Your search for "{facultyQuery}" did not match any faculty profiles.</p>
                    </div>
                )}
            </div>
        </>
    );
}

export default MainFacultyLoading;