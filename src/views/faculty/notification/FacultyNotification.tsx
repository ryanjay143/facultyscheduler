import FacultyNotificationsPage from "./page/FacultyNotificationsPage";


function FacultyNotification() {
  return (
    <div className="flex flex-col h-screen bg-slate-100">
     
      
      {/* Main content nga naay kaugalingong scrolling */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <FacultyNotificationsPage />
      </main>
    </div>
  )
}

export default FacultyNotification;