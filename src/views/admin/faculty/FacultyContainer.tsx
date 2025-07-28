import Header from "../layouts/Header";
import FacultyTable from "./table/FacultyTable";

function FacultyContainer() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <Header />

      {/* Main dashboard content */}
      <div className="flex-1 p-8">
        <FacultyTable />
      </div>
    </div>
  
  );
}

export default FacultyContainer;