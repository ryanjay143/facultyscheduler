import Header from "../layouts/Header";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import FacultyTable from "./table/FacultyTable";

// Sample faculty data




function FacultyContainer() {
  // State for items per page
 

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main dashboard content */}
      <div className="flex-1 pt-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-row gap-4 justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
              Manage Faculty
            </h1>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Faculty
            </Button>
          </div>
          <FacultyTable />
          
        </div>
      </div>
    </div>
  );
}

export default FacultyContainer;