/**
 * Single source of truth for subject colours.
 *
 * Rules:
 *  - Indigo is the BRAND colour (primary actions, active states); it comes
 *    from the brand-* tokens in globals.css. Subjects avoid indigo and violet
 *    so a subject never looks like a primary action.
 *  - Subjects are cool jewel tones that sit with indigo: maths sky,
 *    english fuchsia, reasoning pink, gk teal.
 *  - Emerald = correct / success, rose = wrong / destructive. Subjects must
 *    never use those, otherwise a subject card reads like feedback.
 *  - Each subject owns one hue, used identically on every screen.
 *
 * All class strings are written out in full so Tailwind can detect them.
 */

export type SubjectKey = "maths" | "english" | "reasoning" | "gk";

export type Hue =
  | "sky"
  | "violet"
  | "fuchsia"
  | "pink"
  | "teal"
  | "amber"
  | "brand"
  | "emerald"
  | "rose"
  | "indigo";

export interface HueTheme {
  /** Soft tinted square behind an icon. */
  iconWrap: string;
  /** Foreground colour for icons and small headings. */
  text: string;
  /** Soft fill for chips and banners. */
  chip: string;
  /** Card hover treatment. */
  hoverBorder: string;
  hoverBg: string;
  /** Banner gradient + border. */
  banner: string;
  /** Solid dot / indicator. */
  dot: string;
  /** Progress bar gradient. */
  bar: string;
  /** Filled state for a selected tab or pill (white text on the hue). */
  solid: string;
}

