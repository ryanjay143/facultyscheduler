// src/components/classroom/YearLevelScheduleView.tsx

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Room, ScheduleEntry, Subject } from './RoomContainer';

// --- TYPE DEFINITIONS ---
interface Props {
    scheduleData: ScheduleEntry[];
    subjectsData: Subject[];
    roomsData: Room[];
}

// --- CONSTANTS & HELPERS ---

const DAYS = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
const START_HOUR = 7; // 7:00 AM
const END_HOUR = 18; // 6:00 PM
const TOTAL_HOURS = END_HOUR - START_HOUR;

const subjectColors = [
    { bg: 'bg-blue-100', border: 'border-blue-400', text: 'text-blue-800' },
    { bg: 'bg-green-100', border: 'border-green-400', text: 'text-green-800' },
    { bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-800' },
    { bg: 'bg-orange-100', border: 'border-orange-400', text: 'text-orange-800' },
    { bg: 'bg-red-100', border: 'border-red-400', text: 'text-red-800' },
    { bg: 'bg-yellow-100', border: 'border-yellow-400', text: 'text-yellow-800' },
    { bg: 'bg-indigo-100', border: 'border-indigo-400', text: 'text-indigo-800' },
    { bg: 'bg-pink-100', border: 'border-pink-400', text: 'text-pink-800' },
];

const getSubjectColor = (subjectId: number) => {
    return subjectColors[subjectId % subjectColors.length];
};

const formatTime12Hour = (time: string): string => {
    const [hourStr, minuteStr] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    const minuteFormatted = minute < 10 ? `0${minute}` : minute;
    return `${hour}:${minuteFormatted} ${ampm}`;
};

const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};


// --- COMPONENT ---

