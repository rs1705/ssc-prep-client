import { figureCount } from "./count";
import { cellMatchesUnfold } from "./fold";
import { optionBlocks, type Block, type ContentOption, type FoldDiagram, type GeometryDiagram, type PanelDiagram } from "./types";

/**
 * Answer checks that need no model: a counting figure is counted, a folded sheet is
 * opened out and compared with the option figures. The result says which option the
 * figure gives; it disagrees with the key when the reading or the key is wrong.
 */
export interface FigureCheck {
  /** What was worked out, in words ("12 triangles", "the unfolded sheet"). */
  found: string;
  /** Options that fit; usually one. */
  labels: string[];
  agreesWithKey: boolean;
  /** One plain sentence for the review notes when it disagrees. */
  note?: string;
}

const diagrams = (blocks: Block[]) => blocks.flatMap((b) => (b.type === "diagram" ? [b.diagram] : []));

/** A number in an option's text ("12", "12 triangles"), or null. */
function optionNumber(o: ContentOption): number | null {
  const text = o.text?.trim() ? o.text : optionBlocks(o).map((b) => (b.type === "text" ? b.text : "")).join(" ");
  const m = /^\s*\$?\s*(\d+)\s*\$?\s*[a-z ]*$/i.exec(text);
  return m ? Number(m[1]) : null;
}

export function figureAnswerCheck(question: Block[], options: ContentOption[], key: string | undefined): FigureCheck | null {
  const all = diagrams(question);

  const counting = all.find((d): d is GeometryDiagram => d.kind === "geometry" && !!d.count);
  if (counting) {
    const n = figureCount(counting);
    if (n === null) return null;
    const labels = options.filter((o) => optionNumber(o) === n).map((o) => o.label);
    const found = `${n} ${counting.count}`;
    const agreesWithKey = !!key && labels.includes(key);
    return {
      found,
      labels,
      agreesWithKey,
      note: agreesWithKey
        ? undefined
        : labels.length
          ? `Counting the drawn figure gives ${found} (option ${labels.join("/")}), but the key says ${key || "nothing"}. Check the figure's lines or the key.`
          : `Counting the drawn figure gives ${found}, which is not an option. Check the figure's lines.`,
    };
  }

  const fold = all.find((d): d is FoldDiagram => d.kind === "fold");
  if (fold) {
    const cells = options.map((o) => {
      const p = diagrams(optionBlocks(o)).find((d): d is PanelDiagram => d.kind === "panel");
      return p?.cells?.length === 1 ? p.cells[0] : null;
    });
    if (cells.some((c) => c === null)) return null;
    const labels = options.filter((_, i) => cellMatchesUnfold(fold, cells[i]!)).map((o) => o.label);
    const agreesWithKey = !!key && labels.includes(key);
    return {
      found: "the unfolded sheet",
      labels,
      agreesWithKey,
      note: agreesWithKey
        ? undefined
        : labels.length
          ? `Opening out the folded sheet gives option ${labels.join("/")}, but the key says ${key || "nothing"}. Check the folds, the holes or the key.`
          : "Opening out the folded sheet matches no option. Check the folds and the holes.",
    };
  }
  return null;
}
