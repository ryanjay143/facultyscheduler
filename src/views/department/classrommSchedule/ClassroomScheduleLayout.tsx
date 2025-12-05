// src/components/classroom/ClassCreationView.tsx (Combined with Layout)

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PenSquare, CheckCircle, X, Plus, Calendar, Building, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import axios from '../../../plugin/axios';
// import RoomManagementView from './RoomManagementView';

// --- CONSOLIDATED & CORRECTED TYPE DEFINITIONS ---
// These types must exist or be defined correctly for the components to compile.

// Admin Room
export interface AdminRoom {
    id: number;
    roomNumber: string;
    type: string;
    capacity: number;
    status: number;
    created_at: string;
    updated_at: string;
}

// FacultyLoadEntry
export interface FacultyLoadEntry {
    subject_id: number;
    room: {
        id: number;
        roomNumber: string;
        type: string;
    };
    day: string;
    start_time: string;
    end_time: string;
    type: 'LEC' | 'LAB';
}

// Subject from Curriculum
export interface ComponentSubject {
    id: string; 
    code: string; 
    title: string; 
    units: number; 
    subject_code: string; 
    des_title: string; 
    total_units: number; 
}

// ClassSchedule used in this component
export interface ComponentClassSchedule {
    id: string | number; 
    subjectId: string; 
    course: string; 
    yearLevel: string; 
    dayPair: string; 
    time: string; 
    instructor: string;
    roomId: string | null; 

    room_id: number | null; 
    subject_id: number; 
    faculty_id: number | null; 
    type: 'LEC' | 'LAB' | string; 
    day: string; 
    start_time: string; 
    end_time: string; 
}

// Curriculum
export interface Curriculum {
    [course: string]: {
        [yearLevel: string]: ComponentSubject[];
    };
}

// Room
export interface Room {
    id: string;
    capacity: number;
    type: string;
}


// --- DUMMY/MOCK DATA FOR COMPILATION ---

const MOCK_SUBJECT_CS101: ComponentSubject = {
    id: 'cs101',
    code: 'CS 101',
    title: 'Intro to Comp',
    units: 3,
    subject_code: 'CS 101',
    des_title: 'Introduction to Computing',
    total_units: 3,
};

const MOCK_SUBJECT_MATH110: ComponentSubject = {
    id: 'math110',
    code: 'MATH 110',
    title: 'College Algebra',
    units: 3,
    subject_code: 'MATH 110',
    des_title: 'College Algebra',
    total_units: 3,
};

const MOCK_CURRICULUM: Curriculum = {
    "BSCS": {
        "1st Year": [MOCK_SUBJECT_CS101, MOCK_SUBJECT_MATH110],
    }
};

const MOCK_COURSES = ["BSCS", "BSIT"];
const MOCK_YEAR_LEVELS = ["1st Year", "2nd Year"];
const MOCK_DAY_PAIRINGS = [
    { value: 'Mon', label: 'Monday' },
    { value: 'Tue', label: 'Tuesday' },
    { value: 'MWF', label: 'Monday / Wednesday / Friday' },
];

const MOCK_SCHEDULES: ComponentClassSchedule[] = [
    { id: 1, subjectId: 'cs101', course: 'BSCS', yearLevel: '1st Year', dayPair: 'MWF', time: '08:30-09:30', instructor: 'Dr. Smith', roomId: null, room_id: null, subject_id: 1, faculty_id: null, type: 'LEC', day: 'MWF', start_time: '08:30:00', end_time: '09:30:00' },
];

const MOCK_ROOMS: Room[] = [
    { id: 'A-101', capacity: 50, type: 'Classroom' },
    { id: 'B-203', capacity: 40, type: 'Lab' },
];


// --- PROPS INTERFACES ---
interface DayPairing {
  value: string;
  label: string;
}

interface ClassCreationProps {
  curriculum: Curriculum;
  courses: string[];
  yearLevels: string[];
  schedules: ComponentClassSchedule[]; 
  dayPairings: DayPairing[];
  onCreateSchedule: (newSchedule: Omit<ComponentClassSchedule, 'id'>) => void; 
  onUpdateSchedule: (updatedSchedule: ComponentClassSchedule) => void; 
  rooms?: AdminRoom[];
  facultyLoadingData?: FacultyLoadEntry[];
}


