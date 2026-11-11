"use client";

import { useEffect, useState } from "react";
import { readStored, writeStored } from "@/lib/storage";

/**
 * "Today's 15 minutes": a small daily plan that rotates by date and ticks
 * itself off as the student practises. Everything is kept on this device for
 * now; the same shape can later come from the server.
 */

export type PlanStepId = "drill" | "pyq" | "cards" | "game";

export interface PlanStep {
  id: PlanStepId;
  title: string;
  detail: string;
  href: string;
  minutes: number;
  /** How much activity completes the step (e.g. 10 flashcards). */
  target: number;
  unit: string;
}

export type PlanProgress = Record<PlanStepId, number>;

const PROGRESS_PREFIX = "ssc:plan:";
const STREAK_KEY = "ssc:plan-streak";
export const PLAN_EVENT = "ssc:plan-updated";
/** Fired once, at the moment a step goes from not done to done. */
export const PLAN_STEP_DONE_EVENT = "ssc:plan-step-done";

export interface PlanStepDoneDetail {
  step: PlanStep;
  done: number;
  total: number;
  /** The step to do next, or null when the whole plan is finished. */
  next: PlanStep | null;
  complete: boolean;
  streak: number;
}

const EMPTY: PlanProgress = { drill: 0, pyq: 0, cards: 0, game: 0 };

/** Local calendar day, e.g. "2026-11-11". */
export function dayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Days since 1970 in local time: a stable index for rotating content. */
export function dayNumber(date: Date): number {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
}

const DRILLS = [
  { id: "multiplication", name: "Multiplication" },
  { id: "squares", name: "Squares" },
  { id: "percentage", name: "Percentage" },
  { id: "simplification", name: "Simplification" },
  { id: "square_roots", name: "Square roots" },
  { id: "cubes", name: "Cubes" },
  { id: "division", name: "Division" },
];

const PYQ_SUBJECTS = [
  { id: "maths", name: "Maths" },
  { id: "english", name: "English" },
  { id: "reasoning", name: "Reasoning" },
  { id: "gk", name: "General Knowledge" },
];

const CARD_DECKS = [
  { href: "/SSC/english/flashcards/freestyle", name: "English vocabulary" },
  { href: "/SSC/maths/flashcards", name: "Maths tables and formulas" },
];

const GAMES = [
  { href: "/SSC/english/games/match-the-following", name: "Match the Following" },
  { href: "/SSC/reasoning/speed-drills/coding-decoding", name: "Coding-Decoding drill" },
  { href: "/SSC/english/games/fill-in-the-blanks", name: "Fill in the Blanks" },
  { href: "/SSC/maths/match", name: "Maths Match the Pairs" },
  { href: "/SSC/english/hangman", name: "Hangman" },
  { href: "/SSC/reasoning/speed-drills/number-series", name: "Number Series drill" },
  { href: "/SSC/english/games/spelling-sprint", name: "Spelling Check" },
];

const pick = <T,>(items: T[], n: number, offset = 0) => items[(n + offset) % items.length];

/** The plan for a given day (same day, same plan). */
export function buildPlan(date = new Date()): PlanStep[] {
  const n = dayNumber(date);
  const drill = pick(DRILLS, n);
  const subject = pick(PYQ_SUBJECTS, n);
  const deck = pick(CARD_DECKS, n);
  const game = pick(GAMES, n, 3);
  return [
    {
      id: "drill",
      title: `${drill.name} speed drill`,
      detail: "One 60-second timed round",
      href: `/SSC/maths/mental-maths/${drill.id}`,
      minutes: 2,
      target: 1,
      unit: "drill",
    },
    {
      id: "pyq",
      title: `${subject.name} PYQs`,
      detail: "One set of real past-paper questions",
      href: `/SSC/${subject.id}/topic-pyqs`,
      minutes: 6,
      target: 1,
      unit: "set",
    },
    {
      id: "cards",
      title: "10 flashcards",
      detail: deck.name,
      href: deck.href,
      minutes: 4,
      target: 10,
      unit: "cards",
    },
    {
      id: "game",
      title: game.name,
      detail: "One quick game to finish",
      href: game.href,
      minutes: 3,
      target: 1,
      unit: "game",
    },
  ];
}

