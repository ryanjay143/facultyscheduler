import { useState, useMemo } from "react";
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
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Building,
  Filter,
  MoreVertical,
  Users
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// I-import ang inilipat na modal
import { RoomFormModal } from "../modal/RoomFormModal";

// I-export ang type para magamit sa modal
export interface Room {
  id: number;
  roomNumber: string;
  building: string;
  type: "Lecture" | "Laboratory" | "Auditorium" | "Other";
  capacity: number;
  status: "Available" | "Occupied" | "Maintenance";
}

const initialRoomData: Room[] = [
    { id: 1, roomNumber: "101", building: "Engineering", type: "Lecture", capacity: 40, status: "Available" },
    { id: 2, roomNumber: "202", building: "Science", type: "Laboratory", capacity: 30, status: "Occupied" },
    { id: 3, roomNumber: "A1", building: "Main", type: "Auditorium", capacity: 120, status: "Maintenance" },
    { id: 4, roomNumber: "303", building: "Business", type: "Lecture", capacity: 35, status: "Available" },
    { id: 5, roomNumber: "B2", building: "Arts", type: "Other", capacity: 25, status: "Occupied" },
];

function RoomTable() {
  const [rooms, setRooms] = useState<Room[]>(initialRoomData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ building: "All", type: "All" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const filteredData = useMemo(() => {
    return rooms
      .filter((room) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          room.roomNumber.toLowerCase().includes(searchLower) ||
          room.building.toLowerCase().includes(searchLower) ||
          room.type.toLowerCase().includes(searchLower)
        );
      })
      .filter((room) => filters.building === "All" || room.building === filters.building)
      .filter((room) => filters.type === "All" || room.type === filters.type);
  }, [rooms, searchTerm, filters]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleAdd = () => { setEditingRoom(null); setIsModalOpen(true); };
  const handleEdit = (room: Room) => { setEditingRoom(room); setIsModalOpen(true); };
  const handleDelete = (roomId: number) => { if (window.confirm("Are you sure?")) { setRooms(rooms.filter((r) => r.id !== roomId)); } };
  const handleSave = (roomData: Omit<Room, "id">) => {
    if (editingRoom) {
      setRooms(rooms.map((r) => (r.id === editingRoom.id ? { ...editingRoom, ...roomData } : r)));
    } else {
      setRooms([{ id: Date.now(), ...roomData }, ...rooms]);
    }
    setIsModalOpen(false);
  };

  const buildings = ["All", ...Array.from(new Set(initialRoomData.map((r) => r.building)))];
  const types = ["All", "Lecture", "Laboratory", "Auditorium", "Other"];

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Classroom Management</h1>
        <p className="text-muted-foreground mt-2">Manage and monitor all classrooms and laboratories.</p>
      </header>

      <div className="bg-card p-4 md:p-6 rounded-lg shadow-sm border border-border">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Search by room or building..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Select value={filters.building} onValueChange={(v) => setFilters((f) => ({ ...f, building: v }))}>
              <SelectTrigger className="w-full sm:w-auto md:w-[180px]">
                <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="All Buildings" />
              </SelectTrigger>
              <SelectContent>{buildings.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={filters.type} onValueChange={(v) => setFilters((f) => ({ ...f, type: v }))}>
              <SelectTrigger className="w-full sm:w-auto md:w-[180px]">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>{types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
            <Button onClick={handleAdd} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" /> Add Room
            </Button>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="rounded-lg border border-border overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Room</TableHead>
                <TableHead>Total Subjects</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-center">Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-48 text-muted-foreground">
                    No rooms found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((room) => (
                  <TableRow key={room.id} className="hover:bg-muted">
                    <TableCell><p className="font-semibold text-foreground">{room.roomNumber}</p></TableCell>
                    <TableCell className="text-muted-foreground">10</TableCell>
                    <TableCell className="text-muted-foreground">{room.type}</TableCell>
                    <TableCell className="text-center text-muted-foreground">
                        <div className="flex items-center justify-center gap-2">
                           <Users size={14} /><span>{room.capacity}</span>
                        </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={room.status === "Available" ? "default" : room.status === "Occupied" ? "secondary" : "destructive"}>
                        {room.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(room)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(room.id)} className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 text-sm gap-4">
          <p className="text-muted-foreground">
            Showing {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4 mr-1" /> Previous</Button>
            <span className="font-medium">{currentPage} of {totalPages || 1}</span>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}>Next <ChevronRight className="h-4 w-4 ml-1" /></Button>
          </div>
        </div>
      </div>

      {/* I-render ang modal at ipasa ang props */}
      <RoomFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingRoom}
      />
    </>
  );
}

export default RoomTable;


