"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, SlidersHorizontal, LogOut, User as UserIcon, Menu, Home, Dumbbell, ClipboardList, ChartNoAxesCombined, Bookmark, Trophy, Info, MessageSquare, Rocket, PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/auth";
import { useSidebar } from "@/components/custom/sidebar-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProgressBar } from "@/components/custom/ProgressBar";

export function TopBar() {
  const { theme, setTheme } = useTheme();
  const { user, logout, signInWithGoogle } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const [clock, setClock] = useState<{ time: string; day: string } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const now = new Date();
      setClock({
        time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
        day: now.toLocaleDateString([], { weekday: "short" }).toUpperCase(),
      });
    };
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
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

  const timeLabel = clock?.time ?? "--:--";
  const dayLabel = clock?.day ?? "";

  const isNavActive = (targetPath: string) => {
    if (targetPath === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(targetPath);
  };

  const mobileNav = [
    { to: "/dashboard", label: "Dashboard", icon: Home },
    { to: "/practice", label: "Practice", icon: Dumbbell },
    { to: "/analytics", label: "Analytics", icon: ChartNoAxesCombined },
    { to: "/bookmarks", label: "Bookmarks", icon: Bookmark },
    { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  const secondaryNav = [
    { to: "/feedback", label: "Feedback", icon: MessageSquare },
    { to: "/about", label: "About", icon: Info },
  ];

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-3.5 shrink-0">
      <div className="flex items-center gap-3">
        {/* Hamburger for mobile */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              aria-label="Open menu"
              className="md:hidden w-10 h-10 rounded-full border-2 border-border/40 bg-card/70 backdrop-blur-md flex items-center justify-center hover:bg-muted transition-all cursor-pointer"
            >
              <Menu className="w-4 h-4 text-foreground/80" strokeWidth={1.75} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-5 bg-background/95 backdrop-blur-2xl border-r-2 border-border/40 flex flex-col justify-between h-full overflow-y-auto">
            <div className="flex flex-col">
              {/* Header Logo */}
              <Link href={user ? "/dashboard" : "/"} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 mb-6 group cursor-pointer">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 shadow-md shadow-amber-500/20 flex items-center justify-center text-white shrink-0 group-hover:rotate-6 group-hover:scale-105 transition-transform duration-300 cursor-pointer">
                  <Rocket className="w-5 h-5" />
                </div>
                <div className="leading-tight">
                  <div className="text-xs font-mono font-bold tracking-widest uppercase text-amber-500 flex items-center gap-1">
                    EptSsc <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  </div>
                  <div className="font-extrabold text-sm tracking-tight text-foreground group-hover:text-amber-500 transition-colors">
                    Elite Prep Training
                  </div>
                </div>
              </Link>

              {/* Primary Nav Links */}
              <nav className="flex flex-col gap-1 w-full">
                {(user ? mobileNav : mobileNav.filter(n => n.to === "/practice")).map((n) => {
                  const active = isNavActive(n.to);
                  const Icon = n.icon;
                  return (
                    <Link
                      key={n.to}
                      href={n.to}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center w-full gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 border-2 cursor-pointer ${
                        active
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25 font-bold"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40 hover:border-border/30"
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${active ? "text-amber-500" : "text-muted-foreground"}`} strokeWidth={active ? 2.25 : 1.75} />
                      <span className="truncate">{n.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Support Section */}
              <div className="mt-5 mb-1 px-3 text-xs font-mono font-bold tracking-widest uppercase text-muted-foreground/60">
                Support
              </div>
              <nav className="flex flex-col gap-1 w-full">
                {secondaryNav.map((n) => {
                  const active = isNavActive(n.to);
                  const Icon = n.icon;
                  return (
                    <Link
                      key={n.to}
                      href={n.to}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center w-full gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 border-2 cursor-pointer ${
                        active
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25 font-bold"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40 hover:border-border/30"
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${active ? "text-amber-500" : "text-muted-foreground"}`} strokeWidth={active ? 2.25 : 1.75} />
                      <span className="truncate">{n.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Section: D-Day Widget + Theme Toggle + User Info */}
            <div className="flex flex-col gap-3 pt-4 border-t-2 border-border/40 mt-auto">
              {/* Exam D-Day Widget */}
              <div className="w-full p-3.5 rounded-2xl bg-card/60 backdrop-blur-md border-2 border-amber-500/20 relative overflow-hidden">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-bold tracking-widest uppercase text-muted-foreground whitespace-nowrap">
                    Exam D-Day
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border-2 border-amber-500/20">
                    Tier 1
                  </span>
                </div>
                <div className="text-lg font-black font-mono tracking-tight text-foreground flex items-baseline gap-1.5">
                  142 <span className="text-xs font-mono font-normal text-muted-foreground">days</span>
                </div>
                <ProgressBar
                  value={33}
                  className="h-1.5 mt-2 p-0"
                  barClassName="bg-gradient-to-r from-amber-500 to-orange-500 shadow-sm shadow-amber-500/50"
                />
              </div>

              {/* Theme Toggle Button */}
              {mounted && (
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex items-center justify-between px-3 py-2 rounded-xl border-2 border-transparent hover:bg-muted/40 hover:border-border/30 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {theme === "dark" ? (
                      <Moon className="w-4 h-4 text-amber-400 shrink-0" strokeWidth={1.75} />
                    ) : (
                      <Sun className="w-4 h-4 text-amber-500 shrink-0" strokeWidth={1.75} />
                    )}
                    <span className="text-xs sm:text-sm font-medium">
                      {theme === "dark" ? "Dark Mode" : "Light Mode"}
                    </span>
                  </div>
                  <div className={`relative w-8 h-4.5 rounded-full transition-colors duration-300 ease-in-out shrink-0 ${theme === "dark" ? "bg-amber-500 shadow-inner" : "bg-muted-foreground/30"}`}>
                    <div className={`absolute top-[2px] left-[2px] bg-white w-3.5 h-3.5 rounded-full shadow-sm transition-transform duration-300 ease-in-out flex items-center justify-center ${theme === "dark" ? "translate-x-3.5" : "translate-x-0"}`} />
                  </div>
                </button>
              )}

              {/* User Account / Sign Out / Sign In */}
              {user ? (
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-card/60 border-2 border-border/40">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar className="w-8 h-8 ring-1 ring-amber-500/30 shrink-0">
                      <AvatarImage src={user.photoURL || "https://github.com/evilrabbit.png"} />
                      <AvatarFallback className="bg-amber-500/10 text-amber-500 font-bold text-xs">U</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-foreground truncate">
                        {user.displayName || "User"}
                      </div>
                      <div className="text-xs font-mono text-muted-foreground truncate">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    title="Sign Out"
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : mounted ? (
                <button
                  onClick={signInWithGoogle}
                  className="w-full py-2.5 text-xs font-mono font-extrabold tracking-widest uppercase bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20 hover:shadow-lg rounded-xl cursor-pointer flex items-center justify-center gap-2"
                >
                  Sign in
                </button>
              ) : null}
            </div>
          </SheetContent>
        </Sheet>

        {mounted && (
          <div className="flex items-center gap-2">
            <div className="text-xs font-mono font-bold tracking-wider uppercase text-muted-foreground bg-card/60 backdrop-blur-md px-3 py-1.5 rounded-full border-2 border-border/40 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{timeLabel}</span>
              <span className="text-border">|</span>
              <span className="text-foreground/80">{dayLabel}</span>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <Link href={user ? "/dashboard" : "/"} className="md:hidden">
          <button
            aria-label="Home"
            className="w-10 h-10 rounded-full border-2 border-border/40 bg-card/70 backdrop-blur-md flex items-center justify-center hover:bg-muted transition-all cursor-pointer"
          >
            <Home className="w-4 h-4 text-foreground/80" strokeWidth={1.75} />
          </button>
        </Link>
        <button
          aria-label="Toggle theme"
          onClick={toggleTheme}
          className="md:hidden w-10 h-10 rounded-full border-2 border-border/40 bg-card/70 backdrop-blur-md flex items-center justify-center hover:bg-muted transition-all cursor-pointer"
        >
          {mounted && theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-400" strokeWidth={1.75} />
          ) : (
            <Moon className="w-4 h-4 text-amber-500" strokeWidth={1.75} />
          )}
        </button>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-center rounded-full border-2 border-amber-500/30 hover:border-amber-500/60 transition-all focus:outline-none ml-1 sm:ml-2 cursor-pointer ring-2 ring-transparent focus:ring-amber-500/20">
                <Avatar className="w-10 h-10 ring-1 ring-background">
                  <AvatarImage src={user.photoURL || "https://github.com/evilrabbit.png"} />
                  <AvatarFallback className="bg-amber-500/10 text-amber-500 font-bold">U</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 rounded-2xl bg-card/95 backdrop-blur-xl border-2 border-border/50 shadow-2xl p-2">
              <DropdownMenuLabel className="px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/40 my-1" />
              <DropdownMenuItem className="text-destructive font-medium focus:text-destructive focus:bg-destructive/10 rounded-xl px-3 py-2 cursor-pointer transition-colors" onClick={logout}>
                <LogOut className="mr-2.5 w-4 h-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : mounted ? (
          <div className="flex items-center gap-2 ml-1 sm:ml-2">
            <button 
              onClick={signInWithGoogle}
              className="h-10 px-5 text-xs font-mono font-extrabold tracking-widest uppercase bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 rounded-full cursor-pointer flex items-center justify-center gap-2"
            >
              Sign in
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
