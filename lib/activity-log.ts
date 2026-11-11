"use client";

import { useEffect, useState } from "react";
import { readStored, writeStored } from "@/lib/storage";
import type { SubjectKey } from "@/lib/subject-theme";

/**
 * On-device record of finished practice and the mistakes made in it. Feeds
 * the dashboard (continue, this week, subjects, mistakes) until answers are
 * saved on the server, at which point the same shapes can come from the API.
 */

export type ActivityKind = "drill" | "pyq" | "cards" | "game";

export interface ActivityEntry {
  id: string;
  at: number;
  kind: ActivityKind;
  subject: SubjectKey;
  label: string;
  href: string;
  correct?: number;
  total?: number;
}

export interface MistakeEntry {
  id: string;
  at: number;
  subject: SubjectKey;
  /** Where it happened, e.g. "Fill in the Blanks". */
  source: string;
  prompt: string;
  answer: string;
  detail?: string;
  href: string;
  /** Answer choices (incl. the answer) when the source had them; enables multiple choice in review. */
  options?: string[];
  /** Days (YYYY-MM-DD) it was answered right in review. Two different days = mastered. */
  rightDays?: string[];
}

/** Right in review on this many different days and a mistake leaves the list. */
export const MASTERY_DAYS = 2;

const ACTIVITY_KEY = "ssc:activity";
const MISTAKES_KEY = "ssc:mistakes";
const MASTERED_KEY = "ssc:mistakes-mastered";
export const ACTIVITY_EVENT = "ssc:activity-updated";
const MAX_ACTIVITY = 300;
const MAX_MISTAKES = 150;

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/** Readable name and subject for a practice route, used when a screen logs itself. */
export function describeRoute(path: string): { label: string; subject: SubjectKey; kind: ActivityKind } {
  const p = path.toLowerCase();
  const subject: SubjectKey = p.includes("/maths")
    ? "maths"
    : p.includes("/reasoning")
      ? "reasoning"
      : p.includes("/gk")
        ? "gk"
        : "english";
  const named: [RegExp, string][] = [
    [/match-the-following/, "Match the Following"],
    [/fill-in-the-blanks/, "Fill in the Blanks"],
    [/spelling-sprint/, "Spelling Check"],
    [/word-of-the-day/, "Word of the Day"],
    [/odd-link/, "Odd Link"],
    [/hangman/, "Hangman"],
    [/\/maths\/match/, "Maths Match the Pairs"],
    [/\/reasoning\/match/, "Reasoning Match the Pairs"],
    [/topic-pyqs/, "Topic-wise PYQs"],
    [/sectional-pyqs/, "Sectional PYQs"],
  ];
  const drill = p.match(/speed-drills\/([a-z-]+)/);
  if (drill) {
    const name = drill[1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return { label: `${name} drill`, subject: "reasoning", kind: "game" };
  }
  const maths = p.match(/mental-maths\/([a-z_]+)/);
  if (maths) {
    const name = maths[1].replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return { label: `${name} speed drill`, subject: "maths", kind: "drill" };
  }
  const hit = named.find(([re]) => re.test(p));
  const kind: ActivityKind = /pyqs/.test(p) ? "pyq" : /flashcards/.test(p) ? "cards" : "game";
  return { label: hit?.[1] ?? "Practice", subject, kind };
}

export function readActivity(): ActivityEntry[] {
  return readStored<ActivityEntry[]>(ACTIVITY_KEY, []);
}

export function readMistakes(): MistakeEntry[] {
  return readStored<MistakeEntry[]>(MISTAKES_KEY, []);
}

function notify() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(ACTIVITY_EVENT));
}

export function logActivity(entry: Omit<ActivityEntry, "id" | "at">, at = Date.now()): void {
  const next = [{ ...entry, id: uid(), at }, ...readActivity()].slice(0, MAX_ACTIVITY);
  writeStored(ACTIVITY_KEY, next);
  notify();
}

export function logMistakes(items: Omit<MistakeEntry, "id" | "at">[], at = Date.now()): void {
  if (items.length === 0) return;
  // Newest first; a repeat of the same prompt replaces the older copy.
  const fresh = items.map((m) => ({ ...m, id: uid(), at }));
  const prompts = new Set(fresh.map((m) => m.prompt));
  const next = [...fresh, ...readMistakes().filter((m) => !prompts.has(m.prompt))].slice(0, MAX_MISTAKES);
  writeStored(MISTAKES_KEY, next);
  notify();
}

const localDay = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/**
 * Record a review answer. Right on MASTERY_DAYS different days removes the
 * mistake (counted as mastered); a wrong answer starts the count again.
 * Returns true when the mistake was just mastered.
 */
