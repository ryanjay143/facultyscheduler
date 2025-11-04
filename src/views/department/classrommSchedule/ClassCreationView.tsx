// src/components/classroom/ClassCreationView.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PenSquare, CheckCircle, X, Clock, User, CalendarDays } from 'lucide-react';

// Import types and data. Corrected the path to be more standard.
import type { Curriculum, ClassSchedule, Room, Subject } from '../../department/classrommSchedule/classroom-data';

// --- TYPE DEFINITIONS ---
interface DayPairing {
  value: string;
  label: string;
}

interface ClassCreationProps {
  curriculum: Curriculum;
  courses: string[];
  yearLevels: string[];
  schedules: ClassSchedule[];
  rooms: Room[];
  dayPairings: DayPairing[];
  onCreateSchedule: (newSchedule: Omit<ClassSchedule, 'id'>) => void;
  // onUpdateSchedule is kept for future use (e.g., editing an existing schedule)
  onUpdateSchedule: (updatedSchedule: ClassSchedule) => void;
}

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: Subject;
  course: string;
  yearLevel: string;
  dayPairings: DayPairing[];
  onCreateSchedule: (newSchedule: Omit<ClassSchedule, 'id'>) => void;
}


// --- MAIN COMPONENT ---
const ClassCreationView: React.FC<ClassCreationProps> = ({ curriculum, courses, yearLevels, schedules, dayPairings, onCreateSchedule }) => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  // State for the scheduling modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedulingSubject, setSchedulingSubject] = useState<Subject | null>(null);

  const subjects = (selectedCourse && selectedYear && curriculum[selectedCourse]?.[selectedYear]) || [];
  const scheduledSubjectIds = new Set(
    schedules
      .filter((s: ClassSchedule) => s.course === selectedCourse && s.yearLevel === selectedYear)
      .map((s: ClassSchedule) => s.subjectId)
  );

  const handleOpenModal = (subject: Subject) => {
    setSchedulingSubject(subject);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSchedulingSubject(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-background">
        <div>
          <label className="text-sm font-medium">Program / Course</label>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger><SelectValue placeholder="Select a course..." /></SelectTrigger>
            <SelectContent>{courses.map((c: string) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Year Level</label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger><SelectValue placeholder="Select a year level..." /></SelectTrigger>
            <SelectContent>{yearLevels.map((y: string) => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold">Curriculum Subjects</h3>
        <div className="space-y-3 mt-4">
          {subjects.map((subject: Subject) => {
            const isScheduled = scheduledSubjectIds.has(subject.id);
            return (
              <div key={subject.id} className={`p-4 rounded-lg border flex items-center justify-between ${isScheduled ? 'bg-green-50 border-green-200' : 'bg-card'}`}>
                <div>
                  <p className="font-bold">{subject.code} - {subject.title}</p>
                  <p className="text-sm text-muted-foreground">{subject.units} units</p>
                </div>
                {isScheduled ? (
                  <span className="flex items-center gap-2 text-sm font-semibold text-green-600"><CheckCircle size={16}/> Scheduled</span>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => handleOpenModal(subject)}>
                    <PenSquare size={14} className="mr-2"/> Schedule Class
                  </Button>
                )}
              </div>
            );
          })}
          {subjects.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Select a course and year level to see subjects.</p>
          )}
        </div>
      </div>

      {/* Render the modal */}
      <AnimatePresence>
        {isModalOpen && schedulingSubject && (
            <ScheduleClassModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                subject={schedulingSubject}
                course={selectedCourse}
                yearLevel={selectedYear}
                dayPairings={dayPairings}
                onCreateSchedule={onCreateSchedule}
            />
        )}
      </AnimatePresence>
    </div>
  );
};


// --- MODAL COMPONENT for scheduling a class ---
const ScheduleClassModal: React.FC<ScheduleModalProps> = ({ onClose, subject, course, yearLevel, dayPairings, onCreateSchedule }) => {
    const [dayPair, setDayPair] = useState('');
    const [time, setTime] = useState('');
    const [instructor, setInstructor] = useState('');
    
    const handleSubmit = () => {
        if (!dayPair || !time || !instructor) {
            // Add user feedback, e.g., a toast notification
            alert("Please fill all fields.");
            return;
        }
        
        onCreateSchedule({
            subjectId: subject.id,
            course,
            yearLevel,
            dayPair: dayPair as ClassSchedule['dayPair'],
            time,
            instructor,
            roomId: null, // Room is unassigned by default
        });
        onClose();
    };

    return (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            className="bg-card rounded-xl shadow-xl w-full max-w-lg flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold">Schedule Class</h2>
                    <p className="text-sm text-primary font-semibold">{subject.code} - {subject.title}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}><X size={20}/></Button>
            </div>
            <div className="p-6 space-y-4">
                <div>
                    <label className="text-sm font-medium flex items-center gap-2 mb-1"><CalendarDays size={14}/> Day Pairing</label>
                    <Select value={dayPair} onValueChange={setDayPair}>
                        <SelectTrigger><SelectValue placeholder="Select day pairing..." /></SelectTrigger>
                        <SelectContent>
                            {dayPairings.map(dp => <SelectItem key={dp.value} value={dp.value}>{dp.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="text-sm font-medium flex items-center gap-2 mb-1"><Clock size={14}/> Time</label>
                    <Input value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g., 08:30-10:00" />
                </div>
                <div>
                    <label className="text-sm font-medium flex items-center gap-2 mb-1"><User size={14}/> Instructor</label>
                    <Input value={instructor} onChange={(e) => setInstructor(e.target.value)} placeholder="Enter instructor name..." />
                </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Confirm Schedule</Button>
            </div>
          </motion.div>
        </motion.div>
    )
}

export default ClassCreationView;