export function readProgress(date = new Date()): PlanProgress {
  return { ...EMPTY, ...readStored<Partial<PlanProgress>>(PROGRESS_PREFIX + dayKey(date), {}) };
}

export function isStepDone(step: PlanStep, progress: PlanProgress): boolean {
  return progress[step.id] >= step.target;
}

interface StreakRecord {
  last: string | null;
  count: number;
}

/** Consecutive days the whole plan was finished (still alive if yesterday counts). */
export function readStreak(today = new Date()): number {
  const s = readStored<StreakRecord>(STREAK_KEY, { last: null, count: 0 });
  if (!s.last) return 0;
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return s.last === dayKey(today) || s.last === dayKey(yesterday) ? s.count : 0;
}

/**
 * Record practice towards today's plan. Called by drills, PYQ sets,
 * flashcards and games when the student finishes something.
 */
export function recordPlanActivity(step: PlanStepId, amount = 1, date = new Date()): void {
  if (typeof window === "undefined") return;
  const plan = buildPlan(date);
  const before = readProgress(date);
  const wasComplete = plan.every((s) => isStepDone(s, before));
  const after = { ...before, [step]: before[step] + amount };
  writeStored(PROGRESS_PREFIX + dayKey(date), after);

  if (!wasComplete && plan.every((s) => isStepDone(s, after))) {
    const today = dayKey(date);
    const yesterday = new Date(date);
    yesterday.setDate(date.getDate() - 1);
    const s = readStored<StreakRecord>(STREAK_KEY, { last: null, count: 0 });
    const count = s.last === today ? s.count : s.last === dayKey(yesterday) ? s.count + 1 : 1;
    writeStored<StreakRecord>(STREAK_KEY, { last: today, count });
  }
  window.dispatchEvent(new Event(PLAN_EVENT));

  const stepDef = plan.find((s) => s.id === step);
  if (stepDef && !isStepDone(stepDef, before) && isStepDone(stepDef, after)) {
    const done = plan.filter((s) => isStepDone(s, after)).length;
    const detail: PlanStepDoneDetail = {
      step: stepDef,
      done,
      total: plan.length,
      next: plan.find((s) => !isStepDone(s, after)) ?? null,
      complete: done === plan.length,
      streak: readStreak(date),
    };
    window.dispatchEvent(new CustomEvent(PLAN_STEP_DONE_EVENT, { detail }));
  }
}

/** Today's plan, live: re-reads when activity is recorded (also from other tabs). */
export function useTodayPlan() {
  const [state, setState] = useState<{ plan: PlanStep[]; progress: PlanProgress; streak: number; ready: boolean }>({
    plan: buildPlan(),
    progress: EMPTY,
    streak: 0,
    ready: false,
  });

  useEffect(() => {
    const load = () => setState({ plan: buildPlan(), progress: readProgress(), streak: readStreak(), ready: true });
    load();
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key.startsWith(PROGRESS_PREFIX) || e.key === STREAK_KEY) load();
    };
    window.addEventListener(PLAN_EVENT, load);
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", load);
    return () => {
      window.removeEventListener(PLAN_EVENT, load);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", load);
    };
  }, []);

  const done = state.plan.filter((s) => isStepDone(s, state.progress)).length;
  const next = state.plan.find((s) => !isStepDone(s, state.progress)) ?? null;
  const minutesLeft = state.plan.filter((s) => !isStepDone(s, state.progress)).reduce((m, s) => m + s.minutes, 0);
  return { ...state, done, total: state.plan.length, next, minutesLeft };
}
