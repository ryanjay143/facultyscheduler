// src/features/admin/curriculum/types.ts

export type Subject = {
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
    subjects: Subject[];
    startDate?: string; // e.g., "2024-08-01"
    endDate?: string;   // e.g., "2024-12-15"
    isActive: boolean;  // true = Active, false = Inactive
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
    
};