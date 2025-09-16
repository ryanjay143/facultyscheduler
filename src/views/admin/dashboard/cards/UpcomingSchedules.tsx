import React, { useState } from "react";
  import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import { ChevronDown, ChevronUp, CalendarClock, UtensilsCrossed } from "lucide-react";
  import { AnimatePresence, motion } from "framer-motion";

  const allSchedules = [
    { time: "08:00 AM", subject: "CS101 - Intro to Programming", room: "101", faculty: "Dr. Johnson", color: "bg-sky-500", cancelled: false },
    { time: "09:00 AM", subject: "ENG102 - English Composition", room: "103", faculty: "Ms. Lee", color: "bg-amber-500", cancelled: false },
    { time: "10:00 AM", subject: "MATH201 - Calculus II", room: "202", faculty: "Prof. Smith", color: "bg-emerald-500", cancelled: false },
    { time: "11:00 AM", subject: "BIO110 - General Biology", room: "104", faculty: "Dr. Kim", color: "bg-rose-500", cancelled: true },
    { time: "12:00 PM", subject: "Lunch Break", room: "Cafeteria", faculty: "All Staff", color: "bg-gray-400", cancelled: false },
    { time: "01:00 PM", subject: "PHYS201 - University Physics", room: "205", faculty: "Dr. Miller", color: "bg-indigo-500", cancelled: false },
    { time: "02:00 PM", subject: "HIST101 - World History", room: "301", faculty: "Ms. Park", color: "bg-fuchsia-500", cancelled: false },
  ];

  const INITIAL_DISPLAY_COUNT = 5;

  export const UpcomingSchedules: React.FC = () => {
    const [showAll, setShowAll] = useState(false);
    const schedulesToShow = showAll ? allSchedules : allSchedules.slice(0, INITIAL_DISPLAY_COUNT);

    return (
      <Card className="shadow-lg rounded-2xl h-full flex flex-col border-b-4 border-indigo-500 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-50 blur-2xl" aria-hidden />
        <CardHeader className="relative">
          <CardTitle className="text-xl font-bold flex items-center gap-2 text-gray-900">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <CalendarClock size={18} />
            </span>
            Today's Schedule
          </CardTitle>
          <CardDescription>A live overview of all class statuses for today.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow p-6">
          <div className="relative">
            <AnimatePresence>
              {schedulesToShow.map((item, index) => {
                const isLunch = item.subject.toLowerCase().includes("lunch");
                return (
                  <motion.div
                    key={item.time}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex gap-4 group"
                  >
                    {/* Timeline Column */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`relative z-10 w-4 h-4 rounded-full transition-colors ${
                          item.cancelled ? "bg-slate-300" : isLunch ? "bg-amber-500" : item.color
                        }`}
                      />
                      {index < schedulesToShow.length - 1 && (
                        <div className="w-px flex-grow bg-slate-200 group-hover:bg-indigo-200 transition-colors" />
                      )}
                    </div>

                    {/* Schedule Details */}
                    <div
                      className={`pb-8 flex-1 transition-all ${
                        item.cancelled ? "text-slate-400" : ""
                      }`}
                    >
                      <p
                        className={`text-sm font-bold ${
                          item.cancelled ? "text-slate-500" : "text-indigo-600"
                        }`}
                      >
                        {item.time}
                      </p>
                      <p
                        className={`font-semibold mt-1 flex items-center gap-2 ${
                          item.cancelled ? "text-slate-500" : "text-slate-800"
                        }`}
                      >
                        {isLunch && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
                            <UtensilsCrossed size={14} />
                            Lunch Break
                          </span>
                        )}
                        {!isLunch ? item.subject : null}
                        {item.cancelled && (
                          <span className="ml-1 px-2.5 py-1 text-xs font-bold text-white bg-rose-500 rounded-full">
                            CANCELLED
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-slate-500">
                        {item.room === "Cafeteria" ? "Campus Cafeteria" : `Room ${item.room}`} •{" "}
                        {item.faculty}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </CardContent>

        {allSchedules.length > INITIAL_DISPLAY_COUNT && (
          <div className="p-4 mt-auto border-t border-slate-200/80">
            <Button
              variant="ghost"
              className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show Less" : `Show ${allSchedules.length - INITIAL_DISPLAY_COUNT} More`}
              {showAll ? <ChevronUp size={16} className="ml-2" /> : <ChevronDown size={16} className="ml-2" />}
            </Button>
          </div>
        )}
      </Card>
    );
  };