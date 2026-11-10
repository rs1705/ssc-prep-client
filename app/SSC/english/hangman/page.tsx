"use client";

import Link from "next/link";
import { ChevronLeft, Trophy } from "lucide-react";
import { HangmanBoard } from "@/features/hangman/HangmanBoard";
import { LobbyScreen } from "@/features/hangman/LobbyScreen";
import { ResultScreen } from "@/features/hangman/ResultScreen";
import { useHangmanGame } from "@/features/hangman/useHangmanGame";

export default function HangmanPage() {
  const { state, word, best, isNewBest, start, guess, hint, next } = useHangmanGame();

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-xl flex-1 flex-col gap-3">
      <header className="flex shrink-0 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/SSC/english/games"
            aria-label="Back to all games"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
          <div className="min-w-0 leading-tight">
            <h1 className="truncate text-sm font-extrabold uppercase tracking-wider text-foreground sm:text-base">
              Hangman Sprint
            </h1>
            <p className="truncate text-xs font-mono font-semibold text-fuchsia-800 dark:text-fuchsia-300">
              SSC vocabulary &amp; one-word substitutions
            </p>
          </div>
        </div>

        {best > 0 && state.phase !== "lobby" && (
          <div
            className="flex shrink-0 items-center gap-1.5 rounded-full border-2 border-border bg-card px-2.5 py-1 text-xs font-mono font-bold text-muted-foreground"
            title="Your best score"
          >
            <Trophy className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
            {best}
          </div>
        )}
      </header>

      {state.phase === "lobby" && <LobbyScreen best={best} onStart={start} />}

      {(state.phase === "playing" || state.phase === "reveal") && word && (
        <HangmanBoard
          state={state}
          word={word}
          onGuess={guess}
          onHint={hint}
          onNext={next}
        />
      )}

      {state.phase === "over" && (
        <ResultScreen
          state={state}
          best={best}
          isNewBest={isNewBest}
          onPlayAgain={start}
        />
      )}
    </div>
  );
}
