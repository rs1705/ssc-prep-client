"use client";

import { onStoredChange, readStored, removeStored, writeStored } from "@/lib/storage";
import { ACTIVITY_EVENT, MISTAKES_REMOVED_KEY } from "@/lib/activity-log";
import { PLAN_EVENT } from "@/lib/today-plan";
import { UNFINISHED_PREFIX, UNFINISHED_REMOVED_KEY } from "@/features/games/unfinished";
import { EXAM_DATE_AT_KEY, EXAM_DATE_EVENT, EXAM_DATE_KEY } from "@/components/custom/exam-countdown";

/**
 * Account sync. Progress is still saved on the device first (so the app works
 * offline and signed out); when signed in, the whole progress document is sent
 * to the server, which merges it with the account's copy (server/src/progress/
 * merge.ts) and returns the result for the device to adopt.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const ACTIVITY_KEY = "ssc:activity";
const MISTAKES_KEY = "ssc:mistakes";
const MASTERED_KEY = "ssc:mistakes-mastered";
const PLAN_PREFIX = "ssc:plan:";
const STREAK_KEY = "ssc:plan-streak";
/** Which account the progress on this device belongs to. */
export const OWNER_KEY = "ssc:sync-owner";
const LAST_SYNC_KEY = "ssc:sync-last";
export const SYNC_EVENT = "ssc:sync-state";

export type SyncState = "idle" | "syncing" | "synced" | "offline";

export interface ProgressDoc {
  version: 1;
  activities: { id: string; at: number }[];
  mistakes: { id: string; at: number; prompt: string; rightDays?: string[] }[];
  mistakesRemoved: { prompt: string; at: number }[];
  mastered: number[];
  plan: Record<string, Record<string, number>>;
  planStreak: { last: string | null; count: number };
  unfinished: Record<string, { at: number; path: string }>;
  unfinishedRemoved: { path: string; at: number }[];
  examDate: { value: string | null; at: number };
}

function localKeys(): string[] {
  try {
    return Array.from({ length: window.localStorage.length }, (_, i) => window.localStorage.key(i) ?? "");
  } catch {
    return [];
  }
}

/** Is this one of the keys that make up synced progress? */
export function isSyncedKey(key: string): boolean {
  return (
    key === ACTIVITY_KEY ||
    key === MISTAKES_KEY ||
    key === MISTAKES_REMOVED_KEY ||
    key === MASTERED_KEY ||
    key === STREAK_KEY ||
    key === UNFINISHED_REMOVED_KEY ||
    key === EXAM_DATE_KEY ||
    key === EXAM_DATE_AT_KEY ||
    key.startsWith(PLAN_PREFIX) ||
    key.startsWith(UNFINISHED_PREFIX)
  );
}

/** Everything on this device that syncs, as one document. */
export function buildLocalDoc(): ProgressDoc {
  const keys = localKeys();
  const plan: ProgressDoc["plan"] = {};
  const unfinished: ProgressDoc["unfinished"] = {};
  for (const key of keys) {
    if (key.startsWith(PLAN_PREFIX)) plan[key.slice(PLAN_PREFIX.length)] = readStored(key, {});
    else if (key.startsWith(UNFINISHED_PREFIX)) {
      const entry = readStored<{ at: number; path: string } | null>(key, null);
      if (entry) unfinished[entry.path ?? key.slice(UNFINISHED_PREFIX.length)] = entry;
    }
  }
  const examDate = readStored<string | null>(EXAM_DATE_KEY, null);
  return {
    version: 1,
    activities: readStored(ACTIVITY_KEY, []),
    mistakes: readStored(MISTAKES_KEY, []),
    mistakesRemoved: readStored(MISTAKES_REMOVED_KEY, []),
    mastered: readStored(MASTERED_KEY, []),
    plan,
    planStreak: readStored(STREAK_KEY, { last: null, count: 0 }),
    unfinished,
    unfinishedRemoved: readStored(UNFINISHED_REMOVED_KEY, []),
    // A date set before sync existed has no time: treat it as old so a newer choice wins.
    examDate: { value: examDate, at: readStored<number>(EXAM_DATE_AT_KEY, examDate ? 1 : 0) },
  };
}

let applying = false;

