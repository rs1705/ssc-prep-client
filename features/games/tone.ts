/**
 * Subject colour for the shared game chrome (frame, lobby, results).
 * English games are fuchsia, Reasoning drills are pink, Maths drills are sky.
 * Class strings are written out in full so Tailwind can see them.
 */
export type GameTone = "english" | "reasoning" | "maths";

export interface ToneClasses {
  /** Subtitle / score text. */
  text: string;
  /** Hero icon colour. */
  icon: string;
  /** Soft square behind a rule icon. */
  iconWrap: string;
  /** Border for the prompt card. */
  border: string;
  /** Hover for option buttons (opaque mix, never translucent). */
  optionHover: string;
  /** Selected tile (match game). */
  selected: string;
  /** Time bar gradient while there is plenty of time left. */
  timer: string;
}

export const GAME_TONE: Record<GameTone, ToneClasses> = {
  english: {
    text: "text-fuchsia-800 dark:text-fuchsia-300",
    icon: "text-fuchsia-700 dark:text-fuchsia-400",
    iconWrap: "bg-[color-mix(in_oklab,var(--color-fuchsia-500)_10%,var(--card))] text-fuchsia-700 dark:text-fuchsia-400",
    border: "border-fuchsia-500/25",
    optionHover:
      "hover:border-fuchsia-500/50 hover:bg-[color-mix(in_oklab,var(--color-fuchsia-500)_10%,var(--card))]",
    selected:
      "border-fuchsia-600 bg-[color-mix(in_oklab,var(--color-fuchsia-500)_14%,var(--card))] text-fuchsia-900 dark:text-fuchsia-100",
    timer: "from-fuchsia-500 to-pink-500",
  },
  reasoning: {
    text: "text-pink-800 dark:text-pink-300",
    icon: "text-pink-700 dark:text-pink-400",
    iconWrap: "bg-[color-mix(in_oklab,var(--color-pink-500)_10%,var(--card))] text-pink-700 dark:text-pink-400",
    border: "border-pink-500/25",
    optionHover:
      "hover:border-pink-500/50 hover:bg-[color-mix(in_oklab,var(--color-pink-500)_10%,var(--card))]",
    selected:
      "border-pink-600 bg-[color-mix(in_oklab,var(--color-pink-500)_14%,var(--card))] text-pink-900 dark:text-pink-100",
    timer: "from-pink-500 to-fuchsia-500",
  },
  maths: {
    text: "text-sky-800 dark:text-sky-300",
    icon: "text-sky-700 dark:text-sky-400",
    iconWrap: "bg-[color-mix(in_oklab,var(--color-sky-500)_10%,var(--card))] text-sky-700 dark:text-sky-400",
    border: "border-sky-500/25",
    optionHover:
      "hover:border-sky-500/50 hover:bg-[color-mix(in_oklab,var(--color-sky-500)_10%,var(--card))]",
    selected:
      "border-sky-600 bg-[color-mix(in_oklab,var(--color-sky-500)_14%,var(--card))] text-sky-900 dark:text-sky-100",
    timer: "from-sky-500 to-blue-500",
  },
};
