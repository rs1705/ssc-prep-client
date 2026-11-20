import { anchorPoint, norm360, vectorDeg, type Pt } from "./panel";
import type { FoldCut, FoldDiagram, FoldSide, PanelCell, PanelShape } from "./types";

/**
 * Paper folding, as pure geometry. The sheet is the unit square (y down). Each fold
 * reflects one part of the current sheet over a line through its box: the middle line
 * for top/bottom/left/right, a diagonal for tl/tr/bl/br. Cuts are placed in the folded
 * sheet's box; `unfold` reflects them back out through every fold in reverse order.
 */

export const FOLD_SIDES: FoldSide[] = ["top", "bottom", "left", "right", "tl", "tr", "bl", "br"];
export const CUT_SHAPES: FoldCut["shape"][] = ["circle", "ellipse", "square", "rect", "diamond", "triangle", "semicircle"];

const EPS = 1e-6;
const DEFAULT_CUT = 0.18;

export interface Box { minX: number; minY: number; maxX: number; maxY: number }

export interface FoldLine {
  /** Two points on the line. */
  a: Pt;
  b: Pt;
  /** Its direction, degrees clockwise from up. */
  deg: number;
}

export interface FoldStage {
  side: FoldSide;
  /** The sheet before this fold. */
  before: Pt[];
  line: FoldLine;
  /** The part that stays put. */
  kept: Pt[];
  /** The part that moves, where it was. */
  moved: Pt[];
  /** The part that moved, where it lands. */
  flap: Pt[];
  /** The sheet after this fold. */
  after: Pt[];
}

/** A cut in sheet coordinates. */
export interface SheetCut {
  shape: FoldCut["shape"];
  at: Pt;
  /** Width in sheet units (the unfolded sheet is 1 wide). */
  w: number;
  aspect?: number;
  rotate: number;
}

export const SQUARE: Pt[] = [[0, 0], [1, 0], [1, 1], [0, 1]];

export function boxOf(pts: Pt[]): Box {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  return { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys) };
}

/** The fold line for `side` across a sheet's box, and a point on the moving side. */
export function foldLine(sheet: Pt[], side: FoldSide): { line: FoldLine; movingRef: Pt } {
  const { minX, minY, maxX, maxY } = boxOf(sheet);
  const mx = (minX + maxX) / 2, my = (minY + maxY) / 2;
  const make = (a: Pt, b: Pt): FoldLine => ({ a, b, deg: vectorDeg([b[0] - a[0], b[1] - a[1]]) % 180 });
  switch (side) {
    case "top": return { line: make([minX, my], [maxX, my]), movingRef: [mx, minY] };
    case "bottom": return { line: make([minX, my], [maxX, my]), movingRef: [mx, maxY] };
    case "left": return { line: make([mx, minY], [mx, maxY]), movingRef: [minX, my] };
    case "right": return { line: make([mx, minY], [mx, maxY]), movingRef: [maxX, my] };
    // A corner folds over the diagonal that doesn't touch it.
    case "tl": return { line: make([maxX, minY], [minX, maxY]), movingRef: [minX, minY] };
    case "br": return { line: make([maxX, minY], [minX, maxY]), movingRef: [maxX, maxY] };
    case "tr": return { line: make([minX, minY], [maxX, maxY]), movingRef: [maxX, minY] };
    case "bl": return { line: make([minX, minY], [maxX, maxY]), movingRef: [minX, maxY] };
  }
}

/** Which side of the line a point is on (+, − or 0 on it). */
const sideOf = (l: FoldLine, p: Pt) => (l.b[0] - l.a[0]) * (p[1] - l.a[1]) - (l.b[1] - l.a[1]) * (p[0] - l.a[0]);

export function reflectPoint(l: FoldLine, p: Pt): Pt {
  const dx = l.b[0] - l.a[0], dy = l.b[1] - l.a[1];
  const len2 = dx * dx + dy * dy;
  const t = ((p[0] - l.a[0]) * dx + (p[1] - l.a[1]) * dy) / len2;
  const fx = l.a[0] + t * dx, fy = l.a[1] + t * dy;
  return [2 * fx - p[0], 2 * fy - p[1]];
}

