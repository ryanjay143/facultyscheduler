import { useState } from 'react';
import { Calendar, PenSquare, Building, AlertTriangle } from 'lucide-react';

// Import the new data and components
import { initialClassSchedules, initialRooms, curriculum, courses, yearLevels, dayPairings } from '../../department/classrommSchedule/classroom-data';
import type { ClassSchedule, Room } from '../classrommSchedule/classroom-data';
import ClassCreationView from './ClassCreationView';
import RoomManagementView from './RoomManagementView';
import MasterScheduleView from './MasterScheduleView';
import StatCard from '../utils/StatCard';


function ClassroomScheduleLayout() {
  const [activeTab, setActiveTab] = useState<'Schedule' | 'Creation' | 'Rooms'>('Schedule');
  const [schedules, setSchedules] = useState<ClassSchedule[]>(initialClassSchedules);
  const [rooms, _setRooms] = useState<Room[]>(initialRooms);

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
                  rooms={rooms}
                  dayPairings={dayPairings}
                  onCreateSchedule={handleCreateSchedule}
                  onUpdateSchedule={handleUpdateSchedule}
                />;
      case 'Rooms':
        return <RoomManagementView rooms={rooms} schedules={schedules} />;
      default: // 'Schedule'
        return <MasterScheduleView schedules={schedules} rooms={rooms} curriculum={curriculum} />;
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
            <TabButton title="Master Schedule" icon={Calendar} isActive={activeTab === 'Schedule'} onClick={() => setActiveTab('Schedule')} />
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