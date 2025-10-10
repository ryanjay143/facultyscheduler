

  // Availability uses 24h HH:MM-HH:MM ranges and can contain standardized slots.
  // Assigned time supports multiple entries separated by ';'
  // (e.g., "Monday 09:30-11:00; Wednesday 13:00-14:30").

import type { FacultyType, Subject } from "./types"

  export const allFaculty: FacultyType[] = [
    {
      id: 1,
      name: 'Dr. Evelyn Reed',
      expertise: ['Software Engineering', 'Programming'],
      availability: {
        Monday: ['08:00-09:30', '09:30-11:00'],
        Wednesday: ['13:00-16:00'],
      },
      maxSubjects: 4,
    },
    {
      id: 2,
      name: 'Dr. Samuel Grant',
      expertise: ['Cyber Security', 'Computer Networks'],
      availability: {
        Tuesday: ['09:30-12:30'], // contains 09:30-11:00 and 11:00-12:30
        Thursday: ['08:00-09:30', '13:00-14:30'],
      },
      maxSubjects: 4,
    },
    {
      id: 3,
      name: 'Prof. Alisha Chen',
      expertise: ['HCI', 'Game Development'],
      availability: {
        Friday: ['11:00-12:30', '13:00-14:30'],
        Saturday: ['09:30-11:00'],
      },
      maxSubjects: 3,
    },
    {
      id: 4,
      name: 'Dr. Ben Carter',
      expertise: ['Computer Graphics & Vision', 'Programming'],
      availability: {
        Monday: ['08:00-11:00'],  // contains 08:00-09:30 and 09:30-11:00
        Wednesday: ['14:30-16:00'],
      },
      maxSubjects: 4,
    },
    {
      id: 5,
      name: 'Prof. Nina Flores',
      expertise: ['Data Science', 'AI/ML'],
      availability: {
        Tuesday: ['13:00-16:00'], // contains 13:00-14:30 and 14:30-16:00
        Thursday: ['09:30-11:00', '11:00-12:30'],
        Saturday: ['08:00-09:30'],
      },
      maxSubjects: 3,
    },
    {
      id: 6,
      name: 'Dr. Omar Youssef',
      expertise: ['Database Systems', 'Programming'],
      availability: {
        Monday: ['11:00-12:30'],
        Wednesday: ['09:30-11:00', '13:00-14:30'],
        Friday: ['08:00-09:30'],
        Saturday: ['08:00-09:30'],
      },
      maxSubjects: 4,
    },
    {
      id: 7,
      name: 'Prof. Karen Lee',
      expertise: ['Software Engineering', 'HCI'],
      availability: {
        Tuesday: ['08:00-09:30', '09:30-11:00'],
        Thursday: ['13:00-16:00'], // contains 13:00-14:30 and 14:30-16:00
      },
      maxSubjects: 4,
    },
    {
      id: 8,
      name: 'Dr. Mateo Cruz',
      expertise: ['Cyber Security', 'AI/ML'],
      availability: {
        Monday: ['13:00-14:30'],
        Wednesday: ['11:00-12:30'],
        Friday: ['09:30-11:00'],
      },
      maxSubjects: 3,
    },
  ]

  export const allSubjects: Subject[] = [
    { id: 1, code: 'CS101', name: 'Introduction to Programming', expertise: 'Programming', assigned: null },
    { id: 2, code: 'CS205', name: 'Data Structures and Algorithms', expertise: 'Programming', assigned: null },

    // Multi-day example (semicolon-separated)
    {
      id: 3,
      code: 'SE301',
      name: 'Agile Development',
      expertise: 'Software Engineering',
      assigned: {
        faculty: 'Dr. Evelyn Reed',
        time: 'Monday 09:30-11:00; Wednesday 13:00-14:30',
      },
    },

    { id: 4, code: 'CS402', name: 'Information Security', expertise: 'Cyber Security', assigned: { faculty: 'Dr. Samuel Grant', time: 'Tuesday 09:30-11:00' } },
    { id: 5, code: 'NT201', name: 'Computer Networks Fundamentals', expertise: 'Computer Networks', assigned: { faculty: 'Dr. Samuel Grant', time: 'Thursday 08:00-09:30' } },

    { id: 6, code: 'GD303', name: 'Intro to Game Design', expertise: 'Game Development', assigned: { faculty: 'Prof. Alisha Chen', time: 'Friday 11:00-12:30' } },
    { id: 7, code: 'HCI250', name: 'UI/UX Principles', expertise: 'HCI', assigned: null },

    { id: 8, code: 'DS210', name: 'Data Mining', expertise: 'Data Science', assigned: { faculty: 'Prof. Nina Flores', time: 'Thursday 09:30-11:00' } },
    { id: 9, code: 'AI310', name: 'Machine Learning', expertise: 'AI/ML', assigned: null },

    { id: 10, code: 'DB220', name: 'Relational Databases', expertise: 'Database Systems', assigned: { faculty: 'Dr. Omar Youssef', time: 'Wednesday 09:30-11:00' } },
    { id: 11, code: 'CV340', name: 'Computer Vision', expertise: 'Computer Graphics & Vision', assigned: { faculty: 'Dr. Ben Carter', time: 'Wednesday 14:30-16:00' } },

    { id: 12, code: 'SE410', name: 'Software Architecture', expertise: 'Software Engineering', assigned: null },
    { id: 13, code: 'WD150', name: 'Web Development Basics', expertise: 'Programming', assigned: { faculty: 'Dr. Omar Youssef', time: 'Saturday 08:00-09:30' } },
    { id: 14, code: 'HCI360', name: 'Interaction Design', expertise: 'HCI', assigned: null },
    { id: 15, code: 'AI420', name: 'Deep Learning', expertise: 'AI/ML', assigned: null },
  ]

  export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']