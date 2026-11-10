"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, CornerDownLeft, Delete, Flame, Share2, Shuffle } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { WORD_OF_DAY_BANK } from "@/lib/wordle-words";
import { readStored, writeStored } from "@/lib/storage";
import { shuffle } from "@/lib/shuffle";
import { GameFrame } from "@/features/games/GameFrame";
import {
  EMPTY_STATS,
  HINT_AFTER,
  MAX_GUESSES,
  WORD_LENGTH,
  createState,
  dayNumber,
  evaluateGuess,
  letterStates,
  recordResult,
  shareText,
  wordForDay,
  wordleReducer,
  type TileState,
  type WordleStats,
} from "./game";

const DAILY_KEY = "ssc:wotd:daily";
const STATS_KEY = "ssc:wotd:stats";
const REVEAL_STEP_MS = 230;

interface DailyRecord {
  day: number;
  guesses: string[];
  recorded: boolean;
}

const KEY_ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].map((r) => r.split(""));

const TILE_CLASS: Record<TileState, string> = {
  correct: "border-emerald-600 bg-emerald-600 text-white",
  present: "border-brand-500 bg-brand-500 text-white",
  absent: "border-slate-500 bg-slate-500 text-white dark:border-slate-600 dark:bg-slate-600",
};

const KEY_CLASS: Record<TileState, string> = {
  correct: "border-emerald-600 bg-emerald-600 text-white",
  present: "border-brand-500 bg-brand-500 text-white",
  absent: "border-border bg-muted text-muted-foreground/40",
};

function msUntilMidnight(): number {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return next.getTime() - now.getTime();
}

