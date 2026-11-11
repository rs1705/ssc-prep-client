"use client";

import { playFeedback } from "@/features/games/feedback";
import { useCallback, useEffect, useReducer, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Clock, Flame, Puzzle, Timer, X, Zap } from "lucide-react";
import { ProgressBar } from "@/components/custom/ProgressBar";
import { GameFrame } from "@/features/games/GameFrame";
import { GameLobby } from "@/features/games/GameLobby";
import { ResultSummary } from "@/features/games/ResultSummary";
import { DeckPicker } from "@/features/games/DeckPicker";
import { GAME_TONE, type GameTone } from "@/features/games/tone";
import { useBestScore } from "@/features/games/useBestScore";
import { useLazyGetFilteredCardsQuery } from "@/redux/FlashcardApiSlice";
import { readStored, writeStored } from "@/lib/storage";
import {
  ROUND_CLEAR_MS,
  ROUND_SIZE,
  RUN_SECONDS,
  TIME_BONUS,
  WRONG_FLASH_MS,
  WRONG_PENALTY_SECONDS,
  buildRounds,
  initialState,
  matchReducer,
  rankTitle,
  streakMultiplier,
  type Pair,
  type Side,
} from "./game";
import { shuffle } from "@/lib/shuffle";
import { MATCH_DECKS, type MatchDeck, type MatchDeckId } from "./decks";

interface MatchGameProps {
  decks?: MatchDeck[];
  title?: string;
  /** Short line under the title in the lobby. */
  blurb?: string;
  tone?: GameTone;
  backHref?: string;
  backLabel?: string;
  /** Prefix for remembered deck and best scores. */
  storagePrefix?: string;
}

