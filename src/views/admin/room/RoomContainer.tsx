import { Button } from "@/components/ui/button"
import Header from "../layouts/Header"
import { PlusIcon } from "lucide-react"
import RoomTable from "./table/RoomTable"


function RoomContainer() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main dashboard content */}
      <div className="flex-1 pt-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-row gap-4 justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
              Manage Rooms
            </h1>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Room
            </Button>
          </div>
      
          <RoomTable />
        </div>
      </div>
    </div>
  )
}

export default RoomContainer