// --- CLASS CREATION VIEW COMPONENT ---
const ClassCreationView: React.FC<ClassCreationProps> = ({ curriculum, courses, yearLevels, schedules, dayPairings, onCreateSchedule, rooms = [], facultyLoadingData = [] }) => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedulingSubject, setSchedulingSubject] = useState<ComponentSubject | null>(null);

  const subjects = (selectedCourse && selectedYear && curriculum[selectedCourse]?.[selectedYear]) || [];
  const scheduledSubjectIds = new Set(
    schedules
      .filter((s: ComponentClassSchedule) => s.course === selectedCourse && s.yearLevel === selectedYear)
      .map((s: ComponentClassSchedule) => s.subjectId)
  );

  const handleOpenModal = (subject: ComponentSubject) => {
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
          {subjects.map((subject: ComponentSubject) => {
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
  subject: ComponentSubject;
  course: string;
  yearLevel: string;
  dayPairings: DayPairing[];
  onCreateSchedule: (newSchedule: Omit<ComponentClassSchedule, 'id'>) => void;
  rooms?: AdminRoom[];
  facultyLoadingData?: FacultyLoadEntry[];
}

const ScheduleClassModal: React.FC<ScheduleModalProps> = ({ onClose, subject, course, yearLevel, onCreateSchedule, facultyLoadingData = [], rooms = [] }) => {
  const [dayPair, setDayPair] = useState('');
  const [time, setTime] = useState('');
  const [instructor, setInstructor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [section, setSection] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');

  const handleSubmit = async () => {
    const [startTime, endTime, classType] = time.split('|');
    const room = rooms.find(r => r.id.toString() === selectedRoomId);

    if (!dayPair || !startTime || !endTime || !instructor || !section || !selectedRoomId) {
      toast.error('Please fill all required fields (Room, Day, Time, Instructor, Section).');
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreateSchedule({
        subjectId: subject.id, 
        course,
        yearLevel,
        dayPair: dayPair, 
        time: `${startTime}-${endTime}`, 
        instructor,
        roomId: selectedRoomId, 
        
        subject_id: subject.id as unknown as number,
        room_id: room?.id || 0, 
        day: dayPair, 
        start_time: `${startTime}:00`,
        end_time: `${endTime}:00`,
        type: classType as 'LEC' | 'LAB',
        faculty_id: null,
      });
      toast.success('Class scheduled (local state updated).');
      onClose();
    } catch (err) {
      toast.error('Failed to create schedule.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedSubjectLoads = React.useMemo(() => {
    if (!subject || !facultyLoadingData) return [] as FacultyLoadEntry[];
    return facultyLoadingData.filter(l => l.subject_id.toString() === subject.id.toString());
  }, [subject, facultyLoadingData]);

  const availableRooms = React.useMemo(() => {
    return rooms.map(r => ({ ...r, id: r.id.toString() }));
  }, [rooms]);

  const availableDays = React.useMemo(() => {
    if (!selectedRoomId) return [] as string[];
    const roomLoads = selectedSubjectLoads.filter(l => l.room.id.toString() === selectedRoomId);
    const daysFromLoads = Array.from(new Set(roomLoads.map(l => l.day)));
    return daysFromLoads.sort();
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
    return relevant.map(load => ({ 
        value: `${load.start_time.substring(0,5)}|${load.end_time.substring(0,5)}|${load.type}`, 
        display: `${formatTime12Hour(load.start_time)} - ${formatTime12Hour(load.end_time)} (${load.type})`, 
        type: load.type 
    }));
  }, [selectedSubjectLoads, selectedRoomId, dayPair]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-lg font-bold">Schedule Class</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">{subject.subject_code} — {subject.des_title}</p>
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
              <div className="font-semibold">{subject.subject_code} — {subject.des_title}</div>
              <div className="text-xs text-muted-foreground mt-1">Units: {subject.total_units ?? '--'}</div>
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
              <Label className="text-sm">Day <span className="text-red-500">*</span></Label>
              <Select value={dayPair} onValueChange={setDayPair} disabled={availableDays.length === 0}>
                <SelectTrigger><SelectValue placeholder={availableDays.length ? 'Select day' : 'No available days'} /></SelectTrigger>
                <SelectContent>
                  {availableDays.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Time Slot <span className="text-red-500">*</span></Label>
              <Select value={time} onValueChange={setTime} disabled={availableTimeSlots.length === 0}>
                <SelectTrigger><SelectValue placeholder={availableTimeSlots.length ? 'Select Time Slot' : 'Select Room/Day'} /></SelectTrigger>
                <SelectContent>
                  {availableTimeSlots.map((slot, idx) => (
                    <SelectItem key={idx} value={slot.value}>{slot.display}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label className="text-sm">Instructor <span className="text-red-500">*</span></Label>
              <Input value={instructor} onChange={(e) => setInstructor(e.target.value)} placeholder="Enter instructor name..." />
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={handleSubmit} disabled={isSubmitting || !selectedRoomId || !dayPair || !time || !instructor || !section}>{isSubmitting ? 'Saving...' : 'Confirm Schedule'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- ROOM MANAGEMENT VIEW (Mocked for compilation) ---


// --- STAT CARD (Mocked for compilation) ---
const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: number; icon: React.ElementType; color: string }) => (
    <div className="p-4 rounded-xl border flex items-center justify-between shadow-sm">
        <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
        <Icon size={24} className={color} />
    </div>
);


// --- CLASSROOM SCHEDULE LAYOUT COMPONENT (FIXED) ---

function ClassroomScheduleLayout() {
  const [activeTab, setActiveTab] = useState<'Creation' | 'Rooms'>('Creation');
  const [schedules, setSchedules] = useState<ComponentClassSchedule[]>(MOCK_SCHEDULES); 
  const [rooms, _setRooms] = useState<Room[]>(MOCK_ROOMS); 

  const [adminRooms, setAdminRooms] = useState<AdminRoom[]>([]);
  const [facultyLoading, setFacultyLoading] = useState<FacultyLoadEntry[]>([]);

  const unassignedClasses = schedules.filter((c) => c.roomId === null);
  const roomsInUseCount = new Set(schedules.map(s => s.roomId).filter(Boolean)).size;

  const handleCreateSchedule = (newSchedule: Omit<ComponentClassSchedule, 'id'>) => {
    setSchedules(prev => [
      ...prev,
      {
        ...newSchedule,
        id: Date.now().toString(), 
      } as ComponentClassSchedule 
    ]);
  };

  const fetchAdminRooms = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      const res = await axios.get('/rooms', { headers: { Authorization: `Bearer ${token}` } });
      setAdminRooms(res.data.rooms || []);
    } catch (err) {
      console.error('Failed to fetch admin rooms', err);
    }
  }, []);

  // Removed fetchAdminSubjects as it was unused and a placeholder.

  const fetchFacultyLoading = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      const r = await axios.get('/get-faculty-loading', { headers: { Authorization: `Bearer ${token}` } });
      setFacultyLoading(r.data.data || []);
    } catch (err) {
      console.error('Failed to fetch faculty loading', err);
    }
  }, []);

  // FIX: Removed the unused 'fetchAdminSubjects' from the dependency array
  useEffect(() => {
    fetchAdminRooms();
    fetchFacultyLoading();
  }, [fetchAdminRooms, fetchFacultyLoading]);

  const handleUpdateSchedule = (updatedSchedule: ComponentClassSchedule) => {
    setSchedules(prev => prev.map(s => s.id === updatedSchedule.id ? updatedSchedule : s));
  };
  
  const renderContent = () => {
    switch (activeTab) {
      case 'Creation':
        return <ClassCreationView
                  curriculum={MOCK_CURRICULUM}
                  courses={MOCK_COURSES}
                  yearLevels={MOCK_YEAR_LEVELS}
                  schedules={schedules}
                  dayPairings={MOCK_DAY_PAIRINGS}
                  onCreateSchedule={handleCreateSchedule}
                  onUpdateSchedule={handleUpdateSchedule}
                  rooms={adminRooms}
                  facultyLoadingData={facultyLoading}
                />;
      case 'Rooms':
        return 0;
      default:
        return <ClassCreationView
                  curriculum={MOCK_CURRICULUM}
                  courses={MOCK_COURSES}
                  yearLevels={MOCK_YEAR_LEVELS}
                  schedules={schedules}
                  dayPairings={MOCK_DAY_PAIRINGS}
                  onCreateSchedule={handleCreateSchedule}
                  onUpdateSchedule={handleUpdateSchedule}
                />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Classroom Scheduling</h1>
        <p className="text-gray-600 mt-1">Manage, create, and view classroom assignments across all departments.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Rooms" value={rooms.length} icon={Building} color="text-blue-500" />
        <StatCard title="Rooms in Use" value={roomsInUseCount} icon={Building} color="text-indigo-500" />
        <StatCard title="Total Classes Scheduled" value={schedules.length} icon={Calendar} color="text-green-500" />
        <StatCard title="Unassigned Classes" value={unassignedClasses.length} icon={AlertTriangle} color="text-yellow-500" />
      </div>

      {/* Main Content Area */}
      <div className="bg-card border rounded-xl shadow-sm">
        <div className="p-3 border-b">
          <div className="inline-flex items-center gap-2 bg-muted p-1 rounded-lg">
            <TabButton title="Class Creation" icon={PenSquare} isActive={activeTab === 'Creation'} onClick={() => setActiveTab('Creation')} />
            <TabButton title="Room Management" icon={Building} isActive={activeTab === 'Rooms'} onClick={() => setActiveTab('Rooms')} />
          </div>
        </div>
        <div className="p-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

const TabButton = ({ title, icon: Icon, isActive, onClick }: { title: string; icon: React.ElementType, isActive: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
      isActive ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-primary'
    }`}
  >
    <Icon size={16} />
    {title}
  </button>
);

export default ClassroomScheduleLayout;