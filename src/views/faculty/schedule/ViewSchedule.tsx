import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarX2, Clock, Building2, BookOpen, Search } from 'lucide-react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'

// --- TYPE DEFINITIONS & MOCK DATA ---
interface ScheduledClass {
  id: number;
  code: string;
  name: string;
  room: string;
  program: string;
  schedule: {
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
    time: string;
  };
  color: 'sky' | 'emerald' | 'indigo' | 'rose' | 'amber' | 'purple' | 'green' | 'orange' | 'slate';
}

const facultyScheduleData: ScheduledClass[] = [
  { id: 1, code: 'CS101', name: 'Intro to Programming', room: '101', program: 'BSIT', schedule: { day: 'Monday', time: '08:00 - 09:30' }, color: 'sky' },
  { id: 2, code: 'IT210', name: 'Web Development 1', room: 'Lab 2', program: 'BSIT', schedule: { day: 'Monday', time: '10:00 - 11:30' }, color: 'indigo' },
  { id: 3, code: 'CS320', name: 'Software Engineering', room: '303', program: 'BSCS', schedule: { day: 'Monday', time: '13:00 - 14:30' }, color: 'purple' },
  { id: 6, code: 'CS102', name: 'Data Structures', room: '102', program: 'BSCS', schedule: { day: 'Tuesday', time: '08:00 - 09:30' }, color: 'emerald' },
  { id: 11, code: 'CS205', name: 'Object-Oriented Prog.', room: '202', program: 'BSCS', schedule: { day: 'Wednesday', time: '08:00 - 09:30' }, color: 'green' },
  { id: 12, code: 'PE4', name: 'Physical Education 4', room: 'Gym', program: 'General', schedule: { day: 'Saturday', time: '09:00 - 11:00' }, color: 'orange' },
];

type DayName = ScheduledClass['schedule']['day'];
const daysOfWeek: DayName[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const getTodayName = (): DayName => {
  const d = new Date().toLocaleDateString('en-US', { weekday: 'long' }) as DayName;
  return daysOfWeek.includes(d) ? d : 'Monday';
};

const parseStartMinutes = (range: string) => { const [start] = range.split('-'); const [hh = 0, mm = 0] = start.split(':').map(Number); return hh * 60 + mm; };
const sortByStart = (a: ScheduledClass, b: ScheduledClass) => parseStartMinutes(a.schedule.time) - parseStartMinutes(b.schedule.time);

const colorMap: Record<ScheduledClass['color'], { border: string, bg: string, text: string }> = {
    sky: { border: 'border-sky-500', bg: 'bg-sky-500/10', text: 'text-sky-600' },
    emerald: { border: 'border-emerald-500', bg: 'bg-emerald-500/10', text: 'text-emerald-600' },
    indigo: { border: 'border-indigo-500', bg: 'bg-indigo-500/10', text: 'text-indigo-600' },
    rose: { border: 'border-rose-500', bg: 'bg-rose-500/10', text: 'text-rose-600' },
    amber: { border: 'border-amber-500', bg: 'bg-amber-500/10', text: 'text-amber-600' },
    purple: { border: 'border-purple-500', bg: 'bg-purple-500/10', text: 'text-purple-600' },
    green: { border: 'border-green-500', bg: 'bg-green-500/10', text: 'text-green-600' },
    orange: { border: 'border-orange-500', bg: 'bg-orange-500/10', text: 'text-orange-600' },
    slate: { border: 'border-slate-500', bg: 'bg-slate-500/10', text: 'text-slate-600' },
};

function ViewSchedule() {
  const today = getTodayName();
  const [selectedDay, setSelectedDay] = useState<DayName>(today);
  const [search, setSearch] = useState<string>('');
  const [program, setProgram] = useState<string>('All');

  const uniquePrograms = useMemo<string[]>(() => Array.from(new Set(facultyScheduleData.map((c) => c.program))).sort(), []);

  const byDay = useMemo(() => {
    const q = search.trim().toLowerCase();
    let base = facultyScheduleData.slice();
    if (program !== 'All') base = base.filter((c) => c.program === program);
    if (q) base = base.filter((c) => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q));
    
    const map = new Map<DayName, ScheduledClass[]>();
    daysOfWeek.forEach((d) => map.set(d, []));
    for (const item of base) {
        map.get(item.schedule.day)!.push(item);
    }
    daysOfWeek.forEach((d) => map.get(d)!.sort(sortByStart));
    return map;
  }, [search, program]);

  const classesForSelectedDay = byDay.get(selectedDay) ?? [];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">My Weekly Schedule</h1>
        <p className="text-muted-foreground mt-2">Browse your weekly teaching schedule and filter by program or subject.</p>
      </header>

      <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <Label className='text-foreground' htmlFor="search">Search Subject</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input  id="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by code or name..." className="pl-10 text-foreground"/>
              </div>
            </div>
            <div>
              <Label className='text-foreground' htmlFor="program">Filter by Program</Label>
              <Select value={program} onValueChange={setProgram}>
                <SelectTrigger id="program" className="mt-1 text-foreground"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem className='text-foreground' value="All">All Programs</SelectItem>
                  {uniquePrograms.map((p) => (<SelectItem key={p} value={p}>{p}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={() => setSelectedDay(today)} variant="outline" className="w-full text-foreground">Jump to Today</Button>
            </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden text-foreground">
        <div className="p-4 border-b">
          <div className="w-full overflow-x-auto">
            <div className="inline-flex gap-2 py-1 whitespace-nowrap">
              {daysOfWeek.map((day) => {
                const count = (byDay.get(day) ?? []).length;
                const isActive = selectedDay === day;
                return (
                  <Button
                    key={day}
                    variant={isActive ? "default" : "ghost"}
                    onClick={() => setSelectedDay(day)}
                    className="flex items-center gap-2"
                  >
                    <span>{day}</span>
                    <Badge variant={isActive ? "secondary" : "default"}>{count}</Badge>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6 min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDay}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {classesForSelectedDay.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-48 rounded-lg">
                  <CalendarX2 size={32} className="mb-2" />
                  <p className="font-semibold">No classes scheduled for {selectedDay}.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {classesForSelectedDay.map((item) => (
                    <div key={item.id} className={`flex items-start gap-4 p-4 rounded-md border-l-4 ${colorMap[item.color].border} ${colorMap[item.color].bg}`}>
                        <div className={`mt-1 flex-shrink-0 h-8 w-8 rounded-lg ${colorMap[item.color].bg} border flex items-center justify-center`}>
                           {/* FIX 1: Gi-usab ang kolor sa icon */}
                           <BookOpen size={16} className={`text-foreground ${colorMap[item.color].text}`} />
                        </div>
                        <div className="flex-grow">
                            {/* FIX 2: Gi-usab ang kolor sa subject code/name */}
                            <p className="font-bold text-foreground">{item.code} - {item.name}</p>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                                {/* FIX 3: Gi-usab ang kolor sa schedule details */}
                                <span className="flex items-center gap-1.5 text-foreground"><Clock size={14} />{item.schedule.time}</span>
                                <span className="flex items-center gap-1.5 text-foreground"><Building2 size={14} />{item.room}</span>
                            </div>
                        </div>
                        {/* FIX 4: Gi-usab ang variant sa program badge */}
                        <Badge variant="secondary" className="shrink-0">{item.program}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default ViewSchedule;