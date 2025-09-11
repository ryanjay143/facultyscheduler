import React, { useState, useMemo } from "react";
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
    PlusIcon,
    Search,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Building,
    Filter
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// --- TYPE DEFINITIONS & MOCK DATA ---
interface Room {
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
  Available: "bg-green-100 text-green-800",
  Occupied: "bg-yellow-100 text-yellow-800",
  Maintenance: "bg-red-100 text-red-800",
};

// --- MAIN COMPONENT ---
function RoomTable() {
  const [rooms, setRooms] = useState<Room[]>(initialRoomData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ building: 'All', type: 'All' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  // --- DERIVED STATE & MEMOIZATION ---
  const filteredData = useMemo(() => {
    return rooms
      .filter(room => {
        const searchLower = searchTerm.toLowerCase();
        return (
          room.roomNumber.toLowerCase().includes(searchLower) ||
          room.building.toLowerCase().includes(searchLower) ||
          room.type.toLowerCase().includes(searchLower)
        );
      })
      .filter(room => filters.building === 'All' || room.building === filters.building)
      .filter(room => filters.type === 'All' || room.type === filters.type);
  }, [rooms, searchTerm, filters]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // --- HANDLER FUNCTIONS ---
  const handleAdd = () => {
    setEditingRoom(null);
    setIsModalOpen(true);
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const handleDelete = (roomId: number) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      setRooms(rooms.filter(r => r.id !== roomId));
    }
  };

  const handleSave = (roomData: Omit<Room, 'id'>) => {
    if (editingRoom) {
      setRooms(rooms.map(r => r.id === editingRoom.id ? { ...editingRoom, ...roomData } : r));
    } else {
      const newRoom: Room = {
        id: Date.now(),
        ...roomData
      };
      setRooms([newRoom, ...rooms]);
    }
    setIsModalOpen(false);
  };

  const buildings = ['All', ...Array.from(new Set(initialRoomData.map(r => r.building)))];
  const types = ['All', 'Lecture', 'Laboratory', 'Auditorium', 'Other'];

  return (
    <div className="p-3 bg-gray-50/50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Classroom Management</h1>
        <p className="text-gray-500 mt-1">Manage and monitor all classrooms and laboratories.</p>
      </header>

       <Button onClick={handleAdd} className="w-full mt-2 mb-4"><PlusIcon className="h-4 w-4 mr-2" />Add Room</Button>

     <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg md:w-[400px] border-b-4 border-primary">
        {/* Toolbar */}
         <div className="flex flex-col gap-4 justify-between items-center mb-6">
          <div className="relative w-full md:flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
             <Input
                placeholder="Search by room or building..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
            />
          </div>
          <div className="flex flex-row md:flex-col items-center gap-2 w-full md:w-auto">
            <Select value={filters.building} onValueChange={v => { setFilters(f => ({...f, building: v})); setCurrentPage(1); }}>
              <SelectTrigger className="w-full md:w-[360px]"><Building className="h-4 w-4 mr-2 text-gray-500"/>{filters.building === 'All' ? 'All Buildings' : filters.building}</SelectTrigger>
              <SelectContent>{buildings.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={filters.type} onValueChange={v => { setFilters(f => ({...f, type: v})); setCurrentPage(1); }}>
              <SelectTrigger className="w-full md:w-[360px]"><Filter className="h-4 w-4 mr-2 text-gray-500"/>{filters.type === 'All' ? 'All Types' : filters.type}</SelectTrigger>
              <SelectContent>{types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
           
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Room</TableHead>
                <TableHead>Building</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-center">Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-gray-500">No rooms found.</TableCell>
                </TableRow>
              ) : (
                paginatedData.map(room => (
                  <TableRow key={room.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell>
                        <p className="font-semibold text-gray-800">{room.roomNumber}</p>
                    </TableCell>
                    <TableCell>{room.building}</TableCell>
                    <TableCell>{room.type}</TableCell>
                    <TableCell className="text-center">{room.capacity}</TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[room.status]}`}>
                        {room.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <button onClick={() => handleEdit(room)} title="Edit" className="p-2 text-gray-500 hover:text-blue-600 transition-colors"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(room.id)} title="Delete" className="p-2 text-gray-500 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-row md:flex-col justify-between items-center mt-6 text-sm gap-4">
           <p className="text-gray-600">Showing {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries</p>
           <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4 mr-1"/>Previous</Button>
                <span className="font-medium">{currentPage} of {totalPages || 1}</span>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}><ChevronRight className="h-4 w-4 ml-1"/>Next</Button>
           </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <RoomFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingRoom}
      />
    </div>
  );
}

// --- REUSABLE MODAL FORM COMPONENT ---
type RoomFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Room, 'id'>) => void;
  initialData: Room | null;
}

function RoomFormModal({ isOpen, onClose, onSave, initialData }: RoomFormModalProps) {
  const [formData, setFormData] = useState<Omit<Room, 'id'>>({
    roomNumber: '', building: '', type: 'Lecture', capacity: 40, status: 'Available'
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ roomNumber: '', building: '', type: 'Lecture', capacity: 40, status: 'Available' });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: name === 'capacity' ? Number(value) : value}));
  };

  const handleSelectChange = (name: 'type' | 'status', value: string) => {
    setFormData(prev => ({...prev, [name]: value as any}));
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{initialData ? 'Edit Room' : 'Add New Room'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-6">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roomNumber" className="text-right">Room #</Label>
              <Input id="roomNumber" name="roomNumber" value={formData.roomNumber} onChange={handleChange} className="col-span-3" required />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="building" className="text-right">Building</Label>
              <Input id="building" name="building" value={formData.building} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Type</Label>
              <Select value={formData.type} onValueChange={v => handleSelectChange('type', v)}>
                <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lecture">Lecture</SelectItem>
                  <SelectItem value="Laboratory">Laboratory</SelectItem>
                  <SelectItem value="Auditorium">Auditorium</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">Capacity</Label>
              <Input id="capacity" name="capacity" type="number" min="1" value={formData.capacity} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <Select value={formData.status} onValueChange={v => handleSelectChange('status', v)}>
                <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Occupied">Occupied</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <Button type="submit">Save Room</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default RoomTable;