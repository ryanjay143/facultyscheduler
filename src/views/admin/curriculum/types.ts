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

