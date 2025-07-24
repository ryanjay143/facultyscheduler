import Header from "../layouts/Header"
import ScheduleTable from "./table/ScheduleTable"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

function ScheduleContainer() {
 
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main dashboard content */}
      <div className="flex-1 pt-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-row gap-4 justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
              Manage Schedule
            </h1>
            <Button
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow"
            >
              <Download className="w-5 h-5" />
              Download as 
            </Button>
          </div>
          <ScheduleTable />
        </div>
      </div>
    </div>
  )
}

export default ScheduleContainer