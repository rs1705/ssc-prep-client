"use client";

import { useEffect, useRef, useState } from "react";

/** Scrolling less than this (px) in one go changes nothing, so small jitters don't flicker the bar. */
const THRESHOLD = 8;
/** Near the top of the page the bar always shows. */
const TOP_ZONE = 64;

/**
 * Whether a bar should be hidden after the page scrolled from `prevY` to `y`:
 * scrolling down past the top hides it, scrolling up shows it, small moves keep it.
 */
export function nextHidden(hidden: boolean, prevY: number, y: number): boolean {
  if (y <= TOP_ZONE) return false;
  const delta = y - prevY;
  if (Math.abs(delta) < THRESHOLD) return hidden;
  return delta > 0;
}

/**
 * Tracks the scroll of `ref` (a scrolling element) and says when a top bar should
 * slide away. Off when `enabled` is false (the bar then always shows).
 */
export function useHideOnScroll(ref: React.RefObject<HTMLElement | null>, enabled: boolean): boolean {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const hiddenRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    hiddenRef.current = false;
    setHidden(false);
    if (!enabled || !el) return;
    lastY.current = el.scrollTop;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = el.scrollTop;
        const next = nextHidden(hiddenRef.current, lastY.current, y);
        // Only remember positions that counted, so slow scrolls still add up.
        if (next !== hiddenRef.current || Math.abs(y - lastY.current) >= THRESHOLD || y <= TOP_ZONE) lastY.current = y;
        if (next !== hiddenRef.current) {
          hiddenRef.current = next;
          setHidden(next);
        }
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
    };
  }, [ref, enabled]);

  return enabled && hidden;
}
