import { useState, useRef, useEffect } from 'react';
import { BarChart3, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Header() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Kini nga useEffect para mo-sira sa dropdown kung mo-click ka sa gawas
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Variants para sa nindot nga animation sa dropdown
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 }
  };

  return (
    <div className="sticky top-0 z-30">
      {/* Gradient nga linya sa ibabaw */}
      <div className="absolute left-0 top-0 w-full h-1.5" />
      
      {/* Main Header Bar (nga naay purple glass effect) */}
      <div className="flex items-center justify-between py-4 px-4 md:px-6 shadow-xl bg-purple-50 md:bg-primary">
        
        {/* Seksyon sa Logo ug Title (wala nga bahin) */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1, rotate: -10 }}
            className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-500 shadow-lg"
          >
            <BarChart3 className="text-white" size={24} />
          </motion.div>
          <span className="text-xl font-bold md:text-white text-black tracking-wide drop-shadow-sm">
            Faculty Scheduler
          </span>
        </div>

        {/* Seksyon sa Profile Picture with Dropdown and Arrow (tuo nga bahin) */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 focus:outline-none group"
            onClick={() => setOpen((prev) => !prev)}
          >
            {/* Impormasyon sa User */}
            <div className="hidden md:flex flex-col items-end">
              <span className="font-semibold text-sm text-black md:text-white max-w-[120px] truncate">
                John Doe
              </span>
              <span className="text-xs text-gray-400 md:text-white">Administrator</span>
            </div>
            
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-purple-500/70 group-hover:border-fuchsia-400 transition-colors duration-300"
            />
            
            <ChevronDown
              size={20}
              className={`text-purple-300 transition-transform duration-300 group-hover:text-black ${open ? "rotate-180" : ""}`}
            />
          </button>
          
          {/* Ang Animated Dropdown Menu */}
          <AnimatePresence>
            {open && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="absolute right-0 top-full mt-3 w-56 bg-[#2a1d3e]/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 z-50 overflow-hidden"
              >
                <div className="p-2">
                  <button className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-purple-600/30 text-gray-200 transition-colors">
                    <User size={18} className="text-purple-300" />
                    <span>Profile</span>
                  </button>
                  <button className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-purple-600/30 text-gray-200 transition-colors">
                    <Settings size={18} className="text-purple-300" />
                    <span>Settings</span>
                  </button>
                  <hr className="border-t border-white/10 my-1" />
                  <button className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-red-500/20 text-red-400 transition-colors">
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Header;