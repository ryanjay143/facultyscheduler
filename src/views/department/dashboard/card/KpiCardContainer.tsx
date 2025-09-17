import { motion } from "framer-motion";
import { KpiCard } from "./KpiCard";
import { BarChartHorizontalBig, CheckCircle2 } from "lucide-react";

const scheduleKpis = {
  schedulesConfirmed: { value: 35, total: 48 },
  avgFacultyLoad: { value: "12h/wk" },
};

function KpiCardContainer() {
  const confirmed = scheduleKpis.schedulesConfirmed;
  const confirmedPercent =
    confirmed.total > 0 ? Math.round((confirmed.value / confirmed.total) * 100) : 0;

  return (
    <section aria-label="Department KPIs" className="mb-8 relative">
      {/* Subtle decorative glow */}
      <div
        className="pointer-events-none absolute inset-x-6 -mt-2 h-20 rounded-2xl bg-gradient-to-r from-violet-200/30 via-fuchsia-200/30 to-sky-200/30 blur-2xl"
        aria-hidden="true"
      />

      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-1 text-xs font-semibold text-white shadow">
            KPIs
          </span>
          <span className="text-xs text-gray-500">Department snapshot</span>
        </div>
        {/* Show on larger screens; hide on phones (max-based md) */}
        <div className="flex items-center gap-2 text-xs text-gray-500 md:hidden">
          <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
          Live
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
        {/* Schedules Confirmed */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.25 }}
          className="relative"
        >
          <KpiCard
            icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
            title="Schedules Confirmed"
            value={`${confirmed.value} / ${confirmed.total}`}
          />
          {/* Badge */}
          <span className="pointer-events-none absolute -right-2 -top-2 rounded-full border border-emerald-200 bg-white px-2 py-0.5 text-[10px] font-bold text-emerald-700 shadow-sm">
            {confirmedPercent}%
          </span>
        </motion.div>

        {/* Avg. Faculty Load */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.06 }}
          whileHover={{ y: -2 }}
          className="relative"
        >
          <KpiCard
            icon={<BarChartHorizontalBig className="h-5 w-5 text-sky-600" />}
            title="Avg. Faculty Load"
            value={scheduleKpis.avgFacultyLoad.value}
          />
          {/* Context badge */}
          <span className="pointer-events-none absolute -right-2 -top-2 rounded-full border border-sky-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-sky-700 shadow-sm">
            This Term
          </span>
        </motion.div>
      </div>
    </section>
  );
}

export default KpiCardContainer;