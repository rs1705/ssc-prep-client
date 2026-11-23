"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/custom/sidebar";
import { TopBar } from "@/components/custom/topbar";
import { MobileTabBar } from "@/components/custom/mobile-tab-bar";
import { PlanStepToast } from "@/features/dashboard/PlanStepToast";
import { XpToast } from "@/features/xp/XpToast";
import { ServerWakeNotice } from "@/components/custom/server-wake-notice";
import { ProgressSync } from "@/components/custom/progress-sync";
import { useAuth } from "@/context/auth";
import { SidebarProvider, useSidebar } from "@/components/custom/sidebar-context";
import { isFocusRoute } from "@/lib/sidebar-mode";
import { useHideOnScroll } from "@/lib/hide-on-scroll";
import { useRef } from "react";

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isCollapsed, isMounted } = useSidebar();
  const { user } = useAuth();
  const scroller = useRef<HTMLDivElement>(null);
  const hideBar = useHideOnScroll(scroller, !isFocusRoute(pathname ?? ""));

  if (pathname === "/") {
    return <>{children}</>;
  }

  // A running mock test takes the whole screen, like the real CBT: no sidebar,
  // top bar or tab bar. Sync and the wake notice still run.
  if (pathname.startsWith("/mock-tests/attempt")) {
    return (
      <>
        {children}
        <ServerWakeNotice />
        <ProgressSync />
      </>
    );
  }

  const isGameRoute = isFocusRoute;

  const isFocusMode = isGameRoute(pathname);
  const barHidden = hideBar;
  // Room at the bottom is only needed when the phone tab bar is showing.
  const showTabBar = Boolean(user) && !isGameRoute(pathname) && !(pathname.startsWith("/signin") || pathname.startsWith("/signup"));
  // Games that lay themselves out to exactly the viewport height (and scroll internally if
  // they must). Other focus routes keep their natural height and scroll the column instead.
  const fitsViewport =
    pathname.includes("/hangman") || /\/games\/.+/.test(pathname) || /\/speed-drills\/.+/.test(pathname) || /\/(maths|reasoning)\/match$/.test(pathname) || pathname === "/review";
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
      <div ref={scroller} className="app-canvas flex-1 flex flex-col min-w-0 h-[100dvh] overflow-y-auto">
        {/* Phones only (desktop has the sidebar): a slim bar with the menu, the brand and the
            account. Not on focus pages (the game card has its own header); elsewhere it slides
            away while scrolling down and comes back on the way up. */}
        <div
          className={`sticky top-0 z-30 w-full shrink-0 border-b border-border/60 bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur-md transition-transform duration-300 ease-out md:hidden ${
            isFocusMode ? "max-md:hidden" : ""
          } ${barHidden ? "max-md:-translate-y-full" : ""}`}
        >
          <div className="mx-auto w-full max-w-[1400px]">
            <TopBar />
          </div>
        </div>
        <div className={`mx-auto flex-1 flex flex-col w-full max-w-[1400px] ${fitsViewport ? "min-h-0" : ""}`}>
          <main 
            key={isFocusMode ? "focus" : "normal"}
            className={`flex-1 flex flex-col animate-in fade-in duration-500 fill-mode-forwards min-h-0 ${
              isFocusMode
                ? "px-3 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2 sm:px-4 sm:pb-3 md:px-6 md:pt-4 md:pb-4 items-center justify-start overflow-hidden"
                : `pt-4 sm:pt-6 md:pt-8 px-4 sm:px-6 md:px-8 md:pb-16 ${showTabBar ? "pb-28" : "pb-8"}`
            }`}
          >
            {children}
          </main>
        </div>
      </div>
      {user && !isFocusMode && !isAuthRoute && <MobileTabBar />}
      {!isAuthRoute && <PlanStepToast />}
      {!isAuthRoute && <XpToast />}
      <ServerWakeNotice />
      <ProgressSync />
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
