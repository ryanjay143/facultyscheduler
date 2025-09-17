import { useEffect, useState, useRef } from "react";
import { Outlet } from "react-router-dom";
import { ArrowUp } from "lucide-react";

import AdminSidebar from "./layouts/Sidebar";
import { ThemeProvider } from "../../components/themeProvider";

function AdminContainerLayouts() {
  const [showScroll, setShowScroll] = useState(false);
  const mainContentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mainEl = mainContentRef.current;
    const handleScroll = () => {
      if (mainEl) {
        setShowScroll(mainEl.scrollTop > 200);
      }
    };
    mainEl?.addEventListener("scroll", handleScroll);
    return () => mainEl?.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    mainContentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        {/* Use 100svh to avoid iOS Safari bottom gap with 100vh */}
        <div className="flex min-h-[100svh]">
          <AdminSidebar />

          {/* Main Content */}
          <div className="ml-64 flex-1 flex flex-col min-h-0 transition-all duration-300 md:ml-0">
            <main
              ref={mainContentRef}
              className="flex-1 min-h-0 overflow-y-auto"
            >
              <Outlet />
            </main>
          </div>
        </div>
      </ThemeProvider>

      {/* Scroll to Top */}
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

export default AdminContainerLayouts;