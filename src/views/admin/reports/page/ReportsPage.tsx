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
// In a real app, this data would be fetched or generated based on your database.
const facultyData = [
  { id: 1, name: "Dr. Evelyn Reed", department: "Computer Science" },
  { id: 2, name: "Dr. Samuel Grant", department: "Data Science" },
  { id: 3, name: "Prof. Alisha Chen", department: "Networking" },
  { id: 4, name: "Dr. Ben Carter", department: "Web Development" },
]

const assignedSubjects = [
  {
    id: 1,
    code: "CS101",
    name: "Introduction to Programming",
    units: 3,
    assignedTo: 1,
    schedule: { day: "Monday", time: "09:00-11:00" },
  },
  {
    id: 2,
    code: "CS205",
    name: "Data Structures",
    units: 3,
    assignedTo: 1,
    schedule: { day: "Wednesday", time: "10:00-12:00" },
  },
  {
    id: 3,
    code: "DS301",
    name: "Machine Learning",
    units: 4,
    assignedTo: 2,
    schedule: { day: "Tuesday", time: "13:00-15:00" },
  },
  {
    id: 4,
    code: "DB402",
    name: "Advanced Databases",
    units: 4,
    assignedTo: 2,
    schedule: { day: "Thursday", time: "09:00-11:00" },
  },
  {
    id: 5,
    code: "NT201",
    name: "Computer Networks",
    units: 3,
    assignedTo: 3,
    schedule: { day: "Friday", time: "11:00-13:00" },
  },
  {
    id: 6,
    code: "WD303",
    name: "Modern Web Apps",
    units: 3,
    assignedTo: 4,
    schedule: { day: "Monday", time: "14:00-16:00" },
  },
  {
    id: 7,
    code: "AI401",
    name: "Advanced AI",
    units: 4,
    assignedTo: 1,
    schedule: { day: "Monday", time: "11:00-13:00" },
  },
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
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-screen">
      {/* Hero/banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white shadow-lg mb-6"
      >
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold shadow-sm">
                <FileText size={14} />
                Admin • Reports
              </div>
              <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">
                Generate Reports
              </h1>
              <p className="text-white/85">
                View and export faculty loading, schedules, and workloads.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="bg-white/10 text-white hover:bg-white/20">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button className="bg-white text-purple-700 hover:bg-white/90">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <KpiCard label="Faculty" value={totalFaculty} />
            <KpiCard label="Subjects" value={totalSubjects} />
            <KpiCard label="Total Units" value={totalUnits} />
            <KpiCard label="Heavy Loads" value={heavyLoadCount} tone="warning" />
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="inline-flex items-center gap-1 p-1 bg-white rounded-xl shadow-sm border">
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
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full md:w-72">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-9 rounded-md border px-3 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Search subject code or name"
              />
            </div>
            {/* Faculty filter */}
            <Select value={facultyFilter} onValueChange={setFacultyFilter}>
              <SelectTrigger className="w-full md:w-56">
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

      <div className="rounded-md border overflow-hidden">
        <Table>
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
            <SelectTrigger className="w-full sm:w-72">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
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
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-4 border-b">
    <div>
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
    </div>
    {right && <div className="flex gap-2">{right}</div>}
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