import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { User, BarChartHorizontal } from "lucide-react";
import axios from "../../../../plugin/axios"; 

// 1. Define the API data structure
interface FacultyLoad {
  name: string;
  load: number; // Corresponds to t_load_units from the API
}

// 2. Define the API response structure
interface FacultyLoadApiResponse {
  success: boolean;
  data: FacultyLoad[];
  message?: string; // Added message for error response
}

export function FacultyWorkloadsView() {
  const [facultyWorkloads, setFacultyWorkloads] = useState<FacultyLoad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const MAX_UNITS = 20; 

  // 3. Fetch data from the API endpoint with Authorization header
  useEffect(() => {
    const fetchWorkloads = async () => {
      try {
        setLoading(true);
        setError(null);

        // --- AUTHENTICATION LOGIC START ---
        // 1. Get the accessToken from localStorage
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
          // If no token, set an error and stop
          setError("Authentication token not found. Please log in.");
          setLoading(false);
          return;
        }

        // 2. Define the headers config for the API request
        const config = {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        };
        // --- AUTHENTICATION LOGIC END ---

        // 3. Make the API request with the config
        const response = await axios.get<FacultyLoadApiResponse>('faculty-load', config); 
        
        if (response.data.success) {
          setFacultyWorkloads(response.data.data);
        } else {
          // Use response.data.message or a default failure message
          setError(response.data.message || "Failed to load faculty data.");
        }
      } catch (err) {
        // Handle network or server error (including 401 unauthenticated response)
        const errorMessage = axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message 
            : "Could not connect to the server or fetch data.";
        
        console.error("Error fetching faculty workload data:", err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkloads();
  }, []);
  
  // --- Loading, Error, and Empty State Handlers ---

  if (loading) {
    return (
      <div className="space-y-6 pt-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Faculty Workload Management</h1>
        <div className="bg-card p-6 rounded-lg shadow-sm border text-center text-muted-foreground">
          <div className="animate-pulse">Loading Faculty Workloads...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
       <div className="space-y-6 pt-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-destructive">Data Error</h1>
        <div className="bg-card p-6 rounded-lg shadow-sm border border-destructive text-center text-destructive">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }
  
  if (facultyWorkloads.length === 0) {
    return (
      <div className="space-y-6 pt-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Faculty Workload Management</h1>
        <div className="bg-card p-6 rounded-lg shadow-sm border text-center text-muted-foreground">
          <p>No active faculty found to display workload data.</p>
        </div>
      </div>
    );
  }

  // --- Main Render with Header ---

  return (
    <div className="space-y-6"> 
        {/* Page Header Structure */}
        <header className="pb-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
                <BarChartHorizontal className="h-6 w-6 text-primary" />
                Faculty Workload Management
            </h1>
            <p className="text-muted-foreground text-sm mt-1 ml-9">
                Overview of current unit loads vs. a standard cap of <span className="font-semibold">{MAX_UNITS} units/hours.</span>
            </p>
        </header>

        {/* Existing Content Card */}
        <div className="bg-card p-4 md:p-6 rounded-lg shadow-sm border border-border">
          <div className="space-y-6">
            {facultyWorkloads.map((faculty) => {
              const loadPercentage = Math.min(100, (faculty.load / MAX_UNITS) * 100);
              
              let progressBarColor = "bg-primary";
              if (faculty.load > MAX_UNITS) progressBarColor = "bg-red-600"; // Exceeds max
              else if (loadPercentage > 90) progressBarColor = "bg-destructive"; // Near full load
              else if (loadPercentage > 70) progressBarColor = "bg-yellow-500"; // Medium load
              else progressBarColor = "bg-primary";


              return (
                <div key={faculty.name}>
                  <div className="flex justify-between items-center mb-1.5 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-foreground">{faculty.name}</span>
                    </div>
                    <span className={`font-mono font-bold ${faculty.load > MAX_UNITS ? 'text-red-600' : 'text-primary'}`}>
                      {faculty.load}h 
                      {faculty.load > MAX_UNITS && <span className="ml-1">(OVER)</span>}
                    </span>
                  </div>
                  <Progress value={loadPercentage} className={progressBarColor} />
                </div>
              );
            })}
          </div>
        </div>
    </div>
  );
}