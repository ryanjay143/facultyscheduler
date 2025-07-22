import { useState, useRef, useEffect } from 'react';
import { BarChart3, ChevronDown } from 'lucide-react';

function Header() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="sticky top-0 z-20">
      <div className="absolute left-0 top-0 w-full h-2 bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 rounded-t-xl" />
      <div className="flex items-center justify-between py-5 px-8 bg-white/80 backdrop-blur-md shadow-xl border-b border-purple-100">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-violet-600 via-purple-500 to-fuchsia-500 shadow-lg">
            <BarChart3 className="text-white" size={26} />
          </span>
          <span className="text-2xl font-extrabold text-gray-800 tracking-wide drop-shadow-sm">
            Faculty & Class Scheduler
          </span>
        </div>
        {/* Profile Picture with Dropdown and Arrow */}
        <div className="relative flex items-center gap-2" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 focus:outline-none"
            onClick={() => setOpen((prev) => !prev)}
          >
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Profile"
              className="w-11 h-11 rounded-full border-2 border-violet-500 shadow"
            />
            <ChevronDown
              size={22}
              className={`text-violet-600 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>
          {open && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
              <ul className="py-2">
                <li>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700">Profile</button>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700">Settings</button>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700">Logout</button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;