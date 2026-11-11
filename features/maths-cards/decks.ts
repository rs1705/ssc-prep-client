import { FORMULAS, FORMULA_CATEGORIES, FORMULA_TOPICS, type FormulaCategory } from "@/lib/maths-formulas";

/**
 * Maths flashcard decks, built from content the app already has: the formula
 * bank (by area) and generated tables (squares, cubes, roots, fractions).
 * Text uses the same markdown + LaTeX format as RichText.
 */

export interface MathsCardItem {
  _id: string;
  /** Small label on the card, e.g. "Percentage" or "Squares". */
  label: string;
  prompt: string;
  answer: string;
  note?: string;
  example?: string;
}

export interface MathsDeck {
  id: string;
  label: string;
  group: "Formulas" | "Tables";
  build: () => MathsCardItem[];
}

const TOPIC_NAME = new Map(FORMULA_TOPICS.map((t) => [t.id, t]));

function formulaCards(category?: FormulaCategory): MathsCardItem[] {
  return FORMULAS.filter((f) => !category || TOPIC_NAME.get(f.topic)?.category === category).map((f) => ({
    _id: `f-${f.id}`,
    label: TOPIC_NAME.get(f.topic)?.name ?? "Formula",
    prompt: f.title,
    answer: f.body,
    note: f.note,
    example: f.example,
  }));
}

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/** k/n as a percentage: exact (mixed number when needed) plus a 2-decimal value. */
export function fractionPercent(k: number, n: number): string {
  const whole = Math.floor((100 * k) / n);
  const rem = (100 * k) % n;
  if (rem === 0) return `$${whole}\\%$`;
  const g = gcd(rem, n);
  const decimal = ((100 * k) / n).toFixed(2);
  return `$${whole}\\tfrac{${rem / g}}{${n / g}}\\%$ (≈ ${decimal}%)`;
}

const FRACTIONS: [number, number][] = [
  ...[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 16, 20].map((n): [number, number] => [1, n]),
  [2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [5, 6], [3, 8], [5, 8], [7, 8], [2, 7], [3, 7], [5, 9], [7, 12],
];

export const MATHS_DECKS: MathsDeck[] = [
  { id: "formulas", label: "All formulas", group: "Formulas", build: () => formulaCards() },
  ...FORMULA_CATEGORIES.map(
    (c): MathsDeck => ({ id: `formulas-${c.id}`, label: c.label, group: "Formulas", build: () => formulaCards(c.id) }),
  ),
  {
    id: "squares",
    label: "Squares 1–50",
    group: "Tables",
    build: () =>
      range(1, 50).map((n) => ({ _id: `sq-${n}`, label: "Squares", prompt: `$${n}^2$`, answer: `$${n * n}$` })),
  },
  {
    id: "cubes",
    label: "Cubes 1–30",
    group: "Tables",
    build: () =>
      range(1, 30).map((n) => ({ _id: `cu-${n}`, label: "Cubes", prompt: `$${n}^3$`, answer: `$${n ** 3}$` })),
  },
  {
    id: "roots",
    label: "Square roots",
    group: "Tables",
    build: () =>
      range(11, 50).map((n) => ({
        _id: `rt-${n}`,
        label: "Square roots",
        prompt: `$\\sqrt{${n * n}}$`,
        answer: `$${n}$`,
        note:
          n % 10 === 0
            ? undefined
            : n % 10 === 5
              ? "Ends in 25, so the root ends in 5."
              : `Ends in ${(n * n) % 10}, so the root ends in ${Math.min(n % 10, 10 - (n % 10))} or ${Math.max(n % 10, 10 - (n % 10))}.`,
      })),
  },
  {
    id: "fractions",
    label: "Fractions to %",
    group: "Tables",
    build: () =>
      FRACTIONS.map(([k, n]) => ({
        _id: `fr-${k}-${n}`,
        label: "Fractions to %",
        prompt: `$\\dfrac{${k}}{${n}}$`,
        answer: fractionPercent(k, n),
      })),
  },
];

export function mathsDeckById(id: string): MathsDeck {
  return MATHS_DECKS.find((d) => d.id === id) ?? MATHS_DECKS[0];
}
