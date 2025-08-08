import Header from "../layouts/Header";
import { Button } from "@/components/ui/button";
import { Download, ChevronLeft, ChevronRight, CalendarDays, Coffee, Bookmark, MapPin } from "lucide-react";

const subjectColor: Record<string, { bg: string; text: string; border: string; }> = {
    "IT-321": { bg: "bg-sky-100", text: "text-sky-800", border: "border-sky-500" },
    "CS-101": { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-500" },
    "IT-412": { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-500" },
    "GE-101": { bg: "bg-rose-100", text: "text-rose-800", border: "border-rose-500" },
};

// --- GI-UPDATE ANG ORAS SA 12-HOUR FORMAT ---
const dummyScheduleData = [
    { id: 1, day: "Monday", time: "08:30 AM - 10:00 AM", subjectCode: "IT-321", subjectName: "Advanced Web Dev", section: "BSIT 3-A", room: "Room 404" },
    { id: 2, day: "Monday", time: "01:00 PM - 02:30 PM", subjectCode: "CS-101", subjectName: "Intro to Programming", section: "BSCS 1-B", room: "Room 301" },
    { id: 3, day: "Tuesday", time: "10:00 AM - 11:30 AM", subjectCode: "IT-412", subjectName: "Project Management", section: "BSIT 4-A", room: "Lab 2" },
    { id: 4, day: "Wednesday", time: "08:30 AM - 10:00 AM", subjectCode: "IT-321", subjectName: "Advanced Web Dev", section: "BSIT 3-A", room: "Room 404" },
    { id: 5, day: "Thursday", time: "02:30 PM - 04:00 PM", subjectCode: "GE-101", subjectName: "Purposive Communication", section: "BSCS 1-B", room: "Room 202" },
    { id: 6, day: "Friday", time: "10:00 AM - 11:30 AM", subjectCode: "IT-412", subjectName: "Project Management", section: "BSIT 4-A", room: "Lab 2" },
];

const timeSlots = [
    "07:00 AM - 08:30 AM", 
    "08:30 AM - 10:00 AM", 
    "10:00 AM - 11:30 AM", 
    "11:30 AM - 01:00 PM", 
    "01:00 PM - 02:30 PM", 
    "02:30 PM - 04:00 PM", 
    "04:00 PM - 05:30 PM",
];
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


function FacultySchedule() {

  const findScheduleForSlot = (day: string, time: string) => {
    return dummyScheduleData.find(schedule => schedule.day === day && schedule.time === time);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />

      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center gap-3">
             <CalendarDays className="w-8 h-8 text-purple-600" />
             <div>
                <h1 className="text-3xl font-bold text-gray-800">My Schedule</h1>
                <p className="text-gray-500 mt-1">Your teaching schedule for the week.</p>
             </div>
          </div>
          <Button className="mt-4 md:mt-0 flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md transition">
            <Download className="w-5 h-5" />
            Download Schedule
          </Button>
        </div>

        <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2">
                 <Button variant="outline" size="icon" className="h-9 w-9 border-gray-300 hover:bg-gray-100">
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                 <Button variant="outline" size="icon" className="h-9 w-9 border-gray-300 hover:bg-gray-100">
                    <ChevronRight className="h-5 w-5" />
                </Button>
                <Button variant="outline" className="h-9 hidden md:block border-gray-300 hover:bg-gray-100">Today</Button>
            </div>
            <p className="text-lg font-bold text-purple-700">
                August 4 - 9, 2025
            </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg border border-gray-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-xs text-gray-600 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 w-48 font-bold">Time</th>
                  {daysOfWeek.map(day => (
                    <th key={day} scope="col" className="px-6 py-4 font-bold">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(time => {
                  // --- GI-UPDATE ANG CHECK PARA SA LUNCH BREAK ---
                  if (time === "11:30 AM - 01:00 PM") {
                      return (
                          <tr key={time}><td colSpan={daysOfWeek.length + 1} className="text-center font-semibold text-sm text-gray-500 bg-gray-50 border-y">
                              <div className="flex items-center justify-center gap-2 py-3">
                                  <Coffee size={16} /> LUNCH BREAK
                              </div>
                          </td></tr>
                      )
                  }
                  return (
                    <tr key={time} className="border-b border-gray-200/80">
                      <td className="px-6 py-4 font-semibold text-sm text-center text-gray-700 bg-gray-50/70 whitespace-nowrap">
                        {time}
                      </td>
                      {daysOfWeek.map(day => {
                        const schedule = findScheduleForSlot(day, time);
                        const colors = schedule ? subjectColor[schedule.subjectCode] : null;
                        return (
                          <td key={`${day}-${time}`} className="px-2 py-2 align-top border-l border-gray-200/80">
                            {schedule && colors ? (
                              <div className={`group relative p-3 rounded-lg h-32 flex flex-col transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:z-10 ${colors.bg} ${colors.border}`}>
                                <p className={`font-extrabold ${colors.text}`}>{schedule.subjectCode}</p>
                                <p className="text-sm font-semibold text-gray-700 leading-tight">{schedule.subjectName}</p>
                                <div className="mt-auto space-y-1 pt-2">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                        <Bookmark size={12} /> <span>{schedule.section}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                        <MapPin size={12} /> <span>{schedule.room}</span>
                                    </div>
                                </div>
                              </div>
                            ) : (
                              <div className="h-32 rounded-lg transition-colors hover:bg-gray-50"></div> // Empty slot
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default FacultySchedule;