export function MatchGame({
  decks = MATCH_DECKS,
  title = "Match the Following",
  blurb = "Tap a word, then its partner. Clear all five pairs to move to the next round.",
  tone: toneKey = "english",
  backHref = "/SSC/english/games",
  backLabel = "Back to all games",
  storagePrefix = "ssc:match",
}: MatchGameProps = {}) {
  const tone = GAME_TONE[toneKey];
  const DECK_KEY = `${storagePrefix}:deck`;
  const [state, dispatch] = useReducer(matchReducer, initialState);
  const [deckId, setDeckId] = useState<MatchDeckId>(decks[0].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchCards] = useLazyGetFilteredCardsQuery();
  const { best, isNewBest, submit, clearNewBest } = useBestScore(`${storagePrefix}:${deckId}:best`);
  const reduceMotion = useReducedMotion();
  const deck = decks.find((d) => d.id === deckId) ?? decks[0];
  const round = state.rounds[state.round] ?? [];
  const byId = new Map(round.map((p) => [p.id, p]));

  useEffect(() => {
    const saved = readStored<string>(DECK_KEY, decks[0].id);
    if (decks.some((d) => d.id === saved)) setDeckId(saved);
  }, [DECK_KEY, decks]);

  const chooseDeck = (id: MatchDeckId) => {
    setDeckId(id);
    writeStored(DECK_KEY, id);
  };

  const start = useCallback(async () => {
    if (loading) return;
    clearNewBest();
    setError(null);
    setLoading(true);
    try {
      let pairs: Pair[];
      if (deck.local) {
        pairs = shuffle(deck.local());
      } else {
        const cards = await fetchCards(deck.query ?? {}).unwrap();
        const toPair = deck.toPair ?? (() => null);
        pairs = cards.map(toPair).filter((p): p is Pair => p !== null);
      }
      const rounds = buildRounds(pairs);
      if (rounds.length === 0) throw new Error("not enough cards");
      dispatch({ type: "START", rounds });
    } catch {
      setError("Couldn't reach the practice server. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, [loading, clearNewBest, fetchCards, deck]);

  const pick = (side: Side, id: string) => dispatch({ type: "PICK", side, id });

  // Clock (pauses while the tab is hidden).
  useEffect(() => {
    if (state.phase !== "playing") return;
    const id = window.setInterval(() => {
      if (!document.hidden) dispatch({ type: "TICK" });
    }, 1000);
    return () => window.clearInterval(id);
  }, [state.phase]);

  useEffect(() => {
    if (!state.wrong) return;
    const id = window.setTimeout(() => dispatch({ type: "CLEAR_WRONG" }), WRONG_FLASH_MS);
    return () => window.clearTimeout(id);
  }, [state.wrong]);

  useEffect(() => {
    if (state.phase !== "playing" || state.matched.length < ROUND_SIZE) return;
    const id = window.setTimeout(() => dispatch({ type: "NEXT_ROUND" }), ROUND_CLEAR_MS);
    return () => window.clearTimeout(id);
  }, [state.matched.length, state.phase]);

  // Sound + vibration for every pair, and a short fanfare at the end.
  useEffect(() => {
    if (state.matchedTotal > 0) playFeedback("correct");
  }, [state.matchedTotal]);

  useEffect(() => {
    if (state.wrong) playFeedback("wrong");
  }, [state.wrong]);

  useEffect(() => {
    if (state.phase === "over") playFeedback("finish");
  }, [state.phase]);

  useEffect(() => {
    if (state.phase === "over") submit(state.score);
  }, [state.phase, state.score, submit]);

  // Enter starts / replays.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && state.phase !== "playing" && !(e.target instanceof HTMLButtonElement)) {
        e.preventDefault();
        void start();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.phase, start]);

  const timeRatio = state.timeLeft / RUN_SECONDS;
  const timerClass =
    timeRatio <= 0.2
      ? "from-rose-500 to-red-600 motion-safe:animate-pulse"
      : timeRatio <= 0.4
        ? "from-brand-alt-500 to-brand-500"
        : tone.timer;

  const tileClass = (side: Side, id: string) => {
    const isMatched = state.matched.includes(id);
    const isSelected = state.selected?.side === side && state.selected.id === id;
    const isWrong = state.wrong && (side === "left" ? state.wrong.left : state.wrong.right) === id;
    if (isMatched) return "border-emerald-500/50 bg-[color-mix(in_oklab,var(--color-emerald-500)_12%,var(--card))] text-emerald-800 opacity-40 dark:text-emerald-200";
    if (isWrong) return "border-rose-500/60 bg-[color-mix(in_oklab,var(--color-rose-500)_12%,var(--card))] text-rose-800 dark:text-rose-200";
    if (isSelected) return tone.selected;
    return `border-border bg-card text-foreground ${tone.optionHover}`;
  };

  const renderColumn = (side: Side) => {
    const order = side === "left" ? state.leftOrder : state.rightOrder;
    return (
      <div role="group" aria-label={side === "left" ? deck.leftLabel : deck.rightLabel} className="flex min-h-0 flex-col gap-2">
        <span className="section-label text-center">{side === "left" ? deck.leftLabel : deck.rightLabel}</span>
        {order.map((id) => {
          const pair = byId.get(id);
          if (!pair) return null;
          const text = side === "left" ? pair.left : pair.right;
          const isWrong = state.wrong && (side === "left" ? state.wrong.left : state.wrong.right) === id;
          return (
            <motion.button
              key={`${state.round}-${side}-${id}`}
              type="button"
              disabled={state.matched.includes(id)}
              onClick={() => pick(side, id)}
              aria-pressed={state.selected?.side === side && state.selected.id === id}
              animate={isWrong && !reduceMotion ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
              transition={{ duration: 0.35 }}
              className={`flex min-h-[3.25rem] flex-1 items-center justify-center rounded-2xl border-2 border-b-4 active:translate-y-[2px] active:border-b-2 px-2.5 py-2 text-center leading-snug transition-colors disabled:cursor-default ${
                side === "left" ? "text-sm font-extrabold sm:text-base" : "text-xs font-semibold sm:text-sm"
              } ${tileClass(side, id)}`}
            >
              <span className="line-clamp-3">{text}</span>
            </motion.button>
          );
        })}
      </div>
    );
  };

  const accuracy =
    state.matchedTotal + state.mistakes > 0
      ? Math.round((state.matchedTotal / (state.matchedTotal + state.mistakes)) * 100)
      : 0;

  return (
    <GameFrame title={title} subtitle={deck.label} best={best} tone={toneKey} backHref={backHref} backLabel={backLabel}>
      {state.phase === "lobby" && (
        <GameLobby
          hero={<Puzzle aria-hidden="true" strokeWidth={1.6} />}
          title={title}
          blurb={blurb}
          tone={toneKey}
          rules={[
            { icon: Timer, text: `${RUN_SECONDS} seconds for ${state.rounds.length || 5} rounds` },
            { icon: Zap, text: "Matches in a row raise your points multiplier" },
            { icon: X, text: `A wrong pair costs ${WRONG_PENALTY_SECONDS} seconds and your streak` },
          ]}
          best={best}
          onStart={() => void start()}
          startLabel={loading ? "Loading words…" : "Start"}
        >
          <DeckPicker
            label="Practise"
            options={decks.map((d) => ({ id: d.id, label: d.label }))}
            tone={toneKey}
            value={deckId}
            onChange={chooseDeck}
          />
          {error && <p role="alert" className="text-sm font-semibold text-rose-600 dark:text-rose-400">{error}</p>}
        </GameLobby>
      )}

      {state.phase === "playing" && (
        <section aria-label={title} className="flex min-h-0 w-full flex-1 flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1.5">
              <span className="section-label">Score</span>
              <span className={`font-mono text-xl font-black tabular-nums ${tone.text}`}>{state.score}</span>
            </div>
            <span className="text-xs font-bold text-muted-foreground">
              Round {state.round + 1} / {state.rounds.length}
            </span>
            {state.streak >= 2 ? (
              <span
                className="flex items-center gap-1 rounded-full border-2 border-brand-500/30 bg-[color-mix(in_oklab,var(--brand-500)_10%,var(--card))] px-2.5 py-1 text-xs font-mono font-black text-brand-700 dark:text-brand-400"
                aria-label={`${state.streak} in a row, ${streakMultiplier(state.streak)} times points`}
              >
                <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                {state.streak} · x{streakMultiplier(state.streak)}
              </span>
            ) : (
              <span className="w-16" />
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

          <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-2 overflow-y-auto pb-1 [scrollbar-width:none]">
            {renderColumn("left")}
            {renderColumn("right")}
          </div>

          <p role="status" aria-live="polite" className="sr-only">
            {state.wrong ? "Not a pair" : state.matched.length ? `${state.matched.length} of ${ROUND_SIZE} matched` : ""}
          </p>
        </section>
      )}

      {state.phase === "over" && (
        <ResultSummary
          kicker={state.clearedAll ? `All rounds cleared · +${state.timeLeft * TIME_BONUS} time bonus` : "Time's up"}
          result={{ correct: state.matchedTotal, total: state.matchedTotal + state.mistakes }}
          mistakes={state.missed.map((p) => ({ prompt: p.left, answer: p.right }))}
          rank={rankTitle(state.score)}
          score={state.score}
          best={best}
          isNewBest={isNewBest}
          stats={[
            { label: "Pairs", value: String(state.matchedTotal) },
            { label: "Accuracy", value: `${accuracy}%` },
            { label: "Best streak", value: String(state.bestStreak) },
          ]}
          onPlayAgain={() => void start()}
          tone={toneKey}
          allHref={backHref}
          allLabel="Back"
        >
          <div className="flex flex-col gap-2">
            <h3 className="section-label">{state.missed.length > 0 ? "Pairs to review" : "No wrong pairs!"}</h3>
            {state.missed.length > 0 && (
              <ul className="flex flex-col gap-1.5">
                {state.missed.map((p) => (
                  <li key={p.id} className="flex flex-col gap-0.5 rounded-2xl border-2 border-border bg-card px-3 py-2.5">
                    <span className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                      <Check className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                      {p.left}
                    </span>
                    <span className="pl-5 text-sm text-muted-foreground">{p.right}</span>
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
