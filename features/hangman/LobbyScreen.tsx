"use client";

import { Flame, Heart, Play, Timer, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LIVES, MAX_STRIKES, WORDS_PER_RUN } from "./game";
import { HangmanFigure } from "./HangmanFigure";

interface LobbyScreenProps {
  best: number;
  onStart: () => void;
}

const RULES = [
  { icon: Timer, text: `${WORDS_PER_RUN} words · about 3 minutes` },
  { icon: Heart, text: `${LIVES} hearts. Lose a word (${MAX_STRIKES} strikes or time out) and one is gone` },
  { icon: Flame, text: "Solve with no mistakes to build a score combo up to x2" },
];

export function LobbyScreen({ best, onStart }: LobbyScreenProps) {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-5 overflow-y-auto py-2 text-center [scrollbar-width:none]">
      <HangmanFigure strikes={4} className="h-[clamp(72px,16dvh,120px)] w-auto" />

      <div className="flex flex-col gap-1.5">
        <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          Hangman Sprint
        </h2>
        <p className="mx-auto max-w-xs text-sm text-muted-foreground">
          Guess SSC vocabulary and one-word substitutions from their meanings, fast.
        </p>
      </div>

      <ul className="flex w-full max-w-sm flex-col gap-2 text-left">
        {RULES.map(({ icon: Icon, text }) => (
          <li
            key={text}
            className="flex items-center gap-3 rounded-2xl border-2 border-border bg-card px-3.5 py-2.5 text-sm font-medium text-foreground"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            {text}
          </li>
        ))}
      </ul>

      {best > 0 && (
        <div className="flex items-center gap-2 rounded-full border-2 border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
          <Trophy className="h-4 w-4" aria-hidden="true" />
          Best score {best}
        </div>
      )}

      <Button
        type="button"
        onClick={onStart}
        autoFocus
        className="h-12 w-full max-w-sm gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-sm font-mono font-black uppercase tracking-widest text-white shadow-md shadow-amber-500/25"
      >
        <Play className="h-4 w-4 fill-current" aria-hidden="true" />
        Start
        <kbd className="hidden rounded bg-white/20 px-1.5 py-0.5 text-xs md:inline">Enter</kbd>
      </Button>
    </div>
  );
}
