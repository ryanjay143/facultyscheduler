import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { BookOpen, Briefcase, ChevronRight, Info, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import type { FacultyType, Subject } from '../mock/types'

interface FacultyLoadingProps {
  faculty: FacultyType[]
  subjects: Subject[]
  onAssign: (payload: { subjectId: number; facultyName: string; day: string; startTime: string; endTime: string }) => void
  onUnassign: (subjectId: number) => void
}

/**
 * Standardized common time slots per day (same for all subjects).
 * These are the only slots presented in the dialog.
 *
 * NOTE: A slot is considered available on a day if it's fully contained within any faculty availability range
 * for that day (not only on exact string match).
 */
const COMMON_DAY_SLOTS: Record<string, string[]> = {
  Monday: ['08:00-09:30', '09:30-11:00', '11:00-12:30', '13:00-14:30', '14:30-16:00'],
  Tuesday: ['08:00-09:30', '09:30-11:00', '11:00-12:30', '13:00-14:30', '14:30-16:00'],
  Wednesday: ['08:00-09:30', '09:30-11:00', '11:00-12:30', '13:00-14:30', '14:30-16:00'],
  Thursday: ['08:00-09:30', '09:30-11:00', '11:00-12:30', '13:00-14:30', '14:30-16:00'],
  Friday: ['08:00-09:30', '09:30-11:00', '11:00-12:30', '13:00-14:30', '14:30-16:00'],
  Saturday: ['08:00-09:30', '09:30-11:00', '11:00-12:30'],
}

const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/**
 * Time formatting helpers (display only).
 * Keeps internal logic in 24-hour HH:MM, but renders as 12-hour (e.g., 13:00 -> 01:00pm).
 */
const to12h = (time24: string) => {
  if (!time24 || !time24.includes(':')) return time24
  const [hStr, m] = time24.split(':')
  let h = Number(hStr)
  const suffix = h < 12 ? 'am' : 'pm'
  if (h === 0) h = 12
  if (h > 12) h -= 12
  const hh = String(h).padStart(2, '0')
  return `${hh}:${m}${suffix}`
}
const formatRange12h = (start: string, end: string) => `${to12h(start)}-${to12h(end)}`
const formatAssigned12h = (assigned: string) => {
  // Supports multi-entry: "Day HH:MM-HH:MM; Day HH:MM-HH:MM"
  if (!assigned) return ''
  const parts = assigned.split(';').map(p => p.trim()).filter(Boolean)
  const converted = parts.map((p) => {
    const [day, range] = p.split(' ')
    if (!range || !range.includes('-')) return p
    const [s, e] = range.split('-')
    return `${day} ${formatRange12h(s, e)}`
  })
  return converted.join('; ')
}

/**
 * Parsing/compare helpers for HH:MM 24h strings.
 */
const toMinutes = (hhmm: string) => {
  const [hh, mm] = hhmm.split(':').map(Number)
  return hh * 60 + mm
}
const parseRange = (range: string) => {
  const [s, e] = range.split('-')
  return { s, e, sm: toMinutes(s), em: toMinutes(e) }
}
/**
 * Returns true if slotRange is fully contained within facRange.
 * Example: facRange 09:00-11:00 contains slot 09:30-11:00 (true).
 */
const containsRange = (facRange: string, slotRange: string) => {
  const f = parseRange(facRange)
  const r = parseRange(slotRange)
  return f.sm <= r.sm && r.em <= f.em
}

/**
 * Safely parse possibly multi-entry assigned time string.
 */
const iterAssignedParts = (assignedTime: string): { day: string; start: string; end: string }[] => {
  if (!assignedTime) return []
  const parts = assignedTime.split(';').map(p => p.trim()).filter(Boolean)
  const out: { day: string; start: string; end: string }[] = []
  for (const part of parts) {
    const [day, range] = part.split(' ')
    if (!day || !range || !range.includes('-')) continue
    const [start, end] = range.split('-')
    out.push({ day, start, end })
  }
  return out
}

function FacultyLoading({
  faculty,
  subjects,
  onAssign,
  onUnassign,
}: FacultyLoadingProps) {
  // Subject list state
  const [subjectQuery, setSubjectQuery] = useState('')
  const [subjectFilter, setSubjectFilter] = useState<'ALL' | 'UNASSIGNED' | 'ASSIGNED'>('ALL')

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [activeSubjectId, setActiveSubjectId] = useState<number | null>(null)

  // In-dialog selections
  const [facultyQuery, setFacultyQuery] = useState('')
  const [selectedFacultyName, setSelectedFacultyName] = useState<string>('')

  // Multi-day selection
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [selectedSlotRange, setSelectedSlotRange] = useState<string | null>(null) // "HH:MM-HH:MM"

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        type: 'spring',
        stiffness: 120,
        damping: 14,
      },
    }),
  }

  const filteredSubjects = useMemo(() => {
    let list = subjects
    if (subjectFilter === 'UNASSIGNED') list = list.filter((s) => !s.assigned)
    if (subjectFilter === 'ASSIGNED') list = list.filter((s) => !!s.assigned)
    if (subjectQuery.trim()) {
      const q = subjectQuery.toLowerCase()
      list = list.filter(
        (s) =>
          s.code.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q) ||
          s.expertise.toLowerCase().includes(q),
      )
    }
    return list
  }, [subjects, subjectFilter, subjectQuery])

  const activeSubject = useMemo(
    () => subjects.find((s) => s.id === activeSubjectId) || null,
    [activeSubjectId, subjects]
  )

  // Faculty helpers
  const eligibleFaculty = useMemo(() => {
    if (!activeSubject) return []
    return faculty.filter((f) => f.expertise.includes(activeSubject.expertise))
  }, [faculty, activeSubject])

  const filteredEligibleFaculty = useMemo(() => {
    if (!facultyQuery.trim()) return eligibleFaculty
    const q = facultyQuery.toLowerCase()
    return eligibleFaculty.filter(f => f.name.toLowerCase().includes(q))
  }, [eligibleFaculty, facultyQuery])

  const loadOf = (f: FacultyType) =>
    subjects.filter((s) => s.assigned?.faculty === f.name).length

  // Conflict: now supports multi-entry assigned time strings
  const isSlotConflicting = (facultyName: string, day: string, start: string, end: string) => {
    const assignedForFaculty = subjects.filter((s) => s.assigned?.faculty === facultyName)
    for (const s of assignedForFaculty) {
      if (!s.assigned) continue
      const parts = iterAssignedParts(s.assigned.time)
      for (const part of parts) {
        if (part.day !== day) continue
        const aStart = part.start
        const aEnd = part.end
        // Overlap: start < aEnd && aStart < end (lexicographic works with HH:MM 24h)
        if (start < aEnd && aStart < end) return true
      }
    }
    return false
  }

  // When dialog opens for a subject, preselect first eligible faculty and initial day set
  useEffect(() => {
    if (!dialogOpen || !activeSubject) return
    const firstFaculty = eligibleFaculty[0]?.name ?? ''
    setSelectedFacultyName(firstFaculty)
    // Default selected days: empty until user chooses; or smart-pick based on availability
    setSelectedDays([])
    setSelectedSlotRange(null)
    setFacultyQuery('')
  }, [dialogOpen, activeSubject, eligibleFaculty])

  const openAssignDialog = (subjectId: number) => {
    setActiveSubjectId(subjectId)
    setDialogOpen(true)
  }

  const closeAssignDialog = () => {
    setDialogOpen(false)
    setActiveSubjectId(null)
    setSelectedFacultyName('')
    setFacultyQuery('')
    setSelectedDays([])
    setSelectedSlotRange(null)
  }

  // Build slots viability across selected days for the selected faculty
  const selectedFaculty = useMemo(
    () => faculty.find((f) => f.name === selectedFacultyName) || null,
    [faculty, selectedFacultyName]
  )

  const selectedFacultyLoad = selectedFaculty ? loadOf(selectedFaculty) : 0
  const selectedFacultyIsMaxed = selectedFaculty ? selectedFacultyLoad >= selectedFaculty.maxSubjects : false

  const dayAllowsSlot = (day: string, range: string) => {
    if (!selectedFaculty) return false
    const facultyRanges = selectedFaculty.availability?.[day] || []
    return facultyRanges.some((fr:any) => containsRange(fr, range))
  }

  const slotStats = (range: string) => {
    const { s: start, e: end } = parseRange(range)
    const perDay = selectedDays.map(day => {
      const allowedByFaculty = dayAllowsSlot(day, range)
      const conflict = allowedByFaculty ? isSlotConflicting(selectedFaculty!.name, day, start, end) : false
      return { day, allowedByFaculty, conflict, assignable: allowedByFaculty && !conflict }
    })
    const assignableDays = perDay.filter(d => d.assignable).map(d => d.day)
    return { perDay, assignableDays, countAssignable: assignableDays.length }
  }

  const availableCountForDay = (day: string) => {
    if (!selectedFaculty || selectedFacultyIsMaxed) return 0
    const commonRanges = COMMON_DAY_SLOTS[day] || []
    let c = 0
    for (const range of commonRanges) {
      if (dayAllowsSlot(day, range)) {
        const { s, e } = parseRange(range)
        if (!isSlotConflicting(selectedFaculty.name, day, s, e)) {
          c++
        }
      }
    }
    return c
  }

  // Quick day set helpers
  const toggleDay = (day: string) =>
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  const setMWF = () => setSelectedDays(['Monday', 'Wednesday', 'Friday'])
  const setTTh = () => setSelectedDays(['Tuesday', 'Thursday'])
  const setSat = () => setSelectedDays(['Saturday'])
  const clearDays = () => setSelectedDays([])

  const handleAssignSelected = () => {
    if (!activeSubject || !selectedFaculty || !selectedSlotRange || selectedFacultyIsMaxed) return
    const { s: start, e: end } = parseRange(selectedSlotRange)

    // Determine days that can actually be assigned given availability and conflicts.
    const { assignableDays } = slotStats(selectedSlotRange)
    if (assignableDays.length === 0) return

    // Respect maxSubjects by stopping when reached.
    let remainingCapacity = Math.max(0, selectedFaculty.maxSubjects - selectedFacultyLoad)
    for (const day of assignableDays) {
      if (remainingCapacity <= 0) break
      onAssign({
        subjectId: activeSubject.id,
        facultyName: selectedFaculty.name,
        day,
        startTime: start,
        endTime: end,
      })
      remainingCapacity -= 1
    }

    closeAssignDialog()
  }

  return (
    <>
      {/* Subjects list */}
      <div className="grid grid-cols-1 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
        >
          <div className="mb-4 space-y-3">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-800">
              <BookOpen className="text-purple-500" /> Subjects
            </h2>

            <Input
              placeholder="Search subject code, name, or expertise..."
              value={subjectQuery}
              onChange={(e) => setSubjectQuery(e.target.value)}
            />

            <div className="flex flex-wrap gap-2">
              {(['ALL', 'UNASSIGNED', 'ASSIGNED'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setSubjectFilter(f)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition ${
                    subjectFilter === f
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {f === 'ALL' ? 'All' : f === 'UNASSIGNED' ? 'Unassigned' : 'Assigned'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 -mr-2">
            {filteredSubjects.map((s, i) => {
              const isAssigned = !!s.assigned
              return (
                <motion.div
                  key={s.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  custom={i}
                  className="p-4 rounded-lg transition-all duration-300 border bg-white hover:border-indigo-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800">
                        {s.code} - {s.name}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                        <Briefcase size={14} className="text-purple-400" /> Required:{' '}
                        <span className="font-medium text-purple-800">{s.expertise}</span>
                      </p>
                      {isAssigned ? (
                        <p className="text-xs text-emerald-700 mt-1">
                          Assigned to {s.assigned?.faculty} · {s.assigned?.time ? formatAssigned12h(s.assigned.time) : ''}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500 mt-1">Unassigned</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {isAssigned && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUnassign(s.id)}
                          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <XCircle size={16} className="mr-2" />
                          Unassign
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => openAssignDialog(s.id)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        {isAssigned ? 'Reassign' : 'Assign'}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
            {!filteredSubjects.length && (
              <div className="flex flex-col items-center justify-center h-40 text-center text-gray-500 rounded-lg border border-dashed">
                <Info size={36} className="text-gray-300 mb-2" />
                <p>No subjects found with the current filters.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Assignment Dialog - Multi-day + one common slot */}
      <Dialog open={dialogOpen} onOpenChange={(open) => (open ? setDialogOpen(true) : closeAssignDialog())}>
        <DialogContent className="md:w-[90%] max-h-[700px] overflow-y-auto">
          {!activeSubject ? null : (
            <>
              <DialogHeader>
                <DialogTitle>Assign Subject</DialogTitle>
                <DialogDescription>
                  Select a faculty, choose multiple days (MWF / TTh / Sat), then pick one common time slot. We’ll assign for each valid day.
                </DialogDescription>
              </DialogHeader>

              {/* Subject summary */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="font-semibold text-gray-800">{activeSubject.code} — {activeSubject.name}</p>
                <p className="text-sm text-gray-600">
                  Required Expertise: <span className="font-medium text-purple-800">{activeSubject.expertise}</span>
                </p>
                {activeSubject.assigned && (
                  <p className="text-xs text-emerald-700 mt-1">
                    Currently assigned to {activeSubject.assigned.faculty} · {formatAssigned12h(activeSubject.assigned.time)}
                  </p>
                )}
              </div>

              {/* Two pane grid */}
              <div className="grid grid-cols-1 gap-4">
                {/* Left: Faculty list */}
                <div className=" border rounded-lg p-3">
                  <div className="mb-2">
                    <Input
                      placeholder="Search faculty..."
                      value={facultyQuery}
                      onChange={(e) => setFacultyQuery(e.target.value)}
                    />
                  </div>

                  {!eligibleFaculty.length ? (
                    <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-3">
                      No faculty match this subject's expertise.
                    </div>
                  ) : (
                    <div className="max-h-80 overflow-y-auto pr-1 -mr-1 space-y-2">
                      {filteredEligibleFaculty.map((f) => {
                        const currentLoad = loadOf(f)
                        const isMaxed = currentLoad >= f.maxSubjects
                        const pct = Math.min(100, Math.round((currentLoad / Math.max(1, f.maxSubjects)) * 100))
                        const selected = selectedFacultyName === f.name

                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => {
                              setSelectedFacultyName(f.name)
                              // reset previous selection state when switching faculty
                              setSelectedDays([])
                              setSelectedSlotRange(null)
                            }}
                            className={`w-full text-left p-3 rounded-md border transition ${
                              selected ? 'border-indigo-500 ring-2 ring-indigo-100 bg-indigo-50/40' : 'border-gray-200 hover:border-indigo-300 bg-white'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-semibold text-gray-800">{f.name}</p>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  {f.expertise.map((e:any) => (
                                    <span key={e} className="text-[10px] font-medium text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-full">
                                      {e}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-gray-600">Load: {currentLoad}/{f.maxSubjects}</div>
                                <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden mt-1 ml-auto">
                                  <div className={`h-full rounded-full ${isMaxed ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${pct}%` }} />
                                </div>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                      {!filteredEligibleFaculty.length && (
                        <div className="text-sm text-gray-500 p-2">No faculty match your search.</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right: Multi-day chips + common slots */}
                <div className="md:col-span-7 border rounded-lg p-3">
                  {!selectedFacultyName ? (
                    <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                      Select a faculty to choose days and a time slot.
                    </div>
                  ) : selectedFacultyIsMaxed ? (
                    <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3">
                      This faculty has reached the maximum teaching load.
                    </div>
                  ) : (
                    <>
                      {/* Day chips */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {DAYS_ORDER.map((day) => {
                          const isActive = selectedDays.includes(day)
                          const cnt = availableCountForDay(day)
                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => toggleDay(day)}
                              className={[
                                'inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm ring-1 ring-inset transition',
                                isActive
                                  ? 'bg-gray-900 text-white ring-black/10'
                                  : 'bg-white text-gray-800 ring-gray-200 hover:bg-gray-50'
                              ].join(' ')}
                            >
                              <span className="font-medium">{day}</span>
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                isActive ? 'bg-white/10 text-white' : (cnt > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500')
                              }`}>
                                {cnt}
                              </span>
                            </button>
                          )
                        })}
                        <span className="mx-1 h-5 w-px bg-gray-200" />
                        <Button variant="outline" size="sm" onClick={setMWF}>MWF</Button>
                        <Button variant="outline" size="sm" onClick={setTTh}>TTh</Button>
                        <Button variant="outline" size="sm" onClick={setSat}>Sat</Button>
                        <Button variant="ghost" size="sm" onClick={clearDays}>Clear</Button>
                      </div>

                      {/* Common time slots (select one range) */}
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700 mb-2">Pick a time slot (applies to all selected days)</p>
                        <div className="flex flex-wrap gap-2">
                          {/* Merge unique ranges across all days to show a single set of common slots or show union? 
                              Here we show standard slots from Monday as template to keep consistent options. */}
                          {Array.from(
                            new Set(
                              DAYS_ORDER.flatMap(d => COMMON_DAY_SLOTS[d] || [])
                            )
                          )
                          .sort((a, b) => parseRange(a).sm - parseRange(b).sm)
                          .map((range) => {
                            const stats = slotStats(range)
                            const selectableCount = stats.countAssignable
                            const isSelected = selectedSlotRange === range
                            const disabled = selectedDays.length === 0 || selectableCount === 0 || selectedFacultyIsMaxed
                            return (
                              <button
                                key={range}
                                type="button"
                                disabled={disabled}
                                onClick={() => setSelectedSlotRange(range)}
                                title={
                                  selectedDays.length === 0
                                    ? 'Select days first'
                                    : selectableCount === 0
                                      ? 'Not available for the selected days'
                                      : `Available for ${selectableCount} day(s)`
                                }
                                className={[
                                  'inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition',
                                  disabled
                                    ? 'cursor-not-allowed opacity-60 border-gray-200 bg-white text-gray-500'
                                    : (isSelected
                                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                        : 'border-gray-200 bg-white hover:border-indigo-300'),
                                ].join(' ')}
                              >
                                <span className="font-medium">{formatRange12h(parseRange(range).s, parseRange(range).e)}</span>
                                <span className={`text-[11px] font-semibold rounded-full px-1.5 py-0.5 ${
                                  selectableCount > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                                }`}>
                                  {selectableCount}/{selectedDays.length || 0}
                                </span>
                              </button>
                            )
                          })}
                        </div>

                        {/* Assign action */}
                        <div className="mt-4 flex justify-end">
                          <Button
                            onClick={handleAssignSelected}
                            disabled={
                              !selectedFacultyName ||
                              selectedFacultyIsMaxed ||
                              selectedDays.length === 0 ||
                              !selectedSlotRange ||
                              slotStats(selectedSlotRange).countAssignable === 0
                            }
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                          >
                            Assign to selected days
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <DialogFooter className="flex flex-row items-end gap-2">
                <DialogClose asChild>
                  <Button className="bg-red-500 hover:bg-red-600">Close</Button>
                </DialogClose>
                {activeSubject?.assigned && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      onUnassign(activeSubject.id)
                      // Keep dialog open so user can reassign if they want.
                    }}
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  >
                    <XCircle size={16} className="mr-2" />
                    Unassign
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default FacultyLoading