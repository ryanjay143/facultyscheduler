// src/components/FacultyLoading/card/FacultyScheduleModal.tsx

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Using the same helpers and constants as MasterScheduleView for consistency
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const timeSlots = ['8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '1:00', '1:30', '2:00', '2:30', '3:00', '3:30', '4:00', '4:30', '5:00'];
const timeToMinutes = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return (hours * 60) + minutes;
};
const scheduleStartTime = timeToMinutes('08:30');
const slotHeight = 3.5; // rem per hour

export function FacultyScheduleModal({ faculty, onClose }: { faculty: any; onClose: () => void; }) {

    const getSubjectPosition = (schedule: string) => {
        try {
            const timePart = schedule.split(' ')[1];
            const [start, end] = timePart.split('-');
            const startMinutes = timeToMinutes(start);
            const endMinutes = timeToMinutes(end);
            const top = ((startMinutes - scheduleStartTime) / 60) * slotHeight;
            const height = ((endMinutes - startMinutes) / 60) * slotHeight;
            return { top: `${top}rem`, height: `${height}rem` };
        } catch (e) {
            return { top: 0, height: '3rem' }; // Fallback
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: -20 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{faculty.name}'s Schedule</h2>
                        <p className="text-sm text-gray-600">Current Load: {faculty.currentLoad}/{faculty.maxLoad} units</p>
                    </div>
                    <Button onClick={onClose} size="icon" variant="ghost"><X size={20} /></Button>
                </div>

                <div className="p-4 flex-1 overflow-auto">
                    <div className="grid grid-cols-6 min-w-[700px] gap-x-2">
                        {/* Time Slot Column */}
                        <div className="relative col-span-1">
                            {timeSlots.map((time, index) => (
                                index % 2 === 0 && <div key={time} className="h-[3.5rem] flex justify-end pr-2 text-sm text-gray-400 border-t border-gray-100">
                                    {time.split(':')[1] === "30" ? "" : `${time.split(':')[0]}:00`}
                                </div>
                            ))}
                        </div>
                        {/* Day Columns */}
                        {daysOfWeek.map(day => (
                            <div key={day} className="col-span-1 relative border-l border-gray-100">
                                <h3 className="text-center font-bold text-gray-800 p-2 sticky top-0 bg-white/80 backdrop-blur-sm z-10">{day}</h3>
                                {faculty.assignedSubjects.filter((s:any) => s.days.includes(day)).map((subject:any) => {
                                    const position = getSubjectPosition(subject.schedule);
                                    return (
                                        <motion.div
                                            key={subject.id}
                                            layout
                                            className="absolute w-[calc(100%-0.5rem)] ml-1 p-2 rounded-lg text-xs leading-tight bg-violet-100 text-violet-800 border border-violet-200"
                                            style={{ top: position.top, height: position.height }}
                                        >
                                            <p className="font-bold">{subject.code}</p>
                                            <p>{subject.title}</p>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}