/** Write a (merged) document back to the device and tell the screens. */
export function applyDoc(doc: ProgressDoc): void {
  applying = true;
  try {
    writeStored(ACTIVITY_KEY, doc.activities);
    writeStored(MISTAKES_KEY, doc.mistakes);
    writeStored(MISTAKES_REMOVED_KEY, doc.mistakesRemoved);
    writeStored(MASTERED_KEY, doc.mastered);
    for (const [day, steps] of Object.entries(doc.plan)) writeStored(PLAN_PREFIX + day, steps);
    writeStored(STREAK_KEY, doc.planStreak);
    writeStored(UNFINISHED_REMOVED_KEY, doc.unfinishedRemoved);
    for (const key of localKeys()) {
      if (key.startsWith(UNFINISHED_PREFIX) && !doc.unfinished[key.slice(UNFINISHED_PREFIX.length)]) removeStored(key);
    }
    for (const [path, entry] of Object.entries(doc.unfinished)) writeStored(UNFINISHED_PREFIX + path, entry);
    if (doc.examDate.value) {
      writeStored(EXAM_DATE_KEY, doc.examDate.value);
      writeStored(EXAM_DATE_AT_KEY, doc.examDate.at);
    }
  } finally {
    applying = false;
  }
  for (const event of [ACTIVITY_EVENT, PLAN_EVENT, EXAM_DATE_EVENT]) window.dispatchEvent(new Event(event));
}

/** Remove synced progress from this device (another account is signing in, or sign-out). */
export function clearLocalProgress(): void {
  applying = true;
  try {
    for (const key of localKeys()) if (isSyncedKey(key)) removeStored(key);
    removeStored(LAST_SYNC_KEY);
  } finally {
    applying = false;
  }
  for (const event of [ACTIVITY_EVENT, PLAN_EVENT, EXAM_DATE_EVENT]) window.dispatchEvent(new Event(event));
}

function setState(state: SyncState) {
  window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { state } }));
}

type TokenGetter = () => Promise<string | null>;

let getToken: TokenGetter | null = null;
let timer: number | null = null;
let inFlight: Promise<void> | null = null;
let again = false;

/** Send this device's progress and adopt the merged result. */
export async function syncNow(): Promise<void> {
  if (!getToken) return;
  if (inFlight) {
    again = true;
    return inFlight;
  }
  inFlight = (async () => {
    try {
      const token = await getToken?.();
      if (!token) return;
      setState("syncing");
      const sent = JSON.stringify({ data: buildLocalDoc() });
      const res = await fetch(`${API_URL}/me/progress`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: sent,
      });
      if (!res.ok) throw new Error(`sync failed: ${res.status}`);
      const merged = (await res.json()) as ProgressDoc;
      // Something changed on the device while the request was out (this tab or
      // another): don't overwrite it with the older merge, send it again instead.
      if (JSON.stringify({ data: buildLocalDoc() }) !== sent) {
        again = true;
        return;
      }
      applyDoc(merged);
      writeStored(LAST_SYNC_KEY, Date.now());
      setState("synced");
    } catch {
      setState("offline"); // Kept on the device; the next sync sends it.
    } finally {
      inFlight = null;
      if (again) {
        again = false;
        scheduleSync(500);
      }
    }
  })();
  return inFlight;
}

export function scheduleSync(delay = 2000): void {
  if (!getToken || typeof window === "undefined") return;
  if (timer) window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    timer = null;
    void syncNow();
  }, delay);
}

let unsubscribe: (() => void) | null = null;

/**
 * Start syncing for a signed-in user. Progress on the device that belongs to a
 * different account is cleared first; progress made while signed out is
 * uploaded to this account.
 */
export function startProgressSync(uid: string, tokenGetter: TokenGetter): () => void {
  const owner = readStored<string | null>(OWNER_KEY, null);
  if (owner && owner !== uid) clearLocalProgress();
  writeStored(OWNER_KEY, uid);
  getToken = tokenGetter;

  unsubscribe?.();
  unsubscribe = onStoredChange((key) => {
    if (!applying && isSyncedKey(key)) scheduleSync();
  });

  let lastFocus = 0;
  const onFocus = () => {
    if (Date.now() - lastFocus < 30_000) return;
    lastFocus = Date.now();
    void syncNow();
  };
  const onOnline = () => void syncNow();
  window.addEventListener("focus", onFocus);
  window.addEventListener("online", onOnline);
  void syncNow();

  return () => {
    unsubscribe?.();
    unsubscribe = null;
    getToken = null;
    if (timer) window.clearTimeout(timer);
    window.removeEventListener("focus", onFocus);
    window.removeEventListener("online", onOnline);
  };
}
