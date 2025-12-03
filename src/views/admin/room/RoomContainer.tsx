// src/components/classroom/RoomContainer.tsx

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import axios from "../../../plugin/axios"; // Adjust path as necessary

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Importing UI and Component Dependencies
import RoomTable from "./table/RoomTable";
import { RoomFormModal } from "./modal/RoomFormModal";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { ManageAvailabilityModal } from "./modal/ManageAvailabilityModal";
import ClassSchedule from "./ClassSchedule";
import type { FacultyLoadEntry, Room, RoomFormData, ScheduleEntry, SectionEntry, Subject } from "./classroom"; // CORRECTED PATH


// --- MAIN COMPONENT ---
function RoomContainer() {
  // --- DATA STATES ---
  const [rooms, setRooms] = useState<Room[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]); 
  const [facultyLoading, setFacultyLoading] = useState<FacultyLoadEntry[]>([]); 
  
  const [schedules, setSchedules] = useState<ScheduleEntry[]>([]); 

  const [savedSections, setSavedSections] = useState<SectionEntry[]>(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('saved_class_sections');
        return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // --- UI STATES ---
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; roomId: number | null }>({ open: false, roomId: null });

  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [selectedRoomForAvailability, setSelectedRoomForAvailability] = useState<Room | null>(null);

  // --- API CALLS (Logic remains the same) ---
  const fetchRooms = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) { toast.error("Authentication required."); return false; }
      const response = await axios.get('/rooms', { headers: { 'Authorization': `Bearer ${token}` } });
      setRooms(response.data.rooms || []);
      return true;
    } catch (error) {
      toast.error("Failed to fetch rooms.");
      console.error("Fetch Rooms Error:", error);
      return false;
    }
  }, []);

  const fetchSubjects = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) { toast.error("Authentication required."); return false; }
      const response = await axios.get('/get-subjects', { headers: { 'Authorization': `Bearer ${token}` } });
      const apiSubjects = response.data.subject || [];
      const transformedSubjects: Subject[] = apiSubjects.map((s: any) => ({
        id: s.id,
        subject_code: s.subject_code,
        des_title: s.des_title,
        code: s.subject_code, 
        name: s.des_title, 
        yearLevel: parseInt(s.semester.year_level) || 0,
        semester_id: s.semester_id,
        total_units: s.total_units,
        lec_units: s.lec_units,
        lab_units: s.lab_units,
      }));
      setSubjects(transformedSubjects);
      return true;
    } catch (error) {
      toast.error("Failed to fetch subjects.");
      console.error("Fetch Subjects Error:", error);
      return false;
    }
  }, []);

  const fetchFacultyLoading = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) { return false; } 
      const response = await axios.get('/get-faculty-loading', { headers: { 'Authorization': `Bearer ${token}` } });
      
      if (response.data.success) {
        setFacultyLoading(response.data.data || []);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Fetch Faculty Loading Error:", error);
      return false;
    }
  }, []);

  const fetchSchedules = useCallback(async (year: number | null = null, section: string | null = null): Promise<{ success: boolean; data: ScheduleEntry[]; message?: string }> => {
    const token = localStorage.getItem('accessToken');
    if (!token) { 
        return { success: false, data: [], message: "Authentication required." }; 
    } 

    const payload: Record<string, any> = {};
    if (year) payload.year = year;
    if (section) payload.section = section;

    try {
        const response = await axios.post('/filter-schedule', payload, { 
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            }
        });
        
        if (response.data.success) {
          const raw = response.data.data || [];
          const apiSchedules: ScheduleEntry[] = raw as ScheduleEntry[]; 
          return {
            success: true,
            data: apiSchedules,
            message: response.data.message
          };
        }
        return { success: false, data: [], message: response.data.message || "Failed to fetch schedules." };
    } catch (error: any) {
        if (error.response?.status === 401) {
             return { success: false, data: [], message: "Session expired or unauthorized. Please log in again." };
        }
        console.error("Fetch Schedules Error:", error);
        return { success: false, data: [], message: error.response?.data?.message || "An unexpected error occurred." };
    }
  }, []);

  const handleFilterApply = useCallback(async (year: number, section: string) => {
    const result = await fetchSchedules(year, section);
    
    if (result.success) {
        setSchedules(result.data); 
    }
    
    return result;
  }, [fetchSchedules]);


  // Initial Data Load: Fetch all required data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [_, __, ___, scheduleResult] = await Promise.all([
            fetchRooms(), 
            fetchSubjects(), 
            fetchFacultyLoading(),
            fetchSchedules() 
        ]);
        
        if (scheduleResult.success) {
             setSchedules(scheduleResult.data);
        } else {
             toast.error(scheduleResult.message);
        }

      } catch (error) {
        console.error("An error occurred during data fetching:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [fetchRooms, fetchSubjects, fetchFacultyLoading, fetchSchedules]);


  // --- ROOM CRUD HANDLERS (Logic remains the same) ---
  const handleSaveRoom = async (data: RoomFormData) => { 
    const token = localStorage.getItem('accessToken');
    if (!token) { toast.error("Authentication required."); return; }
    
    try {
      if (editingRoom) {
        // Edit
        const response = await axios.put(`/rooms/${editingRoom.id}`, data, { headers: { 'Authorization': `Bearer ${token}` } });
        toast.success(response.data.message || 'Room updated successfully!');
      } else {
        // Add
        const roomResponse = await axios.post('/rooms', data, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        toast.success(roomResponse.data.message || 'Room created successfully!');

        const newRoomId = roomResponse.data.room?.id;

        if (newRoomId) {
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
      }
    }
  };

  const handleAddRoom = () => { setEditingRoom(null); setIsModalOpen(true); };
  const handleEditRoom = (room: Room) => { setEditingRoom(room); setIsModalOpen(true); };
  const openDeleteConfirm = (roomId: number) => { setConfirmDialog({ open: true, roomId: roomId }); };
  const handleManageAvailability = (room: Room) => { setSelectedRoomForAvailability(room); setIsAvailabilityModalOpen(true); };

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


  // --- SCHEDULE HANDLER (Logic remains the same) ---
  const handleAddScheduleEntry = async (newEntry: { 
      yearLevel: number; 
      section: string;
      subjectId: number; 
      roomId: number; 
      day: string;
      startTime: string;
      endTime: string;
      type: 'LEC' | 'LAB' | string;
  }): Promise<boolean> => {
    try {
        const token = localStorage.getItem('accessToken');
        
        // Prepare payload for backend (Laravel)
        const payload = {
          subject_id: newEntry.subjectId, 
          room_id: newEntry.roomId, 
          day: newEntry.day, 
          start_time: newEntry.startTime, 
          end_time: newEntry.endTime,   
          section: newEntry.section,
          year_level: newEntry.yearLevel,
          type: newEntry.type, 
        };

        const response = await axios.post('/create-schedule', payload, {
             headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.data.success) {
             toast.success(response.data.message);
             
             // 1. Update Saved Sections (for Dropdown Persistence)
             const sectionExists = savedSections.some(
                s => s.yearLevel === newEntry.yearLevel && s.section === newEntry.section
             );

             if (!sectionExists) {
                 const updatedSections = [...savedSections, { yearLevel: newEntry.yearLevel, section: newEntry.section }];
                 updatedSections.sort((a, b) => a.section.localeCompare(b.section));
                 
                 setSavedSections(updatedSections);
                 localStorage.setItem('saved_class_sections', JSON.stringify(updatedSections));
             }
             
             // 2. Refresh Schedules to show the new entry (optional, depends on app design)
             await handleFilterApply(newEntry.yearLevel, newEntry.section);

             return true; // Success
        }
        return false;

    } catch (error: any) {
        if (error.response && error.response.data) {
            toast.error(error.response.data.message); // Show backend conflict message
        } else {
            toast.error("Failed to save schedule.");
        }
        return false; // Failure
    }
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
          <Button onClick={handleAddRoom} className="shadow-md hover:shadow-lg transition-all"><Plus size={16} className="mr-2" />Add Room</Button>
        </header>

        <Tabs defaultValue="classrooms">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="classrooms">Classroom List</TabsTrigger>
            <TabsTrigger value="schedules">Class Schedules</TabsTrigger>
          </TabsList>

          <TabsContent value="classrooms">
            <RoomTable
              roomsData={rooms}
              scheduleData={schedules}
              subjectsData={subjects}
              onEdit={handleEditRoom}
              onDelete={openDeleteConfirm}
              onManageAvailability={handleManageAvailability} 
              isLoading={isLoading} 
            />
          </TabsContent>

          <TabsContent value="schedules">
            <ClassSchedule
              scheduleData={schedules}
              subjectsData={subjects}
              roomsData={rooms}
              facultyLoadingData={facultyLoading} 
              savedSections={savedSections}
              onAddSchedule={handleAddScheduleEntry}
              onFilterApply={handleFilterApply}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* --- MODALS --- */}
      <RoomFormModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingRoom(null); }}
        onSave={handleSaveRoom}
        initialData={editingRoom}
      />

      <Dialog open={confirmDialog.open} onOpenChange={() => setConfirmDialog({ open: false, roomId: null })}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>This action cannot be undone. This will permanently delete the room.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                  <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                  <Button variant="destructive" onClick={handleDeleteRoom}>Yes, delete it</Button>
              </DialogFooter>
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