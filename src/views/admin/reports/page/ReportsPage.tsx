import React, { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Printer, Download, BarChart3, Calendar, FileText, User } from "lucide-react"

// --- MOCK DATA SIMULATING POST-ASSIGNMENT STATE ---
const facultyData = [
  { id: 1, name: "Dr. Evelyn Reed", department: "Computer Science" },
  { id: 2, name: "Dr. Samuel Grant", department: "Data Science" },
  { id: 3, name: "Prof. Alisha Chen", department: "Networking" },
  { id: 4, name: "Dr. Ben Carter", department: "Web Development" },
]

const assignedSubjects = [
  { id: 1, code: "CS101", name: "Introduction to Programming", units: 3, assignedTo: 1, schedule: { day: "Monday", time: "09:00-11:00" } },
  { id: 2, code: "CS205", name: "Data Structures", units: 3, assignedTo: 1, schedule: { day: "Wednesday", time: "10:00-12:00" } },
  { id: 3, code: "DS301", name: "Machine Learning", units: 4, assignedTo: 2, schedule: { day: "Tuesday", time: "13:00-15:00" } },
  { id: 4, code: "DB402", name: "Advanced Databases", units: 4, assignedTo: 2, schedule: { day: "Thursday", time: "09:00-11:00" } },
  { id: 5, code: "NT201", name: "Computer Networks", units: 3, assignedTo: 3, schedule: { day: "Friday", time: "11:00-13:00" } },
  { id: 6, code: "WD303", name: "Modern Web Apps", units: 3, assignedTo: 4, schedule: { day: "Monday", time: "14:00-16:00" } },
  { id: 7, code: "AI401", name: "Advanced AI", units: 4, assignedTo: 1, schedule: { day: "Monday", time: "11:00-13:00" } },
]

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