export const HUE_THEME: Record<Hue, HueTheme> = {
  sky: {
    iconWrap: "bg-[color-mix(in_oklab,var(--color-sky-500)_10%,var(--card))] text-sky-600 dark:text-sky-400",
    text: "text-sky-600 dark:text-sky-400",
    chip: "bg-[color-mix(in_oklab,var(--color-sky-500)_10%,var(--card))] text-sky-700 dark:text-sky-300 border-sky-500/25",
    hoverBorder: "hover:border-sky-500/50",
    hoverBg: "hover:bg-[color-mix(in_oklab,var(--color-sky-500)_5%,var(--card))]",
    banner: "bg-card from-sky-500/10 to-sky-500/[0.03] border-sky-500/25",
    dot: "bg-sky-500",
    bar: "from-sky-400 to-blue-600",
    solid: "border-sky-600 bg-sky-600 text-white shadow-md shadow-sky-600/25",
  },
  violet: {
    iconWrap: "bg-[color-mix(in_oklab,var(--color-violet-500)_10%,var(--card))] text-violet-600 dark:text-violet-400",
    text: "text-violet-600 dark:text-violet-400",
    chip: "bg-[color-mix(in_oklab,var(--color-violet-500)_10%,var(--card))] text-violet-700 dark:text-violet-300 border-violet-500/25",
    hoverBorder: "hover:border-violet-500/50",
    hoverBg: "hover:bg-[color-mix(in_oklab,var(--color-violet-500)_5%,var(--card))]",
    banner: "bg-card from-violet-500/10 to-violet-500/[0.03] border-violet-500/25",
    dot: "bg-violet-500",
    bar: "from-violet-400 to-purple-600",
    solid: "border-violet-600 bg-violet-600 text-white shadow-md shadow-violet-600/25",
  },
  fuchsia: {
    iconWrap: "bg-[color-mix(in_oklab,var(--color-fuchsia-500)_10%,var(--card))] text-fuchsia-600 dark:text-fuchsia-400",
    text: "text-fuchsia-600 dark:text-fuchsia-400",
    chip: "bg-[color-mix(in_oklab,var(--color-fuchsia-500)_10%,var(--card))] text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-500/25",
    hoverBorder: "hover:border-fuchsia-500/50",
    hoverBg: "hover:bg-[color-mix(in_oklab,var(--color-fuchsia-500)_5%,var(--card))]",
    banner: "bg-card from-fuchsia-500/10 to-fuchsia-500/[0.03] border-fuchsia-500/25",
    dot: "bg-fuchsia-500",
    bar: "from-fuchsia-400 to-fuchsia-600",
    solid: "border-fuchsia-600 bg-fuchsia-600 text-white shadow-md shadow-fuchsia-600/25",
  },
  pink: {
    iconWrap: "bg-[color-mix(in_oklab,var(--color-pink-500)_10%,var(--card))] text-pink-600 dark:text-pink-400",
    text: "text-pink-600 dark:text-pink-400",
    chip: "bg-[color-mix(in_oklab,var(--color-pink-500)_10%,var(--card))] text-pink-700 dark:text-pink-300 border-pink-500/25",
    hoverBorder: "hover:border-pink-500/50",
    hoverBg: "hover:bg-[color-mix(in_oklab,var(--color-pink-500)_5%,var(--card))]",
    banner: "bg-card from-pink-500/10 to-pink-500/[0.03] border-pink-500/25",
    dot: "bg-pink-500",
    bar: "from-pink-400 to-pink-600",
    solid: "border-pink-600 bg-pink-600 text-white shadow-md shadow-pink-600/25",
  },
  teal: {
    iconWrap: "bg-[color-mix(in_oklab,var(--color-teal-500)_10%,var(--card))] text-teal-600 dark:text-teal-400",
    text: "text-teal-600 dark:text-teal-400",
    chip: "bg-[color-mix(in_oklab,var(--color-teal-500)_10%,var(--card))] text-teal-700 dark:text-teal-300 border-teal-500/25",
    hoverBorder: "hover:border-teal-500/50",
    hoverBg: "hover:bg-[color-mix(in_oklab,var(--color-teal-500)_5%,var(--card))]",
    banner: "bg-card from-teal-500/10 to-teal-500/[0.03] border-teal-500/25",
    dot: "bg-teal-500",
    bar: "from-teal-400 to-cyan-600",
    solid: "border-teal-600 bg-teal-600 text-white shadow-md shadow-teal-600/25",
  },
  amber: {
    iconWrap: "bg-[color-mix(in_oklab,var(--color-amber-500)_10%,var(--card))] text-amber-700 dark:text-amber-400",
    text: "text-amber-700 dark:text-amber-400",
    chip: "bg-[color-mix(in_oklab,var(--color-amber-500)_10%,var(--card))] text-amber-800 dark:text-amber-300 border-amber-500/25",
    hoverBorder: "hover:border-amber-500/50",
    hoverBg: "hover:bg-[color-mix(in_oklab,var(--color-amber-500)_5%,var(--card))]",
    banner: "bg-card from-amber-500/10 to-amber-500/[0.03] border-amber-500/25",
    dot: "bg-amber-500",
    bar: "from-amber-400 to-orange-500",
    solid: "border-amber-500 bg-amber-500 text-amber-950 shadow-md shadow-amber-500/25",
  },
  brand: {
    iconWrap: "bg-[color-mix(in_oklab,var(--brand-500)_10%,var(--card))] text-brand-700 dark:text-brand-400",
    text: "text-brand-700 dark:text-brand-400",
    chip: "bg-[color-mix(in_oklab,var(--brand-500)_10%,var(--card))] text-brand-800 dark:text-brand-300 border-brand-500/25",
    hoverBorder: "hover:border-brand-500/50",
    hoverBg: "hover:bg-[color-mix(in_oklab,var(--brand-500)_5%,var(--card))]",
    banner: "bg-card from-brand-500/10 to-brand-500/[0.03] border-brand-500/25",
    dot: "bg-brand-500",
    bar: "from-brand-400 to-brand-alt-500",
    solid: "border-brand-600 bg-brand-600 text-white shadow-md shadow-brand-600/25",
  },
  emerald: {
    iconWrap: "bg-[color-mix(in_oklab,var(--color-emerald-500)_10%,var(--card))] text-emerald-600 dark:text-emerald-400",
    text: "text-emerald-600 dark:text-emerald-400",
    chip: "bg-[color-mix(in_oklab,var(--color-emerald-500)_10%,var(--card))] text-emerald-700 dark:text-emerald-300 border-emerald-500/25",
    hoverBorder: "hover:border-emerald-500/50",
    hoverBg: "hover:bg-[color-mix(in_oklab,var(--color-emerald-500)_5%,var(--card))]",
    banner: "bg-card from-emerald-500/10 to-emerald-500/[0.03] border-emerald-500/25",
    dot: "bg-emerald-500",
    bar: "from-emerald-400 to-emerald-600",
    solid: "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/25",
  },
  rose: {
    iconWrap: "bg-[color-mix(in_oklab,var(--color-rose-500)_10%,var(--card))] text-rose-600 dark:text-rose-400",
    text: "text-rose-600 dark:text-rose-400",
    chip: "bg-[color-mix(in_oklab,var(--color-rose-500)_10%,var(--card))] text-rose-700 dark:text-rose-300 border-rose-500/25",
    hoverBorder: "hover:border-rose-500/50",
    hoverBg: "hover:bg-[color-mix(in_oklab,var(--color-rose-500)_5%,var(--card))]",
    banner: "bg-card from-rose-500/10 to-rose-500/[0.03] border-rose-500/25",
    dot: "bg-rose-500",
    bar: "from-rose-400 to-rose-600",
    solid: "border-rose-600 bg-rose-600 text-white shadow-md shadow-rose-600/25",
  },
  indigo: {
    iconWrap: "bg-[color-mix(in_oklab,var(--color-indigo-500)_10%,var(--card))] text-indigo-600 dark:text-indigo-400",
    text: "text-indigo-600 dark:text-indigo-400",
    chip: "bg-[color-mix(in_oklab,var(--color-indigo-500)_10%,var(--card))] text-indigo-700 dark:text-indigo-300 border-indigo-500/25",
    hoverBorder: "hover:border-indigo-500/50",
    hoverBg: "hover:bg-[color-mix(in_oklab,var(--color-indigo-500)_5%,var(--card))]",
    banner: "bg-card from-indigo-500/10 to-indigo-500/[0.03] border-indigo-500/25",
    dot: "bg-indigo-500",
    bar: "from-indigo-400 to-indigo-600",
    solid: "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-600/25",
  },
};

export const SUBJECT_HUE: Record<SubjectKey, Hue> = {
  maths: "sky",
  english: "fuchsia",
  reasoning: "pink",
  gk: "teal",
};

export const SUBJECT_LABEL: Record<SubjectKey, string> = {
  maths: "Mathematics",
  english: "English",
  reasoning: "Reasoning",
  gk: "General Knowledge",
};

export function subjectTheme(subject: SubjectKey): HueTheme {
  return HUE_THEME[SUBJECT_HUE[subject]];
}
