import Header from "../layouts/Header"
import ReportsPage from "./page/ReportsPage"

function ReportsContainer() {
  return (
    // Use min-h-0 to allow this container to fit inside the parent scroller without adding extra height
    <div className="flex flex-col min-h-0 bg-gray-50">
      {/* Header (non-scrollable within this container) */}
      <Header />

      {/* Let the parent AdminContainerLayouts main handle scrolling */}
      <main className="flex-1 min-h-0 p-4 md:p-4">
        <ReportsPage />
      </main>
    </div>
  )
}

export default ReportsContainer