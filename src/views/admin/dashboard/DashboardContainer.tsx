import Cards from "./cards/Cards";
import { UpcomingSchedules } from "./cards/UpcomingSchedules";
import { motion } from "framer-motion";
import { CalendarCheck } from "lucide-react";

function DashboardContainer() {
  return (
    // Ang AdminContainerLayouts na ang bahala sa padding at background
    // kaya hindi na kailangan ng extra layout divs dito.
    <>
      {/* Hero / Welcome Section */}
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
          <p className="text-white/80 max-w-2xl">
            Here's a snapshot of your system's key metrics and today's schedule.
          </p>
        </div>
      </motion.div>

      {/* KPI Cards Section */}
      <div className="mb-8">
        <Cards />
      </div>

      {/* Upcoming Schedules Section */}
      <div>
        <UpcomingSchedules />
      </div>
    </>
  );
}

export default DashboardContainer;