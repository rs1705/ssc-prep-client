"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import {
  Home,
  Zap,
  BarChart3,
  Bookmark,
  Trophy,
  Rocket,
  Info,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
} from "lucide-react";
import { useSidebar } from "@/components/custom/sidebar-context";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/practice", label: "Practice", icon: Zap },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

const secondaryNav = [
  { to: "/feedback", label: "Feedback", icon: MessageSquare },
  { to: "/about", label: "About", icon: Info },
];

export function Sidebar({ isFocusMode = false }: { isFocusMode?: boolean }) {
  const pathname = usePathname();
  const { isCollapsed, isMounted, toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const isDark = theme === "dark";
    const doc = document as unknown as {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };

    if (
      typeof document === "undefined" ||
      !doc.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTheme(isDark ? "light" : "dark");
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    );

    const transition = doc.startViewTransition(() => {
      setTheme(isDark ? "light" : "dark");
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];
      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 500,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  };

  const overlayClass = isFocusMode && !isCollapsed
    ? "w-64 lg:w-72 xl:w-80 p-6 shadow-2xl"
    : isCollapsed
    ? "w-[72px] px-3 py-5 items-center"
    : "w-64 lg:w-72 xl:w-80 p-6";

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-border/60 bg-background absolute top-0 left-0 h-[100dvh] z-50 overflow-y-auto scrollbar-none ${isMounted ? 'transition-all duration-300 ease-in-out' : ''} ${overlayClass}`}
    >
      {/* Header Row with Logo & PanelLeft Toggle */}
      <div
        className={`flex items-center mb-8 w-full ${
          isCollapsed ? "flex-col gap-3 justify-center" : "justify-between"
        }`}
      >
        <div className={`flex items-center min-w-0 ${isMounted ? 'transition-all duration-300 ease-in-out' : ''} ${isCollapsed ? "gap-0" : "gap-3"}`}>
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-sm flex items-center justify-center text-white shrink-0">
            <Rocket className="w-5 h-5" />
          </div>
          <div className={`leading-tight truncate ${isMounted ? 'transition-all duration-300 ease-in-out' : ''} ${isCollapsed ? "max-w-0 opacity-0 overflow-hidden" : "max-w-[200px] opacity-100"}`}>
            <div className="text-[9px] font-medium tracking-widest uppercase opacity-70">
              PrepPilot
            </div>
            <div className="font-semibold text-sm tracking-tight truncate">
              SSC · CGL Track
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleSidebar}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-5 h-5 text-primary" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Primary Nav Items */}
      <nav className="flex flex-col gap-1 w-full">
        {nav.map((n) => {
          const active = n.to === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(n.to);
          const Icon = n.icon;
          return (
            <Link
              key={n.to}
              href={n.to}
              title={isCollapsed ? n.label : undefined}
              className={`flex items-center rounded-xl text-sm font-medium transition-colors ${
                isCollapsed
                  ? "justify-center w-10 h-10 mx-auto"
                  : "gap-3 px-3 py-2.5"
              } ${
                active
                  ? "bg-card text-foreground ring-1 ring-border shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/40"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
              <span className={`truncate ${isMounted ? 'transition-all duration-300 ease-in-out' : ''} ${isCollapsed ? "max-w-0 opacity-0 overflow-hidden" : "max-w-[200px] opacity-100"}`}>{n.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Support Section */}
      <div className={`mt-8 mb-2 px-3 text-[9px] font-medium tracking-widest uppercase ${isMounted ? 'transition-all duration-300 ease-in-out' : ''} ${isCollapsed ? "max-w-0 opacity-0 overflow-hidden h-0 mb-0 mt-4" : "max-w-[200px] opacity-50 h-auto"}`}>
        Support
      </div>
      <nav className={`flex flex-col gap-1 w-full ${isCollapsed ? "mt-0" : ""}`}>
        {secondaryNav.map((n) => {
          const active = pathname.startsWith(n.to);
          const Icon = n.icon;
          return (
            <Link
              key={n.to}
              href={n.to}
              title={isCollapsed ? n.label : undefined}
              className={`flex items-center rounded-xl text-sm font-medium transition-colors ${
                isCollapsed
                  ? "justify-center w-10 h-10 mx-auto"
                  : "gap-3 px-3 py-2.5"
              } ${
                active
                  ? "bg-card text-foreground ring-1 ring-border shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/40"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
              <span className={`truncate ${isMounted ? 'transition-all duration-300 ease-in-out' : ''} ${isCollapsed ? "max-w-0 opacity-0 overflow-hidden" : "max-w-[200px] opacity-100"}`}>{n.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Theme Toggle Widget */}
      {mounted && (
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className={`mt-auto mb-2 flex items-center justify-between rounded-xl transition-colors hover:bg-card/40 cursor-pointer ${
            isCollapsed 
              ? "p-2 w-10 h-10 mx-auto flex-col justify-center" 
              : "px-3 py-2.5 w-full"
          }`}
        >
          {isCollapsed ? (
            theme === "dark" ? (
              <Moon className="w-5 h-5 shrink-0 text-foreground" strokeWidth={1.75} />
            ) : (
              <Sun className="w-5 h-5 shrink-0 text-foreground" strokeWidth={1.75} />
            )
          ) : (
            <>
              <div className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground">
                {theme === "dark" ? (
                  <Moon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                ) : (
                  <Sun className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                )}
                <span className="text-sm font-medium">Dark Mode</span>
              </div>
              
              {/* iOS Style Toggle Switch */}
              <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 ease-in-out shrink-0 ${theme === "dark" ? "bg-emerald-500" : "bg-muted-foreground/30"}`}>
                <div className={`absolute top-[2px] left-[2px] bg-white w-5 h-5 rounded-full shadow-sm transition-transform duration-300 ease-in-out flex items-center justify-center ${theme === "dark" ? "translate-x-5" : "translate-x-0"}`} />
              </div>
            </>
          )}
        </button>
      )}

      {/* Exam D-Day Widget */}
      <div 
        title="Exam D-Day: 142 days remaining"
        className={`bg-card/60 ring-1 ring-border ${isMounted ? 'transition-all duration-300 ease-in-out' : ''} relative overflow-hidden flex flex-col ${
          isCollapsed 
            ? "w-10 h-10 mx-auto rounded-xl items-center justify-center" 
            : "w-full p-4 rounded-2xl"
        }`}
      >
        {/* Compact View (Centered absolute) */}
        <div className={`font-bold text-primary ${isMounted ? 'transition-all duration-300 ease-in-out' : ''} absolute ${isCollapsed ? "opacity-100 text-[10px]" : "opacity-0 scale-50 pointer-events-none"}`}>
          142d
        </div>
        
        {/* Expanded View */}
        <div className={`w-full ${isMounted ? 'transition-all duration-300 ease-in-out' : ''} ${isCollapsed ? "opacity-0 invisible absolute top-4 left-4" : "opacity-100 relative"}`}>
          <div className="text-[9px] font-medium tracking-widest uppercase mb-1 text-muted-foreground whitespace-nowrap">
            Exam D-Day
          </div>
          <div className="text-2xl font-bold tracking-tight whitespace-nowrap">
            142 <span className="text-xs font-normal text-muted-foreground">days</span>
          </div>
          <div className="h-1 mt-3 bg-muted rounded-full overflow-hidden w-full">
            <div className="h-full bg-primary w-1/3" />
          </div>
        </div>
      </div>
    </aside>
  );
}
