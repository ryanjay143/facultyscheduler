// src/components/classroom/table/RoomTable.tsx

import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, Eye, Edit, Trash2, ChevronLeft, ChevronRight, CalendarPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ViewScheduleModal } from "../modal/ViewScheduleModal";
import type { Room, ScheduleEntry, Subject } from "../RoomContainer";
import { Skeleton } from "@/components/ui/skeleton";

// --- Props ---
type RoomTableProps = {
  roomsData: Room[];
  scheduleData: ScheduleEntry[];
  subjectsData: Subject[];
  onEdit: (room: Room) => void;
  onDelete: (roomId: number) => void;
  onManageAvailability: (room: Room) => void;
  isLoading: boolean;
};

// --- Helper Functions ---
const getSubjectCountForRoom = (roomId: number, schedule: ScheduleEntry[]): number => {
  const uniqueSubjects = new Set(schedule.filter(s => s.roomId === roomId).map(s => s.subjectId));
  return uniqueSubjects.size;
};

// Skeleton Component para sa loading state
const SkeletonRoomRow = () => (
    <TableRow>
        <TableCell><Skeleton className="h-5 w-28" /></TableCell>
        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
        <TableCell className="text-center"><Skeleton className="h-5 w-10 mx-auto" /></TableCell>
        <TableCell><Skeleton className="h-5 w-10" /></TableCell>
        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
        <TableCell className="text-right">
            <div className="flex justify-end gap-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
            </div>
        </TableCell>
    </TableRow>
);

// --- Main Component ---
function RoomTable({ roomsData, scheduleData, subjectsData, onEdit, onDelete, onManageAvailability, isLoading }: RoomTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ type: "All" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isViewScheduleModalOpen, setViewScheduleModalOpen] = useState(false);
  const [viewingRoom, setViewingRoom] = useState<Room | null>(null);

  const filteredData = useMemo(() => {
    return roomsData
      .filter(room => room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(room => filters.type === "All" || room.type === filters.type);
  }, [roomsData, searchTerm, filters]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const handleViewSchedule = (room: Room) => {
    setViewingRoom(room);
    setViewScheduleModalOpen(true);
  };
  const roomTypes = ["All", "Lecture", "Laboratory"];

  return (
    <>
      <div className="bg-card p-4 md:p-6 rounded-lg shadow-sm border border-border">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Search by room..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Select 
              value={filters.type} 
              onValueChange={(v) => { setFilters({ type: v }); setCurrentPage(1); }}
            >
              <SelectTrigger className="w-full sm:w-auto md:w-[180px]">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>{roomTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

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
              {isLoading ? (
                Array.from({ length: itemsPerPage }).map((_, index) => <SkeletonRoomRow key={index} />)
              ) : paginatedData.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center h-48 text-muted-foreground">No rooms found.</TableCell></TableRow>
              ) : (
                paginatedData.map((room) => {
                  const subjectCount = getSubjectCountForRoom(room.id, scheduleData);
                  const isActive = room.status === 0;
                  return (
                    <TableRow key={room.id} className="hover:bg-muted">
                      <TableCell><p className="font-semibold text-foreground">{room.roomNumber}</p></TableCell>
                      <TableCell className="text-muted-foreground">{room.type}</TableCell>
                      <TableCell className="text-center text-muted-foreground">{room.capacity ?? '--'}</TableCell>
                      <TableCell className="text-muted-foreground">{subjectCount}</TableCell>
                      <TableCell><Badge variant={isActive ? "default" : "destructive"}>{isActive ? "Active" : "Inactive"}</Badge></TableCell>
                      <TableCell className="text-right">
                        <TooltipProvider delayDuration={100}>
                            <div className="flex items-center justify-end gap-1">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" className="text-purple-500 hover:text-purple-500" size="icon" onClick={() => onManageAvailability(room)}>
                                            <CalendarPlus className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Manage Availability</p></TooltipContent>
                                </Tooltip>
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
                                        <Button variant="ghost" className="text-green-500 hover:text-green-500" size="icon" onClick={() => onEdit(room)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Edit Room Details</p></TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" onClick={() => onDelete(room.id)} className="text-destructive hover:text-destructive/90">
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

        <div className="flex flex-col md:flex-row justify-between items-center mt-6 text-sm gap-4">
          <p className="text-muted-foreground">
            Showing <strong>{paginatedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong> to <strong>{Math.min(currentPage * itemsPerPage, filteredData.length)}</strong> of <strong>{filteredData.length}</strong> entries
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4 mr-1" />Previous</Button>
            <span className="font-medium text-foreground px-2">Page {currentPage} of {totalPages || 1}</span>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}>Next<ChevronRight className="h-4 w-4 ml-1" /></Button>
          </div>
        </div>
      </div>
      
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