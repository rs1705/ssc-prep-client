import type { Pt } from "./labels";
import type { RegionsDiagram } from "./types";

/**
 * Layout for "numbers in regions" figures: 2 or 3 overlapping shapes (circle, triangle,
 * square). A few spacings and triangle directions are tried; the one that leaves the
 * most room around every region's number wins. Each number sits at the point of its
 * region furthest from the lines.
 */

type Shape = RegionsDiagram["sets"][number]["shape"];

const MARGIN = 14;
const SIZE = { circle: 66, square: 60, triangle: 104 };

/** Every region key for n groups: "A", "B", "AB", … */
export function regionKeys(n: 2 | 3): string[] {
  return n === 2 ? ["A", "B", "AB"] : ["A", "B", "C", "AB", "AC", "BC", "ABC"];
}

/** The outline of a shape centred at c, as polygon points (circles as many points). */
export function shapeOutline(shape: Shape, [x, y]: Pt, pointDown = false): Pt[] {
  if (shape === "square") {
    const s = SIZE.square;
    return [[x - s, y - s], [x + s, y - s], [x + s, y + s], [x - s, y + s]];
  }
  if (shape === "triangle") {
    const R = SIZE.triangle, dir = pointDown ? 1 : -1;
    return [0, 1, 2].map((k) => {
      const a = dir * (Math.PI / 2) + (k * 2 * Math.PI) / 3;
      return [x + R * Math.cos(a), y + R * Math.sin(a)] as Pt;
    });
  }
  const r = SIZE.circle;
  return Array.from({ length: 40 }, (_, k) => {
    const a = (k / 40) * 2 * Math.PI;
    return [x + r * Math.cos(a), y + r * Math.sin(a)] as Pt;
  });
}

export function pointInPolygon([px, py]: Pt, poly: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function distToSegment([px, py]: Pt, [x1, y1]: Pt, [x2, y2]: Pt): number {
  const vx = x2 - x1, vy = y2 - y1, L2 = vx * vx + vy * vy || 1;
  const t = Math.max(0, Math.min(1, ((px - x1) * vx + (py - y1) * vy) / L2));
  return Math.hypot(px - (x1 + t * vx), py - (y1 + t * vy));
}

function distToOutline(p: Pt, poly: Pt[]): number {
  let best = Infinity;
  for (let i = 0; i < poly.length; i++) best = Math.min(best, distToSegment(p, poly[i], poly[(i + 1) % poly.length]));
  return best;
}

function bbox(outlines: Pt[][]) {
  const xs = outlines.flat().map((p) => p[0]), ys = outlines.flat().map((p) => p[1]);
  return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
}

/**
 * For each region, the point inside it furthest from every outline, and that distance.
 * Searched on a grid of `step` px.
 */
export function regionSpots(outlines: Pt[][], step = 4): Record<string, { at: Pt; clearance: number }> {
  const letters = "ABC".slice(0, outlines.length);
  const b = bbox(outlines);
  const best: Record<string, { at: Pt; clearance: number }> = {};
  for (let x = b.x0 + step / 2; x < b.x1; x += step) {
    for (let y = b.y0 + step / 2; y < b.y1; y += step) {
      const p: Pt = [x, y];
      const key = outlines.map((o, i) => (pointInPolygon(p, o) ? letters[i] : "")).join("");
      if (!key) continue;
      const clearance = Math.min(...outlines.map((o) => distToOutline(p, o)));
      if (!best[key] || clearance > best[key].clearance) best[key] = { at: p, clearance };
    }
  }
  return best;
}

export interface RegionsLayout {
  width: number;
  height: number;
  shapes: { shape: Shape; outline: Pt[]; label: string }[];
  /** Where each region's number goes. */
  spots: Record<string, Pt>;
  /** How far each spot is from the nearest line. */
  clearance: Record<string, number>;
  /** Radius of circle shapes. */
  circleR: number;
}

/** Centres for n groups, pushed apart by `spread`. */
function centres(n: 2 | 3, spread: number): Pt[] {
  const d = 40 * spread;
  return n === 2 ? [[-d, 0], [d, 0]] : [[-d, -d * 0.85], [d, -d * 0.85], [0, d * 0.85]];
}

export function layoutRegions(d: RegionsDiagram): RegionsLayout {
  const n = (d.sets.length >= 3 ? 3 : 2) as 2 | 3;
  const sets = d.sets.slice(0, n);
  const keys = regionKeys(n);
  const hasTriangle = sets.some((s) => s.shape === "triangle");
  const directions = hasTriangle ? [[false, true], [true, true], [false, false], [true, false]] : [[false, true]];

  let best: { outlines: Pt[][]; found: Record<string, { at: Pt; clearance: number }>; worst: number } | null = null;
  for (const spread of [0.9, 1, 1.15, 1.3]) {
    for (const [abDown, cDown] of directions) {
      const outlines = sets.map((s, i) => shapeOutline(s.shape, centres(n, spread)[i], i === 2 ? cDown : abDown));
      const found = regionSpots(outlines, 5);
      const worst = Math.min(...keys.map((k) => found[k]?.clearance ?? -1));
      if (!best || worst > best.worst + 0.5) best = { outlines, found, worst };
    }
  }
  // Fine-tune the spots of the winner.
  const outlines0 = best!.outlines;
  const found = regionSpots(outlines0, 3);

  const b = bbox(outlines0);
  const pad = MARGIN + (d.outside !== undefined ? 22 : 0);
  const shift = ([x, y]: Pt): Pt => [x - b.x0 + pad, y - b.y0 + pad];
  const width = b.x1 - b.x0 + pad * 2, height = b.y1 - b.y0 + pad * 2;
  return {
    width,
    height,
    shapes: sets.map((s, i) => ({ shape: s.shape, outline: outlines0[i].map(shift), label: s.label })),
    spots: Object.fromEntries(Object.entries(found).map(([k, v]) => [k, shift(v.at)])),
    clearance: Object.fromEntries(Object.entries(found).map(([k, v]) => [k, v.clearance])),
    circleR: SIZE.circle,
  };
}
