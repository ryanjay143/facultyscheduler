// src/components/classroom/YearLevelScheduleView.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Room, ScheduleEntry, Subject } from './RoomContainer';

// --- TYPE DEFINITIONS ---
interface Props {
    yearLevel: number;
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

const YearLevelScheduleView: React.FC<Props> = ({ yearLevel, scheduleData, subjectsData, roomsData }) => {
    const yearLevelSubjectIds = subjectsData.filter(s => s.yearLevel === yearLevel).map(s => s.id);
    const relevantSchedules = scheduleData.filter(sch => yearLevelSubjectIds.includes(sch.subjectId));
    const sections = [...new Set(relevantSchedules.map(s => s.section))].sort();

    if (sections.length === 0) {
        return <div className="text-center text-muted-foreground p-12">No schedule created for this year level.</div>;
    }

    const totalDurationMinutes = (END_HOUR - START_HOUR) * 60;

    return (
        <div className="space-y-8">
            {sections.map(section => {
                const sectionSchedules = relevantSchedules.filter(s => s.section === section);

                return (
                    <Card key={section} className="overflow-hidden">
                        <CardHeader>
                            <CardTitle>Section {section} - {yearLevel}{yearLevel === 1 ? 'st' : yearLevel === 2 ? 'nd' : yearLevel === 3 ? 'rd' : 'th'} Year</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-lg border border-border overflow-hidden">
                                <div className="flex">
                                    {/* Time Gutter with precise alignment */}
                                    <div className="w-20 flex-shrink-0 relative">
                                        <div className="absolute inset-0 bg-muted/30"></div>
                                        {/* Day Header Spacer */}
                                        <div className="h-10 border-b border-border"></div>
                                        {/* Horizontal lines matching the grid */}
                                        {Array.from({ length: TOTAL_HOURS }).map((_, i) => (
                                            <div key={i} className="h-16 border-b border-border"></div>
                                        ))}
                                        {/* Time Labels positioned absolutely over the lines */}
                                        {Array.from({ length: TOTAL_HOURS + 1 }).map((_, i) => {
                                            const hour = START_HOUR + i;
                                            const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
                                            const ampm = hour >= 12 ? 'PM' : 'AM';
                                            return (
                                                <div
                                                    key={hour}
                                                    className="absolute right-3"
                                                    style={{ top: `calc(2.5rem + ${i * 4}rem)` }} // 2.5rem = h-10, 4rem = h-16
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
                                            <div key={day} className="h-10 text-center font-medium text-sm text-foreground border-b border-border flex items-center justify-center bg-muted/30 border-l">
                                                {day}
                                            </div>
                                        ))}

                                        {/* Grid Columns */}
                                        {DAYS.map((day) => (
                                            <div key={day} className="relative border-l border-border bg-background">
                                                {/* Horizontal Lines for visual structure */}
                                                {Array.from({ length: TOTAL_HOURS }).map((_, i) => (
                                                    <div key={i} className="h-16 border-b border-border"></div>
                                                ))}

                                                {/* Schedule Items */}
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
                                                                <div className={`rounded-md p-2 h-full flex flex-col overflow-hidden ${color.bg} ${color.border} ${color.text} border-l-4 transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-lg hover:z-10`}>
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
                );
            })}
        </div>
    );
};

export default YearLevelScheduleView;