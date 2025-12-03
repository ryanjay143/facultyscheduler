// src/components/classroom/ClassSchedule.tsx

import React, { useState, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, Calendar, X, Clock, Loader2, Filter, ChevronRight, Check, User, MapPin, Tag, Download } from "lucide-react"; 
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { FacultyLoadEntry, Room, ScheduleEntry, SectionEntry, Subject } from './classroom'; // CORRECTED PATH


// --- PROPS ---
interface Props {
    scheduleData: ScheduleEntry[];
    subjectsData: Subject[];
    roomsData: Room[];
    facultyLoadingData: FacultyLoadEntry[];
    savedSections: SectionEntry[];
    onAddSchedule: (entry: { 
      yearLevel: number; 
      section: string;
      subjectId: number; 
      roomId: number; 
      day: string;
      startTime: string;
      endTime: string;
      type: 'LEC' | 'LAB' | string;
    }) => Promise<boolean>; 
    onFilterApply: (year: number, section: string) => Promise<{ success: boolean; data: ScheduleEntry[]; message?: string }>; 
}

// --- CONSTANTS ---
const GRID_DAYS = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"]; 
const START_HOUR = 7; 
const END_HOUR = 22; 
const TOTAL_HOURS = END_HOUR - START_HOUR;
const YEAR_LEVELS = [1, 2, 3, 4];

const HEADER_HEIGHT_REM = 3.5; 
const HOUR_HEIGHT_REM = 4.5; 

