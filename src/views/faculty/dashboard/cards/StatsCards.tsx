// src/components/cards/StatsCards.tsx

import { BookUp, Clock, BookCopy } from "lucide-react"; // Replaced Users with BookCopy

// --- UPDATED card data array ---
const stats = [
    { title: "Today's Classes", value: "4", icon: Clock, color: "sky", borderColor: "border-sky-500" },
    { title: "Total Subjects", value: "6", icon: BookUp, color: "amber", borderColor: "border-amber-500" },
    // --- "Total Students" is replaced with "Total Preparations" ---
    { title: "Total Preparations", value: "3", icon: BookCopy, color: "rose", borderColor: "border-rose-500" },
];

function StatsCards() {
  return (
    <div className="grid grid-cols-3 md:grid-cols-1 gap-6">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className={`bg-white rounded-2xl shadow-lg p-5 border-b-4 ${stat.borderColor} hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full bg-${stat.color}-50`}>
              <stat.icon className={`text-${stat.color}-500`} size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;