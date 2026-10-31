"use client";

import { useCallback } from "react";
import { useTheme } from "next-themes";

type ViewTransitionDocument = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

const REVEAL_DURATION_MS = 500;
const REVEAL_EASING = "cubic-bezier(0.4, 0, 0.2, 1)";

/**
 * Light/dark toggle that reveals the new theme as a circle expanding from the
 * click point (View Transitions API). Falls back to an instant switch when the
 * API is unavailable or the user prefers reduced motion.
 */
export function useThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const next = theme === "dark" ? "light" : "dark";
      const doc = document as ViewTransitionDocument;

      if (
        !doc.startViewTransition ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        setTheme(next);
        return;
      }

      const x = event.clientX;
      const y = event.clientY;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      const transition = doc.startViewTransition(() => setTheme(next));

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: REVEAL_DURATION_MS,
            easing: REVEAL_EASING,
            pseudoElement: "::view-transition-new(root)",
          },
        );
      });
    },
    [theme, setTheme],
  );

  return { theme, toggleTheme };
}
