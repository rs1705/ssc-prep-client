"use client";

import { useMemo } from "react";
import { useAnswered } from "@/features/pyq/answered";
import { paperLock, type PaperLock } from "@/lib/unlocks";
import { useXp } from "@/lib/xp";
import { useGetMockPapersQuery } from "@/redux/PyqApi";
import { useAttempts } from "./attempts";

/** Each past paper's lock, newest first (lib/unlocks.ts). `ready` once XP and papers are in. */
export function usePaperLocks() {
  const { data: papers } = useGetMockPapersQuery();
  const { level, ready } = useXp();
  const answered = useAnswered();
  const { attempts } = useAttempts();
  const answeredCount = Object.keys(answered).length;

  return useMemo(() => {
    const sorted = [...(papers ?? [])].sort((x, y) => y.year - x.year || (y.date ?? "").localeCompare(x.date ?? ""));
    const tried = new Set(attempts.filter((a) => a.kind === "paper" && a.paperId).map((a) => a.paperId as string));
    const locks = new Map<string, PaperLock>();
    sorted.forEach((p, i) => locks.set(p.id, paperLock(i, { level: level.level, answered: answeredCount, attempted: tried.has(p.id) })));
    return { sorted, locks, ready: ready && !!papers, level: level.level, answered: answeredCount };
  }, [papers, attempts, level.level, answeredCount, ready]);
}
