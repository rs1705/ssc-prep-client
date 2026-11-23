"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Trophy } from "lucide-react";
import { XP_GAIN_EVENT, type Level } from "@/lib/xp";

/**
 * "+25 XP" after practice, and a bigger card on a level-up. Gains that arrive close
 * together (a set of answers) are added up into one toast.
 */
export function XpToast() {
  const [gain, setGain] = useState<{ amount: number; key: number } | null>(null);
  const [levelUp, setLevelUp] = useState<Level | null>(null);
  const hide = useRef<number | null>(null);
  const hideLevel = useRef<number | null>(null);

  useEffect(() => {
    const onGain = (e: Event) => {
      const d = (e as CustomEvent<{ amount: number; levelUp: Level | null }>).detail;
      setGain((g) => ({ amount: (g?.amount ?? 0) + d.amount, key: Date.now() }));
      if (hide.current) window.clearTimeout(hide.current);
      hide.current = window.setTimeout(() => setGain(null), 2200);
      if (d.levelUp) {
        setLevelUp(d.levelUp);
        if (hideLevel.current) window.clearTimeout(hideLevel.current);
        hideLevel.current = window.setTimeout(() => setLevelUp(null), 4000);
      }
    };
    window.addEventListener(XP_GAIN_EVENT, onGain);
    return () => window.removeEventListener(XP_GAIN_EVENT, onGain);
  }, []);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] z-50 flex flex-col items-center gap-2 px-4 md:bottom-6"
    >
      {levelUp && (
        <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-amber-400/50 bg-card px-4 py-3 shadow-xl motion-safe:animate-pop">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/20 text-amber-600 dark:text-amber-300">
            <Trophy className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-300">Level up!</span>
            <span className="block text-base font-extrabold text-foreground">
              Level {levelUp.level} · {levelUp.name}
            </span>
          </span>
        </div>
      )}
      {gain && (
        <span
          key={gain.key}
          className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-sm font-extrabold text-background shadow-lg motion-safe:animate-pop"
        >
          <Sparkles className="h-4 w-4 text-amber-300" aria-hidden="true" />+{gain.amount} XP
        </span>
      )}
    </div>
  );
}
