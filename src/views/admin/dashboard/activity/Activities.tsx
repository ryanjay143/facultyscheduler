import { Users, BarChart3, Building2 } from "lucide-react";

function Activities() {
  return (
    <>
      {/* Recent Activity */}
      <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-lg font-bold mb-4 text-green-800 flex items-center gap-2">
          <BarChart3 className="text-green-500" size={22} />
          Recent Activity
        </h2>
        <ul className="space-y-3 text-sm">
          <li className="flex items-center gap-2 text-green-700">
            <Users className="text-green-500" size={18} />
            Dr. Santos was assigned to Math 101
          </li>
          <li className="flex items-center gap-2 text-green-700">
            <Building2 className="text-green-500" size={18} />
            Room 204 schedule updated
          </li>
          <li className="flex items-center gap-2 text-green-700">
            <BarChart3 className="text-green-500" size={18} />
            New course "Physics 2" added
          </li>
        </ul>
      </div>

      {/* Monitoring Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Faculty Load */}
        <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl shadow-lg p-6 hover:scale-[1.02] transition-transform">
          <h3 className="text-lg font-bold mb-4 text-yellow-800 flex items-center gap-2">
            <Users className="text-yellow-500" size={20} />
            Faculty Load Overview
          </h3>
          <div className="text-sm text-yellow-700">Most faculty have <span className="font-semibold text-yellow-900">3-4 classes</span> assigned.</div>
          {/* Example progress bar */}
          <div className="mt-4 w-full bg-yellow-200 rounded-full h-2">
            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "75%" }} />
          </div>
        </div>
        {/* Room Utilization */}
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-lg p-6 hover:scale-[1.02] transition-transform">
          <h3 className="text-lg font-bold mb-4 text-blue-800 flex items-center gap-2">
            <Building2 className="text-blue-500" size={20} />
            Room Utilization
          </h3>
          <div className="text-sm text-blue-700">80% of rooms are scheduled this week.</div>
          {/* Example progress bar */}
          <div className="mt-4 w-full bg-blue-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: "80%" }} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Activities;