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
  const { user, logout } = useAuth();
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
    <header className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 sm:py-6">
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
            <nav className="flex flex-col gap-1">
              {mobileNav.map((n) => {
                const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
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
          <div className="text-[9px] font-medium tracking-widest uppercase opacity-70">
            {timeLabel} · {dayLabel}
          </div>
        )}
      </div>
      <div className="flex items-center gap-1.5 sm:gap-3">
        <Link href="/" className="md:hidden">
          <button
            aria-label="Home"
            className="w-10 h-10 rounded-full ring-1 ring-border shadow-sm bg-card flex items-center justify-center hover:bg-muted hover:shadow-md transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </Link>
        <button
          aria-label="Toggle theme"
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full ring-1 ring-border shadow-sm bg-card flex items-center justify-center hover:bg-muted hover:shadow-md transition-all cursor-pointer"
        >
          {mounted && theme === "dark" ? (
            <Sun className="w-4 h-4" strokeWidth={1.75} />
          ) : (
            <Moon className="w-4 h-4" strokeWidth={1.75} />
          )}
        </button>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-center rounded-full ring-1 ring-border shadow-sm hover:opacity-85 hover:shadow-md transition-all focus:outline-none ml-1 sm:ml-2 cursor-pointer">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.photoURL || "https://github.com/evilrabbit.png"} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer" onClick={logout}>
                <LogOut className="mr-2 w-4 h-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : mounted ? (
          <div className="flex items-center gap-2 ml-1 sm:ml-2">
            <Link href="/signin">
              <button className="h-10 px-4 text-[10px] tracking-widest font-bold uppercase text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-all hidden sm:flex items-center justify-center cursor-pointer">
                Sign In
              </button>
            </Link>
            <Link href="/signup">
              <button className="h-10 px-5 text-[10px] font-extrabold tracking-widest uppercase bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-300 rounded-full cursor-pointer flex items-center justify-center">
                Sign Up
              </button>
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  );
}
