/**
 * Subject colour for the shared game chrome (frame, lobby, results).
 * English games are fuchsia, Reasoning drills are orange, Maths drills are sky.
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
    timer: "from-fuchsia-400 to-fuchsia-600",
  },
  reasoning: {
    text: "text-orange-800 dark:text-orange-300",
    icon: "text-orange-700 dark:text-orange-400",
    iconWrap: "bg-[color-mix(in_oklab,var(--color-orange-500)_12%,var(--card))] text-orange-700 dark:text-orange-400",
    border: "border-orange-500/25",
    optionHover:
      "hover:border-orange-500/50 hover:bg-[color-mix(in_oklab,var(--color-orange-500)_10%,var(--card))]",
    selected:
      "border-orange-600 bg-[color-mix(in_oklab,var(--color-orange-500)_14%,var(--card))] text-orange-900 dark:text-orange-100",
    timer: "from-orange-400 to-orange-600",
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
    timer: "from-sky-400 to-sky-600",
  },
};
