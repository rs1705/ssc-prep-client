"use client";

import { useId, type ReactNode } from "react";

/**
 * One look for every drawn figure, maths and reasoning alike: line weights, frame and
 * cell sizes, dash pattern and glyph size live here; colours and fonts are the tokens in
 * content.css, reached through the class names in FIG.cls. Change a value here and
 * geometry, cubes, puzzles, panels and folds all follow.
 */
export const FIG = {
  /** Main lines: shapes, segments, outlines, circles. */
  line: 1.8,
  /** Inner lines: sector spokes, grid cells, dimension ticks. */
  thin: 1.3,
  /** An emphasised line (answer, highlight). */
  bold: 2.6,
  /** Frames around cells and boxes. */
  frame: 1.4,
  /** Dashed lines: mirror lines, fold lines, old position of a folded flap. */
  dash: "5 4",
  /** One square cell of a panel or fold figure. */
  cell: 96,
  /** Space between cells. */
  gap: 18,
  /** Corner radius of a cell frame. */
  radius: 3,
  /** Point dots in geometry. */
  dot: 3.2,
  /** Letters and digits drawn as part of a figure (mirror text). */
  glyph: 28,
  /**
   * Marks inside panel and fold cells (figure series, option figures), matched to how
   * exam papers print them: thin lines, small shapes, short arrows, plain letters.
   * Sizes are shares of the cell.
   */
  mark: { line: 1.1, frame: 1.1, shape: 0.15, dot: 0.06, glyph: 0.2, arrow: 0.32, head: 0.055, cap: 0.045 },
  /** Class names for the content.css colour tokens. */
  cls: {
    line: "ink",
    fill: "ink-fill",
    highlight: "brand",
    highlightFill: "brand-fill",
    answer: "right",
    muted: "muted",
    paper: "card-fill",
    soft: "soft",
  },
} as const;

export function Svg({ w, h, label, children, viewBox }: { w: number; h: number; label: string; children: ReactNode; viewBox?: string }) {
  return (
    <svg viewBox={viewBox ?? `0 0 ${w} ${h}`} width={w} height={h} className="cf-dg" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

/** A filled arrowhead marker (orient follows the line). */
export function ArrowMarker({ id, cls }: { id: string; cls: string }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" className={cls} />
    </marker>
  );
}

/** A DOM-safe id for SVG markers and clip paths (useId returns colons). */
export function useSvgId(prefix: string) {
  return `${prefix}${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
}
