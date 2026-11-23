"use client";

import { useEffect, useState } from "react";
import { readStored, writeStored } from "@/lib/storage";

/**
 * XP: points for practising, and levels built on them.
 *
 * Each award has an ID that says what it was for (a question on a day, a finished set, a
 * mock), so the same thing never pays twice. Recent awards are kept one by one; once a day
 * is a month old its awards are folded into a per-day total. That keeps the record small
 * and lets two devices merge safely (server/src/progress/merge.ts): awards by ID, old days
 * by the larger total.
 */

/**
 * Off for now: XP is still counted quietly in the background, but nothing shows it
 * (no toast, no level badge) and nothing is locked by it. Set to true to turn it on.
 */
export const XP_ENABLED = false;

export const XP_KEY = "ssc:xp";
export const XP_EVENT = "ssc:xp-updated";
/** Fired with the amount just earned, for the "+XP" toast. */
export const XP_GAIN_EVENT = "ssc:xp-gain";
const KEEP_DAYS = 30;
const DAY = 86_400_000;

export type XpSource = "answer" | "review" | "set" | "practice" | "plan" | "mock";

export interface XpAward {
  at: number;
  amount: number;
  source: XpSource;
}

export interface XpRecord {
  /** Recent awards by ID. */
  awards: Record<string, XpAward>;
  /** Older days, folded: YYYY-MM-DD -> XP that day. */
  days: Record<string, number>;
}

/** What each thing is worth. */
export const XP_RULES = {
  right: 10,
  wrong: 2,
  reviewRight: 15,
  setBonus: 20,
  /** A set counts for the bonus from this many questions. */
  setMin: 5,
  practicePerRight: 3,
  practiceFinish: 10,
  /** Games, flashcards and drills together earn at most this much a day. */
  practiceDailyCap: 150,
  plan: 50,
  mockFinish: 100,
};

/** Streak bonus: x1.1 from 3 days, x1.25 from 7, x1.5 from 30. */
export function streakMultiplier(streak: number): number {
  return streak >= 30 ? 1.5 : streak >= 7 ? 1.25 : streak >= 3 ? 1.1 : 1;
}

export const dayOf = (at: number) => {
  const d = new Date(at);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/* ---------------- levels ---------------- */

const NAMES = ["Aspirant", "Learner", "Candidate", "Contender", "Qualifier", "Achiever", "Ranker", "Expert", "Topper", "Legend"];

/** XP needed to go from level n to n + 1 (gets a little bigger each level). */
export const stepFor = (n: number) => Math.round(100 * Math.pow(n, 1.5));

export interface Level {
  level: number;
  name: string;
  /** XP into this level, and the size of the level. */
  into: number;
  size: number;
  toNext: number;
}

export function levelFor(xp: number): Level {
  let level = 1;
  let floor = 0;
  while (xp >= floor + stepFor(level)) {
    floor += stepFor(level);
    level++;
  }
  const size = stepFor(level);
  return { level, name: NAMES[Math.min(Math.floor((level - 1) / 3), NAMES.length - 1)], into: xp - floor, size, toNext: floor + size - xp };
}

/* ---------------- the record ---------------- */

export function readXp(): XpRecord {
  const r = readStored<Partial<XpRecord>>(XP_KEY, {});
  return { awards: r.awards && typeof r.awards === "object" ? r.awards : {}, days: r.days && typeof r.days === "object" ? r.days : {} };
}

export function totalXp(r: XpRecord): number {
  return Object.values(r.days).reduce((n, v) => n + v, 0) + Object.values(r.awards).reduce((n, a) => n + a.amount, 0);
}

/** Fold awards older than a month into per-day totals. */
export function compact(r: XpRecord, now = Date.now()): XpRecord {
  const cutoff = now - KEEP_DAYS * DAY;
  const awards: XpRecord["awards"] = {};
  const folded: Record<string, number> = {};
  for (const [id, a] of Object.entries(r.awards)) {
    if (a.at >= cutoff) awards[id] = a;
    else folded[dayOf(a.at)] = (folded[dayOf(a.at)] ?? 0) + a.amount;
  }
  const days = { ...r.days };
  for (const [d, n] of Object.entries(folded)) days[d] = Math.max(days[d] ?? 0, n);
  return { awards, days };
}

/** XP earned today from games, flashcards and drills (for the daily cap). */
function practiceToday(r: XpRecord, now: number): number {
  const today = dayOf(now);
  return Object.values(r.awards)
    .filter((a) => a.source === "practice" && dayOf(a.at) === today)
    .reduce((n, a) => n + a.amount, 0);
}

export interface NewAward {
  /** What it was for; the same ID never pays twice. */
  id: string;
  source: XpSource;
  amount: number;
}

/**
 * Add awards (skipping any already given), apply the streak bonus and the daily cap,
 * save, and announce the gain. Returns the XP actually added.
 */
export function awardXp(items: NewAward[], streak = 0, now = Date.now()): number {
  if (typeof window === "undefined" || items.length === 0) return 0;
  const r = readXp();
  const mult = streakMultiplier(streak);
  let room = XP_RULES.practiceDailyCap - practiceToday(r, now);
  let gained = 0;
  for (const it of items) {
    if (r.awards[it.id] || it.amount <= 0) continue;
    let amount = Math.round(it.amount * mult);
    if (it.source === "practice") {
      amount = Math.min(amount, Math.max(0, room));
      room -= amount;
    }
    if (amount <= 0) continue;
    r.awards[it.id] = { at: now, amount, source: it.source };
    gained += amount;
  }
  if (gained === 0) return 0;
  const before = totalXp(readXp());
  writeStored(XP_KEY, compact(r, now));
  window.dispatchEvent(new Event(XP_EVENT));
  const after = before + gained;
  window.dispatchEvent(new CustomEvent(XP_GAIN_EVENT, { detail: { amount: gained, total: after, levelUp: levelFor(after).level > levelFor(before).level ? levelFor(after) : null } }));
  return gained;
}

/** Live XP total and level. */
export function useXp() {
  const [xp, setXp] = useState<number | null>(null);
  useEffect(() => {
    const load = () => setXp(totalXp(readXp()));
    load();
    window.addEventListener(XP_EVENT, load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener(XP_EVENT, load);
      window.removeEventListener("storage", load);
    };
  }, []);
  return { xp: xp ?? 0, ready: xp !== null, level: levelFor(xp ?? 0) };
}
