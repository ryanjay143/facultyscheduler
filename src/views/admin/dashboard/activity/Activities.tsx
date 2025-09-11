// src/components/activity/Activities.tsx

import { Users, BarChart3, Building2 } from "lucide-react";

const recentActivities = [
    { text: "Dr. Santos was assigned to Math 101", icon: Users, time: "2m ago" },
    { text: "Room 204 schedule updated", icon: Building2, time: "1h ago" },
    { text: "New course 'Physics 2' added", icon: BarChart3, time: "3h ago" },
];

function Activities() {
  return (
    <>
      {/* Recent Activity Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border-b-4 border-gray-500">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Recent Activity</h2>
        <ul className="space-y-4">
          {recentActivities.map((activity, index) => (
            <li key={index} className="flex items-start gap-3 text-sm">
                <div className="p-2 bg-gray-100 rounded-full mt-0.5">
                    <activity.icon className="text-gray-500" size={16} />
                </div>
                <div>
                    <p className="text-gray-700">{activity.text}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Monitoring Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
        <MonitoringWidget 
            title="Faculty Load" 
            value={75} 
            color="text-amber-500"
            borderColor="border-amber-500" // Added border color prop
            description="Most faculty are optimally loaded."
        />
         <MonitoringWidget 
            title="Room Utilization" 
            value={80} 
            color="text-blue-500"
            borderColor="border-blue-500" // Added border color prop
            description="High utilization for the current week."
        />
      </div>
    </>
  );
}

// Reusable Radial Progress Widget
const MonitoringWidget = ({ title, value, color, borderColor, description }: any) => {
    const circumference = 2 * Math.PI * 18; // 2 * pi * radius
    const offset = circumference - (value / 100) * circumference;

    return (
        // --- The border style has been updated here ---
        <div className={`bg-white rounded-2xl shadow-lg p-6 border-b-4 ${borderColor}`}>
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            <div className="flex items-center gap-4 mt-2">
                <div className="relative">
                    <svg className="w-20 h-20 transform -rotate-90">
                        <circle cx="40" cy="40" r="18" strokeWidth="4" className="text-gray-200" fill="transparent" />
                        <circle
                            cx="40"
                            cy="40"
                            r="18"
                            strokeWidth="4"
                            className={color}
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                        />
                    </svg>
                    <span className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-xl ${color}`}>
                        {value}%
                    </span>
                </div>
                <p className="text-sm text-gray-500 flex-1">{description}</p>
            </div>
        </div>
    )
}

export default Activities;