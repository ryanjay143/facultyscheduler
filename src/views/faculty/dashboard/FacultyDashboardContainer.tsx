import StatsCards from "./cards/StatsCards";
import UpcomingSchedule from "./cards/UpcomingSchedule";
import { motion } from "framer-motion";
import { CalendarCheck } from "lucide-react";

function FacultyDashboardContainer() {
  // Gikuha ang user info gikan sa localStorage para sa personalized nga welcome message
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { name: 'Faculty' };

  return (
    // Ang Admin/Faculty Container na ang bahala sa padding, so dili na kinahanglan dinhi
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-lg"
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 opacity-50 blur-2xl" />
        <div className="relative p-6 md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            <CalendarCheck size={14} />
            Faculty Dashboard
          </div>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
            Welcome back, {user.name}!
          </h1>
          <p className="text-white/80 max-w-2xl">
            Here is a summary of your classes and workload for today.
          </p>
        </div>
      </motion.div>

      {/* Stats Cards Section */}
      <div>
        <StatsCards />
      </div>

      {/* Upcoming Schedule Section */}
      <div>
        <UpcomingSchedule />
      </div>
    </div>
  );
}

export default FacultyDashboardContainer;