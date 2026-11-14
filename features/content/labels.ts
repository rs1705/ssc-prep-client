/**
 * Places text labels beside line segments so they keep clear of every line, dot and
 * label already placed. Used by the direction-path diagram (geometry has its own
 * tuned version in geometry.ts).
 */

export type Pt = [number, number];

export interface LabelRequest {
  text: string;
  /** The segment the label belongs to; candidates sit beside it. */
  along: [Pt, Pt];
  /** Approximate width of one character, in px. */
  charWidth: number;
  /** Positions along the segment to try, best first. */
  ts?: number[];
  /** Distances from the segment to try. */
  offsets?: number[];
}

export interface PlacedLabel {
  text: string;
  /** Centre of the label box. */
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Obstacles {
  segments: [Pt, Pt][];
  dots: { at: Pt; r: number }[];
}

const LABEL_H = 14;
const GAP = 4;

/** Shortest distance between a segment and a box (0 when they touch). */
export function segmentBoxDistance([a, b]: [Pt, Pt], cx: number, cy: number, hw: number, hh: number): number {
  let best = Infinity;
  const steps = Math.max(8, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 4));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const px = a[0] + (b[0] - a[0]) * t, py = a[1] + (b[1] - a[1]) * t;
    const dx = Math.max(Math.abs(px - cx) - hw, 0), dy = Math.max(Math.abs(py - cy) - hh, 0);
    best = Math.min(best, Math.hypot(dx, dy));
    if (best === 0) break;
  }
  return best;
}

export function placeLabels(requests: LabelRequest[], obstacles: Obstacles, W: number, H: number): PlacedLabel[] {
  const placed: PlacedLabel[] = [];
  for (const req of requests) {
    const [[x1, y1], [x2, y2]] = req.along;
    const len = Math.hypot(x2 - x1, y2 - y1) || 1;
    const nx = -(y2 - y1) / len, ny = (x2 - x1) / len;
    const w = req.text.length * req.charWidth + 4, h = LABEL_H;
    const hw = w / 2, hh = h / 2;
    let best: PlacedLabel & { score: number } = { text: req.text, x: (x1 + x2) / 2, y: (y1 + y2) / 2, w, h, score: Infinity };
    for (const t of req.ts ?? [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8]) {
      for (const side of [1, -1]) {
        for (const off of req.offsets ?? [hh + GAP + 2, hh + GAP + 10, hw + GAP, hw + GAP + 8]) {
          const x = x1 + (x2 - x1) * t + nx * off * side;
          const y = y1 + (y2 - y1) * t + ny * off * side;
          let score = Math.abs(t - 0.5) * 6 + off * 0.15;
          for (const s of obstacles.segments) {
            const d = segmentBoxDistance(s, x, y, hw, hh);
            if (d < GAP) score += (GAP - d) * 40;
          }
          for (const dot of obstacles.dots) {
            const dx = Math.max(Math.abs(dot.at[0] - x) - hw, 0), dy = Math.max(Math.abs(dot.at[1] - y) - hh, 0);
            const d = Math.hypot(dx, dy) - dot.r;
            if (d < GAP) score += (GAP - d) * 40;
          }
          for (const p of placed) {
            const ox = Math.max(0, Math.min(x + hw, p.x + p.w / 2) - Math.max(x - hw, p.x - p.w / 2) + GAP);
            const oy = Math.max(0, Math.min(y + hh, p.y + p.h / 2) - Math.max(y - hh, p.y - p.h / 2) + GAP);
            score += ox * oy * 2;
          }
          if (x - hw < 2 || x + hw > W - 2 || y - hh < 2 || y + hh > H - 2) score += 2000;
          if (score < best.score) best = { text: req.text, x, y, w, h, score };
        }
      }
    }
    placed.push({ text: best.text, x: best.x, y: best.y, w: best.w, h: best.h });
  }
  return placed;
}
