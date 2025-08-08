import { useState, forwardRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DialogSchedule from "../dialog/DialogScheduleFaculty";
import { Pencil, Trash2 } from "lucide-react"; // --- 1. IMPORT NEW ICONS
import "./../style.css"; 

// --- Data, Interfaces, and Color Palettes (No changes here) ---
const subjectColor: Record<string, string> = {
    CS101: "bg-green-100 text-green-800 border-l-4 border-green-500",
    MATH201: "bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500",
    ENG102: "bg-sky-100 text-sky-800 border-l-4 border-sky-500",
    BIO110: "bg-red-100 text-red-800 border-l-4 border-red-500",
    CHEM101: "bg-orange-100 text-orange-800 border-l-4 border-orange-500",
    PHYS201: "bg-indigo-100 text-indigo-800 border-l-4 border-indigo-500",
    HIST101: "bg-amber-100 text-amber-800 border-l-4 border-amber-500",
    CS102: "bg-pink-100 text-pink-800 border-l-4 border-pink-500",
    MATH202: "bg-teal-100 text-teal-800 border-l-4 border-teal-500",
    ENG201: "bg-purple-100 text-purple-800 border-l-4 border-purple-500",
    BIO210: "bg-lime-100 text-lime-800 border-l-4 border-lime-500",
    CHEM201: "bg-cyan-100 text-cyan-800 border-l-4 border-cyan-500",
    PHYS101: "bg-blue-100 text-blue-800 border-l-4 border-blue-500",
    HIST201: "bg-rose-100 text-rose-800 border-l-4 border-rose-500",
    CS201: "bg-fuchsia-100 text-fuchsia-800 border-l-4 border-fuchsia-500",
};
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const timeSlots = [
  "08:00 - 09:00 AM", "09:00 - 10:00 AM", "10:00 - 11:00 AM", "11:00 - 12:00 PM",
  "12:00 - 01:00 PM", "01:00 - 02:00 PM", "02:00 - 03:00 PM", "03:00 - 04:00 PM", "04:00 - 05:00 PM"
];
interface TimetableSchedule {
  id: number; subject: string; section: string; faculty: string; room: string;
  day: string; time: string; status: "Active" | "Inactive";
}
const statusBadge = { Active: "bg-green-200 text-green-900", Inactive: "bg-red-200 text-red-900" };
const scheduleData: TimetableSchedule[] = [
    { id: 1, subject: "CS101", section: "A", faculty: "Dr. Alice Johnson", room: "101", day: "Monday", time: "08:00 - 09:00 AM", status: "Active" },
    { id: 2, subject: "MATH201", section: "B", faculty: "Prof. Bob Smith", room: "202", day: "Tuesday", time: "10:00 - 11:00 AM", status: "Active" },
    { id: 3, subject: "ENG102", section: "A", faculty: "Ms. Carol Lee", room: "103", day: "Wednesday", time: "09:00 - 10:00 AM", status: "Active" },
    { id: 4, subject: "BIO110", section: "C", faculty: "Dr. David Kim", room: "104", day: "Thursday", time: "11:00 - 12:00 PM", status: "Active" },
    { id: 5, subject: "CHEM101", section: "B", faculty: "Prof. Emma Stone", room: "105", day: "Friday", time: "01:00 - 02:00 PM", status: "Active" },
    { id: 6, subject: "PHYS201", section: "A", faculty: "Dr. Frank Miller", room: "106", day: "Monday", time: "02:00 - 03:00 PM", status: "Active" },
    { id: 7, subject: "HIST101", section: "C", faculty: "Ms. Grace Park", room: "107", day: "Tuesday", time: "03:00 - 04:00 PM", status: "Active" },
    { id: 8, subject: "CS102", section: "A", faculty: "Dr. Henry Adams", room: "108", day: "Wednesday", time: "04:00 - 05:00 PM", status: "Active" },
    { id: 9, subject: "MATH202", section: "B", faculty: "Prof. Irene Chen", room: "109", day: "Thursday", time: "08:00 - 09:00 AM", status: "Active" },
    { id: 10, subject: "ENG201", section: "C", faculty: "Ms. Julia Brown", room: "110", day: "Friday", time: "09:00 - 10:00 AM", status: "Active" },
    { id: 11, subject: "BIO210", section: "A", faculty: "Dr. Kevin White", room: "111", day: "Saturday", time: "10:00 - 11:00 AM", status: "Active" },
    { id: 12, subject: "CHEM201", section: "B", faculty: "Prof. Laura Green", room: "112", day: "Monday", time: "11:00 - 12:00 PM", status: "Active" },
    { id: 13, subject: "PHYS101", section: "C", faculty: "Dr. Mike Black", room: "113", day: "Tuesday", time: "01:00 - 02:00 PM", status: "Active" },
    { id: 14, subject: "HIST201", section: "A", faculty: "Ms. Nora Scott", room: "114", day: "Wednesday", time: "02:00 - 03:00 PM", status: "Active" },
    { id: 15, subject: "CS201", section: "B", faculty: "Dr. Oscar King", room: "115", day: "Thursday", time: "03:00 - 04:00 PM", status: "Active" },
];

interface ScheduleTableFacultyProps {}

const ScheduleTableFaculty = forwardRef<HTMLDivElement, ScheduleTableFacultyProps>((_, ref) => {
  const [selectedCell, setSelectedCell] = useState<{ day: string; time: string } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState("All");
  const facultyList = ["All", ...new Set(scheduleData.map(item => item.faculty))].sort();

  const handleCellClick = (day: string, time: string) => {
    if (day === "Sunday") return;
    setSelectedCell({ day, time });
    setDialogOpen(true);
  };

  // --- 2. ADD HANDLER FUNCTIONS ---
  const handleEdit = (schedule: TimetableSchedule) => {
    alert(`Editing schedule for: ${schedule.faculty}`);
    // You can open a dialog here pre-filled with the 'schedule' data
  };

  const handleDelete = (schedule: TimetableSchedule) => {
    if (window.confirm(`Are you sure you want to delete the schedule for ${schedule.subject} with ${schedule.faculty}?`)) {
      alert(`Deleting schedule: ${schedule.subject}`);
      // Add logic to remove the item from 'scheduleData' and update state
    }
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) setSelectedCell(null);
  };

  function findSchedule(day: string, slot: string): TimetableSchedule | undefined {
    return scheduleData.find(sched => sched.day === day && sched.time === slot && (selectedFaculty === "All" || sched.faculty === selectedFaculty));
  }

  return (
    <div className="rounded-xl border bg-white shadow-lg overflow-hidden">
      <DialogSchedule dialogOpen={dialogOpen} setDialogOpen={handleDialogClose} selectedCell={selectedCell} />
      <div className="p-4 bg-purple-100 border-b flex items-center gap-4">
        <label htmlFor="faculty-select" className="font-semibold text-gray-800">Filter by Faculty:</label>
        <select id="faculty-select" value={selectedFaculty} onChange={(e) => setSelectedFaculty(e.target.value)} className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
          {facultyList.map(faculty => <option key={faculty} value={faculty}>{faculty}</option>)}
        </select>
      </div>
      <div ref={ref} className="overflow-x-auto md:w-[365px]">
        <Table className="min-w-full divide-y divide-gray-200">
          <TableHeader>
            <TableRow>
              <TableHead className="w-40 text-center text-sm font-bold text-gray-600 uppercase tracking-wider py-3 px-4 bg-purple-100">Time</TableHead>
              {days.map(day => <TableHead key={day} className="text-center text-sm font-bold text-gray-600 uppercase tracking-wider py-3 px-4 bg-purple-100">{day}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {timeSlots.map(slot => {
              if (slot === "12:00 - 01:00 PM") {
                return <TableRow key={slot}><TableCell colSpan={days.length + 1} className="text-center font-bold text-lg text-yellow-800 bg-yellow-50 border-y-2 border-yellow-200" style={{ padding: '20px' }}>Lunch Break</TableCell></TableRow>;
              }
              return (
                <TableRow key={slot} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="font-semibold text-center text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100">{slot}</TableCell>
                  {days.map(day => {
                    if (day === "Sunday") {
                      return <TableCell key={day} className="align-middle text-center p-2 h-28 border-l bg-gray-50"><div className="flex items-center justify-center h-full"><span className="text-sm font-semibold text-gray-400">NO CLASS</span></div></TableCell>;
                    }
                    const sched = findSchedule(day, slot);
                    return (
                      // --- 3. UPDATED TableCell JSX ---
                      <TableCell
                        key={day}
                        className="align-top p-2 h-28 border-l transition-all duration-200"
                        // Only allow adding schedules on empty cells
                        onClick={() => !sched && handleCellClick(day, slot)}
                      >
                        {sched ? (
                          <div
                            className={`group relative flex flex-col h-full p-3 rounded-lg shadow-md transition-all ${subjectColor[sched.subject] || 'bg-gray-100'}`}
                          >
                            {/* Icons: Appear on Hover */}
                            <div className="absolute top-1 right-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleEdit(sched); }}
                                className="p-1.5 rounded-full bg-white/60 hover:bg-white text-gray-700 hover:text-green-600 transition-all"
                                title="Edit Schedule"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(sched); }}
                                className="p-1.5 rounded-full bg-white/60 hover:bg-white text-gray-700 hover:text-red-600 transition-all"
                                title="Delete Schedule"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            
                            {/* Schedule Info */}
                            <div className="font-bold text-sm">{sched.subject}</div>
                            <div className="text-xs font-medium">{sched.faculty}</div>
                            <div className="text-xs text-gray-600 mt-1">Room: {sched.room}</div>
                            <div className="text-xs text-gray-600">Section: {sched.section}</div>
                            <div className="mt-auto text-right">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadge[sched.status]}`}>
                                {sched.status}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-300 hover:text-green-500 transition-colors cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                          </div>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
});

export default ScheduleTableFaculty;