/** The part of a convex polygon on one side of a line (sign +1 or −1), Sutherland–Hodgman. */
function clipHalf(poly: Pt[], l: FoldLine, sign: number): Pt[] {
  const out: Pt[] = [];
  const inside = (p: Pt) => sign * sideOf(l, p) >= -EPS;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length];
    const pin = inside(p), qin = inside(q);
    if (pin) out.push(p);
    if (pin !== qin) {
      const sp = sideOf(l, p), sq = sideOf(l, q);
      const t = sp / (sp - sq);
      out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]);
    }
  }
  return dedupe(out);
}

function dedupe(pts: Pt[]): Pt[] {
  const out: Pt[] = [];
  for (const p of pts) if (!out.some((q) => Math.abs(q[0] - p[0]) < 1e-9 && Math.abs(q[1] - p[1]) < 1e-9)) out.push(p);
  return out;
}

/** Convex hull (monotone chain), clockwise on screen. */
function hull(points: Pt[]): Pt[] {
  const pts = dedupe(points).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (pts.length < 3) return pts;
  const cross = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: Pt[] = [], upper: Pt[] = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= EPS) lower.pop();
    lower.push(p);
  }
  for (const p of [...pts].reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= EPS) upper.pop();
    upper.push(p);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

/** Inside a convex polygon, or within `tol` of its edge. */
export function insidePolygon(poly: Pt[], p: Pt, tol = 1e-3): boolean {
  if (poly.length < 3) return false;
  let pos = false, neg = false;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const s = ((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])) / len;
    if (s > tol) pos = true;
    if (s < -tol) neg = true;
  }
  return !(pos && neg);
}

/** Every fold, in order, with the sheet before and after. */
export function foldStages(steps: FoldDiagram["steps"]): FoldStage[] {
  const stages: FoldStage[] = [];
  let sheet = SQUARE;
  for (const { fold: side } of steps) {
    const { line, movingRef } = foldLine(sheet, side);
    const sign = Math.sign(sideOf(line, movingRef)) || 1;
    const moved = clipHalf(sheet, line, sign);
    const kept = clipHalf(sheet, line, -sign);
    const flap = moved.map((p) => reflectPoint(line, p));
    const after = hull([...kept, ...flap]);
    stages.push({ side, before: sheet, line, kept, moved, flap, after });
    sheet = after;
  }
  return stages;
}

/** The sheet after all folds. */
export function foldedSheet(steps: FoldDiagram["steps"]): Pt[] {
  const stages = foldStages(steps);
  return stages.length ? stages[stages.length - 1].after : SQUARE;
}

/** The cuts in sheet coordinates (placed in the folded sheet's box). */
export function cutsOnSheet(d: FoldDiagram): SheetCut[] {
  const box = boxOf(foldedSheet(d.steps ?? []));
  const bw = box.maxX - box.minX, bh = box.maxY - box.minY;
  const side = Math.max(bw, bh);
  return (d.cuts ?? []).flatMap((c) => {
    const p = anchorPoint(c.at);
    if (!p) return [];
    return [{
      shape: c.shape,
      at: [box.minX + p[0] * bw, box.minY + p[1] * bh] as Pt,
      w: (c.size ?? DEFAULT_CUT) * side,
      ...(c.aspect !== undefined ? { aspect: c.aspect } : {}),
      rotate: norm360(c.rotate ?? 0),
    }];
  });
}

/** A cut mirrored over a fold line: its centre reflects and its axis turns to 2θ − φ. */
function reflectCut(l: FoldLine, c: SheetCut): SheetCut {
  return { ...c, at: reflectPoint(l, c.at), rotate: norm360(2 * l.deg - c.rotate) };
}

