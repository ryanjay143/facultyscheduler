import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Calendar, Building, AlertTriangle } from 'lucide-react';
import Header from '../layouts/Header';

import { UnassignedClassesList } from './UnassignedClassesList';
import { RoomAvailabilityList } from './RoomAvailabilityList';
import StatCard from '../utils/StatCard';
import AssignmentModal from './AssignmentModal';
import FullScheduleView from './FullScheduleView';

const dummyClasses = [
  { id: 1, code: 'CS-301', title: 'Data Structures', department: 'Computer Science', time: '8:00 AM - 9:30 AM', days: ['Mon', 'Wed', 'Fri'], room: 'A-101', instructor: 'Dr. Santos', facultyName: 'Dr. Santos' },
  { id: 3, code: 'DS-210', title: 'Intro to Data Science', department: 'Data Science', time: '1:00 PM - 2:30 PM', days: ['Mon', 'Wed', 'Fri'], room: 'A-102', instructor: 'Dr. Santos', facultyName: 'Dr. Santos' },
  { id: 5, code: 'ENG-101', title: 'English Composition', department: 'English', time: '10:30 AM - 12:00 PM', days: ['Mon', 'Wed', 'Fri'], room: 'D-105', instructor: 'Dr. Lee', facultyName: 'Dr. Lee' },
  { id: 7, code: 'PHY-101', title: 'General Physics', department: 'Physics', time: '3:00 PM - 4:30 PM', days: ['Mon', 'Wed', 'Fri'], room: undefined, instructor: 'Dr. Chen', facultyName: 'Dr. Chen' },
  { id: 9, code: 'HIST-210', title: 'World History', department: 'History', time: '10:30 AM - 12:00 PM', days: ['Mon', 'Wed', 'Fri'], room: 'E-210', instructor: 'Dr. Jones', facultyName: 'Dr. Jones' },
  { id: 11, code: 'BA-205', title: 'Business Law', department: 'Business', time: '8:00 AM - 9:30 AM', days: ['Mon', 'Wed', 'Fri'], room: 'D-105', instructor: 'Prof. Miller', facultyName: 'Prof. Miller' },
  { id: 13, code: 'ENG-250', title: 'Shakespeare', department: 'English', time: '3:00 PM - 4:30 PM', days: ['Mon', 'Wed', 'Fri'], room: 'A-101', instructor: 'Dr. Lee', facultyName: 'Dr. Lee' },
  { id: 2, code: 'IT-411', title: 'Advanced Programming', department: 'Information Technology', time: '10:30 AM - 12:00 PM', days: ['Tue', 'Thu'], room: 'B-203', instructor: 'Prof. Cruz', facultyName: 'Prof. Cruz' },
  { id: 4, code: 'CS-412', title: 'Machine Learning', department: 'Computer Science', time: '3:00 PM - 4:30 PM', days: ['Tue', 'Thu'], room: 'C-301', instructor: 'Prof. Reyes', facultyName: 'Prof. Reyes' },
  { id: 6, code: 'MATH-202', title: 'Calculus II', department: 'Mathematics', time: '8:00 AM - 9:30 AM', days: ['Tue', 'Thu'], room: undefined, instructor: 'Prof. Garcia', facultyName: 'Prof. Garcia' },
  { id: 8, code: 'ART-100', title: 'Art History', department: 'Arts', time: '1:00 PM - 2:30 PM', days: ['Tue', 'Thu'], room: 'F-115', instructor: 'Prof. Davis', facultyName: 'Prof. Davis' },
  { id: 10, code: 'CHEM-101', title: 'General Chemistry', department: 'Science', time: '10:30 AM - 12:00 PM', days: ['Tue', 'Thu'], room: undefined, instructor: 'Dr. White', facultyName: 'Dr. White' },
  { id: 12, code: 'CS-101', title: 'Intro to Computing', department: 'Computer Science', time: '3:00 PM - 4:30 PM', days: ['Tue', 'Thu'], room: 'B-203', instructor: 'Prof. Cruz', facultyName: 'Prof. Cruz' },
  { id: 14, code: 'IT-101', title: 'Foundations of IT', department: 'Information Technology', time: '8:00 AM - 9:30 AM', days: ['Sat'], room: 'G-300', instructor: 'Prof. Cruz', facultyName: 'Prof. Cruz' },
  { id: 15, code: 'CS-205', title: 'Algorithms', department: 'Computer Science', time: '10:30 AM - 12:00 PM', days: ['Sat'], room: 'A-102', instructor: 'Dr. Santos', facultyName: 'Dr. Santos' },
  { id: 16, code: 'MATH-110', title: 'College Algebra', department: 'Mathematics', time: '1:00 PM - 2:30 PM', days: ['Sat'], room: undefined, instructor: 'Prof. Garcia', facultyName: 'Prof. Garcia' },
  { id: 17, code: 'ENG-205', title: 'Creative Writing', department: 'English', time: '3:00 PM - 4:30 PM', days: ['Sat'], room: 'D-105', instructor: 'Dr. Lee', facultyName: 'Dr. Lee' },
];

