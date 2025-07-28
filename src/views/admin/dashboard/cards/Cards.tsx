import { BookOpen, Building2, ClipboardList, Users } from 'lucide-react'

function Cards() {
  return (
    <div className="grid grid-cols-4 md:grid-cols-2 gap-6 mb-8">
      {/* Total Faculty */}
      <div className="flex items-center gap-4 cursor-pointer p-6 bg-purple-50 rounded-xl shadow-lg border-l-4 border-violet-500 hover:scale-[1.02] transition-transform">
        <Users className="text-violet-500" size={32} />
        <div>
          <div className="text-2xl font-bold text-gray-800">24</div>
          <div className="text-sm text-gray-500">Total Faculty</div>
        </div>
      </div>
      {/* Total Rooms */}
      <div className="flex items-center gap-4 p-6 cursor-pointer bg-purple-50 rounded-xl shadow-lg border-l-4 border-fuchsia-500 hover:scale-[1.02] transition-transform">
        <Building2 className="text-fuchsia-500" size={32} />
        <div>
          <div className="text-2xl font-bold text-gray-800">10</div>
          <div className="text-sm text-gray-500">Total Rooms</div>
        </div>
      </div>
      {/* Total Courses */}
      <div className="flex items-center gap-4 p-6 cursor-pointer bg-purple-50 rounded-xl shadow-lg border-l-4 border-purple-500 hover:scale-[1.02] transition-transform">
        <BookOpen className="text-purple-500" size={32} />
        <div>
          <div className="text-2xl font-bold text-gray-800">36</div>
          <div className="text-sm text-gray-500">Total Courses</div>
        </div>
      </div>
      {/* Scheduled Classes */}
      <div className="flex items-center gap-4 p-6 cursor-pointer bg-purple-50 rounded-xl shadow-lg border-l-4 border-blue-500 hover:scale-[1.02] transition-transform">
        <ClipboardList className="text-blue-500" size={32} />
        <div>
          <div className="text-2xl font-bold text-gray-800">12</div>
          <div className="text-sm text-gray-500">Scheduled Classes</div>
        </div>
      </div>
    </div>
  )
}

export default Cards
