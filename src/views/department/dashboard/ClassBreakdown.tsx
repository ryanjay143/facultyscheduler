// src/components/dashboard/ClassBreakdown.tsx

import { motion } from "framer-motion";
import { CalendarX2, User, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { dayMap, type ApiScheduleClass, type DayKey } from "./dashboard";


interface ClassBreakdownProps {
  selectedDay: DayKey;
  // Now uses the API structure type
  classes: ApiScheduleClass[]; 
  onClear: () => void;
}

export const ClassBreakdown = ({ selectedDay, classes, onClear }: ClassBreakdownProps) => {
  // Uses classes prop instead of allClasses import
  const classesForDay = classes.filter((c) => c.day === selectedDay);
  const fullDayName = dayMap[selectedDay] || "Selected Day";

  return (
    <motion.div layout initial={{ opacity: 0, y: 20, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: 20, height: 0 }}
      className="bg-card p-6 rounded-xl border shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">Schedule for {fullDayName}</h3>
        <Button variant="ghost" size="icon" onClick={onClear}><X size={18}/></Button>
      </div>
      <div className="space-y-3">
        {classesForDay.length > 0 ? (
          classesForDay.map((cls, idx) => (
            <motion.div key={cls.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 * idx }}
              className="group flex items-start gap-3 rounded-md border p-3 bg-background hover:border-primary/50">
              <div className="flex-grow">
                <p className="font-semibold text-foreground">{cls.code} - {cls.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5"><User size={14} /> {cls.facultyName}</span>
                  <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> Room: {cls.room}</span>
                </div>
              </div>
              <Badge variant="outline" className="shrink-0 font-mono"><Clock size={12} className="mr-1.5"/>{cls.time}</Badge>
            </motion.div>
          ))
        ) : (
          <div className="py-10 text-center text-muted-foreground rounded-md border-2 border-dashed">
            <CalendarX2 size={28} className="mx-auto mb-2" />
            <p className="font-semibold">No classes scheduled for this day.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};