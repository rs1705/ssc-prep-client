import type { MatchDeck } from "./decks";
import type { Pair } from "./game";

/** Match decks generated in the browser for Maths and Reasoning (no network needed). */

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/** 12.50 -> "12.5", 33.333 -> "33.33" */
function percent(k: number, n: number): string {
  return `${Number(((100 * k) / n).toFixed(2))}%`;
}

const FRACTIONS: [number, number][] = [
  ...[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 16, 20].map((n): [number, number] => [1, n]),
  [2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [5, 6], [3, 8], [5, 8], [7, 8], [2, 7], [3, 7], [5, 9],
];

export const MATHS_MATCH_DECKS: MatchDeck[] = [
  {
    id: "squares",
    label: "Squares",
    leftLabel: "Number",
    rightLabel: "Square",
    local: (): Pair[] => range(11, 40).map((n) => ({ id: `sq${n}`, left: `${n}²`, right: String(n * n) })),
  },
  {
    id: "cubes",
    label: "Cubes",
    leftLabel: "Number",
    rightLabel: "Cube",
    local: (): Pair[] => range(2, 25).map((n) => ({ id: `cu${n}`, left: `${n}³`, right: String(n ** 3) })),
  },
  {
    id: "roots",
    label: "Square roots",
    leftLabel: "Root of",
    rightLabel: "Answer",
    local: (): Pair[] => range(11, 40).map((n) => ({ id: `rt${n}`, left: `√${n * n}`, right: String(n) })),
  },
  {
    id: "fractions",
    label: "Fractions to %",
    leftLabel: "Fraction",
    rightLabel: "Percent",
    local: (): Pair[] => FRACTIONS.map(([k, n]) => ({ id: `fr${k}-${n}`, left: `${k}/${n}`, right: percent(k, n) })),
  },
];

export const REASONING_MATCH_DECKS: MatchDeck[] = [
  {
    id: "positions",
    label: "Letter positions",
    leftLabel: "Letter",
    rightLabel: "Position",
    local: (): Pair[] => ALPHABET.map((l, i) => ({ id: `p${l}`, left: l, right: String(i + 1) })),
  },
  {
    id: "from-end",
    label: "Positions from the end",
    leftLabel: "Letter",
    rightLabel: "From Z",
    local: (): Pair[] => ALPHABET.map((l, i) => ({ id: `e${l}`, left: l, right: String(26 - i) })),
  },
  {
    id: "opposites",
    label: "Opposite letters",
    leftLabel: "Letter",
    rightLabel: "Opposite",
    local: (): Pair[] => ALPHABET.slice(0, 13).map((l, i) => ({ id: `o${l}`, left: l, right: ALPHABET[25 - i] })),
  },
];
