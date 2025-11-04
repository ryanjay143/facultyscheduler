// src/features/dean/dashboard/data.ts

export type DayKey = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';

export interface ScheduleClass {
  id: number;
  code: string;
  title: string;
  facultyName: string;
  time: string;
  room: string;
  day: DayKey;
}

export interface FacultyLoad {
  name: string;
  load: number;
  color: string;
}

export const facultyLoadData: FacultyLoad[] = [
  { name: "A. Cruz", load: 15, color: "from-violet-500 to-fuchsia-500" },
  { name: "M. Santos", load: 12, color: "from-violet-400 to-fuchsia-400" },
  { name: "J. Reyes", load: 9, color: "from-violet-300 to-fuchsia-300" },
  { name: "E. Garcia", load: 12, color: "from-violet-400 to-fuchsia-400" },
  { name: "L. Gomez", load: 16, color: "from-violet-600 to-fuchsia-600" },
];

export const allClasses: ScheduleClass[] = [
    { id: 101, code: 'IT-411', title: 'Web Systems & Tech', facultyName: 'Albie Cruz', time: '8:00 - 9:30 AM', room: 'A-301', day: 'MON' },
    { id: 102, code: 'CS-301', title: 'Data Structures', facultyName: 'Albie Cruz', time: '10:00 - 11:30 AM', room: 'A-302', day: 'MON' },
    { id: 201, code: 'IT-101', title: 'Intro to Computing', facultyName: 'Maria Santos', time: '9:00 - 10:30 AM', room: 'B-101', day: 'TUE' },
    { id: 202, code: 'CS-412', title: 'Operating Systems', facultyName: 'John Reyes', time: '11:00 - 12:30 PM', room: 'C-210', day: 'TUE' },
    { id: 301, code: 'IT-411', title: 'Web Systems & Tech', facultyName: 'Albie Cruz', time: '8:00 - 9:30 AM', room: 'A-301', day: 'WED' },
];

export const dayMap: { [key in DayKey]: string } = { MON: "Monday", TUE: "Tuesday", WED: "Wednesday", THU: "Thursday", FRI: "Friday", SAT: "Saturday" };