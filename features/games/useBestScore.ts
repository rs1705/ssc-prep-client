"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { readStored, writeStored } from "@/lib/storage";

/** Persisted personal-best score for one game. */
export function useBestScore(storageKey: string) {
  const [best, setBest] = useState(0);
  const [isNewBest, setIsNewBest] = useState(false);
  const bestRef = useRef(0);

  useEffect(() => {
    const saved = readStored<number>(storageKey, 0);
    bestRef.current = saved;
    setBest(saved);
  }, [storageKey]);

  /** Call once when a run ends. */
  const submit = useCallback(
    (score: number) => {
      if (score > bestRef.current) {
        bestRef.current = score;
        setBest(score);
        setIsNewBest(true);
        writeStored(storageKey, score);
      }
    },
    [storageKey],
  );

  /** Call when a new run starts. */
  const clearNewBest = useCallback(() => setIsNewBest(false), []);

  return { best, isNewBest, submit, clearNewBest };
}
