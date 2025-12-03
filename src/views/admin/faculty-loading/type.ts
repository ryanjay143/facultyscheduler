export interface Semester {
  id: number;
  program_id: number;
  year_level: string;
  semester_level: string;
  status: number;
  start_date: string;
  end_date: string;
}

export interface Subject {
  id: number;
  semester_id: number;
  subject_code: string;
  des_title: string;
  total_units: number;
  lec_units: number;
  lab_units: number;
  total_hrs: number;
  total_lec_hrs: number;
  total_lab_hrs: number;
  pre_requisite: string;
  semester: Semester;
  units: number; 
}

// Helper types for Faculty Assigned Subjects (used in Dialogs)
export interface Schedule {
    day: string;
    time: string;
    
}

export interface AssignedSubject {
    id: number;
    subject_code: string;
    des_title: string;
    schedule: Schedule;
}

export interface Faculty {
    id: number;
    name: string;
    department: string;
    profile_picture: string | null; // Changed to allow nulls
    expertise: string[];
    
    // --- LOAD UNITS (Current Status) ---
    t_load_units: number;  // Current Regular Teaching Load
    deload_units: number;  // Current Deloading Units
    overload_units: number;// Current Overload Units
    
    // --- LOAD LIMITS (Max Capacities) ---
    // These are required for the progress bars
    regular_limit?: number; 
    deload_limit?: number;
    overload_limit?: number;
    
    // Optional/Legacy fields
    currentLoad?: number; 
    maxLoad?: number;
    maxSubjects?: number;
    
    // Used for the frontend UI logic (Assign/View Modal)
    assignedSubjects?: AssignedSubject[]; 
    availability?: any; 

    
}

export interface ClassSchedule {
    id: number;
    faculty_id: number;
    subject_id: number;
    room_id: number;
    type: 'LEC' | 'LAB';
    day: string;
    start_time: string; // "08:00:00"
    end_time: string;   // "10:00:00"
    subject: {
        id: number;
        subject_code: string;
        des_title: string;
    };
    room: {
        id: number;
        roomNumber: string; 
    };
}