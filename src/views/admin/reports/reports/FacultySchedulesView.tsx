import { useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, CalendarDays, Clock } from "lucide-react";
import { facultyData, assignedSubjects, daysOfWeek } from "../ReportsPage";
import { motion, AnimatePresence } from "framer-motion";

// Magdagdag ng color palette para sa bawat araw
const dayColors: { [key: string]: string } = {
  Monday: "border-sky-500",
  Tuesday: "border-emerald-500",
  Wednesday: "border-purple-500",
  Thursday: "border-amber-500",
  Friday: "border-rose-500",
};

export function FacultySchedulesView() {
  const [selectedFacultyId, setSelectedFacultyId] = useState(facultyData[0]?.id.toString() || "");

  const facultySchedule = useMemo(() => {
    return assignedSubjects.filter((s) => s.assignedTo.toString() === selectedFacultyId);
  }, [selectedFacultyId]);

  return (
    <div className="bg-card p-4 md:p-6 rounded-lg shadow-sm border border-border">
      <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center mb-6 pb-4 border-b">
        <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
                <CalendarDays size={22} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-foreground">Faculty Schedules</h2>
                <p className="text-sm text-muted-foreground">View per-day timeline for a selected faculty.</p>
            </div>
        </div>
        <Select value={selectedFacultyId} onValueChange={setSelectedFacultyId}>
          <SelectTrigger className="w-full md:w-72">
            <User className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Select a faculty member..." />
          </SelectTrigger>
          <SelectContent>
            {facultyData.map((f) => <SelectItem key={f.id} value={f.id.toString()}>{f.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {daysOfWeek.map((day, index) => {
          const items = facultySchedule.filter((s) => s.schedule.day === day);
          return (
            <motion.div
                key={day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-xl border bg-background flex flex-col"
            >
              <div className={`text-center font-bold py-2 border-b-4 ${dayColors[day] || 'border-border'}`}>
                {day}
              </div>
              <div className="p-3 space-y-3 flex-grow">
                {items.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm py-8">
                    No classes scheduled
                  </div>
                ) : (
                    <AnimatePresence>
                        {items.map((s, itemIndex) => (
                            <motion.div
                                key={s.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: itemIndex * 0.1 }}
                                className="bg-muted/50 border p-3 rounded-lg text-sm"
                            >
                            <p className="font-bold text-primary">{s.code}</p>
                            <p className="text-xs text-foreground mt-0.5">{s.name}</p>
                            <div className="flex items-center gap-2 font-mono text-xs mt-2 text-muted-foreground">
                                <Clock size={14} />
                                <span>{s.schedule.time}</span>
                            </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}