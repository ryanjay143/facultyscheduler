import { Clock } from 'lucide-react';

function UpcomingSchedule() {
  const schedule = [
    { time: "08:30 AM - 10:00 AM", subject: "IT-321: Advanced Web Dev", room: "Room 404" },
    { time: "10:00 AM - 11:30 AM", subject: "CS-101: Intro to Programming", room: "Room 301" },
    { time: "01:00 PM - 02:30 PM", subject: "IT-412: Project Management", room: "Lab 2" },
  ];
  return (
    <div className="bg-purple-100 p-6 rounded-xl shadow-md h-full">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Clock size={20} className="text-purple-600" />
        Upcoming Schedule Today
      </h3>
      <div className="space-y-4">
        {schedule.map((item, index) => (
          <div key={index} className="flex items-start p-4 bg-gray-100 rounded-lg border-l-4 border-purple-500">
            <div className="flex-shrink-0 w-28 text-sm font-semibold text-purple-800">{item.time}</div>
            <div className="ml-4">
              <p className="font-bold text-gray-700">{item.subject}</p>
              <p className="text-sm text-gray-500">{item.room}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


export default UpcomingSchedule
