"use client";

import { useEffect } from "react";
import { readStored, writeStored } from "@/lib/storage";
import { readMistakes } from "@/lib/activity-log";
import { shuffle } from "@/lib/shuffle";

/**
 * Remembers which words each game has shown, so every round leads with words
 * you haven't seen yet. Once a pool has been fully seen it starts a new cycle.
 * A few recent mistakes are mixed back in on purpose.
 *
 * Stored as one record (synced to the account): pool -> { cycle, ids }, ids
 * oldest first.
 */
export const SEEN_KEY = "ssc:seen";
/** Per pool, so a huge deck can't grow storage without bound. */
export const SEEN_CAP = 3000;
/** Share of a round given to past mistakes. */
const MISTAKE_SHARE = 0.2;

export interface SeenEntry {
  cycle: number;
  ids: string[];
}
export type SeenRecord = Record<string, SeenEntry>;

export function readSeen(): SeenRecord {
  return readStored<SeenRecord>(SEEN_KEY, {});
}

function entry(pool: string): SeenEntry {
  const e = readSeen()[pool];
  return e && Array.isArray(e.ids) ? e : { cycle: 0, ids: [] };
}

function writeEntry(pool: string, e: SeenEntry) {
  writeStored(SEEN_KEY, { ...readSeen(), [pool]: { cycle: e.cycle, ids: e.ids.slice(-SEEN_CAP) } });
}

/** Record that these items were shown (moves them to the newest end). */
export function markSeen(pool: string, ids: string[]): void {
  if (ids.length === 0) return;
  const e = entry(pool);
  const add = new Set(ids);
  writeEntry(pool, { cycle: e.cycle, ids: [...e.ids.filter((id) => !add.has(id)), ...add] });
}

/** Mark the current item as seen whenever it changes. */
export function useMarkSeen(pool: string, id: string | null | undefined): void {
  useEffect(() => {
    if (id) markSeen(pool, [id]);
  }, [pool, id]);
}

/** Answers/prompts of not-yet-mastered mistakes made on this screen, lowercased. */
export function missedLabels(href: string): Set<string> {
  const out = new Set<string>();
  for (const m of readMistakes()) {
    if (m.href !== href) continue;
    out.add(m.answer.trim().toLowerCase());
    out.add(m.prompt.trim().toLowerCase());
  }
  return out;
}

export interface OrderOptions<T> {
  idOf: (item: T) => string;
  /** Strings that identify the item in the mistake log (the word, its meaning...). */
  labelsOf?: (item: T) => string[];
  /** Mistake labels, usually missedLabels(location.pathname). */
  missed?: Set<string>;
  /** Round size, used to size the mistake share. Defaults to all items. */
  count?: number;
}

/**
 * The whole pool, ordered for the next round: a few past mistakes, then unseen
 * items (shuffled), then seen ones, oldest seen first. When nothing is unseen a
 * new cycle starts, keeping the most recently seen items at the back.
 */
export function orderFresh<T>(pool: string, items: T[], opts: OrderOptions<T>): T[] {
  const { idOf, labelsOf, missed, count = items.length } = opts;
  let e = entry(pool);
  const inPool = new Set(items.map(idOf));
  let seenIds = e.ids.filter((id) => inPool.has(id));

  if (items.length > 0 && seenIds.length >= inPool.size) {
    // Everything seen: new cycle. Keep the last round's worth "seen" so it isn't repeated straight away.
    const keep = Math.min(count, Math.floor(inPool.size / 2));
    seenIds = keep > 0 ? seenIds.slice(-keep) : [];
    e = { cycle: e.cycle + 1, ids: [...e.ids.filter((id) => !inPool.has(id)), ...seenIds] };
    writeEntry(pool, e);
  }

  const seenRank = new Map(seenIds.map((id, i) => [id, i]));
  const unseen = shuffle(items.filter((it) => !seenRank.has(idOf(it))));
  const seen = items
    .filter((it) => seenRank.has(idOf(it)))
    .sort((a, b) => seenRank.get(idOf(a))! - seenRank.get(idOf(b))!);

  const wantMistakes = missed?.size && labelsOf ? Math.max(1, Math.round(count * MISTAKE_SHARE)) : 0;
  const mistakes = wantMistakes
    ? shuffle(items.filter((it) => labelsOf!(it).some((l) => missed!.has(l.trim().toLowerCase())))).slice(0, wantMistakes)
    : [];
  const taken = new Set(mistakes.map(idOf));
  const rest = [...unseen, ...seen].filter((it) => !taken.has(idOf(it)));

  if (mistakes.length === 0) return rest;
  // Spread the mistakes through the first round rather than front-loading them.
  const head = shuffle([...mistakes, ...rest.slice(0, Math.max(0, count - mistakes.length))]);
  return [...head, ...rest.slice(Math.max(0, count - mistakes.length))];
}

/** How far through a pool the player is, for lobby counters. */
export function seenProgress(pool: string, ids: string[]): { seen: number; total: number; cycle: number } {
  const e = entry(pool);
  const set = new Set(e.ids);
  return { seen: ids.filter((id) => set.has(id)).length, total: ids.length, cycle: e.cycle };
}
