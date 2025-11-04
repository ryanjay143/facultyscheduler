import { motion } from "framer-motion";
import { Users, BookCopy, Building2, BarChart3 } from "lucide-react";

const kpiData = [
  { title: "Total Faculty", value: 12, icon: Users },
  { title: "Total Classes", value: 35, icon: BookCopy },
  { title: "Rooms Utilized", value: 8, icon: Building2 },
  { title: "Avg. Faculty Load", value: "12.5h", icon: BarChart3 },
];

export const KpiCards = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {kpiData.map((item, index) => (
      <motion.div
        key={item.title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 + index * 0.1 }}
        className="bg-card p-4 rounded-lg border shadow-sm"
      >
        <div className="flex items-center gap-4">
            <div className="p-3 rounded-md bg-primary/10 text-primary">
                <item.icon size={24}/>
            </div>
            <div>
                <p className="text-2xl font-bold text-foreground">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.title}</p>
            </div>
        </div>
      </motion.div>
    ))}
  </div>
);