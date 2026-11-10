"use client";

import { cn } from "@/lib/utils";
import { DUO } from "@/features/games/buttons";
import { useCallback, useEffect, useReducer, useState } from "react";
import { ArrowRight, Check, Flame, Lightbulb, ListChecks, TextCursorInput, X } from "lucide-react";
import { ProgressBar } from "@/components/custom/ProgressBar";
import { GameFrame } from "@/features/games/GameFrame";
import { GameLobby } from "@/features/games/GameLobby";
import { ResultSummary } from "@/features/games/ResultSummary";
import { DeckPicker } from "@/features/games/DeckPicker";
import { GAME_TONE } from "@/features/games/tone";
import { useBestScore } from "@/features/games/useBestScore";
import { useLazyGetFilteredCardsQuery } from "@/redux/FlashcardApiSlice";
import { readStored, writeStored } from "@/lib/storage";
import { QUESTIONS_PER_RUN, buildQuestions, clozeReducer, initialState, rankTitle, streakMultiplier } from "./game";

type ClozeDeck = "vocab" | "ows" | "idiom";
const DECKS: { id: ClozeDeck; label: string }[] = [
  { id: "vocab", label: "Vocabulary" },
  { id: "ows", label: "One-word substitution" },
  { id: "idiom", label: "Idioms" },
];
const DECK_KEY = "ssc:cloze:deck";
const tone = GAME_TONE.english;

