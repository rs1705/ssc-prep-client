"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/custom/sidebar";
import { TopBar } from "@/components/custom/topbar";
import { MobileTabBar } from "@/components/custom/mobile-tab-bar";
import { PlanStepToast } from "@/features/dashboard/PlanStepToast";
import { useAuth } from "@/context/auth";
import { SidebarProvider, useSidebar } from "@/components/custom/sidebar-context";

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isCollapsed, isMounted } = useSidebar();
  const { user } = useAuth();

  if (pathname === "/") {
    return <>{children}</>;
  }

  const isGameRoute = (path: string) => {
    if (path.includes('/hangman')) return true;
    if (path.includes('/fsrs')) return true;
    if (path.includes('/freestyle')) return true;
    if (path.endsWith('/maths/flashcards')) return true;
    // Individual games live under /games/<name>; the /games hub itself is a normal page.
    if (/\/games\/.+/.test(path)) return true;
    if (/\/speed-drills\/.+/.test(path)) return true;
    if (/\/(maths|reasoning)\/match$/.test(path)) return true;
    
    // Trigger on specific topics inside mental-maths, but NOT the topic list page itself
    const isMentalMathsTopic = path.includes('/mental-maths/') && path.split('/mental-maths/')[1]?.length > 0;
    if (isMentalMathsTopic) return true;

    return false;
  };

  const isFocusMode = isGameRoute(pathname);
  // Games that lay themselves out to exactly the viewport height (and scroll internally if
  // they must). Other focus routes keep their natural height and scroll the column instead.
  const fitsViewport =
    pathname.includes("/hangman") || /\/games\/.+/.test(pathname) || /\/speed-drills\/.+/.test(pathname) || /\/(maths|reasoning)\/match$/.test(pathname);
  const isAuthRoute = pathname.startsWith("/signin") || pathname.startsWith("/signup");
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
      <div className="app-canvas flex-1 flex flex-col min-w-0 h-[100dvh] overflow-y-auto">
        <div className="sticky top-0 z-30 w-full bg-background border-b-2 border-border/60 backdrop-blur-md shrink-0">
          <div className="mx-auto w-full max-w-[1400px]">
            <TopBar />
          </div>
        </div>
        <div className={`mx-auto flex-1 flex flex-col w-full max-w-[1400px] ${fitsViewport ? "min-h-0" : ""}`}>
          <main 
            key={isFocusMode ? "focus" : "normal"}
            className={`flex-1 flex flex-col animate-in fade-in duration-500 fill-mode-forwards min-h-0 ${
              isFocusMode 
                ? "px-3 pt-2 pb-2 sm:px-4 sm:pt-3 sm:pb-3 md:px-6 md:pt-4 md:pb-4 items-center justify-start overflow-hidden" 
                : "pt-4 sm:pt-6 md:pt-8 px-4 sm:px-6 md:px-8 pb-28 md:pb-16"
            }`}
          >
            {children}
          </main>
        </div>
      </div>
      {user && !isFocusMode && !isAuthRoute && <MobileTabBar />}
      {!isAuthRoute && <PlanStepToast />}
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