function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export function WordleGame() {
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [day, setDay] = useState(0);
  const [state, dispatch] = useReducer(
    wordleReducer,
    undefined,
    () => createState("daily", WORD_OF_DAY_BANK[0]),
  );
  const [stats, setStats] = useState<WordleStats>(EMPTY_STATS);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [animating, setAnimating] = useState<{ row: number; shown: number } | null>(null);

  const recorded = useRef(false);
  const prevGuesses = useRef(0);
  const messageTimer = useRef<number | undefined>(undefined);

  // Load today's game and lifetime stats once, on the client.
  useEffect(() => {
    const today = dayNumber();
    const saved = readStored<DailyRecord | null>(DAILY_KEY, null);
    const guesses = saved && saved.day === today ? saved.guesses : [];
    recorded.current = saved && saved.day === today ? saved.recorded : false;
    prevGuesses.current = guesses.length;
    setDay(today);
    setStats(readStored<WordleStats>(STATS_KEY, EMPTY_STATS));
    dispatch({ type: "LOAD", mode: "daily", answer: wordForDay(today), guesses });
    setReady(true);
  }, []);

  // Persist the daily game after every guess.
  useEffect(() => {
    if (!ready || state.mode !== "daily") return;
    writeStored<DailyRecord>(DAILY_KEY, { day, guesses: state.guesses, recorded: recorded.current });
  }, [ready, state.mode, state.guesses, day]);

  // Reveal animation: colour tiles one by one after a guess is submitted.
  useEffect(() => {
    const count = state.guesses.length;
    if (count > prevGuesses.current && !reduceMotion) {
      const row = count - 1;
      setAnimating({ row, shown: 0 });
      const timers: number[] = [];
      for (let i = 1; i <= WORD_LENGTH; i++) {
        timers.push(
          window.setTimeout(() => {
            setAnimating(i === WORD_LENGTH ? null : { row, shown: i });
          }, i * REVEAL_STEP_MS),
        );
      }
      prevGuesses.current = count;
      return () => timers.forEach((t) => window.clearTimeout(t));
    }
    prevGuesses.current = count;
  }, [state.guesses.length, reduceMotion]);

  const finished = state.status !== "playing" && !animating;

  // Record lifetime stats once when a daily game finishes.
  useEffect(() => {
    if (!finished || state.mode !== "daily" || recorded.current) return;
    recorded.current = true;
    const next = recordResult(readStored<WordleStats>(STATS_KEY, EMPTY_STATS), state.status === "won", day);
    writeStored(STATS_KEY, next);
    setStats(next);
    writeStored<DailyRecord>(DAILY_KEY, { day, guesses: state.guesses, recorded: true });
    if (state.status === "won" && !reduceMotion) {
      confetti({ particleCount: 80, spread: 65, origin: { y: 0.45 } });
    }
  }, [finished, state.mode, state.status, state.guesses, day, reduceMotion]);

  // Countdown to the next daily word.
  useEffect(() => {
    if (!finished || state.mode !== "daily") return;
    const tick = () => setCountdown(formatCountdown(msUntilMidnight()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [finished, state.mode]);

  const flash = useCallback((text: string) => {
    setMessage(text);
    window.clearTimeout(messageTimer.current);
    messageTimer.current = window.setTimeout(() => setMessage(""), 1400);
  }, []);

  const type = useCallback((letter: string) => dispatch({ type: "TYPE", letter }), []);
  const remove = useCallback(() => dispatch({ type: "DELETE" }), []);
  const submit = useCallback(() => dispatch({ type: "SUBMIT" }), []);

  // The reducer counts too-short submissions; turn each one into a brief message.
  useEffect(() => {
    if (state.shortCount > 0) flash("Not enough letters");
  }, [state.shortCount, flash]);

  const playBonus = useCallback(() => {
    const pool = shuffle(WORD_OF_DAY_BANK.filter((w) => w.word !== wordForDay(day).word));
    prevGuesses.current = 0;
    setAnimating(null);
    setCopied(false);
    dispatch({ type: "LOAD", mode: "bonus", answer: pool[0], guesses: [] });
  }, [day]);

  // Physical keyboard.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Enter") {
        if (state.status === "playing") {
          e.preventDefault();
          submit();
        }
      } else if (e.key === "Backspace") {
        e.preventDefault();
        remove();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        type(e.key);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [state.status, submit, remove, type]);

  const share = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText(state, day));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      flash("Couldn't copy. Select and copy manually.");
    }
  }, [state, day, flash]);

  const keyStates = letterStates(state.guesses, state.answer.word);
  const showHint = state.guesses.length >= HINT_AFTER || finished;
  const winPct = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;

  if (!ready) return <GameFrame title="Word of the Day" subtitle="One word. Six tries.">{null}</GameFrame>;

  return (
    <GameFrame
      title="Word of the Day"
      subtitle={state.mode === "daily" ? `Daily word #${day}` : "Bonus word"}
    >
      <section
        aria-label="Word of the Day"
        className="flex min-h-0 w-full flex-1 flex-col items-center gap-3 overflow-y-auto pb-1 [scrollbar-width:none] [@media(max-height:600px)]:gap-1.5 [@media(max-height:480px)_and_(min-width:560px)]:grid [@media(max-height:480px)_and_(min-width:560px)]:grid-cols-2 [@media(max-height:480px)_and_(min-width:560px)]:content-start [@media(max-height:480px)_and_(min-width:560px)]:items-start [@media(max-height:480px)_and_(min-width:560px)]:gap-x-4 [@media(max-height:480px)_and_(min-width:560px)]:gap-y-1"
      >
        {/* Status chips */}
        <div className="flex w-full items-center justify-between gap-2 [@media(max-height:480px)_and_(min-width:560px)]:col-start-1 [@media(max-height:480px)_and_(min-width:560px)]:row-start-1">
          <span className="section-label">
            Guess {Math.min(state.guesses.length + (state.status === "playing" ? 1 : 0), MAX_GUESSES)} of {MAX_GUESSES}
          </span>
          {stats.streak > 0 && (
            <span className="flex items-center gap-1 rounded-full border-2 border-brand-500/30 bg-brand-500/10 px-2.5 py-0.5 text-xs font-mono font-black text-brand-700 dark:text-brand-400">
              <Flame className="h-3.5 w-3.5" aria-hidden="true" />
              {stats.streak} day streak
            </span>
          )}
        </div>

        {/* Grid */}
        <div
          role="grid"
          aria-label="Guesses"
          className="grid shrink-0 grid-rows-6 gap-1.5 [@media(max-height:480px)_and_(min-width:560px)]:col-start-1 [@media(max-height:480px)_and_(min-width:560px)]:row-start-2 [@media(max-height:480px)_and_(min-width:560px)]:row-span-2 [@media(max-height:480px)_and_(min-width:560px)]:justify-self-center"
          style={{
            width: finished
              ? "min(100%, 11.5rem)"
              : "min(100%, 20rem, calc((100dvh - 24rem) * 0.8333))",
            minWidth: "9.5rem",
          }}
        >
          {Array.from({ length: MAX_GUESSES }).map((_, row) => {
            const guess = state.guesses[row];
            const isCurrent = row === state.guesses.length && state.status === "playing";
            const letters = guess ?? (isCurrent ? state.current : "");
            const scores = guess ? evaluateGuess(guess, state.answer.word) : null;
            const revealedCount = !guess
              ? 0
              : animating && animating.row === row
                ? animating.shown
                : WORD_LENGTH;

            return (
              <div key={row} role="row" className="grid grid-cols-5 gap-1.5">
                {Array.from({ length: WORD_LENGTH }).map((__, col) => {
                  const letter = letters[col] ?? "";
                  const revealed = !!scores && col < revealedCount;
                  const label = revealed
                    ? `${letter}, ${scores![col]}`
                    : letter
                      ? letter
                      : "empty";
                  return (
                    <motion.div
                      key={`${col}-${revealed}`}
                      role="gridcell"
                      aria-label={label}
                      initial={revealed && !reduceMotion && animating?.row === row ? { rotateX: 90 } : false}
                      animate={{ rotateX: 0 }}
                      transition={{ duration: 0.18 }}
                      className={`flex aspect-square items-center justify-center rounded-lg border-2 font-mono text-xl font-black uppercase sm:text-2xl ${
                        revealed
                          ? TILE_CLASS[scores![col]]
                          : letter
                            ? "border-foreground/50 bg-card text-foreground"
                            : "border-border bg-card text-transparent"
                      }`}
                    >
                      {letter}
                    </motion.div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Hint / message line */}
        <p
          role="status"
          aria-live="polite"
          className={`w-full max-w-sm text-center text-sm font-semibold leading-snug text-muted-foreground [@media(max-height:480px)_and_(min-width:560px)]:col-start-2 [@media(max-height:480px)_and_(min-width:560px)]:row-start-1 [@media(max-height:480px)_and_(min-width:560px)]:text-xs ${
            finished && !message ? "hidden" : "min-h-9"
          }`}
        >
          {message ||
            (showHint ? (
              <>
                <span className="text-fuchsia-800 dark:text-fuchsia-300">Hint:</span> {state.answer.meaning}
              </>
            ) : (
              `Guess the ${WORD_LENGTH}-letter word. A hint unlocks after ${HINT_AFTER} guesses.`
            ))}
        </p>

        {!finished ? (
          <div role="group" aria-label="Keyboard" className="mx-auto mt-auto flex w-full max-w-md flex-col gap-1.5 sm:gap-2 [@media(max-height:480px)_and_(min-width:560px)]:col-start-2 [@media(max-height:480px)_and_(min-width:560px)]:row-start-2 [@media(max-height:480px)_and_(min-width:560px)]:row-span-2 [@media(max-height:480px)_and_(min-width:560px)]:mt-0">
            {KEY_ROWS.map((row, rowIndex) => (
              <div key={rowIndex} className="flex w-full justify-center gap-1 sm:gap-1.5">
                {rowIndex === 2 && (
                  <button
                    type="button"
                    onClick={submit}
                    aria-label="Enter"
                    className="flex h-11 flex-[1.5] items-center justify-center rounded-lg border-2 border-b-[3px] border-border bg-card text-foreground transition-all active:translate-y-[1px] [@media(max-height:600px)]:h-10 sm:h-12"
                  >
                    <CornerDownLeft className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
                {row.map((letter) => {
                  const ks = keyStates[letter];
                  return (
                    <button
                      key={letter}
                      type="button"
                      onClick={() => type(letter)}
                      aria-label={`${letter}${ks ? `, ${ks}` : ""}`}
                      className={`h-11 min-w-0 flex-1 select-none rounded-lg border-2 border-b-[3px] font-mono text-sm font-black transition-all active:translate-y-[1px] [@media(max-height:600px)]:h-10 sm:h-12 sm:text-base ${
                        ks ? KEY_CLASS[ks] : "border-border bg-card text-foreground hover:border-fuchsia-500/50 hover:bg-[color-mix(in_oklab,var(--color-fuchsia-500)_10%,var(--card))]"
                      }`}
                    >
                      {letter}
                    </button>
                  );
                })}
                {rowIndex === 2 && (
                  <button
                    type="button"
                    onClick={remove}
                    aria-label="Backspace"
                    className="flex h-11 flex-[1.5] items-center justify-center rounded-lg border-2 border-b-[3px] border-border bg-card text-foreground transition-all active:translate-y-[1px] [@media(max-height:600px)]:h-10 sm:h-12"
                  >
                    <Delete className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-auto flex w-full max-w-md flex-col gap-3 rounded-2xl border-2 border-border bg-card p-3 sm:p-4 [@media(max-height:480px)_and_(min-width:560px)]:col-start-2 [@media(max-height:480px)_and_(min-width:560px)]:row-start-1 [@media(max-height:480px)_and_(min-width:560px)]:row-span-3 [@media(max-height:480px)_and_(min-width:560px)]:mt-0 [@media(max-height:480px)_and_(min-width:560px)]:max-h-full [@media(max-height:480px)_and_(min-width:560px)]:overflow-y-auto"
          >
            <div className="text-center">
              <div
                className={`text-sm font-black ${
                  state.status === "won" ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"
                }`}
              >
                {state.status === "won"
                  ? `Solved in ${state.guesses.length}!`
                  : "Out of guesses"}
              </div>
              <div className="font-mono text-xl font-black tracking-widest text-foreground">
                {state.answer.word}
              </div>
              <div className="text-xs font-semibold text-muted-foreground">{state.answer.hindi}</div>
              <p className="mt-0.5 text-xs text-muted-foreground">{state.answer.meaning}</p>
            </div>

            {state.mode === "daily" && (
              <div className="grid grid-cols-4 gap-1.5 text-center">
                {[
                  { label: "Played", value: stats.played },
                  { label: "Win %", value: winPct },
                  { label: "Streak", value: stats.streak },
                  { label: "Best", value: stats.bestStreak },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-muted/60 px-1 py-1.5">
                    <div className="font-mono text-base font-black tabular-nums text-foreground">{s.value}</div>
                    <div className="section-label">{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {state.mode === "daily" && countdown && (
              <p className="text-center text-xs font-mono font-semibold text-muted-foreground">
                Next word in <span className="tabular-nums text-foreground">{countdown}</span>
              </p>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={share}
                className="h-11 flex-1 gap-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider"
              >
                {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Share2 className="h-4 w-4" aria-hidden="true" />}
                {copied ? "Copied" : "Share"}
              </Button>
              <Button
                type="button"
                onClick={playBonus}
                className="h-11 flex-1 gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-alt-500 text-xs font-mono font-bold uppercase tracking-wider text-white"
              >
                <Shuffle className="h-4 w-4" aria-hidden="true" />
                Bonus word
              </Button>
            </div>
          </motion.div>
        )}
      </section>
    </GameFrame>
  );
}
