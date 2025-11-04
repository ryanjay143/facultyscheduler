import RoomTable from "./table/RoomTable";

function RoomContainer() {
  // Ang AdminContainerLayouts na ang bahala sa padding at scrolling.
  return (
    <main>
      <RoomTable />
    </main>
  );
}

export default RoomContainer;