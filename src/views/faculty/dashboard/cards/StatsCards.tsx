import { BookUp, Clock, Users, } from "lucide-react";

// ----- Dummy Component 1: Stats Cards -----
function StatsCards() {
  const stats = [
    { title: "Today's Classes", value: "4", icon: <Clock className="text-sky-500" />, bgColor: "bg-sky-50" },
    { title: "Total Subjects", value: "6", icon: <BookUp className="text-amber-500" />, bgColor: "bg-amber-50" },
    { title: "Total Students", value: "182", icon: <Users className="text-emerald-500" />, bgColor: "bg-emerald-50" },
  ];

  return (
    <div className="grid grid-cols-3 md:grid-cols-1 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className={`flex items-center gap-4 cursor-pointer p-6 bg-purple-100 rounded-xl shadow-lg border-l-4 border-violet-500 hover:scale-[1.02] transition-transform`}>
          <div className={`p-3 rounded-full ${stat.bgColor}`}>
            {stat.icon}
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
export default StatsCards;
