"use client";

import Link from "next/link";
import { BookOpenCheck, ClipboardCheck, Gamepad2, Layers, Sparkles, Zap, type LucideIcon } from "lucide-react";
import { reviewHref, type Attempt } from "@/features/mock/attempts";
import { HUE } from "@/features/pyq/topic-map";
import { dayKey } from "@/lib/today-plan";
import { timeAgo, type ActivityEntry, type ActivityKind } from "@/lib/activity-log";
import { SUBJECT_LABEL, type SubjectKey } from "@/lib/subject-theme";
import { cn } from "@/lib/utils";
import { Label, panel } from "./Home";

type Kind = ActivityKind | "test" | "quick";

const KIND: Record<Kind, { icon: LucideIcon; word: string; tone: string }> = {
  test: { icon: ClipboardCheck, word: "Mock test", tone: "bg-indigo-500/12 text-indigo-700 dark:text-indigo-300" },
  pyq: { icon: BookOpenCheck, word: "PYQs", tone: "bg-brand-500/12 text-brand-700 dark:text-brand-300" },
  quick: { icon: Sparkles, word: "Quick questions", tone: "bg-amber-500/12 text-amber-700 dark:text-amber-300" },
  drill: { icon: Zap, word: "Speed drill", tone: "bg-sky-500/12 text-sky-700 dark:text-sky-300" },
  cards: { icon: Layers, word: "Flashcards", tone: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300" },
  game: { icon: Gamepad2, word: "Game", tone: "bg-pink-500/12 text-pink-700 dark:text-pink-300" },
};

interface Row {
  id: string;
  at: number;
  kind: Kind;
  title: string;
  subjects: SubjectKey[];
  correct: number | null;
  total: number | null;
  href: string;
  action: string;
}

const isSubject = (s: string | null): s is SubjectKey => s === "maths" || s === "reasoning" || s === "english" || s === "gk";
const QUICK = "Quick question";

/** Tests taken and practice done, newest first, each one tap from doing it again. */
export function RecentPanel({ activities, attempts, now, limit = 6 }: { activities: ActivityEntry[]; attempts: Attempt[]; now: number; limit?: number }) {
  const rows: Row[] = [];
  for (const a of attempts)
    rows.push({
      id: `t-${a.id}`,
      at: a.at,
      kind: "test",
      title: a.title,
      subjects: isSubject(a.subject) ? [a.subject] : [],
      correct: a.marks,
      total: a.maxMarks,
      href: reviewHref(a),
      action: "Review",
    });

  // Quick questions answered on the same day become one row; tests also log an activity,
  // so those are left to the attempt above.
  const quick = new Map<string, Row>();
  for (const e of activities) {
    if (e.href.startsWith("/mock-tests")) continue;
    if (e.label === QUICK) {
      const day = dayKey(new Date(e.at));
      const row = quick.get(day);
      if (row) {
        row.at = Math.max(row.at, e.at);
        if (!row.subjects.includes(e.subject)) row.subjects.push(e.subject);
        row.correct = (row.correct ?? 0) + (e.correct ?? 0);
        row.total = (row.total ?? 0) + (e.total ?? 0);
      } else {
        const r: Row = { id: `quick-${day}`, at: e.at, kind: "quick", title: "", subjects: [e.subject], correct: e.correct ?? 0, total: e.total ?? 0, href: "/dashboard", action: "More" };
        quick.set(day, r);
        rows.push(r);
      }
      continue;
    }
    rows.push({
      id: e.id,
      at: e.at,
      kind: e.kind,
      title: e.label,
      subjects: [e.subject],
      correct: typeof e.correct === "number" ? e.correct : null,
      total: typeof e.total === "number" ? e.total : null,
      href: e.href,
      action: "Again",
    });
  }
  for (const r of quick.values()) r.title = `${r.total} quick question${r.total === 1 ? "" : "s"}`;
  const shown = rows.sort((x, y) => y.at - x.at).slice(0, limit);

  return (
    <section aria-labelledby="recent-heading" className={cn(panel, "p-5 sm:p-6")}>
      <div className="flex items-baseline justify-between gap-2">
        <Label>
          <span id="recent-heading">Recently attempted</span>
        </Label>
        <Link href="/analytics" className="text-xs font-semibold text-muted-foreground hover:text-foreground">
          See all
        </Link>
      </div>
      {shown.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">Tests and practice you do will show up here.</p>
      ) : (
        <ul className="mt-2 divide-y divide-border/70">
          {shown.map((r) => {
            const { icon: Icon, word, tone } = KIND[r.kind];
            const pct = r.total ? (r.correct ?? 0) / r.total : null;
            const lead = r.subjects.length === 1 ? r.subjects[0] : null;
            return (
              <li key={r.id} className="flex items-center gap-3 py-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground"
                  style={lead ? { color: HUE[lead], background: `color-mix(in oklab, ${HUE[lead]} 14%, transparent)` } : undefined}
                >
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-foreground">{r.title}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className={cn("rounded-md px-1.5 py-0.5 text-[11px] font-bold", tone)}>{word}</span>
                    {r.subjects.map((s) => (
                      <span key={s} className="inline-flex items-center gap-1 rounded-md bg-muted/70 px-1.5 py-0.5 text-[11px] font-semibold text-foreground/80">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: HUE[s] }} aria-hidden="true" />
                        {s === "gk" ? "GK" : SUBJECT_LABEL[s]}
                      </span>
                    ))}
                    <span className="text-[11px] text-muted-foreground">{timeAgo(r.at, now)}</span>
                  </span>
                </span>
                {r.total !== null && r.total > 0 && (
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-xs font-bold tabular-nums",
                      pct === null ? "bg-muted text-muted-foreground" : pct >= 0.75 ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300" : pct >= 0.5 ? "bg-amber-500/12 text-amber-700 dark:text-amber-300" : "bg-rose-500/12 text-rose-700 dark:text-rose-300",
                    )}
                  >
                    {r.correct}/{r.total}
                  </span>
                )}
                <Link href={r.href} className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  {r.action}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
