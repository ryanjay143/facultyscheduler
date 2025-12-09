import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../../../plugin/axios";
import { Button } from "@/components/ui/button";
import { 
  Printer, Download, FileText, Calendar, BarChart3, 
  Users, BookOpen, ClipboardList, Loader2 
} from "lucide-react";

// Import the actual report components from their respective paths
import { FacultyLoadingReport } from "./reports/FacultyLoadingReport"; 
import { FacultySchedulesView } from "./reports/FacultySchedulesView"; 
import { FacultyWorkloadsView } from "./reports/FacultyWorkloadsView"; 
import { FacultyStudyLoadView } from "./reports/FacultyStudyLoadView"; // NEW IMPORT

// --- KPI DATA STRUCTURE ---
interface KpiData {
    totalFaculty: number;
    assignedSubjects: number;
    totalUnitsLoaded: number;
}

// --- TAB ID TYPE UPDATE ---
type TabId = "loading" | "schedules" | "workloads" | "studyload";

// --- MAIN REPORTS PAGE COMPONENT ---
function ReportsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("loading");
  const [kpiData, setKpiData] = useState<KpiData>({
    totalFaculty: 0,
    assignedSubjects: 0,
    totalUnitsLoaded: 0,
  });
  const [loadingKpis, setLoadingKpis] = useState(true);
  const [kpiError, setKpiError] = useState<string | null>(null);

  // --- API Fetch for KPIs ---
  useEffect(() => {
    const fetchKpis = async () => {
      try {
        setLoadingKpis(true);
        setKpiError(null);
        
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            setKpiError("Authentication token not found. Please log in.");
            setLoadingKpis(false);
            return;
        }

        const config = {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        };

        const response = await axios.get<{ success: boolean; data: KpiData }>(
            'reports/kpis', 
            config
        );
        
        if (response.data.success) {
          setKpiData(response.data.data);
        } else {
            setKpiError("Failed to load KPI data from the server.");
        }
      } catch (error) {
        console.error("Error fetching KPI data:", error);
        setKpiError("Could not connect to the API or fetch KPI data.");
      } finally {
        setLoadingKpis(false);
      }
    };

    fetchKpis();
  }, []);

  // Map the fetched data to the format used for rendering
  const displayedKpiData = [
      { label: "Total Faculty", value: kpiData.totalFaculty, icon: Users },
      { label: "Assigned Subjects", value: kpiData.assignedSubjects, icon: BookOpen },
      { label: "Total Units Loaded", value: kpiData.totalUnitsLoaded, icon: ClipboardList },
  ];

  // --- Render logic for loading and error states for KPIs ---

  const renderKpiCards = () => {
    if (loadingKpis) {
      return (
        <div className="flex justify-center items-center h-20 border rounded-xl bg-card">
          <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
          <span className="text-muted-foreground">Loading Metrics...</span>
        </div>
      );
    }

    if (kpiError) {
      return (
        <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-xl">
          <p className="font-semibold">KPI Load Error</p>
          <p className="text-sm">{kpiError}</p>
        </div>
      );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedKpiData.map((kpi, i) => (
                <motion.div 
                    key={kpi.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card p-5 rounded-xl border shadow-sm flex items-center gap-5 border-border"
                >
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        <kpi.icon size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
                        <div className="text-sm text-muted-foreground">{kpi.label}</div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
  };


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
      
      {/* KPI Cards */}
      <div className="mb-8">
        {renderKpiCards()}
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <div className="inline-flex items-center gap-1 bg-muted p-1 rounded-lg">
          <TabButton id="loading" activeTab={activeTab} setActiveTab={setActiveTab} icon={<FileText size={16} />}>Loading</TabButton>
          <TabButton id="schedules" activeTab={activeTab} setActiveTab={setActiveTab} icon={<Calendar size={16} />}>Schedules</TabButton>
          <TabButton id="workloads" activeTab={activeTab} setActiveTab={setActiveTab} icon={<BarChart3 size={16} />}>Workloads</TabButton>
          <TabButton id="studyload" activeTab={activeTab} setActiveTab={setActiveTab} icon={<BookOpen size={16} />}>Study Load</TabButton>
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
          {activeTab === "loading" && <FacultyLoadingReport />} 
          {activeTab === "schedules" && <FacultySchedulesView />} 
          {activeTab === "workloads" && <FacultyWorkloadsView />}
          {activeTab === "studyload" && <FacultyStudyLoadView />}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

// --- HELPER COMPONENT FOR TABS ---
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