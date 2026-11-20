import type { GeometryDiagram } from "./types";

/**
 * Figure counting ("how many triangles / squares are there in the figure?") over a
 * geometry figure's straight segments. Every segment end and every crossing is a
 * corner; two corners are joined when one drawn line covers the whole way between
 * them. A triangle is three joined corners not in a line; a rectangle is four joined
 * corners with right angles.
 */

type Pt = [number, number];

const EPS = 1e-6;

interface Line {
  /** A point on the line and its unit direction. */
  o: Pt;
  u: Pt;
  /** Covered stretches, as [from, to] along u, merged. */
  spans: [number, number][];
}

export interface SegmentGraph {
  corners: Pt[];
  /** joined[i][j]: one drawn line covers the whole way from corner i to corner j. */
  joined: boolean[][];
}

const key = (p: Pt) => `${Math.round(p[0] * 1e5)},${Math.round(p[1] * 1e5)}`;

function crossing(a1: Pt, a2: Pt, b1: Pt, b2: Pt): Pt | null {
  const d1: Pt = [a2[0] - a1[0], a2[1] - a1[1]], d2: Pt = [b2[0] - b1[0], b2[1] - b1[1]];
  const den = d1[0] * d2[1] - d1[1] * d2[0];
  if (Math.abs(den) < EPS) return null;
  const t = ((b1[0] - a1[0]) * d2[1] - (b1[1] - a1[1]) * d2[0]) / den;
  const s = ((b1[0] - a1[0]) * d1[1] - (b1[1] - a1[1]) * d1[0]) / den;
  if (t < -EPS || t > 1 + EPS || s < -EPS || s > 1 + EPS) return null;
  return [a1[0] + t * d1[0], a1[1] + t * d1[1]];
}

/** The corners of a figure and which of them are joined by drawn lines. */
export function segmentGraph(d: GeometryDiagram): SegmentGraph {
  const segs: [Pt, Pt][] = (d.segments ?? [])
    .map(([a, b]) => [d.points?.[a], d.points?.[b]] as [Pt | undefined, Pt | undefined])
    .filter((s): s is [Pt, Pt] => !!s[0] && !!s[1] && (s[0][0] !== s[1][0] || s[0][1] !== s[1][1]));

  // Collinear segments become one line with merged covered stretches.
  const lines: Line[] = [];
  for (const [a, b] of segs) {
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const u: Pt = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
    const scale = Math.max(1, Math.abs(a[0]), Math.abs(a[1]), Math.abs(b[0]), Math.abs(b[1]));
    let line = lines.find((l) => {
      const parallel = Math.abs(l.u[0] * u[1] - l.u[1] * u[0]) < 1e-6;
      const off = Math.abs((a[0] - l.o[0]) * l.u[1] - (a[1] - l.o[1]) * l.u[0]);
      return parallel && off < 1e-6 * scale;
    });
    if (!line) {
      line = { o: a, u, spans: [] };
      lines.push(line);
    }
    const ta = (a[0] - line.o[0]) * line.u[0] + (a[1] - line.o[1]) * line.u[1];
    const tb = (b[0] - line.o[0]) * line.u[0] + (b[1] - line.o[1]) * line.u[1];
    line.spans.push([Math.min(ta, tb), Math.max(ta, tb)]);
  }
  for (const l of lines) {
    l.spans.sort((x, y) => x[0] - y[0]);
    const merged: [number, number][] = [];
    for (const s of l.spans) {
      const last = merged[merged.length - 1];
      if (last && s[0] <= last[1] + EPS) last[1] = Math.max(last[1], s[1]);
      else merged.push([...s]);
    }
    l.spans = merged;
  }

  // Corners: every end and every crossing.
  const byKey = new Map<string, Pt>();
  const add = (p: Pt) => { if (!byKey.has(key(p))) byKey.set(key(p), p); };
  segs.forEach(([a, b]) => { add(a); add(b); });
  for (let i = 0; i < segs.length; i++) {
    for (let j = i + 1; j < segs.length; j++) {
      const p = crossing(segs[i][0], segs[i][1], segs[j][0], segs[j][1]);
      if (p) add(p);
    }
  }
  const corners = [...byKey.values()];

  const on = (l: Line, p: Pt): number | null => {
    const off = Math.abs((p[0] - l.o[0]) * l.u[1] - (p[1] - l.o[1]) * l.u[0]);
    if (off > 1e-6 * Math.max(1, Math.abs(p[0]), Math.abs(p[1]))) return null;
    return (p[0] - l.o[0]) * l.u[0] + (p[1] - l.o[1]) * l.u[1];
  };
  const n = corners.length;
  const joined = Array.from({ length: n }, () => Array<boolean>(n).fill(false));
  for (const l of lines) {
    const here = corners.map((p, i) => [i, on(l, p)] as const).filter((x): x is readonly [number, number] => x[1] !== null);
    for (const [i, ti] of here) {
      for (const [j, tj] of here) {
        if (i >= j) continue;
        const lo = Math.min(ti, tj), hi = Math.max(ti, tj);
        if (l.spans.some(([s, e]) => s <= lo + EPS && hi <= e + EPS)) joined[i][j] = joined[j][i] = true;
      }
    }
  }
  return { corners, joined };
}