// --- MAIN REPORTS PAGE COMPONENT ---
function ReportsPage() {
  const [activeTab, setActiveTab] = useState<"loading" | "schedules" | "workloads">("loading")

  const tabContentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  // KPIs
  const totalFaculty = facultyData.length
  const totalSubjects = assignedSubjects.length
  const totalUnits = assignedSubjects.reduce((sum, s) => sum + s.units, 0)
  const heavyLoadCount = useMemo(() => {
    const map = new Map<number, number>()
    assignedSubjects.forEach((s) => map.set(s.assignedTo, (map.get(s.assignedTo) || 0) + s.units))
    return Array.from(map.values()).filter((u) => u > 15).length
  }, [])

  return (
    // Remove min-h-screen, center content, and allow this section to shrink within the parent scroller.
    <div className="min-h-0 mx-auto max-w-7xl p-4 md:p-2 bg-gray-50/50">
      {/* Hero/banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white shadow-lg mb-6"
      >
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative p-6">
          <div className="flex items-start justify-between md:flex-col md:items-start gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold shadow-sm">
                <FileText size={14} />
                Admin • Reports
              </div>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
                Generate Reports
              </h1>
              <p className="text-white/85">
                View and export faculty loading, schedules, and workloads.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 w-auto md:w-full">
              <Button variant="outline" className="bg-white/10 text-white hover:bg-white/20 w-auto md:w-full">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button className="bg-white text-purple-700 hover:bg-white/90 w-auto md:w-full">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          {/* KPI strip - auto-fit makes it responsive without breakpoints */}
          <div className="grid [grid-template-columns:repeat(auto-fit,minmax(140px,1fr))] gap-3 mt-6">
            <KpiCard label="Faculty" value={totalFaculty} />
            <KpiCard label="Subjects" value={totalSubjects} />
            <KpiCard label="Total Units" value={totalUnits} />
            <KpiCard label="Heavy Loads" value={heavyLoadCount} tone="warning" />
          </div>
        </div>
      </motion.div>

      {/* Tabs - scrollable on phones */}
      <div className="overflow-x-auto -mx-2 px-2 mb-6">
        <div className="inline-flex items-center gap-1 p-1 bg-white rounded-xl shadow-sm border shrink-0">
          <TabButton
            id="loading"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            icon={<FileText className="h-4 w-4" />}
          >
            Loading
          </TabButton>
          <TabButton
            id="schedules"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            icon={<Calendar className="h-4 w-4" />}
          >
            Schedules
          </TabButton>
          <TabButton
            id="workloads"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            icon={<BarChart3 className="h-4 w-4" />}
          >
            Workloads
          </TabButton>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={tabContentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2 }}
        >
          {activeTab === "loading" && <FacultyLoadingReport />}
          {activeTab === "schedules" && <FacultySchedulesView />}
          {activeTab === "workloads" && <FacultyWorkloadsView />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default ReportsPage

// --- INDIVIDUAL REPORT COMPONENTS ---

const FacultyLoadingReport = () => {
  const [facultyFilter, setFacultyFilter] = useState<string>("all")
  const [query, setQuery] = useState<string>("")

  const filtered = useMemo(() => {
    return assignedSubjects.filter((s) => {
      const inFaculty =
        facultyFilter === "all" || s.assignedTo.toString() === facultyFilter
      const q = query.trim().toLowerCase()
      const inQuery =
        q.length === 0 ||
        s.code.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q)
      return inFaculty && inQuery
    })
  }, [facultyFilter, query])

  const totalUnits = filtered.reduce((sum, s) => sum + s.units, 0)

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <SectionHeader
        title="Faculty Loading Master Report"
        subtitle="Filter and review all assigned subjects"
        right={
          <div className="flex items-stretch gap-2 w-auto md:w-full md:flex-col">
            {/* Search */}
            <div className="relative w-72 md:w-full">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-9 rounded-md border px-3 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Search subject code or name"
              />
            </div>
            {/* Faculty filter */}
            <Select value={facultyFilter} onValueChange={setFacultyFilter}>
              <SelectTrigger className="w-56 md:w-full">
                <User className="h-4 w-4 mr-2 text-gray-500" />
                <SelectValue placeholder="Filter by faculty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Faculty</SelectItem>
                {facultyData.map((f) => (
                  <SelectItem key={f.id} value={f.id.toString()}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />

      {/* Mobile: Card list (shown only on phones via max-width md) */}
      <div className="hidden md:block">
        <ul className="space-y-3">
          {filtered.map((subject) => {
            const faculty = facultyData.find((f) => f.id === subject.assignedTo)
            return (
              <li key={subject.id} className="border rounded-xl p-3 bg-white shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center justify-center h-6 px-2 rounded-md bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-100">
                        {subject.code}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {subject.units} unit{subject.units > 1 ? "s" : ""}
                      </span>
                    </div>
                    <p className="mt-1 font-semibold text-gray-800 break-words">
                      {subject.name}
                    </p>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-gray-500" />
                    <span className="truncate">
                      {faculty?.name || "Unassigned"}
                    </span>
                  </div>
                  <div className="text-right">
                    {subject.schedule.day}, {subject.schedule.time}
                  </div>
                </div>
              </li>
            )
          })}

          {/* Mobile total */}
          <li className="border rounded-xl p-3 bg-gray-50">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-gray-700">Total Units</span>
              <span className="font-bold text-purple-700">{totalUnits}</span>
            </div>
          </li>
        </ul>
      </div>

      {/* Desktop: Table (hidden on phones via max-width md) */}
      <div className="rounded-md border overflow-hidden block md:hidden mt-2">
        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow>
              <TableHead>Subject Code</TableHead>
              <TableHead>Subject Name</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead className="text-center">Units</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((subject, idx) => {
              const faculty = facultyData.find((f) => f.id === subject.assignedTo)
              return (
                <TableRow key={subject.id} className={idx % 2 ? "bg-gray-50/40" : ""}>
                  <TableCell className="font-semibold text-gray-800">
                    {subject.code}
                  </TableCell>
                  <TableCell className="text-gray-700">{subject.name}</TableCell>
                  <TableCell className="text-gray-700">
                    {faculty?.name || "Unassigned"}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {`${subject.schedule.day}, ${subject.schedule.time}`}
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {subject.units}
                  </TableCell>
                </TableRow>
              )
            })}
            <TableRow>
              <TableCell colSpan={4} className="text-right font-semibold">
                Total Units
              </TableCell>
              <TableCell className="text-center font-bold">{totalUnits}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

const FacultySchedulesView = () => {
  const [selectedFacultyId, setSelectedFacultyId] = useState(
    facultyData[0]?.id.toString() || "",
  )

  const facultySchedule = useMemo(() => {
    return assignedSubjects.filter((s) => s.assignedTo.toString() === selectedFacultyId)
  }, [selectedFacultyId])

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <SectionHeader
        title="Faculty Schedules"
        subtitle="Per-day timeline for selected faculty"
        right={
          <Select value={selectedFacultyId} onValueChange={setSelectedFacultyId}>
            <SelectTrigger className="w-72 md:w-full">
              <User className="h-4 w-4 mr-2 text-gray-500" />
              <SelectValue placeholder="Select a faculty member..." />
            </SelectTrigger>
            <SelectContent>
              {facultyData.map((f) => (
                <SelectItem key={f.id} value={f.id.toString()}>
                  {f.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {/* Auto-fit columns: 1 on phones, up to 5 as space allows */}
      <div className="grid [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))] gap-4 mt-6">
        {daysOfWeek.map((day) => {
          const items = facultySchedule.filter((s) => s.schedule.day === day)
          return (
            <div
              key={day}
              className="rounded-xl border bg-gray-50/50 overflow-hidden shadow-sm"
            >
              <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-center font-bold py-2">
                {day}
              </div>
              <div className="p-3 space-y-3 min-h-[120px]">
                {items.length === 0 && (
                  <div className="text-center text-gray-500 text-sm py-6">No classes</div>
                )}
                {items.map((s) => (
                  <div
                    key={s.id}
                    className="bg-white border border-purple-100 text-purple-800 p-3 rounded-lg shadow-sm text-sm"
                  >
                    <p className="font-bold">{s.code}</p>
                    <p className="text-xs text-gray-700">{s.name}</p>
                    <p className="font-mono text-xs mt-1 text-purple-700">{s.schedule.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const FacultyWorkloadsView = () => {
  const workloads = useMemo(() => {
    const loads = new Map<number, number>()
    assignedSubjects.forEach((subject) => {
      loads.set(subject.assignedTo, (loads.get(subject.assignedTo) || 0) + subject.units)
    })
    return facultyData.map((f) => ({ ...f, totalUnits: loads.get(f.id) || 0 }))
  }, [])

  const MAX_UNITS = 18 // Standard maximum load for visualization

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <SectionHeader
        title="Faculty Workload Overview"
        subtitle="Visualize current unit loads vs. standard cap"
      />
      <div className="space-y-6 mt-6">
        {workloads.map((faculty) => {
          const loadPercentage = Math.min(100, (faculty.totalUnits / MAX_UNITS) * 100)
          const barColor =
            faculty.totalUnits > 15
              ? "bg-red-500"
              : faculty.totalUnits >= 12
              ? "bg-amber-500"
              : "bg-purple-500"
          return (
            <div key={faculty.id} className="bg-gray-50/60 rounded-xl p-4 border">
              <div className="flex justify-between items-center mb-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="font-semibold text-gray-800">{faculty.name}</span>
                  <span className="text-gray-500 text-xs">• {faculty.department}</span>
                </div>
                <span className="font-mono font-bold text-purple-700">
                  {faculty.totalUnits} Units
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`rounded-full h-3 transition-all duration-500 ${barColor}`}
                  style={{ width: `${loadPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>{MAX_UNITS} max</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// --- HELPER & UI COMPONENTS ---
type TabId = "loading" | "schedules" | "workloads"
const TabButton = ({
  id,
  activeTab,
  setActiveTab,
  icon,
  children,
}: {
  id: TabId
  activeTab: TabId
  setActiveTab: (id: TabId) => void
  icon: React.ReactNode
  children: React.ReactNode
}) => {
  const isActive = activeTab === id
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
        isActive
          ? "bg-purple-600 text-white shadow"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      }`}
    >
      {icon}
      {children}
    </button>
  )
}

const SectionHeader = ({
  title,
  subtitle,
  right,
}: {
  title: string
  subtitle?: string
  right?: React.ReactNode
}) => (
  <div className="flex items-start justify-between md:flex-col md:items-start gap-3 pb-4 border-b">
    <div>
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
    </div>
    {right && <div className="flex gap-2 w-auto md:w-full">{right}</div>}
  </div>
)

const KpiCard = ({
  label,
  value,
  tone = "default",
}: {
  label: string
  value: number | string
  tone?: "default" | "warning"
}) => {
  const toneClasses =
    tone === "warning"
      ? "bg-amber-400/20 text-white"
      : "bg-white/15 text-white"
  return (
    <div className={`rounded-xl ${toneClasses} p-4 border border-white/20 backdrop-blur-sm`}>
      <div className="text-xs opacity-90">{label}</div>
      <div className="text-2xl font-extrabold leading-tight">{value}</div>
    </div>
  )
}