/** How far a shape can turn and still look the same. */
function symmetry(shape: SheetCut["shape"]): number {
  if (shape === "circle") return 1;
  if (shape === "square" || shape === "diamond") return 90;
  if (shape === "rect" || shape === "ellipse") return 180;
  return 360;
}

function sameCut(a: SheetCut, b: SheetCut, posTol = 0.01): boolean {
  if (a.shape !== b.shape) return false;
  if (Math.hypot(a.at[0] - b.at[0], a.at[1] - b.at[1]) > posTol) return false;
  const s = symmetry(a.shape);
  if (s === 1) return true;
  const diff = norm360(a.rotate - b.rotate) % s;
  return Math.min(diff, s - diff) < 3;
}

/**
 * Opens the sheet back out: going through the folds in reverse, every cut under the
 * flap of a fold gets its mirror image over that fold line. Returns the cuts on the
 * whole sheet (sheet coordinates), without repeats.
 */
export function unfoldCuts(d: FoldDiagram): SheetCut[] {
  const stages = foldStages(d.steps ?? []);
  let cuts = cutsOnSheet(d);
  for (let k = stages.length - 1; k >= 0; k--) {
    const st = stages[k];
    const next: SheetCut[] = [];
    for (const c of cuts) {
      const underFlap = insidePolygon(st.flap, c.at, 0.01);
      const onKept = insidePolygon(st.kept, c.at, 0.01);
      if (onKept || !underFlap) next.push(c);
      if (underFlap) next.push(reflectCut(st.line, c));
    }
    cuts = next.filter((c, i) => !next.slice(0, i).some((e) => sameCut(e, c)));
  }
  return cuts;
}

const r3 = (v: number) => Math.round(v * 1000) / 1000;

/** The unfolded sheet as a panel cell (holes drawn cut out), for options and explanations. */
export function unfold(d: FoldDiagram): PanelCell {
  return {
    items: unfoldCuts(d).map((c): PanelShape => ({
      type: "shape",
      shape: c.shape,
      at: [r3(c.at[0]), r3(c.at[1])],
      size: r3(c.w),
      ...(c.aspect !== undefined ? { aspect: c.aspect } : {}),
      ...(r3(c.rotate) % 360 !== 0 ? { rotate: r3(c.rotate) } : {}),
      cut: true,
    })),
  };
}

/** A shape on a cell, as a hole: diamond = square turned 45°, aspect-1 rect/ellipse = square/circle. */
function asHole(s: PanelShape): SheetCut | null {
  const p = anchorPoint(s.at);
  if (!p) return null;
  let shape = s.shape as string, rotate = norm360(s.rotate ?? 0);
  if (shape === "diamond") { shape = "square"; rotate = norm360(rotate + 45); }
  if (shape === "rect" && (s.aspect ?? 0.6) === 1) shape = "square";
  if (shape === "ellipse" && (s.aspect ?? 0.6) === 1) shape = "circle";
  if (!CUT_SHAPES.includes(shape as SheetCut["shape"])) return null;
  return { shape: shape as SheetCut["shape"], at: p, w: s.size ?? 0.2, rotate };
}

/**
 * Whether a cell shows the same holes as the unfolded sheet: the same number of holes,
 * each matched by shape, turn and place (within `tol` of the sheet). Sizes are ignored,
 * since papers draw them by eye.
 */
export function cellMatchesUnfold(d: FoldDiagram, cell: PanelCell, tol = 0.09): boolean {
  const want = unfoldCuts(d).map((c) => (c.shape === "diamond" ? { ...c, shape: "square" as const, rotate: norm360(c.rotate + 45) } : c));
  const got = (cell.items ?? []).filter((i): i is PanelShape => i.type === "shape").map(asHole);
  if (got.some((g) => g === null) || got.length !== want.length) return false;
  const left = [...(got as SheetCut[])];
  for (const w of want) {
    const i = left.findIndex((g) => sameCut(g, w, tol));
    if (i < 0) return false;
    left.splice(i, 1);
  }
  return true;
}
