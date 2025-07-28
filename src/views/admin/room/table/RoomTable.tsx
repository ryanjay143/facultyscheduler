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
import { Eye, Pencil, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// Room interface and mock data
interface Room {
  id: number;
  roomNumber: string;
  building: string;
  type: "Lecture" | "Laboratory" | "Auditorium" | "Other";
  capacity: number;
  status: "Available" | "Occupied" | "Maintenance";
}

const roomData: Room[] = [
  { id: 1, roomNumber: "101", building: "Engineering", type: "Lecture", capacity: 40, status: "Available" },
  { id: 2, roomNumber: "202", building: "Science", type: "Laboratory", capacity: 30, status: "Occupied" },
  { id: 3, roomNumber: "A1", building: "Main", type: "Auditorium", capacity: 120, status: "Maintenance" },
  { id: 4, roomNumber: "303", building: "Business", type: "Lecture", capacity: 35, status: "Available" },
  { id: 5, roomNumber: "B2", building: "Arts", type: "Other", capacity: 25, status: "Occupied" },
  { id: 6, roomNumber: "404", building: "Engineering", type: "Laboratory", capacity: 28, status: "Available" },
  { id: 7, roomNumber: "C1", building: "Science", type: "Lecture", capacity: 32, status: "Maintenance" },
  { id: 8, roomNumber: "D5", building: "Main", type: "Other", capacity: 20, status: "Available" },
  { id: 9, roomNumber: "E2", building: "Business", type: "Auditorium", capacity: 100, status: "Occupied" },
  { id: 10, roomNumber: "F3", building: "Arts", type: "Lecture", capacity: 45, status: "Available" },
  { id: 11, roomNumber: "G7", building: "Engineering", type: "Laboratory", capacity: 27, status: "Maintenance" },
  { id: 12, roomNumber: "H1", building: "Science", type: "Lecture", capacity: 38, status: "Available" },
  { id: 13, roomNumber: "I2", building: "Main", type: "Other", capacity: 22, status: "Occupied" },
  { id: 14, roomNumber: "J4", building: "Business", type: "Auditorium", capacity: 110, status: "Available" },
  { id: 15, roomNumber: "K6", building: "Arts", type: "Lecture", capacity: 50, status: "Occupied" },
];

const statusColor = {
  Available: "bg-green-100 text-green-800 border border-green-300",
  Occupied: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  Maintenance: "bg-red-100 text-red-800 border border-red-300",
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

function RoomTable() {
  const [itemsPerPage, setItemsPerPage] = React.useState<string>("All");
  const [search, setSearch] = React.useState<string>("");

  // Filtered and paginated data
  const filteredData = React.useMemo(() => {
    let data = roomData;
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      data = data.filter(
        (r) =>
          r.roomNumber.toLowerCase().includes(s) ||
          r.building.toLowerCase().includes(s) ||
          r.type.toLowerCase().includes(s) ||
          r.status.toLowerCase().includes(s) ||
          r.capacity.toString().includes(s)
      );
    }
    if (itemsPerPage !== "All") {
      const n = parseInt(itemsPerPage, 10);
      data = data.slice(0, n);
    }
    return data;
  }, [search, itemsPerPage]);

  // Handlers for actions (replace with your logic)
  const handleView = (room: Room) => {
    alert(`View room: ${room.roomNumber} (${room.building})`);
  };

  const handleEdit = (room: Room) => {
    alert(`Edit room: ${room.roomNumber} (${room.building})`);
  };

  return (
    <>
      <div className="flex flex-row gap-4 justify-between items-center mb-5 md:mb-10">
        <h1 className="text-2xl md:text-2xl font-extrabold text-gray-800 tracking-tight">
          Manage Rooms
        </h1>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Room
        </Button>
      </div>
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
            placeholder="Search Room"
            className="w-56 md:w-full border-primary focus:border-primary focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-lg overflow-x-auto md:w-[365px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-center">#</TableHead>
              <TableHead>Room Number</TableHead>
              <TableHead>Building</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No rooms found.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((room, idx) => (
                <TableRow
                  key={room.id}
                  className="transition-all hover:bg-blue-50/70"
                >
                  <TableCell className="font-semibold text-center">
                    {idx + 1}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {room.roomNumber}
                  </TableCell>
                  <TableCell>
                    <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-semibold">
                      {room.building}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-block px-2 py-1 rounded bg-indigo-100 text-indigo-800 text-xs font-semibold">
                      {room.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-block px-2 py-1 rounded bg-gray-100 text-gray-800 text-xs font-semibold">
                      {room.capacity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${statusColor[room.status]}`}
                    >
                      {room.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      onClick={() => handleView(room)}
                      className="inline-flex items-center justify-center p-2 rounded hover:bg-blue-100 text-blue-600 transition"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(room)}
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

export default RoomTable;