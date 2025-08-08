import Header from "../layouts/Header"
import ReportsPage from "./page/ReportsPage"


function ReportsContainer() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div>
        <Header />
      </div>

      {/* Main dashboard content */}
      <div className="flex-1 overflow-y-auto p-8">
       <ReportsPage /> 
      </div>
    </div>
  )
}

export default ReportsContainer
