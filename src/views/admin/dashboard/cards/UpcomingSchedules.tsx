import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    ChevronDown, 
    ChevronUp, 
    CalendarClock, 
    Clock, 
    User, 
    DoorClosed, 
    AlertCircle, 
    Loader2,
    Filter,
    FlaskConical,
    Presentation,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
// --- NEW IMPORTS FOR SHADCN SELECT ---
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ScheduleDetail } from "../DashboardContainer"; 

const scheduleColorPalette = [
  { border: "border-sky-500", bg: "bg-sky-50", text: "text-sky-600" },
  { border: "border-amber-500", bg: "bg-amber-50", text: "text-amber-600" },
  { border: "border-emerald-500", bg: "bg-emerald-50", text: "text-emerald-600" },
  { border: "border-indigo-500", bg: "bg-indigo-50", text: "text-indigo-600" },
  { border: "border-fuchsia-500", bg: "bg-fuchsia-50", text: "text-fuchsia-600" },
  { border: "border-orange-500", bg: "bg-orange-50", text: "text-orange-600" },
  { border: "border-rose-500", bg: "bg-rose-50", text: "text-rose-600" },
];

const INITIAL_DISPLAY_COUNT = 3;

const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(h), parseInt(m));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

export const UpcomingSchedules: React.FC<{ schedules: ScheduleDetail[], isLoading: boolean }> = ({ schedules, isLoading }) => {
  const [showAll, setShowAll] = useState(false);
  
  // --- FILTER STATES ---
  const [selectedFaculty, setSelectedFaculty] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");

  // 1. Extract Unique Faculty Names for the Dropdown
  const uniqueFaculties = useMemo(() => {
    const names = schedules.map(s => s.faculty_name).filter(Boolean);
    return Array.from(new Set(names)).sort();
  }, [schedules]);

  // 2. Filter the Data based on selection
  const filteredSchedules = useMemo(() => {
    return schedules.filter(item => {
        const matchesFaculty = selectedFaculty === "ALL" || item.faculty_name === selectedFaculty;
        const matchesType = selectedType === "ALL" || item.type === selectedType;
        return matchesFaculty && matchesType;
    });
  }, [schedules, selectedFaculty, selectedType]);

  // 3. Determine pagination based on filtered results
  const schedulesToShow = showAll ? filteredSchedules : filteredSchedules.slice(0, INITIAL_DISPLAY_COUNT);

  return (
    <Card className="shadow-sm rounded-xl h-full flex flex-col border border-border">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <CardTitle className="text-xl font-bold flex items-center gap-3 text-foreground">
                <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-primary">
                    <CalendarClock size={18} />
                </span>
                Today's Schedule
                </CardTitle>
                <CardDescription className="mt-1">
                    {isLoading 
                        ? "Checking for active classes..." 
                        : `Overview of ${filteredSchedules.length} active classes.`}
                </CardDescription>
            </div>

            {/* --- FILTERS --- */}
            {!isLoading && schedules.length > 0 && (
                <div className="flex gap-2 flex-wrap md:flex-nowrap">
                    
                    {/* Faculty Filter (Shadcn Select) */}
                    <Select 
                        value={selectedFaculty} 
                        onValueChange={(val) => {
                            setSelectedFaculty(val);
                            setShowAll(false);
                        }}
                    >
                        <SelectTrigger className="w-[160px] h-9">
                            <div className="flex items-center gap-2 text-muted-foreground truncate">
                                <Filter className="h-4 w-4 shrink-0" />
                                <SelectValue placeholder="All Faculty" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Faculty</SelectItem>
                            {uniqueFaculties.map((fac, i) => (
                                <SelectItem key={i} value={fac}>
                                    {fac}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Type Filter (Shadcn Select) */}
                    <Select
                        value={selectedType}
                        onValueChange={(val) => {
                            setSelectedType(val);
                            setShowAll(false);
                        }}
                    >
                        <SelectTrigger className="w-[140px] h-9">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                {/* Dynamic Icon inside Trigger */}
                                {selectedType === 'LAB' ? (
                                    <FlaskConical className="h-4 w-4 shrink-0" />
                                ) : (
                                    <Presentation className="h-4 w-4 shrink-0" />
                                )}
                                <SelectValue placeholder="All Types" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Types</SelectItem>
                            <SelectItem value="LEC">Lecture</SelectItem>
                            <SelectItem value="LAB">Laboratory</SelectItem>
                        </SelectContent>
                    </Select>

                </div>
            )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow p-4 md:p-6 pt-0">
        {/* LOADING STATE */}
        {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm">Loading schedule details...</p>
            </div>
        ) : filteredSchedules.length === 0 ? (
            // EMPTY STATE
           <div className="flex flex-col items-center justify-center h-48 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
               <AlertCircle className="h-10 w-10 mb-2 opacity-50" />
               <p>
                   {schedules.length === 0 
                    ? "No classes scheduled for today." 
                    : "No classes match your selected filters."}
               </p>
               {schedules.length > 0 && (
                   <Button variant="link" onClick={() => { setSelectedFaculty("ALL"); setSelectedType("ALL"); }} className="mt-2 h-auto p-0">
                       Clear Filters
                   </Button>
               )}
           </div>
        ) : (
            // DATA STATE
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
                {schedulesToShow.map((item, index) => {
                const colorTheme = scheduleColorPalette[index % scheduleColorPalette.length];
                const startTime = formatTime(item.start_time);
                const endTime = formatTime(item.end_time);

                return (
                    <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.3 }}
                    >
                    <div 
                        className={`flex flex-col p-4 rounded-lg border-l-4 h-full ${colorTheme.border} ${colorTheme.bg} shadow-sm transition-all hover:shadow-md`}
                    >
                        <div>
                            <div className="flex justify-between items-start">
                                <p className={`font-bold text-sm ${colorTheme.text} uppercase tracking-tight`}>
                                    {item.subject_code}
                                </p>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold bg-white/60 ${colorTheme.text}`}>
                                    {item.type}
                                </span>
                            </div>
                            <p className="text-xs font-medium text-foreground/80 line-clamp-1 mt-0.5" title={item.description}>
                                {item.description}
                            </p>
                        </div>
                        
                        <div className="space-y-2 text-sm text-muted-foreground mt-4">
                            {/* TIME */}
                            <div className="flex items-center">
                                <Clock size={14} className="mr-2 flex-shrink-0 text-foreground/60" />
                                <span className="font-medium text-foreground/90">{startTime} - {endTime}</span>
                            </div>
                            
                            {/* ROOM */}
                            <div className="flex items-center">
                                <DoorClosed size={14} className="mr-2 flex-shrink-0 text-foreground/60" />
                                <span>{item.room_number}</span>
                            </div>

                            {/* SECTION */}
                            {/* <div className="flex items-center">
                                <Users size={14} className="mr-2 flex-shrink-0 text-foreground/60" />
                                <span>{item.section || "N/A"}</span>
                            </div> */}

                            {/* FACULTY */}
                            <div className="flex items-center">
                                <User size={14} className="mr-2 flex-shrink-0 text-foreground/60" />
                                <span>{item.faculty_name}</span>
                            </div>
                        </div>
                    </div>
                    </motion.div>
                );
                })}
            </AnimatePresence>
            </div>
        )}
      </CardContent>

      {!isLoading && filteredSchedules.length > INITIAL_DISPLAY_COUNT && (
        <div className="p-4 mt-auto border-t border-border">
          <Button
            variant="ghost"
            className="w-full text-primary hover:text-primary hover:bg-primary/10 transition-colors"
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