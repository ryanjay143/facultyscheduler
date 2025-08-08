import Header from "../layouts/Header";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, ChevronRight } from "lucide-react";

const dummyClasses = [
    { 
        subjectCode: "IT-321", 
        subjectName: "Advanced Web Development", 
        section: "BSIT 3-A", 
        studentCount: 35, 
        days: ["Mon", "Wed"],
    },
    { 
        subjectCode: "CS-101", 
        subjectName: "Intro to Programming", 
        section: "BSCS 1-B", 
        studentCount: 42, 
        days: ["Mon"],
    },
    { 
        subjectCode: "IT-412", 
        subjectName: "Project Management", 
        section: "BSIT 4-A", 
        studentCount: 28, 
        days: ["Tue", "Fri"],
    },
    { 
        subjectCode: "GE-101", 
        subjectName: "Purposive Comm.", 
        section: "BSCS 1-B", 
        studentCount: 45, 
        days: ["Thu"],
    },
];

const dayColors: Record<string, string> = {
    Mon: "bg-sky-100 text-sky-800",
    Tue: "bg-amber-100 text-amber-800",
    Wed: "bg-sky-100 text-sky-800",
    Thu: "bg-rose-100 text-rose-800",
    Fri: "bg-purple-100 text-purple-800",
};

function ClassList() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />

      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        
        <div className="flex items-center gap-3 mb-8">
            <BookOpen className="w-8 h-8 text-purple-600" />
            <div>
                <h1 className="text-3xl font-bold text-gray-800">My Classes</h1>
                <p className="text-gray-500 mt-1">A condensed summary of your assigned classes.</p>
            </div>
        </div>

        {/* --- List Container --- */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200/80">
          <ul className="divide-y divide-gray-200">
            {dummyClasses.map((classInfo, index) => (
              // --- 1. ANG BORDER KAY USA NA LANG KA KOLOR (e.g., border-purple-500) ---
              <li key={index} className="relative p-4 group hover:bg-gray-50/70 transition-colors border-l-4 border-purple-500">
                <div className="grid grid-cols-12 items-center gap-x-4 gap-y-2">

                    {/* Main Info */}
                    <div className="col-span-12 md:col-span-6">
                        <p className="font-bold text-gray-800">{classInfo.subjectCode}: {classInfo.subjectName}</p>
                        <p className="text-sm text-gray-500">Section {classInfo.section}</p>
                    </div>
                  
                    {/* Student Count */}
                    <div className="col-span-6 md:col-span-2 flex items-center gap-2">
                        <Users size={16} className="text-gray-400"/>
                        <span className="font-semibold text-gray-700">{classInfo.studentCount}</span>
                        <span className="text-gray-500 hidden lg:inline">Students</span>
                    </div>

                    {/* Day Badges */}
                    <div className="col-span-6 md:col-span-3 flex items-center justify-start md:justify-end gap-2">
                        {classInfo.days.map(day => (
                          <span key={day} className={`px-2.5 py-1 text-xs font-bold rounded-full ${dayColors[day]}`}>{day}</span>
                        ))}
                    </div>

                    {/* Action Button */}
                    <div className="col-span-12 md:col-span-1 flex justify-end">
                        <Button variant="ghost" size="icon" className="group-hover:bg-gray-200 rounded-full">
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </Button>
                    </div>

                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ClassList;