const YearLevelScheduleView: React.FC<Props> = ({ scheduleData, subjectsData, roomsData }) => {
    const [yearLevel, setYearLevel] = useState<number | null>(null);
    const [section, setSection] = useState<string | null>(null);
    const [showSchedule, setShowSchedule] = useState(false);

    const handleGenerateClick = () => {
        if (yearLevel !== null && section !== null) {
            setShowSchedule(true);
        }
    };

    const handleClear = () => {
        setYearLevel(null);
        setSection(null);
        setShowSchedule(false);
    };

    const handleYearChange = (value: string) => {
        setYearLevel(parseInt(value, 10));
        setSection(null); // Reset section when year level changes
        setShowSchedule(false); // Hide schedule on new selection
    };

    const handleSectionChange = (value: string) => {
        setSection(value);
        setShowSchedule(false); // Hide schedule on new selection
    };

    const availableYearLevels = useMemo(() => {
        return [...new Set(subjectsData.map(s => s.yearLevel))].sort((a, b) => a - b);
    }, [subjectsData]);

    const availableSections = useMemo(() => {
        if (yearLevel === null) return [];
        const yearLevelSubjectIds = subjectsData.filter(s => s.yearLevel === yearLevel).map(s => s.id);
        const relevantSchedules = scheduleData.filter(sch => yearLevelSubjectIds.includes(sch.subjectId));
        return [...new Set(relevantSchedules.map(s => s.section))].sort();
    }, [yearLevel, scheduleData, subjectsData]);

    const renderSchedule = () => {
        if (!showSchedule || yearLevel === null || section === null) {
            return null;
        }

        const yearLevelSubjectIds = subjectsData.filter(s => s.yearLevel === yearLevel).map(s => s.id);
        const sectionSchedules = scheduleData.filter(sch =>
            yearLevelSubjectIds.includes(sch.subjectId) && sch.section === section
        );

        if (sectionSchedules.length === 0) {
            return <div className="text-center text-muted-foreground p-12 mt-8 border-2 border-dashed rounded-lg">No schedule data available for this section.</div>;
        }

        const totalDurationMinutes = (END_HOUR - START_HOUR) * 60;
        const yearSuffix = yearLevel === 1 ? 'st' : yearLevel === 2 ? 'nd' : yearLevel === 3 ? 'rd' : 'th';

        return (
            <div className="space-y-8 mt-8">
                <Card className="overflow-hidden">
                    <CardHeader>
                        <CardTitle>{`${yearLevel}${yearSuffix} Year - Section ${section}`}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="border border-border rounded-lg overflow-hidden">
                            <div className="flex">
                                {/* Time Gutter */}
                                <div className="w-20 flex-shrink-0 relative bg-slate-50 dark:bg-slate-800/50">
                                    <div className="h-12 border-b border-border"></div> {/* Spacer for Day Header */}
                                    {Array.from({ length: TOTAL_HOURS }).map((_, i) => (
                                        <div key={i} className="h-16 border-b border-border"></div>
                                    ))}
                                    {Array.from({ length: TOTAL_HOURS + 1 }).map((_, i) => {
                                        const hour = START_HOUR + i;
                                        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
                                        const ampm = hour >= 12 ? 'PM' : 'AM';
                                        return (
                                            <div
                                                key={hour}
                                                className="absolute right-3"
                                                style={{ top: `calc(3rem + ${i * 4}rem)` }} // 3rem = h-12, 4rem = h-16
                                            >
                                                <span className="text-[11px] text-muted-foreground -translate-y-1/2">
                                                    {displayHour}:00 {ampm}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Schedule Grid */}
                                <div className="flex-1 grid grid-cols-6">
                                    {/* Day Headers */}
                                    {DAYS.map(day => (
                                        <div key={day} className="h-12 text-center font-medium text-sm text-foreground border-b border-border flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 border-l">
                                            {day}
                                        </div>
                                    ))}

                                    {/* Grid Columns */}
                                    {DAYS.map((day) => (
                                        <div key={day} className="relative border-l border-border bg-background">
                                            {Array.from({ length: TOTAL_HOURS }).map((_, i) => (
                                                <div key={i} className="h-16 border-b border-border"></div>
                                            ))}

                                            {sectionSchedules
                                                .filter(schedule => schedule.day === day)
                                                .map(schedule => {
                                                    const subject = subjectsData.find(s => s.id === schedule.subjectId);
                                                    const room = roomsData.find(r => r.id === schedule.roomId);
                                                    if (!subject) return null;

                                                    const startMinutes = timeToMinutes(schedule.startTime);
                                                    const endMinutes = timeToMinutes(schedule.endTime);
                                                    const duration = endMinutes - startMinutes;
                                                    const topPercent = ((startMinutes - (START_HOUR * 60)) / totalDurationMinutes) * 100;
                                                    const heightPercent = (duration / totalDurationMinutes) * 100;
                                                    const color = getSubjectColor(subject.id);

                                                    return (
                                                        <div
                                                            key={schedule.scheduleId}
                                                            className="absolute w-full px-1"
                                                            style={{ top: `${topPercent}%`, height: `${heightPercent}%` }}
                                                        >
                                                            <div className={`rounded-lg p-2 h-full flex flex-col overflow-hidden ${color.bg} ${color.border} ${color.text} border-l-4 shadow transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-lg hover:z-10`}>
                                                                <p className="font-bold text-xs leading-tight truncate">{subject.code}</p>
                                                                <p className="text-[11px] opacity-80 leading-tight flex-1 truncate">{subject.name}</p>
                                                                <div className="mt-1 text-[10px] opacity-90">
                                                                    <p className="truncate">{room?.roomNumber || 'N/A'}</p>
                                                                    <p>{formatTime12Hour(schedule.startTime)} - {formatTime12Hour(schedule.endTime)}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    };

    return (
        <div>
            <Card className="w-full mx-auto">
                <CardHeader>
                    <CardTitle>Generate Section Schedule</CardTitle>
                    <CardDescription>
                        Select a year and section to view the weekly class schedule.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-2">
                            <Label htmlFor="year-level">Select Year Level</Label>
                            <Select onValueChange={handleYearChange} value={yearLevel?.toString() ?? ''}>
                                <SelectTrigger id="year-level">
                                    <SelectValue placeholder="Select a year..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableYearLevels.map(year => (
                                        <SelectItem key={year} value={year.toString()}>
                                            {year}{year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="section">Select Section</Label>
                            <Select onValueChange={handleSectionChange} value={section ?? ''} disabled={yearLevel === null}>
                                <SelectTrigger id="section">
                                    <SelectValue placeholder="Select a section..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableSections.map(sec => (
                                        <SelectItem key={sec} value={sec}>
                                            Section {sec}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleGenerateClick} className="w-full" disabled={yearLevel === null || section === null}>
                            Generate Schedule
                        </Button>
                        <Button onClick={handleClear} variant="destructive" className="w-full" disabled={yearLevel === null && section === null}>
                            Clear
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {showSchedule ? renderSchedule() : (
                <div className="mt-8 flex items-center justify-center text-center text-muted-foreground p-12 border-2 border-dashed rounded-lg">
                    <p>Please select a year level and section, then click "Generate Schedule" to view the timetable.</p>
                </div>
            )}
        </div>
    );
};

export default YearLevelScheduleView;