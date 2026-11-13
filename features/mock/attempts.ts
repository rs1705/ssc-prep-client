"use client";

import { useEffect, useState } from "react";
import { readStored, writeStored } from "@/lib/storage";
import { computeResult, createSession } from "@/features/pyq/session";
import type { FullMock } from "@/redux/PyqApi";
import type { ExamState } from "./examSession";

/**
 * Finished mocks, past papers and sectional tests. Saved on the device and
 * synced to the account (server/src/progress/merge.ts), newest first.
 * Each keeps the question ids it showed, so any attempt can be reopened.
 */
export const ATTEMPTS_KEY = "ssc:attempts";
export const ATTEMPTS_EVENT = "ssc:attempts-updated";
export const MAX_ATTEMPTS = 50;

export interface Attempt {
  id: string;
  at: number;
  kind: FullMock["kind"];
  title: string;
  /** The past paper, when there is one (generated mocks have none). */
  paperId: string | null;
  /** The subject, for a sectional test. */
  subject: string | null;
  sections: { subject: string; ids: string[] }[];
  /** questionId -> chosen option label */
  answers: Record<string, string>;
  marks: number;
  maxMarks: number;
  correct: number;
  wrong: number;
}

export function readAttempts(): Attempt[] {
  const list = readStored<Attempt[]>(ATTEMPTS_KEY, []);
  return Array.isArray(list) ? list : [];
}

export function findAttempt(id: string): Attempt | null {
  return readAttempts().find((a) => a.id === id) ?? null;
}

export function saveAttempt(attempt: Attempt): void {
  const rest = readAttempts().filter((a) => a.id !== attempt.id);
  writeStored(ATTEMPTS_KEY, [attempt, ...rest].sort((a, b) => b.at - a.at).slice(0, MAX_ATTEMPTS));
  if (typeof window !== "undefined") window.dispatchEvent(new Event(ATTEMPTS_EVENT));
}

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/** The record kept for a test that has just been submitted. */
export function buildAttempt(mock: FullMock, exam: ExamState, at = Date.now()): Attempt {
  const result = computeResult({ ...createSession("test", exam.questions), answers: exam.answers, submitted: true });
  return {
    id: uid(),
    at,
    kind: mock.kind,
    title: mock.title,
    paperId: mock.kind === "mock" ? null : mock.id,
    subject: mock.kind === "section" ? mock.sections[0]?.subject ?? null : null,
    sections: exam.sections.map((s) => ({ subject: s.subject, ids: exam.questions.slice(s.start, s.end).map((q) => q.id) })),
    answers: { ...exam.answers },
    marks: result.marks,
    maxMarks: result.maxMarks,
    correct: result.correct,
    wrong: result.wrong,
  };
}

/** Live list of attempts (updates on save, sync, other tabs and focus). */
export function useAttempts(filter?: (a: Attempt) => boolean) {
  const [state, setState] = useState<{ attempts: Attempt[]; ready: boolean }>({ attempts: [], ready: false });
  useEffect(() => {
    const load = () => setState({ attempts: readAttempts(), ready: true });
    load();
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === ATTEMPTS_KEY) load();
    };
    window.addEventListener(ATTEMPTS_EVENT, load);
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", load);
    return () => {
      window.removeEventListener(ATTEMPTS_EVENT, load);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", load);
    };
  }, []);
  return { ready: state.ready, attempts: filter ? state.attempts.filter(filter) : state.attempts };
}

export const reviewHref = (attempt: Attempt) => `/mock-tests/attempt?review=${encodeURIComponent(attempt.id)}`;
