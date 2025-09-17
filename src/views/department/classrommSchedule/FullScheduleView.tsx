import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
// GI-UPDATE: Gidugang ang X icon
import { Download, Filter, Search, MapPin, BookOpen, Clock, User, CalendarDays, Tag, Loader2, X } from 'lucide-react';
import type React from "react";
import { useMemo, useState, useRef, useCallback } from "react";
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
const DAY_START_HOUR = 8;
const DAY_TOTAL_HOURS = 12;
const DAY_END_HOUR = DAY_START_HOUR + DAY_TOTAL_HOURS;
const MINUTES_PER_HOUR = 60;
const PX_PER_MINUTE = 2;
const HOUR_ROW_HEIGHT = MINUTES_PER_HOUR * PX_PER_MINUTE;
const GRID_TOTAL_MINUTES = (DAY_END_HOUR - DAY_START_HOUR) * MINUTES_PER_HOUR;
const GRID_TOTAL_HEIGHT = GRID_TOTAL_MINUTES * PX_PER_MINUTE;

// Types
type ScheduleClass = {
  id: string | number;
  code: string;
  title: string;
  department?: string;
  room?: string | null;
  time?: string;
  days?: string[];
  instructor?: string | null;
  facultyName?: string | null;
};

// Helper functions
const formatTime12hr = (hour24: number) => {
  const ampm = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;
  return `${hour12}:00 ${ampm}`;
};

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

const parseTimeRange = (range?: string | null): { start: number; end: number } | null => {
  if (!range || typeof range !== "string") return null;
  const parts = range.split(/-|–|—/);
  if (parts.length < 2) return null;
  const start = parseTimeTokenToMinutes(parts[0]);
  const end = parseTimeTokenToMinutes(parts[1]);
  if (start == null || end == null || end <= start) return null;
  return { start, end };
};

