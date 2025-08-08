import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {BookOpen, Calendar, Home, LogOut, Menu, X } from "lucide-react"; 
import { motion } from "framer-motion";


function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

 const navLinks = [
  { 
    href: "/facultyscheduler/faculty/user-dashboard", 
    label: "Dashboard", 
    icon: <Home size={20} /> 
  },
  { 
    href: "/facultyscheduler/faculty/my-schedule", 
    label: "My Schedule", 
    icon: <Calendar size={20} /> 
  },
  { 
    href: "/facultyscheduler/faculty/class-list", 
    label: "Class List", 
    icon: <BookOpen size={20} />
  },
];


  return (
    <>
      <button
        className={`fixed top-4 left-4 z-50 bg-white text-accent p-2 rounded-full shadow-md transition-all duration-300 ease-in-out transform ${
          isOpen ? "opacity-100 scale-100 md:block" : "opacity-100 scale-100 hidden md:block"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="text-red-500" size={20} />
        ) : (
          <Menu className="text-primary " size={20} />
        )}
      </button>

      {/* Sidebar */}
      <motion.aside
        className={`h-screen w-64 bg-gradient-to-b from-gray-900 to-purple-900 shadow-xl flex flex-col z-40
          fixed top-0 left-0 transition-transform ease-in-out duration-300
          ${isOpen ? "translate-x-0" : "md:-translate-x-full"
        } md:w-56 overflow-hidden`}
      >

       <div className="flex flex-col items-center p-6 border-b border-white/10 space-y-4 text-white">
            <div className="w-20 h-20 bg-gradient-to-br from-fuchsia-600 to-violet-600 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg">
                FS
            </div>
            <div className="text-center">
                <h3 className="font-semibold text-lg">Faculty Name</h3>
                <p className="text-xs text-gray-300">Faculty</p>
            </div>
        </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <ul className="w-full flex flex-col gap-2">
              {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white transition
                  ${isActive ? 'bg-white/10 font-bold shadow' : 'hover:bg-white/5'}
                `}
              >
                {link.icon} {link.label}
              </Link>
            );
          })}
            </ul>
          </nav>

         <div className="px-4 pb-6 mt-auto">
          <button onClick={() => navigate('/facultyscheduler/user-login')} className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500/80 hover:text-white transition-all duration-200">
            <LogOut size={20} /> Logout
          </button>
        </div>

       
       </motion.aside>

           {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-30 md:transition-opacity md:duration-300 md:ease-in-out"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}

export default Sidebar;