// Modern Pastel Palette with Strong Accents
const subjectColors = [
    { bg: 'bg-blue-50 hover:bg-blue-100', border: 'border-blue-500', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-800' },
    { bg: 'bg-emerald-50 hover:bg-emerald-100', border: 'border-emerald-500', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-800' },
    { bg: 'bg-violet-50 hover:bg-violet-100', border: 'border-violet-500', text: 'text-violet-700', badge: 'bg-violet-100 text-violet-800' },
    { bg: 'bg-amber-50 hover:bg-amber-100', border: 'border-amber-500', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800' },
    { bg: 'bg-rose-50 hover:bg-rose-100', border: 'border-rose-500', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-800' },
    { bg: 'bg-cyan-50 hover:bg-cyan-100', border: 'border-cyan-500', text: 'text-cyan-700', badge: 'bg-cyan-100 text-cyan-800' },
];

// --- DAY HEADER COLORS ---
const DAY_HEADER_COLORS: Record<string, string> = {
    "Mon": "bg-blue-100/70 text-blue-800",
    "Tues": "bg-emerald-100/70 text-emerald-800",
    "Wed": "bg-violet-100/70 text-violet-800",
    "Thurs": "bg-amber-100/70 text-amber-800",
    "Fri": "bg-rose-100/70 text-rose-800",
    "Sat": "bg-cyan-100/70 text-cyan-800",
};

const getSubjectColor = (subjectId: number) => subjectColors[subjectId % subjectColors.length];

const abbreviateDay = (fullDay: string) => {
    const map: Record<string, string> = {
        "Monday": "Mon", "Tuesday": "Tues", "Wednesday": "Wed", 
        "Thursday": "Thurs", "Friday": "Fri", "Saturday": "Sat"
    };
    return map[fullDay] || fullDay;
};

const formatTime12Hour = (time: string): string => {
    if(!time) return "";
    const cleanTime = time.length > 5 ? time.substring(0, 5) : time;
    const [hourStr, minuteStr] = cleanTime.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    const minuteFormatted = minute < 10 ? `0${minute}` : minute;
    return `${hour}:${minuteFormatted} ${ampm}`;
};

const timeToMinutes = (time: string): number => {
    if(!time) return 0;
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

const getYearLabel = (year: number) => {
    switch(year) {
        case 1: return "1st Year";
        case 2: return "2nd Year";
        case 3: return "3rd Year";
        case 4: return "4th Year";
        default: return `${year}th Year`;
    }
};

// --- COMPONENT ---
const ClassSchedule: React.FC<Props> = ({ 
    scheduleData, subjectsData, facultyLoadingData, savedSections, 
    onAddSchedule, 
    onFilterApply
}) => {
    // APPLIED Filter States (control the grid)
    const [viewYearLevel, setViewYearLevel] = useState<number | null>(null);
    const [viewSection, setViewSection] = useState<string | null>(null);
    const [isFilterLoading, setIsFilterLoading] = useState(false); 

    // PENDING Filter States (control the toolbar selects)
    const [selectedYearLevel, setSelectedYearLevel] = useState<string>("");
    const [selectedSection, setSelectedSection] = useState<string>("");

    // Modal Form States
    const [isClassModalOpen, setIsClassModalOpen] = useState(false);
    const [modalYearLevel, setModalYearLevel] = useState<string>("");
    const [modalSection, setModalSection] = useState<string>("");
    const [isCreatingSection, setIsCreatingSection] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [newClassData, setNewClassData] = useState({
        subjectId: "", roomId: "", day: "", startTime: "", endTime: "", type: ""
    });

    // Details Modal States
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [viewingSchedule, setViewingSchedule] = useState<ScheduleEntry | null>(null);

    // PDF Ref
    const scheduleGridRef = useRef<HTMLDivElement>(null);


    // --- LOGIC ---
    const getSectionsForYear = (year: number) => {
        if (!year) return [];
        
        const fromSchedules = scheduleData
            .filter(sch => sch.year_level === year) 
            .map(s => s.section);
            
        const fromStorage = savedSections
            .filter(s => s.yearLevel === year)
            .map(s => s.section);
            
        return [...new Set([...fromSchedules, ...fromStorage])].sort();
    };

    const viewSections = useMemo(() => {
        const y = selectedYearLevel ? parseInt(selectedYearLevel) : null;
        return y ? getSectionsForYear(y) : [];
    }, [selectedYearLevel, scheduleData, savedSections]);

    const modalSections = useMemo(() => modalYearLevel ? getSectionsForYear(parseInt(modalYearLevel)) : [], [modalYearLevel, scheduleData, savedSections]);

    const validSubjects = useMemo(() => {
        const y = parseInt(modalYearLevel);
        if (!y) return [];
        const loadedSubjectIds = new Set(facultyLoadingData.map(load => load.subject_id));
        return subjectsData.filter(s => s.yearLevel === y && loadedSubjectIds.has(s.id)); 
    }, [modalYearLevel, subjectsData, facultyLoadingData]);

    const selectedSubjectLoads = useMemo(() => {
        if (!newClassData.subjectId) return [];
        return facultyLoadingData.filter(load => load.subject_id.toString() === newClassData.subjectId);
    }, [newClassData.subjectId, facultyLoadingData]);

    const availableRooms = useMemo(() => {
        const uniqueRooms = new Map<number, Room>();
        selectedSubjectLoads.forEach(load => {
            if (!uniqueRooms.has(load.room_id)) uniqueRooms.set(load.room_id, {
                id: load.room.id,
                roomNumber: load.room.roomNumber,
                type: load.room.type,
                capacity: 0, // Placeholder
                status: 0, // Placeholder
                created_at: '',
                updated_at: ''
            });
        });
        return Array.from(uniqueRooms.values());
    }, [selectedSubjectLoads]);

    const availableDays = useMemo(() => {
        if (!newClassData.roomId) return [];
        const roomLoads = selectedSubjectLoads.filter(load => load.room_id.toString() === newClassData.roomId);
        const uniqueDays = new Set(roomLoads.map(load => load.day));
        return Array.from(uniqueDays);
    }, [selectedSubjectLoads, newClassData.roomId]);

    const availableTimeSlots = useMemo(() => {
        if (!newClassData.roomId || !newClassData.day) return [];
        const relevantLoads = selectedSubjectLoads.filter(load => 
            load.room_id.toString() === newClassData.roomId && load.day === newClassData.day 
        );
        return relevantLoads.map(load => {
            const startSimple = load.start_time.substring(0, 5);
            const endSimple = load.end_time.substring(0, 5);
            return {
                value: `${startSimple}|${endSimple}|${load.type}`, 
                display: `${formatTime12Hour(load.start_time)} - ${formatTime12Hour(load.end_time)} (${load.type})`,
                type: load.type
            };
        });
    }, [selectedSubjectLoads, newClassData.roomId, newClassData.day]);


    // -- Handlers (No changes in main handler logic) --
    
    const applyFilterFor = async (year: number | null, section: string | null) => {
        if (year === null || section === null) {
            toast.error("Please select both Year Level and Section.");
            return { success: false };
        }

        setIsFilterLoading(true);

        try {
            const result = await onFilterApply(year, section);

            if (result.success) {
                setViewYearLevel(year);
                setViewSection(section);

                if (result.data.length === 0 && result.message) {
                    toast.info(result.message);
                } else if (result.data.length > 0) {
                    toast.success(`Schedule loaded for ${getYearLabel(year)} - ${section}`);
                }

                return { success: true, data: result.data };
            } else {
                toast.error(result.message || "Failed to load schedule. Please try again.");
                setViewYearLevel(null);
                setViewSection(null);
                return { success: false };
            }
        } catch (error) {
            console.error("Error applying filter:", error);
            setViewYearLevel(null);
            setViewSection(null);
            return { success: false };
        } finally {
            setIsFilterLoading(false);
        }
    };

    const handleApplyFilter = async () => {
        const year = selectedYearLevel ? parseInt(selectedYearLevel) : null;
        const section = selectedSection.trim() || null;
        await applyFilterFor(year, section);
    };

    const handleOpenAddClass = () => {
        setModalYearLevel("");
        setModalSection("");
        setIsCreatingSection(false);
        setNewClassData({ subjectId: "", roomId: "", day: "", startTime: "", endTime: "", type: "" }); 
        setIsClassModalOpen(true);
    };

    const handleYearLevelSelectChange = (v: string) => {
        setSelectedYearLevel(v);
        setSelectedSection(""); 
    };

    const handleSubjectChange = (val: string) => { setNewClassData({ subjectId: val, roomId: "", day: "", startTime: "", endTime: "", type: "" }); };
    const handleRoomChange = (val: string) => { setNewClassData(prev => ({ ...prev, roomId: val, day: "", startTime: "", endTime: "", type: "" })); };
    const handleDayChange = (val: string) => { setNewClassData(prev => ({ ...prev, day: val, startTime: "", endTime: "", type: "" })); };

    const handleTimeSlotChange = (val: string) => {
        if (!val) return;
        const [start, end, type] = val.split('|'); 
        setNewClassData(prev => ({ ...prev, startTime: start, endTime: end, type: type })); 
    };
    
    const currentTimeSlotValue = newClassData.startTime && newClassData.endTime && newClassData.type ? 
        `${newClassData.startTime}|${newClassData.endTime}|${newClassData.type}` : undefined;


    const handleAddClassSubmit = async () => {
        if (!modalYearLevel || !modalSection || !newClassData.subjectId || !newClassData.roomId || !newClassData.day || !newClassData.startTime || !newClassData.type) {
            toast.error("Please fill in all fields.");
            return;
        }

        const targetYear = parseInt(modalYearLevel);
        const targetSection = modalSection.trim();
        const selectedRoomId = parseInt(newClassData.roomId);
        const selectedSubjectId = parseInt(newClassData.subjectId);
        const startMinutes = timeToMinutes(newClassData.startTime);
        const endMinutes = timeToMinutes(newClassData.endTime);
        const classType = newClassData.type;

        let conflictFound = false;
        for (const existing of scheduleData) {
            if (existing.faculty_loading.day !== newClassData.day) continue;
            const exStart = timeToMinutes(existing.faculty_loading.start_time);
            const exEnd = timeToMinutes(existing.faculty_loading.end_time);
            const isOverlap = (startMinutes < exEnd && endMinutes > exStart);
            
            if (isOverlap) {
                if (existing.faculty_loading.room.id === selectedRoomId) { 
                    const conflictRoom = existing.faculty_loading.room.roomNumber;
                    toast.error(`Room Conflict: ${conflictRoom} is occupied by Section ${existing.section}.`);
                    conflictFound = true;
                    break;
                }
                if (existing.year_level === targetYear && existing.section === targetSection) { 
                    toast.error(`Section Conflict: ${targetSection} already has a class at this time.`);
                    conflictFound = true;
                    break;
                }
            }
        }
        if (conflictFound) return;

        setIsSubmitting(true);
        try {
            const success = await onAddSchedule({
                roomId: selectedRoomId,
                subjectId: selectedSubjectId,
                section: targetSection,
                day: newClassData.day,
                startTime: newClassData.startTime,
                endTime: newClassData.endTime,
                yearLevel: targetYear,
                type: classType 
            });

            if (success) {
                const appliedYear = selectedYearLevel ? parseInt(selectedYearLevel) : parseInt(modalYearLevel);
                const appliedSection = selectedSection || modalSection;

                await applyFilterFor(appliedYear, appliedSection);

                setModalYearLevel("");
                setModalSection("");
                setNewClassData({ subjectId: "", roomId: "", day: "", startTime: "", endTime: "", type: "" }); 

                setIsClassModalOpen(false);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * FIX: Collects all unique faculty names associated with the subject in facultyLoadingData
     * and displays them to provide better context in the dropdown.
     */
    const getSubjectDisplayName = (sub: Subject) => {
        // 1. Find ALL loads for this subject
        const loads = facultyLoadingData.filter(l => l.subject_id === sub.id);
        
        // 2. Extract unique faculty names
        const facultyNames = Array.from(new Set(
            loads
                .map(l => l.faculty.user?.name)
                .filter(Boolean) as string[] // Filter out null/undefined/empty strings
        ));
        
        // 3. Format the faculty string
        const facultyString = facultyNames.length > 0 ? ` (${facultyNames.join(', ')})` : ' (Faculty Unassigned)';

        return `${sub.code} - ${sub.name}${facultyString}`; 
    };

    // --- Details Modal Handlers and Lookup ---
    const handleViewDetails = (schedule: ScheduleEntry) => {
        setViewingSchedule(schedule);
        setIsDetailsModalOpen(true);
    };

    const closeDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setViewingSchedule(null);
    };

    // Helper to find full schedule details (Subject, Room, FacultyLoad)
    const getFullScheduleDetails = (schedule: ScheduleEntry | null) => {
        if (!schedule) return null;

        const fl = schedule.faculty_loading;
        const facultyName = fl.faculty.user?.name ?? 'Faculty Not Assigned';
        const subjectCode = fl.subject.subject_code;
        const subjectTitle = fl.subject.des_title;
        const roomNumber = fl.room.roomNumber;
        const type = fl.type; 
        
        return {
            faculty: facultyName,
            subjectCode: subjectCode,
            subjectTitle: subjectTitle,
            roomNumber: roomNumber,
            type: type, 
            day: fl.day,
            startTime: formatTime12Hour(fl.start_time),
            endTime: formatTime12Hour(fl.end_time),
            section: schedule.section
        };
    };
    
    // --- PDF Download Handler (No changes) ---
    const handleDownloadPDF = async () => {
        if (!viewYearLevel || !viewSection) {
            toast.error("Please apply a filter before downloading the schedule.");
            return;
        }

        const input = scheduleGridRef.current; 
        if (!input) {
            toast.error("Schedule content not found for PDF export.");
            return;
        }

        toast.info("Generating PDF... this may take a moment.");

        let container: HTMLElement | null = null;
        try {
            const clone = input.cloneNode(true) as HTMLElement;

            const elements = clone.querySelectorAll<HTMLElement>('[class*="line-clamp"], .overflow-hidden, .truncate');
            elements.forEach(el => {
                Array.from(el.classList).forEach(c => {
                    if (c.startsWith('line-clamp') || c === 'overflow-hidden' || c === 'truncate') el.classList.remove(c);
                });
                el.style.whiteSpace = 'normal';
                el.style.overflow = 'visible';
                el.style.maxHeight = 'none';
            });

            const existingHeader = clone.querySelector('h2.text-2xl');
            if (existingHeader) {
                const headerParent = existingHeader.closest('div');
                if (headerParent && headerParent.parentNode) headerParent.parentNode.removeChild(headerParent);
            }

            container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.top = '0';
            container.style.background = '#ffffff';
            container.style.padding = '16px';
            container.style.boxSizing = 'border-box';

            container.style.width = `${input.offsetWidth}px`;
            clone.style.width = '100%';
            clone.style.boxSizing = 'border-box';

            const headerEl = document.createElement('div');
            headerEl.className = 'flex items-center gap-2 text-slate-800 px-1';
            const badgeEl = document.createElement('div');
            badgeEl.className = 'text-sm py-1 px-3 bg-white border-slate-300 font-medium rounded-md shadow-sm';
            badgeEl.textContent = getYearLabel(viewYearLevel);
            const sep = document.createElement('div');
            sep.className = 'text-slate-400';
            sep.textContent = '›';
            const titleEl = document.createElement('h2');
            titleEl.className = 'text-2xl font-bold tracking-tight';
            titleEl.textContent = String(viewSection);

            headerEl.appendChild(badgeEl);
            headerEl.appendChild(sep);
            headerEl.appendChild(titleEl);

            container.appendChild(headerEl);
            container.appendChild(clone);
            document.body.appendChild(container);

            const canvas = await html2canvas(container, {
                scale: 2,
                useCORS: true,
                logging: false,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

            const pdfWidth = 210;
            const pageHeight = 297;
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= -1) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            const sanitizedYear = getYearLabel(viewYearLevel).replace(/\s+/g, '_');
            const safeSection = String(viewSection).replace(/\s+/g, '_');
            const fileName = `Class_Schedule_${sanitizedYear}_${safeSection}_${new Date().toISOString().substring(0, 10)}.pdf`;
            pdf.save(fileName);
            toast.success("PDF Downloaded successfully!");

        } catch (error) {
            console.error("PDF Generation Error:", error);
            toast.error("Failed to generate PDF. See console for details (install html2canvas and jspdf, then rebuild).");
        } finally {
            try {
                if (container && container.parentNode) container.parentNode.removeChild(container);
            } catch (e) {
                // Ignore cleanup errors
            }
        }
    };
    // --- END PDF Download Handler ---


    // --- RENDER GRID (No changes to the rendering logic) ---
    const renderTable = () => {
        if (viewYearLevel === null || viewSection === null) {
            return (
                <div className="flex flex-col items-center justify-center h-[500px] border border-dashed border-slate-200 rounded-xl bg-slate-50/50 mt-4">
                    <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                        <Calendar className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800">No Schedule Selected</h3>
                    <p className="text-slate-500 text-center max-w-sm mt-2">
                        Select a Year Level and Section above and click 'Apply Filter' to view the class schedule, or create a new one.
                    </p>
                </div>
            );
        }

        const sectionSchedules = scheduleData.filter(sch =>
            sch.year_level === viewYearLevel && sch.section === viewSection
        );

        return (
            <div 
                className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm mt-6 relative select-none"
            >
                <div className="flex">
                    {/* Time Gutter (Left Side) */}
                    <div className="w-20 flex-shrink-0 relative bg-slate-50/80 border-r border-slate-200" 
                         style={{ height: `${HEADER_HEIGHT_REM + (TOTAL_HOURS * HOUR_HEIGHT_REM)}rem` }}>
                        
                        <div className="h-[3.5rem] border-b border-slate-200 bg-slate-100/50"></div>

                        {Array.from({ length: TOTAL_HOURS + 1 }).map((_, i) => {
                            const hour = START_HOUR + i;
                            const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
                            const ampm = hour >= 12 ? 'PM' : 'AM';
                            const topPosition = HEADER_HEIGHT_REM + (i * HOUR_HEIGHT_REM);

                            return (
                                <div 
                                    key={hour} 
                                    className="absolute right-3 text-[11px] font-semibold text-slate-400 translate-y-1.5" 
                                    style={{ top: `${topPosition}rem` }}
                                >
                                    {displayHour}:00 {ampm}
                                </div>
                            );
                        })}
                    </div>
                    
                    {/* Schedule Grid */}
                    <div className="flex-1 grid grid-cols-6 divide-x divide-slate-300">
                        {GRID_DAYS.map(gridDay => {
                            const dayColorClass = DAY_HEADER_COLORS[gridDay] || 'bg-slate-50/50 text-slate-600';
                            return (
                                <div key={gridDay} className="relative bg-white" style={{ height: `${HEADER_HEIGHT_REM + (TOTAL_HOURS * HOUR_HEIGHT_REM)}rem` }}>
                                    
                                    <div className={`h-[3.5rem] flex items-center justify-center font-bold text-sm border-b border-slate-200 uppercase tracking-wider ${dayColorClass}`}>
                                        {gridDay}
                                    </div>

                                    {Array.from({ length: TOTAL_HOURS }).map((_, i) => (
                                        <div key={i} className="absolute w-full border-b border-slate-300"
                                            style={{ top: `${HEADER_HEIGHT_REM + ((i + 1) * HOUR_HEIGHT_REM)}rem` }}></div>
                                    ))}

                                    {sectionSchedules
                                        .filter(schedule => abbreviateDay(schedule.faculty_loading.day) === gridDay)
                                        .map(schedule => {
                                            const fl = schedule.faculty_loading;
                                            const subject = fl.subject;
                                            const room = fl.room;
                                            
                                            if (!subject) return null;
                                            
                                            const facultyName = fl.faculty.user?.name ?? 'Unassigned';
                                            const classType = fl.type;
                                            
                                            const startMinutes = timeToMinutes(fl.start_time); 
                                            const endMinutes = timeToMinutes(fl.end_time); 
                                            const startOffsetMinutes = startMinutes - (START_HOUR * 60);
                                            const durationMinutes = endMinutes - startMinutes;

                                            const topRem = HEADER_HEIGHT_REM + ((startOffsetMinutes / 60) * HOUR_HEIGHT_REM);
                                            const heightRem = (durationMinutes / 60) * HOUR_HEIGHT_REM;
                                            const style = getSubjectColor(fl.subject.id); 
                                            
                                            return (
                                                <div 
                                                    key={schedule.id}
                                                    className="absolute w-full px-1.5 z-10" 
                                                    style={{ top: `${topRem}rem`, height: `${heightRem}rem` }}
                                                    onClick={() => handleViewDetails(schedule)} 
                                                >
                                                    <div className={`rounded-lg p-2.5 h-full flex flex-col justify-between overflow-hidden ${style.bg} ${style.border} border-l-[3px] shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer`}>
                                                        <div>
                                                            {/* Subject Code & Name */}
                                                            <div className={`font-bold text-xs leading-tight mb-0.5 ${style.text}`}>{subject.subject_code}</div>
                                                            <div className="text-[10px] text-slate-600 line-clamp-2 leading-tight">{subject.des_title}</div>
                                                        </div>
                                                        
                                                        {/* Bottom Info: Icons & Data */}
                                                        <div className="mt-1 pt-1.5 border-t border-black/5 flex flex-col justify-end items-start text-[9px] font-semibold text-slate-500 space-y-1">
                                                            
                                                            <div className="flex items-center gap-1.5">
                                                                <User className="w-3 h-3 text-slate-400" /> 
                                                                <span className="text-slate-700 line-clamp-1">{facultyName}</span>
                                                            </div>
                                                            
                                                            <div className="flex items-center gap-1.5">
                                                                <MapPin className="w-3 h-3 text-slate-400" />
                                                                <span className="text-slate-700">{room.roomNumber}</span>
                                                                <span className="bg-white/50 px-1 rounded text-xs font-bold text-slate-700 uppercase">{classType}</span>
                                                            </div>
                                                            
                                                            <div className="flex items-center gap-1.5">
                                                                <Clock className="w-3 h-3 text-slate-400" />
                                                                <span>{formatTime12Hour(fl.start_time)} - {formatTime12Hour(fl.end_time)}</span>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };
    // --- END RENDER GRID ---

    return (
        <div className="space-y-6">
            {/* TOOLBAR */}
            <Card className="border-none shadow-sm bg-slate-50/50">
                <CardContent className="p-4 flex flex-col md:flex-row gap-6 items-end md:items-center justify-between">
                    <div className="w-full md:w-auto flex items-end justify-start gap-4">
                        {/* Filter Year */}
                        <div className="w-44 sm:w-48 space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                                <Filter className="w-3 h-3" /> Filter Year
                            </Label>
                            <Select onValueChange={handleYearLevelSelectChange} value={selectedYearLevel}>
                                <SelectTrigger className="h-10 bg-white border-slate-200 focus:ring-slate-200 transition-shadow">
                                    <SelectValue placeholder="Select Year" />
                                </SelectTrigger>
                                <SelectContent>{YEAR_LEVELS.map(year => <SelectItem key={year} value={year.toString()}>{getYearLabel(year)}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>

                        {/* Filter Section */}
                        <div className="w-44 sm:w-48 space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Filter Section</Label>
                            <Select onValueChange={setSelectedSection} value={selectedSection} disabled={!selectedYearLevel}>
                                <SelectTrigger className="h-10 bg-white border-slate-200 focus:ring-slate-200 transition-shadow">
                                    <SelectValue placeholder="Select Section" />
                                </SelectTrigger>
                                <SelectContent>{viewSections.map(sec => <SelectItem key={sec} value={sec}>{sec}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>

                        {/* Apply Filter Button */}
                        <div className="flex items-end">
                            <Button
                                onClick={handleApplyFilter}
                                disabled={!selectedYearLevel || !selectedSection || isFilterLoading}
                                className="h-10 shadow-md transition-all px-4"
                                title="Apply selected filters to the schedule grid"
                            >
                                {isFilterLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
                                {isFilterLoading ? "Loading..." : "Apply Filter"}
                            </Button>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {/* Download PDF Button */}
                        <Button 
                            onClick={handleDownloadPDF} 
                            disabled={!viewYearLevel || !viewSection}
                            className="h-10 shadow-md transition-all" 
                            variant="outline"
                        >
                            <Download className="mr-2 h-4 w-4" /> Download PDF
                        </Button>

                        {/* Add Class Schedule Button */}
                        <Button onClick={handleOpenAddClass} className="shadow-md hover:shadow-lg transition-all">
                            <Plus className="mr-2 h-4 w-4" /> Add Class Schedule
                        </Button>
                    </div>
                </CardContent>
            </Card>
            
            {/* WRAPPER FOR PDF DOWNLOAD */}
            <div ref={scheduleGridRef} className="w-full">
                
                {/* HEADER - Included in PDF Wrapper */}
                {viewYearLevel && viewSection && (
                    <div className="flex items-center gap-2 text-slate-800 px-1">
                        <Badge variant="outline" className="text-sm py-1 px-3 bg-white border-slate-300 font-medium rounded-md shadow-sm">
                            {getYearLabel(viewYearLevel)}
                        </Badge>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                        <h2 className="text-2xl font-bold tracking-tight">{viewSection}</h2>
                    </div>
                )}

                {/* GRID - Included in PDF Wrapper */}
                {renderTable()}
                
            </div>
            {/* END WRAPPER FOR PDF DOWNLOAD */}


            {/* MODAL (Add Class Schedule) */}
            <Dialog open={isClassModalOpen} onOpenChange={setIsClassModalOpen}>
                <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader><DialogTitle>Add Class Schedule</DialogTitle></DialogHeader>
                    <div className="grid gap-5 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Year Level <span className="text-red-500">*</span></Label>
                                <Select onValueChange={(v) => { setModalYearLevel(v); setModalSection(""); setIsCreatingSection(false); }} value={modalYearLevel}>
                                    <SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger>
                                    <SelectContent>{YEAR_LEVELS.map(year => <SelectItem key={year} value={year.toString()}>{getYearLabel(year)}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Section <span className="text-red-500">*</span></Label>
                                {isCreatingSection ? (
                                    <div className="flex gap-2">
                                        <Input placeholder="New Section Name" value={modalSection} onChange={(e) => setModalSection(e.target.value)} />
                                        <Button size="icon" variant="ghost" onClick={() => { setIsCreatingSection(false); setModalSection(""); }}><X className="h-4 w-4" /></Button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <Select onValueChange={setModalSection} value={modalSection} disabled={!modalYearLevel}>
                                            <SelectTrigger className="flex-1"><SelectValue placeholder="Select Section" /></SelectTrigger>
                                            <SelectContent>{modalSections.map(sec => <SelectItem key={sec} value={sec}>{sec}</SelectItem>)}</SelectContent>
                                        </Select>
                                        <Button size="icon" variant="outline" onClick={() => { setIsCreatingSection(true); setModalSection(""); }} disabled={!modalYearLevel} title="Create New Section"><Plus className="h-4 w-4" /></Button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="border-t border-slate-100"></div>
                        <div className="space-y-2">
                            <Label>Subject (from Faculty Loading) <span className="text-red-500">*</span></Label>
                            <Select onValueChange={handleSubjectChange} value={newClassData.subjectId} disabled={!modalYearLevel}>
                                <SelectTrigger><SelectValue placeholder={!modalYearLevel ? "Select Year First" : "Select Subject"} /></SelectTrigger>
                                <SelectContent>
                                    {validSubjects.length > 0 ? (
                                        validSubjects.map(sub => <SelectItem key={sub.id} value={sub.id.toString()}>{getSubjectDisplayName(sub)}</SelectItem>)
                                    ) : (
                                        <div className="p-2 text-xs text-muted-foreground text-center">{modalYearLevel ? "No subjects assigned in faculty loading" : "Select a year level first"}</div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Room <span className="text-red-500">*</span></Label>
                                <Select onValueChange={handleRoomChange} value={newClassData.roomId} disabled={!newClassData.subjectId}>
                                    <SelectTrigger><SelectValue placeholder="Select Room" /></SelectTrigger>
                                    <SelectContent>
                                        {availableRooms.map(room => <SelectItem key={room.id} value={room.id.toString()}>{room.roomNumber} ({room.type})</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Day <span className="text-red-500">*</span></Label>
                                <Select onValueChange={handleDayChange} value={newClassData.day} disabled={!newClassData.roomId}>
                                    <SelectTrigger><SelectValue placeholder="Select Day" /></SelectTrigger>
                                    <SelectContent>{availableDays.map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Time Slot <span className="text-red-500">*</span></Label>
                            <Select onValueChange={handleTimeSlotChange} value={currentTimeSlotValue} disabled={!newClassData.day}>
                                <SelectTrigger><SelectValue placeholder="Select Time Slot" /></SelectTrigger>
                                <SelectContent>
                                    {availableTimeSlots.map((slot, idx) => (
                                        <SelectItem key={idx} value={slot.value}><div className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" />{slot.display}</div></SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                        <Button onClick={handleAddClassSubmit} disabled={isSubmitting}>
                            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Schedule"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Class Details MODAL */}
            <Dialog open={isDetailsModalOpen} onOpenChange={closeDetailsModal}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>Class Schedule Details</DialogTitle>
                    </DialogHeader>
                    
                    {viewingSchedule && (() => {
                        const details = getFullScheduleDetails(viewingSchedule);
                        return details ? (
                            <div className="grid gap-4 py-4">
                                
                                {/* 1. Prominent Header Block: Subject & Faculty */}
                                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/70 shadow-sm">
                                    <h3 className="text-base font-semibold text-slate-700 flex items-center mb-1">
                                        <User className="w-4 h-4 mr-2 text-blue-600" /> {details.faculty}
                                    </h3>
                                    <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">
                                        {details.subjectCode} - {details.subjectTitle}
                                    </h2>
                                    <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-800 font-medium hover:bg-blue-200">
                                        Section: {details.section}
                                    </Badge>
                                </div>

                                {/* 2. List of Details */}
                                <div className="grid gap-3 pt-2">
                                    <DetailsListItem icon={Calendar} label="Day" value={details.day} />
                                    <DetailsListItem icon={Clock} label="Time Slot" value={`${details.startTime} - ${details.endTime}`} />
                                    <DetailsListItem icon={MapPin} label="Room" value={details.roomNumber} />
                                    <DetailsListItem icon={Tag} label="Type" value={details.type} />
                                </div>
                            </div>
                        ) : <div className="p-4 text-center text-sm text-muted-foreground">Details not found.</div>;
                    })()}

                    <DialogFooter>
                        <DialogClose asChild><Button variant="outline">Close</Button></DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

// --- Helper component for the details modal ---

interface DetailsListItemProps { 
    icon: React.FC<React.SVGProps<SVGSVGElement>>; 
    label: string; 
    value: string | undefined;
}

const DetailsListItem: React.FC<DetailsListItemProps> = ({ icon: Icon, label, value }) => (
    <div className="flex items-center p-3.5 bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="p-2 bg-slate-100 rounded-md mr-4 flex-shrink-0">
            <Icon className="w-4 h-4 text-slate-600" />
        </div>
        <div className="flex-1 min-w-0">
            <span className="text-[10px] font-medium uppercase text-slate-500 block tracking-wider">{label}</span>
            <span className="text-sm font-semibold text-slate-800 break-words leading-tight">{value}</span>
        </div>
    </div>
);


export default ClassSchedule;