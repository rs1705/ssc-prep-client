"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, SlidersHorizontal, LogOut, User as UserIcon, Menu, Home, Zap, ClipboardList, BarChart3, Bookmark, Trophy, Info, MessageSquare, Rocket, PanelLeftOpen, PanelLeftClose } from "lucide-react";
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

  const mobileNav = [
    { to: "/", label: "Dashboard", icon: Home },
    { to: "/practice", label: "Practice", icon: Zap },
    { to: "/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/bookmarks", label: "Bookmarks", icon: Bookmark },
    { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  const secondaryNav = [
    { to: "/feedback", label: "Feedback", icon: MessageSquare },
    { to: "/about", label: "About", icon: Info },
  ];

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-3.5 shrink-0">
      <div className="flex items-center gap-3">
        {/* Hamburger for mobile */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              aria-label="Open menu"
              className="md:hidden w-10 h-10 rounded-full ring-1 ring-border shadow-sm bg-card flex items-center justify-center hover:bg-muted hover:shadow-md transition-all cursor-pointer"
            >
              <Menu className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-6 bg-background border-border">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-sm flex items-center justify-center text-white">
                <Rocket className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <div className="text-[9px] font-medium tracking-widest uppercase opacity-70">PrepPilot</div>
                <div className="font-semibold text-sm tracking-tight">SSC · CGL Track</div>
              </div>
            </div>
            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-2 p-4 mt-4">
              {(user ? mobileNav : mobileNav.filter(n => n.to === "/practice")).map((n) => {
                const active = n.to === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(n.to);
                const Icon = n.icon;
                return (
                  <Link
                    key={n.to}
                    href={n.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "bg-card text-foreground ring-1 ring-border shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-card/40"
                    }`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.75} />
                    <span>{n.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="mt-8 mb-2 px-3 text-[9px] font-medium tracking-widest uppercase opacity-50">Support</div>
            <nav className="flex flex-col gap-1">
              {secondaryNav.map((n) => {
                const active = pathname.startsWith(n.to);
                const Icon = n.icon;
                return (
                  <Link
                    key={n.to}
                    href={n.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "bg-card text-foreground ring-1 ring-border shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-card/40"
                    }`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.75} />
                    <span>{n.label}</span>
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>

        {mounted && (
          <div className="flex items-center gap-2">
            <div className="text-[10px] font-mono font-bold tracking-wider uppercase text-muted-foreground bg-card/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/40 shadow-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{timeLabel}</span>
              <span className="text-border">|</span>
              <span className="text-foreground/80">{dayLabel}</span>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <Link href="/" className="md:hidden">
          <button
            aria-label="Home"
            className="w-10 h-10 rounded-full border border-border/40 shadow-xs bg-card/70 backdrop-blur-md flex items-center justify-center hover:bg-muted hover:shadow-md transition-all cursor-pointer"
          >
            <Home className="w-4 h-4 text-foreground/80" strokeWidth={1.75} />
          </button>
        </Link>
        <button
          aria-label="Toggle theme"
          onClick={toggleTheme}
          className="md:hidden w-10 h-10 rounded-full border border-border/40 shadow-xs bg-card/70 backdrop-blur-md flex items-center justify-center hover:bg-muted hover:shadow-md transition-all cursor-pointer"
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
              <button className="flex items-center justify-center rounded-full border border-amber-500/30 shadow-xs hover:border-amber-500/60 hover:shadow-md hover:shadow-amber-500/10 transition-all focus:outline-none ml-1 sm:ml-2 cursor-pointer ring-2 ring-transparent focus:ring-amber-500/20">
                <Avatar className="w-10 h-10 ring-1 ring-background">
                  <AvatarImage src={user.photoURL || "https://github.com/evilrabbit.png"} />
                  <AvatarFallback className="bg-amber-500/10 text-amber-500 font-bold">U</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 rounded-2xl bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl p-2">
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
              className="h-10 px-5 text-[10px] font-mono font-extrabold tracking-widest uppercase bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 rounded-full cursor-pointer flex items-center justify-center gap-2"
            >
              Continue with Google
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
