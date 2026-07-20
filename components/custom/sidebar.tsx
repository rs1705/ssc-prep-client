"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Zap, ClipboardList, BarChart3, Bookmark, Trophy, Rocket, Info, MessageSquare } from "lucide-react";

const nav = [
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

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col p-6 border-r border-border/60 bg-background h-screen sticky top-0 overflow-y-auto">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-sm flex items-center justify-center text-white">
          <Rocket className="w-5 h-5" />
        </div>
        <div className="leading-tight">
          <div className="text-[9px] font-medium tracking-widest uppercase opacity-70">PrepPilot</div>
          <div className="font-semibold text-sm tracking-tight">SSC · CGL Track</div>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {nav.map((n) => {
          const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
          const Icon = n.icon;
          return (
            <Link
              key={n.to}
              href={n.to}
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

      <div className="mt-auto p-4 rounded-2xl bg-card/60 ring-1 ring-border">
        <div className="text-[9px] font-medium tracking-widest uppercase mb-1 text-muted-foreground">Exam D-Day</div>
        <div className="text-2xl font-bold tracking-tight">
          142 <span className="text-xs font-normal text-muted-foreground">days</span>
        </div>
        <div className="h-1 mt-3 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary w-1/3" />
        </div>
      </div>
    </aside>
  );
}
