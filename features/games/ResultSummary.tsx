"use client";

import { cn } from "@/lib/utils";
import { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { LayoutGrid, RotateCcw, Trophy } from "lucide-react";
import { DUO } from "./buttons";
import { GAME_TONE, type GameTone } from "./tone";

export interface ResultStat {
  label: string;
  value: string;
}

interface ResultSummaryProps {
  kicker: string;
  rank: string;
  score: number;
  best: number;
  isNewBest: boolean;
  stats: ResultStat[];
  /** Scrollable detail below the stats (e.g. words to review). */
  children?: React.ReactNode;
  onPlayAgain: () => void;
  tone?: GameTone;
  allHref?: string;
  allLabel?: string;
  /** Extra line under the score, e.g. a bonus. */
  note?: string;
  /** Fire confetti even without a new best (e.g. a perfect run). */
  celebrate?: boolean;
}

export function ResultSummary({
  kicker,
  rank,
  score,
  best,
  isNewBest,
  stats,
  children,
  onPlayAgain,
  tone = "english",
  allHref = "/SSC/english/games",
  allLabel = "All games",
  note,
  celebrate = false,
}: ResultSummaryProps) {
  useEffect(() => {
    if (!isNewBest && !celebrate) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.4 } });
  }, [isNewBest, celebrate]);

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-4">
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pb-1 [scrollbar-width:none]">
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="section-label">{kicker}</span>
          <h2 className="text-2xl font-extrabold text-foreground">{rank}</h2>
          <div role="status" aria-live="polite" className={`text-5xl font-extrabold tabular-nums ${GAME_TONE[tone].text}`}>
            {score}
          </div>
          {isNewBest ? (
            <span className="mt-1 flex items-center gap-1.5 rounded-full border-2 border-brand-500/40 bg-[color-mix(in_oklab,var(--brand-500)_10%,var(--card))] px-3 py-1 text-xs font-bold text-brand-700 dark:text-brand-300">
              <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
              New best score!
            </span>
          ) : (
            <span className="mt-1 text-xs font-semibold text-muted-foreground">
              Your best: <span className="tabular-nums">{best}</span>
            </span>
          )}
          {note && <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">{note}</span>}
        </div>

        <dl className="grid grid-cols-3 gap-2">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border-2 border-border bg-[color-mix(in_oklab,var(--muted)_50%,var(--card))] px-2 py-3 text-center"
            >
              <dd className="text-xl font-extrabold tabular-nums text-foreground">{s.value}</dd>
              <dt className="mt-0.5 text-xs font-semibold text-muted-foreground">{s.label}</dt>
            </div>
          ))}
        </dl>

        {children}
      </div>

      <div className="flex shrink-0 flex-col gap-2 border-t-2 border-border pt-3 sm:flex-row">
        <button type="button" onClick={onPlayAgain} autoFocus className={cn(DUO.primary, "flex-1")}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Play again
        </button>
        <Link href={allHref} className={cn(DUO.secondary, "flex-1")}>
          <LayoutGrid className="h-4 w-4" aria-hidden="true" />
          {allLabel}
        </Link>
      </div>
    </div>
  );
}
