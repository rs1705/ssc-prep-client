import type { RelationPattern } from "./relations";

/**
 * EptSSC question content format (spec: main-app/CONTENT_FORMAT.md).
 *
 * A question, each option and each explanation is a list of blocks. Diagrams are data
 * (points, sets, steps, seats) and the renderer draws them. This folder has no imports
 * from the rest of the pipeline, so it can be copied into the app's client unchanged.
 */

export type Block =
  | TextBlock
  | MathBlock
  | TableBlock
  | SeriesBlock
  | CodingBlock
  | ImageBlock
  | DiagramBlock;

/** Markdown subset: **bold**, *italic*, <u>underline</u>, "- " bullets, inline $…$ LaTeX. */
export interface TextBlock {
  type: "text";
  text: string;
}

/** A display equation (KaTeX). */
export interface MathBlock {
  type: "math";
  latex: string;
}

export interface TableBlock {
  type: "table";
  headers: string[];
  rows: (string | number)[][];
  /** Row index (in `rows`) shown as the answer row. */
  highlightRow?: number;
  caption?: string;
}

/**
 * A number/letter series. Without `diffs` (in questions): tiles separated by commas,
 * "?" shown dashed. With `diffs` (in explanations): arrows carrying the differences.
 */
export interface SeriesBlock {
  type: "series";
  items: (string | number)[];
  /** One per gap, so `items.length - 1` of them. */
  diffs?: string[];
  /** Index of the answer tile. */
  found?: number;
}

/** Coding-decoding: letters, the shift under each, and the coded letters. */
export interface CodingBlock {
  type: "coding";
  from: string;
  to: string;
  shifts: string[];
  fromTag?: string;
  toTag?: string;
}

/** A picture cropped from the paper, only for content no spec can describe. */
export interface ImageBlock {
  type: "image";
  src: string;
  alt: string;
  tag?: string;
}

export interface DiagramBlock {
  type: "diagram";
  diagram: Diagram;
  caption?: string;
}

export type Diagram =
  | GeometryDiagram
  | BarDiagram
  | PieDiagram
  | VennDiagram
  | TreeDiagram
  | PathDiagram
  | SeatingDiagram
  | NumberLineDiagram
  | CubeDiagram
  | PuzzleDiagram
  | MirrorDiagram
  | RegionsDiagram
  | RelationDiagram
  | PanelDiagram
  | FoldDiagram;

export type DiagramKind = Diagram["kind"];

interface DiagramBase {
  /** Screen-reader description. */
  alt?: string;
  /** Drawn from the question's words, not the paper: shows "Not to scale". */
  generated?: boolean;
}

export interface GeometryDiagram extends DiagramBase {
  kind: "geometry";
  /** Maths coordinates, y up. */
  points: Record<string, [number, number]>;
  circles?: { center: string; through: string }[];
  segments?: [string, string][];
  rightAngles?: { at: string; from: string; to: string }[];
  /** Keyed by segment name, e.g. { AB: "10 cm" }. */
  labels?: Record<string, string>;
  /** Segment names ("AB") and/or "right" (the right-angle mark). */
  highlight?: string[];
  /** Arcs of a circle about `center`, from `from` anticlockwise to the ray through `to`. */
  arcs?: { center: string; from: string; to: string }[];
  /**
   * A figure-counting question ("how many triangles…"): the points are only corners, so
   * no dots or names are drawn, and the answer key is checked by counting.
   */
  count?: "triangles" | "squares" | "rectangles";
}

export interface BarDiagram extends DiagramBase {
  kind: "bar";
  labels: string[];
  values: number[];
  tick?: number;
  unit?: string;
  /** Index of the answer bar. */
  highlight?: number;
}

export interface PieDiagram extends DiagramBase {
  kind: "pie";
  /** `value` is a percentage; the slices add up to 100. */
  slices: { label: string; value: number }[];
  highlight?: number;
}

export interface VennDiagram extends DiagramBase {
  kind: "venn";
  /** The first set is the base; the others say how they relate to an earlier set. */
  sets: { id: string; label: string; within?: string; overlaps?: string; highlight?: boolean }[];
  region?: { between: [string, string]; label: string };
}

export interface TreeDiagram extends DiagramBase {
  kind: "tree";
  nodes: { id: string; label: string; gender: "m" | "f"; short?: string; highlight?: string }[];
  /** [parent, child] */
  edges: [string, string][];
}

