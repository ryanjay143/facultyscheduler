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
}

export interface Faculty {
    id: number;
    name: string;
    department: string;
    profile_picture: string;
    expertise: string[];
    
    // --- NEW FIELDS FROM BACKEND ---
    t_load_units: number;  // Regular Teaching Load
    deload_units: number;  // Deloading Units
    overload_units: number;// Overload Units
    
    // Keep these if you use them for calculations elsewhere, 
    // otherwise you might not need them anymore based on new requirement
    currentLoad?: number; 
    maxLoad?: number;
    maxSubjects?: number;
    assignedSubjects?: any[];
}

// Add this interface
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
        roomNumber: string; // or 'name' depending on your Room model
    };
}