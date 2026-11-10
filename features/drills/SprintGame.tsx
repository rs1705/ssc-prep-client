"use client";

import { useCallback, useEffect, useReducer } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Clock, Flame, Lightbulb, Timer, X, Zap, type LucideIcon } from "lucide-react";
import { ProgressBar } from "@/components/custom/ProgressBar";
import { GameFrame } from "@/features/games/GameFrame";
import { GameLobby } from "@/features/games/GameLobby";
import { ResultSummary } from "@/features/games/ResultSummary";
import { GAME_TONE, type GameTone } from "@/features/games/tone";
import { useBestScore } from "@/features/games/useBestScore";
import {
  FEEDBACK_MS,
  SPRINT_SECONDS,
  WRONG_PENALTY_SECONDS,
  initialState,
  rankTitle,
  sprintReducer,
  streakMultiplier,
  type SprintQuestion,
} from "./sprint";

interface SprintGameProps {
  title: string;
  subtitle: string;
  blurb: string;
  icon: LucideIcon;
  /** Short method reminders shown in the lobby. */
  tips: string[];
  storageKey: string;
  buildQueue: () => SprintQuestion[];
  tone: GameTone;
  backHref: string;
  backLabel: string;
}

export function SprintGame({
  title,
  subtitle,
  blurb,
  icon: Icon,
  tips,
  storageKey,
  buildQueue,
  tone,
  backHref,
  backLabel,
}: SprintGameProps) {
  const [state, dispatch] = useReducer(sprintReducer, initialState);
  const { best, isNewBest, submit, clearNewBest } = useBestScore(storageKey);
  const reduceMotion = useReducedMotion();
  const t = GAME_TONE[tone];
  const q = state.queue[state.index];

  const start = useCallback(() => {
    clearNewBest();
    dispatch({ type: "START", queue: buildQueue() });
  }, [clearNewBest, buildQueue]);

  const answer = useCallback((option: string) => dispatch({ type: "ANSWER", option }), []);

  useEffect(() => {
    if (state.phase !== "playing") return;
    const id = window.setInterval(() => {
      if (!document.hidden) dispatch({ type: "TICK" });
    }, 1000);
    return () => window.clearInterval(id);
  }, [state.phase]);

  // Right answers move on quickly; a miss stays a little longer so the method can be read.
  useEffect(() => {
    if (!state.feedback || state.phase !== "playing") return;
    const id = window.setTimeout(
      () => dispatch({ type: "ADVANCE" }),
      state.feedback.correct ? FEEDBACK_MS : FEEDBACK_MS * 2.5,
    );
    return () => window.clearTimeout(id);
  }, [state.feedback, state.phase]);

  useEffect(() => {
    if (state.phase === "over") submit(state.score);
  }, [state.phase, state.score, submit]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Enter" && state.phase !== "playing" && !(e.target instanceof HTMLButtonElement)) {
        e.preventDefault();
        start();
      } else if (state.phase === "playing" && q && /^[1-4]$/.test(e.key)) {
        const option = q.options[Number(e.key) - 1];
        if (option) answer(option);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.phase, q, start, answer]);

  const timeRatio = state.timeLeft / SPRINT_SECONDS;
  const timerClass =
    timeRatio <= 0.2
      ? "from-rose-500 to-red-600 motion-safe:animate-pulse"
      : timeRatio <= 0.4
        ? "from-brand-alt-500 to-brand-500"
        : t.timer;
  const accuracy = state.answeredCount ? Math.round((state.correctCount / state.answeredCount) * 100) : 0;

  return (
    <GameFrame title={title} subtitle={subtitle} best={best} tone={tone} backHref={backHref} backLabel={backLabel}>
      {state.phase === "lobby" && (
        <GameLobby
          hero={<Icon aria-hidden="true" strokeWidth={1.6} />}
          title={title}
          blurb={blurb}
          tone={tone}
          rules={[
            { icon: Timer, text: `${SPRINT_SECONDS} seconds · press 1–4 or tap` },
            { icon: Zap, text: "Every 5 right in a row raises your multiplier" },
            { icon: X, text: `A wrong answer costs ${WRONG_PENALTY_SECONDS} seconds and your streak` },
            ...tips.map((text) => ({ icon: Lightbulb, text })),
          ]}
          best={best}
          onStart={start}
        />
      )}

      {state.phase === "playing" && q && (
        <section aria-label={title} className="flex min-h-0 w-full flex-1 flex-col gap-3 overflow-y-auto pb-1 [scrollbar-width:none]">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1.5">
              <span className="section-label">Score</span>
              <motion.span
                key={state.score}
                initial={reduceMotion ? false : { y: 6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`font-mono text-xl font-black tabular-nums ${t.text}`}
              >
                {state.score}
              </motion.span>
            </div>
            {state.streak >= 2 && (
              <span className="flex items-center gap-1 rounded-full border-2 border-brand-500/30 bg-[color-mix(in_oklab,var(--brand-500)_10%,var(--card))] px-2.5 py-1 text-xs font-mono font-black text-brand-700 dark:text-brand-400">
                <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                {state.streak} · x{streakMultiplier(state.streak)}
              </span>
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

          <div className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 ${t.border} bg-card px-4 py-6 text-center`}>
            <p className="text-base font-extrabold text-foreground sm:text-lg">{q.prompt}</p>
            {q.display && (
              <p className="font-mono text-2xl font-black tracking-wide text-foreground sm:text-3xl">{q.display}</p>
            )}
            <p className="min-h-5 text-sm font-semibold text-muted-foreground" aria-live="polite">
              {state.feedback && !state.feedback.correct ? q.explain : ""}
            </p>
          </div>

          <div role="group" aria-label="Options" className="grid grid-cols-2 gap-2">
            {q.options.map((option, i) => {
              const fb = state.feedback;
              const isChosen = fb?.chosen === option;
              const isRight = option === q.answer;
              const look =
                fb && isRight
                  ? "border-emerald-500/60 bg-[color-mix(in_oklab,var(--color-emerald-500)_12%,var(--card))] text-emerald-800 dark:text-emerald-200"
                  : isChosen
                    ? "border-rose-500/60 bg-[color-mix(in_oklab,var(--color-rose-500)_12%,var(--card))] text-rose-800 dark:text-rose-200"
                    : `border-border bg-card text-foreground ${t.optionHover}`;
              return (
                <button
                  key={`${state.index}-${option}`}
                  type="button"
                  disabled={!!fb}
                  onClick={() => answer(option)}
                  aria-label={`Option ${i + 1}: ${option}`}
                  className={`flex min-h-16 items-center gap-3 rounded-2xl border-2 border-b-4 px-3 py-2 text-left font-mono text-lg font-black transition-colors active:translate-y-[2px] active:border-b-2 disabled:cursor-default sm:text-xl ${look}`}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-black text-muted-foreground">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 break-all">{option}</span>
                  {fb && isRight && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
                  {isChosen && !isRight && <X className="h-4 w-4 shrink-0" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {state.phase === "over" && (
        <ResultSummary
          kicker="Time's up"
          rank={rankTitle(state.score)}
          score={state.score}
          best={best}
          isNewBest={isNewBest}
          tone={tone}
          allHref={backHref}
          allLabel="All drills"
          stats={[
            { label: "Correct", value: String(state.correctCount) },
            { label: "Accuracy", value: `${accuracy}%` },
            { label: "Best streak", value: String(state.bestStreak) },
          ]}
          onPlayAgain={start}
        >
          <div className="flex flex-col gap-2">
            <h3 className="section-label">{state.misses.length > 0 ? "Review your misses" : "No mistakes!"}</h3>
            {state.misses.length > 0 && (
              <ul className="flex flex-col gap-1.5">
                {state.misses.map((m, i) => (
                  <li key={i} className="flex flex-col gap-1 rounded-2xl border-2 border-border bg-card px-3 py-2.5 text-sm">
                    <span className="font-semibold text-foreground">
                      {m.prompt} {m.display && <span className="font-mono">{m.display}</span>}
                    </span>
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">✓ {m.answer}</span>
                      <span className="text-rose-700 line-through dark:text-rose-400">{m.chosen}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">{m.explain}</span>
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
