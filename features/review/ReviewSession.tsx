"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { ArrowRight, Check, Eye, LayoutDashboard, RotateCcw, Sparkles } from "lucide-react";
import { DUO } from "@/features/games/buttons";
import { playFeedback } from "@/features/games/feedback";
import { GameFrame } from "@/features/games/GameFrame";
import { shuffle } from "@/features/games/sessionSet";
import { ProgressBar } from "@/components/custom/ProgressBar";
import {
  MASTERY_DAYS,
  pickForReview,
  readMistakes,
  recordReview,
  type MistakeEntry,
} from "@/lib/activity-log";
import { subjectTheme } from "@/lib/subject-theme";
import { cn } from "@/lib/utils";
import { ChoiceOption, choiceState } from "@/features/pyq/ChoiceOption";

const PER_SESSION = 10;

interface Card {
  mistake: MistakeEntry;
  /** Multiple choice when the mistake came with options; otherwise reveal-and-rate. */
  options: string[] | null;
}

function toCard(m: MistakeEntry): Card {
  const opts = m.options && m.options.includes(m.answer) && m.options.length >= 2 ? shuffle([...new Set(m.options)]) : null;
  return { mistake: m, options: opts };
}

type Phase = "loading" | "empty" | "playing" | "over";

/**
 * Quick review of saved mistakes. Right on two different days and a mistake
 * is mastered and leaves the list; wrong starts its count again.
 */
