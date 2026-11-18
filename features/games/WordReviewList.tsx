"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ReviewWord {
  key: string;
  word: string;
  correct: boolean;
  meaning?: string;
  hindi?: string;
  /** A short extra line, e.g. "You chose: Seperate". */
  note?: string;
}

type Filter = "all" | "missed" | "right";

/**
 * Every word from the run at a glance: right ones and missed ones, each with its
 * English and Hindi meaning. Chips filter the list to just the missed or right words.
 */
export function WordReviewList({ words, title = "Words this run" }: { words: ReviewWord[]; title?: string }) {
  const missed = words.filter((w) => !w.correct).length;
  const right = words.length - missed;
  const [filter, setFilter] = useState<Filter>("all");
  if (words.length === 0) return null;
  const shown = words.filter((w) => (filter === "all" ? true : filter === "missed" ? !w.correct : w.correct));
  const chips: [Filter, string, number][] = [
    ["all", "All", words.length],
    ["missed", "Missed", missed],
    ["right", "Right", right],
  ];

  return (
    <section aria-label={title} className="flex flex-col gap-2.5">
      <div className="flex flex-col gap-2">
        <h3 className="section-label">{title}</h3>
        <div role="group" aria-label="Show" className="flex gap-1.5">
          {chips.map(([id, label, count]) => (
            <button
              key={id}
              type="button"
              aria-pressed={filter === id}
              disabled={count === 0 && id !== "all"}
              onClick={() => setFilter(id)}
              className={cn(
                "min-h-9 whitespace-nowrap rounded-full border-2 px-3 text-xs font-bold tabular-nums transition-colors disabled:opacity-40",
                filter === id
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {label} {count}
            </button>
          ))}
        </div>
      </div>

      <ul className="flex flex-col divide-y-2 divide-border overflow-hidden rounded-2xl border-2 border-border bg-card">
        {shown.map((w) => (
          <li key={w.key} className="flex items-start gap-3 px-3 py-2.5">
            <span
              className={cn(
                "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white",
                w.correct ? "bg-emerald-500" : "bg-rose-500",
              )}
              aria-label={w.correct ? "Right" : "Missed"}
            >
              {w.correct ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <X className="h-3.5 w-3.5" strokeWidth={3} />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-[15px] font-extrabold text-foreground">{w.word}</span>
                {w.hindi && <span className="text-sm font-semibold text-muted-foreground">{w.hindi}</span>}
              </div>
              {w.meaning && <p className="mt-0.5 text-sm leading-snug text-muted-foreground">{w.meaning}</p>}
              {w.note && <p className="mt-0.5 text-xs font-semibold text-rose-700 dark:text-rose-300">{w.note}</p>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
