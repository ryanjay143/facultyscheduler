import { useRef } from "react";
import { Outlet } from "react-router-dom";

import DepartmentSidebar from "./layouts/Sidebar";
import { ThemeProvider } from "../../components/themeProvider";

function DeparmentContainerLayouts() {
 
  const mainContentRef = useRef<HTMLElement>(null);

  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <div className="flex min-h-screen">
          <DepartmentSidebar />

          {/* Main Content */}
          <div className={`ml-64 flex-1 flex flex-col min-h-0 transition-all duration-300 md:ml-0`}>
            <main
              ref={mainContentRef}
              className="flex-1 overflow-y-auto"
            >
              <Outlet />
            </main>
          </div>
        </div>
      </ThemeProvider>

     
    </>
  );
}

export default DeparmentContainerLayouts;