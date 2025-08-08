import Header from "../layouts/Header";
import RoomTable from "./table/RoomTable";

function RoomContainer() {
  return (
    // 1. I-set ang gitas-on sa tibuok screen ug gamiton ang flexbox column
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header - Kini dili na ma-scroll */}
      <div>
        <Header />
      </div>

      {/* 2. Main content area nga naay kaugalingong scrolling */}
      <div className="flex-1 overflow-y-auto p-8">
        <RoomTable />
      </div>
    </div>
  );
}

export default RoomContainer;