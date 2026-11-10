"use client";

import { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Check, RotateCcw, Trophy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { rankTitle, type HangmanState } from "./game";

interface ResultScreenProps {
  state: HangmanState;
  best: number;
  isNewBest: boolean;
  onPlayAgain: () => void;
}

export function ResultScreen({ state, best, isNewBest, onPlayAgain }: ResultScreenProps) {
  const solved = state.results.filter((r) => r.outcome === "solved").length;
  const accuracy =
    state.totalGuesses > 0
      ? Math.round((state.correctGuesses / state.totalGuesses) * 100)
      : 0;
  const cleared = state.lives > 0 && state.results.length === state.queue.length;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !(isNewBest || (cleared && solved === state.queue.length))) return;
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.4 } });
  }, [isNewBest, cleared, solved, state.queue.length]);

  const stats = [
    { label: "Solved", value: `${solved}/${state.queue.length}` },
    { label: "Accuracy", value: `${accuracy}%` },
    { label: "Best combo", value: `x${state.bestCombo}` },
  ];

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-4 overflow-y-auto pb-1 [scrollbar-width:none]">
      <div className="flex flex-col items-center gap-1 pt-1 text-center">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground">
          {cleared ? "Run complete" : "Out of hearts"}
        </span>
        <h2 className="text-3xl font-black tracking-tight text-foreground">
          {rankTitle(state.score)}
        </h2>
        <div
          role="status"
          aria-live="polite"
          className="font-mono text-5xl font-black tabular-nums text-fuchsia-800 dark:text-fuchsia-300"
        >
          {state.score}
        </div>
        {isNewBest ? (
          <span className="mt-1 flex items-center gap-1.5 rounded-full border-2 border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
            <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
            New best score!
          </span>
        ) : (
          <span className="mt-1 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
            Best {best}
          </span>
        )}
        {state.lifeBonus > 0 && (
          <span className="text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400">
            Includes +{state.lifeBonus} for hearts left
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border-2 border-border bg-card px-2 py-3 text-center"
          >
            <div className="font-mono text-xl font-black tabular-nums text-foreground">
              {s.value}
            </div>
            <div className="section-label mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="section-label">Words this run</h3>
        <ul className="flex flex-col gap-1.5">
          {state.results.map((r) => (
            <li
              key={r.word.word}
              className="flex items-start gap-3 rounded-2xl border-2 border-border bg-card px-3 py-2.5"
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                  r.outcome === "solved"
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                    : "bg-rose-500/15 text-rose-700 dark:text-rose-400"
                }`}
              >
                {r.outcome === "solved" ? (
                  <Check className="h-3 w-3" aria-label="Solved" />
                ) : (
                  <X className="h-3 w-3" aria-label="Missed" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-mono text-sm font-black text-foreground">
                    {r.word.word}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {r.word.hindi}
                  </span>
                </div>
                <p className="text-xs leading-snug text-muted-foreground">{r.word.meaning}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="sticky bottom-0 mt-auto flex flex-col gap-2 bg-background pt-2 sm:flex-row">
        <Button
          type="button"
          onClick={onPlayAgain}
          autoFocus
          className="h-12 flex-1 gap-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-alt-500 text-sm font-mono font-black uppercase tracking-widest text-white"
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
