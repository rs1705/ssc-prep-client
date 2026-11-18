"use client";

import { cn } from "@/lib/utils";
import { DUO } from "@/features/games/buttons";
import { AnswerSheet } from "@/features/games/AnswerSheet";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Clock, Flame, Heart, Lightbulb } from "lucide-react";
import { ProgressBar } from "@/components/custom/ProgressBar";
import { Button } from "@/components/ui/button";
import type { HangmanWord } from "@/lib/hangman-words";
import {
  HINT_COST,
  LIVES,
  MAX_STRIKES,
  comboMultiplier,
  type HangmanState,
} from "./game";
import { HangmanFigure } from "./HangmanFigure";
import { LetterKeyboard } from "./LetterKeyboard";
import { WordTiles } from "./WordTiles";

interface HangmanBoardProps {
  state: HangmanState;
  word: HangmanWord;
  onGuess: (letter: string) => void;
  onHint: () => void;
  onNext: () => void;
}

export function HangmanBoard({ state, word, onGuess, onHint, onNext }: HangmanBoardProps) {
  const reduceMotion = useReducedMotion();
  const revealing = state.phase === "reveal";
  const result = state.lastResult;
  const hiddenLetters = word.word
    .split("")
    .filter((letter) => !state.guessed.includes(letter)).length;
  const canHint = !revealing && state.hintsLeft > 0 && hiddenLetters >= 2;
  const isFinal = state.index + 1 >= state.queue.length || state.lives <= 0;

  // Short buzz on a wrong guess (phones that support it).
  const lastWrong = useRef(0);
  useEffect(() => {
    if (state.wrong > lastWrong.current && "vibrate" in navigator) {
      navigator.vibrate?.(40);
    }
    lastWrong.current = state.wrong;
  }, [state.wrong]);

  const timeRatio = state.timeTotal > 0 ? state.timeLeft / state.timeTotal : 1;
  const timerClass =
    timeRatio <= 0.2
      ? "from-rose-500 to-red-600 motion-safe:animate-pulse"
      : timeRatio <= 0.4
        ? "from-brand-alt-500 to-brand-500"
        : "from-fuchsia-500 to-pink-500";

  return (
    <section
      aria-label="Hangman game"
      className="flex min-h-0 w-full flex-1 flex-col gap-2.5 overflow-y-auto pb-1 [scrollbar-width:none] sm:gap-3.5 [@media(max-height:700px)]:gap-2 [@media(max-height:600px)]:gap-1.5 [@media(max-height:480px)_and_(min-width:560px)]:grid [@media(max-height:480px)_and_(min-width:560px)]:grid-cols-2 [@media(max-height:480px)_and_(min-width:560px)]:content-start [@media(max-height:480px)_and_(min-width:560px)]:gap-x-4 [@media(max-height:480px)_and_(min-width:560px)]:gap-y-1.5"
    >
      {/* Status row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1" aria-label={`${state.lives} of ${LIVES} lives left`} role="img">
          {Array.from({ length: LIVES }).map((_, i) => (
            <Heart
              key={i}
              aria-hidden="true"
              className={`h-5 w-5 transition-all sm:h-6 sm:w-6 ${
                i < state.lives
                  ? "fill-rose-500 text-rose-500"
                  : "text-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        {state.combo >= 1 && (
          <motion.div
            key={state.combo}
            initial={reduceMotion ? false : { scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1 rounded-full border-2 border-brand-500/30 bg-[color-mix(in_oklab,var(--brand-500)_10%,var(--card))] px-2.5 py-1 text-xs font-mono font-black text-brand-700 dark:text-brand-400"
            aria-label={`Combo ${state.combo}, score multiplier ${comboMultiplier(state.combo)}`}
          >
            <Flame className="h-3.5 w-3.5" aria-hidden="true" />
            x{comboMultiplier(state.combo).toFixed(2).replace(/0$/, "")}
          </motion.div>
        )}

        <div className="flex items-baseline gap-1.5">
          <span className="section-label">Score</span>
          <motion.span
            key={state.score}
            initial={reduceMotion ? false : { y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-mono text-lg font-black tabular-nums text-fuchsia-800 dark:text-fuchsia-300"
          >
            {state.score}
          </motion.span>
        </div>
      </div>

      {/* Progress pips */}
      <ol className="flex w-full gap-1" aria-label={`Word ${state.index + 1} of ${state.queue.length}`}>
        {state.queue.map((_, i) => {
          const r = state.results[i];
          return (
            <li
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                r
                  ? r.outcome === "solved"
                    ? "bg-emerald-500"
                    : "bg-rose-500"
                  : i === state.index
                    ? "bg-brand-500"
                    : "bg-muted"
              }`}
            />
          );
        })}
      </ol>

      {/* Timer */}
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <ProgressBar
          value={timeRatio * 100}
          label="Time left for this word"
          className="h-2.5 flex-1 p-0"
          barClassName={`bg-gradient-to-r ${timerClass} transition-[width] duration-1000 ease-linear`}
        />
        <span className="w-9 text-right font-mono text-xs font-black tabular-nums text-muted-foreground">
          {state.timeLeft}s
        </span>
      </div>

      {/* Stage */}
      <motion.div
        key={`stage-${state.wrong}`}
        animate={reduceMotion || state.wrong === 0 ? undefined : { x: [0, -7, 7, -4, 4, 0] }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-2.5 sm:gap-4 [@media(max-height:600px)]:gap-1.5"
      >
        <HangmanFigure
          strikes={state.wrong}
          className="h-[clamp(48px,11dvh,128px)] w-auto [@media(max-height:480px)_and_(min-width:560px)]:hidden"
        />
        <WordTiles word={word.word} guessed={state.guessed} revealAll={revealing} />
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground [@media(max-height:700px)]:hidden">
          {state.wrong} / {MAX_STRIKES} strikes
        </p>
      </motion.div>

      {/* Clue */}
      <div className="flex items-start gap-3 rounded-2xl border-2 border-fuchsia-500/25 bg-card p-3 sm:p-4 [@media(max-height:600px)]:p-2.5">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full border-2 border-fuchsia-500/25 bg-[color-mix(in_oklab,var(--color-fuchsia-500)_10%,var(--card))] px-2 py-0.5 text-xs font-mono font-bold uppercase text-fuchsia-800 dark:text-fuchsia-300">
              {word.category}
            </span>
            <span className="text-xs font-mono font-bold uppercase text-muted-foreground">
              {word.word.length} letters
            </span>
          </div>
          <p className="text-sm font-semibold leading-snug text-foreground sm:text-base">
            {word.meaning}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canHint}
          onClick={onHint}
          aria-label={`Reveal a letter, costs ${HINT_COST} points, ${state.hintsLeft} left`}
          className={cn(DUO.secondary, "h-12 shrink-0 flex-col gap-0 px-3 normal-case")}
        >
          <Lightbulb className="h-4 w-4 text-brand-600 dark:text-brand-400" aria-hidden="true" />
          <span className="font-mono tabular-nums">{state.hintsLeft}</span>
        </Button>
      </div>

      {/* Keyboard, with the result card laid over it between words */}
      <div className="relative mt-auto grid [@media(max-height:480px)_and_(min-width:560px)]:col-start-2 [@media(max-height:480px)_and_(min-width:560px)]:row-start-1 [@media(max-height:480px)_and_(min-width:560px)]:row-span-6 [@media(max-height:480px)_and_(min-width:560px)]:self-center [@media(max-height:480px)_and_(min-width:560px)]:mt-0">
        <div
          className={`col-start-1 row-start-1 transition-opacity duration-150 ${
            revealing ? "pointer-events-none invisible" : ""
          }`}
          aria-hidden={revealing}
        >
          <LetterKeyboard
            word={word.word}
            guessed={state.guessed}
            disabled={revealing}
            onGuess={onGuess}
          />
        </div>

        {revealing && result && (
          <div key={`reveal-${state.index}`} className="col-start-1 row-start-1 flex flex-col justify-end">
            <AnswerSheet
              bleed={false}
              correct={result.outcome === "solved"}
              verdict={
                result.outcome === "solved"
                  ? `${result.perfect ? "Perfect!" : "Solved!"} +${result.gained}`
                  : result.outcome === "timeout"
                    ? "Time's up"
                    : "Out of strikes"
              }
              detail={
                <>
                  <span className="font-mono text-base font-black tracking-wide">{result.word.word}</span>
                  <span className="font-semibold text-muted-foreground"> · {result.word.hindi}</span>
                  <span className="mt-0.5 block text-muted-foreground">{result.word.meaning}</span>
                </>
              }
              continueLabel={isFinal ? "See results" : "Next word"}
              onContinue={onNext}
            />
          </div>
        )}
      </div>
    </section>
  );
}
