// New Types to be defined in a shared file (e.g., src/types/dashboard.ts)

export type DayKey = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';

export const dayMap: { [key in DayKey]: string } = {
  'MON': 'Monday',
  'TUE': 'Tuesday',
  'WED': 'Wednesday',
  'THU': 'Thursday',
  'FRI': 'Friday',
  'SAT': 'Saturday',
};

export interface ApiScheduleClass {
    id: number; // schedule_id from API
    day: DayKey;
    code: string; // subject_code
    title: string; // des_title
    time: string; // "HH:MM - HH:MM"
    facultyName: string;
    room: string; // roomNumber
}

export interface ApiWeeklyOverview {
    MON: number; 
    TUE: number; 
    WED: number; 
    THU: number; 
    FRI: number; 
    SAT: number;
}

export interface ApiFacultyLoad {
    name: string;
    load: number; // t_load_units
}