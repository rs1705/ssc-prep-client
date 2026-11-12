"use client";

import { useEffect, useState } from "react";
import type { SubjectKey } from "@/lib/subject-theme";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const SUBJECTS: SubjectKey[] = ["maths", "reasoning", "english", "gk"];

type Counts = Partial<Record<SubjectKey, number>>;

// One request per subject per page load, shared by every component that asks.
let pending: Promise<Counts> | null = null;

function loadCounts(): Promise<Counts> {
  pending ??= Promise.all(
    SUBJECTS.map((key) =>
      fetch(`${API_URL}/pyqs/topics?subject=${key}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((topics: { count: number }[] | null) =>
          Array.isArray(topics) ? ([key, topics.reduce((n, t) => n + t.count, 0)] as const) : null,
        )
        .catch(() => null),
    ),
  ).then((rows) => Object.fromEntries(rows.filter((r) => r !== null)) as Counts);
  return pending;
}

/** Live number of real PYQs per subject (empty until loaded or if the server is unreachable). */
export function usePyqCounts(): { counts: Counts; total: number | null } {
  const [counts, setCounts] = useState<Counts>({});
  useEffect(() => {
    let alive = true;
    loadCounts().then((c) => alive && setCounts(c));
    return () => {
      alive = false;
    };
  }, []);
  const values = Object.values(counts);
  return { counts, total: values.length === SUBJECTS.length ? values.reduce((a, b) => a + (b ?? 0), 0) : null };
}
