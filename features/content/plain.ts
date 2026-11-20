import { relationSays } from "./relations";
import type {
  Block,
  CubeDiagram,
  Diagram,
  FoldDiagram,
  MirrorDiagram,
  PanelAt,
  PanelDiagram,
  PanelItem,
  PuzzleDiagram,
  RegionsDiagram,
} from "./types";

/** "2 views of a cube: Q on top, Z left, V right; T on top, L left, V right." */
export function cubeAlt(d: CubeDiagram): string {
  const views = d.views.map((v) => `${v.top} on top, ${v.left} left, ${v.right} right`);
  return `${d.views.length === 1 ? "A cube" : `${d.views.length} views of a cube`}: ${views.join("; ")}.`;
}

/** "triangle with 4, 6, 8 at the corners and 18 in the middle; …" */
export function puzzleAlt(d: PuzzleDiagram): string {
  const one = (f: PuzzleDiagram["figures"][number]) => {
    if (f.shape === "grid") return `grid: ${(f.rows ?? []).map((r) => r.join(" ")).join(" / ")}`;
    const where = f.shape === "circle" ? "in the sectors" : "at the corners";
    const mid = f.center ? ` and ${f.center} in the middle` : "";
    return `${f.shape} with ${(f.values ?? []).join(", ")} ${where}${mid}`;
  };
  return (d.figures ?? []).map(one).join("; ") || "Number puzzle";
}

/** "AB3K7, mirror image, mirror line on the right" */
export function mirrorAlt(d: MirrorDiagram): string {
  const how = { none: "as printed", mirror: "mirror image", water: "water image", rotate: "upside down" }[d.transform ?? "none"];
  const line = d.line ? `, mirror line ${d.line === "right" ? "on the right" : "below"}` : "";
  return `${d.text}, ${how}${line}`;
}

/** "triangle = Doctors, circle = Women. Doctors only: 5; Doctors and Women only: 3; …" */
export function regionsAlt(d: RegionsDiagram): string {
  const names = (k: string) => k.split("").map((l) => d.sets["ABC".indexOf(l)]?.label ?? l).join(" and ");
  const sets = d.sets.map((s) => `${s.shape} = ${s.label}`).join(", ");
  const regions = Object.entries(d.values ?? {}).map(([k, v]) => `${names(k)} only: ${v}`).join("; ");
  return `${sets}. ${regions}${d.outside ? `; outside all: ${d.outside}` : ""}`;
}

const ANCHOR_WORDS: Record<string, string> = {
  tl: "top-left", t: "top", tr: "top-right", l: "left", c: "centre", r: "right", bl: "bottom-left", b: "bottom", br: "bottom-right",
};
const where = (at: PanelAt | undefined) =>
  at === undefined ? "centre" : typeof at === "string" ? ANCHOR_WORDS[at] ?? at : `(${at[0]}, ${at[1]})`;
const DIRS = ["up", "up-right", "right", "down-right", "down", "down-left", "left", "up-left"];
const dirWord = (deg: number) => DIRS[Math.round((((deg % 360) + 360) % 360) / 45) % 8];

function itemAlt(it: PanelItem): string {
  switch (it.type) {
    case "shape": {
      const turned = it.rotate ? ` turned ${it.rotate}°` : "";
      const how = it.cut ? "hole" : it.filled || it.shape === "dot" ? "filled" : "outline";
      return `${how} ${it.shape}${turned} at ${where(it.at)}`;
    }
    case "arrow": {
      const extra = [it.head && it.head !== "single" ? `${it.head} head` : "", it.tail && it.tail !== "none" ? `${it.tail} tail` : ""].filter(Boolean).join(", ");
      return `arrow pointing ${dirWord(it.dir)}${extra ? ` (${extra})` : ""} at ${where(it.at)}`;
    }
    case "glyph":
      return `"${it.text}"${it.transform && it.transform !== "none" ? ` (${it.transform})` : ""} at ${where(it.at)}`;
    case "line": {
      const ends = (it.ends ?? []).filter((e) => e !== "none");
      return `${it.style === "dashed" ? "dashed " : ""}line from ${where(it.from)} to ${where(it.to)}${ends.length ? ` with ${ends.join("/")} ends` : ""}`;
    }
    case "arc":
      return `arc at ${where(it.at)} from ${it.start}° to ${it.end}°`;
  }
}

/** "Figure 1: filled circle at top-left; Figure 2: …; Figure 3: ?" */
export function panelAlt(d: PanelDiagram): string {
  const cells = d.cells ?? [];
  const one = (c: PanelDiagram["cells"][number]) => (c.missing ? "?" : (c.items ?? []).map(itemAlt).join(", ") || "empty");
  if (cells.length === 1) return one(cells[0]);
  return cells.map((c, i) => `Figure ${i + 1}: ${one(c)}`).join("; ");
}

const FOLD_WORDS: Record<string, string> = {
  top: "top half folded down", bottom: "bottom half folded up", left: "left half folded over to the right", right: "right half folded over to the left",
  tl: "top-left corner folded over the diagonal", tr: "top-right corner folded over the diagonal",
  bl: "bottom-left corner folded over the diagonal", br: "bottom-right corner folded over the diagonal",
};

/** "Square sheet: top half folded down, then left half …; then cut: circle at centre." */
export function foldAlt(d: FoldDiagram): string {
  const steps = (d.steps ?? []).map((s) => FOLD_WORDS[s.fold] ?? s.fold).join(", then ");
  const cuts = (d.cuts ?? []).map((c) => `${c.shape} at ${where(c.at)}`).join(", ");
  return `Square sheet: ${steps || "not folded"}; then cut: ${cuts || "nothing"} (on the folded sheet).`;
}

function diagramAlt(d: Diagram): string {
  switch (d.kind) {
    case "panel": return panelAlt(d);
    case "fold": return foldAlt(d);
    case "geometry": return d.count ? `${d.alt || "Figure"} (count the ${d.count})` : d.kind;
    case "cube": return cubeAlt(d);
    case "puzzle": return puzzleAlt(d);
    case "mirror": return mirrorAlt(d);
    case "regions": return regionsAlt(d);
    case "relation": return d.labels?.length ? `${relationSays(d)} (${d.labels.join(", ")})` : relationSays(d);
    default: return d.kind;
  }
}

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
          {
          // Figures whose content fits in words are spelled out (so the explainer can solve them).
          const spelled = diagramAlt(b.diagram);
          return `[Figure: ${spelled !== b.diagram.kind ? spelled : b.diagram.alt || b.caption || b.diagram.kind}]`;
        }
        default:
          return "";
      }
    })
    .filter(Boolean)
    .join("\n\n");
}