export interface PathDiagram extends DiagramBase {
  kind: "path";
  steps: { dir: "N" | "S" | "E" | "W"; dist: number }[];
  showDisplacement?: boolean;
  displacementLabel?: string;
  /** Distance unit shown on each step (default "km"). */
  unit?: string;
}

export interface SeatingDiagram extends DiagramBase {
  kind: "seating";
  /** Listed anticlockwise from the bottom seat; everyone faces the centre. */
  seats: string[];
  highlight?: Record<string, "ref" | "answer">;
  note?: string;
}

export interface NumberLineDiagram extends DiagramBase {
  kind: "numberline";
  min: number;
  max: number;
  ranges?: { from: number; to: number; fromClosed: boolean; toClosed: boolean }[];
  marks?: number[];
  marksLabel?: string;
}

export interface CubeView {
  /** What is printed on each visible face: a letter, number or short symbol. */
  top: string;
  left: string;
  right: string;
}

export interface CubeDiagram extends DiagramBase {
  kind: "cube";
  /** 1 to 4 positions of the same cube (or separate cubes), drawn side by side. */
  views: CubeView[];
  /** Faces are numbers 1 to 6 drawn as dots, like a real dice. */
  pips?: boolean;
  /** Explanations: a face to emphasise (e.g. the common face) wherever it shows. */
  highlight?: string;
  /** Explanations: opposite pairs worked out, shown under the cubes. */
  opposites?: [string, string][];
}

export interface PuzzleFigure {
  shape: "triangle" | "square" | "circle" | "grid";
  /**
   * triangle: the 3 corners (top, bottom-left, bottom-right); square: the 4 corners
   * clockwise from top-left; circle: 2 to 8 sectors clockwise from the top.
   */
  values?: string[];
  /** Number in the middle (triangle, square, circle). */
  center?: string;
  /** grid: rows of cells. */
  rows?: string[][];
}

export interface PuzzleDiagram extends DiagramBase {
  kind: "puzzle";
  /** 1 to 4 figures side by side; the missing number is "?". */
  figures: PuzzleFigure[];
  /** Explanations: a value to emphasise (usually the answer that replaced "?"). */
  highlight?: string;
}

export interface MirrorDiagram extends DiagramBase {
  kind: "mirror";
  /** Letters, digits and symbols as printed, left to right. */
  text: string;
  /** How the text is drawn: as printed, its mirror image (left-right), water image (top-bottom) or turned upside down. */
  transform?: "none" | "mirror" | "water" | "rotate";
  /** Positions in `text` (0-based) whose character is moved but not flipped (trick options). */
  keep?: number[];
  /** Draw the mirror line MN on the right or below. */
  line?: "right" | "below";
}

export interface RegionsDiagram extends DiagramBase {
  kind: "regions";
  /** 2 or 3 overlapping groups, called A, B, C in this order. */
  sets: { label: string; shape: "circle" | "triangle" | "square" }[];
  /** Number in each region, keyed by the groups it is inside: "A", "AB", "ABC"… */
  values: Record<string, string>;
  /** Number outside every group (draws the surrounding box). */
  outside?: string;
  /** Explanations: region keys to emphasise. */
  highlight?: string[];
}

export interface RelationDiagram extends DiagramBase {
  kind: "relation";
  /** One of the standard arrangements in relations.ts (e.g. "3-two-inside-apart"). */
  pattern: RelationPattern;
  /** Names for circles A, B, C (explanations); options usually leave them out. */
  labels?: string[];
  /** Explanations: index of the circle to emphasise. */
  highlight?: number;
}

/** Where an item sits in a panel cell: a spot on the 3×3 grid, or [x, y] from 0 to 1 (y down). */
export type PanelAnchor = "tl" | "t" | "tr" | "l" | "c" | "r" | "bl" | "b" | "br";
export type PanelAt = PanelAnchor | [number, number];

export type PanelShapeName =
  | "circle" | "square" | "triangle" | "star" | "pentagon" | "hexagon" | "diamond" | "cross" | "dot"
  | "ellipse" | "rect" | "semicircle";

/** A shape. A triangle (or semicircle) with rotate 0 points up; rotate turns it clockwise. */
export interface PanelShape {
  type: "shape";
  shape: PanelShapeName;
  at?: PanelAt;
  /** Width as a share of the cell (default 0.24). */
  size?: number;
  /** Height ÷ width, for ellipse and rect (default 0.6). */
  aspect?: number;
  /** Degrees clockwise. */
  rotate?: number;
  filled?: boolean;
  /** Drawn as a hole cut out of the cell (punched or cut paper); clipped at the cell edge. */
  cut?: boolean;
}

