import type { Block } from "./types";

/**
 * A plain-text (markdown + LaTeX) version of blocks, for screens that don't render the
 * block format yet. Diagrams become a short "[Figure: …]" note with their alt text.
 */
export function blocksToPlainText(blocks: Block[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case "text":
          return b.text;
        case "math":
          return `$$${b.latex}$$`;
        case "table": {
          const rows = [b.headers, ...b.rows].map((r) => r.map(String).join(" | "));
          return b.caption ? `${rows.join("\n")}\n${b.caption}` : rows.join("\n");
        }
        case "series":
          return b.diffs
            ? b.items.map((it, i) => (i === 0 ? String(it) : `(${b.diffs![i - 1]}) ${it}`)).join(" → ")
            : b.items.join(", ");
        case "coding":
          return `${b.fromTag || "Word"}: ${b.from} → ${b.toTag || "Code"}: ${b.to} (${b.shifts.join(", ")})`;
        case "image":
          return `![${b.alt}](${b.src})`;
        case "diagram":
          return `[Figure: ${b.diagram.alt || b.caption || b.diagram.kind}]`;
        default:
          return "";
      }
    })
    .filter(Boolean)
    .join("\n\n");
}
