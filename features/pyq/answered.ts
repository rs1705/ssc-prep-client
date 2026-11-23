"use client";

import { useEffect, useState } from "react";
import { readStored, writeStored } from "@/lib/storage";
import type { Pyq, PyqTopicNode } from "@/redux/PyqApi";

/**
 * Every past-year question a student has answered (the last answer each), with the
 * question's subtopic and concept IDs, so topic pages can show "done" and accuracy.
 * Synced with the account (lib/progress-sync.ts; server/src/progress/merge.ts).
 */

export const ANSWERED_KEY = "ssc:answered";
export const ANSWERED_EVENT = "ssc:answered-updated";
export const MAX_ANSWERED = 5000;

export interface Answered {
  at: number;
  ok: boolean;
  /** Subtopic and concept IDs of the question. */
  tags: string[];
}

export function readAnswered(): Record<string, Answered> {
  const v = readStored<Record<string, Answered>>(ANSWERED_KEY, {});
  return v && typeof v === "object" && !Array.isArray(v) ? v : {};
}

/** Records answers: questionId -> chosen label. Unanswered questions are left out. */
export function recordAnswers(questions: Pyq[], answers: Record<string, string>, at = Date.now()): void {
  const all = readAnswered();
  let changed = false;
  for (const q of questions) {
    const a = answers[q.id];
    if (!a) continue;
    all[q.id] = { at, ok: a === q.answer, tags: (q.tags ?? []).slice(0, 8) };
    changed = true;
  }
  if (!changed) return;
  const kept = Object.entries(all)
    .sort((x, y) => y[1].at - x[1].at)
    .slice(0, MAX_ANSWERED);
  writeStored(ANSWERED_KEY, Object.fromEntries(kept));
  if (typeof window !== "undefined") window.dispatchEvent(new Event(ANSWERED_EVENT));
}

export interface NodeProgress {
  /** Questions answered under this topic, subtopic or concept. */
  done: number;
  right: number;
}

/** Progress per topic-list ID (each tag also counts for every ID above it). */
export function progressByNode(answered: Record<string, Answered>): Map<string, NodeProgress> {
  const out = new Map<string, NodeProgress>();
  for (const a of Object.values(answered)) {
    const nodes = new Set<string>();
    for (const tag of a.tags) {
      const parts = tag.split(".");
      for (let i = 2; i <= parts.length; i++) nodes.add(parts.slice(0, i).join("."));
    }
    for (const n of nodes) {
      const p = out.get(n) ?? { done: 0, right: 0 };
      p.done++;
      if (a.ok) p.right++;
      out.set(n, p);
    }
  }
  return out;
}

/** Question IDs answered under a topic-list node: all of them, and the ones last answered wrong. */
export function answeredUnder(answered: Record<string, Answered>, nodeId: string): { all: string[]; wrong: string[] } {
  const all: string[] = [];
  const wrong: string[] = [];
  for (const [id, a] of Object.entries(answered)) {
    if (!a.tags.some((t) => t === nodeId || t.startsWith(`${nodeId}.`))) continue;
    all.push(id);
    if (!a.ok) wrong.push(id);
  }
  return { all, wrong };
}

/** Live answered record (updates when answers are recorded or synced). */
export function useAnswered(): Record<string, Answered> {
  const [answered, setAnswered] = useState<Record<string, Answered>>({});
  useEffect(() => {
    const load = () => setAnswered(readAnswered());
    load();
    window.addEventListener(ANSWERED_EVENT, load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener(ANSWERED_EVENT, load);
      window.removeEventListener("storage", load);
    };
  }, []);
  return answered;
}

/** Live progress for the topic pages (updates when answers are recorded or synced). */
export function useTopicProgress(): Map<string, NodeProgress> {
  const [progress, setProgress] = useState<Map<string, NodeProgress>>(new Map());
  useEffect(() => {
    const load = () => setProgress(progressByNode(readAnswered()));
    load();
    window.addEventListener(ANSWERED_EVENT, load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener(ANSWERED_EVENT, load);
      window.removeEventListener("storage", load);
    };
  }, []);
  return progress;
}

/** "3 of 12 done · 67% right", or null when nothing is done yet. */
export function progressLabel(p: NodeProgress | undefined, total: number): string | null {
  if (!p || p.done === 0) return null;
  return `${Math.min(p.done, total)} of ${total} done · ${Math.round((p.right / p.done) * 100)}% right`;
}

export type { PyqTopicNode };
