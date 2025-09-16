import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarX2, Clock, Building2, BookOpen, ChevronLeft, ChevronRight, CalendarCheck } from 'lucide-react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

// --- TYPE DEFINITIONS & MOCK DATA (same model as current view) ---
interface ScheduledClass {
  id: number
  code: string
  name: string
  room: string
  program: string
  schedule: {
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'
    time: string // "HH:MM - HH:MM"
  }
  colors: {
    border: string
    bg: string
    text: string
    iconBg: string
  }
}

const facultyScheduleData: ScheduledClass[] = [
  // Monday
  { id: 1, code: 'CS101', name: 'Intro to Programming', room: '101', program: 'BSIT', schedule: { day: 'Monday', time: '08:00 - 09:30' }, colors: { border: 'border-sky-500', bg: 'bg-sky-50', text: 'text-sky-800', iconBg: 'bg-sky-100' } },
  { id: 2, code: 'IT210', name: 'Web Development 1', room: 'Lab 2', program: 'BSIT', schedule: { day: 'Monday', time: '10:00 - 11:30' }, colors: { border: 'border-indigo-500', bg: 'bg-indigo-50', text: 'text-indigo-800', iconBg: 'bg-indigo-100' } },
  { id: 3, code: 'CS320', name: 'Software Engineering', room: '303', program: 'BSCS', schedule: { day: 'Monday', time: '13:00 - 14:30' }, colors: { border: 'border-purple-500', bg: 'bg-purple-50', text: 'text-purple-800', iconBg: 'bg-purple-100' } },
  { id: 4, code: 'DS401', name: 'Data Analytics', room: '401', program: 'BSDS', schedule: { day: 'Monday', time: '03:00 - 04:30' }, colors: { border: 'border-fuchsia-500', bg: 'bg-fuchsia-50', text: 'text-fuchsia-800' , iconBg: 'bg-fuchsia-100' } },
  { id: 5, code: 'GN101', name: 'Purposive Communication', room: '201', program: 'General', schedule: { day: 'Monday', time: '05:00 - 06:30' }, colors: { border: 'border-slate-500', bg: 'bg-slate-50', text: 'text-slate-800', iconBg: 'bg-slate-100' } },

  // Tuesday
  { id: 6, code: 'CS102', name: 'Data Structures', room: '102', program: 'BSCS', schedule: { day: 'Tuesday', time: '08:00 - 09:30' }, colors: { border: 'border-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-800', iconBg: 'bg-emerald-100' } },
  { id: 7, code: 'IT220', name: 'Database Management', room: 'Lab 1', program: 'BSIT', schedule: { day: 'Tuesday', time: '10:00 - 11:30' }, colors: { border: 'border-teal-500', bg: 'bg-teal-50', text: 'text-teal-800', iconBg: 'bg-teal-100' } },
  { id: 8, code: 'CS330', name: 'Algorithms & Complexity', room: '304', program: 'BSCS', schedule: { day: 'Tuesday', time: '01:00 - 02:30' }, colors: { border: 'border-cyan-500', bg: 'bg-cyan-50', text: 'text-cyan-800', iconBg: 'bg-cyan-100' } },

  // Wednesday
  { id: 11, code: 'CS205', name: 'Object-Oriented Prog.', room: '202', program: 'BSCS', schedule: { day: 'Wednesday', time: '08:00 - 09:30' }, colors: { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-800', iconBg: 'bg-green-100' } },

  // Saturday
  { id: 12, code: 'PE4', name: 'Physical Education 4', room: 'Gym', program: 'General', schedule: { day: 'Saturday', time: '09:00 - 11:00' }, colors: { border: 'border-orange-500', bg: 'bg-orange-50', text: 'text-orange-800', iconBg: 'bg-orange-100' } },
]

type DayName = ScheduledClass['schedule']['day']
const daysOfWeek: DayName[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const dayColors: { [key: string]: { bg: string; text: string; badgeBg: string; badgeText: string } } = {
  Monday: { bg: 'bg-sky-100', text: 'text-sky-800', badgeBg: 'bg-sky-200', badgeText: 'text-sky-900' },
  Tuesday: { bg: 'bg-emerald-100', text: 'text-emerald-800', badgeBg: 'bg-emerald-200', badgeText: 'text-emerald-900' },
  Wednesday: { bg: 'bg-green-100', text: 'text-green-800', badgeBg: 'bg-green-200', badgeText: 'text-green-900' },
  Thursday: { bg: 'bg-amber-100', text: 'text-amber-800', badgeBg: 'bg-amber-200', badgeText: 'text-amber-900' },
  Friday: { bg: 'bg-indigo-100', text: 'text-indigo-800', badgeBg: 'bg-indigo-200', badgeText: 'text-indigo-900' },
  Saturday: { bg: 'bg-orange-100', text: 'text-orange-800', badgeBg: 'bg-orange-200', badgeText: 'text-orange-900' },
  default: { bg: 'bg-gray-100', text: 'text-gray-800', badgeBg: 'bg-gray-200', badgeText: 'text-gray-900' },
}

const getTodayName = (): DayName | null => {
  const d = new Date().toLocaleDateString('en-US', { weekday: 'long' }) as DayName
  return daysOfWeek.includes(d) ? d : null
}

// Helpers
const parseStartMinutes = (range: string) => {
  const [start] = range.split('-').map((s) => s.trim())
  const [hh, mm] = start.split(':').map(Number)
  return hh * 60 + (mm || 0)
}
const sortByStart = (a: ScheduledClass, b: ScheduledClass) =>
  parseStartMinutes(a.schedule.time) - parseStartMinutes(b.schedule.time)

// Small UI piece
const DetailPill = ({
  icon: Icon,
  text,
  tone,
}: {
  icon: React.ElementType
  text: string
  tone?: { text?: string; iconBg?: string }
}) => (
  <span className="inline-flex items-center gap-2 rounded-full bg-gray-50 border border-gray-200 px-2.5 py-1 text-xs text-gray-700">
    <span className={`h-6 w-6 ${tone?.iconBg ?? 'bg-gray-100'} rounded-md flex items-center justify-center`}>
      <Icon className={`h-3.5 w-3.5 ${tone?.text ?? 'text-gray-700'}`} />
    </span>
    {text}
  </span>
)

const TimelineCard = ({ item }: { item: ScheduledClass }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ type: 'spring', stiffness: 250, damping: 24 }}
    className={`relative rounded-xl border ${item.colors.border} ${item.colors.bg} shadow-sm`}
  >
    <div className={`absolute left-0 top-0 h-full w-1.5 rounded-l-xl ${item.colors.border.replace('border-', 'bg-')}`} />
    <div className="p-4 pl-5">
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center gap-1.5 rounded-full ${item.colors.iconBg} ${item.colors.text} text-[11px] font-semibold px-2.5 py-1`}>
          <span className={`h-1.5 w-1.5 rounded-full ${item.colors.text.replace('text-', 'bg-')}`} />
          {item.code}
        </span>
        <span className="text-xs font-medium text-gray-600">{item.schedule.time}</span>
      </div>
      <h3 className="mt-2 mb-2 font-bold text-base text-gray-900">{item.name}</h3>
      <div className="flex flex-wrap gap-2">
        <DetailPill icon={Building2} text={`Room ${item.room}`} tone={{ text: item.colors.text, iconBg: item.colors.iconBg }} />
        <DetailPill icon={BookOpen} text={item.program} tone={{ text: item.colors.text, iconBg: item.colors.iconBg }} />
      </div>
    </div>
  </motion.div>
)

function ViewScheduleAlt() {
  const today = getTodayName() ?? 'Monday'
  const [selectedDay, setSelectedDay] = useState<DayName>(today)
  const [search, setSearch] = useState<string>('')
  const [program, setProgram] = useState<string>('All')

  const uniquePrograms = useMemo<string[]>(
    () => Array.from(new Set(facultyScheduleData.map((c) => c.program))).sort(),
    []
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let base = facultyScheduleData.slice()
    if (program !== 'All') base = base.filter((c) => c.program === program)
    if (q) {
      base = base.filter((c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q)
      )
    }
    return base
  }, [search, program])

  const byDay = useMemo(() => {
    const map = new Map<DayName, ScheduledClass[]>()
    daysOfWeek.forEach((d) => map.set(d, []))
    for (const item of filtered) {
      map.get(item.schedule.day)!.push(item)
    }
    daysOfWeek.forEach((d) => map.get(d)!.sort(sortByStart))
    return map
  }, [filtered])

  const classesForSelectedDay = byDay.get(selectedDay) ?? []

  const goPrev = () => {
    const idx = daysOfWeek.indexOf(selectedDay)
    const prev = (idx - 1 + daysOfWeek.length) % daysOfWeek.length
    setSelectedDay(daysOfWeek[prev])
  }
  const goNext = () => {
    const idx = daysOfWeek.indexOf(selectedDay)
    const next = (idx + 1) % daysOfWeek.length
    setSelectedDay(daysOfWeek[next])
  }

  const totalVisible = filtered.length

  return (
    <div className="min-h-full">
      {/* Header */}
      <header className="border-b bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/40">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-black/5 flex items-center justify-center ring-1 ring-inset ring-black/5">
                <CalendarCheck className="h-5 w-5 text-gray-700" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">View Class Schedules</h1>
                <p className="text-sm text-gray-600">Use the left day navigator to browse your weekly teaching schedule.</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {totalVisible} visible
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-600">
            <span className="font-semibold text-gray-700">Legend:</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 ring-1 ring-inset ring-gray-200">
              <Clock className="h-3.5 w-3.5 text-gray-600" /> Time
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 ring-1 ring-inset ring-gray-200">
              <Building2 className="h-3.5 w-3.5 text-gray-600" /> Room
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 ring-1 ring-inset ring-gray-200">
              <BookOpen className="h-3.5 w-3.5 text-gray-600" /> Program
            </span>
          </div>
        </div>
      </header>

      {/* Filters */}
      <section className="mx-auto max-w-7xl">
        <div className="mt-4 mb-6 rounded-xl border bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-xs font-medium text-gray-700 mb-1">Search</label>
              <input
                id="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by course code or name..."
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
            <div>
              <label htmlFor="program" className="block text-xs font-medium text-gray-700 mb-1">Program</label>
              <Select
                value={program}
                onValueChange={(value) => setProgram(value)}
              >
                <SelectTrigger className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10">
                  <SelectValue placeholder="All Programs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Programs</SelectItem>
                  {uniquePrograms.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedDay(today)}
                className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
              >
                Jump to Today
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main content: Left day navigator + Right timeline */}
      <main className="mx-auto max-w-7xl pb-10">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {/* Left: Day navigator */}
          <aside className="rounded-2xl border bg-white shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b">
              <h2 className="text-sm font-semibold text-gray-800">This Week</h2>
            </div>
            <ul className="divide-y">
              {daysOfWeek.map((day) => {
                const colors = dayColors[day] || dayColors.default
                const count = (byDay.get(day) ?? []).length
                const isActive = selectedDay === day
                const isToday = today === day
                return (
                  <li key={day}>
                    <button
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={`w-full flex items-center justify-between gap-2 px-4 py-3 text-sm ${
                        isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-50 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-white' : colors.badgeBg.replace('bg-', 'bg-')}`} />
                        <span className="font-medium">{day}</span>
                        {isToday && (
                          <span className={`ml-1 text-[11px] font-semibold rounded-full ${isActive ? 'bg-white/10 text-white' : 'bg-black/5 text-black/80'} px-2 py-0.5`}>
                            Today
                          </span>
                        )}
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white/10 text-white' : `${colors.badgeBg} ${colors.badgeText}`
                      }`}>
                        {count}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </aside>

          {/* Right: Timeline for selected day */}
          <section className="rounded-2xl border bg-white shadow-sm overflow-hidden">
            {/* Section header */}
            <div className="flex items-center justify-between gap-2 px-4 py-3 border-b">
              <div className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-lg ${dayColors[selectedDay]?.bg ?? 'bg-gray-100'} flex items-center justify-center ring-1 ring-inset ring-black/5`}>
                  <Clock className={`${dayColors[selectedDay]?.text ?? 'text-gray-700'} h-4 w-4`} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{selectedDay}</h3>
                  <p className="text-xs text-gray-600">
                    {classesForSelectedDay.length} {classesForSelectedDay.length === 1 ? 'class' : 'classes'} scheduled
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goPrev}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50"
                >
                  <ChevronLeft className="h-4 w-4" /> Prev
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Timeline body */}
            <div className="p-4">
              {classesForSelectedDay.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center text-sm text-gray-400 h-48 bg-gray-50/60 rounded-xl border border-dashed">
                  <CalendarX2 size={32} className="mb-2 text-gray-300" />
                  <p>No classes scheduled.</p>
                </div>
              ) : (
                <div className="relative">
                  {/* vertical line */}
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
                  <div className="space-y-4">
                    <AnimatePresence initial={false}>
                      {classesForSelectedDay.map((item) => (
                        <div key={item.id} className="relative pl-10">
                          {/* dot on the line */}
                          <span className="absolute left-3 top-4 h-2.5 w-2.5 rounded-full bg-gray-400 ring-2 ring-white" />
                          <TimelineCard item={item} />
                        </div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default ViewScheduleAlt