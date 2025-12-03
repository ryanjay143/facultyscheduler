import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Printer, Download, FileText, Calendar, BarChart3, Users, BookOpen, ClipboardList, AlertTriangle } from "lucide-react";
// Tanggalin ang import na ito: import { FacultyLoadingReport } from "./reports/FacultyLoadingReport"; 

// I-import ang mga inilipat na report components mula sa kanilang tamang path
import { FacultyLoadingReport } from "./reports/FacultyLoadingReport"; 
import { FacultySchedulesView } from "./reports/FacultySchedulesView"; // FIXED: I-import ang totoong component
import { FacultyWorkloadsView } from "./reports/FacultyWorkloadsView"; // FIXED: I-import ang totoong component

// --- MOCK DATA ---
export const facultyData = [
  { id: 1, name: "Dr. Evelyn Reed", department: "Computer Science" },
  { id: 2, name: "Dr. Samuel Grant", department: "Data Science" },
  { id: 3, name: "Prof. Alisha Chen", department: "Networking" },
];

export const assignedSubjects = [
  { id: 1, code: "CS101", name: "Introduction to Programming", units: 3, assignedTo: 1, schedule: { day: "Monday", time: "09:00-11:00" } },
  { id: 2, code: "CS205", name: "Data Structures", units: 3, assignedTo: 1, schedule: { day: "Wednesday", time: "10:00-12:00" } },
  { id: 3, code: "DS301", name: "Machine Learning", units: 4, assignedTo: 2, schedule: { day: "Tuesday", time: "13:00-15:00" } },
  { id: 4, code: "DB402", name: "Advanced Databases", units: 4, assignedTo: 2, schedule: { day: "Thursday", time: "09:00-11:00" } },
  { id: 5, code: "NT201", name: "Computer Networks", units: 3, assignedTo: 3, schedule: { day: "Friday", time: "11:00-13:00" } },
];

// FIXED: Ang mga mock components na ito ay hindi na kailangan dahil ini-import na natin ang totoong files.
// Kung sakaling wala pang laman ang FacultyWorkloadsView, gamitin ang placeholder na ito:
// const FacultyWorkloadsView = () => <div className="p-10 text-center text-muted-foreground border rounded-lg">Faculty Workloads View - (Content Placeholder)</div>;


// --- MAIN REPORTS PAGE COMPONENT ---
function ReportsPage() {
  const [activeTab, setActiveTab] = useState<"loading" | "schedules" | "workloads">("loading");

  // KPIs (Pareho pa rin)
  const totalFaculty = facultyData.length;
  const totalSubjects = assignedSubjects.length;
  const totalUnits = assignedSubjects.reduce((sum, s) => sum + s.units, 0);
  const heavyLoadCount = useMemo(() => {
    const map = new Map<number, number>();
    assignedSubjects.forEach((s) => map.set(s.assignedTo, (map.get(s.assignedTo) || 0) + s.units));
    return Array.from(map.values()).filter((u) => u > 6).length;
  }, []);

  const kpiData = [
      { label: "Total Faculty", value: totalFaculty, icon: Users },
      { label: "Assigned Subjects", value: totalSubjects, icon: BookOpen },
      { label: "Total Units Loaded", value: totalUnits, icon: ClipboardList },
      { label: "Faculty w/ Heavy Load", value: heavyLoadCount, icon: AlertTriangle, warning: heavyLoadCount > 0 },
  ];

  return (
    <>
      <header className="mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Generate Reports</h1>
            <p className="text-muted-foreground mt-2">View and export faculty loading, schedules, and workloads.</p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline"><Printer className="h-4 w-4 mr-2" /> Print</Button>
            <Button><Download className="h-4 w-4 mr-2" /> Download All</Button>
        </div>
      </header>
      
      {/* KPI Cards (Pareho pa rin) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiData.map((kpi, i) => (
            <motion.div 
                key={kpi.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-card p-5 rounded-xl border shadow-sm flex items-center gap-5 ${kpi.warning ? 'border-destructive/50 bg-destructive/5' : 'border-border'}`}
            >
                <div className={`p-3 rounded-lg ${kpi.warning ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                    <kpi.icon size={24} />
                </div>
                <div>
                    <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
                    <div className="text-sm text-muted-foreground">{kpi.label}</div>
                </div>
            </motion.div>
        ))}
      </div>

      {/* Tabs (Pareho pa rin) */}
      <div className="border-b border-border mb-6">
        <div className="inline-flex items-center gap-1 bg-muted p-1 rounded-lg">
          <TabButton id="loading" activeTab={activeTab} setActiveTab={setActiveTab} icon={<FileText size={16} />}>Loading</TabButton>
          <TabButton id="schedules" activeTab={activeTab} setActiveTab={setActiveTab} icon={<Calendar size={16} />}>Schedules</TabButton>
          <TabButton id="workloads" activeTab={activeTab} setActiveTab={setActiveTab} icon={<BarChart3 size={16} />}>Workloads</TabButton>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* Ito ang magdi-display ng totoong component */}
          {activeTab === "loading" && <FacultyLoadingReport />} 
          {activeTab === "schedules" && <FacultySchedulesView />} 
          {activeTab === "workloads" && <FacultyWorkloadsView />}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

// --- HELPER COMPONENT PARA SA TABS ---
type TabId = "loading" | "schedules" | "workloads";
const TabButton = ({ id, activeTab, setActiveTab, icon, children }: { id: TabId; activeTab: TabId; setActiveTab: (id: TabId) => void; icon: React.ReactNode; children: React.ReactNode; }) => {
  return (
    <Button
      variant={activeTab === id ? "default" : "ghost"}
      onClick={() => setActiveTab(id)}
      className="flex items-center gap-2 px-4 py-2 h-9 text-sm font-semibold transition-all"
    >
      {icon} {children}
    </Button>
  );
};

export default ReportsPage;

// Tandaan: Para gumana ito, kailangan mong siguraduhin na ang lahat ng tatlong (3) report components ay 
// tama ang import/export at nakalagay sa tamang paths.