// src/data/classroom-data.ts

export interface Subject {
  id: string;
  code: string;
  title: string;
  units: number;
}

export interface Curriculum {
  [course: string]: {
    [yearLevel: string]: Subject[];
  };
}

export interface ClassSchedule {
  id: number;
  subjectId: string; // Links to Subject
  course: string;
  yearLevel: string;
  dayPair: 'MTh' | 'TF' | 'WS' | 'MWF' | 'TTH' | 'Sat';
  time: string; // e.g., "08:30-10:00"
  instructor: string;
  roomId: string | null; // Null if unassigned
}

export interface Room {
  id: string;
  capacity: number;
  type: 'Classroom' | 'Lab' | 'Lecture Hall';
}

// --- DUMMY DATA ---

export const courses = ["BS in Computer Science", "BS in Information Technology", "BA in English"];
export const yearLevels = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
export const dayPairings = [
    { value: 'MTh', label: 'Monday / Thursday' },
    { value: 'TF', label: 'Tuesday / Friday' },
    { value: 'WS', label: 'Wednesday / Saturday' },
    { value: 'MWF', label: 'Monday / Wednesday / Friday' },
    { value: 'TTH', label: 'Tuesday / Thursday' },
    { value: 'Sat', label: 'Saturday' },
];

export const curriculum: Curriculum = {
  "BS in Computer Science": {
    "1st Year": [
      { id: 'cs101', code: 'CS 101', title: 'Intro to Computing', units: 3 },
      { id: 'math110', code: 'MATH 110', title: 'College Algebra', units: 3 },
      { id: 'eng101', code: 'ENG 101', title: 'English Composition', units: 3 },
    ],
    "2nd Year": [
      { id: 'cs205', code: 'CS 205', title: 'Algorithms & Data Structures', units: 3 },
      { id: 'cs210', code: 'CS 210', title: 'Object-Oriented Programming', units: 3 },
      { id: 'phy101', code: 'PHY 101', title: 'General Physics', units: 4 },
    ],
  },
  "BS in Information Technology": {
    "1st Year": [
      { id: 'it101', code: 'IT 101', title: 'Foundations of IT', units: 3 },
      { id: 'net101', code: 'NET 101', title: 'Networking Essentials', units: 3 },
    ],
  },
};

export const initialRooms: Room[] = [
  { id: 'A-101', capacity: 50, type: 'Classroom' },
  { id: 'A-102', capacity: 60, type: 'Classroom' },
  { id: 'B-203', capacity: 40, type: 'Lab' },
  { id: 'C-301', capacity: 45, type: 'Classroom' },
  { id: 'E-210', capacity: 70, type: 'Lecture Hall' },
];

// Some classes are already scheduled, some are not.
export const initialClassSchedules: ClassSchedule[] = [
    { id: 1, subjectId: 'cs101', course: 'BS in Computer Science', yearLevel: '1st Year', dayPair: 'MWF', time: '08:30-09:30', instructor: 'Dr. Santos', roomId: 'A-101' },
    { id: 2, subjectId: 'it101', course: 'BS in Information Technology', yearLevel: '1st Year', dayPair: 'TTH', time: '10:00-11:30', instructor: 'Prof. Cruz', roomId: 'B-203' },
    { id: 3, subjectId: 'cs205', course: 'BS in Computer Science', yearLevel: '2nd Year', dayPair: 'MTh', time: '13:00-14:30', instructor: 'Dr. Reyes', roomId: null },
];