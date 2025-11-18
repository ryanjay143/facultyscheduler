// src/components/classroom/RoomContainer.tsx

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RoomTable from "./table/RoomTable";
import YearLevelScheduleView from "./YearLevelScheduleView";

// --- CENTRALIZED TYPE DEFINITIONS (Export them for other components) ---
export interface Room {
  id: number;
  roomNumber: string;
  type: "Lecture" | "Laboratory" | "Other";
  capacity: number;
}

export interface Subject {
    id: number;
    code: string;
    name: string;
    yearLevel: number;
    type: "Major" | "Minor";
}

export interface ScheduleEntry {
  scheduleId: number;
  roomId: number;
  subjectId: number;
  section: string;
  day: string;
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
}


// --- MOCK DATA (Explicitly typed to prevent errors) ---

const mockRooms: Room[] = [
    { id: 1, roomNumber: "FH 201", type: "Lecture", capacity: 40 },
    { id: 2, roomNumber: "Lab D", type: "Laboratory", capacity: 30 },
    { id: 3, roomNumber: "A 505", type: "Lecture", capacity: 35 },
    { id: 4, roomNumber: "Gym", type: "Other", capacity: 120 },
    { id: 5, roomNumber: "FH 203", type: "Lecture", capacity: 40 },
];

const mockSubjects: Subject[] = [
    { id: 101, code: "CC 10.1", name: "Intro to Computing", yearLevel: 1, type: "Major" },
    { id: 102, code: "ENGL 1", name: "Academic Writing", yearLevel: 1, type: "Minor" },
    { id: 103, code: "PE 12", name: "Physical Education", yearLevel: 1, type: "Minor" },
    { id: 201, code: "CSCC 35.1", name: "Data Structures", yearLevel: 2, type: "Major" },
    { id: 202, code: "STS 10", name: "Science & Technology", yearLevel: 2, type: "Minor" },
    { id: 203, code: "NSTP 2", name: "Civic Welfare", yearLevel: 2, type: "Minor" },
];

const mockSchedule: ScheduleEntry[] = [
    { scheduleId: 1, roomId: 1, subjectId: 101, section: "A", day: "Mon", startTime: "09:00", endTime: "10:30" },
    { scheduleId: 2, roomId: 2, subjectId: 101, section: "A", day: "Wed", startTime: "13:00", endTime: "15:00" },
    { scheduleId: 3, roomId: 3, subjectId: 102, section: "A", day: "Tues", startTime: "10:00", endTime: "11:30" },
    { scheduleId: 4, roomId: 4, subjectId: 103, section: "B", day: "Fri", startTime: "08:00", endTime: "10:00" },
    { scheduleId: 5, roomId: 1, subjectId: 201, section: "C", day: "Mon", startTime: "13:00", endTime: "14:30" },
    { scheduleId: 6, roomId: 2, subjectId: 201, section: "C", day: "Thurs", startTime: "09:00", endTime: "11:00" },
    { scheduleId: 7, roomId: 5, subjectId: 202, section: "D", day: "Tues", startTime: "14:00", endTime: "15:30" },
    // Added a Saturday class for demonstration
    { scheduleId: 8, roomId: 5, subjectId: 102, section: "A", day: "Sat", startTime: "10:00", endTime: "12:00" },
];

// --- COMPONENT ---

function RoomContainer() {
  return (
    <main>
       <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Classroom & Schedule Management</h1>
        <p className="text-muted-foreground mt-2">
          Monitor classroom utilization and view schedules by year level.
        </p>
      </header>

      <Tabs defaultValue="classrooms">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-4">
          <TabsTrigger value="classrooms">Classroom List</TabsTrigger>
          <TabsTrigger value="1st_year">1st Year</TabsTrigger>
          <TabsTrigger value="2nd_year">2nd Year</TabsTrigger>
          <TabsTrigger value="3rd_year">3rd Year</TabsTrigger>
          <TabsTrigger value="4th_year">4th Year</TabsTrigger>
        </TabsList>

        <TabsContent value="classrooms">
          <RoomTable
            roomsData={mockRooms}
            scheduleData={mockSchedule}
            subjectsData={mockSubjects}
          />
        </TabsContent>
        <TabsContent value="1st_year">
            <YearLevelScheduleView
                yearLevel={1}
                scheduleData={mockSchedule}
                subjectsData={mockSubjects}
                roomsData={mockRooms}
            />
        </TabsContent>
        <TabsContent value="2nd_year">
            <YearLevelScheduleView
                yearLevel={2}
                scheduleData={mockSchedule}
                subjectsData={mockSubjects}
                roomsData={mockRooms}
            />
        </TabsContent>
        <TabsContent value="3rd_year">
            <div className="text-center text-muted-foreground p-12">No schedule data available for 3rd Year.</div>
        </TabsContent>
        <TabsContent value="4th_year">
            <div className="text-center text-muted-foreground p-12">No schedule data available for 4th Year.</div>
        </TabsContent>
      </Tabs>
    </main>
  );
}

export default RoomContainer;