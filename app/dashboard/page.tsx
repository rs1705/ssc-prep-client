"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/custom/ProtectedRoute";
import { useAuth } from "@/context/auth";
import { FocusPanel, Hero, QuickActions, SubjectsPanel } from "@/features/dashboard/Home";
import { PracticeCalendar } from "@/features/dashboard/PracticeCalendar";
import { QuickQuestion } from "@/features/dashboard/Interactive";
import { RecentPanel } from "@/features/dashboard/Recent";
import { useAttempts } from "@/features/mock/attempts";
import { useUnfinished } from "@/features/games/unfinished";
import { useProgressMap } from "@/features/pyq/topic-map";
import { useActivityLog, weekStats } from "@/lib/activity-log";
import { greetingFor } from "@/lib/greetings";

/**
 * The dashboard. Hero with the one main action; below it a main column for doing (a quick question, topics
 * worth your time) and a side rail for checking (mistakes, subjects, the week).
 */
export default function Dashboard() {
  const { user } = useAuth();
  const { activities } = useActivityLog();
  const unfinished = useUnfinished();
  const { attempts } = useAttempts();
  const { trees, leaves, share } = useProgressMap(false);
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), [activities]);

  const greeting = now ? greetingFor(new Date(now)) : "Welcome back";
  const name = user?.displayName?.split(" ")[0] || "Aspirant";

  return (
    <ProtectedRoute>
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <Hero name={name} greeting={greeting} unfinished={unfinished} week={now ? weekStats(activities, new Date(now)).activeDays : Array(7).fill(false)} />
      <QuickActions />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-6">
          <QuickQuestion />
          {now && <FocusPanel leaves={leaves} now={now} />}
          {now && <RecentPanel activities={activities} attempts={attempts} now={now} />}
        </div>
        <aside className="flex flex-col gap-6" aria-label="Your progress">
          {now && <SubjectsPanel activities={activities} now={now} trees={trees} share={share} />}
          {now && <PracticeCalendar activities={activities} now={now} />}
        </aside>
      </div>
    </div>
    </ProtectedRoute>
  );
}
