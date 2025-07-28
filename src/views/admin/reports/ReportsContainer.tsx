import Header from "../layouts/Header"
import ReportsPage from "./page/ReportsPage"


function ReportsContainer() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <Header />

      {/* Main dashboard content */}
      <div className="flex-1 p-8">
       <ReportsPage /> 
      </div>
    </div>
  )
}

export default ReportsContainer
