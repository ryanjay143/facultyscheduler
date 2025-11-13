// src/components/classroom/table/RoomTable.tsx

import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Eye, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Import Tooltip components
import { RoomFormModal } from "../modal/RoomFormModal";
import { ViewScheduleModal } from "../modal/ViewScheduleModal";
import type { Room, ScheduleEntry, Subject } from "../RoomContainer";

// --- PROPS ---
type RoomTableProps = {
  roomsData: Room[];
  scheduleData: ScheduleEntry[];
  subjectsData: Subject[];
};

// --- HELPER FUNCTIONS ---
const getSubjectCountForRoom = (roomId: number, schedule: ScheduleEntry[]): number => {
  const uniqueSubjects = new Set(schedule.filter(s => s.roomId === roomId).map(s => s.subjectId));
  return uniqueSubjects.size;
};

const checkRoomOccupancy = (roomId: number, schedule: ScheduleEntry[]): boolean => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'short' }); // "Mon", "Tue", etc.
    const currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');

    const todaysSchedule = schedule.filter(s => s.roomId === roomId && s.day === currentDay);

    for (const entry of todaysSchedule) {
        if (entry.startTime <= currentTime && entry.endTime > currentTime) {
            return true; // Room is occupied
        }
    }
    return false; // Room is available
};

// --- COMPONENT ---
function RoomTable({ roomsData, scheduleData, subjectsData }: RoomTableProps) {
  const [rooms, setRooms] = useState<Room[]>(roomsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ type: "All" });
  
  // Modal States
  const [isAddEditModalOpen, setAddEditModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isViewScheduleModalOpen, setViewScheduleModalOpen] = useState(false);
  const [viewingRoom, setViewingRoom] = useState<Room | null>(null);

  const filteredData = useMemo(() => {
    return rooms
      .filter(room => room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(room => filters.type === "All" || room.type === filters.type);
  }, [rooms, searchTerm, filters]);
  
  // --- HANDLERS ---
  const handleAdd = () => { setEditingRoom(null); setAddEditModalOpen(true); };
  const handleEdit = (room: Room) => { setEditingRoom(room); setAddEditModalOpen(true); };
  const handleDelete = (roomId: number) => { if (window.confirm("Are you sure?")) { setRooms(rooms.filter((r) => r.id !== roomId)); } };
  const handleSave = (roomData: Omit<Room, "id">) => {
    if (editingRoom) {
      setRooms(rooms.map((r) => (r.id === editingRoom.id ? { ...editingRoom, ...roomData } : r)));
    } else {
      const newRoom = { id: Date.now(), ...roomData };
      setRooms([newRoom, ...rooms]);
    }
    setAddEditModalOpen(false);
  };

  const handleViewSchedule = (room: Room) => {
    setViewingRoom(room);
    setViewScheduleModalOpen(true);
  };

  const roomTypes = ["All", "Lecture", "Laboratory", "Other"];

  return (
    <>
      <div className="bg-card p-4 md:p-6 rounded-lg shadow-sm border border-border">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Search by room..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Select value={filters.type} onValueChange={(v) => setFilters({ type: v })}>
              <SelectTrigger className="w-full sm:w-auto md:w-[180px]">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>{roomTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
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
                <TableHead>Type</TableHead>
                <TableHead className="text-center">Capacity</TableHead>
                <TableHead>Total Subjects</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center h-48 text-muted-foreground">No rooms found.</TableCell></TableRow>
              ) : (
                filteredData.map((room) => {
                  const isOccupied = checkRoomOccupancy(room.id, scheduleData);
                  const subjectCount = getSubjectCountForRoom(room.id, scheduleData);
                  return (
                    <TableRow key={room.id} className="hover:bg-muted">
                      <TableCell><p className="font-semibold text-foreground">{room.roomNumber}</p></TableCell>
                      <TableCell className="text-muted-foreground">{room.type}</TableCell>
                      <TableCell className="text-center text-muted-foreground">{room.capacity}</TableCell>
                      <TableCell className="text-muted-foreground">{subjectCount}</TableCell>
                      <TableCell>
                        <Badge variant={isOccupied ? "destructive" : "default"}>
                          {isOccupied ? "Occupied" : "Available"}
                        </Badge>
                      </TableCell>
                      {/* --- MODIFIED ACTIONS CELL --- */}
                      <TableCell className="text-right">
                        <TooltipProvider>
                            <div className="flex items-center justify-end gap-1">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" className="text-blue-500 hover:text-blue-500" size="icon" onClick={() => handleViewSchedule(room)}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>View Schedule</p></TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" className="text-green-500 hover:text-green-500" size="icon" onClick={() => handleEdit(room)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Edit Room Details</p></TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(room.id)} className="text-destructive hover:text-destructive/90">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Delete Room</p></TooltipContent>
                                </Tooltip>
                            </div>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modals */}
      <RoomFormModal
        isOpen={isAddEditModalOpen}
        onClose={() => setAddEditModalOpen(false)}
        onSave={handleSave}
        initialData={editingRoom}
      />
      <ViewScheduleModal 
        isOpen={isViewScheduleModalOpen}
        onClose={() => setViewScheduleModalOpen(false)}
        room={viewingRoom}
        scheduleData={scheduleData}
        subjectsData={subjectsData}
      />
    </>
  );
}

export default RoomTable;