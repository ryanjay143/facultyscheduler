// src/components/classroom/classroom.ts

// --- CORE ENTITIES ---

export interface FacultyUser {
    id: number;
    name?: string; 
}

export interface Faculty {
    id: number;
    user_id: number;
    designation: string;
    department: string;
}

export interface Room {
  id: number;
  roomNumber: string;
  type: "Lecture" | "Laboratory" | string;
  capacity: number | null;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: number;
  semester_id: number;
  subject_code: string; 
  des_title: string; 
  total_units: number;
  lec_units: number;
  lab_units: number;
  code: string; 
  name: string; 
  yearLevel: number; 
}


// --- SCHEDULE & LOADING TYPES ---

// 2. Faculty Loading Type (The nested object inside ScheduleEntry)
export interface FacultyLoading {
    id: number;
    faculty_id: number;
    subject_id: number;
    room_id: number;
    type: 'LEC' | 'LAB' | string;
    day: string; 
    start_time: string; 
    end_time: string; 
    
    faculty: Faculty & { user?: { id: number, name?: string } }; 
    subject: { 
        id: number;
        subject_code: string;
        des_title: string;
    }; 
    room: { 
        id: number;
        roomNumber: string;
        type: string;
    }; 
}

// 3. Main Schedule Entry Type (Ang array item galing sa API)
export interface ScheduleEntry {
  id: number; 
  faculty_loading_id: number;
  year_level: number;
  section: string;
  created_at: string;
  updated_at: string;
  
  faculty_loading: FacultyLoading; 
}

// Type for Faculty Loading array items (Used by RoomContainer and ClassSchedule)
export type FacultyLoadEntry = FacultyLoading; 

// Type for Persisted Sections
export interface SectionEntry {
    yearLevel: number;
    section: string;
}

// Type for RoomFormModal data
export type RoomFormData = Omit<Room, "id" | "status" | "created_at" | "updated_at">;

// Type for Availability Slot in ManageAvailabilityModal
export type AvailabilitySlot = {
    id: number;
    day: string;
    start_time: string;
    end_time: string;
};