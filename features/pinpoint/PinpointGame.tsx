"use client";

import { cn } from "@/lib/utils";
import { DUO } from "@/features/games/buttons";
import { useCallback, useEffect, useReducer } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Eye, Link2, Target, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PINPOINT_PUZZLES } from "@/lib/pinpoint-puzzles";
import { GameFrame } from "@/features/games/GameFrame";
import { GameLobby } from "@/features/games/GameLobby";
import { ResultSummary } from "@/features/games/ResultSummary";
import { useBestScore } from "@/features/games/useBestScore";
import {
  MAX_SCORE,
  POINTS,
  PUZZLES_PER_RUN,
  buildRounds,
  currentRound,
  initialState,
  pinpointReducer,
  rankTitle,
} from "./game";

export function PinpointGame() {
  const [state, dispatch] = useReducer(pinpointReducer, initialState);
  const { best, isNewBest, submit, clearNewBest } = useBestScore("ssc:pinpoint:best");
  const reduceMotion = useReducedMotion();
  const round = currentRound(state);
  const revealing = state.phase === "reveal";

  const start = useCallback(() => {
    clearNewBest();
    dispatch({ type: "START", rounds: buildRounds(PINPOINT_PUZZLES) });
  }, [clearNewBest]);

  const pick = useCallback((option: string) => dispatch({ type: "PICK", option }), []);
  const next = useCallback(() => dispatch({ type: "NEXT" }), []);

  useEffect(() => {
    if (state.phase === "over") submit(state.score);
  }, [state.phase, state.score, submit]);

  // 1-4 pick an option; Enter starts / continues.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Enter") {
        if (state.phase === "lobby" || state.phase === "over") start();
        else if (state.phase === "reveal") next();
        else return;
        e.preventDefault();
        return;
      }
      if (state.phase === "playing" && round && /^[1-4]$/.test(e.key)) {
        const option = round.options[Number(e.key) - 1];
        if (option) {
          e.preventDefault();
          pick(option);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [state.phase, round, start, next, pick]);

  const solvedCount = state.results.filter((r) => r.solved).length;

  return (
    <GameFrame title="Odd Link" subtitle="Find what the words have in common" best={best}>
      {state.phase === "lobby" && (
        <GameLobby
          hero={<Link2 aria-hidden="true" strokeWidth={1.6} />}
          title="Odd Link"
          blurb="Words appear one by one. Spot the link between them before you run out of clues."
          rules={[
            { icon: Target, text: `${PUZZLES_PER_RUN} puzzles · about 2 minutes` },
            { icon: Eye, text: "Start with one clue. Each wrong guess reveals another" },
            { icon: Check, text: `Fewer clues = more points (${POINTS.join(" / ")})` },
          ]}
          best={best}
          onStart={start}
        />
      )}

      {(state.phase === "playing" || revealing) && round && (
        <section
          aria-label="Odd Link puzzle"
          className="flex min-h-0 w-full flex-1 flex-col gap-3 overflow-y-auto pb-1 [scrollbar-width:none] [@media(max-height:600px)]:gap-2 [@media(max-height:480px)_and_(min-width:560px)]:grid [@media(max-height:480px)_and_(min-width:560px)]:grid-cols-2 [@media(max-height:480px)_and_(min-width:560px)]:content-start [@media(max-height:480px)_and_(min-width:560px)]:gap-x-4 [@media(max-height:480px)_and_(min-width:560px)]:gap-y-2"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="section-label">
              Puzzle {state.index + 1} of {state.rounds.length}
            </span>
            <span className="flex items-baseline gap-1.5">
              <span className="section-label">Score</span>
              <motion.span
                key={state.score}
                initial={reduceMotion ? false : { y: 6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="font-mono text-lg font-black tabular-nums text-fuchsia-800 dark:text-fuchsia-300"
              >
                {state.score}
              </motion.span>
            </span>
          </div>

          <ol className="flex w-full gap-1" aria-label="Progress">
            {state.rounds.map((_, i) => {
              const r = state.results[i];
              return (
                <li
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${
                    r ? (r.solved ? "bg-emerald-500" : "bg-rose-500") : i === state.index ? "bg-brand-500" : "bg-muted"
                  }`}
                />
              );
            })}
          </ol>

          {/* Clues */}
          <div className="rounded-2xl border-2 border-fuchsia-500/25 bg-card p-3 sm:p-4">
            <p className="section-label mb-2.5">What connects these?</p>
            <ul className="grid grid-cols-2 gap-2" aria-live="polite">
              {round.puzzle.clues.map((clue, i) => {
                const shown = revealing || i <= state.eliminated.length;
                return (
                  <li
                    key={clue}
                    className={`flex h-11 items-center justify-center rounded-xl border-2 px-2 text-center text-sm font-bold sm:text-base ${
                      shown
                        ? "border-fuchsia-500/40 bg-[color-mix(in_oklab,var(--color-fuchsia-500)_10%,var(--card))] text-fuchsia-800 dark:text-fuchsia-100"
                        : "border-dashed border-border text-muted-foreground/50"
                    }`}
                  >
                    {shown ? (
                      <motion.span
                        key={clue}
                        initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="truncate"
                      >
                        {clue}
                      </motion.span>
                    ) : (
                      <span aria-label="Hidden clue">?</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Options (+ result bar) */}
          <div className="flex flex-col gap-3 [@media(max-height:480px)_and_(min-width:560px)]:col-start-2 [@media(max-height:480px)_and_(min-width:560px)]:row-start-1 [@media(max-height:480px)_and_(min-width:560px)]:row-span-3 [@media(max-height:480px)_and_(min-width:560px)]:gap-2">
          <div role="group" aria-label="Possible links" className="flex flex-col gap-2 [@media(max-height:480px)_and_(min-width:560px)]:gap-1.5">
            {round.options.map((option, i) => {
              const isAnswer = option === round.puzzle.answer;
              const isOut = state.eliminated.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  disabled={revealing || isOut}
                  onClick={() => pick(option)}
                  aria-label={`Option ${i + 1}: ${option}${isOut ? ", wrong" : ""}`}
                  className={`flex min-h-12 [@media(max-height:480px)_and_(min-width:560px)]:min-h-9 items-center gap-3 rounded-2xl border-2 border-b-4 px-3 py-2 [@media(max-height:480px)_and_(min-width:560px)]:py-1 text-left text-sm font-bold transition-all active:translate-y-[2px] active:border-b-2 disabled:cursor-default sm:text-base ${
                    revealing && isAnswer
                      ? "border-emerald-500/50 bg-[color-mix(in_oklab,var(--color-emerald-500)_15%,var(--card))] text-emerald-800 dark:text-emerald-200"
                      : isOut
                        ? "border-border bg-muted text-muted-foreground/50 line-through"
                        : "border-border bg-card text-foreground hover:border-fuchsia-500/50 hover:bg-[color-mix(in_oklab,var(--color-fuchsia-500)_10%,var(--card))]"
                  }`}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-muted font-mono text-xs font-black text-muted-foreground">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">{option}</span>
                  {revealing && isAnswer && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
                  {isOut && <X className="h-4 w-4 shrink-0" aria-hidden="true" />}
                </button>
              );
            })}
          </div>

          {revealing && (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              role="status"
              className="mt-auto flex items-center justify-between gap-3 rounded-2xl border-2 border-border bg-card p-3 [@media(max-height:480px)_and_(min-width:560px)]:p-2"
            >
              {(() => {
                const result = state.results[state.results.length - 1];
                return (
                  <>
                    <div
                      className={`flex items-center gap-1.5 text-sm font-black ${
                        result.solved ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"
                      }`}
                    >
                      {result.solved ? <Check className="h-4 w-4" aria-hidden="true" /> : <X className="h-4 w-4" aria-hidden="true" />}
                      {result.solved ? `+${result.points}` : "No points"}
                    </div>
                    <Button
                      type="button"
                      onClick={next}
                      autoFocus
                      className={cn(DUO.primary, "h-12")}
                    >
                      {state.index + 1 >= state.rounds.length ? "See results" : "Next puzzle"}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </>
                );
              })()}
            </motion.div>
          )}
          </div>
        </section>
      )}

      {state.phase === "over" && (
        <ResultSummary
          kicker="Run complete"
          rank={rankTitle(state.score)}
          score={state.score}
          best={best}
          isNewBest={isNewBest}
          stats={[
            { label: "Solved", value: `${solvedCount}/${state.rounds.length}` },
            { label: "Out of", value: String(MAX_SCORE) },
            {
              label: "On first clue",
              value: String(state.results.filter((r) => r.solved && r.wrongCount === 0).length),
            },
          ]}
          onPlayAgain={start}
        >
          <div className="flex flex-col gap-2">
            <h3 className="section-label">Links this run</h3>
            <ul className="flex flex-col gap-1.5">
              {state.results.map((r) => (
                <li key={r.round.puzzle.answer} className="rounded-2xl border-2 border-border bg-card px-3 py-2.5">
                  <div className="flex items-center gap-2 text-sm font-black text-foreground">
                    {r.solved ? (
                      <Check className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-label="Solved" />
                    ) : (
                      <X className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" aria-label="Missed" />
                    )}
                    {r.round.puzzle.answer}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{r.round.puzzle.clues.join(" · ")}</p>
                </li>
              ))}
            </ul>
          </div>
        </ResultSummary>
      )}
    </GameFrame>
  );
}
