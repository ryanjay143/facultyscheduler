import React, { useMemo, useState, useEffect } from "react";
import axios from '../../../../plugin/axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Loader2 } from "lucide-react";

// --- TYPESCRIPT INTERFACES --- (Same as before)
interface User { id: number; name: string; }
interface Faculty { id: number; user_id: number; designation: string; user: User; }
interface Subject { id: number; subject_code: string; des_title: string; }
interface Room { id: number; roomNumber: string; }

interface FacultyLoading {
    id: number;
    type: 'LEC' | 'LAB' | string;
    day: string;
    start_time: string;
    end_time: string;
    faculty: Faculty;
    subject: Subject;
    room: Room;
}

interface ClassSchedule {
    id: number;
    faculty_loading_id: number;
    year_level: number;
    section: string;
    faculty_loading: FacultyLoading;
}

interface BackendResponse {
    success: boolean;
    classSchedule: ClassSchedule[];
}
// -----------------------------

// --- CONSTANTS ---
const to12Hour = (minutes: number) => {
    const hh = Math.floor(minutes / 60);
    const mm = minutes % 60;
    const period = hh >= 12 ? 'pm' : 'am';
    const displayHour = hh % 12 || 12;
    return `${String(displayHour).padStart(2, '0')}:${String(mm).padStart(2, '0')}${period}`;
};

// **CHANGE 1: Generate 30-minute time slots for better height proportionality**
const generateTimeSlots = (startHour = 7, endHour = 21, intervalMinutes = 30) => {
    const slots: string[] = [];
    // Start from the beginning minute and go until the end minute
    const startMinutes = startHour * 60;
    const endMinutes = endHour * 60; 
    for (let m = startMinutes; m <= endMinutes; m += intervalMinutes) {
        slots.push(to12Hour(m));
    }
    return slots;
};

const TIME_SLOTS = generateTimeSlots(7, 21, 30); // 30-minute slots now

