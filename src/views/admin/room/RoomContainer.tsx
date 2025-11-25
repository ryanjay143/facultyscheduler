// src/components/classroom/RoomContainer.tsx

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import axios from "../../../plugin/axios";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import RoomTable from "./table/RoomTable";
import YearLevelScheduleView from "./YearLevelScheduleView";
import { RoomFormModal } from "./modal/RoomFormModal";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { ManageAvailabilityModal } from "./modal/ManageAvailabilityModal";

// --- TYPE DEFINITIONS ---
export interface Room {
  id: number;
  roomNumber: string;
  type: "Lecture" | "Laboratory";
  capacity: number | null;
  status: number;
  created_at: string;
  updated_at: string;
}
export interface Subject {
  id: number;
  code: string;
  name: string;
  yearLevel: number;
}
export interface ScheduleEntry {
  scheduleId: number;
  roomId: number;
  subjectId: number;
  section: string;
  day: string;
  startTime: string;
  endTime: string;
}

const mockSchedule: ScheduleEntry[] = [
    { scheduleId: 1, roomId: 1, subjectId: 7, section: "A", day: "Mon", startTime: "09:00", endTime: "10:30" },
];

// --- MAIN COMPONENT ---
function RoomContainer() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; roomId: number | null }>({ open: false, roomId: null });

  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [selectedRoomForAvailability, setSelectedRoomForAvailability] = useState<Room | null>(null);


  // --- API CALLS ---
  const fetchRooms = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) { toast.error("Authentication required."); return; }
      const response = await axios.get('/rooms', { headers: { 'Authorization': `Bearer ${token}` } });
      setRooms(response.data.rooms || []);
    } catch (error) {
      toast.error("Failed to fetch rooms.");
      console.error("Fetch Rooms Error:", error);
    }
  }, []);

  const fetchSubjects = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) { toast.error("Authentication required."); return; }
      const response = await axios.get('/get-subjects', { headers: { 'Authorization': `Bearer ${token}` } });
      const apiSubjects = response.data.subject || [];
      const transformedSubjects: Subject[] = apiSubjects.map((s: any) => ({
        id: s.id,
        code: s.subject_code,
        name: s.des_title,
        yearLevel: parseInt(s.semester.year_level) || 0,
      }));
      setSubjects(transformedSubjects);
    } catch (error) {
      toast.error("Failed to fetch subjects.");
      console.error("Fetch Subjects Error:", error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchRooms(), fetchSubjects()]);
      } catch (error) {
        console.error("An error occurred during data fetching:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [fetchRooms, fetchSubjects]);

  // --- CRUD HANDLERS ---
  const handleSaveRoom = async (data: Omit<Room, "id" | "status" | "created_at" | "updated_at">) => {
    const token = localStorage.getItem('accessToken');
    if (!token) { toast.error("Authentication required."); return; }
    
    try {
      if (editingRoom) {
        // --- EDIT MODE ---
        const response = await axios.put(`/rooms/${editingRoom.id}`, data, { headers: { 'Authorization': `Bearer ${token}` } });
        toast.success(response.data.message || 'Room updated successfully!');
      } else {
        // --- ADD MODE (Two-Step Process) ---

        // Step 1: Create the room
        const roomResponse = await axios.post('/rooms', data, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        toast.success(roomResponse.data.message || 'Room created successfully!');

        // Get the ID of the newly created room
        const newRoomId = roomResponse.data.room?.id;

        if (newRoomId) {
          // Step 2: Create and post the default availability for the new room
          const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const timeSlots = [
              { start_time: '07:00:00', end_time: '12:00:00' },
              { start_time: '13:00:00', end_time: '21:00:00' },
          ];
          
          const availabilitiesPayload = {
            availabilities: days.flatMap(day => 
              timeSlots.map(slot => ({ day, ...slot }))
            )
          };
          
          await axios.post(`/rooms/${newRoomId}/availabilities`, availabilitiesPayload, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          toast.success('Default availability has been set.');
        }
      }

      setIsModalOpen(false);
      setEditingRoom(null);
      fetchRooms();

    } catch (error: any) {
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        for (const key in validationErrors) { 
          toast.error(`Validation Error: ${validationErrors[key][0]}`); 
          return; 
        }
      } else {
        toast.error("An error occurred. Please try again.");
        console.error("Save Room Error:", error);
      }
    }
  };

  const handleAddRoom = () => {
    setEditingRoom(null);
    setIsModalOpen(true);
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const handleDeleteRoom = async () => {
    if (confirmDialog.roomId === null) return;
    const token = localStorage.getItem('accessToken');
    if (!token) { toast.error("Authentication required."); return; }
    try {
      const response = await axios.delete(`/rooms/${confirmDialog.roomId}`, { headers: { 'Authorization': `Bearer ${token}` } });
      toast.success(response.data.message || 'Room deleted successfully!');
      fetchRooms();
    } catch (error) {
      toast.error("Failed to delete room.");
    } finally {
      setConfirmDialog({ open: false, roomId: null });
    }
  };
  
  const openDeleteConfirm = (roomId: number) => {
    setConfirmDialog({ open: true, roomId: roomId });
  };

   const handleManageAvailability = (room: Room) => {
    setSelectedRoomForAvailability(room);
    setIsAvailabilityModalOpen(true);
  };

  // --- RENDER ---
  return (
    <>
      <main>
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Classroom & Schedule Management</h1>
            <p className="text-muted-foreground mt-2">Monitor classroom utilization and view schedules by year level.</p>
          </div>
          <Button onClick={handleAddRoom}><Plus size={16} className="mr-2" />Add Room</Button>
        </header>

        <Tabs defaultValue="classrooms">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="classrooms">Classroom List</TabsTrigger>
            <TabsTrigger value="schedules">Generate Schedules</TabsTrigger>
          </TabsList>

          <TabsContent value="classrooms">
            <RoomTable
  roomsData={rooms}
  scheduleData={mockSchedule}
  subjectsData={subjects}
  onEdit={handleEditRoom}
  onDelete={openDeleteConfirm}
  onManageAvailability={handleManageAvailability} 
  isLoading={isLoading} 
/>
          </TabsContent>

          <TabsContent value="schedules">
            <YearLevelScheduleView
              scheduleData={mockSchedule}
              subjectsData={subjects}
              roomsData={rooms}
            />
          </TabsContent>
        </Tabs>
      </main>

      <RoomFormModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingRoom(null); }}
        onSave={handleSaveRoom}
        initialData={editingRoom}
      />

      <Dialog open={confirmDialog.open} onOpenChange={() => setConfirmDialog({ open: false, roomId: null })}>
          <DialogContent>
              <DialogHeader><DialogTitle>Are you absolutely sure?</DialogTitle><DialogDescription>This action cannot be undone. This will permanently delete the room.</DialogDescription></DialogHeader>
              <DialogFooter><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose><Button variant="destructive" onClick={handleDeleteRoom}>Yes, delete it</Button></DialogFooter>
          </DialogContent>
      </Dialog>

      <ManageAvailabilityModal
        isOpen={isAvailabilityModalOpen}
        onClose={() => setIsAvailabilityModalOpen(false)}
        room={selectedRoomForAvailability}
      />
    </>
  );
}

export default RoomContainer;