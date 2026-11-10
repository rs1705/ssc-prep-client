"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, PanelLeftClose, PanelLeftOpen, Rocket, Sun } from "lucide-react";
import { useSidebar } from "@/components/custom/sidebar-context";
import { ExamCountdown } from "@/components/custom/exam-countdown";
import { useAuth } from "@/context/auth";
import { useThemeToggle } from "@/hooks/useThemeToggle";
import { activeNavPath, navGroups, type NavItem } from "@/lib/nav";
import { subjectTheme } from "@/lib/subject-theme";

// Re-exported for existing imports (mobile tab bar).
export { PRIMARY_NAV } from "@/lib/nav";

const EASE = "transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]";

function SidebarLink({
  item,
  active,
  collapsed,
  animate,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  animate: boolean;
}) {
  const Icon = item.icon;
  const iconColour = active
    ? "text-amber-700 dark:text-amber-400"
    : item.subject
      ? subjectTheme(item.subject).text
      : "text-muted-foreground group-hover:text-foreground";

  return (
    <Link
      href={item.to}
      title={collapsed ? item.label : undefined}
      aria-current={active ? "page" : undefined}
      className={`group relative flex items-center rounded-xl text-sm font-medium transition-colors duration-150 ${
        collapsed ? "mx-auto h-10 w-10 justify-center" : "gap-3 px-3 py-2"
      } ${
        active
          ? "bg-amber-500/10 font-bold text-amber-800 dark:text-amber-300"
          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
      }`}
    >
      {active && !collapsed && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-amber-500"
        />
      )}
      <Icon
        className={`h-4 w-4 shrink-0 transition-colors duration-150 ${iconColour}`}
        strokeWidth={active ? 2.25 : 1.75}
      />
      <span
        className={`truncate ${animate ? EASE : ""} ${
          collapsed ? "max-w-0 overflow-hidden opacity-0" : "max-w-[200px] opacity-100"
        }`}
      >
        {item.label}
      </span>
    </Link>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for the layout's existing call signature
export function Sidebar({ isFocusMode = false }: { isFocusMode?: boolean }) {
  const pathname = usePathname();
  const { isCollapsed, isMounted, toggleSidebar } = useSidebar();
  const { theme, toggleTheme } = useThemeToggle();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const groups = navGroups(!!user);
  const activePath = activeNavPath(pathname);
  const ease = isMounted ? EASE : "";

  return (
    <aside
      className={`absolute left-0 top-0 z-50 hidden h-[100dvh] flex-col overflow-y-auto border-r-2 border-sidebar-border bg-sidebar scrollbar-none md:flex ${ease} ${
        isCollapsed ? "w-[72px] items-center px-3 py-5" : "w-56 p-5 lg:w-64"
      }`}
    >
      {/* Brand */}
      <Link
        href="/"
        className={`group mb-6 flex min-w-0 items-center ${ease} ${isCollapsed ? "gap-0" : "gap-3"}`}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/25 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
          <Rocket className="h-5 w-5" />
        </div>
        <div
          className={`truncate leading-tight ${ease} ${
            isCollapsed ? "max-w-0 overflow-hidden opacity-0" : "max-w-[200px] opacity-100"
          }`}
        >
          <div className="font-display text-base font-extrabold tracking-tight text-foreground">
            Ept<span className="text-amber-600 dark:text-amber-400">Ssc</span>
          </div>
          <div className="truncate text-xs font-medium text-muted-foreground">
            Elite Prep Training
          </div>
        </div>
      </Link>

      {/* Navigation groups */}
      <nav aria-label="Main" className="flex w-full flex-col">
        {groups.map((group, index) => (
          <div key={group.label ?? "main"} className={index === 0 ? "" : isCollapsed ? "mt-3" : "mt-5"}>
            {group.label && (
              <div
                className={`section-label px-3 ${ease} ${
                  isCollapsed ? "mb-0 h-0 overflow-hidden opacity-0" : "mb-1.5 h-auto opacity-80"
                }`}
              >
                {group.label}
              </div>
            )}
            {isCollapsed && group.label && (
              <div aria-hidden="true" className="mx-auto mb-3 h-px w-6 bg-border" />
            )}
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <SidebarLink
                  key={item.to}
                  item={item}
                  active={activePath === item.to}
                  collapsed={isCollapsed}
                  animate={isMounted}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Exam countdown */}
      <div className={`mb-3 mt-auto pt-5 ${isCollapsed ? "" : "w-full"}`}>
        <ExamCountdown compact={isCollapsed} />
      </div>

      {/* Bottom controls */}
      <div className={`flex flex-col gap-0.5 ${isCollapsed ? "" : "w-full"}`}>
        <button
          type="button"
          onClick={toggleSidebar}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`flex items-center rounded-xl text-muted-foreground transition-colors duration-150 hover:bg-muted/70 hover:text-foreground ${
            isCollapsed ? "mx-auto h-10 w-10 justify-center" : "w-full gap-3 px-3 py-2"
          }`}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              <span className="text-sm font-medium">Collapse</span>
            </>
          )}
        </button>

        {mounted && (
          <button
            type="button"
            onClick={toggleTheme}
            role="switch"
            aria-checked={theme === "dark"}
            aria-label="Dark mode"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className={`flex items-center justify-between rounded-xl text-muted-foreground transition-colors duration-150 hover:bg-muted/70 hover:text-foreground ${
              isCollapsed ? "mx-auto h-10 w-10 justify-center" : "w-full px-3 py-2"
            }`}
          >
            {isCollapsed ? (
              theme === "dark" ? (
                <Moon className="h-4 w-4 shrink-0 text-amber-400" strokeWidth={1.75} />
              ) : (
                <Sun className="h-4 w-4 shrink-0 text-amber-600" strokeWidth={1.75} />
              )
            ) : (
              <>
                <span className="flex items-center gap-3">
                  {theme === "dark" ? (
                    <Moon className="h-4 w-4 shrink-0 text-amber-400" strokeWidth={1.75} />
                  ) : (
                    <Sun className="h-4 w-4 shrink-0 text-amber-600" strokeWidth={1.75} />
                  )}
                  <span className="text-sm font-medium">Dark mode</span>
                </span>
                <span
                  aria-hidden="true"
                  className={`relative h-4.5 w-8 shrink-0 rounded-full transition-colors duration-300 ${
                    theme === "dark" ? "bg-amber-500" : "bg-muted-foreground/30"
                  }`}
                >
                  <span
                    className={`absolute left-[2px] top-[2px] h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                      theme === "dark" ? "translate-x-3.5" : "translate-x-0"
                    }`}
                  />
                </span>
              </>
            )}
          </button>
        )}
      </div>
    </aside>
  );
}
