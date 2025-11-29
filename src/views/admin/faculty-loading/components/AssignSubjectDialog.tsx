// src/app/admin/faculty-loading/components/AssignSubjectDialog.tsx

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, CalendarX2, CheckCircle, SearchX, AlertTriangle, Check, ChevronRight, Filter, Clock } from 'lucide-react';
import { toast } from 'sonner';
import axios from '../../../../plugin/axios'; // Ensure this points to your axios instance
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

const minutesToTime = (minutes: number): string => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

const addMinutesToTime = (timeStr: string, add: number): string => {
    if (!timeStr) return '';
    const total = timeToMinutes(timeStr) + add;
    const bounded = Math.max(0, Math.min(23 * 60 + 59, total));
    return minutesToTime(bounded);
};

const formatTime12 = (t?: string) => {
    if (!t) return '';
    const parts = t.split(':');
    if (parts.length < 2) return t;
    const h24 = parseInt(parts[0] || '0', 10);
    const m = parseInt(parts[1] || '0', 10);
    const ampm = h24 >= 12 ? 'PM' : 'AM';
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
};

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// --- TYPES ---
interface AssignSubjectDialogProps {
    isOpen: boolean;
    onClose: () => void;
    faculty: Faculty;
    availableSubjects: Subject[];
    onAssign: (facultyId: number, subjectId: number, schedules: { type: 'LEC' | 'LAB', day: string, time: string, roomId: number }[]) => void;
}

interface Schedule { [day: string]: { start: string; end: string }[]; }

