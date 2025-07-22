import Header from "../layouts/Header";
import Activities from "./activity/Activities";
import Cards from "./cards/Cards";

function DashboardContainer() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <Header />

      {/* Main dashboard content */}
      <div className="flex-1 p-8 bg-[#f6f6fa]">
        {/* Stats Cards */}
        <Cards />

        {/* Recent Activity */}
        <Activities /> 
      </div>
    </div>
  );
}

export default DashboardContainer;