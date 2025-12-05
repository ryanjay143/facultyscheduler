// src/components/classroom/ClassCreationView.tsx

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PenSquare, CheckCircle, X, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

// Import types and data. Removed 'Room' type as it was only for MasterScheduleView.
import type { Curriculum, ClassSchedule, Subject } from '../../department/classrommSchedule/classroom-data';
import type { Room as AdminRoom, FacultyLoadEntry, Subject as AdminSubject } from '../../admin/room/classroom';

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
  dayPairings: DayPairing[];
  onCreateSchedule: (newSchedule: Omit<ClassSchedule, 'id'>) => void;
  // onUpdateSchedule is kept for future use (e.g., editing an existing schedule)
  onUpdateSchedule: (updatedSchedule: ClassSchedule) => void;
  // Admin data to drive room/time availability
  rooms?: AdminRoom[];
  facultyLoadingData?: FacultyLoadEntry[];
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
const ClassCreationView: React.FC<ClassCreationProps> = ({ curriculum, courses, yearLevels, schedules, dayPairings, onCreateSchedule, rooms = [], facultyLoadingData = [] }) => {
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
                rooms={rooms}
                facultyLoadingData={facultyLoadingData}
            />
        )}
      </AnimatePresence>
    </div>
  );
};


// --- MODAL COMPONENT for scheduling a class ---
interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: Subject;
  course: string;
  yearLevel: string;
  dayPairings: DayPairing[];
  onCreateSchedule: (newSchedule: Omit<ClassSchedule, 'id'>) => void;
  // Admin data for availability
  rooms?: AdminRoom[];
  facultyLoadingData?: FacultyLoadEntry[];
  subjectsData?: AdminSubject[];
}

const ScheduleClassModal: React.FC<ScheduleModalProps> = ({ onClose, subject, course, yearLevel, dayPairings, onCreateSchedule, facultyLoadingData = [] }) => {
  const [dayPair, setDayPair] = useState('');
  const [time, setTime] = useState('');
  const [instructor, setInstructor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
    const [section, setSection] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');

  const handleSubmit = async () => {
    if (!dayPair || !time || !instructor || !section) {
      toast.error('Please fill all fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreateSchedule({
        subjectId: subject.id,
        course,
        yearLevel,
        dayPair: dayPair as ClassSchedule['dayPair'],
        time,
        instructor,
        roomId: null, // Room is unassigned by default
      });
      toast.success('Class scheduled (local state updated).');
      onClose();
    } catch (err) {
      toast.error('Failed to create schedule.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Availability calculations using admin facultyLoadingData ---
  const selectedSubjectLoads = React.useMemo(() => {
    if (!subject || !facultyLoadingData) return [] as FacultyLoadEntry[];
    return facultyLoadingData.filter(l => l.subject_id.toString() === subject.id.toString());
  }, [subject, facultyLoadingData]);

  const availableRooms = React.useMemo(() => {
    const map = new Map<number, AdminRoom>();
    selectedSubjectLoads.forEach(load => {
      if (!map.has(load.room.id)) map.set(load.room.id, { id: load.room.id, roomNumber: load.room.roomNumber, type: load.room.type, capacity: 0, status: 0, created_at: '', updated_at: '' });
    });
    return Array.from(map.values());
  }, [selectedSubjectLoads]);

  const availableDays = React.useMemo(() => {
    if (!selectedRoomId) return [] as string[];
    const roomLoads = selectedSubjectLoads.filter(l => l.room.id.toString() === selectedRoomId);
    return Array.from(new Set(roomLoads.map(l => l.day)));
  }, [selectedSubjectLoads, selectedRoomId]);

  const formatTime12Hour = (time: string) => {
    if(!time) return "";
    const clean = time.length > 5 ? time.substring(0,5) : time;
    const [h, m] = clean.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hh = h % 12 === 0 ? 12 : h % 12;
    return `${hh}:${m < 10 ? '0'+m : m} ${ampm}`;
  };

  const availableTimeSlots = React.useMemo(() => {
    if (!selectedRoomId || !dayPair) return [] as any[];
    const relevant = selectedSubjectLoads.filter(l => l.room.id.toString() === selectedRoomId && l.day === dayPair);
    return relevant.map(load => ({ value: `${load.start_time.substring(0,5)}|${load.end_time.substring(0,5)}|${load.type}`, display: `${formatTime12Hour(load.start_time)} - ${formatTime12Hour(load.end_time)} (${load.type})`, type: load.type }));
  }, [selectedSubjectLoads, selectedRoomId, dayPair]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-lg font-bold">Schedule Class</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">{subject.code} — {subject.title}</p>
            </div>
            <DialogClose asChild>
              <Button variant="ghost" size="icon"><X /></Button>
            </DialogClose>
          </div>
        </DialogHeader>

                    <div className="grid gap-5 py-4">
            <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Year Level <span className="text-red-500">*</span></Label>
              <Select value={String(yearLevel)} onValueChange={() => {}} disabled>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value={String(yearLevel)}>{String(yearLevel)}</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Section <span className="text-red-500">*</span></Label>
              <div className="flex gap-2">
                <Input placeholder="Section name" value={section} onChange={(e) => setSection(e.target.value)} />
                <Button size="icon" variant="outline" title="Create New Section"><Plus /></Button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100"></div>

          <div className="space-y-2">
            <Label className="text-sm">Subject <span className="text-red-500">*</span></Label>
            <div className="p-3 rounded-md bg-slate-50 border border-slate-100">
              <div className="font-semibold">{(subject as any).code ?? (subject as any).subject_code} — {(subject as any).title ?? (subject as any).des_title}</div>
              <div className="text-xs text-muted-foreground mt-1">Units: {(subject as any).units ?? (subject as any).total_units ?? '--'}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Available Room <span className="text-red-500">*</span></Label>
              <Select value={selectedRoomId} onValueChange={(v) => setSelectedRoomId(v)} disabled={availableRooms.length === 0}>
                <SelectTrigger><SelectValue placeholder={availableRooms.length ? 'Select a room' : 'No rooms'} /></SelectTrigger>
                <SelectContent>
                  {availableRooms.map(r => <SelectItem key={r.id} value={r.id.toString()}>{r.roomNumber} ({r.type})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Day Pairing <span className="text-red-500">*</span></Label>
              <Select value={dayPair} onValueChange={setDayPair}>
                <SelectTrigger><SelectValue placeholder="Select day pairing..." /></SelectTrigger>
                <SelectContent>
                  {availableDays.length > 0 ? availableDays.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>) : dayPairings.map(dp => <SelectItem key={dp.value} value={dp.value}>{dp.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Day Pairing <span className="text-red-500">*</span></Label>
              <Select value={dayPair} onValueChange={setDayPair}>
                <SelectTrigger><SelectValue placeholder="Select day pairing..." /></SelectTrigger>
                <SelectContent>
                  {dayPairings.map(dp => <SelectItem key={dp.value} value={dp.value}>{dp.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Time Slot <span className="text-red-500">*</span></Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger><SelectValue placeholder="Select Time Slot" /></SelectTrigger>
                <SelectContent>
                  {availableTimeSlots.length > 0 ? availableTimeSlots.map((slot, idx) => (
                    <SelectItem key={idx} value={slot.value}>{slot.display}</SelectItem>
                  )) : <div className="p-2 text-xs text-muted-foreground">No available slots found for this subject/room/day.</div>}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-sm">Instructor <span className="text-red-500">*</span></Label>
            <Input value={instructor} onChange={(e) => setInstructor(e.target.value)} placeholder="Enter instructor name..." />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Confirm Schedule'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ClassCreationView;