import { Home, Calendar, Users, LogOut, Building2, BookOpen } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();
  const navLinks = [
    {
      href: "/admin/user-dashboard",
      label: "Dashboard",
      icon: <Home size={20} />,
    },
    {
      href: "/admin/faculty",
      label: "Faculty",
      icon: <Users size={20} />,
    },
    {
      href: "/admin/room",
      label: "Room",
      icon: <Building2 size={20} />,
    },
    {
      href: "/admin/course",
      label: "Course",
      icon: <BookOpen size={20} />,
    },
    {
      href: "/admin/schedule",
      label: "Schedule",
      icon: <Calendar size={20} />,
    },
  ];

  return (
    <aside className="h-screen w-64 bg-gradient-to-b from-violet-800 via-purple-700 to-fuchsia-600 shadow-xl flex flex-col">
      {/* Logo / Brand */}
      <div className="flex items-center justify-center h-20 border-b border-white/10">
  <span
    className="
      text-2xl font-bold tracking-widest select-none
      text-white
      animate-pulse
      uppercase
      transition-colors duration-600     
    "
  >
    FS
  </span>
</div>
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.href;
          return (
            <Link
              key={link.href}
              to={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white transition
                ${isActive
                  ? "bg-fuchsia-500/80 font-bold shadow"
                  : "hover:bg-fuchsia-500/30"
                }
              `}
            >
              {link.icon} {link.label}
            </Link>
          );
        })}
      </nav>
      {/* Logout */}
      <div className="px-4 pb-6">
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-white hover:bg-fuchsia-500/30 transition bg-transparent">
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;