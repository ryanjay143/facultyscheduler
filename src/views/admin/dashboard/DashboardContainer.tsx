import Header from "../layouts/Header";
import Activities from "./activity/Activities";
import Cards from "./cards/Cards";
import { UpcomingSchedules } from "./cards/UpcomingSchedules";
import { AnnouncementsWidget } from "./widgets/AnnouncementsWidget";
import { motion } from "framer-motion";
import { CalendarCheck } from "lucide-react";

function DashboardContainer() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />

      {/* Main dashboard content with its own scrolling */}
      <main className="flex-1 overflow-y-auto p-4 md:p-0">
        {/* Center content and keep it within a comfortable max width */}
        <div className="mx-auto max-w-7xl p-4 md:p-8">
          {/* Hero / Welcome */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white shadow-lg mb-8"
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

            <div className="relative p-6 md:p-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold shadow-sm">
                <CalendarCheck size={14} />
                Admin Dashboard
              </div>
              <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">
                Welcome Back, Admin!
              </h1>
              <p className="text-white/80">Here’s a snapshot of your system today.</p>
            </div>
          </motion.div>

          {/* KPI Cards */}
          <div className="mb-8">
            <Cards />
          </div>

          {/* Main Grid: Left (Announcements + Activities), Right (Schedule spans 2 cols on large) */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
               <Activities />
              <AnnouncementsWidget />
             
            </div>

            {/* Right Column (Schedule) */}
            <div className="">
              <UpcomingSchedules />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardContainer;