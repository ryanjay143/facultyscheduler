import { Home, Calendar, Users, LogOut, Building2, BookOpen } from 'lucide-react';

function Sidebar() {
  return (
    <aside className="h-screen w-64 bg-gradient-to-b from-violet-800 via-purple-700 to-fuchsia-600 shadow-xl flex flex-col">
      {/* Logo / Brand */}
      <div className="flex items-center justify-center h-20 border-b border-white/10">
        <span className="text-2xl font-bold text-white tracking-widest">FS</span>
      </div>
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-white bg-white/10 hover:bg-fuchsia-500/30 transition">
          <Home size={20} /> Dashboard
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-fuchsia-500/30 transition">
          <Users size={20} /> Faculty
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-fuchsia-500/30 transition">
          <Building2 size={20} /> Room
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-fuchsia-500/30 transition">
          <BookOpen size={20} /> Course
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-fuchsia-500/30 transition">
          <Calendar size={20} /> Schedule
        </a>
      </nav>
      {/* Logout */}
      <div className="px-4 pb-6">
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-white bg-white/10 hover:bg-fuchsia-500/30 transition">
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;