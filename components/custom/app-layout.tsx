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
  const isDashboard = pathname === "/dashboard";
  const sidebarWidthClass = isCollapsed
    ? "md:w-[72px]"
    : "md:w-56 lg:w-64";

  return (
    <div className="min-h-[100dvh] mx-auto flex bg-background text-foreground w-full">
      {/* Left Sidebar Layout */}
      <div className={`w-0 shrink-0 flex relative z-40 ${isMounted ? 'transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]' : ''} ${sidebarWidthClass}`}>
        <Sidebar isFocusMode={isFocusMode} />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-[100dvh] overflow-y-auto">
        <div className="sticky top-0 z-30 w-full bg-background/95 border-b-2 border-border/20 md:backdrop-blur-xl shrink-0">
          <div className="mx-auto w-full max-w-[1400px]">
            <TopBar />
          </div>
        </div>
        <div className="mx-auto flex-1 flex flex-col w-full max-w-[1400px]">
          <main 
            key={isFocusMode ? "focus" : "normal"}
            className={`flex-1 flex flex-col animate-in fade-in duration-500 fill-mode-forwards min-h-0 ${isFocusMode ? "px-3 pt-0 pb-2 sm:px-4 sm:pt-0 sm:pb-3 md:px-6 md:pt-0 md:pb-4 items-center justify-start overflow-hidden" : "pt-3.5 sm:pt-4 md:pt-6 px-4 sm:px-6 md:px-8 pb-16"}`}
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
