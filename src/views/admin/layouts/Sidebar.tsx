import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Building2,
  Calendar,
  FileText,
  LayoutDashboardIcon,
  LogOut,
  Megaphone,
  Menu,
  Users,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    {
      href: "/facultyscheduler/admin/user-dashboard",
      label: "Dashboard",
      icon: <LayoutDashboardIcon size={20} />,
    },
    {
      href: "/facultyscheduler/admin/curriculum-management",
      label: "Curriculum",
      icon: <BookOpen size={20} />,
    },
    {
      href: "/facultyscheduler/admin/faculty",
      label: "Faculty",
      icon: <Users size={20} />,
    },
    {
      href: "/facultyscheduler/admin/faculty-loading",
      label: "Faculty Loading",
      icon: <Calendar size={20} />,
    },
    {
      href: "/facultyscheduler/admin/room",
      label: "Classroom",
      icon: <Building2 size={20} />,
    },
    {
      href: "/facultyscheduler/admin/announcement",
      label: "Announcement",
      icon: <Megaphone size={20} />,
    },
    {
      href: "/facultyscheduler/admin/reports",
      label: "Reports",
      icon: <FileText size={20} />,
    },
  ];

  // Segment-aware active matcher: exact href or href + "/" prefix only
  const normalize = (p: string) => p.replace(/\/+$/, "");
  const isRouteActive = (href: string, path: string) => {
    const a = normalize(href);
    const b = normalize(path);
    return b === a || b.startsWith(a + "/");
  };

  // Lock background scroll on mobile when drawer is open
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) {
      document.body.style.overflow = isOpen ? "hidden" : "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close drawer when route changes (prevents stale overlay)
  useEffect(() => {
    if (isOpen) setIsOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Close drawer with Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Mobile toggle button (max-based: md applies on phones) */}
      <button
        className="fixed top-4 left-4 z-50 bg-white text-accent p-2 rounded-full shadow-md transition-all duration-300 ease-in-out transform hidden md:flex"
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X className="text-red-500" size={20} /> : <Menu className="text-primary" size={20} />}
      </button>

      {/* Sidebar pinned top-to-bottom (no bottom gap) */}
      <motion.aside
        className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-gray-900 to-purple-900 shadow-xl z-40
          transition-transform ease-in-out duration-300
          ${isOpen ? "translate-x-0" : "md:-translate-x-full"}
          flex flex-col overscroll-contain`}
        aria-label="Admin navigation"
      >
        {/* Safe-area padding only on phones to avoid desktop gap */}
        <div className="flex flex-col h-full pt-4 pb-4 md:pt-[env(safe-area-inset-top)] md:pb-[env(safe-area-inset-bottom)]">
          {/* Top profile/header */}
          <div className="flex flex-col items-center p-5 border-b border-white/10 space-y-4 text-white shrink-0">
            <div className="w-20 h-20 bg-gradient-to-br from-fuchsia-600 to-violet-600 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg">
              FS
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg">Admin Name</h3>
              <p className="text-xs text-gray-300">Administrator</p>
            </div>
          </div>

          {/* Scrollable nav area */}
          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <ul className="w-full flex flex-col gap-2">
              {navLinks.map((link) => {
                const active = isRouteActive(link.href, location.pathname);
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white transition ${
                      active ? "bg-white/10 font-bold shadow" : "hover:bg-white/5"
                    }`}
                  >
                    {link.icon} {link.label}
                  </Link>
                );
              })}
            </ul>
          </nav>

          {/* Logout pinned to bottom, no extra gap */}
          <div className="px-4 mt-auto shrink-0">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/facultyscheduler/user-login");
              }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500/80 hover:text-white transition-all duration-200"
            >
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Backdrop (mobile only when open) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:transition-opacity md:duration-300 md:ease-in-out"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

export default Sidebar;