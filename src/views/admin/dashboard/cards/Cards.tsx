import { BookOpen, Building2, ClipboardList, Users } from "lucide-react";

  // Array of card data includes a 'borderColor' class
  const cardData = [
    { title: "Total Faculty", value: 24, icon: Users, color: "text-violet-500", bgColor: "bg-violet-50", borderColor: "border-violet-500" },
    { title: "Total Rooms", value: 10, icon: Building2, color: "text-fuchsia-500", bgColor: "bg-fuchsia-50", borderColor: "border-fuchsia-500" },
    { title: "Total Subjects", value: 36, icon: BookOpen, color: "text-purple-500", bgColor: "bg-purple-50", borderColor: "border-purple-500" },
    { title: "Scheduled Classes", value: 12, icon: ClipboardList, color: "text-blue-500", bgColor: "bg-blue-50", borderColor: "border-blue-500" },
  ];

  function Cards() {
    return (
      <div className="grid grid-cols-4 md:grid-cols-1 gap-6">
        {cardData.map((card, index) => (
          <div
            key={index}
            className={`relative flex items-center gap-4 p-5 bg-white rounded-2xl shadow-lg border-b-4 ${card.borderColor} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
          >
            {/* Decorative glow */}
            <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-slate-100 blur-2xl" aria-hidden />

            <div className={`p-3 rounded-xl ${card.bgColor} border border-black/5`}>
              <card.icon className={card.color} size={28} />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-gray-800 leading-none">{card.value}</div>
              <div className="mt-1 text-sm text-gray-500">{card.title}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  export default Cards;