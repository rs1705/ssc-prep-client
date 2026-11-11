"use client";

import { useEffect, useState } from "react";
import { readStored, writeStored } from "@/lib/storage";

/**
 * The exact set a game was played with (questions, queue or rounds), saved per
 * screen so the student can play the same set again, retry just the misses,
 * or reopen it from the dashboard ("Go again" adds ?replay=1).
 */

const PREFIX = "ssc:set:";
export const REPLAY_PARAM = "replay";

interface SavedSet<T> {
  at: number;
  items: T;
  /** Optional extra, e.g. which deck it came from. */
  meta?: string;
}

export function setKey(path: string): string {
  return PREFIX + path.split("?")[0];
}

export function saveSet<T>(path: string, items: T, meta?: string): void {
  writeStored<SavedSet<T>>(setKey(path), { at: Date.now(), items, meta });
}

export function loadSet<T>(path: string): SavedSet<T> | null {
  return readStored<SavedSet<T> | null>(setKey(path), null);
}

export function shuffle<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Link that reopens a screen with its last set. */
export function replayHref(path: string): string {
  return `${path.split("?")[0]}?${REPLAY_PARAM}=1`;
}

/**
 * True once, when the page was opened with ?replay=1. The flag is removed from
 * the address so a refresh doesn't replay again.
 */
export function useReplayRequest(): boolean {
  const [requested, setRequested] = useState(false);
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get(REPLAY_PARAM) !== "1") return;
    url.searchParams.delete(REPLAY_PARAM);
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
    setRequested(true);
  }, []);
  return requested;
}
