
import Header from "../layouts/Header";
import Notification from "./mainNotification/Notification";


function NotificationContainer() {
  

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      
      {/* Main content with its own scrolling */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
       <Notification />
        </main>
    </div>
  )
}

export default NotificationContainer;