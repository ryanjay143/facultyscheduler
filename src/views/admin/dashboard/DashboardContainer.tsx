// src/components/DashboardContainer.tsx

import Header from "../layouts/Header"; // Make sure this path is correct
import Activities from "./activity/Activities";
import Cards from "./cards/Cards";
import { UpcomingSchedules } from "./cards/UpcomingSchedules";
import { AnnouncementsWidget } from "./widgets/AnnouncementsWidget";


function DashboardContainer() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />

      {/* Main dashboard content with its own scrolling */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        {/* Top Row: Welcome message and Stats Cards */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back, Admin!</h1>
            <p className="text-gray-500">Here’s a snapshot of your system today.</p>
        </div>
        
        <div className="mb-8">
            <Cards />
        </div>

        {/* Main 3-Column Grid for larger screens */}
        <div className="grid grid-cols-2 md:grid-cols-1 gap-8">
          
          {/* --- Left Column (Activities & Announcements) --- */}
          <div className="col-span-1 space-y-8">
            <AnnouncementsWidget />
            <Activities /> 
          </div>

          {/* --- Center Column (Main Content - Schedule) --- */}
          <div>
           <UpcomingSchedules />
          </div>
          
        </div>
      </main>
    </div>
  );
}

export default DashboardContainer;