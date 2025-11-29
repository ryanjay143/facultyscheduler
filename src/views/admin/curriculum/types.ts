// src/pages/Curriculum/types.ts

export interface Subject {
    id?: number;
    code: string;
    name: string;
    unitsTotal: number;
    unitsLec: number | '';
    unitsLab: number | '';
    hoursTotal: number;
    hoursLec: number | '';
    hoursLab: number | '';
    prerequisite: string;
}

export interface Semester {
    id: number;
    subjects: Subject[];
    isActive: boolean;
    startDate?: string;
    endDate?: string;
}

export interface Program {
   id: number;
    name: string;
    abbreviation: string;
    effectiveYear: string;
    isActive: boolean;
    subjects: Record<string, any>;
    semesters: Record<string, any>;
    total_subjects: number;
    total_units: number;
}

export interface ElectiveSubject {
    code: string;
    name: string;
    units: number;
    instructional: string;
}

export const professionalElectives: ElectiveSubject[] = [
    { code: 'CSCC 21.1', name: 'Software Engineering 1', units: 3, instructional: 'integrated lec/lab' },
    { code: 'CSCC 36', name: 'Advanced Topics in Human Computer Interaction', units: 3, instructional: 'lecture only' },
    { code: 'CSCC 37', name: 'User Interface Design and Development', units: 3, instructional: 'integrated lec/lab' },
    { code: 'CSCC 40', name: 'Introduction to Artificial Intelligence', units: 3, instructional: 'lecture only' },
    { code: 'CSCC 44', name: 'Introduction to Data Mining', units: 3, instructional: 'integrated lec/lab' },
    { code: 'CSCC 46', name: 'Introduction to Robotics', units: 3, instructional: 'integrated lec/lab' },
    { code: 'ISCC 11', name: 'Organization and Management Concepts', units: 3, instructional: 'lecture only' },
    { code: 'ISCC 12', name: 'Financial Management', units: 3, instructional: 'lecture only' },
    { code: 'ISCC 16', name: 'Technopreneurship', units: 3, instructional: 'lecture only' },
    { code: 'ISCC 17', name: 'Electronic Commerce', units: 3, instructional: 'lecture only' },
    { code: 'ISCC 18', name: 'Introduction to Enterprise Resource Planning', units: 3, instructional: 'lecture only' },
    { code: 'ISCC 21.1', name: 'IS Project Management', units: 3, instructional: 'lecture only' },
    { code: 'ISCC 22.1', name: 'Systems Analysis and Design', units: 3, instructional: 'lecture only' },
    { code: 'ISCC 31', name: 'Current Issues and Trends in Computing', units: 3, instructional: 'lecture only' },
    { code: 'ITCC 12', name: 'Platform Technologies', units: 3, instructional: 'integrated lec/lab' },
    { code: 'ITCC 17', name: 'Advanced Systems Integration and Architecture', units: 3, instructional: 'integrated lec/lab' },
    { code: 'ITCC 18', name: 'Advanced Integrative Programming and Technologies', units: 3, instructional: 'lec and lab' },
    { code: 'ITCC 19', name: 'Introduction to Geographic Information Systems', units: 3, instructional: 'integrated lec/lab' },
    { code: 'ITCC 34', name: 'Contemporary Database Technologies', units: 3, instructional: 'integrated lec/lab' },
    { code: 'ITCC 35', name: 'Advanced Web Systems and Technologies', units: 3, instructional: 'integrated lec/lab' },
    { code: 'ITCC 36', name: 'Introduction to Cloud Computing', units: 3, instructional: 'integrated lec/lab' },
    { code: 'ITCC 37', name: 'Data Warehousing', units: 3, instructional: 'integrated lec/lab' },
    { code: 'ITCC 38', name: 'Parallel and Distributed Computing', units: 3, instructional: 'integrated lec/lab' },
    { code: 'ITCC 39', name: 'IT Industry Management', units: 3, instructional: 'lecture only' },
    { code: 'ITCC 40', name: 'Web Design and Development', units: 3, instructional: 'integrated lec/lab' },
    { code: 'ITCC 41', name: 'Mobile Applications Development', units: 3, instructional: 'integrated lec/lab' },
];