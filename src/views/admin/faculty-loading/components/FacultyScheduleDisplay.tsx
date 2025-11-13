// src/app/admin/faculty-loading/components/FacultyScheduleDisplay.tsx

import { Badge } from "@/components/ui/badge";
import { CalendarOff, Clock } from "lucide-react";

interface TimeSlot {
  start: string; // Expects "HH:mm" format, e.g., "09:00" or "14:30"
  end: string;
}

interface FacultyScheduleDisplayProps {
  schedule: Record<string, TimeSlot[]>;
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
 * A utility function to convert a 24-hour time string ("HH:mm") to a 12-hour AM/PM format.
 */
const formatTimeTo12Hour = (timeStr: string): string => {
  if (!timeStr || !timeStr.includes(':')) {
    return 'Invalid Time';
  }
  const [hours, minutes] = timeStr.split(':');
  let h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12; // Convert hour to 12-hour format, '0' becomes '12'
  return `${h}:${minutes} ${ampm}`;
};


/**
 * A visually attractive component to display a faculty's weekly availability in a grid format.
 */
export function FacultyScheduleDisplay({ schedule }: FacultyScheduleDisplayProps) {
  // Get today's day name (e.g., "Wednesday") to highlight it in the UI
  const today = new Date().toLocaleString('en-US', { weekday: 'long' });

  return (
    <div className="bg-background p-2 rounded-lg border max-h-64 overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-2">
        {daysOfWeek.map((day) => {
          const daySlots = schedule[day];
          const isAvailable = daySlots && daySlots.length > 0;
          const isToday = day === today;

          return (
            <div 
              key={day}
              className={`rounded-md p-3 flex flex-col min-h-[80px] transition-all duration-200 ${
                isToday 
                ? 'bg-primary/10 border-2 border-primary/80' 
                : 'bg-muted/50 border border-transparent'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between mb-2">
                <p className={`font-bold text-sm ${isToday ? 'text-primary' : 'text-foreground'}`}>
                  {day}
                </p>
                {isToday && (
                  <Badge variant="default" className="text-[10px] h-5">TODAY</Badge>
                )}
              </div>

              {/* Time Slots or "Not Available" Message */}
              {isAvailable ? (
                <div className="space-y-1.5 flex-grow">
                  {daySlots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-2">
                       <Clock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                       <p className="font-mono text-xs text-foreground font-medium">
                         {formatTimeTo12Hour(slot.start)} - {formatTimeTo12Hour(slot.end)}
                       </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center flex-grow text-center text-slate-400">
                  <CalendarOff className="h-5 w-5 mb-1" />
                  <p className="text-xs italic">Not available</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}