/**
 * Small clean-ups for LaTeX before KaTeX draws it. Typed or extracted maths often has an
 * en dash, em dash or Unicode minus where a minus sign is meant ("10 – 5"); KaTeX
 * doesn't know those characters and draws them in a fallback font. A plain "-" in maths
 * is drawn as a proper minus sign.
 */
export function tidyTex(tex: string): string {
  return tex.replace(/[–—−]/g, "-");
}

/** KaTeX options used everywhere: never throw on odd input, never print warnings for it. */
export const KATEX_OPTIONS = { throwOnError: false, strict: "ignore" as const, trust: false };
