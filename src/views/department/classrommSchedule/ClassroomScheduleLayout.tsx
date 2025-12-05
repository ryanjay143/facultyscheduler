import { useState, useEffect, useCallback } from 'react';
import { Calendar, PenSquare, Building, AlertTriangle } from 'lucide-react';
import axios from '../../../plugin/axios';
import type { Room as AdminRoom, FacultyLoadEntry } from '../../admin/room/classroom';

// Import the new data and components
import { initialClassSchedules, initialRooms, curriculum, courses, yearLevels, dayPairings } from '../../department/classrommSchedule/classroom-data';
import type { ClassSchedule, Room } from '../classrommSchedule/classroom-data';
import ClassCreationView from './ClassCreationView';
import RoomManagementView from './RoomManagementView';
// MasterScheduleView is removed as requested in the previous context.
import StatCard from '../utils/StatCard';


function ClassroomScheduleLayout() {
  // Changed default tab from 'Schedule' to 'Creation' since 'Master Schedule' view is removed.
  const [activeTab, setActiveTab] = useState<'Creation' | 'Rooms'>('Creation');
  const [schedules, setSchedules] = useState<ClassSchedule[]>(initialClassSchedules);
  // Renamed _setRooms to setRooms for better practice
  const [rooms, _setRooms] = useState<Room[]>(initialRooms);

  // Admin data fetched from API for availability and scheduling
  const [adminRooms, setAdminRooms] = useState<AdminRoom[]>([]);
  const [facultyLoading, setFacultyLoading] = useState<FacultyLoadEntry[]>([]);

  const unassignedClasses = schedules.filter((c) => c.roomId === null);
  const roomsInUseCount = new Set(schedules.map(s => s.roomId).filter(Boolean)).size;

  // Function to add a new class schedule (passed to ClassCreationView)
  const handleCreateSchedule = (newSchedule: Omit<ClassSchedule, 'id'>) => {
    setSchedules(prev => [
      ...prev,
      {
        ...newSchedule,
        id: Date.now(), // Use a more robust ID in a real app
      }
    ]);
  };

  const fetchAdminRooms = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      const res = await axios.get('/rooms', { headers: { Authorization: `Bearer ${token}` } });
      setAdminRooms(res.data.rooms || []);
    } catch (err) {
      console.error('Failed to fetch admin rooms', err);
    }
  }, []);

  const fetchAdminSubjects = useCallback(async () => {
    // Subjects are not required for current department modal; keep function for future use
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      await axios.get('/get-subjects', { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
      console.error('Failed to fetch admin subjects', err);
    }
  }, []);

  const fetchFacultyLoading = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      const r = await axios.get('/get-faculty-loading', { headers: { Authorization: `Bearer ${token}` } });
      setFacultyLoading(r.data.data || []);
    } catch (err) {
      console.error('Failed to fetch faculty loading', err);
    }
  }, []);

  useEffect(() => {
    fetchAdminRooms();
    fetchAdminSubjects();
    fetchFacultyLoading();
  }, [fetchAdminRooms, fetchAdminSubjects, fetchFacultyLoading]);

  // Function to update an existing schedule (e.g., assign a room)
  const handleUpdateSchedule = (updatedSchedule: ClassSchedule) => {
    setSchedules(prev => prev.map(s => s.id === updatedSchedule.id ? updatedSchedule : s));
  };
  
  const renderContent = () => {
    switch (activeTab) {
      case 'Creation':
        return <ClassCreationView
                  curriculum={curriculum}
                  courses={courses}
                  yearLevels={yearLevels}
                  schedules={schedules}
                  // Provide admin data to allow room/time lookup like admin implementation
                  dayPairings={dayPairings}
                  onCreateSchedule={handleCreateSchedule}
                  onUpdateSchedule={handleUpdateSchedule}
                  rooms={adminRooms}
                  facultyLoadingData={facultyLoading}
                />;
      case 'Rooms':
        return <RoomManagementView rooms={rooms} schedules={schedules} />;
      // Removed the 'Schedule' case
      default:
        // Provide a default view if an unexpected tab is active (though types restrict this now)
        return <ClassCreationView
                  curriculum={curriculum}
                  courses={courses}
                  yearLevels={yearLevels}
                  schedules={schedules}
                  dayPairings={dayPairings}
                  onCreateSchedule={handleCreateSchedule}
                  onUpdateSchedule={handleUpdateSchedule}
                />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Classroom Scheduling</h1>
        <p className="text-gray-600 mt-1">Manage, create, and view classroom assignments across all departments.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Rooms" value={rooms.length} icon={Building} color="text-blue-500" />
        <StatCard title="Rooms in Use" value={roomsInUseCount} icon={Building} color="text-indigo-500" />
        <StatCard title="Total Classes Scheduled" value={schedules.length} icon={Calendar} color="text-green-500" />
        <StatCard title="Unassigned Classes" value={unassignedClasses.length} icon={AlertTriangle} color="text-yellow-500" />
      </div>

      {/* Main Content Area */}
      <div className="bg-card border rounded-xl shadow-sm">
        <div className="p-3 border-b">
          <div className="inline-flex items-center gap-2 bg-muted p-1 rounded-lg">
            {/* Removed Master Schedule Tab */}
            <TabButton title="Class Creation" icon={PenSquare} isActive={activeTab === 'Creation'} onClick={() => setActiveTab('Creation')} />
            <TabButton title="Room Management" icon={Building} isActive={activeTab === 'Rooms'} onClick={() => setActiveTab('Rooms')} />
          </div>
        </div>
        <div className="p-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

const TabButton = ({ title, icon: Icon, isActive, onClick }: { title: string; icon: React.ElementType, isActive: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
      isActive ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-primary'
    }`}
  >
    <Icon size={16} />
    {title}
  </button>
);

export default ClassroomScheduleLayout;