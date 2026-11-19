/**
 * Size steps for question text (questions, options, passages, explanations).
 * Step 1 is the normal size. Applied as CSS `zoom` through the `--content-zoom`
 * variable on <html>, so text, maths, tables and diagrams all grow together.
 */
export const CONTENT_ZOOM = [0.9, 1, 1.15, 1.3, 1.5] as const;
export const DEFAULT_CONTENT_SIZE = 1;
export const MAX_CONTENT_SIZE = CONTENT_ZOOM.length - 1;

/** A saved step, made safe: anything odd falls back to normal. */
export function clampContentSize(step: unknown): number {
  if (typeof step !== "number" || !Number.isFinite(step)) return DEFAULT_CONTENT_SIZE;
  return Math.min(MAX_CONTENT_SIZE, Math.max(0, Math.round(step)));
}

/** The step one smaller (-1) or larger (+1), staying in range. */
export function stepContentSize(step: number, by: -1 | 1): number {
  return clampContentSize(clampContentSize(step) + by);
}

/** "115%" for a step, for screen readers and the settings page. */
export function contentSizePercent(step: number): string {
  return `${Math.round(CONTENT_ZOOM[clampContentSize(step)] * 100)}%`;
}
