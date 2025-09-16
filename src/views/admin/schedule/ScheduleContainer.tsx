import Header from "../layouts/Header";
import MainSchedule from "./main/MainFacultyLoading";

function ScheduleContainer() {
  return (
    <div className="flex flex-col h-screen bg-gray-50"> 
      <div>
        <Header />
      </div>
      <main className="flex-1 overflow-y-auto p-4 md:p-0">
        <MainSchedule />
      </main>
    </div>
  );
}

export default ScheduleContainer;