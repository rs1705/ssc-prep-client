import type { GeometryDiagram } from "./types";
import { splitSegmentName } from "./validate";
import { segmentBoxDistance } from "./labels";

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
  /** Dimension lines (with end ticks) for labelled distances that have no line of their own. */
  dimensions: { x1: number; y1: number; x2: number; y2: number; ticks: [Pt, Pt][] }[];
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
  /** Gap between a box and a circle's outline (0 when the outline runs through the box). */
  const circleGap = (c: { cx: number; cy: number; r: number }, x: number, y: number, hw: number, hh: number) => {
    const nx = Math.max(Math.abs(x - c.cx) - hw, 0), ny = Math.max(Math.abs(y - c.cy) - hh, 0);
    const near = Math.hypot(nx, ny);
    const far = Math.hypot(Math.abs(x - c.cx) + hw, Math.abs(y - c.cy) + hh);
    return near <= c.r && c.r <= far ? 0 : Math.min(Math.abs(near - c.r), Math.abs(far - c.r));
  };
  const crowd = (x: number, y: number, hw: number, hh: number, ignoreDot = -1, own?: [Pt, Pt]) => {
    let p = 0;
    const ownGap = own ? segmentBoxDistance(own, x, y, hw, hh) : 0;
    for (const sg of segs) {
      if (own && sg === own) continue;
      const gap = segmentBoxDistance(sg, x, y, hw, hh);
      p += Math.max(0, 6 - gap) * 12 + (gap < 0.5 ? 80 : 0); // crossing a line is far worse than nearing it
      // A length label must sit nearer its own line than any other, or it reads as the other's length.
      if (own && gap < ownGap + 8) p += (ownGap + 8 - gap) * 6;
    }
    for (const c of circles) {
      const gap = circleGap(c, x, y, hw, hh);
      p += Math.max(0, 5 - gap) * 12 + (gap < 0.5 ? 80 : 0);
    }
    dots.forEach(([dx, dy], i) => {
      if (i === ignoreDot) return;
      const nx = Math.max(Math.abs(dx - x) - hw, 0), ny = Math.max(Math.abs(dy - y) - hh, 0);
      p += Math.max(0, 7 - Math.hypot(nx, ny)) * 10;
    });
    for (const b of boxes) {
      const ovx = Math.max(0, hw + b.w / 2 + 4 - Math.abs(x - b.x));
      const ovy = Math.max(0, hh + b.h / 2 + 4 - Math.abs(y - b.y));
      // Overlapping text is unreadable: always worse than a less tidy spot.
      const overlap = Math.abs(x - b.x) < hw + b.w / 2 && Math.abs(y - b.y) < hh + b.h / 2;
      p += ovx * ovy * 0.5 + (overlap ? 150 : 0);
    }
    if (x - hw < 2 || x + hw > W - 2 || y - hh < 2 || y + hh > H - 2) p += 500; // keep inside the figure
    return p;
  };

  // Length labels. A drawn segment gets its label beside it; a distance with no line of
  // its own (between two chords, say) gets a dimension line with end ticks, offset to the
  // side, and the label beside that, so it can't be read as the length of a nearby line.
  // Order: dimension lines, then point names (they have few good spots), then the length
  // labels, which can move along their line to make room.
  const lengthLabels: GeometryLayout["lengthLabels"] = [];
  const dimensions: GeometryLayout["dimensions"] = [];
  const drawn = new Set((d.segments ?? []).flatMap(([a, b]) => [a + "|" + b, b + "|" + a]));
  const DIM = 11;
  const wanted = Object.entries(d.labels ?? {}).flatMap(([key, text]) => {
    const pair = splitSegmentName(key, names);
    return pair ? [{ pair, text, isDrawn: drawn.has(pair[0] + "|" + pair[1]) }] : [];
  });
  const placeLength = (pair: [string, string], text: string, isDrawn: boolean, sides: number[]) => {
    const [x1, y1] = P2(pair[0]), [x2, y2] = P2(pair[1]);
    let nx = -(y2 - y1), ny = x2 - x1;
    const nl = Math.hypot(nx, ny) || 1;
    nx /= nl; ny /= nl;
    const hw = text.length * 4.2 + 4, hh = 9;
    // Distance from the line to the box edge along the normal, so any slope gets the same gap.
    const reach = Math.abs(nx) * hw + Math.abs(ny) * hh;
    let best = { x: (x1 + x2) / 2, y: (y1 + y2) / 2, side: sides[0], score: Infinity };
    for (const side of sides) {
      const shift = isDrawn ? 0 : DIM * side;
      // The line the label belongs to: the drawn segment itself, or the dimension line.
      const own: [Pt, Pt] = isDrawn
        ? segs[(d.segments ?? []).findIndex(([a, b]) => (a === pair[0] && b === pair[1]) || (a === pair[1] && b === pair[0]))]
        : [[x1 + nx * shift, y1 + ny * shift], [x2 + nx * shift, y2 + ny * shift]];
      for (const t of isDrawn ? [0.5, 0.38, 0.62, 0.28, 0.72, 0.18, 0.82] : [0.5, 0.4, 0.6]) {
        for (const gap of [5, 10, 18, 28]) {
          const off = shift * side + reach + gap;
          const x = x1 + (x2 - x1) * t + nx * off * side, y = y1 + (y2 - y1) * t + ny * off * side;
          const score = crowd(x, y, hw, hh, -1, own) + Math.abs(t - 0.5) * 8 + gap * 0.8;
          if (score < best.score) best = { x, y, side, score };
        }
      }
    }
    return { ...best, hw, hh, x1, y1, x2, y2, nx, ny };
  };

  // 1. Dimension lines, on whichever side has room for their label.
  const dimSide = new Map<number, number>();
  wanted.forEach((w, i) => {
    if (w.isDrawn) return;
    const p = placeLength(w.pair, w.text, false, [1, -1]);
    dimSide.set(i, p.side);
    const s = DIM * p.side, tick = 5;
    const ax = p.x1 + p.nx * s, ay = p.y1 + p.ny * s, bx = p.x2 + p.nx * s, by = p.y2 + p.ny * s;
    segs.push([[ax, ay], [bx, by]]); // labels keep clear of it
    dimensions.push({
      x1: ax, y1: ay, x2: bx, y2: by,
      ticks: [
        [[ax - p.nx * tick, ay - p.ny * tick], [ax + p.nx * tick, ay + p.ny * tick]],
        [[bx - p.nx * tick, by - p.ny * tick], [bx + p.nx * tick, by + p.ny * tick]],
      ],
    });
  });

  // 2. Reserve each length label's best spot, so point names go around it.
  const reserved = wanted.map((w, i) => {
    const p = placeLength(w.pair, w.text, w.isDrawn, w.isDrawn ? [1, -1] : [dimSide.get(i)!]);
    const box = { x: p.x, y: p.y, w: p.hw * 2, h: p.hh * 2 };
    boxes.push(box);
    return box;
  });

  // 3. Point names: 16 directions around the point, at three distances.
  const points: GeometryLayout["points"] = names.map((name, i) => {
    const [x, y] = dots[i];
    const hw = 6 + name.length * 4, hh = 8;
    let ax = x - centroid[0], ay = y - centroid[1];
    const al = Math.hypot(ax, ay) || 1;
    ax /= al; ay /= al;
    let best = { x: x + 15, y, score: Infinity };
    for (let n = 0; n < 16; n++) {
      const a = (Math.PI * 2 * n) / 16, ux = Math.cos(a), uy = Math.sin(a);
      for (const dist of [15, 21, 27]) {
        const lx = x + ux * dist, ly = y + uy * dist;
        // Slight preference for pointing away from the figure's centre.
        const score = crowd(lx, ly, hw, hh, i) - (ux * ax + uy * ay) * 2 + (dist - 15) * 0.6;
        if (score < best.score) best = { x: lx, y: ly, score };
      }
    }
    boxes.push({ x: best.x, y: best.y, w: hw * 2, h: hh * 2 });
    return { name, x, y, labelX: best.x, labelY: best.y };
  });

  // 4. Length labels, around everything above (their reserved spot is free unless a point name had no other room).
  for (const box of reserved) boxes.splice(boxes.indexOf(box), 1);
  wanted.forEach((w, i) => {
    const p = placeLength(w.pair, w.text, w.isDrawn, w.isDrawn ? [1, -1] : [dimSide.get(i)!]);
    boxes.push({ x: p.x, y: p.y, w: p.hw * 2, h: p.hh * 2 });
    lengthLabels.push({ x: p.x, y: p.y, w: p.hw * 2, h: p.hh * 2, text: w.text });
  });

  return { circles, segments, rightAngles, lengthLabels, dimensions, points };
}
