import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Filter, Search, MapPin, BookOpen, Clock, User, CalendarDays, Tag } from "lucide-react";

// Department color classes (example, keep your existing mapping if already defined)
const departmentColors: { [key: string]: string } = {
  "Computer Science": "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  "Information Technology": "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
  "Data Science": "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
  English: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
  Mathematics: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
  Physics: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
  History: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
  Business: "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100",
  Arts: "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100",
  Science: "bg-lime-50 text-lime-700 border-lime-200 hover:bg-lime-100",
};

// Constants for the schedule scale
// Configure the visible day window to exactly 12 hours (default: 8 AM to 8 PM)
const DAY_START_HOUR = 8; // 08:00
const DAY_TOTAL_HOURS = 12; // render exactly 12 hours on the grid
const DAY_END_HOUR = DAY_START_HOUR + DAY_TOTAL_HOURS; // 20 => 8 PM
const MINUTES_PER_HOUR = 60;
// 2px per minute => 120px per hour. Adjust to taste.
const PX_PER_MINUTE = 2;
const HOUR_ROW_HEIGHT = MINUTES_PER_HOUR * PX_PER_MINUTE; // 120px per hour
const GRID_TOTAL_MINUTES = (DAY_END_HOUR - DAY_START_HOUR) * MINUTES_PER_HOUR;
const GRID_TOTAL_HEIGHT = GRID_TOTAL_MINUTES * PX_PER_MINUTE;

// Types
type ScheduleClass = {
  id: string | number;
  code: string;
  title: string;
  department?: string;
  room?: string | null;
  time?: string; // e.g. "8:00 AM - 9:30 AM"
  days?: string[]; // e.g. ["Mon","Wed","Fri"]
  instructor?: string | null; // existing field used in some places
  facultyName?: string | null; // new field (displayed; falls back to instructor)
};

// Helper to convert an hour (0-23) to 12h display (for time axis labels)
const formatTime12hr = (hour24: number) => {
  const ampm = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;
  return `${hour12}:00 ${ampm}`;
};

