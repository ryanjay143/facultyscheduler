import { Eye, Clock, CalendarDays, MapPin, BookOpen, Printer, CalendarX2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription, 
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';

const scheduleData = [
  { course: "Introduction to AI", code: "CS 401", day: "Monday & Wednesday", time: "10:00 AM - 11:30 AM", room: "Room 301" },
  { course: "Machine Learning", code: "CS 402", day: "Tuesday & Thursday", time: "1:00 PM - 2:30 PM", room: "Room 302" },
  { course: "Data Structures", code: "CS 301", day: "Friday", time: "9:00 AM - 12:00 PM", room: "Lab 5" },
];

function ViewClassSchedule({ facultyName }: any) {

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-2 rounded-full text-indigo-600 hover:bg-indigo-100 hover:text-indigo-600 transition-all" title="View Schedule">
          <Eye size={18} />
        </button>
      </DialogTrigger>
      {/* --- Gibag-o ang className para mas luag ug responsive --- */}
      <DialogContent className="max-w-3xl"> 
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Class Schedule for <span className="text-indigo-600">{facultyName}</span>
          </DialogTitle>
          {/* --- GI-DUGANG NGA DESCRIPTION --- */}
          <DialogDescription>
            Here is the weekly teaching schedule. You can print the schedule if needed.
          </DialogDescription>
        </DialogHeader>

        {/* --- GI-DUGANG NGA DIVIDER --- */}
        <div className="my-4 border-t border-gray-200" />

        <div className="mt-2">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 hover:bg-gray-100/80">
                <TableHead className="font-semibold text-white"><BookOpen size={16} className="inline-block mr-2" />Course</TableHead>
                <TableHead className="font-semibold text-white"><CalendarDays size={16} className="inline-block mr-2" />Day</TableHead>
                <TableHead className="font-semibold text-white"><Clock size={16} className="inline-block mr-2" />Time</TableHead>
                <TableHead className="font-semibold text-white"><MapPin size={16} className="inline-block mr-2" />Room</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* --- GI-DUGANG NGA KONDISYON PARA SA EMPTY STATE --- */}
              {scheduleData.length > 0 ? (
                scheduleData.map((item, index) => (
                  // --- GI-DUGANG NGA className PARA SA STRIPED ROWS ---
                  <TableRow key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/70'}>
                    <TableCell>
                      <div className="font-medium text-gray-900">{item.course}</div>
                      <div className="text-xs text-gray-500">{item.code}</div>
                    </TableCell>
                    <TableCell className="text-gray-700">{item.day}</TableCell>
                    <TableCell className="text-gray-700">{item.time}</TableCell>
                    <TableCell>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          {item.room}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                // --- KINI ANG EMPTY STATE VIEW ---
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <CalendarX2 className="h-10 w-10 text-gray-400" />
                      <p className="text-lg font-medium text-gray-600">No Schedule Found</p>
                      <p className="text-sm text-gray-500">There is no class schedule available for this faculty.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DialogFooter className="mt-6 sm:justify-between">
            {/* --- GI-DUGANG NGA PRINT BUTTON --- */}
            <Button onClick={handlePrint} variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                Print Schedule
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ViewClassSchedule;