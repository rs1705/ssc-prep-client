"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/custom/ProtectedRoute";
import { useAuth } from "@/context/auth";
import { TodayPlanHero } from "@/features/dashboard/TodayPlanHero";
import { HeaderCountdown } from "@/features/dashboard/HeaderCountdown";
import { ContinueCard, MistakesCard, SubjectsStanding, WeekCard } from "@/features/dashboard/ActivityCards";
import { useActivityLog } from "@/lib/activity-log";
import { useUnfinished } from "@/features/games/unfinished";
import { greetingFor, quoteFor } from "@/lib/greetings";

export default function Dashboard() {
  const { user } = useAuth();
  const { activities, mistakes, ready } = useActivityLog();
  const unfinished = useUnfinished();
  const [now, setNow] = useState<number | null>(null);

  // Time-based text is set after mount so server and client markup agree.
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, [activities, mistakes]);

  const greeting = now === null ? "Welcome back" : greetingFor(new Date(now));
  const quote = now === null ? null : quoteFor(new Date(now));
  const loaded = ready && now !== null;

  return (
    <ProtectedRoute>
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 overflow-x-hidden sm:gap-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="mb-1 text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
              {greeting}, {user?.displayName?.split(" ")[0] || "Champ"}
            </h1>
            {quote ? (
              <figure className="max-w-2xl">
                <blockquote className="text-sm font-medium text-muted-foreground sm:text-base">
                  &ldquo;{quote.text}&rdquo;
                </blockquote>
                {quote.by && <figcaption className="mt-0.5 text-xs font-semibold text-muted-foreground/80">— {quote.by}</figcaption>}
              </figure>
            ) : (
              <p className="h-5" aria-hidden="true" />
            )}
          </div>
          <HeaderCountdown />
        </header>

        <TodayPlanHero />

        {loaded ? (
          <>
            <SubjectsStanding activities={activities} now={now} />
            <div className="grid gap-6 lg:grid-cols-2">
              <ContinueCard activities={activities} unfinished={unfinished} now={now} />
              <WeekCard activities={activities} now={now} />
            </div>
            <MistakesCard mistakes={mistakes} now={now} />
          </>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2" aria-hidden="true">
            <div className="surface-card h-72 rounded-3xl p-4 sm:p-6" />
            <div className="surface-card h-72 rounded-3xl p-4 sm:p-6" />
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground">
          Your progress is saved on this device for now. It will sync to your account in a later update.
        </p>
      </div>
    </ProtectedRoute>
  );
}
