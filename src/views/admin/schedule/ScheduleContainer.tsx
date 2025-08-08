import Header from "../layouts/Header";
import MainSchedule from "./main/MainSchedule";

function ScheduleContainer() {
  return (
    <div className="flex flex-col h-screen bg-gray-50"> 
      <div>
        <Header />
      </div>
      <div className="flex-1 overflow-y-auto p-8">
        <MainSchedule />
      </div>
    </div>
  );
}

export default ScheduleContainer;