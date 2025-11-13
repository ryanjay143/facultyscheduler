export interface Semester {
  id: number;
  program_id: number;
  year_level: string;
  semester_level: string;
  status: number;
  start_date: string;
  end_date: string;
}

export interface Subject {
  id: number;
  semester_id: number;
  subject_code: string;
  des_title: string;
  total_units: number;
  lec_units: number;
  lab_units: number;
  total_hrs: number;
  total_lec_hrs: number;
  total_lab_hrs: number;
  pre_requisite: string;
  semester: Semester;
}

export interface Faculty {
  id: number;
  name: string;
  expertise: string[];
  availability: {};
  maxUnits: number;
  assignedSubjects: any[];
  profile_picture: string;
}