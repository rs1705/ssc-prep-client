"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Zap, BarChart3, Trophy } from "lucide-react";

const dockItems = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/practice", label: "Practice", icon: Zap },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export function MobileFocusDock() {
  const pathname = usePathname();

  return (
    <div className="flex md:hidden animate-in slide-in-from-bottom-8 fade-in duration-500 z-50 mt-auto mb-4 mx-auto w-max relative [@media(min-height:720px)]:fixed [@media(min-height:720px)]:bottom-6 [@media(min-height:720px)]:left-1/2 [@media(min-height:720px)]:-translate-x-1/2">
      <div className="flex items-center gap-1.5 px-3 py-2 bg-card/85 backdrop-blur-xl border border-border/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full">
        {dockItems.map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.to}
              href={item.to}
              className={`p-2.5 rounded-full transition-all duration-200 flex items-center justify-center relative ${
                active
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5 shrink-0" strokeWidth={active ? 2 : 1.75} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