const dummyRooms = [
  { id: 'A-101', capacity: 50, type: 'Classroom', available: false },
  { id: 'A-102', capacity: 60, type: 'Classroom', available: false },
  { id: 'B-203', capacity: 40, type: 'Lab', available: false },
  { id: 'C-301', capacity: 45, type: 'Classroom', available: false },
  { id: 'D-105', capacity: 30, type: 'Classroom', available: false },
  { id: 'E-210', capacity: 70, type: 'Lecture Hall', available: true },
  { id: 'F-115', capacity: 35, type: 'Lab', available: true },
  { id: 'G-300', capacity: 50, type: 'Classroom', available: true },
];

function ClassroomSchedule() {
  const [activeTab, setActiveTab] = useState<'Full Schedule' | 'Unassigned Classes' | 'Room Availability'>('Full Schedule');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any | null>(null);

  const unassignedClasses = dummyClasses.filter((c) => c.room === undefined);
  const assignedClasses = dummyClasses.filter((c) => c.room !== undefined);

  const handleOpenModal = (classInfo: any) => {
    setSelectedClass(classInfo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClass(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Unassigned Classes':
        return <UnassignedClassesList classes={unassignedClasses} onAssignClick={handleOpenModal} />;
      case 'Room Availability':
        return <RoomAvailabilityList rooms={dummyRooms} />;
      default:
        return <FullScheduleView classes={assignedClasses} />;
    }
  };

  return (
    // Remove h-screen to avoid bottom gap; let the parent layout control scrolling
    <div className="flex flex-col min-h-0 bg-gray-50">
      <Header />
      <main className="flex-1 min-h-0 p-4 md:p-4">
        <div className="max-w-screen-2xl mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Classroom Scheduling</h1>
            <p className="text-gray-600 mt-1">Manage and view classroom assignments across all departments.</p>
          </div>

          {/* Stat Cards: auto-fit so it collapses nicely on phones */}
          <div className="grid md:grid-cols-1 grid-cols-4 gap-4 mb-6">
            <StatCard title="Rooms in Use" value={`${dummyRooms.filter((r) => !r.available).length} / ${dummyRooms.length}`} icon={Building} color="text-blue-500" />
            <StatCard title="Unassigned Classes" value={unassignedClasses.length} icon={AlertTriangle} color="text-yellow-500" />
            <StatCard title="Total Classes" value={dummyClasses.length} icon={Calendar} color="text-green-500" />
            <StatCard title="Potential Conflicts" value="0" icon={AlertTriangle} color="text-red-500" />
          </div>

          {/* Main Content Area */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-3">
            {/* Tabs: horizontally scrollable on phones */}
            <div className="overflow-x-auto -mx-2 px-2 mb-4 border-b border-gray-200">
              <div className="inline-flex items-center gap-2">
                <TabButton title="Full Schedule" isActive={activeTab === 'Full Schedule'} onClick={() => setActiveTab('Full Schedule')} />
                <TabButton title="Unassigned Classes" isActive={activeTab === 'Unassigned Classes'} onClick={() => setActiveTab('Unassigned Classes')} />
                <TabButton title="Room Availability" isActive={activeTab === 'Room Availability'} onClick={() => setActiveTab('Room Availability')} />
              </div>
            </div>

            {renderContent()}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isModalOpen && selectedClass && (
          <AssignmentModal onClose={handleCloseModal} classInfo={selectedClass} availableRooms={dummyRooms.filter((r) => r.available)} />
        )}
      </AnimatePresence>
    </div>
  );
}

const TabButton = ({ title, isActive, onClick }: { title: string; isActive: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
      isActive ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-600'
    }`}
  >
    {title}
  </button>
);

export default ClassroomSchedule;