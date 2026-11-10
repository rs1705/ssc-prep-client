"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PRIMARY_NAV } from "@/lib/nav";

/**
 * Thumb-reachable primary navigation for phones. The desktop sidebar is hidden
 * below `md`, so this is the always-visible equivalent on small screens.
 */
export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 md:hidden border-t-2 border-border/40 bg-background backdrop-blur-xl pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around">
        {PRIMARY_NAV.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || pathname.startsWith(`${to}/`);
          return (
            <li key={to} className="flex-1">
              <Link
                href={to}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 py-2 text-xs font-bold transition-colors ${
                  active
                    ? "text-brand-600 dark:text-brand-400"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon
                  className="h-5 w-5 shrink-0"
                  strokeWidth={active ? 2.4 : 1.8}
                  aria-hidden="true"
                />
                <span className="truncate">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
