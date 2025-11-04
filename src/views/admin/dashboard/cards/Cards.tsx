import { BookOpen, Building2, ClipboardList, Users } from "lucide-react";
import { motion } from "framer-motion";

const cardData = [
  { title: "Total Faculty", value: 24, icon: Users, color: "text-violet-600", bgColor: "bg-violet-100/80" },
  { title: "Total Rooms", value: 10, icon: Building2, color: "text-fuchsia-600", bgColor: "bg-fuchsia-100/80" },
  { title: "Total Subjects", value: 36, icon: BookOpen, color: "text-purple-600", bgColor: "bg-purple-100/80" },
  { title: "Scheduled Classes", value: 12, icon: ClipboardList, color: "text-sky-600", bgColor: "bg-sky-100/80" },
];

function Cards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cardData.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + index * 0.1, duration: 0.4, ease: "easeOut" }}
          className="bg-card p-5 rounded-xl border border-border shadow-sm flex items-center gap-5 transition-transform duration-300 hover:-translate-y-1"
        >
          <div className={`p-3 rounded-lg ${card.bgColor}`}>
            <card.icon className={card.color} size={28} />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{card.value}</div>
            <div className="text-sm text-muted-foreground">{card.title}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default Cards;