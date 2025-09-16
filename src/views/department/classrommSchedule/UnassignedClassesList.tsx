import React, { useMemo, useState } from "react";
  import { motion, AnimatePresence } from "framer-motion";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { CheckCircle, Clock, PlusCircle, Search, MapPin } from "lucide-react";

  type ClassInfo = {
    id: string | number;
    code: string;
    title: string;
    department: string;
    days: string[]; // e.g., ["Mon", "Wed", "Fri"]
    time?: string;  // e.g., "10:00 - 11:00"
    room?: string;  // may be undefined for unassigned
  };

  type Props = {
    classes: ClassInfo[];
    onAssignClick: (classInfo: ClassInfo) => void;
    showSearch?: boolean; // optional enhancement, defaults to true
  };

  // Department theme tokens (static class names for Tailwind)
  const deptTheme: Record<
    string,
    {
      badge: string;
      border: string;
      text: string;
      ring: string;
      dot: string;
      cardAccent: string; // used for left gradient accent
    }
  > = {
    "Computer Science": {
      badge: "bg-blue-50 text-blue-700 border-blue-200",
      border: "border-blue-200",
      text: "text-blue-700",
      ring: "ring-blue-200",
      dot: "bg-blue-500",
      cardAccent: "from-blue-500/70 to-blue-400/40",
    },
    "Information Technology": {
      badge: "bg-green-50 text-green-700 border-green-200",
      border: "border-green-200",
      text: "text-green-700",
      ring: "ring-green-200",
      dot: "bg-green-500",
      cardAccent: "from-green-500/70 to-green-400/40",
    },
    "Data Science": {
      badge: "bg-purple-50 text-purple-700 border-purple-200",
      border: "border-purple-200",
      text: "text-purple-700",
      ring: "ring-purple-200",
      dot: "bg-purple-500",
      cardAccent: "from-purple-500/70 to-purple-400/40",
    },
    English: {
      badge: "bg-yellow-50 text-yellow-700 border-yellow-200",
      border: "border-yellow-200",
      text: "text-yellow-700",
      ring: "ring-yellow-200",
      dot: "bg-yellow-500",
      cardAccent: "from-yellow-500/70 to-yellow-400/40",
    },
    Mathematics: {
      badge: "bg-red-50 text-red-700 border-red-200",
      border: "border-red-200",
      text: "text-red-700",
      ring: "ring-red-200",
      dot: "bg-red-500",
      cardAccent: "from-red-500/70 to-red-400/40",
    },
    Physics: {
      badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
      border: "border-indigo-200",
      text: "text-indigo-700",
      ring: "ring-indigo-200",
      dot: "bg-indigo-500",
      cardAccent: "from-indigo-500/70 to-indigo-400/40",
    },
    History: {
      badge: "bg-orange-50 text-orange-700 border-orange-200",
      border: "border-orange-200",
      text: "text-orange-700",
      ring: "ring-orange-200",
      dot: "bg-orange-500",
      cardAccent: "from-orange-500/70 to-orange-400/40",
    },
    Business: {
      badge: "bg-cyan-50 text-cyan-700 border-cyan-200",
      border: "border-cyan-200",
      text: "text-cyan-700",
      ring: "ring-cyan-200",
      dot: "bg-cyan-500",
      cardAccent: "from-cyan-500/70 to-cyan-400/40",
    },
    Arts: {
      badge: "bg-pink-50 text-pink-700 border-pink-200",
      border: "border-pink-200",
      text: "text-pink-700",
      ring: "ring-pink-200",
      dot: "bg-pink-500",
      cardAccent: "from-pink-500/70 to-pink-400/40",
    },
    Science: {
      badge: "bg-lime-50 text-lime-700 border-lime-200",
      border: "border-lime-200",
      text: "text-lime-700",
      ring: "ring-lime-200",
      dot: "bg-lime-500",
      cardAccent: "from-lime-500/70 to-lime-400/40",
    },
  };

  const getDeptTheme = (dept?: string) =>
    (dept && deptTheme[dept]) || {
      badge: "bg-gray-50 text-gray-700 border-gray-200",
      border: "border-gray-200",
      text: "text-gray-700",
      ring: "ring-gray-200",
      dot: "bg-gray-500",
      cardAccent: "from-gray-500/60 to-gray-400/40",
    };

  const containerVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.06, delayChildren: 0.02 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  export const UnassignedClassesList: React.FC<Props> = ({
    classes,
    onAssignClick,
    showSearch = true,
  }) => {
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
      if (!query.trim()) return classes;
      const q = query.toLowerCase();
      return classes.filter((c) => {
        const haystack = [
          c.code,
          c.title,
          c.department,
          c.room,
          c.days?.join(" "),
          c.time,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      });
    }, [classes, query]);

    return (
      <div className="space-y-4">
        {/* Header + Search */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-800">Unassigned Classes</h3>
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
              {classes.length}
            </span>
          </div>
          {showSearch && (
            <div className="relative w-full sm:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search code, title, dept, or time..."
                aria-label="Search unassigned classes"
                className="pl-10"
              />
            </div>
          )}
        </div>

        {/* Empty State */}
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600">
              <CheckCircle size={24} />
            </div>
            <p className="text-base font-semibold text-gray-700">No Unassigned Classes</p>
            <p className="mt-1 text-sm text-gray-500">
              {query ? "No classes match your search." : "All classes have been assigned a room."}
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            <AnimatePresence initial={false}>
              {filtered.map((c) => {
                const theme = getDeptTheme(c.department);
                return (
                  <motion.div
                    key={c.id}
                    variants={itemVariants}
                    layout
                    exit={{ opacity: 0, y: -6 }}
                    className="group relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md"
                  >
                    {/* Left accent gradient */}
                    <div
                      className={`pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b ${theme.cardAccent}`}
                      aria-hidden="true"
                    />
                    {/* Hover ring */}
                    <div className={`absolute inset-0 rounded-xl ring-0 transition group-hover:ring-2 ${theme.ring}`} aria-hidden="true" />

                    <div className="relative flex items-start justify-between gap-4 p-4 sm:p-5">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-2 w-2 rounded-full bg-gray-300" aria-hidden="true" />
                          <p className="truncate text-sm font-bold text-gray-800 sm:text-base" title={`${c.code} - ${c.title}`}>
                            {c.code} — {c.title}
                          </p>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                          {/* Department badge */}
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-medium ${theme.badge}`}
                            title={c.department}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} aria-hidden="true" />
                            {c.department}
                          </span>

                          {/* Days + Time */}
                          <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 font-medium">
                            <Clock size={14} className="text-gray-500" aria-hidden="true" />
                            <span className="truncate">
                              {Array.isArray(c.days) ? c.days.join(", ") : ""}
                              {c.time ? ` • ${c.time}` : ""}
                            </span>
                          </span>

                          {/* Optional: Room (if present for context) */}
                          {c.room && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 font-medium">
                              <MapPin size={14} className="text-gray-500" aria-hidden="true" />
                              <span className="truncate">{c.room}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 self-center">
                        <Button
                          onClick={() => onAssignClick(c)}
                          aria-label={`Assign room for ${c.code}`}
                          className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2 transition-transform group-hover:translate-x-0.5"
                        >
                          <PlusCircle size={16} />
                          Assign Room
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    );
  };

  export default UnassignedClassesList;