// --- COMPONENT ---
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
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset state when dialog opens or faculty changes
    const resetAllStates = () => {
        setStep(1);
        setSearchQuery('');
        setSelectedSubject(null);
        setSchedules({ lec: { day: '', startTime: '', endTime: '' }, lab: { day: '', startTime: '', endTime: '' } });
        setSelectedRooms({ lec: null, lab: null });
        setAvailableRooms({ lec: [], lab: [] });
        setTimeErrors({ lec: null, lab: null });
        setIsSubmitting(false);
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

    // Validate Schedules
    useEffect(() => {
        const validate = (type: 'lec' | 'lab', hours: number) => {
            const { day, startTime, endTime } = schedules[type];
            if (!startTime || !endTime || !selectedSubject || !day || hours === 0) return null;
            const startMinutes = timeToMinutes(startTime);
            const endMinutes = timeToMinutes(endTime);
            const requiredDuration = hours * 60;
            const actualDuration = endMinutes - startMinutes;

            if (startMinutes >= endMinutes) return "End time must be after start time.";
            if (actualDuration > requiredDuration) return `Duration cannot exceed ${hours} hour(s).`; 

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
                lec: validate('lec', selectedSubject.total_lec_hrs ?? 0),
                lab: validate('lab', selectedSubject.total_lab_hrs ?? 0),
            });
        }
    }, [schedules, selectedSubject, facultySchedule]);

    // Fetch Rooms when schedule is valid
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
            const response = await axios.get('/rooms/availabilities', {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    day: schedule.day,
                    start_time: schedule.startTime,
                    end_time: schedule.endTime,
                    type: type === 'lec' ? 'Lecture' : 'Laboratory',
                }
            });
            const rooms: any[] = response.data.rooms || [];

            const roomsWithAvail = await Promise.all(rooms.map(async (room) => {
                try {
                    const r = await axios.get(`/rooms/${room.id}/availabilities`, { headers: { Authorization: `Bearer ${token}` } });
                    return { ...room, availabilities: r.data.availabilities || [] };
                } catch (e) {
                    return { ...room, availabilities: [] };
                }
            }));

            setAvailableRooms(prev => ({...prev, [type]: roomsWithAvail}));
        } catch (error) {
            toast.error(`Failed to fetch available ${type} rooms.`);
            setAvailableRooms(prev => ({...prev, [type]: []}));
        } finally {
            setIsLoadingRooms(prev => ({ ...prev, [type]: false }));
        }
    }, [schedules, timeErrors]);

    const isLecScheduleValid = useMemo(() => (selectedSubject?.total_lec_hrs ?? 0) > 0 ? (schedules.lec.day && schedules.lec.startTime && schedules.lec.endTime && !timeErrors.lec) : true, [schedules.lec, timeErrors.lec, selectedSubject]);
    const isLabScheduleValid = useMemo(() => (selectedSubject?.total_lab_hrs ?? 0) > 0 ? (schedules.lab.day && schedules.lab.startTime && schedules.lab.endTime && !timeErrors.lab) : true, [schedules.lab, timeErrors.lab, selectedSubject]);

    useEffect(() => { if (isLecScheduleValid && (selectedSubject?.total_lec_hrs ?? 0) > 0) fetchAvailableRooms('lec'); }, [isLecScheduleValid, schedules.lec, selectedSubject, fetchAvailableRooms]);
    useEffect(() => { if (isLabScheduleValid && (selectedSubject?.total_lab_hrs ?? 0) > 0) fetchAvailableRooms('lab'); }, [isLabScheduleValid, schedules.lab, selectedSubject, fetchAvailableRooms]);
    useEffect(() => { if (!selectedSubject) setStep(1); }, [selectedSubject]);

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

    // --- SUBMIT HANDLER ---
    const handleAssignClick = async () => {
        if (!selectedSubject) return;
        
        const schedulesToAssign: { type: 'LEC' | 'LAB', day: string, time: string, roomId: number }[] = [];
        if ((selectedSubject.total_lec_hrs ?? 0) > 0) {
            const { day, startTime, endTime } = schedules.lec;
            if (!day || !startTime || !endTime || !selectedRooms.lec) { toast.error("Incomplete lecture schedule or room selection."); return; }
            schedulesToAssign.push({ type: 'LEC', day, time: `${startTime}-${endTime}`, roomId: selectedRooms.lec });
        }
        if ((selectedSubject.total_lab_hrs ?? 0) > 0) {
            const { day, startTime, endTime } = schedules.lab;
            if (!day || !startTime || !endTime || !selectedRooms.lab) { toast.error("Incomplete laboratory schedule or room selection."); return; }
            schedulesToAssign.push({ type: 'LAB', day, time: `${startTime}-${endTime}`, roomId: selectedRooms.lab });
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('accessToken');
            const payload = {
                facultyId: faculty.id,
                subjectId: selectedSubject.id,
                schedules: schedulesToAssign
            };

            const response = await axios.post('faculty-loading/assign', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                toast.success(response.data.message || "Subject assigned successfully!");
                onAssign(faculty.id, selectedSubject.id, schedulesToAssign);
                onClose();
            }
        } catch (error: any) {
            console.error("Assignment Error:", error);
            const errorMessage = error.response?.data?.message || "Failed to assign subject. Please check conflicts.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isLecRoomSelected = (selectedSubject?.total_lec_hrs ?? 0) > 0 ? !!selectedRooms.lec : true;
    const isLabRoomSelected = (selectedSubject?.total_lab_hrs ?? 0) > 0 ? !!selectedRooms.lab : true;
    const isButtonDisabled = !selectedSubject || !isLecScheduleValid || !isLabScheduleValid || !isLecRoomSelected || !isLabRoomSelected || isSubmitting;
    const hasAvailability = Object.values(facultySchedule).some(slots => slots.length > 0);

    // --- SUB-COMPONENTS ---

    const ScheduleInputGroup = ({ type, hours }: { type: 'lec' | 'lab', hours: number }) => {
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
                <h4 className="font-semibold text-md text-foreground">{type === 'lec' ? 'Lecture' : 'Laboratory'} Schedule ({hours} hours)</h4>
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
                        <Label htmlFor={`${type}-start-time`} className="text-xs font-semibold text-muted-foreground">Start Time</Label>
                        <div className="relative mt-1">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id={`${type}-start-time`}
                                type="time"
                                value={schedules[type].startTime}
                                onChange={e => handleScheduleChange(type, 'startTime', e.target.value)}
                                className="pl-9"
                                step="1800"
                                min={timeBounds.min}
                                max={timeBounds.max}
                                disabled={!schedules[type].day}
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor={`${type}-end-time`} className="text-xs font-semibold text-muted-foreground">End Time</Label>
                        <div className="relative mt-1">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id={`${type}-end-time`}
                                type="time"
                                value={schedules[type].endTime}
                                onChange={e => handleScheduleChange(type, 'endTime', e.target.value)}
                                className="pl-9"
                                step="1800"
                                min={timeBounds.min}
                                max={timeBounds.max}
                                disabled={!schedules[type].day}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                        {(() => {
                            const formatShort = (t?: string) => {
                                if (!t) return '--:--';
                                const parts = t.split(':');
                                return `${parts[0]?.padStart(2, '0')}:${parts[1]?.padStart(2, '0')}`;
                            };
                            return `Window: ${formatShort(timeBounds.min)} - ${formatShort(timeBounds.max)}`;
                        })()}
                    </p>
                    {(hours ?? 0) > 0 && schedules[type].startTime && (
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setSchedules(prev => ({
                                ...prev,
                                [type]: {
                                    ...prev[type],
                                    endTime: addMinutesToTime(prev[type].startTime, (hours || 0) * 60)
                                }
                            }))}
                        >
                            Auto-fill end (+{hours}h)
                        </Button>
                    )}
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
            {/* Note: Title removed here as it's now handled by the card headers in the main return */}
            {isLoadingRooms[type] ? (
                <div className="flex items-center justify-center h-24"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : (
                (() => {
                    const selDay = schedules[type].day || '';
                    const selStart = schedules[type].startTime || '';
                    const selEnd = schedules[type].endTime || '';
                    const roomsToShow = (selDay && selStart && selEnd)
                        ? availableRooms[type].filter(room => {
                            const expectedType = type === 'lec' ? 'Lecture' : 'Laboratory';
                            if ((room as any).type !== expectedType) return false;
                            const roomAvail: any[] = (room as any).availabilities || [];
                            const availForDay = roomAvail.filter(a => (a.day || '').toString().toLowerCase() === selDay.toString().toLowerCase());
                            return availForDay.some(a => {
                                const aStart = a.start_time ?? a.start ?? '';
                                const aEnd = a.end_time ?? a.end ?? '';
                                if (!aStart || !aEnd) return false;
                                return timeToMinutes(aStart) <= timeToMinutes(selStart) && timeToMinutes(aEnd) >= timeToMinutes(selEnd);
                            });
                        })
                        : availableRooms[type].filter(room => (room as any).type === (type === 'lec' ? 'Lecture' : 'Laboratory'));

                    if (roomsToShow.length === 0) {
                        if (!selDay) return <p className="text-sm text-muted-foreground text-center py-4">Select day to see availability</p>;
                        return <p className="text-sm text-muted-foreground text-center py-4">No available rooms found.</p>;
                    }

                    return (
                        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 -mr-2">
                            {roomsToShow.map(room => {
                                const roomAvail: any[] = (room as any).availabilities || [];
                                const selectedDay = selDay;
                                const availForDay = roomAvail.filter(a => (a.day || '').toString().toLowerCase() === selectedDay.toString().toLowerCase());
                                const availText = availForDay.length > 0 ? availForDay.map(a => `${formatTime12(a.start_time ?? a.start)} - ${formatTime12(a.end_time ?? a.end)}`).join(', ') : 'No data';
                                return (
                                    <button key={room.id} onClick={() => setSelectedRooms(prev => ({...prev, [type]: room.id}))}
                                        className={`p-2 border rounded-md text-left transition-all relative ${selectedRooms[type] === room.id ? 'bg-primary/10 border-primary shadow-sm' : 'bg-background hover:border-primary/50'}`}>
                                        {selectedRooms[type] === room.id && <Check className="h-4 w-4 text-primary absolute top-2 right-2" />}
                                        <p className="font-semibold text-sm">{room.roomNumber}</p>
                                        <p className="text-xs text-muted-foreground">Cap: {room.capacity ?? '--'}</p>
                                        <p className="text-[10px] text-muted-foreground mt-1 truncate">
                                            {schedules[type].day ? `Avail: ${availText}` : 'Select day'}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    );
                })()
            )}
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-7xl w-[96%] h-[92vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-4 border-b bg-gradient-to-r from-indigo-50 to-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-2xl font-bold tracking-tight">Assign Subject</DialogTitle>
                            <DialogDescription>Assign a subject to <span className="font-semibold text-foreground">{faculty.name}</span>.</DialogDescription>
                        </div>
                        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
                            <div className={`h-6 px-2 rounded-full flex items-center gap-1 ${selectedSubject ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                <span className="font-semibold">1</span><span>Select</span>
                            </div>
                            <ChevronRight className="w-4 h-4" />
                            <div className={`h-6 px-2 rounded-full flex items-center gap-1 ${step >= 2 ? (isLecRoomSelected && isLabRoomSelected ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700') : 'bg-muted text-muted-foreground'}`}>
                                <span className="font-semibold">2</span><span>Details</span>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow overflow-y-auto px-6 py-6 bg-muted/30">
                    {/* --- STEP 1: SELECT SUBJECT --- */}
                    <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${selectedSubject ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground'}`}>
                                    {selectedSubject ? <Check className="h-5 w-5" /> : '1'}
                                </div>
                                <h3 className="text-lg font-semibold text-foreground">Select Subject</h3>
                            </div>
                            <Button size="sm" variant="outline" className="hidden md:inline-flex"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
                        </div>
                        <div className="flex flex-col flex-grow">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="relative flex-grow"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} /><Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-background" /></div>
                            </div>
                            <div className="flex-grow overflow-y-auto space-y-2 -mr-2 pr-2">
                                 {filteredSubjects.length > 0 ? (
                                    filteredSubjects.map(subject => (
                                        <button key={subject.id} onClick={() => setSelectedSubject(subject)} className={`w-full text-left p-3 rounded-md border transition-all duration-200 relative ${selectedSubject?.id === subject.id ? 'bg-primary/10 border-primary shadow-sm' : 'bg-background hover:border-primary/50 hover:bg-primary/5'}`}>
                                            {selectedSubject?.id === subject.id && <CheckCircle className="h-5 w-5 text-primary absolute top-3 right-3" />}
                                            <p className="font-semibold text-foreground pr-6">{subject.subject_code}</p>
                                            <p className="text-sm text-muted-foreground truncate mb-2">{subject.des_title}</p>
                                            <div className="flex gap-2 text-xs">
                                                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">Lec: {subject.total_lec_hrs ?? 0}</span>
                                                <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded">Lab: {subject.total_lab_hrs ?? 0}</span>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground rounded-lg bg-background border-2 border-dashed p-4">
                                        <SearchX className="h-8 w-8 mb-2" /><p className="text-sm">No subjects found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- STEP 2: SET SCHEDULE --- */}
                    <div className={`bg-white p-4 rounded-xl border shadow-sm flex flex-col transition-all ${step < 2 && 'opacity-50 pointer-events-none'}`}>
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
                                        <CalendarX2 className="h-5 w-5 flex-shrink-0" /><p className="text-sm font-medium">No faculty availability found.</p>
                                    </div>
                                ) : (
                                <div className="space-y-4">
                                    <FacultyScheduleDisplay schedule={facultySchedule} />
                                    {(selectedSubject?.total_lec_hrs ?? 0) > 0 && <ScheduleInputGroup type="lec" hours={selectedSubject?.total_lec_hrs ?? 0} />}
                                    {(selectedSubject?.total_lab_hrs ?? 0) > 0 && <ScheduleInputGroup type="lab" hours={selectedSubject?.total_lab_hrs ?? 0} />}
                                </div>
                            )}
                            </div>
                        )}
                    </div>

                    {/* --- STEP 3: SELECT ROOM (Split into Cards) --- */}
                    <div className={`flex flex-col gap-4 h-full ${step < 2 && 'opacity-50 pointer-events-none'}`}>
                        
                        {/* 3A: LECTURE ROOM CARD */}
                        {(selectedSubject?.total_lec_hrs ?? 0) > 0 && (
                            <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col flex-1 min-h-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step >= 3 && isLecRoomSelected ? 'bg-green-500 text-white' : (step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/30 text-muted-foreground')}`}>
                                        {step >= 3 && isLecRoomSelected ? <Check className="h-5 w-5" /> : '3'}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground">Lecture Room</h3>
                                        <p className="text-xs text-muted-foreground">Select room for lecture</p>
                                    </div>
                                </div>
                                {step >= 2 && (
                                    <div className="flex-grow overflow-y-auto -mr-2 pr-2">
                                        <RoomSelectionGroup type="lec" />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 3B: LABORATORY ROOM CARD */}
                        {(selectedSubject?.total_lab_hrs ?? 0) > 0 && (
                            <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col flex-1 min-h-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step >= 3 && isLabRoomSelected ? 'bg-green-500 text-white' : (step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/30 text-muted-foreground')}`}>
                                        {step >= 3 && isLabRoomSelected ? <Check className="h-5 w-5" /> : '3'}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground">Laboratory Room</h3>
                                        <p className="text-xs text-muted-foreground">Select room for lab</p>
                                    </div>
                                </div>
                                {step >= 2 && (
                                    <div className="flex-grow overflow-y-auto -mr-2 pr-2">
                                        <RoomSelectionGroup type="lab" />
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* Fallback if no hours */}
                        {((selectedSubject?.total_lec_hrs ?? 0) === 0 && (selectedSubject?.total_lab_hrs ?? 0) === 0) && (
                             <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col items-center justify-center h-full text-muted-foreground">
                                <p>Select a subject to view room options.</p>
                             </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="p-6 pt-4 border-t bg-background">
                    <DialogClose asChild><Button variant="outline" disabled={isSubmitting}>Cancel</Button></DialogClose>
                    <Button onClick={handleAssignClick} disabled={isButtonDisabled}>
                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Assigning...</> : "Assign Subject"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}