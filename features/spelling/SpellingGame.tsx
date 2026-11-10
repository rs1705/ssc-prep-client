"use client";

import { useCallback, useEffect, useReducer } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Clock, Flame, SpellCheck, Timer, X, Zap } from "lucide-react";
import { ProgressBar } from "@/components/custom/ProgressBar";
import { SPELLING_WORDS } from "@/lib/spelling-words";
import { GameFrame } from "@/features/games/GameFrame";
import { GameLobby } from "@/features/games/GameLobby";
import { ResultSummary } from "@/features/games/ResultSummary";
import { useBestScore } from "@/features/games/useBestScore";
import {
  FEEDBACK_MS,
  ROUND_SECONDS,
  WRONG_PENALTY_SECONDS,
  buildQueue,
  initialState,
  rankTitle,
  spellingReducer,
  streakMultiplier,
} from "./game";

export function SpellingGame() {
  const [state, dispatch] = useReducer(spellingReducer, initialState);
  const { best, isNewBest, submit, clearNewBest } = useBestScore("ssc:spelling:best");
  const reduceMotion = useReducedMotion();
  const question = state.queue[state.index];

  const start = useCallback(() => {
    clearNewBest();
    dispatch({ type: "START", queue: buildQueue(SPELLING_WORDS) });
  }, [clearNewBest]);

  const answer = useCallback((option: string) => dispatch({ type: "ANSWER", option }), []);

  // Clock. Stands still while the tab is hidden.
  useEffect(() => {
    if (state.phase !== "playing") return;
    const id = window.setInterval(() => {
      if (!document.hidden) dispatch({ type: "TICK" });
    }, 1000);
    return () => window.clearInterval(id);
  }, [state.phase]);

  // Show feedback colours briefly, then move to the next word.
  useEffect(() => {
    if (!state.feedback || state.phase !== "playing") return;
    const id = window.setTimeout(() => dispatch({ type: "ADVANCE" }), FEEDBACK_MS);
    return () => window.clearTimeout(id);
  }, [state.feedback, state.phase]);

  useEffect(() => {
    if (state.phase === "over") submit(state.score);
  }, [state.phase, state.score, submit]);

  // 1-4 answer; Enter starts / replays.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Enter" && state.phase !== "playing") {
        e.preventDefault();
        start();
      } else if (state.phase === "playing" && question && /^[1-4]$/.test(e.key)) {
        const option = question.options[Number(e.key) - 1];
        if (option) {
          e.preventDefault();
          answer(option);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [state.phase, question, start, answer]);

  const timeRatio = state.timeLeft / ROUND_SECONDS;
  const timerClass =
    timeRatio <= 0.2
      ? "from-rose-500 to-red-600 motion-safe:animate-pulse"
      : timeRatio <= 0.4
        ? "from-orange-500 to-amber-500"
        : "from-violet-500 to-fuchsia-500";
  const multiplier = streakMultiplier(state.streak);
  const accuracy = state.answeredCount > 0 ? Math.round((state.correctCount / state.answeredCount) * 100) : 0;

  return (
    <GameFrame title="Spelling Sprint" subtitle="Spot the correct spelling, fast" best={best}>
      {state.phase === "lobby" && (
        <GameLobby
          hero={<SpellCheck aria-hidden="true" strokeWidth={1.6} />}
          title="Spelling Sprint"
          blurb="Four spellings, one is right. Beat the clock and build a streak."
          rules={[
            { icon: Timer, text: `${ROUND_SECONDS} seconds on the clock` },
            { icon: Zap, text: "Every 5 right in a row raises your points multiplier" },
            { icon: X, text: `A wrong answer costs ${WRONG_PENALTY_SECONDS} seconds and your streak` },
          ]}
          best={best}
          onStart={start}
        />
      )}

      {state.phase === "playing" && question && (
        <section
          aria-label="Spelling Sprint"
          className="flex min-h-0 w-full flex-1 flex-col gap-3 overflow-y-auto pb-1 [scrollbar-width:none] [@media(max-height:600px)]:gap-2 [@media(max-height:480px)_and_(min-width:560px)]:grid [@media(max-height:480px)_and_(min-width:560px)]:grid-cols-2 [@media(max-height:480px)_and_(min-width:560px)]:content-start [@media(max-height:480px)_and_(min-width:560px)]:gap-x-4 [@media(max-height:480px)_and_(min-width:560px)]:gap-y-2"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1.5">
              <span className="section-label">Score</span>
              <motion.span
                key={state.score}
                initial={reduceMotion ? false : { y: 6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="font-mono text-xl font-black tabular-nums text-violet-700 dark:text-violet-300"
              >
                {state.score}
              </motion.span>
            </div>
            {state.streak >= 2 && (
              <motion.div
                key={state.streak}
                initial={reduceMotion ? false : { scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-1 rounded-full border-2 border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-mono font-black text-amber-700 dark:text-amber-400"
                aria-label={`${state.streak} in a row, ${multiplier} times points`}
              >
                <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                {state.streak} · x{multiplier}
              </motion.div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <ProgressBar
              value={timeRatio * 100}
              label="Time left"
              className="h-3 flex-1 p-0"
              barClassName={`bg-gradient-to-r ${timerClass} transition-[width] duration-1000 ease-linear`}
            />
            <span className="w-9 text-right font-mono text-sm font-black tabular-nums text-muted-foreground">
              {state.timeLeft}s
            </span>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-violet-500/25 bg-card px-4 py-5 [@media(max-height:480px)_and_(min-width:560px)]:py-3 text-center">
            <SpellCheck className="h-6 w-6 text-violet-600 dark:text-violet-400" aria-hidden="true" />
            <p className="text-base font-extrabold text-foreground sm:text-lg">Which is spelled correctly?</p>
            <p className="text-xs font-semibold text-muted-foreground">Tap an option or press 1–4</p>
          </div>

          <div role="group" aria-label="Spellings" className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 [@media(max-height:480px)_and_(min-width:560px)]:col-start-2 [@media(max-height:480px)_and_(min-width:560px)]:row-start-1 [@media(max-height:480px)_and_(min-width:560px)]:row-span-3 [@media(max-height:480px)_and_(min-width:560px)]:grid-cols-1 [@media(max-height:480px)_and_(min-width:560px)]:gap-1.5">
            {question.options.map((option, i) => {
              const fb = state.feedback;
              const isChosen = fb?.chosen === option;
              const isRight = option === question.word.correct;
              const showRight = fb && isRight;
              return (
                <button
                  key={option}
                  type="button"
                  disabled={!!fb}
                  onClick={() => answer(option)}
                  aria-label={`Option ${i + 1}: ${option}`}
                  className={`flex min-h-14 [@media(max-height:480px)_and_(min-width:560px)]:min-h-10 items-center gap-3 rounded-2xl border-2 border-b-[3px] px-3 py-2 [@media(max-height:480px)_and_(min-width:560px)]:py-1 text-left font-mono text-base font-bold transition-all active:translate-y-[1px] disabled:cursor-default sm:text-lg ${
                    showRight
                      ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-800 dark:text-emerald-200"
                      : isChosen
                        ? "border-rose-500/60 bg-rose-500/15 text-rose-800 dark:text-rose-200"
                        : "border-border bg-card text-foreground hover:border-violet-500/50 hover:bg-violet-500/10"
                  }`}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-black text-muted-foreground">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 break-all">{option}</span>
                  {showRight && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
                  {isChosen && !isRight && <X className="h-4 w-4 shrink-0" aria-hidden="true" />}
                </button>
              );
            })}
          </div>

          <p role="status" aria-live="polite" className="sr-only">
            {state.feedback
              ? state.feedback.correct
                ? "Correct"
                : `Wrong. Correct spelling is ${question.word.correct}`
              : ""}
          </p>
        </section>
      )}

      {state.phase === "over" && (
        <ResultSummary
          kicker="Time's up"
          rank={rankTitle(state.score)}
          score={state.score}
          best={best}
          isNewBest={isNewBest}
          stats={[
            { label: "Correct", value: String(state.correctCount) },
            { label: "Accuracy", value: `${accuracy}%` },
            { label: "Best streak", value: String(state.bestStreak) },
          ]}
          onPlayAgain={start}
        >
          <div className="flex flex-col gap-2">
            <h3 className="section-label">{state.misses.length > 0 ? "Words to review" : "No mistakes!"}</h3>
            {state.misses.length > 0 && (
              <ul className="flex flex-col gap-1.5">
                {state.misses.map((m, i) => (
                  <li
                    key={`${m.correct}-${i}`}
                    className="flex items-center justify-between gap-3 rounded-2xl border-2 border-border bg-card px-3 py-2.5 font-mono text-sm"
                  >
                    <span className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                      <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {m.correct}
                    </span>
                    <span className="truncate text-xs text-rose-700 line-through dark:text-rose-400">{m.chosen}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </ResultSummary>
      )}
    </GameFrame>
  );
}
