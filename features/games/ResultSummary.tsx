"use client";

import { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

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
}: ResultSummaryProps) {
  useEffect(() => {
    if (!isNewBest) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.4 } });
  }, [isNewBest]);

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-4 overflow-y-auto pb-1 [scrollbar-width:none]">
      <div className="flex flex-col items-center gap-1 pt-1 text-center">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground">
          {kicker}
        </span>
        <h2 className="text-3xl font-black tracking-tight text-foreground">{rank}</h2>
        <div
          role="status"
          aria-live="polite"
          className="font-mono text-5xl font-black tabular-nums text-violet-700 dark:text-violet-300"
        >
          {score}
        </div>
        {isNewBest ? (
          <span className="mt-1 flex items-center gap-1.5 rounded-full border-2 border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
            New best score!
          </span>
        ) : (
          <span className="mt-1 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
            Best {best}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border-2 border-border bg-card px-2 py-3 text-center">
            <div className="font-mono text-xl font-black tabular-nums text-foreground">{s.value}</div>
            <div className="section-label mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {children}

      <div className="sticky bottom-0 mt-auto flex flex-col gap-2 bg-background pt-2 sm:flex-row">
        <Button
          type="button"
          onClick={onPlayAgain}
          autoFocus
          className="h-12 flex-1 gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-sm font-mono font-black uppercase tracking-widest text-white"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Play again
          <kbd className="hidden rounded bg-white/20 px-1.5 py-0.5 text-xs md:inline">Enter</kbd>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-12 flex-1 rounded-full text-sm font-mono font-bold uppercase tracking-wider"
        >
          <Link href="/SSC/english/games">All games</Link>
        </Button>
      </div>
    </div>
  );
}
