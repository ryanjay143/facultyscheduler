import { motion } from "framer-motion";
import { Users, BookCopy, Building2, BarChart3 } from "lucide-react";

// The corrected interface based on the API response structure
interface ApiKpi {
    title: string;
    value: number | string;
    icon: 'Users' | 'BookCopy' | 'Building2' | 'BarChart3'; 
}

interface KpiCardsProps {
    // Fix: Component expects a prop named 'data' of type ApiKpi[]
    data: ApiKpi[]; 
}

const IconMap = {
    Users: Users,
    BookCopy: BookCopy,
    Building2: Building2,
    BarChart3: BarChart3,
};

// Fix: Component now accepts 'data' prop
export const KpiCards = ({ data }: KpiCardsProps) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {/* Fix: Use the passed 'data' prop */}
    {data.map((item, index) => {
        const IconComponent = IconMap[item.icon] || Users; // Fallback to Users
        return (
            <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="bg-card p-4 rounded-lg border shadow-sm"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-md bg-primary/10 text-primary">
                        <IconComponent size={24}/>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-foreground">{item.value}</p>
                        <p className="text-xs text-muted-foreground">{item.title}</p>
                    </div>
                </div>
            </motion.div>
        );
    })}
  </div>
);