// src/components/FacultyDashboardContainer.tsx

import Header from "../layouts/Header"; // Make sure this path is correct
import StatsCards from "./cards/StatsCards";
import UpcomingSchedule from "./cards/UpcomingSchedule";
import Announcements from "./cards/Announcements";
import QuickActions from "./widgets/QuickActions";


function FacultyDashboardContainer() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />

      {/* Main dashboard content with its own scrolling */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        
        {/* Welcome Message */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Welcome back, Maria!</h1>
            <p className="text-gray-500 mt-1">Here's your summary for today.</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
            <StatsCards />
        </div>

        {/* Main 3-Column Grid for larger screens */}
        <div className="grid grid-cols-2 md:grid-cols-1 gap-8 items-start">
          
          {/* --- Left Column (Quick Actions & Announcements) --- */}
          <div className="space-y-8">
            <QuickActions />
            <Announcements /> 
          </div>

          {/* --- Center/Right Column (Main Content - Schedule) --- */}
          <div>
           <UpcomingSchedule />
          </div>
          
        </div>
      </main>
    </div>
  );
}

export default FacultyDashboardContainer;