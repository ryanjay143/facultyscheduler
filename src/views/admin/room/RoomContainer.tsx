import Header from "../layouts/Header";
import RoomTable from "./table/RoomTable";

function RoomContainer() {
  return (
    // Use min-h-0 so this container flexes inside the parent scroller without adding extra height
    <div className="flex flex-col min-h-0 bg-gray-50">
      {/* Header (non-scrollable within this container) */}
      <Header />

      {/* Let the parent AdminContainerLayouts main handle scrolling */}
      <main className="flex-1 min-h-0 p-4 md:p-0">
        <RoomTable />
      </main>
    </div>
  );
}

export default RoomContainer;