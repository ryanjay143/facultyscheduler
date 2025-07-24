import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DialogSchedule from "../dialog/DialogSchedule";
import "./../style.css";

// Assign a unique color for each subject
const subjectColor: Record<string, string> = {
  CS101: '#bbf7d0',
  MATH201: '#fef08a',
  ENG102: '#bae6fd',
  BIO110: '#fca5a5',
  CHEM101: '#fcd34d',
  PHYS201: '#c4b5fd',
  HIST101: '#fdba74',
  CS102: '#f9a8d4',
  MATH202: '#a7f3d0',
  ENG201: '#fdcfe8',
  BIO210: '#fbcfe8',
  CHEM201: '#fef9c3',
  PHYS101: '#a5b4fc',
  HIST201: '#fca5a5',
  CS201: '#fcd34d',
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const timeSlots = [
  "08:00 - 09:00 AM",
  "09:00 - 10:00 AM",
  "10:00 - 11:00 AM",
  "11:00 - 12:00 PM",
  "12:00 - 01:00 PM",
  "01:00 - 02:00 PM",
  "02:00 - 03:00 PM",
  "03:00 - 04:00 PM",
  "04:00 - 05:00 PM",
];

interface TimetableSchedule {
  id: number;
  subject: string;
  section: string;
  faculty: string;
  room: string;
  day: string;
  time: string;
  status: "Active" | "Inactive";
}

const statusColor = {
  Active: "bg-green-100 text-green-800",
  Inactive: "bg-red-100 text-red-800",
};

// TODO: Replace this mock data with your actual schedule data source or import
const scheduleData: TimetableSchedule[] = [
  { id: 1, subject: "CS101", section: "A", faculty: "Dr. Alice Johnson", room: "101", day: "Monday", time: "08:00 - 09:00 AM", status: "Active" },
  { id: 2, subject: "MATH201", section: "B", faculty: "Prof. Bob Smith", room: "202", day: "Tuesday", time: "10:00 - 11:30 AM", status: "Active" },
  { id: 3, subject: "ENG102", section: "A", faculty: "Ms. Carol Lee", room: "103", day: "Wednesday", time: "09:00 - 11:00 AM", status: "Active" },
  { id: 4, subject: "BIO110", section: "C", faculty: "Dr. David Kim", room: "104", day: "Thursday", time: "11:00 - 12:00 PM", status: "Active" },
  { id: 5, subject: "CHEM101", section: "B", faculty: "Prof. Emma Stone", room: "105", day: "Friday", time: "01:00 - 02:00 PM", status: "Active" },
  { id: 6, subject: "PHYS201", section: "A", faculty: "Dr. Frank Miller", room: "106", day: "Monday", time: "02:00 - 03:00 PM", status: "Active" },
  { id: 7, subject: "HIST101", section: "C", faculty: "Ms. Grace Park", room: "107", day: "Tuesday", time: "03:00 - 04:00 PM", status: "Active" },
  { id: 8, subject: "CS102", section: "A", faculty: "Dr. Henry Adams", room: "108", day: "Wednesday", time: "04:00 - 05:00 PM", status: "Active" },
  { id: 9, subject: "MATH202", section: "B", faculty: "Prof. Irene Chen", room: "109", day: "Thursday", time: "08:00 - 10:00 AM", status: "Active" },
  { id: 10, subject: "ENG201", section: "C", faculty: "Ms. Julia Brown", room: "110", day: "Friday", time: "09:00 - 10:00 AM", status: "Active" },
  { id: 11, subject: "BIO210", section: "A", faculty: "Dr. Kevin White", room: "111", day: "Saturday", time: "10:00 - 11:00 AM", status: "Active" },
  { id: 12, subject: "CHEM201", section: "B", faculty: "Prof. Laura Green", room: "112", day: "Monday", time: "11:00 - 12:00 PM", status: "Active" },
  { id: 13, subject: "PHYS101", section: "C", faculty: "Dr. Mike Black", room: "113", day: "Tuesday", time: "01:00 - 02:30 PM", status: "Active" },
  { id: 14, subject: "HIST201", section: "A", faculty: "Ms. Nora Scott", room: "114", day: "Wednesday", time: "02:00 - 03:00 PM", status: "Active" },
  { id: 15, subject: "CS201", section: "B", faculty: "Dr. Oscar King", room: "115", day: "Thursday", time: "03:00 - 04:00 PM", status: "Active" },
];

const ScheduleTable: React.FC = () => {
  const [selectedCell, setSelectedCell] = useState<{ day: string; time: string } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCellClick = (day: string, time: string) => {
    setSelectedCell({ day, time });
    setDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) setSelectedCell(null);
  };

  const cellPadding = 8;

  // Helper: Find schedule for a given day and slot (exact match only)
  function findSchedule(day: string, slot: string): TimetableSchedule | undefined {
    return scheduleData.find(
      (sched) => sched.day === day && sched.time === slot
    );
  }

  return (
    <div className="rounded-md bg-white shadow-lg overflow-x-auto">
      <DialogSchedule dialogOpen={dialogOpen} setDialogOpen={handleDialogClose} selectedCell={selectedCell} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-40 text-center text-base font-bold">Time</TableHead>
            {days.map((day) => (
              <TableHead key={day} className="text-center text-base font-bold">{day}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {timeSlots.map((slot) => {
            if (slot === "12:00 - 01:00 PM") {
              return (
                <TableRow key={slot}>
                  <TableCell colSpan={days.length + 1} className="text-center font-bold text-lg bg-yellow-100 border" style={{ padding: 20 }}>
                    Lunch Break
                  </TableCell>
                </TableRow>
              );
            }
            return (
              <TableRow key={slot}>
                <TableCell className="font-semibold text-center bg-indigo-50 text-indigo-900">{slot}</TableCell>
                {days.map((day) => {
                  const sched = findSchedule(day, slot);
                  if (!sched) {
                    return (
                      <TableCell key={day} className="align-top timetable-cell-hover transition-colors duration-200 cursor-pointer border" style={{ padding: cellPadding }} onClick={() => handleCellClick(day, slot)}>
                        <span className="text-green-400 text-xs flex text-center items-center justify-center h-full">Available</span>
                      </TableCell>
                    );
                  }
                  return (
                    <TableCell
                      key={day}
                      className="align-top transition-colors duration-200 cursor-pointer relative"
                      style={{
                        verticalAlign: "top",
                        position: "relative",
                        padding: `${cellPadding}px`,
                        minHeight: 60,
                      }}
                      onClick={() => handleCellClick(day, slot)}
                    >
                      <div
                        style={{
                          position: "relative",
                          height: "100%",
                          minHeight: 60,
                          display: "flex",
                          flexDirection: "column",
                          overflow: "hidden",
                          padding: 8,
                          margin: 4,
                          background: subjectColor[sched.subject] || '#bbf7d0',
                          borderRadius: 8,
                          boxSizing: "border-box",
                        }}
                      >
                        <div className="font-bold text-sm">
                          {sched.subject} <span className="font-normal">({sched.section})</span>
                        </div>
                        <div className="text-xs text-gray-700">{sched.faculty}</div>
                        <div className="text-xs text-gray-600">Room: {sched.room}</div>
                        <div className="text-xs text-gray-600">{sched.time}</div>
                        <div className="text-xs mt-1">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-semibold ${statusColor[sched.status]}`}>
                            {sched.status}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ScheduleTable;