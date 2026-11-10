"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Home, LogOut, Menu, Moon, Rocket, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ExamCountdown } from "@/components/custom/exam-countdown";
import { useAuth } from "@/context/auth";
import { useThemeToggle } from "@/hooks/useThemeToggle";
import { activeNavPath, navGroups } from "@/lib/nav";
import { subjectTheme } from "@/lib/subject-theme";

const ICON_BUTTON =
  "flex h-10 w-10 items-center justify-center rounded-full border-2 border-border bg-card text-foreground/80 transition-colors hover:bg-muted";
const SIGN_IN_BUTTON =
  "flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-r from-brand-500 to-brand-alt-500 px-5 text-sm font-bold text-white shadow-md shadow-brand-500/25 transition-all duration-200 hover:shadow-lg hover:shadow-brand-500/30 active:scale-95";

function initialsOf(name?: string | null): string {
  if (!name) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function TopBar() {
  const { theme, toggleTheme } = useThemeToggle();
  const { user, logout, signInWithGoogle } = useAuth();
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/signin") || pathname.startsWith("/signup");
  const [mounted, setMounted] = useState(false);
  const [today, setToday] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    setToday(
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "short",
      }),
    );
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const groups = navGroups(!!user);
  const activePath = activeNavPath(pathname);
  const isDark = mounted && theme === "dark";

  return (
    <header className="flex shrink-0 items-center justify-between gap-3 px-4 py-3 sm:px-6 md:px-8">
      <div className="flex min-w-0 items-center gap-3">
        {/* Mobile menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button type="button" aria-label="Open menu" className={`${ICON_BUTTON} md:hidden`}>
              <Menu className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="flex h-full w-72 flex-col overflow-y-auto border-r-2 border-sidebar-border bg-sidebar p-5"
          >
            <SheetTitle className="sr-only">Menu</SheetTitle>

            <Link
              href={user ? "/dashboard" : "/"}
              onClick={() => setMobileOpen(false)}
              className="mb-6 flex items-center gap-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-alt-600 text-white shadow-md shadow-brand-500/25">
                <Rocket className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <div className="font-display text-base font-extrabold tracking-tight text-foreground">
                  Ept<span className="text-brand-600 dark:text-brand-400">Ssc</span>
                </div>
                <div className="text-xs font-medium text-muted-foreground">Elite Prep Training</div>
              </div>
            </Link>

            <nav aria-label="Main" className="flex flex-col">
              {groups.map((group, index) => (
                <div key={group.label ?? "main"} className={index === 0 ? "" : "mt-5"}>
                  {group.label && <div className="section-label mb-1.5 px-3 opacity-80">{group.label}</div>}
                  <div className="flex flex-col gap-0.5">
                    {group.items.map((item) => {
                      const active = activePath === item.to;
                      const Icon = item.icon;
                      const iconColour = active
                        ? "text-brand-700 dark:text-brand-400"
                        : item.subject
                          ? subjectTheme(item.subject).text
                          : "text-muted-foreground";
                      return (
                        <Link
                          key={item.to}
                          href={item.to}
                          onClick={() => setMobileOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${
                            active
                              ? "bg-[color-mix(in_oklab,var(--brand-500)_10%,var(--card))] font-bold text-brand-800 dark:text-brand-300"
                              : "text-muted-foreground hover:bg-[color-mix(in_oklab,var(--muted)_70%,var(--card))] hover:text-foreground"
                          }`}
                        >
                          <Icon className={`h-4 w-4 shrink-0 ${iconColour}`} strokeWidth={active ? 2.25 : 1.75} />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-3 pt-6">
              <ExamCountdown />

              {mounted && (
                <button
                  type="button"
                  onClick={toggleTheme}
                  role="switch"
                  aria-checked={isDark}
                  aria-label="Dark mode"
                  className="flex min-h-11 items-center justify-between rounded-xl px-3 text-muted-foreground transition-colors hover:bg-[color-mix(in_oklab,var(--muted)_70%,var(--card))] hover:text-foreground"
                >
                  <span className="flex items-center gap-3">
                    {isDark ? (
                      <Moon className="h-4 w-4 shrink-0 text-brand-400" strokeWidth={1.75} />
                    ) : (
                      <Sun className="h-4 w-4 shrink-0 text-brand-600" strokeWidth={1.75} />
                    )}
                    <span className="text-sm font-medium">Dark mode</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`relative h-4.5 w-8 shrink-0 rounded-full transition-colors duration-300 ${
                      isDark ? "bg-brand-500" : "bg-muted-foreground/30"
                    }`}
                  >
                    <span
                      className={`absolute left-[2px] top-[2px] h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                        isDark ? "translate-x-3.5" : "translate-x-0"
                      }`}
                    />
                  </span>
                </button>
              )}

              {user ? (
                <div className="flex items-center justify-between gap-2 rounded-2xl border-2 border-border bg-card p-2.5">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Avatar className="h-8 w-8 shrink-0">
                      {user.photoURL && <AvatarImage src={user.photoURL} alt="" />}
                      <AvatarFallback className="bg-[color-mix(in_oklab,var(--brand-500)_15%,var(--card))] text-xs font-bold text-brand-700 dark:text-brand-400">
                        {initialsOf(user.displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="truncate text-xs font-bold text-foreground">
                        {user.displayName || "Aspirant"}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={logout}
                    aria-label="Sign out"
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-[color-mix(in_oklab,var(--destructive)_10%,var(--card))] hover:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : mounted ? (
                <button type="button" onClick={signInWithGoogle} className={`${SIGN_IN_BUTTON} w-full`}>
                  Sign in
                </button>
              ) : null}
            </div>
          </SheetContent>
        </Sheet>

        {/* Today */}
        {today && (
          <div className="hidden items-center gap-2 rounded-full border-2 border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-muted-foreground min-[440px]:flex">
            <CalendarDays className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
            {today}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link href={user ? "/dashboard" : "/"} aria-label="Home" className={`${ICON_BUTTON} md:hidden`}>
          <Home className="h-4 w-4" strokeWidth={1.75} />
        </Link>
        <button type="button" aria-label="Toggle theme" onClick={toggleTheme} className={`${ICON_BUTTON} md:hidden`}>
          {isDark ? (
            <Sun className="h-4 w-4 text-brand-400" strokeWidth={1.75} />
          ) : (
            <Moon className="h-4 w-4 text-brand-600" strokeWidth={1.75} />
          )}
        </button>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Account menu"
                className="ml-1 flex items-center justify-center rounded-full border-2 border-brand-500/40 transition-colors hover:border-brand-500"
              >
                <Avatar className="h-9 w-9">
                  {user.photoURL && <AvatarImage src={user.photoURL} alt="" />}
                  <AvatarFallback className="bg-[color-mix(in_oklab,var(--brand-500)_15%,var(--card))] text-sm font-bold text-brand-700 dark:text-brand-400">
                    {initialsOf(user.displayName)}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl border-2 border-border bg-popover p-2 shadow-xl">
              <DropdownMenuLabel className="px-3 py-2">
                <div className="truncate text-sm font-bold text-foreground">{user.displayName || "Aspirant"}</div>
                <div className="truncate text-xs font-normal text-muted-foreground">{user.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1 bg-border" />
              <DropdownMenuItem
                className="cursor-pointer rounded-xl px-3 py-2 font-medium text-destructive focus:bg-[color-mix(in_oklab,var(--destructive)_10%,var(--card))] focus:text-destructive"
                onClick={logout}
              >
                <LogOut className="mr-2.5 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : mounted && !isAuthPage ? (
          <button type="button" onClick={signInWithGoogle} className={`${SIGN_IN_BUTTON} ml-1`}>
            Sign in
          </button>
        ) : null}
      </div>
    </header>
  );
}
