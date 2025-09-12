// src/components/cards/Cards.tsx

import { BookOpen, Building2, ClipboardList, Users } from 'lucide-react'

// Array of card data now includes a 'borderColor' class
const cardData = [
    { title: "Total Faculty", value: 24, icon: Users, color: "text-violet-500", bgColor: "bg-violet-50", borderColor: "border-violet-500" },
    { title: "Total Rooms", value: 10, icon: Building2, color: "text-fuchsia-500", bgColor: "bg-fuchsia-50", borderColor: "border-fuchsia-500" },
    { title: "Total Subjects", value: 36, icon: BookOpen, color: "text-purple-500", bgColor: "bg-purple-50", borderColor: "border-purple-500" },
    { title: "Scheduled Classes", value: 12, icon: ClipboardList, color: "text-blue-500", bgColor: "bg-blue-50", borderColor: "border-blue-500" }
];

function Cards() {
  return (
    <div className="grid grid-cols-4 md:grid-cols-2 gap-6">
      {cardData.map((card, index) => (
        <div 
          key={index} 
          // --- The border class is now applied here ---
          className={`flex items-center gap-4 p-5 bg-white rounded-2xl shadow-lg border-b-4 ${card.borderColor} hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
        >
          <div className={`p-3 rounded-full ${card.bgColor}`}>
            <card.icon className={card.color} size={28} />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{card.value}</div>
            <div className="text-sm text-gray-500">{card.title}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Cards;