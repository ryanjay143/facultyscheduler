// src/app/admin/faculty-loading/components/AssignSubjectDialog.tsx

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Sparkles, Loader2, CalendarX2, CheckCircle, SearchX, AlertTriangle, Check } from 'lucide-react';
import { toast } from 'sonner';
import axios from '../../../../plugin/axios';
import type { Faculty, Subject } from '../type';
import { FacultyScheduleDisplay } from './FacultyScheduleDisplay';
import { Label } from '@/components/ui/label';
import type { Room } from '../../room/RoomContainer';

// --- HELPER FUNCTIONS ---
const timeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
};
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// --- COMPONENT ---
interface AssignSubjectDialogProps {
    isOpen: boolean;
    onClose: () => void;
    faculty: Faculty;
    availableSubjects: Subject[];
    onAssign: (facultyId: number, subjectId: number, schedules: { type: 'LEC' | 'LAB', day: string, time: string, roomId: number }[]) => void;
}

interface Schedule { [day: string]: { start: string; end: string }[]; }

export function AssignSubjectDialog({ isOpen, onClose, faculty, availableSubjects = [], onAssign }: AssignSubjectDialogProps) {
    const [step, setStep] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [schedules, setSchedules] = useState({
        lec: { day: '', startTime: '', endTime: '' },
        lab: { day: '', startTime: '', endTime: '' },
    });
    const [selectedRooms, setSelectedRooms] = useState<{ lec: number | null, lab: number | null }>({ lec: null, lab: null });
    const [availableRooms, setAvailableRooms] = useState<{ lec: Room[], lab: Room[] }>({ lec: [], lab: [] });
    const [isLoadingRooms, setIsLoadingRooms] = useState<{ lec: boolean, lab: boolean }>({ lec: false, lab: false });
    const [timeErrors, setTimeErrors] = useState<{ lec: string | null; lab: string | null }>({ lec: null, lab: null });
    const [facultySchedule, setFacultySchedule] = useState<Schedule>({});
    const [isLoadingSchedule, setIsLoadingSchedule] = useState(true);

    const resetAllStates = () => {
        setStep(1);
        setSearchQuery('');
        setSelectedSubject(null);
        setSchedules({ lec: { day: '', startTime: '', endTime: '' }, lab: { day: '', startTime: '', endTime: '' } });
        setSelectedRooms({ lec: null, lab: null });
        setAvailableRooms({ lec: [], lab: [] });
        setTimeErrors({ lec: null, lab: null });
    };

    useEffect(() => {
        if (isOpen && faculty) {
            const fetchAvailability = async () => {
                resetAllStates();
                setIsLoadingSchedule(true);
                const token = localStorage.getItem('accessToken');
                if (!token) { setIsLoadingSchedule(false); return; }
                try {
                    const response = await axios.get(`/faculties/${faculty.id}/availability`, { headers: { Authorization: `Bearer ${token}` } });
                    setFacultySchedule(response.data);
                } catch (error) { setFacultySchedule({}); } 
                finally { setIsLoadingSchedule(false); }
            };
            fetchAvailability();
        }
    }, [isOpen, faculty]);

    useEffect(() => { if (selectedSubject) setStep(2); }, [selectedSubject]);
    
    useEffect(() => {
        const validate = (type: 'lec' | 'lab', units: number) => {
            const { day, startTime, endTime } = schedules[type];
            if (!startTime || !endTime || !selectedSubject || !day || units === 0) return null;
            const startMinutes = timeToMinutes(startTime);
            const endMinutes = timeToMinutes(endTime);
            const requiredDuration = units * 60;
            const actualDuration = endMinutes - startMinutes;
            if (actualDuration !== requiredDuration) return `Duration must be ${units} hour(s).`;
            if (startMinutes >= endMinutes) return "End time must be after start time.";
            const dayAvailability = facultySchedule[day];
            if (!dayAvailability?.length) return "Faculty is not available on this day.";
            const isWithin = dayAvailability.some(slot =>
                startMinutes >= timeToMinutes(slot.start) && endMinutes <= timeToMinutes(slot.end)
            );
            if (!isWithin) return "Time is outside faculty's availability.";
            return null;
        };
        if (selectedSubject) {
            setTimeErrors({
                lec: validate('lec', selectedSubject.lec_units ?? 0),
                lab: validate('lab', selectedSubject.lab_units ?? 0),
            });
        }
    }, [schedules, selectedSubject, facultySchedule]);

    const fetchAvailableRooms = useCallback(async (type: 'lec' | 'lab') => {
        const schedule = schedules[type];
        if (!schedule.day || !schedule.startTime || !schedule.endTime || timeErrors[type]) {
            setAvailableRooms(prev => ({...prev, [type]: []}));
            return;
        }
        
        setIsLoadingRooms(prev => ({ ...prev, [type]: true }));
        const token = localStorage.getItem('accessToken');
        if (!token) { setIsLoadingRooms(prev => ({ ...prev, [type]: false })); return; }

        try {
            const response = await axios.get('/rooms/availability', {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    day: schedule.day,
                    startTime: schedule.startTime,
                    endTime: schedule.endTime,
                    type: type === 'lec' ? 'Lecture' : 'Laboratory',
                }
            });
            setAvailableRooms(prev => ({...prev, [type]: response.data.rooms || []}));
        } catch (error) {
            toast.error(`Failed to fetch available ${type} rooms.`);
            setAvailableRooms(prev => ({...prev, [type]: []}));
        } finally {
            setIsLoadingRooms(prev => ({ ...prev, [type]: false }));
        }
    }, [schedules, timeErrors]);

    const isLecScheduleValid = useMemo(() => (selectedSubject?.lec_units ?? 0) > 0 ? (schedules.lec.day && schedules.lec.startTime && schedules.lec.endTime && !timeErrors.lec) : true, [schedules.lec, timeErrors.lec, selectedSubject]);
    const isLabScheduleValid = useMemo(() => (selectedSubject?.lab_units ?? 0) > 0 ? (schedules.lab.day && schedules.lab.startTime && schedules.lab.endTime && !timeErrors.lab) : true, [schedules.lab, timeErrors.lab, selectedSubject]);

    useEffect(() => { if (isLecScheduleValid && (selectedSubject?.lec_units ?? 0) > 0) fetchAvailableRooms('lec'); }, [isLecScheduleValid, schedules.lec, selectedSubject, fetchAvailableRooms]);
    useEffect(() => { if (isLabScheduleValid && (selectedSubject?.lab_units ?? 0) > 0) fetchAvailableRooms('lab'); }, [isLabScheduleValid, schedules.lab, selectedSubject, fetchAvailableRooms]);

    useEffect(() => {
        if(isLecScheduleValid && isLabScheduleValid && selectedSubject) {
            setStep(3);
        } else if (selectedSubject) {
            setStep(2);
        }
    }, [isLecScheduleValid, isLabScheduleValid, selectedSubject]);

    const filteredSubjects = useMemo(() => {
        if (!searchQuery.trim()) return availableSubjects;
        return availableSubjects.filter(s =>
            s.subject_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.des_title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [availableSubjects, searchQuery]);

    const handleScheduleChange = (type: 'lec' | 'lab', field: string, value: string) => {
        setSchedules(prev => ({ ...prev, [type]: { ...prev[type], [field]: value } }));
        setSelectedRooms(prev => ({...prev, [type]: null}));
    };

    const handleAssignClick = () => {
        if (!selectedSubject) return;
        const schedulesToAssign: { type: 'LEC' | 'LAB', day: string, time: string, roomId: number }[] = [];
        if ((selectedSubject.lec_units ?? 0) > 0) {
            const { day, startTime, endTime } = schedules.lec;
            if (!day || !startTime || !endTime || !selectedRooms.lec) { toast.error("Incomplete lecture schedule or room selection."); return; }
            schedulesToAssign.push({ type: 'LEC', day, time: `${startTime}-${endTime}`, roomId: selectedRooms.lec });
        }
        if ((selectedSubject.lab_units ?? 0) > 0) {
            const { day, startTime, endTime } = schedules.lab;
            if (!day || !startTime || !endTime || !selectedRooms.lab) { toast.error("Incomplete laboratory schedule or room selection."); return; }
            schedulesToAssign.push({ type: 'LAB', day, time: `${startTime}-${endTime}`, roomId: selectedRooms.lab });
        }
        onAssign(faculty.id, selectedSubject.id, schedulesToAssign);
        onClose();
    };

    const isLecRoomSelected = (selectedSubject?.lec_units ?? 0) > 0 ? !!selectedRooms.lec : true;
    const isLabRoomSelected = (selectedSubject?.lab_units ?? 0) > 0 ? !!selectedRooms.lab : true;
    const isButtonDisabled = !selectedSubject || !isLecScheduleValid || !isLabScheduleValid || !isLecRoomSelected || !isLabRoomSelected;
    const hasAvailability = Object.values(facultySchedule).some(slots => slots.length > 0);

    const ScheduleInputGroup = ({ type, units }: { type: 'lec' | 'lab', units: number }) => {
        const timeBounds = useMemo(() => {
            const day = schedules[type].day;
            if (!day || !facultySchedule[day]?.length) return { min: undefined, max: undefined };
            const slots = facultySchedule[day];
            const min = slots.reduce((e, c) => (c.start < e ? c.start : e), slots[0].start);
            const max = slots.reduce((l, c) => (c.end > l ? c.end : l), slots[0].end);
            return { min, max };
        }, [schedules[type].day, facultySchedule]);

        return (
            <div className="pt-4 border-t space-y-4">
                <h4 className="font-semibold text-md text-foreground">{type === 'lec' ? 'Lecture' : 'Laboratory'} Schedule ({units} units)</h4>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <Label htmlFor={`${type}-day`}>Day of Class</Label>
                        <select id={`${type}-day`} value={schedules[type].day} onChange={(e) => handleScheduleChange(type, 'day', e.target.value)} className="w-full mt-1 p-2 border rounded-md bg-background disabled:opacity-50">
                            <option value="" disabled>Select a day</option>
                            {daysOfWeek.map(d => <option key={d} value={d} disabled={!facultySchedule[d]?.length}>{d} {!facultySchedule[d]?.length && '(Unavailable)'}</option>)}
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor={`${type}-start-time`}>Start Time</Label>
                        <Input id={`${type}-start-time`} type="time" value={schedules[type].startTime} onChange={e => handleScheduleChange(type, 'startTime', e.target.value)} className="mt-1" step="1800" min={timeBounds.min} max={timeBounds.max} disabled={!schedules[type].day} />
                    </div>
                    <div>
                        <Label htmlFor={`${type}-end-time`}>End Time</Label>
                        <Input id={`${type}-end-time`} type="time" value={schedules[type].endTime} onChange={e => handleScheduleChange(type, 'endTime', e.target.value)} className="mt-1" step="1800" min={timeBounds.min} max={timeBounds.max} disabled={!schedules[type].day} />
                    </div>
                </div>
                {timeErrors[type] && (
                    <div className="flex items-center gap-2 p-2 bg-destructive/10 border-destructive/30 rounded-lg text-destructive text-sm">
                        <AlertTriangle className="h-4 w-4 flex-shrink-0" /><p>{timeErrors[type]}</p>
                    </div>
                )}
            </div>
        );
    };

    const RoomSelectionGroup = ({ type }: { type: 'lec' | 'lab' }) => (
        <div className="pt-4 border-t space-y-3">
            <h4 className="font-semibold text-md text-foreground">{type === 'lec' ? 'Lecture' : 'Laboratory'} Room</h4>
            {isLoadingRooms[type] ? <div className="flex items-center justify-center h-24"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div> :
             availableRooms[type].length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-2 -mr-2">
                    {availableRooms[type].map(room => (
                        <button key={room.id} onClick={() => setSelectedRooms(prev => ({...prev, [type]: room.id}))}
                            className={`p-2 border rounded-md text-left transition-all relative ${selectedRooms[type] === room.id ? 'bg-primary/10 border-primary shadow-sm' : 'bg-background hover:border-primary/50'}`}>
                            {selectedRooms[type] === room.id && <Check className="h-4 w-4 text-primary absolute top-2 right-2" />}
                            <p className="font-semibold text-sm">{room.roomNumber}</p>
                            <p className="text-xs text-muted-foreground">Cap: {room.capacity ?? '--'}</p>
                        </button>
                    ))}
                </div>
            ) : <p className="text-sm text-muted-foreground text-center py-4">No available rooms for this schedule.</p>}
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-7xl w-[95%] h-[90vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-4 border-b">
                    <DialogTitle className="text-2xl font-bold tracking-tight">Assign Subject to {faculty.name}</DialogTitle>
                    <DialogDescription>Follow the steps below to search, select, and schedule a subject.</DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow overflow-y-auto px-6 py-6">
                    {/* --- STEP 1: SELECT SUBJECT --- */}
                    <div className="bg-muted/40 p-4 rounded-lg flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${selectedSubject ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground'}`}>
                                {selectedSubject ? <Check className="h-5 w-5" /> : '1'}
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">Select a Subject</h3>
                        </div>
                        <div className="flex flex-col flex-grow">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="relative flex-grow"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} /><Input placeholder="Search subjects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-background" /></div>
                                <Button variant="outline"><Sparkles className="mr-2 h-4 w-4" /> Generate</Button>
                            </div>
                            <div className="flex-grow overflow-y-auto space-y-2 -mr-2 pr-2">
                                 {filteredSubjects.length > 0 ? (
                                    filteredSubjects.map(subject => (
                                        <button key={subject.id} onClick={() => setSelectedSubject(subject)} className={`w-full text-left p-3 rounded-md border transition-all duration-200 relative ${selectedSubject?.id === subject.id ? 'bg-primary/10 border-primary shadow-sm' : 'bg-background hover:border-primary/50 hover:bg-primary/5'}`}>
                                            {selectedSubject?.id === subject.id && <CheckCircle className="h-5 w-5 text-primary absolute top-3 right-3" />}
                                            <p className="font-semibold text-foreground pr-6">{subject.subject_code} - {subject.des_title}</p>
                                            <div className="grid grid-cols-3 gap-2 mt-2 text-sm text-muted-foreground">
                                                <span>Total Units: <strong>{subject.total_units ?? 0}</strong></span>
                                                <span>Lec: <strong>{subject.lec_units ?? 0}</strong></span>
                                                <span>Lab: <strong>{subject.lab_units ?? 0}</strong></span>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground rounded-lg bg-background border-2 border-dashed p-4">
                                        <SearchX className="h-10 w-10 mb-3" /><p className="font-semibold">No Subjects Found</p><p className="text-sm">{searchQuery ? `No results for "${searchQuery}".` : "No subjects available."}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- STEP 2: SET SCHEDULE --- */}
                    <div className={`bg-muted/40 p-4 rounded-lg flex flex-col transition-all ${step < 2 && 'opacity-50 pointer-events-none'}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step >= 2 && isLecScheduleValid && isLabScheduleValid ? 'bg-green-500 text-white' : (step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/30 text-muted-foreground')}`}>
                                {step >= 2 && isLecScheduleValid && isLabScheduleValid ? <Check className="h-5 w-5" /> : '2'}
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">Set Schedule</h3>
                        </div>
                        {step >= 2 && (
                            <div className="flex-grow overflow-y-auto -mr-2 pr-2">
                                {isLoadingSchedule ? <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> :
                                !hasAvailability ? (
                                    <div className="flex items-center gap-3 p-3 bg-destructive/10 border-destructive/30 rounded-lg text-destructive">
                                        <CalendarX2 className="h-5 w-5 flex-shrink-0" /><p className="text-sm font-medium">This faculty has no availability set.</p>
                                    </div>
                                ) : (
                                <div className="space-y-4">
                                    <div>
                                        <Label className="block text-sm font-semibold text-foreground mb-2">Faculty's Weekly Availability</Label>
                                        <FacultyScheduleDisplay schedule={facultySchedule} />
                                    </div>
                                    {(selectedSubject?.lec_units ?? 0) > 0 && <ScheduleInputGroup type="lec" units={selectedSubject?.lec_units ?? 0} />}
                                    {(selectedSubject?.lab_units ?? 0) > 0 && <ScheduleInputGroup type="lab" units={selectedSubject?.lab_units ?? 0} />}
                                </div>
                            )}
                            </div>
                        )}
                    </div>
                    
                    {/* --- STEP 3: SELECT ROOM --- */}
                    <div className={`bg-muted/40 p-4 rounded-lg flex flex-col transition-all ${step < 3 && 'opacity-50 pointer-events-none'}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step >= 3 && isLecRoomSelected && isLabRoomSelected ? 'bg-green-500 text-white' : (step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/30 text-muted-foreground')}`}>
                                {step >= 3 && isLecRoomSelected && isLabRoomSelected ? <Check className="h-5 w-5" /> : '3'}
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">Select Room</h3>
                        </div>
                        {step >= 3 && (
                            <div className="flex-grow overflow-y-auto -mr-2 pr-2 space-y-4">
                                {(selectedSubject?.lec_units ?? 0) > 0 && <RoomSelectionGroup type="lec" />}
                                {(selectedSubject?.lab_units ?? 0) > 0 && <RoomSelectionGroup type="lab" />}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="p-6 pt-4 border-t bg-background">
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleAssignClick} disabled={isButtonDisabled}>Assign Subject</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}