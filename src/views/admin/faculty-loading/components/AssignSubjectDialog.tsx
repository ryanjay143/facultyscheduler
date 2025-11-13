// src/app/admin/faculty-loading/components/AssignSubjectDialog.tsx

import { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Sparkles, Loader2, CalendarX2, CheckCircle, Pointer, SearchX } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from '../../../../plugin/axios';
import type { Faculty, Subject } from '../type';
import { FacultyScheduleDisplay } from './FacultyScheduleDisplay';

// Helper function to format time to 12-hour AM/PM
const formatTimeTo12Hour = (timeStr: string): string => {
  if (!timeStr || !timeStr.includes(':')) return 'Invalid';
  const [hours, minutes] = timeStr.split(':');
  let h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${minutes} ${ampm}`;
};

interface AssignSubjectDialogProps {
    isOpen: boolean;
    onClose: () => void;
    faculty: Faculty;
    availableSubjects: Subject[];
    onAssign: (facultyId: number, subjectId: number, schedule: { day: string, time: string }) => void;
}

interface Schedule {
    [day: string]: { start: string; end: string }[];
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function AssignSubjectDialog({ isOpen, onClose, faculty, availableSubjects, onAssign }: AssignSubjectDialogProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
    const [day, setDay] = useState('');
    const [time, setTime] = useState('');
    const [facultySchedule, setFacultySchedule] = useState<Schedule>({});
    const [isLoadingSchedule, setIsLoadingSchedule] = useState(true);

    // Effect to fetch faculty availability when the modal opens
    useEffect(() => {
        if (isOpen && faculty) {
            const fetchAvailability = async () => {
                setIsLoadingSchedule(true);
                setDay('');
                setTime('');
                setSelectedSubjectId(null);
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    setIsLoadingSchedule(false);
                    return;
                }
                try {
                    const response = await axios.get(`/faculties/${faculty.id}/availability`, { headers: { Authorization: `Bearer ${token}` } });
                    setFacultySchedule(response.data);
                } catch (error) {
                    console.error("Could not fetch faculty schedule", error);
                    setFacultySchedule({}); 
                } finally {
                    setIsLoadingSchedule(false);
                }
            };
            fetchAvailability();
        }
    }, [isOpen, faculty]);

    // Effect to set the default day and time once the schedule is loaded
    useEffect(() => {
        if (!isLoadingSchedule && Object.keys(facultySchedule).length > 0) {
            const firstAvailableDay = daysOfWeek.find(d => facultySchedule[d]?.length > 0);
            if (firstAvailableDay) {
                setDay(firstAvailableDay);
                const firstTimeSlot = facultySchedule[firstAvailableDay][0];
                if (firstTimeSlot) {
                    setTime(`${firstTimeSlot.start}-${firstTimeSlot.end}`);
                }
            }
        }
    }, [isLoadingSchedule, facultySchedule]);

    const filteredSubjects = useMemo(() => {
        if (!searchQuery.trim()) return availableSubjects;
        return availableSubjects.filter(s =>
            s.subject_code.toLowerCase().includes(searchQuery.toLowerCase()) || 
            s.des_title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [availableSubjects, searchQuery]);

    const timeOptions = useMemo(() => {
        if (!day || !facultySchedule[day]) return [];
        return facultySchedule[day].map(slot => `${slot.start}-${slot.end}`);
    }, [day, facultySchedule]);

    const handleDayChange = (newDay: string) => {
        setDay(newDay);
        const firstSlot = facultySchedule[newDay]?.[0];
        setTime(firstSlot ? `${firstSlot.start}-${firstSlot.end}` : '');
    };

    const handleAssignClick = () => {
        if (!selectedSubjectId || !day || !time) return;
        onAssign(faculty.id, selectedSubjectId, { day, time });
        onClose(); 
    };
    
    const handleClose = () => {
        onClose();
    };

    const handleGenerateSubjects = () => {
        Swal.fire({
            icon: 'info',
            title: 'AI Suggestions',
            text: 'Generating subject recommendations based on faculty expertise...',
            timer: 2500,
            showConfirmButton: false,
        });
    };

    const hasAvailability = Object.values(facultySchedule).some(slots => slots.length > 0);

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-4">
                    <DialogTitle className="text-2xl font-bold tracking-tight">Assign Subject to {faculty.name}</DialogTitle>
                    <DialogDescription>
                        Follow the steps below to search, select, and schedule a subject for this faculty member.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 pb-6 flex-grow overflow-y-auto">
                    {/* Left Column: Subject Selection */}
                    <div className="bg-muted/40 p-4 rounded-lg flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex-shrink-0 bg-primary text-primary-foreground h-8 w-8 rounded-full flex items-center justify-center font-bold text-lg">1</div>
                            <h3 className="text-lg font-semibold text-foreground">Select a Subject</h3>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <Input placeholder="Search subjects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-background" />
                            </div>
                            <Button variant="outline" onClick={handleGenerateSubjects}>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate
                            </Button>
                        </div>

                        <div className="flex-grow overflow-y-auto space-y-2 -mr-2 pr-2">
                            {filteredSubjects.length > 0 ? (
                                filteredSubjects.map(subject => (
                                    <button
                                        key={subject.id}
                                        onClick={() => setSelectedSubjectId(subject.id)}
                                        className={`w-full text-left p-3 rounded-md border transition-all duration-200 relative ${selectedSubjectId === subject.id ? 'bg-primary/10 border-primary shadow-sm' : 'bg-background hover:border-primary/50 hover:bg-primary/5'}`}
                                    >
                                        {selectedSubjectId === subject.id && <CheckCircle className="h-5 w-5 text-primary absolute top-3 right-3" />}
                                        <p className="font-semibold text-foreground pr-6">{subject.subject_code} - {subject.des_title}</p>
                                        <p className="text-sm text-muted-foreground">Units: {subject.total_units}</p>
                                    </button>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground rounded-lg bg-background border-2 border-dashed p-4">
                                    <SearchX className="h-10 w-10 mb-3" />
                                    <p className="font-semibold text-foreground">No Subjects Found</p>
                                    {searchQuery ? (
                                        <p className="text-sm">Your search for "{searchQuery}" did not match any subjects.</p>
                                    ) : (
                                        // --- THIS IS THE MODIFIED LINE ---
                                        <p className="text-sm">There are no relevant subjects available for this faculty or please generate.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Scheduling */}
                    <div className="bg-muted/40 p-4 rounded-lg flex flex-col">
                         <div className="flex items-center gap-3 mb-4">
                            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center font-bold text-lg ${selectedSubjectId ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/30 text-muted-foreground'}`}>2</div>
                            <h3 className="text-lg font-semibold text-foreground">Set Schedule</h3>
                        </div>

                        {!selectedSubjectId ? (
                            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground rounded-lg bg-background border-2 border-dashed">
                                <Pointer className="h-10 w-10 mb-3" />
                                <p className="font-semibold text-foreground">Waiting for Subject Selection</p>
                                <p className="text-sm">Please select a subject from the list on the left.</p>
                            </div>
                        ) : isLoadingSchedule ? (
                            <div className="flex items-center justify-center h-full bg-background rounded-lg"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                        ) : (
                            <div className="space-y-4 flex-grow flex flex-col">
                                <div className="flex-grow">
                                    <label className="block text-sm font-semibold text-foreground mb-2">Faculty's Weekly Availability</label>
                                    <FacultyScheduleDisplay schedule={facultySchedule} />
                                </div>
                                
                                {!hasAvailability ? (
                                    <div className="flex items-center gap-3 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
                                        <CalendarX2 className="h-5 w-5 flex-shrink-0" />
                                        <p className="text-sm font-medium">This faculty has no availability set and cannot be assigned subjects.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                                        <div>
                                            <label htmlFor="day" className="block text-sm font-semibold text-foreground mb-1">Day of Class</label>
                                            <select id="day" value={day} onChange={(e) => handleDayChange(e.target.value)} className="w-full p-2 border rounded-md bg-background disabled:opacity-50">
                                                {daysOfWeek.map(d => {
                                                    const isAvailable = facultySchedule[d]?.length > 0;
                                                    return (<option key={d} value={d} disabled={!isAvailable}>{d} {!isAvailable && '(Unavailable)'}</option>);
                                                })}
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="time" className="block text-sm font-semibold text-foreground mb-1">Time of Class</label>
                                            <select id="time" value={time} onChange={e => setTime(e.target.value)} className="w-full p-2 border rounded-md bg-background disabled:opacity-50" disabled={timeOptions.length === 0}>
                                                {timeOptions.map(t => {
                                                    const [start, end] = t.split('-');
                                                    return (<option key={t} value={t}>{formatTimeTo12Hour(start)} - {formatTimeTo12Hour(end)}</option>);
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="p-6 pt-4 border-t bg-background">
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleAssignClick} disabled={!selectedSubjectId || !day || !time}>
                        Assign Subject
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}