"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth";
import { HeaderCountdown } from "@/features/dashboard/HeaderCountdown";
import { FocusCard, ResumeCard, ReviewCard, SubjectsRow, TodayCard, WeekStatsCard } from "@/features/dashboard/Home";
import { QuickQuestion } from "@/features/dashboard/Interactive";
import { useUnfinished } from "@/features/games/unfinished";
import { useProgressMap } from "@/features/pyq/topic-map";
import { useActivityLog, weekStats } from "@/lib/activity-log";
import { greetingFor } from "@/lib/greetings";

/** PROTOTYPE of the new dashboard (open without signing in, for review). */
export default function DashboardPrototype() {
  const { user } = useAuth();
  const { activities, mistakes, ready } = useActivityLog();
  const unfinished = useUnfinished();
  const { trees, leaves, share } = useProgressMap(false);
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), [activities]);

  const date = now ? new Date(now) : null;
  const week = date ? weekStats(activities, date).activeDays : Array(7).fill(false);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">
            {date ? date.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" }) : " "}
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            {date ? greetingFor(date) : "Welcome back"}, {user?.displayName?.split(" ")[0] || "there"}
          </h1>
        </div>
        <HeaderCountdown />
      </header>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="flex flex-col gap-5 lg:col-span-2">
          <TodayCard week={week} />
          <QuickQuestion />
        </div>
        <div className="flex flex-col gap-5">
          <ReviewCard mistakes={mistakes} />
          {ready && now && <ResumeCard unfinished={unfinished} activities={activities} now={now} />}
          {now && <WeekStatsCard activities={activities} now={now} />}
        </div>
        {now && <SubjectsRow activities={activities} now={now} trees={trees} share={share} leaves={leaves} />}
        {now && <FocusCard leaves={leaves} now={now} />}
      </div>
    </div>
  );
}
