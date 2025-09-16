import { Users, BarChart3, Building2, Activity } from "lucide-react";
  import { motion } from "framer-motion";

  const recentActivities = [
    { text: "Dr. Santos was assigned to Math 101", icon: Users, time: "2m ago" },
    { text: "Room 204 schedule updated", icon: Building2, time: "1h ago" },
    { text: "New course 'Physics 2' added", icon: BarChart3, time: "3h ago" },
  ];

  function Activities() {
    return (
      <>
      {/* Monitoring Widgets */}
        <div className="grid grid-cols-2 md:grid-cols-1 gap-6">
          <MonitoringWidget
            title="Faculty Load"
            value={75}
            color="text-amber-500"
            borderColor="border-amber-500"
            description="Most faculty are optimally loaded."
          />
          <MonitoringWidget
            title="Room Utilization"
            value={80}
            color="text-blue-500"
            borderColor="border-blue-500"
            description="High utilization for the current week."
          />
        </div>

        {/* Recent Activity Card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6 border-b-4 border-gray-500 relative overflow-hidden"
        >
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-slate-100 blur-2xl" aria-hidden />
          <h2 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 text-gray-600 border border-gray-200">
              <Activity size={18} />
            </span>
            Recent Activity
          </h2>
          <ul className="space-y-4">
            {recentActivities.map((activity, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-sm"
              >
                <div className="p-2 bg-gray-100 rounded-xl border border-gray-200 mt-0.5">
                  <activity.icon className="text-gray-600" size={16} />
                </div>
                <div>
                  <p className="text-gray-800">{activity.text}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        
      </>
    );
  }

  // Reusable Radial Progress Widget (visual upgrade)
  const MonitoringWidget = ({
    title,
    value,
    color,
    borderColor,
    description,
  }: {
    title: string;
    value: number;
    color: string;
    borderColor: string;
    description: string;
  }) => {
    const radius = 26;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(100, Math.max(0, value));
    const offset = circumference - (progress / 100) * circumference;

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`bg-white rounded-2xl shadow-lg p-6 border-b-4 ${borderColor} relative overflow-hidden`}
      >
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-slate-100 blur-2xl" aria-hidden />
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <div className="flex items-center gap-5 mt-3">
          <div className="relative">
            <svg
              className="w-24 h-24"
              viewBox="0 0 80 80"
              aria-hidden="true"
            >
              {/* Track */}
              <circle
                cx="40"
                cy="40"
                r={radius}
                strokeWidth="8"
                className="text-gray-100"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Progress */}
              <circle
                cx="40"
                cy="40"
                r={radius}
                strokeWidth="8"
                className={color}
                stroke="currentColor"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform="rotate(-90 40 40)"
              />
            </svg>
            <span
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-extrabold text-xl ${color}`}
            >
              {progress}%
            </span>
          </div>
          <p className="text-sm text-gray-600 flex-1">{description}</p>
        </div>
      </motion.div>
    );
  };

  export default Activities;