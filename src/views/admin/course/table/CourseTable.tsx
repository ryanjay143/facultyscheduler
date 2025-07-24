import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Pencil } from "lucide-react";

// Updated Course interface
interface Course {
  id: number;
  code: string;
  name: string;
  units: number;
  department: string;
  faculty: string;
  capacity: number;
  status: "Active" | "Inactive";
}

// Expanded sample course data (15 rows)
const courseData: Course[] = [
  {
    id: 1,
    code: "CS101",
    name: "Introduction to Computer Science",
    units: 3,
    department: "Computer Science",
    faculty: "Dr. Alice Johnson",
    capacity: 40,
    status: "Active",
  },
  {
    id: 2,
    code: "MATH201",
    name: "Calculus II",
    units: 4,
    department: "Mathematics",
    faculty: "Prof. Bob Smith",
    capacity: 35,
    status: "Active",
  },
  {
    id: 3,
    code: "PHY110",
    name: "General Physics",
    units: 4,
    department: "Physics",
    faculty: "Dr. Carol Lee",
    capacity: 50,
    status: "Inactive",
  },
  {
    id: 4,
    code: "ENG102",
    name: "English Composition",
    units: 3,
    department: "English",
    faculty: "Ms. Emily Clark",
    capacity: 45,
    status: "Active",
  },
  {
    id: 5,
    code: "HIST210",
    name: "World History",
    units: 3,
    department: "History",
    faculty: "Dr. Michael Brown",
    capacity: 38,
    status: "Active",
  },
  {
    id: 6,
    code: "BIO120",
    name: "Biology Basics",
    units: 4,
    department: "Biology",
    faculty: "Dr. Susan Green",
    capacity: 42,
    status: "Inactive",
  },
  {
    id: 7,
    code: "CHEM101",
    name: "General Chemistry",
    units: 4,
    department: "Chemistry",
    faculty: "Prof. David Lee",
    capacity: 36,
    status: "Active",
  },
  {
    id: 8,
    code: "ART105",
    name: "Art Appreciation",
    units: 2,
    department: "Arts",
    faculty: "Ms. Laura White",
    capacity: 30,
    status: "Active",
  },
  {
    id: 9,
    code: "PSY101",
    name: "Introduction to Psychology",
    units: 3,
    department: "Psychology",
    faculty: "Dr. Brian Adams",
    capacity: 48,
    status: "Inactive",
  },
  {
    id: 10,
    code: "SOC201",
    name: "Sociology",
    units: 3,
    department: "Sociology",
    faculty: "Prof. Karen Miller",
    capacity: 33,
    status: "Active",
  },
  {
    id: 11,
    code: "PHIL101",
    name: "Philosophy",
    units: 2,
    department: "Philosophy",
    faculty: "Dr. George King",
    capacity: 28,
    status: "Active",
  },
  {
    id: 12,
    code: "ECON101",
    name: "Principles of Economics",
    units: 3,
    department: "Economics",
    faculty: "Ms. Olivia Scott",
    capacity: 41,
    status: "Inactive",
  },
  {
    id: 13,
    code: "STAT201",
    name: "Statistics",
    units: 4,
    department: "Mathematics",
    faculty: "Dr. Henry Evans",
    capacity: 37,
    status: "Active",
  },
  {
    id: 14,
    code: "CS202",
    name: "Data Structures",
    units: 4,
    department: "Computer Science",
    faculty: "Dr. Alice Johnson",
    capacity: 32,
    status: "Active",
  },
  {
    id: 15,
    code: "MUS101",
    name: "Music Theory",
    units: 2,
    department: "Music",
    faculty: "Ms. Rachel Turner",
    capacity: 25,
    status: "Inactive",
  },
];

const statusColor = {
  Active: "bg-green-100 text-green-800",
  Inactive: "bg-red-100 text-red-800",
};

function getPaginationSummary(
  currentPage: number,
  itemsPerPage: number | "All",
  totalItems: number
): string {
  if (totalItems === 0) {
    return "No entries to show";
  }
  const start =
    totalItems === 0
      ? 0
      : (currentPage - 1) * (itemsPerPage === "All" ? totalItems : itemsPerPage) + 1;
  const end =
    itemsPerPage === "All"
      ? totalItems
      : Math.min(currentPage * (itemsPerPage as number), totalItems);

  return `Showing ${start} to ${end} of ${totalItems} entries`;
}

function CourseTable() {
  const [itemsPerPage, setItemsPerPage] = React.useState<string>("All");
  const [search, setSearch] = React.useState<string>("");

  // Filtered and paginated data
  const filteredData = React.useMemo(() => {
    let data = courseData;
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      data = data.filter(
        (c) =>
          c.code.toLowerCase().includes(s) ||
          c.name.toLowerCase().includes(s) ||
          c.department.toLowerCase().includes(s) ||
          c.faculty.toLowerCase().includes(s)
      );
    }
    if (itemsPerPage !== "All") {
      const n = parseInt(itemsPerPage, 10);
      data = data.slice(0, n);
    }
    return data;
  }, [search, itemsPerPage]);

  // Handlers for actions (replace with your logic)
  const handleView = (course: Course) => {
    alert(`View course: ${course.name}`);
  };

  const handleEdit = (course: Course) => {
    alert(`Edit course: ${course.name}`);
  };

  return (
    <>
      <div className="flex flex-row md:flex-row gap-4 justify-between mb-3">
        <div className="flex-1 flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Show</span>
          <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
            <SelectTrigger className="w-24 border-primary focus:border-primary focus:ring-blue-500">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="40">40</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm font-medium text-gray-700">entries</span>
        </div>

        <div className="flex items-center gap-2">
          <Input
            placeholder="Search Course"
            className="w-56 border-primary focus:border-primary focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead>Course Code</TableHead>
              <TableHead>Course Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Faculty</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  No courses found.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((course, idx) => (
                <TableRow
                  key={course.id}
                  className="transition-all hover:bg-blue-50/70"
                >
                  <TableCell className="font-semibold text-center">
                    {idx + 1}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {course.code}
                  </TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>
                    <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-semibold">
                      {course.department}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-block px-2 py-1 rounded bg-indigo-100 text-indigo-800 text-xs font-semibold">
                      {course.faculty}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-semibold">
                      {course.capacity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${statusColor[course.status]}`}
                    >
                      {course.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      onClick={() => handleView(course)}
                      className="inline-flex items-center justify-center p-2 rounded hover:bg-blue-100 text-blue-600 transition"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(course)}
                      className="inline-flex items-center justify-center p-2 rounded hover:bg-green-100 text-green-600 transition ml-1"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination summary at the bottom right */}
      <div className="flex flex-row justify-end mt-3">
        <div>
          <p className="text-[#3b0764] text-sm w-full">
            {getPaginationSummary(
              1,
              itemsPerPage === "All" ? filteredData.length : parseInt(itemsPerPage, 10),
              filteredData.length
            )}
          </p>
        </div>
      </div>
    </>
  );
}

export default CourseTable;