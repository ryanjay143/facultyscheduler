import { Link } from "react-router-dom";
import React from "react";
import { ChevronRight } from "lucide-react";

export const QuickActionLink = ({
  to,
  icon,
  text,
}: {
  to: string;
  icon: React.ReactNode;
  text: string;
}) => (
  <Link
    to={to}
    className="group flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-200 bg-white text-gray-800 font-semibold transition-all duration-300 ease-in-out hover:bg-gray-50 hover:shadow-md hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/60"
  >
    <span className="flex items-center gap-4">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 group-hover:bg-blue-100 transition-colors">
        {icon}
      </span>
      <span className="text-gray-700 group-hover:text-gray-900">{text}</span>
    </span>
    <ChevronRight className="text-gray-400 group-hover:text-blue-600 transition-transform duration-300 group-hover:translate-x-0.5" size={18} />
  </Link>
);