import { useEffect, useState, useRef } from "react";
import { Outlet } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { ThemeProvider } from "../../components/themeProvider";
import DeanHeader from "./layouts/DeanHeader";
import DeanSidebar from "./layouts/DeanSidebar";


function DeparmentContainerLayouts() {
  const [showScroll, setShowScroll] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mainEl = mainContentRef.current;
    const handleScroll = () => {
      if (mainEl) setShowScroll(mainEl.scrollTop > 200);
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
        <div className="relative bg-background min-h-[100svh]">
          <DeanSidebar 
            isOpen={isSidebarOpen} 
            setIsOpen={setIsSidebarOpen}
            isCollapsed={isSidebarCollapsed}
          />

          <div 
            className={`flex-1 flex flex-col transition-all duration-300 
              ${isSidebarCollapsed ? 'md:ml-[72px]' : 'md:ml-64'}`}
          >
            <DeanHeader 
              isSidebarOpen={isSidebarOpen} 
              setIsSidebarOpen={setIsSidebarOpen}
              isSidebarCollapsed={isSidebarCollapsed}
              setIsSidebarCollapsed={setIsSidebarCollapsed}
            />

            <main
              ref={mainContentRef}
              className="flex-1 overflow-y-auto"
            >
              <div className="p-4 md:p-6 lg:p-8">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </ThemeProvider>

      {showScroll && (
        <button onClick={scrollToTop} className="fixed bottom-6 right-6 p-3 bg-primary text-primary-foreground w-12 h-12 rounded-full shadow-lg hover:bg-primary/90 transition-opacity" aria-label="Scroll to top">
          <ArrowUp size={24} />
        </button>
      )}
    </>
  );
}

export default DeparmentContainerLayouts;