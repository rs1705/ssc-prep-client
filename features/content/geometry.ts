import type { GeometryDiagram } from "./types";
import { splitSegmentName } from "./validate";

/**
 * Lays out a geometry spec in screen coordinates: scales the figure into the box and
 * places every label where it has the most room (ported from design/diagram-lab.html).
 * Pure, so it is unit-tested and shared by every renderer.
 */

export const GEO_W = 380;
export const GEO_H = 280;
const PAD = 40;

type Pt = [number, number];

export interface GeometryLayout {
  circles: { cx: number; cy: number; r: number }[];
  segments: { x1: number; y1: number; x2: number; y2: number; highlight: boolean }[];
  rightAngles: { points: Pt[]; highlight: boolean }[];
  /** Length labels with their background box. */
  lengthLabels: { x: number; y: number; w: number; h: number; text: string }[];
  points: { name: string; x: number; y: number; labelX: number; labelY: number }[];
}

export function layoutGeometry(d: GeometryDiagram, W = GEO_W, H = GEO_H): GeometryLayout {
  const pts = d.points;
  const names = Object.keys(pts);
  const xs: number[] = [], ys: number[] = [];
  for (const [x, y] of Object.values(pts)) { xs.push(x); ys.push(y); }
  for (const c of d.circles ?? []) {
    const [cx, cy] = pts[c.center];
    const [tx, ty] = pts[c.through];
    const r = Math.hypot(tx - cx, ty - cy);
    xs.push(cx - r, cx + r); ys.push(cy - r, cy + r);
  }
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  // A figure that is a single line still needs a scale on both axes.
  const spanX = maxX - minX || 1, spanY = maxY - minY || 1;
  const k = Math.min((W - 2 * PAD) / spanX, (H - 2 * PAD) / spanY);
  const ox = (W - k * spanX) / 2, oy = (H - k * spanY) / 2;
  const X = (x: number) => ox + (x - minX) * k;
  const Y = (y: number) => H - (oy + (y - minY) * k);
  const P2 = (n: string): Pt => [X(pts[n][0]), Y(pts[n][1])];
  const centroid: Pt = [X(xs.reduce((a, b) => a + b, 0) / xs.length), Y(ys.reduce((a, b) => a + b, 0) / ys.length)];
  const hl = new Set(d.highlight ?? []);

  const circles = (d.circles ?? []).map((c) => {
    const [cx, cy] = P2(c.center), [tx, ty] = P2(c.through);
    return { cx, cy, r: Math.hypot(tx - cx, ty - cy) };
  });
  const segments = (d.segments ?? []).map(([a, b]) => {
    const [x1, y1] = P2(a), [x2, y2] = P2(b);
    return { x1, y1, x2, y2, highlight: hl.has(a + b) || hl.has(b + a) };
  });
  const rightAngles = (d.rightAngles ?? []).map((r) => {
    const [vx, vy] = P2(r.at), [ax, ay] = P2(r.from), [bx, by] = P2(r.to);
    const u = [ax - vx, ay - vy], w = [bx - vx, by - vy];
    const lu = Math.hypot(u[0], u[1]) || 1, lw = Math.hypot(w[0], w[1]) || 1, L = 13;
    const p1: Pt = [vx + (u[0] / lu) * L, vy + (u[1] / lu) * L];
    const p3: Pt = [vx + (w[0] / lw) * L, vy + (w[1] / lw) * L];
    const p2: Pt = [p1[0] + (w[0] / lw) * L, p1[1] + (w[1] / lw) * L];
    return { points: [p1, p2, p3], highlight: hl.has("right") };
  });

  // ---- Label placement: try candidate spots, keep the one with the most clearance ----
  const segs: [Pt, Pt][] = segments.map((s) => [[s.x1, s.y1], [s.x2, s.y2]]);
  const dots = names.map(P2);
  const boxes: { x: number; y: number; w: number; h: number }[] = [];
  const distToSeg = (px: number, py: number, [[ax, ay], [bx, by]]: [Pt, Pt]) => {
    const vx = bx - ax, vy = by - ay, L2 = vx * vx + vy * vy || 1;
    const t = Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / L2));
    return Math.hypot(px - (ax + t * vx), py - (ay + t * vy));
  };
  const crowd = (x: number, y: number, hw: number, hh: number, ignoreDot = -1) => {
    let p = 0;
    const clear = Math.max(hw, hh) + 4;
    for (const sg of segs) p += Math.max(0, clear - distToSeg(x, y, sg)) * 3;
    for (const r of circles) p += Math.max(0, clear - Math.abs(Math.hypot(x - r.cx, y - r.cy) - r.r)) * 3;
    dots.forEach(([dx, dy], i) => {
      if (i !== ignoreDot) p += Math.max(0, clear + 2 - Math.hypot(x - dx, y - dy)) * 4;
    });
    for (const b of boxes) {
      const ovx = Math.max(0, hw + b.w / 2 + 4 - Math.abs(x - b.x));
      const ovy = Math.max(0, hh + b.h / 2 + 4 - Math.abs(y - b.y));
      p += ovx * ovy * 0.5;
    }
    if (x - hw < 2 || x + hw > W - 2 || y - hh < 2 || y + hh > H - 2) p += 500; // keep inside the figure
    return p;
  };

  // Length labels first: along the segment (middle, then towards the ends), on either side.
  const lengthLabels: GeometryLayout["lengthLabels"] = [];
  for (const [key, text] of Object.entries(d.labels ?? {})) {
    const pair = splitSegmentName(key, names);
    if (!pair) continue;
    const [x1, y1] = P2(pair[0]), [x2, y2] = P2(pair[1]);
    let nx = -(y2 - y1), ny = x2 - x1;
    const nl = Math.hypot(nx, ny) || 1;
    nx /= nl; ny /= nl;
    const hw = text.length * 4.2 + 4, hh = 9;
    let best = { x: (x1 + x2) / 2, y: (y1 + y2) / 2, score: Infinity };
    for (const t of [0.5, 0.38, 0.62, 0.28, 0.72]) {
      for (const side of [1, -1]) {
        for (const off of [16, 22]) {
          const x = x1 + (x2 - x1) * t + nx * off * side, y = y1 + (y2 - y1) * t + ny * off * side;
          const score = crowd(x, y, hw, hh) + Math.abs(t - 0.5) * 8 + (off - 16);
          if (score < best.score) best = { x, y, score };
        }
      }
    }
    boxes.push({ x: best.x, y: best.y, w: hw * 2, h: hh * 2 });
    lengthLabels.push({ x: best.x, y: best.y, w: hw * 2, h: hh * 2, text });
  }

  // Point names: 16 directions around the point, at two distances.
  const points: GeometryLayout["points"] = names.map((name, i) => {
    const [x, y] = dots[i];
    const hw = 6 + name.length * 4, hh = 8;
    let ax = x - centroid[0], ay = y - centroid[1];
    const al = Math.hypot(ax, ay) || 1;
    ax /= al; ay /= al;
    let best = { x: x + 15, y, score: Infinity };
    for (let n = 0; n < 16; n++) {
      const a = (Math.PI * 2 * n) / 16, ux = Math.cos(a), uy = Math.sin(a);
      for (const dist of [15, 21]) {
        const lx = x + ux * dist, ly = y + uy * dist;
        // Slight preference for pointing away from the figure's centre.
        const score = crowd(lx, ly, hw, hh, i) - (ux * ax + uy * ay) * 2 + (dist - 15) * 0.6;
        if (score < best.score) best = { x: lx, y: ly, score };
      }
    }
    boxes.push({ x: best.x, y: best.y, w: hw * 2, h: hh * 2 });
    return { name, x, y, labelX: best.x, labelY: best.y };
  });

  return { circles, segments, rightAngles, lengthLabels, points };
}
