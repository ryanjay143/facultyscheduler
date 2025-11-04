// src/features/admin/faculty-loading/types.ts

export type AssignedInfo = {
  faculty: string;
  // Maaaring maglaman ng maraming entry na pinaghihiwalay ng ';'
  // e.g. "Monday 09:30-11:00; Wednesday 09:30-11:00"
  time: string;
};

export type FacultyType = {
  id: number;
  name: string;
  expertise: string[];
  // Availability bawat araw bilang 24h HH:MM-HH:MM ranges
  availability: { [day: string]: string[] };
  maxSubjects: number;
};

export type Subject = {
  id: number;
  code: string;
  name: string;
  expertise: string;
  assigned: AssignedInfo | null;
};