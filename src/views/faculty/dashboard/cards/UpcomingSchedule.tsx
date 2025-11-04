import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, DoorClosed } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- TYPE & DATA ---
interface ScheduleItem {
    id: number;
    time: string;
    subject: string;
    room: string;
    program: string;
    color: 'sky' | 'emerald' | 'indigo' | 'rose'; // Mas limpyo nga color definition
}

const initialSchedule: ScheduleItem[] = [
  { id: 1, time: "08:30 AM - 10:00 AM", subject: "IT-321: Advanced Web Dev", room: "Room 404", program: "BSIT", color: "sky" },
  { id: 2, time: "10:00 AM - 11:30 AM", subject: "CS-101: Intro to Programming", room: "Room 301", program: "BSCS", color: "emerald" },
  { id: 3, time: "01:00 PM - 02:30 PM", subject: "IT-412: Project Management", room: "Lab 2", program: "BSIT", color: "indigo" },
  { id: 4, time: "03:00 PM - 04:30 PM", subject: "DS-202: Data Structures", room: "Room 505", program: "BSCS", color: "rose" },
];

// FIX 1: I-map ang color names sa saktong Tailwind gradient classes
const colorMap = {
    sky: 'from-sky-500 to-cyan-400',
    emerald: 'from-emerald-500 to-green-400',
    indigo: 'from-indigo-500 to-purple-400',
    rose: 'from-rose-500 to-pink-400',
}

function UpcomingSchedule() {
  return (
    <Card className="shadow-sm rounded-xl h-full flex flex-col border border-border">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-3 text-foreground">
          <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-primary">
            <Clock size={18} />
          </span>
          Today's Schedule
        </CardTitle>
        <CardDescription>Here is an overview of your classes for today.</CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {initialSchedule.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
              >
                {/* FIX 2: Gi-ayo ang card design */}
                <div className={`relative flex flex-col h-full bg-card p-4 rounded-lg border border-border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1`}>
                    {/* Gradient bar sa ibabaw */}
                    <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${colorMap[item.color]} rounded-t-lg`}></div>
                    
                    <div className="flex items-center gap-2 mt-2">
                        <Clock size={14} className="text-primary"/>
                        <span className="font-semibold text-sm text-primary">{item.time}</span>
                    </div>

                    <div className="mt-3 flex-grow">
                        <p className="font-bold text-base text-foreground leading-snug">
                            {item.subject}
                        </p>
                    </div>
                  
                    <div className="text-sm text-muted-foreground mt-3 pt-3 border-t">
                        <div className="flex items-center gap-2">
                            <DoorClosed size={14}/>
                            <span>{item.room} &bull; {item.program}</span>
                        </div>
                    </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}

export default UpcomingSchedule;