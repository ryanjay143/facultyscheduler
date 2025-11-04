import SettingsPage from "./page/SettingsPage";


function SettingsContainer() {
  return (
     <div className="flex flex-col h-screen bg-slate-50">
      
      
      {/* Main content nga naay kaugalingong scrolling */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
       <SettingsPage />
      </main>
    </div>
  )
}

export default SettingsContainer;