// Shared types for Faculty Loading

  export type AssignedInfo = {
    faculty: string
    // may contain multiple entries separated by ';'
    // e.g. "Monday 09:30-11:00; Wednesday 09:30-11:00"
    time: string
  }

  export type FacultyType = {
    id: number
    name: string
    expertise: string[]
    // Availability per day as 24h HH:MM-HH:MM ranges
    availability: { [day: string]: string[] }
    maxSubjects: number
  }

  export type Subject = {
    id: number
    code: string
    name: string
    expertise: string
    assigned: AssignedInfo | null
  }