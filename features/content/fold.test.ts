import { describe, expect, it } from "vitest";
import { cellMatchesUnfold, foldedSheet, foldStages, unfold, unfoldCuts } from "./fold";
import type { FoldDiagram, PanelShape } from "./types";

const at = (d: FoldDiagram) =>
  unfoldCuts(d)
    .map((c) => [Math.round(c.at[0] * 100) / 100, Math.round(c.at[1] * 100) / 100])
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("folding", () => {
  it("halves the sheet for each straight fold", () => {
    const sheet = foldedSheet([{ fold: "top" }, { fold: "left" }]);
    const xs = sheet.map((p) => p[0]), ys = sheet.map((p) => p[1]);
    expect([Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]).toEqual([0.5, 1, 0.5, 1]);
  });

  it("folds a corner over the diagonal into a triangle", () => {
    const [st] = foldStages([{ fold: "tl" }]);
    expect(st.after).toHaveLength(3);
    expect(st.after.map((p) => p.join(",")).sort()).toEqual(["0,1", "1,0", "1,1"]);
  });
});

describe("unfold", () => {
  it("opens two folds into four holes, one in each quarter", () => {
    const d: FoldDiagram = { kind: "fold", steps: [{ fold: "top" }, { fold: "left" }], cuts: [{ shape: "circle", at: "c" }] };
    expect(at(d)).toEqual([[0.25, 0.25], [0.25, 0.75], [0.75, 0.25], [0.75, 0.75]]);
  });

  it("reflects in reverse order, so a hole near one corner of the folded sheet lands in mirrored spots", () => {
    // Folded to the bottom-right quarter; the hole is in that quarter's bottom-right part.
    const d: FoldDiagram = { kind: "fold", steps: [{ fold: "top" }, { fold: "left" }], cuts: [{ shape: "square", at: [0.8, 0.8] }] };
    expect(at(d)).toEqual([[0.1, 0.1], [0.1, 0.9], [0.9, 0.1], [0.9, 0.9]]);
  });

  it("turns a shape as its mirror image across a diagonal fold", () => {
    const d: FoldDiagram = { kind: "fold", steps: [{ fold: "tl" }], cuts: [{ shape: "triangle", at: [0.8, 0.8] }] };
    const cuts = unfoldCuts(d);
    expect(cuts).toHaveLength(2);
    const back = cuts.find((c) => c.at[0] < 0.5)!;
    expect(back.at[0]).toBeCloseTo(0.2);
    expect(back.at[1]).toBeCloseTo(0.2);
    expect(back.rotate).toBeCloseTo(90); // pointed up; now points right
  });

  it("keeps a hole on the fold line as one hole", () => {
    const d: FoldDiagram = { kind: "fold", steps: [{ fold: "left" }], cuts: [{ shape: "circle", at: [0, 0.5] }] };
    expect(at(d)).toEqual([[0.5, 0.5]]);
  });

  it("flips a triangle across a straight fold", () => {
    const d: FoldDiagram = { kind: "fold", steps: [{ fold: "bottom" }], cuts: [{ shape: "triangle", at: "c" }] };
    const rotations = unfoldCuts(d).map((c) => Math.round(c.rotate)).sort((a, b) => a - b);
    expect(rotations).toEqual([0, 180]);
  });

  it("opens a diagonal fold followed by a half fold of the triangle", () => {
    const d: FoldDiagram = { kind: "fold", steps: [{ fold: "tl" }, { fold: "bl" }], cuts: [{ shape: "circle", at: [0.85, 0.5] }] };
    // Two diagonal folds: every hole has a copy in each of the four triangles.
    expect(unfoldCuts(d)).toHaveLength(4);
  });

  it("returns the opened sheet as a panel cell of cut shapes", () => {
    const d: FoldDiagram = { kind: "fold", steps: [{ fold: "right" }], cuts: [{ shape: "circle", at: "c", size: 0.2 }] };
    const cell = unfold(d);
    expect(cell.items).toHaveLength(2);
    for (const it of cell.items as PanelShape[]) {
      expect(it).toMatchObject({ type: "shape", shape: "circle", cut: true, size: 0.2 }); // size is a share of the folded sheet's longer side (1 here)
    }
  });
});

describe("cellMatchesUnfold", () => {
  const d: FoldDiagram = { kind: "fold", steps: [{ fold: "top" }, { fold: "left" }], cuts: [{ shape: "circle", at: "c" }] };
  const hole = (x: number, y: number, shape: PanelShape["shape"] = "circle"): PanelShape => ({ type: "shape", shape, at: [x, y], cut: true });

  it("accepts the right figure even when sizes and places are drawn by eye", () => {
    expect(cellMatchesUnfold(d, { items: [hole(0.27, 0.24), hole(0.75, 0.25), hole(0.22, 0.78), hole(0.76, 0.74)] })).toBe(true);
  });
  it("rejects a figure with too few holes, the wrong shape or the wrong places", () => {
    expect(cellMatchesUnfold(d, { items: [hole(0.25, 0.25), hole(0.75, 0.25)] })).toBe(false);
    expect(cellMatchesUnfold(d, { items: [hole(0.25, 0.25), hole(0.75, 0.25), hole(0.25, 0.75), hole(0.75, 0.75, "square")] })).toBe(false);
    expect(cellMatchesUnfold(d, { items: [hole(0.5, 0.2), hole(0.75, 0.25), hole(0.25, 0.75), hole(0.75, 0.75)] })).toBe(false);
  });
  it("treats a diamond as a square turned 45°", () => {
    const sq: FoldDiagram = { kind: "fold", steps: [{ fold: "left" }], cuts: [{ shape: "square", at: "c", rotate: 45 }] };
    expect(cellMatchesUnfold(sq, { items: [hole(0.25, 0.5, "diamond"), hole(0.75, 0.5, "diamond")] })).toBe(true);
  });
});
