import Header from "../layouts/Header";
import Activities from "./activity/Activities";
import Cards from "./cards/Cards";
import { UpcomingSchedules } from "./cards/UpcomingSchedules";

function DashboardContainer() {
  return (
    // 1. I-set ang gitas-on sa tibuok screen ug gamiton ang flexbox column
    <div className="flex flex-col h-screen">
      {/* Header - Kini dili na ma-scroll */}
      <div>
        <Header />
      </div>

      {/* 2. Main dashboard content nga naay kaugalingong scrolling */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* Stats Cards - nag-okupar sa tibuok gilapdon */}
        <div className="mb-8">
            <Cards />
        </div>

        {/* Main Grid: 2 columns sa desktop, 1 column sa mobile */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 md:gap-0 md:space-y-8">
          
          {/* Left/Main Column - mas dako */}
          <div className="space-y-8">
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