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

interface Faculty {
  id: number;
  name: string;
  department: string;
  email: string;
  status: "Active" | "Inactive";
  avatar?: string;
}

const facultyData: Faculty[] = [
  {
    id: 1,
    name: "Dr. Alice Johnson",
    department: "Computer Science",
    email: "alice.johnson@university.edu",
    status: "Active",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 2,
    name: "Prof. Bob Smith",
    department: "Mathematics",
    email: "bob.smith@university.edu",
    status: "Inactive",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 3,
    name: "Dr. Carol Lee",
    department: "Physics",
    email: "carol.lee@university.edu",
    status: "Active",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: 4,
    name: "Dr. Emily Clark",
    department: "English",
    email: "emily.clark@university.edu",
    status: "Active",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: 5,
    name: "Dr. Michael Brown",
    department: "History",
    email: "michael.brown@university.edu",
    status: "Active",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    id: 6,
    name: "Dr. Susan Green",
    department: "Biology",
    email: "susan.green@university.edu",
    status: "Inactive",
    avatar: "https://randomuser.me/api/portraits/women/23.jpg",
  },
  {
    id: 7,
    name: "Prof. David Lee",
    department: "Chemistry",
    email: "david.lee@university.edu",
    status: "Active",
    avatar: "https://randomuser.me/api/portraits/men/56.jpg",
  },
  {
    id: 8,
    name: "Ms. Laura White",
    department: "Arts",
    email: "laura.white@university.edu",
    status: "Active",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    id: 9,
    name: "Dr. Brian Adams",
    department: "Psychology",
    email: "brian.adams@university.edu",
    status: "Inactive",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
  },
  {
    id: 10,
    name: "Prof. Karen Miller",
    department: "Sociology",
    email: "karen.miller@university.edu",
    status: "Active",
    avatar: "https://randomuser.me/api/portraits/women/77.jpg",
  },
  {
    id: 11,
    name: "Dr. George King",
    department: "Philosophy",
    email: "george.king@university.edu",
    status: "Active",
    avatar: "https://randomuser.me/api/portraits/men/78.jpg",
  },
  {
    id: 12,
    name: "Ms. Olivia Scott",
    department: "Economics",
    email: "olivia.scott@university.edu",
    status: "Inactive",
    avatar: "https://randomuser.me/api/portraits/women/81.jpg",
  },
  {
    id: 13,
    name: "Dr. Henry Evans",
    department: "Mathematics",
    email: "henry.evans@university.edu",
    status: "Active",
    avatar: "https://randomuser.me/api/portraits/men/82.jpg",
  },
  {
    id: 14,
    name: "Dr. Rachel Turner",
    department: "Music",
    email: "rachel.turner@university.edu",
    status: "Inactive",
    avatar: "https://randomuser.me/api/portraits/women/83.jpg",
  },
  {
    id: 15,
    name: "Dr. Samuel Carter",
    department: "Engineering",
    email: "samuel.carter@university.edu",
    status: "Active",
    avatar: "https://randomuser.me/api/portraits/men/84.jpg",
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

function FacultyTable() {
  const [itemsPerPage, setItemsPerPage] = React.useState<string>("All");
  const [search, setSearch] = React.useState<string>("");

  // Filtered and paginated data
  const filteredData = React.useMemo(() => {
    let data = facultyData;
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      data = data.filter(
        (f) =>
          f.name.toLowerCase().includes(s) ||
          f.department.toLowerCase().includes(s) ||
          f.email.toLowerCase().includes(s)
      );
    }
    if (itemsPerPage !== "All") {
      const n = parseInt(itemsPerPage, 10);
      data = data.slice(0, n);
    }
    return data;
  }, [search, itemsPerPage]);

  // Handlers for actions (replace with your logic)
  const handleView = (faculty: Faculty) => {
    alert(`View faculty: ${faculty.name}`);
  };

  const handleEdit = (faculty: Faculty) => {
    alert(`Edit faculty: ${faculty.name}`);
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
            placeholder="Search Faculty"
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
              <TableHead className="w-16 text-center">#</TableHead>
              <TableHead>Faculty</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No faculty found.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((faculty, idx) => (
                <TableRow
                  key={faculty.id}
                  className="transition-all hover:bg-blue-50/70"
                >
                  <TableCell className="font-semibold text-center">
                    {idx + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={faculty.avatar}
                        alt={faculty.name}
                        className="w-10 h-10 rounded-full border-2 border-blue-200 shadow-sm object-cover"
                      />
                      <span className="font-medium text-gray-900">{faculty.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-semibold">
                      {faculty.department}
                    </span>
                  </TableCell>
                  <TableCell>
                    <a
                      href={`mailto:${faculty.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {faculty.email}
                    </a>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${statusColor[faculty.status]}`}
                    >
                      {faculty.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      onClick={() => handleView(faculty)}
                      className="inline-flex items-center justify-center p-2 rounded hover:bg-blue-100 text-blue-600 transition"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(faculty)}
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

export default FacultyTable;