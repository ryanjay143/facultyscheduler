import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    List, 
    PlusCircle, 
    User, 
    BookOpen,     
    ArrowDownCircle, 
    TrendingUp,   
    CheckCircle2, 
} from "lucide-react";
import type { Faculty } from "../../type";

// --- HELPERS ---
const expertiseColorPalette = [
  { bg: "bg-blue-100", text: "text-blue-800" },
  { bg: "bg-emerald-100", text: "text-emerald-800" },
  { bg: "bg-amber-100", text: "text-amber-800" },
  { bg: "bg-rose-100", text: "text-rose-800" },
  { bg: "bg-indigo-100", text: "text-indigo-800" },
  { bg: "bg-cyan-100", text: "text-cyan-800" },
  { bg: "bg-pink-100", text: "text-pink-800" },
];

function getExpertiseColor(label: string) {
  let hash = 0;
  const s = (label || '').toLowerCase();
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i);
    hash |= 0; 
  }
  const idx = Math.abs(hash) % expertiseColorPalette.length;
  return expertiseColorPalette[idx];
}

export function FacultyCard({
  data,
  onAssignClick,
  onViewSubjectsClick,
}: {
  data: Faculty[];
  onAssignClick: (f: Faculty) => void;
  onViewSubjectsClick: (f: Faculty) => void;
}) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        No faculty found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
      {data.map((f) => {
        // Image Handling
        const imageUrl = f.profile_picture 
            ? (f.profile_picture.startsWith('http') ? f.profile_picture : `${import.meta.env.VITE_URL}/${f.profile_picture}`)
            : null;

        // --- STATUS LOGIC ---
        const isOverloaded = f.overload_units > 0;
        const status = isOverloaded ? "overloaded" : "ok";

        const statusConfig = {
          overloaded: { label: "Overload", icon: TrendingUp, text: "text-red-700", bg: "bg-red-50", ring: "ring-1 ring-red-200", dot: "bg-red-500" },
          ok: { label: "Teaching", icon: CheckCircle2, text: "text-emerald-700", bg: "bg-emerald-50", ring: "ring-1 ring-emerald-200", dot: "bg-emerald-500" },
        };
        const currentStatus = statusConfig[status];
        const StatusIcon = currentStatus.icon;

        return (
          <div
            key={f.id}
            className={`relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${currentStatus.ring}`}
          >
            {/* Decorative gradient */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-primary/15 to-indigo-100 blur-2xl" />

            {/* --- HEADER SECTION --- */}
            <div className="flex items-start gap-4">
              <div className="relative">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={f.name}
                    className="h-16 w-16 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-primary/20"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white grid place-items-center text-lg font-bold border-4 border-white shadow-md ring-2 ring-primary/20">
                    <User className="w-7 h-7 opacity-90" />
                  </div>
                )}
                <span className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full ring-2 ring-white ${currentStatus.dot}`} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="truncate text-lg font-bold text-foreground">{f.name}</h3>
                  <div className={`ml-2 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${currentStatus.bg} ${currentStatus.text}`}>
                    <StatusIcon size={12} />
                    <span>{currentStatus.label}</span>
                  </div>
                </div>
                
                <div className="mt-1">
                  <Badge variant="secondary" className="text-[10px] px-2 py-0 font-normal text-muted-foreground border-slate-200">
                   {f.department}
                  </Badge>
                </div>

                {f.expertise?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {f.expertise.slice(0, 3).map((x, i) => {
                      const color = getExpertiseColor(x);
                      return (
                        <Badge key={`${x}-${i}`} className={`text-[10px] px-2 py-0.5 ${color.bg} hover:${color.bg} ${color.text} border-0`}>
                          {x}
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* --- STATS SECTION --- */}
            <div className="mt-6 grid grid-cols-3 gap-3">
                
                {/* 1. Teaching Load (Renamed from Regular) */}
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-center">
                    <div className="flex items-center gap-1.5 text-blue-600 mb-1">
                        <BookOpen size={14} />
                        {/* CHANGED HERE: Regular -> Teaching */}
                        <span className="text-[10px] font-bold uppercase tracking-wide">Teaching</span>
                    </div>
                    <div className="mt-1">
                        <span className="text-2xl font-bold text-blue-900 leading-none">
                            {f.t_load_units || 0}
                        </span>
                        <span className="block text-[10px] font-medium text-blue-600/70 mt-0.5">
                            Units
                        </span>
                    </div>
                </div>

                {/* 2. Deload */}
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-amber-50/50 border border-amber-100 text-center">
                    <div className="flex items-center gap-1.5 text-amber-600 mb-1">
                        <ArrowDownCircle size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wide">Deload</span>
                    </div>
                    <div className="mt-1">
                        <span className="text-2xl font-bold text-amber-900 leading-none">
                            {f.deload_units || 0}
                        </span>
                        <span className="block text-[10px] font-medium text-amber-600/70 mt-0.5">
                            Units
                        </span>
                    </div>
                </div>

                {/* 3. Overload */}
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-red-50/50 border border-red-100 text-center">
                    <div className="flex items-center gap-1.5 text-red-600 mb-1">
                        <TrendingUp size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wide">Overload</span>
                    </div>
                    <div className="mt-1">
                        <span className="text-2xl font-bold text-red-900 leading-none">
                            {f.overload_units || 0}
                        </span>
                        <span className="block text-[10px] font-medium text-red-600/70 mt-0.5">
                            Units
                        </span>
                    </div>
                </div>

            </div>

            {/* --- ACTIONS --- */}
            <div className="mt-5 flex justify-end gap-2 border-t pt-4">
              <Button size="sm" onClick={() => onAssignClick(f)} className="shadow-sm h-8">
                <PlusCircle className="mr-2 h-3.5 w-3.5" /> Assign
              </Button>
              <Button size="sm" variant="outline" onClick={() => onViewSubjectsClick(f)} className="h-8">
                <List className="mr-2 h-3.5 w-3.5" /> View Schedule
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}