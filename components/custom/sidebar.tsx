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
import { useAuth } from "@/context/auth";

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
  const { user } = useAuth();
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

  const overlayClass = isCollapsed
    ? "w-[72px] px-3 py-5 items-center"
    : "w-56 lg:w-64 p-5";

  return (
    <aside
      className={`hidden md:flex flex-col border-r-2 border-border/40 bg-background/90 backdrop-blur-2xl absolute top-0 left-0 h-[100dvh] z-50 overflow-y-auto scrollbar-none ${isMounted ? 'transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]' : ''} ${overlayClass}`}
    >
      {/* Header Row with Logo */}
      <div
        className={`flex items-center mb-6 w-full ${
          isCollapsed ? "flex-col gap-3 justify-center" : "justify-between"
        }`}
      >
        <Link href="/" className={`flex items-center min-w-0 ${isMounted ? 'transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]' : ''} ${isCollapsed ? "gap-0" : "gap-3"} group`}>
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 shadow-md shadow-amber-500/20 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform duration-300">
            <Rocket className="w-5 h-5" />
          </div>
          <div className={`leading-tight truncate ${isMounted ? 'transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]' : ''} ${isCollapsed ? "max-w-0 opacity-0 overflow-hidden" : "max-w-[200px] opacity-100"}`}>
            <div className="text-[9px] font-mono font-bold tracking-widest uppercase text-amber-500 flex items-center gap-1">
              PrepPilot <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            </div>
            <div className="font-extrabold text-sm tracking-tight truncate text-foreground">
              SSC · CGL Track
            </div>
          </div>
        </Link>
      </div>

      {/* Primary Nav Items */}
      <nav className="flex flex-col gap-1 w-full">
        {(user ? nav : nav.filter(n => n.to === "/practice")).map((n) => {
          const active = n.to === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(n.to);
          const Icon = n.icon;
          return (
            <Link
              key={n.to}
              href={n.to}
              title={isCollapsed ? n.label : undefined}
              className={`flex items-center rounded-xl text-xs sm:text-sm font-medium transition-colors duration-150 border-2 ${
                isCollapsed
                  ? "justify-center w-10 h-10 mx-auto"
                  : "gap-3 px-3 py-2"
              } ${
                active
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25 font-bold shadow-xs"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40 hover:border-border/30"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-colors duration-150 ${active ? "text-amber-500" : "text-muted-foreground group-hover:text-foreground"}`} strokeWidth={active ? 2.25 : 1.75} />
              <span className={`truncate ${isMounted ? 'transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]' : ''} ${isCollapsed ? "max-w-0 opacity-0 overflow-hidden" : "max-w-[200px] opacity-100"}`}>{n.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Support Section */}
      <div className={`mt-5 mb-1 px-3 text-[9px] font-mono font-bold tracking-widest uppercase text-muted-foreground/60 ${isMounted ? 'transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]' : ''} ${isCollapsed ? "max-w-0 opacity-0 overflow-hidden h-0 mb-0 mt-4" : "max-w-[200px] opacity-70 h-auto"}`}>
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
              className={`flex items-center rounded-xl text-xs sm:text-sm font-medium transition-colors duration-150 border-2 ${
                isCollapsed
                  ? "justify-center w-10 h-10 mx-auto"
                  : "gap-3 px-3 py-2"
              } ${
                active
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25 font-bold shadow-xs"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40 hover:border-border/30"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-colors duration-150 ${active ? "text-amber-500" : "text-muted-foreground"}`} strokeWidth={active ? 2.25 : 1.75} />
              <span className={`truncate ${isMounted ? 'transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]' : ''} ${isCollapsed ? "max-w-0 opacity-0 overflow-hidden" : "max-w-[200px] opacity-100"}`}>{n.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Exam D-Day Widget */}
      <div 
        title="Exam D-Day: 142 days remaining"
        className={`mt-auto mb-3 bg-card/60 backdrop-blur-md border-2 border-amber-500/20 shadow-sm ${isMounted ? 'transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]' : ''} relative overflow-hidden flex flex-col ${
          isCollapsed 
            ? "w-10 h-10 mx-auto rounded-xl items-center justify-center shrink-0" 
            : "w-full p-3.5 rounded-2xl"
        }`}
      >
        {/* Compact View (Centered absolute) */}
        <div className={`font-mono font-bold text-amber-500 ${isMounted ? 'transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]' : ''} absolute ${isCollapsed ? "opacity-100 text-[10px]" : "opacity-0 scale-50 pointer-events-none"}`}>
          142d
        </div>
        
        {/* Expanded View */}
        <div className={`w-full ${isMounted ? 'transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]' : ''} ${isCollapsed ? "opacity-0 invisible absolute top-3 left-3" : "opacity-100 relative"}`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-muted-foreground whitespace-nowrap">
              Exam D-Day
            </span>
            <span className="text-[9px] font-mono font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border-2 border-amber-500/20">
              Tier 1
            </span>
          </div>
          <div className="text-xl font-black font-mono tracking-tight whitespace-nowrap text-foreground flex items-baseline gap-1.5">
            142 <span className="text-xs font-mono font-normal text-muted-foreground">days</span>
          </div>
          <div className="h-1.5 mt-2.5 bg-muted/60 rounded-full overflow-hidden w-full border-2 border-border/30">
            <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full w-1/3 shadow-sm shadow-amber-500/50" />
          </div>
        </div>
      </div>

      {/* Bottom Controls Group */}
      <div className="flex flex-col gap-1">
        <button
          onClick={toggleSidebar}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          className={`flex items-center rounded-xl transition-colors duration-150 border-2 border-transparent hover:bg-muted/40 hover:border-border/30 cursor-pointer text-muted-foreground hover:text-foreground ${
            isCollapsed 
              ? "p-2 w-10 h-10 mx-auto justify-center" 
              : "px-3 py-2 w-full gap-3"
          }`}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-4 h-4 shrink-0" strokeWidth={1.75} />
          ) : (
            <>
              <PanelLeftClose className="w-4 h-4 shrink-0" strokeWidth={1.75} />
              <span className="text-xs sm:text-sm font-medium">Collapse Sidebar</span>
            </>
          )}
        </button>

        {/* Theme Toggle Widget */}
        {mounted && (
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className={`flex items-center justify-between rounded-xl transition-colors duration-150 border-2 border-transparent hover:bg-muted/40 hover:border-border/30 cursor-pointer ${
              isCollapsed 
                ? "p-2 w-10 h-10 mx-auto flex-col justify-center" 
                : "px-3 py-2 w-full"
            }`}
          >
          {isCollapsed ? (
            theme === "dark" ? (
              <Moon className="w-4 h-4 shrink-0 text-amber-400" strokeWidth={1.75} />
            ) : (
              <Sun className="w-4 h-4 shrink-0 text-amber-500" strokeWidth={1.75} />
            )
          ) : (
            <>
              <div className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground">
                {theme === "dark" ? (
                  <Moon className="w-4 h-4 shrink-0 text-amber-400" strokeWidth={1.75} />
                ) : (
                  <Sun className="w-4 h-4 shrink-0 text-amber-500" strokeWidth={1.75} />
                )}
                <span className="text-xs sm:text-sm font-medium">Dark Mode</span>
              </div>
              
              {/* iOS Style Toggle Switch */}
              <div className={`relative w-8 h-4.5 rounded-full transition-colors duration-300 ease-in-out shrink-0 ${theme === "dark" ? "bg-amber-500 shadow-inner" : "bg-muted-foreground/30"}`}>
                <div className={`absolute top-[2px] left-[2px] bg-white w-3.5 h-3.5 rounded-full shadow-sm transition-transform duration-300 ease-in-out flex items-center justify-center ${theme === "dark" ? "translate-x-3.5" : "translate-x-0"}`} />
              </div>
            </>
          )}
        </button>
        )}
      </div>
    </aside>
  );
}
