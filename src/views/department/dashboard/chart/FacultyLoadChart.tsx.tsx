import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { facultyLoadData } from "../data";

export const FacultyLoadChart = () => {
    const MAX_LOAD = 20; // Assume max load is 20 hours

    return (
        <div className="bg-card p-6 rounded-xl border shadow-sm">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
                <BarChart3 className="text-primary"/>
                Faculty Load Distribution
            </h3>
            <div className="space-y-4">
                {facultyLoadData.map((faculty, idx) => {
                    const loadPercentage = Math.min(100, (faculty.load / MAX_LOAD) * 100);
                    return (
                        <motion.div key={faculty.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + idx * 0.1 }}>
                            <div className="flex justify-between items-center mb-1 text-sm">
                                <span className="font-semibold text-foreground">{faculty.name}</span>
                                <span className="font-mono text-muted-foreground">{faculty.load}h / {MAX_LOAD}h</span>
                            </div>
                            <Progress value={loadPercentage} />
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};