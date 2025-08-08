import { Bell } from 'lucide-react';

function Announcements() {
    const announcements = [
        { title: "Midterm Examination Schedule", date: "August 5, 2025" },
        { title: "Faculty Meeting on Friday", date: "August 4, 2025" },
        { title: "System Maintenance this Weekend", date: "August 2, 2025" },
    ];
  return (
    <div className="bg-purple-100 p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Bell size={20} className="text-red-500" />
        Announcements
      </h3>
      <div className="space-y-3">
        {announcements.map((item, index) => (
            <div key={index} className="p-3 bg-red-50/50 rounded-lg hover:bg-red-100/70 transition">
                <p className="font-semibold text-sm text-red-800">{item.title}</p>
                <p className="text-xs text-gray-500 mt-1">{item.date}</p>
            </div>
        ))}
      </div>
    </div>
  );
}

export default Announcements
