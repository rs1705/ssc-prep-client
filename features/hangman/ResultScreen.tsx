"use client";

import { Check, X } from "lucide-react";
import { ResultSummary } from "@/features/games/ResultSummary";
import { rankTitle, type HangmanState } from "./game";

interface ResultScreenProps {
  state: HangmanState;
  best: number;
  isNewBest: boolean;
  onPlayAgain: () => void;
  onReplaySet?: () => void;
  onRetryMistakes?: () => void;
  retryCount?: number;
}

export function ResultScreen({ state, best, isNewBest, onPlayAgain, onReplaySet, onRetryMistakes, retryCount }: ResultScreenProps) {
  const solved = state.results.filter((r) => r.outcome === "solved").length;
  const accuracy =
    state.totalGuesses > 0
      ? Math.round((state.correctGuesses / state.totalGuesses) * 100)
      : 0;
  const cleared = state.lives > 0 && state.results.length === state.queue.length;


  const stats = [
    { label: "Solved", value: `${solved}/${state.queue.length}` },
    { label: "Accuracy", value: `${accuracy}%` },
    { label: "Best combo", value: `x${state.bestCombo}` },
  ];

  return (
    <ResultSummary
      kicker={cleared ? "Run complete" : "Out of hearts"}
      result={{ correct: solved, total: state.results.length }}
      mistakes={state.results
        .filter((r) => r.outcome !== "solved")
        .map((r) => ({ prompt: r.word.meaning, answer: r.word.word, detail: r.word.hindi }))}
      rank={rankTitle(state.score)}
      score={state.score}
      best={best}
      isNewBest={isNewBest}
      stats={stats}
      onPlayAgain={onPlayAgain}
      onReplaySet={onReplaySet}
      onRetryMistakes={onRetryMistakes}
      retryCount={retryCount}
      note={state.lifeBonus > 0 ? `Includes +${state.lifeBonus} for hearts left` : undefined}
      celebrate={cleared && solved === state.queue.length}
    >
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
                    ? "bg-[color-mix(in_oklab,var(--color-emerald-500)_15%,var(--card))] text-emerald-700 dark:text-emerald-400"
                    : "bg-[color-mix(in_oklab,var(--color-rose-500)_15%,var(--card))] text-rose-700 dark:text-rose-400"
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

    </ResultSummary>
  );
}
