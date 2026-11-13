/**
 * Single source of truth for subject colours.
 *
 * Rules:
 *  - Indigo is the BRAND colour (primary actions, active states); it comes
 *    from the brand-* tokens in globals.css. Subjects avoid indigo and violet
 *    so a subject never looks like a primary action.
 *  - Subjects are cool jewel tones that sit with indigo: maths sky,
 *    english fuchsia, gk teal, plus warm orange for reasoning (indigo's
 *    complement; pink was too close to rose and read like an error).
 *  - Emerald = correct / success, rose = wrong / destructive. Subjects must
 *    never use those, otherwise a subject card reads like feedback.
 *  - Each subject owns one hue, used identically on every screen. Inside a
 *    subject, everything uses that hue; groups are told apart by icons and
 *    headings, never by extra colours.
 *  - A card carries at most one coloured element (usually its icon tile);
 *    the rest stays neutral. Gradients are for progress bars and the landing
 *    hero only.
 *
 * All class strings are written out in full so Tailwind can detect them.
 */

export type SubjectKey = "maths" | "english" | "reasoning" | "gk";

/**
 * The whole decorative palette: one hue per subject, plus brand for screens
 * that belong to no subject. Feedback colours (emerald = right, rose = wrong,
 * amber = needs work) are signals, not themes, so they are deliberately absent.
 */
export type Hue = "sky" | "fuchsia" | "orange" | "teal" | "brand";

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
  /** Banner: flat soft tint + border. */
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
    banner: "bg-[color-mix(in_oklab,var(--color-sky-500)_6%,var(--card))] border-sky-500/25",
    dot: "bg-sky-500",
    bar: "from-sky-400 to-sky-600",
    solid: "border-sky-600 bg-sky-600 text-white shadow-md shadow-sky-600/25",
  },
  orange: {
    iconWrap: "bg-[color-mix(in_oklab,var(--color-orange-500)_12%,var(--card))] text-orange-600 dark:text-orange-400",
    text: "text-orange-600 dark:text-orange-400",
    chip: "bg-[color-mix(in_oklab,var(--color-orange-500)_10%,var(--card))] text-orange-700 dark:text-orange-300 border-orange-500/25",
    hoverBorder: "hover:border-orange-500/50",
    hoverBg: "hover:bg-[color-mix(in_oklab,var(--color-orange-500)_5%,var(--card))]",
    banner: "bg-[color-mix(in_oklab,var(--color-orange-500)_6%,var(--card))] border-orange-500/25",
    dot: "bg-orange-500",
    bar: "from-orange-400 to-orange-600",
    solid: "border-orange-600 bg-orange-600 text-white shadow-md shadow-orange-600/25",
  },
  fuchsia: {
    iconWrap: "bg-[color-mix(in_oklab,var(--color-fuchsia-500)_10%,var(--card))] text-fuchsia-600 dark:text-fuchsia-400",
    text: "text-fuchsia-600 dark:text-fuchsia-400",
    chip: "bg-[color-mix(in_oklab,var(--color-fuchsia-500)_10%,var(--card))] text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-500/25",
    hoverBorder: "hover:border-fuchsia-500/50",
    hoverBg: "hover:bg-[color-mix(in_oklab,var(--color-fuchsia-500)_5%,var(--card))]",
    banner: "bg-[color-mix(in_oklab,var(--color-fuchsia-500)_6%,var(--card))] border-fuchsia-500/25",
    dot: "bg-fuchsia-500",
    bar: "from-fuchsia-400 to-fuchsia-600",
    solid: "border-fuchsia-600 bg-fuchsia-600 text-white shadow-md shadow-fuchsia-600/25",
  },
  teal: {
    iconWrap: "bg-[color-mix(in_oklab,var(--color-teal-500)_10%,var(--card))] text-teal-600 dark:text-teal-400",
    text: "text-teal-600 dark:text-teal-400",
    chip: "bg-[color-mix(in_oklab,var(--color-teal-500)_10%,var(--card))] text-teal-700 dark:text-teal-300 border-teal-500/25",
    hoverBorder: "hover:border-teal-500/50",
    hoverBg: "hover:bg-[color-mix(in_oklab,var(--color-teal-500)_5%,var(--card))]",
    banner: "bg-[color-mix(in_oklab,var(--color-teal-500)_6%,var(--card))] border-teal-500/25",
    dot: "bg-teal-500",
    bar: "from-teal-400 to-cyan-600",
    solid: "border-teal-600 bg-teal-600 text-white shadow-md shadow-teal-600/25",
  },
  brand: {
    iconWrap: "bg-[color-mix(in_oklab,var(--brand-500)_10%,var(--card))] text-brand-700 dark:text-brand-400",
    text: "text-brand-700 dark:text-brand-400",
    chip: "bg-[color-mix(in_oklab,var(--brand-500)_10%,var(--card))] text-brand-800 dark:text-brand-300 border-brand-500/25",
    hoverBorder: "hover:border-brand-500/50",
    hoverBg: "hover:bg-[color-mix(in_oklab,var(--brand-500)_5%,var(--card))]",
    banner: "bg-[color-mix(in_oklab,var(--brand-500)_6%,var(--card))] border-brand-500/25",
    dot: "bg-brand-500",
    bar: "from-brand-400 to-brand-alt-500",
    solid: "border-brand-600 bg-brand-600 text-white shadow-md shadow-brand-600/25",
  },
};

export const SUBJECT_HUE: Record<SubjectKey, Hue> = {
  maths: "sky",
  english: "fuchsia",
  reasoning: "orange",
  gk: "teal",
};

export const SUBJECT_LABEL: Record<SubjectKey, string> = {
  maths: "Quant",
  english: "English",
  reasoning: "Reasoning",
  gk: "General Knowledge",
};

export function subjectTheme(subject: SubjectKey): HueTheme {
  return HUE_THEME[SUBJECT_HUE[subject]];
}