// Parse a single time token like "08:00", "8:30", "9", "10 AM", "10:30 PM"
const parseTimeTokenToMinutes = (token: string): number | null => {
  const m = token.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (!m) return null;
  let hour = parseInt(m[1], 10);
  const minute = m[2] ? parseInt(m[2], 10) : 0;
  const ampm = (m[3] || "").toUpperCase();

  if (ampm === "PM" && hour < 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;

  return hour * 60 + minute;
};

// Parse a range like "08:00-09:30", "10:30 AM - 12:00 PM"
const parseTimeRange = (range?: string | null): { start: number; end: number } | null => {
  if (!range || typeof range !== "string") return null;
  const parts = range.split(/-|–|—/); // support -, en-dash, em-dash
  if (parts.length < 2) return null;

  const start = parseTimeTokenToMinutes(parts[0]);
  const end = parseTimeTokenToMinutes(parts[1]);

  if (start == null || end == null) return null;
  if (end <= start) return null; // invalid or overnight not supported here
  return { start, end };
};

// Short day name from full day
const dayAbbrev = (full: string) => full.substring(0, 3);

// Format days like ["Mon","Wed","Fri"] to "Mon, Wed, Fri"
const formatDays = (days?: string[]) => (Array.isArray(days) ? days.join(", ") : "");

// Compute duration label from time range
const formatDuration = (range?: string | null) => {
  const parsed = parseTimeRange(range);
  if (!parsed) return "";
  const mins = parsed.end - parsed.start;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
};

const FullScheduleView = ({ classes }: { classes: ScheduleClass[] }) => {
  // Include Saturday
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeClass, setActiveClass] = useState<ScheduleClass | null>(null);

  const filteredClasses = useMemo(() => {
    if (!query.trim()) return classes;
    const q = query.toLowerCase();
    return classes.filter((c) => {
      const haystack = [
        c?.code,
        c?.title,
        c?.room ?? "",
        c?.department ?? "",
        Array.isArray(c?.days) ? c.days.join(" ") : "",
        c?.time ?? "",
        // Include faculty/instructor in search
        (c?.facultyName ?? c?.instructor ?? ""),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [classes, query]);

  const todayName = useMemo(
    () => new Date().toLocaleDateString("en-US", { weekday: "long" }),
    []
  );

  const hourTicks = useMemo(
    () => Array.from({ length: DAY_END_HOUR - DAY_START_HOUR + 1 }, (_, i) => DAY_START_HOUR + i),
    []
  );

  // Height helpers
  const minuteToPx = (minutesFromDayStart: number) => minutesFromDayStart * PX_PER_MINUTE;
  const clampToDay = (minutes: number) =>
    Math.max(DAY_START_HOUR * 60, Math.min(DAY_END_HOUR * 60, minutes));

  const openDetails = (c: ScheduleClass) => {
    setActiveClass(c);
    setOpen(true);
  };

  return (
    <div className="rounded-2xl">
      {/* Header Section */}
      <div className="mb-6 rounded-2xl border bg-gradient-to-r from-slate-50 to-white p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Weekly Schedule</h2>
            <p className="text-sm text-gray-500">Explore all your classes neatly organized by day and time.</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} aria-hidden={true} />
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by course, code, room, department, or faculty..."
                aria-label="Search schedule"
                className="pl-12 pr-4 py-2 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2 px-4 py-2 rounded-xl border-gray-300 hover:bg-gray-100"
              aria-label="Open filters"
            >
              <Filter size={16} />
              <span className="font-medium">Filter</span>
            </Button>
          </div>
        </div>

        {/* Department Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {Object.entries(departmentColors).map(([dept, cls]) => (
            <span
              key={dept}
              className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium ${cls}`}
              title={dept}
            >
              <span className="h-2 w-2 rounded-full bg-current opacity-60" />
              {dept}
            </span>
          ))}
        </div>
      </div>

      {/* Empty state when no matches */}
      {filteredClasses.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center text-gray-600">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Search size={20} />
          </div>
          <p className="font-medium">No classes match your search.</p>
          <p className="text-sm text-gray-500">Try a different keyword or clear the search.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          {/* Responsive grid: fixed left time column (96px) + 6 flexible day columns */}
          <div className="grid w-full min-w-0 grid-cols-[96px_repeat(6,minmax(0,1fr))]">
            {/* Header row */}
            <div className="sticky left-0 z-10 bg-gray-100 p-4 font-semibold text-gray-700 border-b border-r">
              Time
            </div>
            {days.map((day) => (
              <div
                key={day}
                className={`p-4 font-semibold text-center border-b border-r ${
                  day === todayName ? "bg-blue-50 text-blue-800" : "bg-gray-100 text-gray-700"
                }`}
                title={day === todayName ? "Today" : undefined}
              >
                {day}
                {day === todayName && (
                  <span className="ml-2 align-middle text-[10px] font-bold uppercase tracking-wide text-blue-700">
                    Today
                  </span>
                )}
              </div>
            ))}

            {/* Time column with hour ticks */}
            <div className="relative border-r bg-white" style={{ height: GRID_TOTAL_HEIGHT }}>
              {/* Hour lines + labels */}
              {hourTicks.map((h, idx) => {
                const topPx = minuteToPx((h - DAY_START_HOUR) * 60);
                const isEven = idx % 2 === 0;
                const isLast = idx === hourTicks.length - 1;

                return (
                  <div key={h} className="absolute left-0 right-0" style={{ top: topPx }}>
                    <div className="flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    {/* Place labels slightly below every line, and the last one slightly above to avoid clipping */}
                    <div
                      className={`absolute left-2 px-1.5 py-0.5 text-sm font-medium ${isEven ? "text-gray-600" : "text-gray-500"}`}
                      style={{ top: isLast ? -8 : 8 }}
                    >
                      {formatTime12hr(h)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Day columns */}
            {days.map((day) => (
              <div key={day} className="relative border-r" style={{ height: GRID_TOTAL_HEIGHT }}>
                {/* Subtle alternating hour backgrounds */}
                {hourTicks.slice(0, hourTicks.length - 1).map((h, idx) => {
                  const topPx = minuteToPx((h - DAY_START_HOUR) * 60);
                  return (
                    <div
                      key={`${day}-bg-${h}`}
                      className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                      style={{ position: "absolute", left: 0, right: 0, top: topPx, height: HOUR_ROW_HEIGHT }}
                      aria-hidden="true"
                    />
                  );
                })}

                {/* Hour separators */}
                {hourTicks.map((h) => {
                  const topPx = minuteToPx((h - DAY_START_HOUR) * 60);
                  return (
                    <div
                      key={`${day}-line-${h}`}
                      className="absolute left-0 right-0 border-t border-gray-200"
                      style={{ top: topPx }}
                      aria-hidden="true"
                    />
                  );
                })}

                {/* Render class blocks absolutely positioned */}
                {filteredClasses
                  .filter(
                    (c) =>
                      Array.isArray(c?.days) &&
                      c.days.includes(dayAbbrev(day)) &&
                      typeof c?.time === "string" &&
                      parseTimeRange(c.time)
                  )
                  .map((c) => {
                    const range = parseTimeRange(c.time)!;
                    // Clamp to visible day window
                    const startClamped = clampToDay(range.start);
                    const endClamped = clampToDay(range.end);
                    const startOffsetMins = Math.max(0, startClamped - DAY_START_HOUR * 60);
                    const durationMins = Math.max(15, endClamped - startClamped); // ensure minimum height
                    const topPx = minuteToPx(startOffsetMins);
                    const heightPx = Math.max(32, minuteToPx(durationMins)); // at least 32px tall

                    const facultyDisplay = c.facultyName ?? c.instructor;

                    // Click handler (mouse + keyboard)
                    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openDetails(c);
                      }
                    };

                    return (
                      <div
                        key={c.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => openDetails(c)}
                        onKeyDown={onKeyDown}
                        aria-label={`${c.code}: ${c.title} in ${c.room ?? "TBA"}`}
                        className={`absolute left-2 right-2 rounded-lg border shadow-sm text-xs md:text-sm cursor-pointer transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-lg ${
                          departmentColors[c.department ?? ""] || "bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100"
                        }`}
                        style={{ top: topPx + 4, height: heightPx - 8 }}
                        title={`${c.title} • ${c.room ?? "TBA"}`}
                      >
                        <div className="p-2.5 md:p-3 h-full flex flex-col">
                          <p className="mb-1 font-bold text-sm leading-tight">{c.code}</p>
                          <div className="mb-1 flex items-center gap-2 text-gray-600">
                            <BookOpen size={14} aria-hidden={true} />
                            <p className="truncate" title={typeof c.title === "string" ? c.title : ""}>
                              {c.title}
                            </p>
                          </div>
                          <div className="mt-auto flex flex-wrap items-center gap-2 text-gray-600">
                            <span className="inline-flex items-center gap-1 rounded-full bg-white/60 px-2 py-0.5 text-[11px] font-medium border">
                              <MapPin size={12} aria-hidden={true} />
                              <span>{c.room ?? "TBA"}</span>
                            </span>
                            {c.time && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-white/60 px-2 py-0.5 text-[11px] font-medium border">
                                <Clock size={12} aria-hidden={true} />
                                <span>{c.time}</span>
                              </span>
                            )}
                            {facultyDisplay && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-white/60 px-2 py-0.5 text-[11px] font-medium border">
                                <User size={12} aria-hidden={true} />
                                <span className="truncate max-w-[10rem]" title={facultyDisplay}>
                                  {facultyDisplay}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Details Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag size={18} className="text-gray-500" />
              {activeClass?.code || "Class details"}
            </DialogTitle>
            <DialogDescription>
              Detailed information for the selected class schedule.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {/* Title */}
            {activeClass?.title && (
              <div className="flex items-start gap-2">
                <BookOpen size={16} className="mt-0.5 text-gray-500" />
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900">{activeClass.title}</p>
                  {activeClass.department && (
                    <p className="text-sm text-gray-500">{activeClass.department}</p>
                  )}
                </div>
              </div>
            )}

            {/* Faculty */}
            {(activeClass?.facultyName || activeClass?.instructor) && (
              <div className="flex items-center gap-2">
                <User size={16} className="text-gray-500" />
                <span className="text-gray-800">
                  {activeClass?.facultyName ?? activeClass?.instructor}
                </span>
              </div>
            )}

            {/* Time and duration */}
            {(activeClass?.time || activeClass?.days?.length) && (
              <div className="flex items-start gap-2">
                <Clock size={16} className="mt-0.5 text-gray-500" />
                <div className="min-w-0 text-gray-800">
                  <div>
                    {activeClass?.time ? activeClass.time : null}
                    {activeClass?.time && (
                      <span className="ml-2 text-sm text-gray-500">
                        {formatDuration(activeClass.time)}
                      </span>
                    )}
                  </div>
                  {activeClass?.days?.length ? (
                    <div className="mt-0.5 flex items-center gap-1 text-sm text-gray-600">
                      <CalendarDays size={14} className="text-gray-500" />
                      <span>{formatDays(activeClass.days)}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            )}

            {/* Room */}
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-gray-500" />
              <span className="text-gray-800">{activeClass?.room ?? "TBA"}</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FullScheduleView;