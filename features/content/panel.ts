import type { PanelAnchor, PanelAt, PanelShapeName } from "./types";

/**
 * Pure helpers for panel and fold figures: where an anchor sits in a cell and the
 * outline of each shape. Coordinates are 0 to 1 across the cell, y down.
 */

export type Pt = [number, number];

export const PANEL_ANCHORS: Record<PanelAnchor, Pt> = {
  tl: [0.22, 0.22], t: [0.5, 0.22], tr: [0.78, 0.22],
  l: [0.22, 0.5], c: [0.5, 0.5], r: [0.78, 0.5],
  bl: [0.22, 0.78], b: [0.5, 0.78], br: [0.78, 0.78],
};
export const ANCHOR_NAMES = Object.keys(PANEL_ANCHORS) as PanelAnchor[];

export const SHAPE_NAMES: PanelShapeName[] = [
  "circle", "square", "triangle", "star", "pentagon", "hexagon", "diamond", "cross", "dot", "ellipse", "rect", "semicircle",
];

/** [x, y] from 0 to 1 for an anchor name or a free position; null when it is neither. */
export function anchorPoint(at: PanelAt | undefined, fallback: Pt = [0.5, 0.5]): Pt | null {
  if (at === undefined) return fallback;
  if (typeof at === "string") return PANEL_ANCHORS[at] ?? null;
  if (Array.isArray(at) && at.length === 2 && at.every((v) => typeof v === "number" && Number.isFinite(v))) return [at[0], at[1]];
  return null;
}

export function isPanelAt(at: unknown): at is PanelAt {
  if (typeof at === "string") return at in PANEL_ANCHORS;
  return Array.isArray(at) && at.length === 2 && at.every((v) => typeof v === "number" && v >= 0 && v <= 1);
}

const poly = (pts: Pt[]) => `M${pts.map(([x, y]) => `${r3(x)},${r3(y)}`).join(" L")} Z`;
const r3 = (v: number) => Math.round(v * 1000) / 1000;
const regular = (n: number, r: number, start = -Math.PI / 2): Pt[] =>
  Array.from({ length: n }, (_, k) => [r * Math.cos(start + (2 * Math.PI * k) / n), r * Math.sin(start + (2 * Math.PI * k) / n)]);

/**
 * The outline of a shape `w` wide, centred on the origin, unrotated (a triangle or
 * semicircle points up), as an SVG path.
 */
export function shapePath(shape: PanelShapeName, w: number, aspect = 0.6): string {
  const r = w / 2;
  switch (shape) {
    case "circle":
    case "dot":
      return `M${-r},0 a${r},${r} 0 1,0 ${w},0 a${r},${r} 0 1,0 ${-w},0 Z`;
    case "ellipse": {
      const ry = r * aspect;
      return `M${-r},0 a${r},${ry} 0 1,0 ${w},0 a${r},${ry} 0 1,0 ${-w},0 Z`;
    }
    case "square":
      return poly([[-r, -r], [r, -r], [r, r], [-r, r]]);
    case "rect": {
      const h = r * aspect;
      return poly([[-r, -h], [r, -h], [r, h], [-r, h]]);
    }
    case "triangle": {
      const h = w * 0.87;
      return poly([[0, -h / 2], [r, h / 2], [-r, h / 2]]);
    }
    case "diamond":
      return poly([[0, -r], [r * 0.8, 0], [0, r], [-r * 0.8, 0]]);
    case "pentagon":
      return poly(regular(5, r));
    case "hexagon":
      return poly(regular(6, r));
    case "star": {
      const outer = regular(5, r), inner = regular(5, r * 0.42, -Math.PI / 2 + Math.PI / 5);
      return poly(outer.flatMap((p, i) => [p, inner[i]]));
    }
    case "cross": {
      const t = w / 6;
      return poly([[-t, -r], [t, -r], [t, -t], [r, -t], [r, t], [t, t], [t, r], [-t, r], [-t, t], [-r, t], [-r, -t], [-t, -t]]);
    }
    case "semicircle":
      // Flat side down, dome up; the box is w × r, centred.
      return `M${-r},${r / 2} A${r},${r} 0 0,1 ${r},${r / 2} Z`;
  }
}

/** Default width of a shape, as a share of the cell. */
export function defaultShapeSize(shape: PanelShapeName): number {
  return shape === "dot" ? 0.09 : 0.24;
}

/** A unit vector for `deg` degrees clockwise from up (screen, y down). */
export function dirVector(deg: number): Pt {
  const a = (deg * Math.PI) / 180;
  return [Math.sin(a), -Math.cos(a)];
}

/** Degrees clockwise from up for a direction vector (screen, y down). */
export function vectorDeg([x, y]: Pt): number {
  return norm360((Math.atan2(x, -y) * 180) / Math.PI);
}

export const norm360 = (deg: number) => ((deg % 360) + 360) % 360;
