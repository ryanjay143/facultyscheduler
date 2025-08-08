import Header from "../layouts/Header";
import FacultyTable from "./table/FacultyTable";

function FacultyContainer() {
  return (
    // 1. I-set ang gitas-on sa tibuok screen ug gamiton ang flexbox column
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header - Kini dili na ma-scroll */}
      <div>
        <Header />
      </div>
      
      {/* 2. Main content nga naay kaugalingong scrolling */}
      <div className="flex-1 overflow-y-auto p-8">
        <FacultyTable />
      </div>
    </div>
  
  );
}

export default FacultyContainer;