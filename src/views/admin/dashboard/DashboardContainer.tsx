import { useEffect, useState } from "react";
import Cards from "./cards/Cards";
import { UpcomingSchedules } from "./cards/UpcomingSchedules";
import { motion } from "framer-motion";
import { CalendarCheck } from "lucide-react";
import axios from "../../../plugin/axios";

export interface DashboardData {
  counts: {
    total_scheduled_classes: number;
    total_faculty_active: number;
    total_rooms_utilized: number;
    total_subjects_taught: number;
  };
  details: ScheduleDetail[];
  day: string;
  date: string;
}

export interface ScheduleDetail {
  id: number;
  subject_code: string;
  description: string;
  type: 'LEC' | 'LAB';
  section: string;
  day: string;
  start_time: string;
  end_time: string;
  room_number: string;
  faculty_name: string;
  faculty_img: string | null;
}

function DashboardContainer() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const response = await axios.get('dashboard/today-statistics', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // REMOVED THE FULL PAGE LOADER HERE so the Welcome section shows immediately

  return (
    <>
      {/* Hero / Welcome Section - ALWAYS VISIBLE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white shadow-lg mb-8"
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 opacity-50 blur-2xl" />
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 opacity-50 blur-2xl" />

        <div className="relative p-6 md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            <CalendarCheck size={14} />
            Admin Dashboard
          </div>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
            Welcome Back, Admin!
          </h1>
          <p className="text-white/80 max-w-2xl mt-2">
             {loading 
                ? "Loading schedule data..." 
                : `Here's a snapshot of today's schedule (${data?.day}, ${data?.date}).`
             }
          </p>
        </div>
      </motion.div>

      {/* Cards Section - Pass 'isLoading' prop */}
      <div className="mb-8">
        <Cards counts={data?.counts} isLoading={loading} />
      </div>

      {/* Upcoming Schedules Section - Pass 'isLoading' prop */}
      <div>
        <UpcomingSchedules schedules={data?.details || []} isLoading={loading} />
      </div>
    </>
  );
}

export default DashboardContainer;