const DAY_FILTERS = [
    { value: "Monday_Thursday", label: "MONDAYS and THURSDAYS", days: ["Monday", "Thursday"] },
    { value: "all", label: "All Days (Unfiltered)", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
    { value: "Monday", label: "Monday Schedule", days: ["Monday"] },
    { value: "Tuesday", label: "Tuesday Schedule", days: ["Tuesday"] },
    { value: "Wednesday", label: "Wednesday Schedule", days: ["Wednesday"] },
    { value: "Thursday", label: "Thursday Schedule", days: ["Thursday"] },
    { value: "Friday", label: "Friday Schedule", days: ["Friday"] },
    { value: "Saturday", label: "Saturday Schedule", days: ["Saturday"] },
];

// --- UTILITY FUNCTIONS ---
const formatTime = (timeString: string): string => {
    try {
        const [hours, minutes] = timeString.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12; 
        return `${displayHours}:${String(minutes).padStart(2, '0')}${period}`;
    } catch (e) {
        return timeString;
    }
};

// --- DATA TRANSFORMATION ---
const transformToScheduleGrid = (data: ClassSchedule[]): { gridData: { [key: string]: { content: React.ReactNode; rowSpan: number } }, coveredKeys: Set<string> } => {
    const gridData: { [key: string]: { content: React.ReactNode; rowSpan: number } } = {};
    const coveredKeys = new Set<string>();

    const timeToMinutes = (hhmm: string) => {
        const [hh, mm] = hhmm.split(':').map(Number);
        return hh * 60 + mm;
    };

    const to24 = (t: string) => {
        const m = t.match(/(\d{1,2}):(\d{2})(am|pm)/i);
        if (!m) return '';
        let hh = parseInt(m[1], 10);
        const mm = m[2];
        const period = m[3].toLowerCase();
        if (period === 'pm' && hh !== 12) hh += 12;
        if (period === 'am' && hh === 12) hh = 0;
        return `${String(hh).padStart(2, '0')}:${mm}`;
    };

    data.forEach(schedule => {
        const loading = schedule.faculty_loading;
        const roomNumber = loading.room.roomNumber;
        const subjectCode = loading.subject.subject_code;
        const facultyName = loading.faculty.user.name;
        const section = schedule.section;
        const classType = loading.type;
        const timePeriod = `${formatTime(loading.start_time)}-${formatTime(loading.end_time)}`;

        const classStartTime24 = loading.start_time.substring(0, 5); // e.g. '08:00'
        const classEndTime24 = loading.end_time.substring(0, 5);

        // Convert class times to minutes
        const classStartMin = timeToMinutes(classStartTime24);
        const classEndMin = timeToMinutes(classEndTime24);

        // **CHANGE 2: Slot interval is now 30 minutes**
        const slotIntervalMin = 30; 

        for (let i = 0; i < TIME_SLOTS.length; i++) {
            const slot = TIME_SLOTS[i];
            const slotStart24 = to24(slot);
            if (!slotStart24) continue;
            const slotStartMin = timeToMinutes(slotStart24);
            const slotEndMin = slotStartMin + slotIntervalMin;

            // Overlap test
            const overlaps = classStartMin < slotEndMin && classEndMin > slotStartMin;
            if (!overlaps) continue;

            // Determine how many consecutive 30-min slots from i it overlaps (for rowspan)
            let span = 1;
            for (let j = i + 1; j < TIME_SLOTS.length; j++) {
                const sStart24 = to24(TIME_SLOTS[j]);
                if (!sStart24) break;
                const sStartMin = timeToMinutes(sStart24);
                const sEndMin = sStartMin + slotIntervalMin;
                const overlapsNext = classStartMin < sEndMin && classEndMin > sStartMin;
                if (overlapsNext) span++; else break;
            }

            // Mark covered keys for the span
            for (let k = 0; k < span; k++) {
                const key = `${roomNumber}_${TIME_SLOTS[i + k]}`;
                if (k === 0) {
                    const gridKey = key;
                    
                    // --- ENHANCED CELL CONTENT STYLE ---
                    const cellContent = (
                        <div className="text-center h-full flex flex-col justify-center p-1.5 bg-green-100/80 border border-green-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                            <span className="font-extrabold uppercase text-sm text-green-800 leading-tight block">
                                {subjectCode} {section}
                            </span>
                            <span className="text-xs font-medium text-gray-700 mt-1 block">
                                {facultyName}
                            </span>
                            <span className="text-xs text-green-700/80 mt-0.5 block">
                                {loading.day} | {timePeriod} | {classType}
                            </span>
                        </div>
                    );
                    // ------------------------------------

                    gridData[gridKey] = { content: cellContent, rowSpan: span };
                } else {
                    coveredKeys.add(key);
                }
            }

            // Once assigned, break so we don't double-assign same class to other starting slots
            break;
        }
    });
    
    return { gridData, coveredKeys };
};


// --- REACT COMPONENT ---
const API_URL = 'get-classSchedule-reports';
const TOKEN_KEY = 'accessToken'; 

export function FacultySchedulesView() {
    const [selectedDayFilter, setSelectedDayFilter] = useState<string>("Monday_Thursday"); 
    const [backendData, setBackendData] = useState<ClassSchedule[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    // Derive unique rooms from the backend data (ordered alphabetically)
    const rooms = useMemo(() => {
        const set = new Set<string>();
        backendData.forEach(s => {
            const rn = s?.faculty_loading?.room?.roomNumber;
            if (rn && rn.toString().trim() !== '') set.add(rn.toString());
        });
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [backendData]);

    // --- Data Fetching ---
    useEffect(() => {
        // ... (data fetching remains the same)
        const fetchData = async () => {
            setIsLoading(true);
            setIsError(false);

            const accessToken = localStorage.getItem(TOKEN_KEY);
            
            if (!accessToken) {
                setIsLoading(false);
                return;
            }
            
            try {
                const response = await axios.get<BackendResponse>(API_URL, {
                    headers: { 'Authorization': `Bearer ${accessToken}`, 'Accept': 'application/json' }
                });

                if (response.data.success && Array.isArray(response.data.classSchedule)) {
                    setBackendData(response.data.classSchedule);
                } else {
                    throw new Error('Invalid data structure');
                }
            } catch (error) {
                console.error("Error fetching class schedule:", error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []); 
    
    // --- Data Transformation & Filtering ---
    
    // Filter the raw data by day FIRST
    const filteredRawData = useMemo(() => {
        const currentFilter = DAY_FILTERS.find(f => f.value === selectedDayFilter);
        const visibleDays = currentFilter ? currentFilter.days : [];
        
        return backendData.filter(schedule => 
            visibleDays.includes(schedule.faculty_loading.day)
        );
    }, [selectedDayFilter, backendData]); 
    
    // Then transform the filtered data to the grid format
    const filteredScheduleData = useMemo(() => {
        return transformToScheduleGrid(filteredRawData);
    }, [filteredRawData]);

    if (isLoading) {
        return (
            <div className="p-10 text-center flex flex-col items-center justify-center text-primary">
                <Loader2 className="h-8 w-8 animate-spin mb-3" />
                <p>Loading class schedules...</p>
            </div>
        );
    }
    
    if (isError) {
        return <div className="p-10 text-center text-destructive border border-destructive/50 rounded-lg">Error loading class schedule data.</div>;
    }


    return (
        <div className="bg-card p-4 md:p-6 rounded-xl shadow-2xl border-2 border-border overflow-x-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-3 md:mb-0">
                    Room Schedule View
                </h2>
                
                {/* Day Selection Filter */}
                <Select value={selectedDayFilter} onValueChange={setSelectedDayFilter}>
                    <SelectTrigger className="w-full md:w-80 border-primary shadow-lg hover:shadow-xl transition-shadow">
                        <Calendar className="h-5 w-5 mr-2 text-primary" />
                        <SelectValue placeholder="Select Day" />
                    </SelectTrigger>
                    <SelectContent>
                        {DAY_FILTERS.map((filter) => (
                            <SelectItem key={filter.value} value={filter.value}>
                                {filter.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            
            <div className="min-w-[1800px] overflow-hidden">
                <Table className="w-full table-fixed border-collapse border-primary/20">
                    <TableHeader className="bg-primary sticky top-0 z-10 shadow-lg">
                        <TableRow>
                            <TableHead className="w-[150px] border-r border-b border-primary-foreground/30 text-center font-extrabold text-primary-foreground text-sm uppercase">
                                Time Slot
                            </TableHead>
                            {rooms.map((room) => (
                                <TableHead key={room} className="w-[150px] border-r border-b border-primary-foreground/30 text-center font-extrabold whitespace-nowrap text-primary-foreground text-sm uppercase">
                                    {room}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    
                    <TableBody>
                        {TIME_SLOTS.map((timeSlot) => (
                            // **CHANGE 3: Reduced row height to h-12 to fit 30-min slots better**
                            <TableRow key={timeSlot} className="h-12 border-b border-gray-200 hover:bg-muted/50 transition-colors duration-200">
                                <TableCell className="w-[150px] border-r border-r-gray-300 align-middle p-2 font-bold text-xs whitespace-pre-line bg-muted/40 text-gray-700 sticky left-0 z-5">
                                    {timeSlot}
                                </TableCell>

                                {/* Schedule Cells (Rooms) */}
                                {rooms.map((room) => {
                                    const key = `${room}_${timeSlot}`;
                                    const entry = filteredScheduleData.gridData[key];

                                    // If this key is covered by a rowspan from a previous row, skip rendering a cell here
                                    if (filteredScheduleData.coveredKeys.has(key)) {
                                        return null;
                                    }

                                    if (entry) {
                                        return (
                                            <TableCell
                                                key={key}
                                                rowSpan={entry.rowSpan}
                                                className="w-[150px] border-r border-r-gray-300 align-middle p-1.5 text-center text-sm"
                                            >
                                                <div className="h-full">
                                                    {entry.content}
                                                </div>
                                            </TableCell>
                                        );
                                    }

                                    return (
                                        <TableCell
                                            key={key}
                                            className="w-[150px] border-r border-r-gray-300 align-top p-1 text-center text-sm border-dashed border-gray-300 bg-background/50"
                                        >
                                            {/* Empty content */}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default FacultySchedulesView;