export function ClozeGame() {
  const [state, dispatch] = useReducer(clozeReducer, initialState);
  const [deck, setDeck] = useState<ClozeDeck>("vocab");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchCards] = useLazyGetFilteredCardsQuery();
  const { best, isNewBest, submit, clearNewBest } = useBestScore(`ssc:cloze:${deck}:best`);
  const q = state.questions[state.index];
  const answered = state.chosen !== null;

  useEffect(() => {
    const saved = readStored<string>(DECK_KEY, "vocab");
    if (DECKS.some((d) => d.id === saved)) setDeck(saved as ClozeDeck);
  }, []);

  const chooseDeck = (id: ClozeDeck) => {
    setDeck(id);
    writeStored(DECK_KEY, id);
  };

  const start = useCallback(async () => {
    if (loading) return;
    clearNewBest();
    setError(null);
    setLoading(true);
    try {
      const cards = await fetchCards({ type: deck, random: true, limit: 40 }).unwrap();
      const questions = buildQuestions(cards);
      if (questions.length === 0) throw new Error("no questions");
      dispatch({ type: "START", questions });
    } catch {
      setError("Couldn't load sentences. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [loading, clearNewBest, fetchCards, deck]);

  const answer = useCallback((option: string) => dispatch({ type: "ANSWER", option }), []);
  const next = useCallback(() => dispatch({ type: "NEXT" }), []);

  useEffect(() => {
    if (state.phase === "over") submit(state.score);
  }, [state.phase, state.score, submit]);

  // 1-4 answer, Enter continues / starts.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Enter" && !(e.target instanceof HTMLButtonElement)) {
        e.preventDefault();
        if (state.phase !== "playing") void start();
        else if (answered) next();
      } else if (state.phase === "playing" && !answered && q && /^[1-4]$/.test(e.key)) {
        const option = q.options[Number(e.key) - 1];
        if (option) answer(option);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.phase, answered, q, start, next, answer]);

  return (
    <GameFrame title="Fill in the Blanks" subtitle={DECKS.find((d) => d.id === deck)?.label ?? ""} best={best}>
      {state.phase === "lobby" && (
        <GameLobby
          hero={<TextCursorInput aria-hidden="true" strokeWidth={1.6} />}
          title="Fill in the Blanks"
          blurb="Real example sentences with the word missing. Pick the word that fits."
          rules={[
            { icon: ListChecks, text: `${QUESTIONS_PER_RUN} sentences, no clock: think it through` },
            { icon: Flame, text: "Three right in a row raises your points multiplier" },
            { icon: Lightbulb, text: "Every answer shows the meaning, so misses still teach" },
          ]}
          best={best}
          onStart={() => void start()}
          startLabel={loading ? "Loading sentences…" : "Start"}
        >
          <DeckPicker label="Practise" options={DECKS} value={deck} onChange={chooseDeck} />
          {error && <p role="alert" className="text-sm font-semibold text-rose-600 dark:text-rose-400">{error}</p>}
        </GameLobby>
      )}

      {state.phase === "playing" && q && (
        <section aria-label="Fill in the Blanks" className="flex min-h-0 w-full flex-1 flex-col gap-3 overflow-y-auto pb-1 [scrollbar-width:none]">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1.5">
              <span className="section-label">Score</span>
              <span className={`font-mono text-xl font-black tabular-nums ${tone.text}`}>{state.score}</span>
            </div>
            {state.streak >= 2 && (
              <span className="flex items-center gap-1 rounded-full border-2 border-brand-500/30 bg-[color-mix(in_oklab,var(--brand-500)_10%,var(--card))] px-2.5 py-1 text-xs font-mono font-black text-brand-700 dark:text-brand-400">
                <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                {state.streak} · x{streakMultiplier(state.streak)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ProgressBar
              value={((state.index + (answered ? 1 : 0)) / state.questions.length) * 100}
              label="Progress"
              className="h-3 flex-1 p-0"
              barClassName={`bg-gradient-to-r ${tone.timer}`}
            />
            <span className="font-mono text-sm font-black tabular-nums text-muted-foreground">
              {state.index + 1}/{state.questions.length}
            </span>
          </div>

          <div className={`rounded-2xl border-2 ${tone.border} bg-card px-4 py-5 sm:px-5`}>
            <p className="text-lg font-semibold leading-relaxed text-foreground sm:text-xl">
              {q.before}
              {answered ? (
                <span
                  className={`rounded-md px-1.5 font-extrabold ${
                    state.chosen === q.answer
                      ? "bg-[color-mix(in_oklab,var(--color-emerald-500)_15%,var(--card))] text-emerald-800 dark:text-emerald-200"
                      : "bg-[color-mix(in_oklab,var(--color-emerald-500)_15%,var(--card))] text-emerald-800 underline decoration-2 underline-offset-4 dark:text-emerald-200"
                  }`}
                >
                  {q.answer}
                </span>
              ) : (
                <span className="mx-1 inline-block min-w-[5.5rem] border-b-4 active:translate-y-[2px] active:border-b-2 border-dashed border-fuchsia-500/60 align-baseline" aria-label="blank">
                  &nbsp;
                </span>
              )}
              {q.after}
            </p>
          </div>

          <div role="group" aria-label="Options" className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
            {q.options.map((option, i) => {
              const isAnswer = option === q.answer;
              const isChosen = option === state.chosen;
              const look = answered
                ? isAnswer
                  ? "border-emerald-500/60 bg-[color-mix(in_oklab,var(--color-emerald-500)_12%,var(--card))] text-emerald-800 dark:text-emerald-200"
                  : isChosen
                    ? "border-rose-500/60 bg-[color-mix(in_oklab,var(--color-rose-500)_12%,var(--card))] text-rose-800 dark:text-rose-200"
                    : "border-border bg-card text-muted-foreground opacity-60"
                : `border-border bg-card text-foreground ${tone.optionHover}`;
              return (
                <button
                  key={option}
                  type="button"
                  disabled={answered}
                  onClick={() => answer(option)}
                  className={`flex min-h-14 items-center gap-3 rounded-2xl border-2 border-b-4 active:translate-y-[2px] active:border-b-2 px-3 py-2 text-left text-base font-bold transition-colors disabled:cursor-default ${look}`}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-black text-muted-foreground">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">{option}</span>
                  {answered && isAnswer && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
                  {answered && isChosen && !isAnswer && <X className="h-4 w-4 shrink-0" aria-hidden="true" />}
                </button>
              );
            })}
          </div>

          {answered && (
            <div className="flex flex-col gap-3">
              <p className="rounded-2xl border-2 border-border bg-[color-mix(in_oklab,var(--muted)_60%,var(--card))] px-4 py-3 text-sm leading-relaxed text-foreground">
                <span className="font-extrabold">{q.answer}</span>
                <span className="text-muted-foreground"> — {q.meaning}</span>
              </p>
              <button
                type="button"
                onClick={next}
                autoFocus
                className={cn(DUO.primary, "w-full")}
              >
                {state.index + 1 >= state.questions.length ? "See results" : "Next sentence"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}

          <p role="status" aria-live="polite" className="sr-only">
            {answered ? (state.chosen === q.answer ? "Correct" : `Wrong. The answer is ${q.answer}`) : ""}
          </p>
        </section>
      )}

      {state.phase === "over" && (
        <ResultSummary
          kicker={`${state.correctCount} of ${state.questions.length} correct`}
          rank={rankTitle(state.correctCount, state.questions.length)}
          score={state.score}
          best={best}
          isNewBest={isNewBest}
          stats={[
            { label: "Correct", value: `${state.correctCount}/${state.questions.length}` },
            {
              label: "Accuracy",
              value: `${Math.round((state.correctCount / Math.max(1, state.questions.length)) * 100)}%`,
            },
            { label: "Best streak", value: String(state.bestStreak) },
          ]}
          onPlayAgain={() => void start()}
        >
          <div className="flex flex-col gap-2">
            <h3 className="section-label">{state.misses.length > 0 ? "Words to review" : "No mistakes!"}</h3>
            {state.misses.length > 0 && (
              <ul className="flex flex-col gap-1.5">
                {state.misses.map((m) => (
                  <li key={m.id} className="rounded-2xl border-2 border-border bg-card px-3 py-2.5 text-sm">
                    <span className="font-bold text-foreground">{m.answer}</span>
                    <span className="text-muted-foreground"> — {m.meaning}</span>
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
