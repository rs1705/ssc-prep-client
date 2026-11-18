"use client";

import { useEffect, useState } from "react";

/** Ease-out: fast at first, settling on the value. */
export function easeOut(t: number): number {
  return 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
}

/** The value shown `elapsed` ms into a count-up of `duration` ms (whole numbers unless decimals > 0). */
export function countUpValue(target: number, elapsed: number, duration: number, decimals = 0): number {
  const f = 10 ** decimals;
  if (duration <= 0 || elapsed >= duration) return target;
  return Math.round(target * easeOut(elapsed / duration) * f) / f;
}

/**
 * Counts a number up from 0 when it first appears (results screens). Shows the final
 * value at once when the user prefers reduced motion.
 */
export function useCountUp(target: number, { duration = 900, delay = 0, decimals = 0 } = {}): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let frame = 0;
    const start = performance.now() + delay;
    const tick = (now: number) => {
      const elapsed = now - start;
      setValue(elapsed <= 0 ? 0 : countUpValue(target, elapsed, duration, decimals));
      if (elapsed < duration) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [target, duration, delay, decimals]);
  return value;
}
