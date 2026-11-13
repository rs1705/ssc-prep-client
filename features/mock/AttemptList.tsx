"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, History } from "lucide-react";
import { timeAgo } from "@/lib/activity-log";
import { cn } from "@/lib/utils";
import { reviewHref, type Attempt } from "./attempts";

/** Score as a share of the maximum, for the small bar. */
const share = (a: Attempt) => (a.maxMarks > 0 ? Math.max(0, a.marks) / a.maxMarks : 0);

interface AttemptListProps {
  attempts: Attempt[];
  title?: string;
  /** How many to show before "Show all". */
  initial?: number;
  /** Hide the test name (e.g. on a page that is already about one paper). */
  compact?: boolean;
}

/** Past tests, newest first; each opens its result and full review. */
export function AttemptList({ attempts, title = "Your attempts", initial = 5, compact = false }: AttemptListProps) {
  const [all, setAll] = useState(false);
  if (attempts.length === 0) return null;
  const shown = all ? attempts : attempts.slice(0, initial);
  const best = Math.max(...attempts.map((a) => a.marks));

  return (
    <section aria-labelledby="attempts-heading" className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 id="attempts-heading" className="flex items-center gap-2 text-lg font-extrabold text-foreground">
            <History className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {attempts.length} attempt{attempts.length === 1 ? "" : "s"} · open one to see every answer and explanation again.
          </p>
        </div>
      </div>

      <ul className="surface-card divide-y-2 divide-border overflow-hidden rounded-3xl">
        {shown.map((a) => {
          const skipped = a.sections.reduce((n, s) => n + s.ids.length, 0) - a.correct - a.wrong;
          return (
            <li key={a.id}>
              <Link href={reviewHref(a)} className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-muted/60">
                <span className="flex w-16 shrink-0 flex-col">
                  <span className="font-mono text-lg font-bold tabular-nums leading-tight text-foreground">
                    {a.marks}
                    <span className="text-xs font-semibold text-muted-foreground">/{a.maxMarks}</span>
                  </span>
                  <span className="mt-1 h-1 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                    <span className={cn("block h-full rounded-full", a.marks === best ? "bg-emerald-500" : "bg-brand-500")} style={{ width: `${share(a) * 100}%` }} />
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  {!compact && <span className="block truncate text-sm font-bold text-foreground">{a.title}</span>}
                  <span className={cn("block truncate text-muted-foreground", compact ? "text-sm" : "text-xs")}>
                    {timeAgo(a.at)} · {a.correct} right · {a.wrong} wrong · {skipped} skipped
                    {a.marks === best && attempts.length > 1 ? " · best" : ""}
                  </span>
                </span>
                <span className="hidden text-sm font-bold text-brand-700 dark:text-brand-400 sm:inline">Review</span>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ul>
      {attempts.length > initial && (
        <button type="button" onClick={() => setAll((v) => !v)} className="self-start text-sm font-semibold text-brand-700 hover:underline dark:text-brand-400">
          {all ? "Show fewer" : `Show all ${attempts.length}`}
        </button>
      )}
    </section>
  );
}