/** An arrow pointing `dir` degrees clockwise from up (steps of 45). */
export interface PanelArrow {
  type: "arrow";
  at?: PanelAt;
  dir: number;
  /** Length as a share of the cell (default 0.5). */
  size?: number;
  /** single: one head; double: a head at both ends; hollow: an open head. */
  head?: "single" | "double" | "hollow";
  /** bar: a cross bar at the tail; double: two short lines across the tail. */
  tail?: "none" | "bar" | "double";
}

/** A letter, digit or symbol, as printed or flipped / turned. */
export interface PanelGlyph {
  type: "glyph";
  text: string;
  at?: PanelAt;
  transform?: "none" | "mirror" | "water" | "rotate90" | "rotate180" | "rotate270";
  /** Font size as a share of the cell (default 0.3). */
  size?: number;
}

export type PanelLineEnd = "none" | "bar" | "arrow" | "dot";

export interface PanelLine {
  type: "line";
  from: PanelAt;
  to: PanelAt;
  style?: "solid" | "dashed";
  /** End caps at from and to, e.g. ["none", "bar"] for a T end. */
  ends?: [PanelLineEnd, PanelLineEnd];
}

/** Part of a circle about `at`, from `start` to `end` degrees clockwise from up. */
export interface PanelArc {
  type: "arc";
  at?: PanelAt;
  /** Radius as a share of the cell (default 0.25). */
  r?: number;
  start: number;
  end: number;
  style?: "solid" | "dashed";
}

export type PanelItem = PanelShape | PanelArrow | PanelGlyph | PanelLine | PanelArc;

export interface PanelCell {
  items: PanelItem[];
  /** The missing figure: drawn as a dashed cell with "?". */
  missing?: boolean;
  /** Explanations: the answer cell. */
  highlight?: boolean;
}

/**
 * A row of 1 to 5 square cells with shapes, arrows, letters and lines in them: figure
 * series ("which figure comes next"), and one cell per option.
 */
export interface PanelDiagram extends DiagramBase {
  kind: "panel";
  cells: PanelCell[];
  /** Cell outline (default square). */
  frame?: "square" | "circle" | "none";
}

/**
 * The part of the sheet that folds over: top, bottom, left, right fold that half over
 * the middle line; tl, tr, bl, br fold that corner's triangle over the diagonal.
 */
export type FoldSide = "top" | "bottom" | "left" | "right" | "tl" | "tr" | "bl" | "br";

/** A hole punched or a piece cut, placed in the folded sheet's own box (0 to 1, y down). */
export interface FoldCut {
  shape: "circle" | "ellipse" | "square" | "rect" | "diamond" | "triangle" | "semicircle";
  at: PanelAt;
  /** Width as a share of the folded sheet's box (default 0.18). */
  size?: number;
  aspect?: number;
  rotate?: number;
}

/**
 * Paper folding and cutting: a square sheet folded step by step, then holes punched or
 * pieces cut from the folded sheet. A cut on the sheet's edge is a notch.
 */
export interface FoldDiagram extends DiagramBase {
  kind: "fold";
  steps: { fold: FoldSide }[];
  cuts: FoldCut[];
  /** Explanations: also draw the sheet opened out. */
  showUnfolded?: boolean;
}

/** An option: blocks, or the short forms { label, text } and { label, image, alt }. */
export interface ContentOption {
  label: string;
  blocks?: Block[];
  text?: string;
  image?: string;
  alt?: string;
}

/** Anything that may hold content: a block list, or a legacy plain string. */
export type Content = Block[] | string | null | undefined;

/** A legacy plain string becomes one text block. */
export function toBlocks(content: Content): Block[] {
  if (Array.isArray(content)) return content;
  if (typeof content === "string" && content.trim()) return [{ type: "text", text: content }];
  return [];
}

/** An option's content as blocks, whichever form it was written in. */
export function optionBlocks(option: ContentOption): Block[] {
  if (option.blocks?.length) return option.blocks;
  if (option.image) return [{ type: "image", src: option.image, alt: option.alt || `Option ${option.label}` }];
  return toBlocks(option.text);
}
