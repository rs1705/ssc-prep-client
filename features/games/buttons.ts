/**
 * Duolingo-style "chunky" buttons for every game: a solid face, a thicker
 * darker bottom edge, and a press that sinks the button into that edge.
 * Class strings are complete so Tailwind can see them.
 */

const PRESS =
  "transition-[transform,border-width,background-color,border-color,color] duration-75 active:translate-y-[3px] active:border-b-2 disabled:pointer-events-none";

export const DUO = {
  /** Main call to action (Start, Play again, Next). */
  primary: `inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border-2 border-b-[5px] border-brand-700 bg-brand-500 px-6 text-sm font-extrabold uppercase tracking-wide text-white hover:bg-brand-600 disabled:opacity-60 ${PRESS}`,
  /** Positive action in green (Got it). */
  success: `inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border-2 border-b-[5px] border-emerald-700 bg-emerald-500 px-6 text-sm font-extrabold uppercase tracking-wide text-white hover:bg-emerald-600 ${PRESS}`,
  /** Secondary action (All games, Hint). */
  secondary: `inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border-2 border-b-[5px] border-border bg-card px-6 text-sm font-extrabold uppercase tracking-wide text-foreground hover:bg-muted disabled:opacity-50 ${PRESS}`,
  /** Small square icon button (back). */
  icon: `inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-b-4 border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground ${PRESS}`,
  /** Answer tile / option base; combine with one of the states below. */
  option:
    "rounded-2xl border-2 border-b-[5px] transition-[transform,border-width,background-color,border-color,color] duration-75 active:translate-y-[3px] active:border-b-2 disabled:cursor-default disabled:active:translate-y-0 disabled:active:border-b-[5px]",
  idle: "border-border bg-card text-foreground hover:bg-muted",
  correct:
    "border-emerald-500 bg-[color-mix(in_oklab,var(--color-emerald-500)_14%,var(--card))] text-emerald-800 dark:text-emerald-200",
  wrong:
    "border-rose-500 bg-[color-mix(in_oklab,var(--color-rose-500)_14%,var(--card))] text-rose-800 dark:text-rose-200",
  /** Options that are no longer in play after an answer. */
  faded: "border-border bg-card text-muted-foreground opacity-55",
} as const;
