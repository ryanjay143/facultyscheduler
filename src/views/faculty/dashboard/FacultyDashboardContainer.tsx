import Header from "../layouts/Header";
import Announcements from "./cards/Announcements";
import StatsCards from "./cards/StatsCards";
import UpcomingSchedule from "./cards/UpcomingSchedule";

function FacultyDashboardContainer() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />

      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        
        {/* Welcome Message */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Welcome back, Maria!</h1>
            <p className="text-gray-500 mt-1">Here's your summary for today.</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
            <StatsCards />
        </div>

        {/* Main Grid: 2 columns sa desktop */}
       <div className="grid grid-cols-1 md:grid-cols-1 gap-8 md:gap-0 md:space-y-8">
          
          {/* Main Column - mas dako */}
          <div className="lg:col-span-2 space-y-8">
            <UpcomingSchedule />
          </div>

          {/* Side Column - mas gamay */}
          <div className="space-y-8">
            <Announcements />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacultyDashboardContainer;