// src/components/classroom/modal/ViewScheduleModal.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock } from "lucide-react";
import type { Room, ScheduleEntry } from '../classroom';


type Props = {
    isOpen: boolean;
    onClose: () => void;
    room: Room | null;
    scheduleData: ScheduleEntry[]; // The full list of schedules
}

const formatTime12Hour = (time: string): string => {
    if(!time) return "";
    const [hourStr, minuteStr] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    const minuteFormatted = minute < 10 ? `0${minute}` : minute;
    return `${hour}:${minuteFormatted} ${ampm}`;
};

const ViewScheduleModal: React.FC<Props> = ({ isOpen, onClose, room, scheduleData }) => {
    
    if (!room) return null;

    // Filter schedules relevant to the selected room
    const roomSchedules = scheduleData
        .filter(sch => sch.faculty_loading.room.id === room.id)
        .sort((a, b) => {
            // Sort by day (Mon-Sat order) then start time
            const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            const dayA = daysOfWeek.indexOf(a.faculty_loading.day);
            const dayB = daysOfWeek.indexOf(b.faculty_loading.day);
            if (dayA !== dayB) return dayA - dayB;
            return a.faculty_loading.start_time.localeCompare(b.faculty_loading.start_time);
        });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Schedule for {room.roomNumber} ({room.type})</DialogTitle>
                    <DialogDescription>A list of all classes currently assigned to this room.</DialogDescription>
                </DialogHeader>

                <div className="max-h-[70vh] overflow-y-auto border rounded-lg">
                    {roomSchedules.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            No classes are currently scheduled for this room.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Day</TableHead>
                                    <TableHead className="w-[160px]">Time</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Section</TableHead>
                                    <TableHead>Faculty</TableHead>
                                    <TableHead className="text-center">Type</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {roomSchedules.map((schedule) => {
                                    const fl = schedule.faculty_loading;
                                    return (
                                        <TableRow key={schedule.id}>
                                            <TableCell className="font-semibold">{fl.day}</TableCell>
                                            <TableCell className="flex items-center gap-2 text-sm text-slate-700">
                                                <Clock className="w-3 h-3 text-slate-400" />
                                                {formatTime12Hour(fl.start_time)} - {formatTime12Hour(fl.end_time)}
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-medium">{fl.subject.subject_code}</span>
                                                <span className="text-xs text-muted-foreground block">{fl.subject.des_title}</span>
                                            </TableCell>
                                            <TableCell>{schedule.section}</TableCell>
                                            <TableCell>{fl.faculty.user?.name ?? 'Unassigned'}</TableCell>
                                            <TableCell className="text-center">
                                                <div className="inline-block px-2 py-0.5 text-xs font-bold rounded bg-blue-100 text-blue-800 uppercase">
                                                    {fl.type}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ViewScheduleModal;