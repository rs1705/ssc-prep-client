"use client";

import { useEffect, useState } from "react";
import { readStored, removeStored, writeStored } from "@/lib/storage";
import { ACTIVITY_EVENT } from "@/lib/activity-log";
import type { SubjectKey } from "@/lib/subject-theme";

/**
 * Half-finished untimed sessions (PYQ practice sets, Fill in the Blanks),
 * saved after every answer so the student can resume them later. Timed games
 * don't use this: a paused clock would make the score meaningless.
 */

export const UNFINISHED_PREFIX = "ssc:unfinished:";
const PREFIX = UNFINISHED_PREFIX;
/** Older than this, an unfinished session is dropped. */
export const UNFINISHED_MAX_AGE_MS = 3 * 86_400_000;
export const RESUME_PARAM = "resume";

export interface Unfinished<T = unknown> {
  at: number;
  path: string;
  label: string;
  subject: SubjectKey;
  /** Questions answered so far, and in total. */
  done: number;
  total: number;
  state: T;
}

const key = (path: string) => PREFIX + path.split("?")[0];

function notify() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(ACTIVITY_EVENT));
}

export function saveUnfinished<T>(entry: Omit<Unfinished<T>, "at">, at = Date.now()): void {
  writeStored<Unfinished<T>>(key(entry.path), { ...entry, at });
  notify();
}

export function loadUnfinished<T>(path: string, now = Date.now()): Unfinished<T> | null {
  const entry = readStored<Unfinished<T> | null>(key(path), null);
  if (!entry || now - entry.at > UNFINISHED_MAX_AGE_MS || entry.done >= entry.total) return null;
  return entry;
}

/** Removed sessions, remembered so another device's copy doesn't come back. */
export const UNFINISHED_REMOVED_KEY = "ssc:unfinished-removed";

export function clearUnfinished(path: string, at = Date.now()): void {
  const clean = path.split("?")[0];
  const removed = readStored<{ path: string; at: number }[]>(UNFINISHED_REMOVED_KEY, []).filter((r) => r.path !== clean);
  writeStored(UNFINISHED_REMOVED_KEY, [{ path: clean, at }, ...removed].slice(0, 200));
  removeStored(key(path));
  notify();
}

/** Every unfinished session on this device, newest first. */
export function listUnfinished(now = Date.now()): Unfinished[] {
  const out: Unfinished[] = [];
  try {
    const store = window.localStorage;
    for (let i = 0; i < store.length; i++) {
      const k = store.key(i);
      if (!k?.startsWith(PREFIX)) continue;
      const entry = loadUnfinished(k.slice(PREFIX.length), now);
      if (entry) out.push(entry);
    }
  } catch {
    return [];
  }
  return out.sort((a, b) => b.at - a.at);
}

export function resumeHref(path: string): string {
  return `${path.split("?")[0]}?${RESUME_PARAM}=1`;
}

/** True once when the page was opened with ?resume=1 (the flag is then removed). */
export function takeResumeParam(): boolean {
  const url = new URL(window.location.href);
  if (url.searchParams.get(RESUME_PARAM) !== "1") return false;
  url.searchParams.delete(RESUME_PARAM);
  window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  return true;
}

/** Live list of unfinished sessions (updates on save, other tabs and focus). */
export function useUnfinished(): Unfinished[] {
  const [list, setList] = useState<Unfinished[]>([]);
  useEffect(() => {
    const load = () => setList(listUnfinished());
    load();
    window.addEventListener(ACTIVITY_EVENT, load);
    window.addEventListener("storage", load);
    window.addEventListener("focus", load);
    return () => {
      window.removeEventListener(ACTIVITY_EVENT, load);
      window.removeEventListener("storage", load);
      window.removeEventListener("focus", load);
    };
  }, []);
  return list;
}
