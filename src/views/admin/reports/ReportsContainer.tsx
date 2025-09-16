import Header from "../layouts/Header"
import ReportsPage from "./page/ReportsPage"

function ReportsContainer() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <ReportsPage />
        </div>
      </main>
    </div>
  )
}

export default ReportsContainer