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
  | NumberLineDiagram;

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
