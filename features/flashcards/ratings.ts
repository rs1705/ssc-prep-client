/** Study-mode ratings (FSRS: 1 Again, 2 Hard, 3 Good, 4 Easy). */
export type ActionType = "AGAIN" | "HARD" | "GOOD" | "EASY";

export const RATINGS: {
  action: ActionType;
  label: string;
  rating: 1 | 2 | 3 | 4;
  key: string;
  className: string;
}[] = [
  {
    action: "AGAIN",
    label: "Again",
    rating: 1,
    key: "1",
    className:
      "border-rose-500/40 bg-[color-mix(in_oklab,var(--color-rose-500)_10%,var(--card))] text-rose-700 hover:border-rose-500/70 dark:text-rose-300",
  },
  {
    action: "HARD",
    label: "Hard",
    rating: 2,
    key: "2",
    className: "border-border bg-card text-foreground hover:border-foreground/30",
  },
  {
    action: "GOOD",
    label: "Good",
    rating: 3,
    key: "3",
    className:
      "border-emerald-500/40 bg-[color-mix(in_oklab,var(--color-emerald-500)_10%,var(--card))] text-emerald-700 hover:border-emerald-500/70 dark:text-emerald-300",
  },
  {
    action: "EASY",
    label: "Easy",
    rating: 4,
    key: "4",
    className:
      "border-sky-500/40 bg-[color-mix(in_oklab,var(--color-sky-500)_10%,var(--card))] text-sky-700 hover:border-sky-500/70 dark:text-sky-300",
  },
];

/** "<1 min", "10 min", "5 h", "3 d", "2 mo", "1 y" from now until `iso`. */
export function formatInterval(iso: string | undefined, now: number = Date.now()): string | null {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - now;
  if (Number.isNaN(ms)) return null;
  const min = ms / 60_000;
  if (min < 1) return "<1 min";
  if (min < 60) return `${Math.round(min)} min`;
  const hours = min / 60;
  if (hours < 24) return `${Math.round(hours)} h`;
  const days = hours / 24;
  if (days < 30) return `${Math.round(days)} d`;
  if (days < 365) return `${Math.round(days / 30)} mo`;
  return `${Math.round(days / 365)} y`;
}

/** Friendly label for a card type. */
export const TYPE_LABEL: Record<string, string> = {
  vocab: "Vocabulary",
  idiom: "Idiom",
  ows: "One-word substitution",
};
