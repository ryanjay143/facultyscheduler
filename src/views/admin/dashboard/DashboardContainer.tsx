// Gi-update nga DashboardContainer.tsx

import Header from "../layouts/Header";
import Activities from "./activity/Activities";
import Cards from "./cards/Cards";
import { UpcomingSchedules } from "./cards/UpcomingSchedules";



function DashboardContainer() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <Header />

      {/* Main dashboard content with a grid layout */}
      <div className="flex-1 p-8">
        {/* Stats Cards - nag-okupar sa tibuok gilapdon */}
        <div className="mb-8">
            <Cards />
        </div>

        {/* Main Grid: 2 columns sa desktop, 1 column sa mobile */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          
          {/* Left/Main Column - mas dako */}
          <div className=" space-y-8">
           <UpcomingSchedules />
           
          </div>

          {/* Right/Side Column - mas gamay */}
          <div className="md:col-span-2 space-y-8">
            <Activities /> 
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default DashboardContainer;