const dayAbbrev = (full: string) => full.substring(0, 3);
const formatDays = (days?: string[]) => (Array.isArray(days) ? days.join(", ") : "");

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
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeClass, setActiveClass] = useState<ScheduleClass | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const scheduleRef = useRef<HTMLDivElement>(null);

  const handleFilter = useCallback(() => {
    setAppliedQuery(query);
  }, [query]);

  // GI-UPDATE: Bag-o nga function para i-handle ang pag-clear sa search
  const handleClearSearch = useCallback(() => {
    setQuery('');
    setAppliedQuery('');
  }, []);

  // GI-UPDATE: Gi-update ang function para sa pag-change sa input
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    // Kung ang search bar mahimong blangko, i-reset dayon ang filter
    if (newQuery === '') {
      setAppliedQuery('');
    }
  };

  const filteredClasses = useMemo(() => {
    if (!appliedQuery.trim()) return classes;
    const q = appliedQuery.toLowerCase();
    return classes.filter((c) => {
      const haystack = [
        c?.code,
        c?.title,
        c?.room ?? "",
        c?.department ?? "",
        Array.isArray(c?.days) ? c.days.join(" ") : "",
        c?.time ?? "",
        c?.facultyName ?? c?.instructor ?? "",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [classes, appliedQuery]);

  const classesByDay: Record<string, ScheduleClass[]> = useMemo(() => {
    const map: Record<string, ScheduleClass[]> = {};
    days.forEach((d) => (map[d] = []));
    filteredClasses.forEach((c) => {
      if (!Array.isArray(c?.days)) return;
      days.forEach((fullDay) => {
        const abbr = dayAbbrev(fullDay);
        if (c.days!.includes(abbr)) {
          map[fullDay].push(c);
        }
      });
    });
    Object.keys(map).forEach((d) => {
      map[d].sort((a, b) => {
        const ra = parseTimeRange(a.time ?? null);
        const rb = parseTimeRange(b.time ?? null);
        return (ra?.start ?? Infinity) - (rb?.start ?? Infinity);
      });
    });
    return map;
  }, [filteredClasses, days]);

  const todayName = useMemo(
    () => new Date().toLocaleDateString("en-US", { weekday: "long" }),
    []
  );

  const hourTicks = useMemo(
    () => Array.from({ length: DAY_END_HOUR - DAY_START_HOUR + 1 }, (_, i) => DAY_START_HOUR + i),
    []
  );

  const minuteToPx = (minutesFromDayStart: number) => minutesFromDayStart * PX_PER_MINUTE;
  const clampToDay = (minutes: number) =>
    Math.max(DAY_START_HOUR * 60, Math.min(DAY_END_HOUR * 60, minutes));

  const openDetails = (c: ScheduleClass) => {
    setActiveClass(c);
    setOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, c: ScheduleClass) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openDetails(c);
    }
  };

  const handleDownloadPDF = () => {
    const scheduleElement = scheduleRef.current;
    if (!scheduleElement) return;
    setIsDownloading(true);
    html2canvas(scheduleElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: scheduleElement.scrollWidth,
      windowHeight: scheduleElement.scrollHeight,
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('classroom-schedule.pdf');
      setIsDownloading(false);
    }).catch(err => {
      console.error("Error generating PDF:", err);
      alert("Sorry, an error occurred while generating the PDF. Please try again.");
      setIsDownloading(false);
    });
  };

  return (
    <div className="rounded-2xl">
      {/* Header Section */}
      <div className="mb-6 rounded-2xl border bg-gradient-to-br from-slate-50 via-white to-white p-5 shadow-sm">
        <div className="flex flex-col justify-between items-start gap-4 min-[640px]:flex-row min-[640px]:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Weekly Schedule</h2>
            <p className="text-sm text-gray-500">Explore all classes organized by day and time.</p>
          </div>
          <div className="flex items-center gap-3 w-full min-[640px]:w-auto">
            {/* GI-UPDATE: Gi-update ang Search Input para naay Clear button */}
            <div className="relative flex-grow">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                value={query}
                onChange={handleQueryChange}
                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                placeholder="Search course, code, room, faculty..."
                aria-label="Search schedule"
                className="pl-10 pr-10 py-2 w-full rounded-full border-gray-300"
              />
              {query && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                >
                  <X size={16} className="text-red-500" />
                </Button>
              )}
            </div>
            <Button onClick={handleFilter} variant="outline" className="flex items-center gap-2 rounded-full border-gray-300 bg-white/70 backdrop-blur">
              <Filter size={16} />
              <span className="font-medium">Filter</span>
            </Button>
            <Button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="flex items-center gap-2 rounded-full border-gray-300 bg-red-500 hover:bg-red-400"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>PDF</span>
                </>
              )}
            </Button>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <div className="flex flex-wrap min-[640px]:flex-nowrap items-center gap-2 pb-2">
            {Object.entries(departmentColors).map(([dept, cls]) => (
              <span key={dept} className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium ${cls} whitespace-nowrap shadow-sm`}>
                <span className="h-2 w-2 rounded-full bg-current opacity-60" />
                {dept}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Empty state when no matches */}
      {filteredClasses.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center text-gray-600" role="status" aria-live="polite">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Search size={20} />
          </div>
          <p className="font-medium">
            {appliedQuery ? "No classes match your search." : "No classes to display."}
          </p>
          <p className="text-sm text-gray-500">
            {appliedQuery ? "Try a different keyword or clear the search." : "Check back later for schedule updates."}
          </p>
        </div>
      ) : (
        <div ref={scheduleRef} id="schedule-container" className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <div className="md:hidden sm:hidden grid w-full min-w-[1000px] grid-cols-[96px_repeat(6,minmax(0,1fr))]" role="grid">
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
                role="columnheader"
              >
                {day}
                {day === todayName && (
                  <span className="ml-2 align-middle text-[10px] font-bold uppercase tracking-wide text-blue-700">
                    Today
                  </span>
                )}
              </div>
            ))}

            {/* Time column */}
            <div
              className="sticky left-0 z-10 border-r bg-white"
              style={{ height: GRID_TOTAL_HEIGHT }}
              aria-hidden="true"
            >
              {hourTicks.map((h, idx) => {
                const topPx = minuteToPx((h - DAY_START_HOUR) * 60);
                return (
                  <div key={h} className="absolute left-0 right-0" style={{ top: topPx }}>
                    <div className="w-full border-t border-gray-200" />
                    <div
                      className={`absolute left-2 px-1.5 py-0.5 text-sm font-medium ${
                        idx % 2 === 0 ? "text-gray-600" : "text-gray-500"
                      }`}
                      style={{ top: idx === hourTicks.length - 1 ? -8 : 8 }}
                    >
                      {formatTime12hr(h)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Day columns */}
            {days.map((day) => (
              <div
                key={day}
                className="relative border-r"
                style={{ height: GRID_TOTAL_HEIGHT }}
                role="gridcell"
              >
                {day === todayName && (
                  <div className="absolute inset-0 bg-blue-50/40 pointer-events-none z-10" />
                )}

                {hourTicks.slice(0, -1).map((h, idx) => (
                  <div
                    key={`${day}-bg-${h}`}
                    className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} absolute left-0 right-0 z-0`}
                    style={{
                      top: minuteToPx((h - DAY_START_HOUR) * 60),
                      height: HOUR_ROW_HEIGHT,
                    }}
                  />
                ))}
                
                {hourTicks.map((h) => (
                    <div
                      key={`${day}-line-${h}`}
                      className="absolute left-0 right-0 border-t border-gray-200 z-0"
                      style={{ top: minuteToPx((h - DAY_START_HOUR) * 60) }}
                    />
                ))}

                {day === 'Monday' && (
                  <div
                    className="absolute left-0 z-10 flex items-center justify-center bg-gray-300 border-y border-dashed border-gray-400 pointer-events-none"
                    style={{
                      top: minuteToPx((12 - DAY_START_HOUR) * 60),
                      height: HOUR_ROW_HEIGHT,
                      width: 'calc(600% + 5px)',
                    }}
                    aria-hidden="true"
                  >
                    <span className="text-sm font-semibold text-gray-800 tracking-wider uppercase">
                      Lunch Break
                    </span>
                  </div>
                )}

                {filteredClasses
                  .filter(
                    (c) =>
                      c.days?.includes(dayAbbrev(day)) && parseTimeRange(c.time)
                  )
                  .map((c) => {
                    const range = parseTimeRange(c.time)!;
                    const startClamped = clampToDay(range.start);
                    const endClamped = clampToDay(range.end);
                    const startOffsetMins = startClamped - DAY_START_HOUR * 60;
                    const durationMins = endClamped - startClamped;
                    const topPx = minuteToPx(startOffsetMins);
                    const heightPx = minuteToPx(durationMins);
                    const facultyDisplay = c.facultyName ?? c.instructor;

                    return (
                      <div
                        key={c.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => openDetails(c)}
                        onKeyDown={(e) => handleKeyDown(e,c)}
                        aria-label={`${c.code}: ${c.title}`}
                        className={`absolute left-2 right-2 rounded-lg border shadow-sm cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg z-20 ${
                          departmentColors[c.department ?? ""] || "bg-gray-50 text-gray-800"
                        }`}
                        style={{ top: topPx + 4, height: Math.max(32, heightPx - 8) }}
                        title={`${c.title} • ${c.room ?? "TBA"}`}
                      >
                        <div className="p-2.5 h-full flex flex-col text-xs md:text-sm">
                           <p className="font-bold">{c.code}</p>
                           <div className="flex items-center gap-2 text-gray-600">
                            <BookOpen size={14} />
                            <p className="truncate">{c.title}</p>
                           </div>
                           <div className="mt-auto flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-white/60 px-2 py-0.5 text-[11px] font-medium border">
                              <MapPin size={12} /> {c.room ?? "TBA"}
                            </span>
                            {facultyDisplay && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-white/60 px-2 py-0.5 text-[11px] font-medium border">
                                <User size={12} /> <span className="truncate max-w-[10rem]">{facultyDisplay}</span>
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

      {/* Mobile View: Card List */}
      <div className="rounded-xl border md:block hidden bg-white shadow-sm mt-6">
        <div className="p-4">
          <Accordion type="single" collapsible defaultValue={todayName}>
            {days.map((day) => {
              const items = classesByDay[day] || [];
              return (
                <AccordionItem value={day} key={day}>
                  <AccordionTrigger>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold ${day === todayName ? "text-blue-800" : "text-gray-800"}`}>
                          {day}
                        </h3>
                        {day === todayName && (
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-700">Today</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{items.length} class{items.length !== 1 && 'es'}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {items.length > 0 ? (
                      <div className="space-y-3 pt-3">
                        {items.map((c) => (
                          <div
                            key={c.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => openDetails(c)}
                            onKeyDown={(e) => handleKeyDown(e, c)}
                            className={`rounded-xl border p-3.5 shadow-sm transition-all hover:shadow-md ${
                              departmentColors[c.department ?? ""] || "bg-gray-50"
                            }`}
                          >
                            <div className="mb-1.5 flex items-center justify-between">
                              <p className="font-bold text-sm">{c.code}</p>
                              {c.time && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5 text-[10px] border text-gray-700">
                                  <Clock size={12} /> {c.time}
                                </span>
                              )}
                            </div>
                            <p className="mb-2 truncate text-gray-700" title={c.title}>{c.title}</p>
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-700">
                                <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5 border">
                                  <MapPin size={12} /> {c.room ?? "TBA"}
                                </span>
                                {c.facultyName && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5 border">
                                    <User size={12} /> <span className="truncate max-w-[10rem]">{c.facultyName}</span>
                                  </span>
                                )}
                                <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5 border">
                                  <Clock size={12} /> {formatDuration(c.time)}
                                </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 pt-2">No classes scheduled.</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag size={18} className="text-gray-500" />
              {activeClass?.code || "Class Details"}
            </DialogTitle>
            <DialogDescription>Detailed information for the selected class.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {activeClass?.title && (
              <div className="flex items-start gap-3">
                <BookOpen size={16} className="mt-1 text-gray-500" />
                <div>
                  <p className="font-semibold text-gray-900">{activeClass.title}</p>
                  {activeClass.department && <p className="text-sm text-gray-500">{activeClass.department}</p>}
                </div>
              </div>
            )}
            {(activeClass?.facultyName || activeClass?.instructor) && (
              <div className="flex items-center gap-3">
                <User size={16} className="text-gray-500" />
                <span>{activeClass?.facultyName ?? activeClass?.instructor}</span>
              </div>
            )}
            <div className="flex items-start gap-3">
              <Clock size={16} className="mt-1 text-gray-500" />
              <div>
                <p>{activeClass?.time} <span className="text-sm text-gray-500">({formatDuration(activeClass?.time)})</span></p>
                {activeClass?.days?.length && (
                    <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-600">
                      <CalendarDays size={14} /> {formatDays(activeClass.days)}
                    </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-gray-500" />
              <span>{activeClass?.room ?? "TBA"}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FullScheduleView;