/**
 * Single source of truth for subject colours.
 *
 * Rules:
 *  - Amber/gold is the BRAND colour (primary actions, active states).
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
  | "teal"
  | "amber"
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
}

export const HUE_THEME: Record<Hue, HueTheme> = {
  sky: {
    iconWrap: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    text: "text-sky-600 dark:text-sky-400",
    chip: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/25",
    hoverBorder: "hover:border-sky-500/50",
    hoverBg: "hover:bg-sky-500/[0.04]",
    banner: "from-sky-500/10 to-sky-500/[0.03] border-sky-500/25",
    dot: "bg-sky-500",
    bar: "from-sky-400 to-blue-600",
  },
  violet: {
    iconWrap: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    text: "text-violet-600 dark:text-violet-400",
    chip: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/25",
    hoverBorder: "hover:border-violet-500/50",
    hoverBg: "hover:bg-violet-500/[0.04]",
    banner: "from-violet-500/10 to-violet-500/[0.03] border-violet-500/25",
    dot: "bg-violet-500",
    bar: "from-violet-400 to-purple-600",
  },
  fuchsia: {
    iconWrap: "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400",
    text: "text-fuchsia-600 dark:text-fuchsia-400",
    chip: "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-500/25",
    hoverBorder: "hover:border-fuchsia-500/50",
    hoverBg: "hover:bg-fuchsia-500/[0.04]",
    banner: "from-fuchsia-500/10 to-fuchsia-500/[0.03] border-fuchsia-500/25",
    dot: "bg-fuchsia-500",
    bar: "from-fuchsia-400 to-pink-600",
  },
  teal: {
    iconWrap: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    text: "text-teal-600 dark:text-teal-400",
    chip: "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/25",
    hoverBorder: "hover:border-teal-500/50",
    hoverBg: "hover:bg-teal-500/[0.04]",
    banner: "from-teal-500/10 to-teal-500/[0.03] border-teal-500/25",
    dot: "bg-teal-500",
    bar: "from-teal-400 to-cyan-600",
  },
  amber: {
    iconWrap: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    text: "text-amber-700 dark:text-amber-400",
    chip: "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/25",
    hoverBorder: "hover:border-amber-500/50",
    hoverBg: "hover:bg-amber-500/[0.04]",
    banner: "from-amber-500/10 to-amber-500/[0.03] border-amber-500/25",
    dot: "bg-amber-500",
    bar: "from-amber-400 to-orange-500",
  },
  emerald: {
    iconWrap: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    text: "text-emerald-600 dark:text-emerald-400",
    chip: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25",
    hoverBorder: "hover:border-emerald-500/50",
    hoverBg: "hover:bg-emerald-500/[0.04]",
    banner: "from-emerald-500/10 to-emerald-500/[0.03] border-emerald-500/25",
    dot: "bg-emerald-500",
    bar: "from-emerald-400 to-emerald-600",
  },
  rose: {
    iconWrap: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    text: "text-rose-600 dark:text-rose-400",
    chip: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/25",
    hoverBorder: "hover:border-rose-500/50",
    hoverBg: "hover:bg-rose-500/[0.04]",
    banner: "from-rose-500/10 to-rose-500/[0.03] border-rose-500/25",
    dot: "bg-rose-500",
    bar: "from-rose-400 to-rose-600",
  },
  indigo: {
    iconWrap: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    text: "text-indigo-600 dark:text-indigo-400",
    chip: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/25",
    hoverBorder: "hover:border-indigo-500/50",
    hoverBg: "hover:bg-indigo-500/[0.04]",
    banner: "from-indigo-500/10 to-indigo-500/[0.03] border-indigo-500/25",
    dot: "bg-indigo-500",
    bar: "from-indigo-400 to-indigo-600",
  },
};

export const SUBJECT_HUE: Record<SubjectKey, Hue> = {
  maths: "sky",
  english: "violet",
  reasoning: "fuchsia",
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
