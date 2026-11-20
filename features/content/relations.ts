import type { RelationDiagram } from "./types";

/**
 * The standard circle arrangements used in "which diagram best represents the relation"
 * questions. Each one lists its circles (A, B, C) and, for checking, how every pair
 * relates. Box: REL_W × REL_H.
 */
export const REL_W = 180;
export const REL_H = 130;

export type Circle = { cx: number; cy: number; r: number };
/** How circle i relates to circle j: apart, overlapping, or i inside j / j inside i. */
export type PairRelation = "apart" | "overlap" | "in" | "contains";

export const RELATION_PATTERNS = {
  "2-apart": { circles: [[55, 65, 32], [125, 65, 32]], says: "two separate circles" },
  "2-overlap": { circles: [[70, 65, 38], [110, 65, 38]], says: "two overlapping circles" },
  "2-inside": { circles: [[90, 65, 52], [90, 76, 26]], says: "B inside A" },
  "3-apart": { circles: [[35, 65, 26], [90, 65, 26], [145, 65, 26]], says: "three separate circles" },
  "3-nested": { circles: [[90, 65, 56], [90, 74, 38], [90, 83, 19]], says: "C inside B inside A" },
  "3-two-inside-apart": { circles: [[90, 65, 56], [65, 65, 20], [115, 65, 20]], says: "B and C inside A, apart" },
  "3-two-inside-overlap": { circles: [[90, 65, 56], [76, 65, 26], [104, 65, 26]], says: "B and C inside A, overlapping each other" },
  "3-overlap": { circles: [[70, 50, 36], [110, 50, 36], [90, 84, 36]], says: "all three overlapping" },
  "3-overlap-apart": { circles: [[50, 65, 32], [90, 65, 32], [150, 65, 22]], says: "A and B overlap, C separate" },
  "3-chain": { circles: [[45, 65, 30], [90, 65, 30], [135, 65, 30]], says: "A overlaps B, B overlaps C, A and C apart" },
  "3-inside-apart": { circles: [[65, 65, 48], [65, 73, 24], [150, 65, 24]], says: "B inside A, C separate" },
  "3-inside-overlap-outer": { circles: [[70, 65, 50], [52, 70, 22], [130, 65, 30]], says: "B inside A, C overlaps A only" },
  "3-inside-overlap-both": { circles: [[75, 65, 52], [85, 65, 28], [125, 65, 30]], says: "B inside A, C overlaps A and B" },
  "3-overlap-one-inside": { circles: [[65, 65, 44], [120, 65, 36], [48, 65, 14]], says: "A and B overlap, C inside A only" },
  "3-in-both": { circles: [[70, 65, 42], [110, 65, 42], [90, 65, 12]], says: "A and B overlap, C inside both" },
} as const satisfies Record<string, { circles: readonly (readonly [number, number, number])[]; says: string }>;

export type RelationPattern = keyof typeof RELATION_PATTERNS;
export const RELATION_PATTERN_NAMES = Object.keys(RELATION_PATTERNS) as RelationPattern[];

export function patternCircles(pattern: RelationPattern): Circle[] {
  return RELATION_PATTERNS[pattern].circles.map(([cx, cy, r]) => ({ cx, cy, r }));
}

/** How circle a relates to circle b, from the geometry. */
export function pairRelation(a: Circle, b: Circle): PairRelation {
  const d = Math.hypot(a.cx - b.cx, a.cy - b.cy);
  if (d >= a.r + b.r) return "apart";
  if (d + a.r <= b.r) return "in";
  if (d + b.r <= a.r) return "contains";
  return "overlap";
}

/**
 * Where each circle's label goes: inside its own circle, as far as possible from every
 * edge, and outside circles drawn inside it.
 */
export function relationLabelSpots(circles: Circle[]): [number, number][] {
  return circles.map((c, i) => {
    let best: [number, number] = [c.cx, c.cy];
    let bestScore = -Infinity;
    for (let x = c.cx - c.r; x <= c.cx + c.r; x += 2) {
      for (let y = c.cy - c.r; y <= c.cy + c.r; y += 2) {
        if (Math.hypot(x - c.cx, y - c.cy) > c.r - 4) continue;
        // Being inside a circle that contains this one is fine; any other circle is not.
        const insideOther = circles.some((o, j) => j !== i && pairRelation(c, o) !== "in" && Math.hypot(x - o.cx, y - o.cy) < o.r);
        const edge = Math.min(...circles.map((o) => Math.abs(Math.hypot(x - o.cx, y - o.cy) - o.r)));
        const score = edge - (insideOther ? 100 : 0);
        if (score > bestScore) {
          bestScore = score;
          best = [x, y];
        }
      }
    }
    return best;
  });
}

export function relationSays(d: RelationDiagram): string {
  return RELATION_PATTERNS[d.pattern]?.says ?? "circles";
}
