import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, CalendarClock, Clock, User, DoorClosed } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// FIX 1: Nagdagdag ng 'text' property sa bawat color theme
const scheduleColorPalette = [
  { border: "border-sky-500", bg: "bg-sky-50", text: "text-sky-600" },
  { border: "border-amber-500", bg: "bg-amber-50", text: "text-amber-600" },
  { border: "border-emerald-500", bg: "bg-emerald-50", text: "text-emerald-600" },
  { border: "border-indigo-500", bg: "bg-indigo-50", text: "text-indigo-600" },
  { border: "border-fuchsia-500", bg: "bg-fuchsia-50", text: "text-fuchsia-600" },
  { border: "border-orange-500", bg: "bg-orange-50", text: "text-orange-600" },
  { border: "border-rose-500", bg: "bg-rose-50", text: "text-rose-600" },
];

const allSchedulesData = [
  { time: "08:00 AM", subject: "CS101 - Intro to Programming", room: "101", faculty: "Dr. Johnson" },
  { time: "09:00 AM", subject: "ENG102 - English Composition", room: "103", faculty: "Ms. Lee" },
  { time: "10:00 AM", subject: "MATH201 - Calculus II", room: "202", faculty: "Prof. Smith" },
  { time: "11:00 AM", subject: "BIO110 - General Biology", room: "104", faculty: "Dr. Kim", cancelled: true },
  { time: "12:00 PM", subject: "Lunch Break", room: "Cafeteria", faculty: "All Staff", cancelled: false },
  { time: "01:00 PM", subject: "PHYS201 - University Physics", room: "205", faculty: "Dr. Miller" },
  { time: "02:00 PM", subject: "HIST101 - World History", room: "301", faculty: "Ms. Park" },
  { time: "03:00 PM", subject: "ART101 - Art Appreciation", room: "A1", faculty: "Mr. Davis" },
];

const filteredSchedules = allSchedulesData.filter(item => 
  !item.cancelled && !item.subject.toLowerCase().includes("lunch")
);

const INITIAL_DISPLAY_COUNT = 3;

export const UpcomingSchedules: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const schedulesToShow = showAll ? filteredSchedules : filteredSchedules.slice(0, INITIAL_DISPLAY_COUNT);

  return (
    <Card className="shadow-sm rounded-xl h-full flex flex-col border border-border">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-3 text-foreground">
          <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-primary">
            <CalendarClock size={18} />
          </span>
          Today's Schedule
        </CardTitle>
        <CardDescription>An overview of active classes for today.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {schedulesToShow.map((item, index) => {
              const colorTheme = scheduleColorPalette[index % scheduleColorPalette.length];

              return (
                <motion.div
                  key={item.time}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
                >
                  <div 
                    className={`flex flex-col p-4 rounded-lg border-l-4 h-full ${colorTheme.border} ${colorTheme.bg}`}
                  >
                    {/* FIX 2: Ginamit ang colorTheme.text para sa subject title */}
                    <p className={`font-bold text-sm ${colorTheme.text}`}>{item.subject}</p>
                    
                    <div className="space-y-2 text-sm text-muted-foreground mt-4">
                       <div className="flex items-center">
                        <Clock size={14} className="mr-2 flex-shrink-0" />
                        <span>{item.time}</span>
                      </div>
                      <div className="flex items-center">
                        <DoorClosed size={14} className="mr-2 flex-shrink-0" />
                        <span>Room {item.room}</span>
                      </div>
                      <div className="flex items-center">
                        <User size={14} className="mr-2 flex-shrink-0" />
                        <span>{item.faculty}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </CardContent>

      {filteredSchedules.length > INITIAL_DISPLAY_COUNT && (
        <div className="p-4 mt-auto border-t border-border">
          <Button
            variant="ghost"
            className="w-full text-primary hover:text-primary hover:bg-primary/10"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less" : `See ${filteredSchedules.length - INITIAL_DISPLAY_COUNT} more`}
            {showAll ? <ChevronUp size={16} className="ml-2" /> : <ChevronDown size={16} className="ml-2" />}
          </Button>
        </div>
      )}
    </Card>
  );
};