export function recordReview(id: string, correct: boolean, date = new Date()): boolean {
  const list = readMistakes();
  const entry = list.find((m) => m.id === id);
  if (!entry) return false;
  const today = localDay(date);
  const rightDays = correct ? [...new Set([...(entry.rightDays ?? []), today])] : [];
  const mastered = rightDays.length >= MASTERY_DAYS;
  writeStored(
    MISTAKES_KEY,
    mastered ? list.filter((m) => m.id !== id) : list.map((m) => (m.id === id ? { ...m, rightDays } : m)),
  );
  if (mastered) writeStored(MASTERED_KEY, [date.getTime(), ...readStored<number[]>(MASTERED_KEY, [])].slice(0, 500));
  notify();
  return mastered;
}

/** When mistakes were mastered (newest first). */
export function readMastered(): number[] {
  return readStored<number[]>(MASTERED_KEY, []);
}

/** Was this mistake already answered right today? */
export function reviewedToday(m: MistakeEntry, date = new Date()): boolean {
  return (m.rightDays ?? []).includes(localDay(date));
}

/**
 * Up to `count` mistakes to review: ones not yet right today come first,
 * oldest mistakes first within that.
 */
export function pickForReview(list: MistakeEntry[], count = 10, date = new Date()): MistakeEntry[] {
  return [...list]
    .sort((a, b) => Number(reviewedToday(a, date)) - Number(reviewedToday(b, date)) || a.at - b.at)
    .slice(0, count);
}

export function dismissMistake(id: string): void {
  writeStored(
    MISTAKES_KEY,
    readMistakes().filter((m) => m.id !== id),
  );
  notify();
}

/** Monday 00:00 (local) of the week containing `now`. */
export function startOfWeek(now = new Date()): Date {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - day);
  return d;
}

export interface WeekStats {
  sessions: number;
  questions: number;
  correct: number;
  accuracy: number | null;
  /** Monday..Sunday: practised that day? */
  activeDays: boolean[];
}

export function weekStats(activities: ActivityEntry[], now = new Date()): WeekStats {
  const start = startOfWeek(now).getTime();
  const week = activities.filter((a) => a.at >= start && a.at <= now.getTime());
  const activeDays = Array(7).fill(false) as boolean[];
  let questions = 0;
  let correct = 0;
  for (const a of week) {
    activeDays[(new Date(a.at).getDay() + 6) % 7] = true;
    if (typeof a.total === "number" && typeof a.correct === "number") {
      questions += a.total;
      correct += a.correct;
    }
  }
  return {
    sessions: week.length,
    questions,
    correct,
    accuracy: questions > 0 ? Math.round((correct / questions) * 100) : null,
    activeDays,
  };
}

export interface SubjectStats {
  sessions: number;
  questions: number;
  accuracy: number | null;
  lastAt: number | null;
}

/** Last 30 days in one subject. */
export function subjectStats(activities: ActivityEntry[], subject: SubjectKey, now = Date.now()): SubjectStats {
  const since = now - 30 * 86_400_000;
  const items = activities.filter((a) => a.subject === subject && a.at >= since);
  let questions = 0;
  let correct = 0;
  for (const a of items) {
    if (typeof a.total === "number" && typeof a.correct === "number") {
      questions += a.total;
      correct += a.correct;
    }
  }
  return {
    sessions: items.length,
    questions,
    accuracy: questions > 0 ? Math.round((correct / questions) * 100) : null,
    lastAt: items[0]?.at ?? null,
  };
}

/** "just now", "5 min ago", "3 h ago", "yesterday", "4 days ago". */
export function timeAgo(at: number, now = Date.now()): string {
  const min = Math.round((now - at) / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} h ago`;
  const days = Math.round(h / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
}

/** Live view of the log (updates on new entries, other tabs and window focus). */
export function useActivityLog() {
  const [state, setState] = useState<{ activities: ActivityEntry[]; mistakes: MistakeEntry[]; ready: boolean }>({
    activities: [],
    mistakes: [],
    ready: false,
  });
  useEffect(() => {
    const load = () => setState({ activities: readActivity(), mistakes: readMistakes(), ready: true });
    load();
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === ACTIVITY_KEY || e.key === MISTAKES_KEY) load();
    };
    window.addEventListener(ACTIVITY_EVENT, load);
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", load);
    return () => {
      window.removeEventListener(ACTIVITY_EVENT, load);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", load);
    };
  }, []);
  return state;
}

/** Strip markdown and LaTeX markers so a question reads cleanly in a short line. */
export function plainText(text: string, max = 140): string {
  const clean = text
    .replace(/\$\$?([^$]+)\$\$?/g, "$1")
    .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, "$1/$2")
    .replace(/\\[a-zA-Z]+\{([^}]*)\}/g, "$1")
    .replace(/\\[a-zA-Z]+/g, "")
    .replace(/[*_`#>{}]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
}
