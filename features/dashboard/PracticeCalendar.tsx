"use client";

import { useMemo, useState } from "react";
import type { ActivityEntry } from "@/lib/activity-log";
import { cn } from "@/lib/utils";
import { CountUp } from "./Interactive";
import { Label, panel } from "./Home";

/**
 * The last 12 weeks as a grid of days (Monday at the top), darker the more you practised.
 * Above it, this week's numbers. Tap a day to see what you did.
 */

const DAY = 86_400_000;
const WEEKS = 12;

const LEVEL = ["bg-muted", "bg-brand-500/25", "bg-brand-500/50", "bg-brand-500/75", "bg-brand-500"];
const level = (q: number) => (q === 0 ? 0 : q < 5 ? 1 : q < 15 ? 2 : q < 30 ? 3 : 4);

export function PracticeCalendar({ activities, now }: { activities: ActivityEntry[]; now: number }) {
  const [picked, setPicked] = useState<number | null>(null);

  const { cells, thisWeek, daysPractised, months } = useMemo(() => {
    const today = new Date(new Date(now).toDateString()).getTime();
    const monday = today - ((new Date(today).getDay() + 6) % 7) * DAY;
    const start = monday - (WEEKS - 1) * 7 * DAY;
    const byDay = new Map<number, { q: number; right: number; sessions: number }>();
    for (const a of activities) {
      if (a.at < start || a.at > now) continue;
      const d = new Date(new Date(a.at).toDateString()).getTime();
      const e = byDay.get(d) ?? { q: 0, right: 0, sessions: 0 };
      e.q += a.total ?? 1;
      e.right += a.correct ?? 0;
      e.sessions += 1;
      byDay.set(d, e);
    }
    const cells = Array.from({ length: WEEKS * 7 }, (_, i) => {
      const week = Math.floor(i / 7);
      const dow = i % 7;
      const at = start + (week * 7 + dow) * DAY;
      return { at, future: at > today, ...(byDay.get(at) ?? { q: 0, right: 0, sessions: 0 }) };
    });
    const week = cells.slice(-7);
    const thisWeek = { q: week.reduce((n, c) => n + c.q, 0), right: week.reduce((n, c) => n + c.right, 0) };
    // Month labels above the first week that starts in a new month.
    const months: { col: number; name: string }[] = [];
    for (let w = 0; w < WEEKS; w++) {
      const d = new Date(start + w * 7 * DAY);
      const prev = w === 0 ? null : new Date(start + (w - 1) * 7 * DAY);
      if (!prev || prev.getMonth() !== d.getMonth()) months.push({ col: w, name: d.toLocaleDateString(undefined, { month: "short" }) });
    }
    return { cells, thisWeek, daysPractised: cells.filter((c) => c.sessions > 0).length, months };
  }, [activities, now]);

  const sel = picked === null ? null : cells.find((c) => c.at === picked);

  return (
    <section aria-labelledby="calendar-heading" className={cn(panel, "p-5")}>
      <div className="flex items-baseline justify-between gap-2">
        <Label>
          <span id="calendar-heading">Practice</span>
        </Label>
        <span className="text-xs text-muted-foreground">
          <span className="font-bold text-foreground">{daysPractised}</span> {daysPractised === 1 ? "day" : "days"} in 12 weeks
        </span>
      </div>

      <div className="mt-3 flex gap-5">
        <div>
          <CountUp value={thisWeek.q} className="block text-2xl font-extrabold text-foreground" />
          <p className="text-xs text-muted-foreground">questions this week</p>
        </div>
        <div>
          <p className="text-2xl font-extrabold tabular-nums text-foreground">{thisWeek.q ? `${Math.round((thisWeek.right / thisWeek.q) * 100)}%` : "–"}</p>
          <p className="text-xs text-muted-foreground">right</p>
        </div>
      </div>

      <div className="mt-4">
        {/* month names */}
        <div className="relative ml-4 h-4 text-[10px] font-semibold text-muted-foreground">
          {months.map((m) => (
            <span key={m.col} className="absolute" style={{ left: `${(m.col / WEEKS) * 100}%` }}>
              {m.name}
            </span>
          ))}
        </div>
        <div className="flex gap-1.5">
          <div className="grid grid-rows-7 gap-[3px] text-[9px] font-semibold leading-none text-muted-foreground" aria-hidden="true">
            {["M", "", "W", "", "F", "", ""].map((d, i) => (
              <span key={i} className="flex h-full items-center">
                {d}
              </span>
            ))}
          </div>
          <div className="grid flex-1 grid-flow-col grid-rows-7 gap-[3px]" role="grid" aria-label="Practice over the last 12 weeks">
            {cells.map((c) => (
              <button
                key={c.at}
                type="button"
                disabled={c.future}
                onClick={() => setPicked(picked === c.at ? null : c.at)}
                title={`${new Date(c.at).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}: ${c.q ? `${c.q} questions` : "no practice"}`}
                className={cn(
                  "aspect-square w-full rounded-[3px] transition-transform",
                  c.future ? "bg-transparent" : LEVEL[level(c.q)],
                  !c.future && "hover:scale-125",
                  picked === c.at && "ring-2 ring-foreground ring-offset-1 ring-offset-card",
                )}
              >
                <span className="sr-only">{new Date(c.at).toDateString()}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="min-h-4">
            {sel
              ? `${new Date(sel.at).toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "short" })}: ${sel.q ? `${sel.q} questions in ${sel.sessions} session${sel.sessions === 1 ? "" : "s"}${sel.q ? `, ${Math.round((sel.right / sel.q) * 100)}% right` : ""}` : "no practice"}`
              : "Tap a day to see it"}
          </span>
          <span className="flex items-center gap-1">
            Less
            {LEVEL.map((l) => (
              <span key={l} className={cn("h-2.5 w-2.5 rounded-[2px]", l)} />
            ))}
            More
          </span>
        </div>
      </div>
    </section>
  );
}
