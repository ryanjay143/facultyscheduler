import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ArrowUp } from "lucide-react";

import { ThemeProvider } from "@/components/themeProvider";
import AdminSidebar from "./layouts/Sidebar";

function AdminContainer() {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    // Scroll only the main content, not the whole window
    const main = document.getElementById("admin-main-content");
    if (main) {
      main.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="sticky top-0 h-screen z-30">
            <AdminSidebar />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Header */}
            <div className="sticky top-0 z-20">
              {/* The header is rendered by your Outlet's child, e.g., DashboardContainer */}
            </div>
            {/* Scrollable Main Content */}
            <main
              id="admin-main-content"
              className="flex-1 overflow-y-auto bg-[#faf5ff] min-h-0"
            >
              <Outlet />
            </main>
          </div>
        </div>
      </ThemeProvider>

      {/* Scroll to Top Button */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-4 p-3 bg-primary text-white w-12 h-12 rounded-full shadow-lg transition"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </>
  );
}

export default AdminContainer;