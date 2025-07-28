import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from 'lucide-react';

// Mock Data
type Status = "Active" | "Inactive";

interface ScheduleItem {
  id: number;
  subject: string;
  section: string;
  faculty: string;
  time: string;
  room: string;
  status: Status;
}

const scheduleData: ScheduleItem[] = [
  { id: 1, subject: "CS101 - Intro to Programming", section: "A", faculty: "Dr. Alice Johnson", time: "Mon 08:00 AM", room: "101", status: "Active" },
  { id: 2, subject: "MATH201 - Calculus II", section: "B", faculty: "Prof. Bob Smith", time: "Tue 10:00 AM", room: "202", status: "Active" },
  { id: 3, subject: "ENG102 - English Composition", section: "A", faculty: "Ms. Carol Lee", time: "Wed 09:00 AM", room: "103", status: "Inactive" },
  { id: 4, subject: "BIO110 - General Biology", section: "C", faculty: "Dr. David Kim", time: "Thu 11:00 AM", room: "104", status: "Active" },
];

const statusBadge: Record<Status, string> = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-gray-100 text-gray-600",
};

export const ClassScheduleReportTable: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Class / Section</TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Faculty</TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Schedule</TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</TableHead>
            <TableHead className="px-6 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-200">
          {scheduleData.map((item) => (
            <TableRow key={item.id} className="hover:bg-gray-50/70 transition-colors">
              <TableCell className="px-6 py-4 whitespace-nowrap">
                <div className="font-semibold text-gray-900">{item.subject}</div>
                <div className="text-sm text-gray-500">Section {item.section}</div>
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.faculty}</TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-800">{item.time}</div>
                <div className="text-xs text-gray-500">Room: {item.room}</div>
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusBadge[item.status]}`}>
                  <span className={`w-2 h-2 mr-2 rounded-full ${item.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                  {item.status}
                </span>
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex items-center justify-center gap-2">
                    <button className="p-2 rounded-full text-indigo-600 hover:bg-indigo-100 hover:text-indigo-600 transition-all" title="Edit">
                        <Eye size={18} />
                    </button>
                    
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};