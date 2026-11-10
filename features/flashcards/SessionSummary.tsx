"use client";

import Link from "next/link";
import { PartyPopper, RotateCcw, Shuffle } from "lucide-react";

interface Stat {
  label: string;
  value: number;
  className: string;
}

interface SessionSummaryProps {
  title: string;
  subtitle: string;
  stats: Stat[];
  /** Primary action, e.g. "Review the ones I'm still learning". */
  primary?: { label: string; onClick: () => void };
  onRestart?: () => void;
  onShuffle?: () => void;
}

export function SessionSummary({ title, subtitle, stats, primary, onRestart, onShuffle }: SessionSummaryProps) {
  return (
    <div className="surface-card flex w-full flex-col items-center gap-5 rounded-3xl px-5 py-8 text-center sm:px-8">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300">
        <PartyPopper className="h-7 w-7" aria-hidden="true" />
      </div>
      <div>
        <h2 className="text-xl font-extrabold text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <dl className={`grid w-full gap-2 ${stats.length > 2 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2"}`}>
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border-2 border-border bg-muted/50 px-3 py-3">
            <dd className={`text-2xl font-extrabold tabular-nums ${stat.className}`}>{stat.value}</dd>
            <dt className="text-xs font-semibold text-muted-foreground">{stat.label}</dt>
          </div>
        ))}
      </dl>

      <div className="flex w-full flex-col gap-2">
        {primary && (
          <button
            type="button"
            onClick={primary.onClick}
            className="min-h-11 rounded-xl bg-brand-600 px-4 text-sm font-bold text-on-brand shadow-md shadow-brand-600/25 hover:bg-brand-700"
          >
            {primary.label}
          </button>
        )}
        <div className="flex gap-2">
          {onRestart && (
            <button
              type="button"
              onClick={onRestart}
              className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-border bg-card text-sm font-bold text-foreground hover:bg-muted"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Start again
            </button>
          )}
          {onShuffle && (
            <button
              type="button"
              onClick={onShuffle}
              className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-border bg-card text-sm font-bold text-foreground hover:bg-muted"
            >
              <Shuffle className="h-4 w-4" aria-hidden="true" /> Shuffle
            </button>
          )}
        </div>
        <Link
          href="/SSC/english/flashcards"
          className="py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          Back to flashcards
        </Link>
      </div>
    </div>
  );
}
