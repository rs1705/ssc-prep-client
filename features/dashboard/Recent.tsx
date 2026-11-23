"use client";

import Link from "next/link";
import { BookOpenCheck, ClipboardCheck, Gamepad2, Layers, Zap, type LucideIcon } from "lucide-react";
import { reviewHref, type Attempt } from "@/features/mock/attempts";
import { HUE } from "@/features/pyq/topic-map";
import { timeAgo, type ActivityEntry, type ActivityKind } from "@/lib/activity-log";
import { SUBJECT_LABEL, type SubjectKey } from "@/lib/subject-theme";
import { cn } from "@/lib/utils";
import { Label, panel } from "./Home";

const KIND: Record<ActivityKind | "test", { icon: LucideIcon; word: string }> = {
  test: { icon: ClipboardCheck, word: "Test" },
  pyq: { icon: BookOpenCheck, word: "PYQs" },
  drill: { icon: Zap, word: "Drill" },
  cards: { icon: Layers, word: "Flashcards" },
  game: { icon: Gamepad2, word: "Game" },
};

interface Row {
  id: string;
  at: number;
  kind: ActivityKind | "test";
  title: string;
  subject: SubjectKey | null;
  score: string | null;
  pct: number | null;
  href: string;
  action: string;
}

const isSubject = (s: string | null): s is SubjectKey => s === "maths" || s === "reasoning" || s === "english" || s === "gk";

/** Tests taken and practice done, newest first, each one tap from doing it again. */
export function RecentPanel({ activities, attempts, now, limit = 6 }: { activities: ActivityEntry[]; attempts: Attempt[]; now: number; limit?: number }) {
  const rows: Row[] = [
    ...attempts.map((a) => ({
      id: `t-${a.id}`,
      at: a.at,
      kind: "test" as const,
      title: a.title,
      subject: isSubject(a.subject) ? a.subject : null,
      score: `${a.marks}/${a.maxMarks}`,
      pct: a.maxMarks ? a.marks / a.maxMarks : null,
      href: reviewHref(a),
      action: "Review",
    })),
    // A test also logs an activity; keep only practice here.
    ...activities
      .filter((e) => !e.href.startsWith("/mock-tests"))
      .map((e) => ({
        id: e.id,
        at: e.at,
        kind: e.kind,
        title: e.label,
        subject: e.subject,
        score: typeof e.total === "number" && typeof e.correct === "number" ? `${e.correct}/${e.total}` : null,
        pct: e.total ? (e.correct ?? 0) / e.total : null,
        href: e.href,
        action: "Again",
      })),
  ]
    .sort((x, y) => y.at - x.at)
    .slice(0, limit);

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
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">Tests and practice you do will show up here.</p>
      ) : (
        <ul className="mt-2 divide-y divide-border/70">
          {rows.map((r) => {
            const { icon: Icon, word } = KIND[r.kind];
            return (
              <li key={r.id} className="flex items-center gap-3 py-3">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground"
                  style={r.subject ? { color: HUE[r.subject], background: `color-mix(in oklab, ${HUE[r.subject]} 12%, transparent)` } : undefined}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-foreground">{r.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {word}
                    {r.subject && ` · ${SUBJECT_LABEL[r.subject]}`} · {timeAgo(r.at, now)}
                  </span>
                </span>
                {r.score && (
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-xs font-bold tabular-nums",
                      r.pct === null ? "bg-muted text-muted-foreground" : r.pct >= 0.75 ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300" : r.pct >= 0.5 ? "bg-amber-500/12 text-amber-700 dark:text-amber-300" : "bg-rose-500/12 text-rose-700 dark:text-rose-300",
                    )}
                  >
                    {r.score}
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
