import { BookOpen, Building2, ClipboardList, Users } from "lucide-react";
import { motion } from "framer-motion";

interface CardsProps {
  isLoading: boolean; // Add this prop
  counts?: {
    total_scheduled_classes: number;
    total_faculty_active: number;
    total_rooms_utilized: number;
    total_subjects_taught: number;
  };
}

function Cards({ counts, isLoading }: CardsProps) {
  const cardData = [
    { 
      title: "Active Faculty Today", 
      value: counts?.total_faculty_active || 0, 
      icon: Users, 
      color: "text-violet-600", 
      bgColor: "bg-violet-100/80" 
    },
    { 
      title: "Rooms Utilized", 
      value: counts?.total_rooms_utilized || 0, 
      icon: Building2, 
      color: "text-fuchsia-600", 
      bgColor: "bg-fuchsia-100/80" 
    },
    { 
      title: "Subjects Taught", 
      value: counts?.total_subjects_taught || 0, 
      icon: BookOpen, 
      color: "text-purple-600", 
      bgColor: "bg-purple-100/80" 
    },
    { 
      title: "Classes Scheduled", 
      value: counts?.total_scheduled_classes || 0, 
      icon: ClipboardList, 
      color: "text-sky-600", 
      bgColor: "bg-sky-100/80" 
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card p-5 rounded-xl border border-border shadow-sm flex items-center gap-5 h-[100px] animate-pulse">
            <div className="h-12 w-12 rounded-lg bg-muted/50"></div>
            <div className="space-y-2 flex-1">
              <div className="h-6 w-1/3 bg-muted/50 rounded"></div>
              <div className="h-4 w-2/3 bg-muted/50 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

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