// src/features/admin/faculty-loading/data/dummyData.ts

import type { FacultyType, Subject } from '../type';

export const allFaculty: FacultyType[] = [
    { id: 1, name: 'Dr. Evelyn Reed', expertise: ['Software Engineering', 'Programming'], availability: { Monday: ['08:00-11:00'], Wednesday: ['13:00-16:00'] }, maxSubjects: 4 },
    { id: 2, name: 'Dr. Samuel Grant', expertise: ['Cyber Security', 'Computer Networks'], availability: { Tuesday: ['09:30-12:30'], Thursday: ['08:00-09:30', '13:00-14:30'] }, maxSubjects: 4 },
    { id: 3, name: 'Prof. Alisha Chen', expertise: ['HCI', 'Game Development'], availability: { Friday: ['11:00-14:30'], Saturday: ['09:30-11:00'] }, maxSubjects: 3 },
    { id: 4, name: 'Dr. Ben Carter', expertise: ['Computer Graphics & Vision', 'Programming'], availability: { Monday: ['08:00-11:00'], Wednesday: ['14:30-16:00'] }, maxSubjects: 4,},
];

export const allSubjects: Subject[] = [
    { id: 1, code: 'CS101', name: 'Introduction to Programming', expertise: 'Programming', assigned: null },
    { id: 2, code: 'CS205', name: 'Data Structures and Algorithms', expertise: 'Programming', assigned: null },
    { id: 3, code: 'SE301', name: 'Agile Development', expertise: 'Software Engineering', assigned: { faculty: 'Dr. Evelyn Reed', time: 'Monday 09:30-11:00; Wednesday 13:00-14:30' } },
    { id: 4, code: 'CS402', name: 'Information Security', expertise: 'Cyber Security', assigned: { faculty: 'Dr. Samuel Grant', time: 'Tuesday 09:30-11:00' } },
    { id: 5, code: 'NT201', name: 'Computer Networks Fundamentals', expertise: 'Computer Networks', assigned: null },
    { id: 6, code: 'GD303', name: 'Intro to Game Design', expertise: 'Game Development', assigned: { faculty: 'Prof. Alisha Chen', time: 'Friday 11:00-12:30' } },
];

export const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const COMMON_DAY_SLOTS: Record<string, string[]> = {
  Monday: ['08:00-09:30', '09:30-11:00', '11:00-12:30', '13:00-14:30', '14:30-16:00'],
  Tuesday: ['08:00-09:30', '09:30-11:00', '11:00-12:30', '13:00-14:30', '14:30-16:00'],
  Wednesday: ['08:00-09:30', '09:30-11:00', '11:00-12:30', '13:00-14:30', '14:30-16:00'],
  Thursday: ['08:00-09:30', '09:30-11:00', '11:00-12:30', '13:00-14:30', '14:30-16:00'],
  Friday: ['08:00-09:30', '09:30-11:00', '11:00-12:30', '13:00-14:30', '14:30-16:00'],
  Saturday: ['08:00-09:30', '09:30-11:00', '11:00-12:30'],
};