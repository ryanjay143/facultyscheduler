import  { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { User, BarChartHorizontal } from "lucide-react";
import { facultyData, assignedSubjects } from "../ReportsPage";

export function FacultyWorkloadsView() {
  const workloads = useMemo(() => {
    const loads = new Map<number, number>();
    assignedSubjects.forEach((subject) => {
      loads.set(subject.assignedTo, (loads.get(subject.assignedTo) || 0) + subject.units);
    });
    return facultyData.map((f) => ({ ...f, totalUnits: loads.get(f.id) || 0 }));
  }, []);

  const MAX_UNITS = 18; // Standard maximum load for visualization

  return (
    <div className="bg-card p-4 md:p-6 rounded-lg shadow-sm border border-border">
       <div className="pb-4 border-b mb-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
                <BarChartHorizontal className="text-primary"/>
                Faculty Workload Overview
            </h2>
            <p className="text-muted-foreground text-sm mt-1">Visualize current unit loads vs. a standard cap of {MAX_UNITS} units.</p>
       </div>

      <div className="space-y-6">
        {workloads.map((faculty) => {
          const loadPercentage = Math.min(100, (faculty.totalUnits / MAX_UNITS) * 100);
          
          let progressBarColor = "bg-primary";
          if (loadPercentage > 85) progressBarColor = "bg-destructive";
          else if (loadPercentage > 65) progressBarColor = "bg-yellow-500";

          return (
            <div key={faculty.id}>
              <div className="flex justify-between items-center mb-1.5 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold text-foreground">{faculty.name}</span>
                </div>
                <span className="font-mono font-bold text-primary">
                  {faculty.totalUnits} Units
                </span>
              </div>
              <Progress value={loadPercentage} className={progressBarColor} />
            </div>
          );
        })}
      </div>
    </div>
  );
}