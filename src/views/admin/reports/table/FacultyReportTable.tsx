import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ViewClassSchedule from '../dialog/ViewClassSchedule';


// Mock Data
type FacultyStatus = "Active" | "Inactive";

type Faculty = {
  id: number;
  name: string;
  department: string;
  email: string;
  status: FacultyStatus;
  avatar: string;
};

const facultyData: Faculty[] = [
  { id: 1, name: "Dr. Alice Johnson", department: "Computer Science", email: "alice.j@university.edu", status: "Active", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
  { id: 2, name: "Prof. Bob Smith", department: "Mathematics", email: "bob.s@university.edu", status: "Inactive", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: 3, name: "Dr. Carol Lee", department: "Physics", email: "carol.l@university.edu", status: "Active", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
  { id: 4, name: "Dr. Emily Clark", department: "English", email: "emily.c@university.edu", status: "Active", avatar: "https://randomuser.me/api/portraits/women/65.jpg" },
];

const statusBadge = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-gray-100 text-gray-600",
};

export const FacultyReportTable: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Faculty</TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Department</TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</TableHead>
            <TableHead className="px-6 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-200">
          {facultyData.map((faculty) => (
            <TableRow key={faculty.id} className="hover:bg-gray-50/70 transition-colors">
              <TableCell className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-4">
                  <img src={faculty.avatar} alt={faculty.name} className="w-11 h-11 rounded-full border-2 border-white ring-2 ring-indigo-100 object-cover"/>
                  <div>
                    <div className="font-semibold text-gray-900">{faculty.name}</div>
                    <div className="text-sm text-gray-500">{faculty.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                  {faculty.department}
                </span>
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusBadge[faculty.status]}`}>
                  <span className={`w-2 h-2 mr-2 rounded-full ${faculty.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                  {faculty.status}
                </span>
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex items-center justify-center gap-2">
                 <ViewClassSchedule facultyName={faculty.name}/>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};