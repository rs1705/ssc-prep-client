"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Pause for timed games. While paused the game's clock should stand still (check
 * `paused` in the tick effect) and the game ignores the keyboard: only Escape, Enter
 * or Space get through, to resume. Escape toggles pause (letters can't, Hangman needs
 * them). Switching tabs pauses too. Pausing ends by itself when the round does.
 */
export function usePause(active: boolean) {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!active) setPaused(false);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const onHide = () => {
      if (document.hidden) setPaused(true);
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;
    // Capture phase, so the game's own key handlers never see keys while paused.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.querySelector("[role=alertdialog],[role=dialog]")) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setPaused((p) => !p);
        return;
      }
      if (!paused) return;
      e.stopImmediatePropagation();
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setPaused(false);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("keydown", onKey, true);
    };
  }, [active, paused]);

  const pause = useCallback(() => setPaused(true), []);
  const resume = useCallback(() => setPaused(false), []);
  return { paused: active && paused, pause, resume };
}
