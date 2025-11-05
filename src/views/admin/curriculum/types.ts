// src/features/admin/curriculum/types.ts

export type Subject = {
    id: number;
    code: string;
    name: string;
    unitsTotal: number;
    unitsLec: number;
    unitsLab: number;
    hoursTotal: number;
    hoursLec: number;
    hoursLab: number;
    prerequisite: string;
};

export type Semester = {
    id: number;
    isActive: boolean;
    startDate: string;
    endDate: string;
    subjects: Subject[];
};

export type Program = {
    id: number;
    name: string;
    abbreviation: string;
    effectiveYear: string;
    semesters: { [semesterName: string]: Semester }; 
    subjects: { [subjectCode: string]: Subject };
    total_subjects: number;
    total_units: number;
    isActive: boolean;
};