// src/components/classroom/YearLevelScheduleView.tsx

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Room, ScheduleEntry, Subject } from './RoomContainer';
// Import types from the central container


interface Props {
    yearLevel: number;
    scheduleData: ScheduleEntry[];
    subjectsData: Subject[];
    roomsData: Room[];
}

const YearLevelScheduleView: React.FC<Props> = ({ yearLevel, scheduleData, subjectsData, roomsData }) => {
    // Find all unique sections for the given year level
    const yearLevelSubjectIds = subjectsData.filter(s => s.yearLevel === yearLevel).map(s => s.id);
    const relevantSchedules = scheduleData.filter(sch => yearLevelSubjectIds.includes(sch.subjectId));
    const sections = [...new Set(relevantSchedules.map(s => s.section))].sort();

    if (sections.length === 0) {
        return <div className="text-center text-muted-foreground p-12">No schedule created for this year level.</div>;
    }

    return (
        <div className="space-y-6">
            {sections.map(section => {
                const sectionSchedules = relevantSchedules.filter(s => s.section === section);
                return (
                    <Card key={section}>
                        <CardHeader>
                            <CardTitle>Section {section} - {yearLevel}{yearLevel === 1 ? 'st' : yearLevel === 2 ? 'nd' : yearLevel === 3 ? 'rd' : 'th'} Year</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-lg border border-border overflow-x-auto">
                                <table className="min-w-full divide-y divide-border">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Subject</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Day</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Time</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Room</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {sectionSchedules.map(schedule => {
                                            const subject = subjectsData.find(s => s.id === schedule.subjectId);
                                            const room = roomsData.find(r => r.id === schedule.roomId);
                                            if (!subject) return null;

                                            return (
                                                <tr key={schedule.scheduleId}>
                                                    <td className="px-4 py-3 font-medium">{subject.code} - {subject.name}</td>
                                                    <td className="px-4 py-3">
                                                        <Badge variant={subject.type === 'Major' ? 'default' : 'secondary'}>
                                                            {subject.type}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-3 text-muted-foreground">{schedule.day}</td>
                                                    <td className="px-4 py-3 text-muted-foreground">{schedule.startTime} - {schedule.endTime}</td>
                                                    <td className="px-4 py-3 text-muted-foreground">{room?.roomNumber || 'N/A'}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export default YearLevelScheduleView;