export function ReviewSession() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [cards, setCards] = useState<Card[]>([]);
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [graded, setGraded] = useState<boolean | null>(null);
  const [right, setRight] = useState(0);
  const [mastered, setMastered] = useState(0);
  const [left, setLeft] = useState(0);

  const begin = useCallback(() => {
    const picked = pickForReview(readMistakes(), PER_SESSION).map(toCard);
    setCards(picked);
    setIndex(0);
    setChosen(null);
    setRevealed(false);
    setGraded(null);
    setRight(0);
    setMastered(0);
    setPhase(picked.length > 0 ? "playing" : "empty");
  }, []);

  useEffect(() => {
    begin();
  }, [begin]);

  const card = cards[index];
  const theme = card ? subjectTheme(card.mistake.subject) : null;

  const grade = useCallback(
    (correct: boolean) => {
      if (!card || graded !== null) return;
      setGraded(correct);
      setRevealed(true);
      playFeedback(correct ? "correct" : "wrong");
      if (correct) setRight((n) => n + 1);
      if (recordReview(card.mistake.id, correct)) setMastered((n) => n + 1);
    },
    [card, graded],
  );

  const choose = (option: string) => {
    if (graded !== null || !card) return;
    setChosen(option);
    grade(option === card.mistake.answer);
  };

  const next = useCallback(() => {
    if (index + 1 >= cards.length) {
      setLeft(readMistakes().length);
      setPhase("over");
      playFeedback("finish");
      return;
    }
    setIndex((i) => i + 1);
    setChosen(null);
    setRevealed(false);
    setGraded(null);
  }, [index, cards.length]);

  // Keyboard: 1-4 choose, Space reveals, Enter goes on.
  useEffect(() => {
    if (phase !== "playing" || !card) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Enter" && graded !== null) {
        e.preventDefault();
        next();
      } else if (card.options && graded === null && /^[1-4]$/.test(e.key)) {
        const option = card.options[Number(e.key) - 1];
        if (option) choose(option);
      } else if (!card.options && !revealed && e.key === " ") {
        e.preventDefault();
        setRevealed(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // choose is recreated each render; the listener re-binds with the card.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, card, graded, revealed, next]);

  useEffect(() => {
    if (phase !== "over" || mastered === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.4 } });
  }, [phase, mastered]);

  const subtitle = useMemo(
    () => (phase === "playing" ? `${index + 1} of ${cards.length}` : `Right on ${MASTERY_DAYS} different days to master`),
    [phase, index, cards.length],
  );

  return (
    <GameFrame title="Mistakes review" subtitle={subtitle} backHref="/dashboard" backLabel="Back to dashboard">
      {phase === "loading" && <div className="flex-1" />}

      {phase === "empty" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500 text-white">
            <Check className="h-8 w-8" aria-hidden="true" />
          </span>
          <h2 className="text-2xl font-extrabold text-foreground">Nothing to review</h2>
          <p className="max-w-xs text-sm text-muted-foreground">
            Wrong answers from games, drills and PYQ sets land here. Come back after your next session.
          </p>
          <Link href="/dashboard" className={cn(DUO.primary, "mt-2")}>
            <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
            Dashboard
          </Link>
        </div>
      )}

      {phase === "playing" && card && theme && (
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto [scrollbar-width:none]">
          <ProgressBar value={(index / cards.length) * 100} label="Review progress" className="h-2 p-0" barClassName="bg-brand-500" />

          <div className="flex flex-col gap-2">
            <p className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <span className={cn("h-2.5 w-2.5 rounded-full", theme.dot)} aria-hidden="true" />
              {card.mistake.source}
              {(card.mistake.rightDays?.length ?? 0) > 0 && (
                <span className="rounded-full bg-[color-mix(in_oklab,var(--color-emerald-500)_12%,var(--card))] px-2 py-0.5 text-emerald-700 dark:text-emerald-300">
                  1 more right day to master
                </span>
              )}
            </p>
            <p className="text-lg font-bold leading-relaxed text-foreground">{card.mistake.prompt}</p>
          </div>

          {card.options ? (
            <div className="flex flex-col gap-2" role="radiogroup" aria-label="Options">
              {card.options.map((o, i) => (
                <ChoiceOption
                  key={o}
                  label={String.fromCharCode(65 + i)}
                  state={choiceState({ revealed: graded !== null, isAnswer: o === card.mistake.answer, isChosen: o === chosen })}
                  role="radio"
                  aria-checked={o === chosen}
                  disabled={graded !== null}
                  onClick={() => choose(o)}
                >
                  {o}
                </ChoiceOption>
              ))}
            </div>
          ) : !revealed ? (
            <button type="button" onClick={() => setRevealed(true)} className={cn(DUO.secondary, "w-full")}>
              <Eye className="h-4 w-4" aria-hidden="true" />
              Show answer
            </button>
          ) : (
            <div className="rounded-2xl border-2 border-border bg-card p-4">
              <p className="text-xs font-semibold text-muted-foreground">Answer</p>
              <p className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300">{card.mistake.answer}</p>
            </div>
          )}

          {revealed && card.mistake.detail && (
            <p className="rounded-2xl border-2 border-border bg-[color-mix(in_oklab,var(--muted)_50%,var(--card))] p-3 text-sm text-muted-foreground">
              {card.mistake.detail}
            </p>
          )}

          <div className="mt-auto flex flex-col gap-2 border-t-2 border-border pt-3">
            {!card.options && revealed && graded === null ? (
              <div className="flex gap-2">
                <button type="button" onClick={() => grade(false)} className={cn(DUO.secondary, "flex-1 px-3")}>
                  Still learning
                </button>
                <button type="button" onClick={() => grade(true)} className={cn(DUO.success, "flex-1 px-3")}>
                  I knew it
                </button>
              </div>
            ) : graded !== null ? (
              <button type="button" onClick={next} autoFocus className={cn(DUO.primary, "w-full")}>
                {index + 1 >= cards.length ? "See summary" : "Next"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : (
              <p className="text-center text-xs text-muted-foreground">
                {card.options ? "Pick the right answer (1-4)" : "Try to recall it, then show the answer"}
              </p>
            )}
          </div>
        </div>
      )}

      {phase === "over" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <span className="section-label">Review done</span>
          <h2 className="text-2xl font-extrabold text-foreground">
            {right} of {cards.length} right
          </h2>
          <dl className="grid w-full max-w-sm grid-cols-2 gap-2">
            <div className="rounded-2xl border-2 border-border bg-card px-2 py-3">
              <dd className="flex items-center justify-center gap-1 text-xl font-extrabold text-emerald-700 dark:text-emerald-300">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {mastered}
              </dd>
              <dt className="text-xs font-semibold text-muted-foreground">Mastered now</dt>
            </div>
            <div className="rounded-2xl border-2 border-border bg-card px-2 py-3">
              <dd className="text-xl font-extrabold text-foreground">{left}</dd>
              <dt className="text-xs font-semibold text-muted-foreground">Still to review</dt>
            </div>
          </dl>
          <p className="max-w-xs text-sm text-muted-foreground">
            Mistakes you got right today come back on another day. Right again then, and they are mastered.
          </p>
          <div className="flex w-full max-w-sm flex-col gap-2 sm:flex-row">
            {left > 0 && (
              <button type="button" onClick={begin} className={cn(DUO.primary, "flex-1")}>
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Review more
              </button>
            )}
            <Link href="/dashboard" className={cn(left > 0 ? DUO.secondary : DUO.primary, "flex-1")}>
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </GameFrame>
  );
}