const area2 = (a: Pt, b: Pt, c: Pt) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);

/** Triangles made by the drawn lines. */
export function countTriangles(d: GeometryDiagram): number {
  const { corners: c, joined: J } = segmentGraph(d);
  const scale = Math.max(1, ...c.flat().map(Math.abs));
  let count = 0;
  for (let i = 0; i < c.length; i++)
    for (let j = i + 1; j < c.length; j++) {
      if (!J[i][j]) continue;
      for (let k = j + 1; k < c.length; k++) {
        if (J[i][k] && J[j][k] && Math.abs(area2(c[i], c[j], c[k])) > 1e-6 * scale * scale) count++;
      }
    }
  return count;
}

/** Rectangles (squares included) made by the drawn lines, and how many are squares. */
export function countRectangleShapes(d: GeometryDiagram): { rectangles: number; squares: number } {
  const { corners: c, joined: J } = segmentGraph(d);
  const index = new Map(c.map((p, i) => [key(p), i]));
  const seen = new Set<string>();
  let squares = 0;
  for (let a = 0; a < c.length; a++) {
    for (let b = 0; b < c.length; b++) {
      if (b === a || !J[a][b]) continue;
      for (let e = b + 1; e < c.length; e++) {
        if (e === a || !J[a][e]) continue;
        const u: Pt = [c[b][0] - c[a][0], c[b][1] - c[a][1]], v: Pt = [c[e][0] - c[a][0], c[e][1] - c[a][1]];
        const lu = Math.hypot(...u), lv = Math.hypot(...v);
        if (Math.abs(u[0] * v[0] + u[1] * v[1]) > 1e-6 * lu * lv) continue;
        const f = index.get(key([c[b][0] + v[0], c[b][1] + v[1]]));
        if (f === undefined || !J[b][f] || !J[e][f]) continue;
        const id = [a, b, e, f].sort((x, y) => x - y).join("-");
        if (seen.has(id)) continue;
        seen.add(id);
        if (Math.abs(lu - lv) < 1e-6 * Math.max(lu, lv)) squares++;
      }
    }
  }
  return { rectangles: seen.size, squares };
}

export const countSquares = (d: GeometryDiagram) => countRectangleShapes(d).squares;
export const countRectangles = (d: GeometryDiagram) => countRectangleShapes(d).rectangles;

/** The count a counting figure asks for, or null when it isn't one. */
export function figureCount(d: GeometryDiagram): number | null {
  if (d.count === "triangles") return countTriangles(d);
  if (d.count === "squares") return countSquares(d);
  if (d.count === "rectangles") return countRectangles(d);
  return null;
}
