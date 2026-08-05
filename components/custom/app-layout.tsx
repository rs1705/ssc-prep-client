"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/custom/sidebar";
import { TopBar } from "@/components/custom/topbar";
import { SidebarProvider, useSidebar } from "@/components/custom/sidebar-context";

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isCollapsed, isMounted } = useSidebar();

  if (pathname === "/") {
    return <>{children}</>;
  }

  const isGameRoute = (path: string) => {
    if (path.includes('/hangman')) return true;
    if (path.includes('/fsrs')) return true;
    if (path.includes('/freestyle')) return true;
    if (path.includes('/game')) return true;
    
    // Trigger on specific topics inside mental-maths, but NOT the topic list page itself
    const isMentalMathsTopic = path.includes('/mental-maths/') && path.split('/mental-maths/')[1]?.length > 0;
    if (isMentalMathsTopic) return true;

    return false;
  };

  const isFocusMode = isGameRoute(pathname);
  const sidebarWidthClass = isFocusMode
    ? "md:w-[72px]"
    : isCollapsed
    ? "md:w-[72px]"
    : "md:w-64 lg:w-72 xl:w-80";

  return (
    <div className="min-h-[100dvh] mx-auto flex bg-background text-foreground w-full">
      {/* Left Sidebar Layout */}
      <div className={`w-0 shrink-0 flex relative z-40 ${isMounted ? 'transition-all duration-300 ease-in-out' : ''} ${sidebarWidthClass}`}>
        <Sidebar isFocusMode={isFocusMode} />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-[100dvh] overflow-y-auto">
        <div className="mx-auto flex-1 flex flex-col w-full max-w-7xl">
          <div className={`shrink-0 ${isFocusMode ? "md:hidden" : ""}`}>
            <TopBar />
          </div>
          <main 
            key={isFocusMode ? "focus" : "normal"}
            className={`flex-1 flex flex-col animate-in fade-in duration-500 fill-mode-forwards min-h-0 ${isFocusMode ? "p-3 sm:p-4 md:p-6 items-center" : "px-4 sm:px-6 md:px-8 pb-16"}`}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
}
