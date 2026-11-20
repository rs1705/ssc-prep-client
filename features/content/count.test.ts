import { describe, expect, it } from "vitest";
import { figureAnswerCheck } from "./checks";
import { countRectangles, countSquares, countTriangles } from "./count";
import type { Block, ContentOption, GeometryDiagram } from "./types";

const fig = (points: GeometryDiagram["points"], segments: [string, string][]): GeometryDiagram => ({ kind: "geometry", points, segments });

/** An n × n grid of unit squares drawn as full-length lines (so every corner is a crossing). */
function grid(n: number): GeometryDiagram {
  const points: GeometryDiagram["points"] = {};
  const segments: [string, string][] = [];
  for (let i = 0; i <= n; i++) {
    points[`h${i}a`] = [0, i]; points[`h${i}b`] = [n, i];
    points[`v${i}a`] = [i, 0]; points[`v${i}b`] = [i, n];
    segments.push([`h${i}a`, `h${i}b`], [`v${i}a`, `v${i}b`]);
  }
  return { kind: "geometry", points, segments };
}

describe("countTriangles", () => {
  it("counts a triangle split by a median", () => {
    const d = fig({ A: [2, 4], B: [0, 0], C: [4, 0], D: [2, 0] }, [["A", "B"], ["A", "C"], ["B", "D"], ["D", "C"], ["A", "D"]]);
    expect(countTriangles(d)).toBe(3);
  });

  it("counts lines from the apex to the base", () => {
    const d = fig({ A: [3, 5], B: [0, 0], P: [2, 0], Q: [4, 0], C: [6, 0] }, [["B", "C"], ["A", "B"], ["A", "P"], ["A", "Q"], ["A", "C"]]);
    expect(countTriangles(d)).toBe(6);
  });

  it("finds the crossing of a square's diagonals without a named point", () => {
    const d = fig({ A: [0, 0], B: [4, 0], C: [4, 4], D: [0, 4] }, [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["A", "C"], ["B", "D"]]);
    expect(countTriangles(d)).toBe(8);
  });

  it("joins collinear pieces into one line", () => {
    // Base drawn as two pieces B–D and D–C: still one side of the big triangle.
    const d = fig({ A: [0, 3], B: [0, 0], D: [2, 0], C: [4, 0] }, [["A", "B"], ["B", "D"], ["D", "C"], ["A", "C"]]);
    expect(countTriangles(d)).toBe(1);
  });

  it("finds none in a plain grid", () => {
    expect(countTriangles(grid(2))).toBe(0);
  });
});

describe("countSquares / countRectangles", () => {
  it("counts a 2 × 2 grid", () => {
    expect(countSquares(grid(2))).toBe(5);
    expect(countRectangles(grid(2))).toBe(9);
  });
  it("counts a 3 × 3 grid", () => {
    expect(countSquares(grid(3))).toBe(14);
    expect(countRectangles(grid(3))).toBe(36);
  });
  it("counts a square with its diagonals once", () => {
    const d = fig({ A: [0, 0], B: [4, 0], C: [4, 4], D: [0, 4] }, [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["A", "C"], ["B", "D"]]);
    expect(countSquares(d)).toBe(1);
    expect(countRectangles(d)).toBe(1);
  });
  it("counts a tilted square", () => {
    const d = fig({ A: [2, 0], B: [4, 2], C: [2, 4], D: [0, 2] }, [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"]]);
    expect(countSquares(d)).toBe(1);
  });
});

describe("figureAnswerCheck", () => {
  const square: GeometryDiagram = {
    kind: "geometry",
    count: "triangles",
    points: { A: [0, 0], B: [4, 0], C: [4, 4], D: [0, 4] },
    segments: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["A", "C"], ["B", "D"]],
  };
  const question: Block[] = [{ type: "text", text: "How many triangles are there?" }, { type: "diagram", diagram: square }];
  const options: ContentOption[] = [{ label: "A", text: "6" }, { label: "B", text: "8" }, { label: "C", text: "$10$" }, { label: "D", text: "12" }];

  it("agrees when the key is the counted option", () => {
    expect(figureAnswerCheck(question, options, "B")).toMatchObject({ labels: ["B"], agreesWithKey: true, found: "8 triangles" });
  });
  it("flags a key that disagrees with the count", () => {
    const check = figureAnswerCheck(question, options, "D")!;
    expect(check.agreesWithKey).toBe(false);
    expect(check.note).toMatch(/8 triangles \(option B\), but the key says D/);
  });
  it("flags a count that is no option", () => {
    const check = figureAnswerCheck(question, options.filter((o) => o.label !== "B"), "A")!;
    expect(check.labels).toEqual([]);
    expect(check.note).toMatch(/not an option/);
  });
  it("checks a fold question against its option figures", () => {
    const q: Block[] = [{ type: "diagram", diagram: { kind: "fold", steps: [{ fold: "left" }], cuts: [{ shape: "circle", at: "c" }] } }];
    const opt = (label: string, xs: number[]): ContentOption => ({
      label,
      blocks: [{ type: "diagram", diagram: { kind: "panel", cells: [{ items: xs.map((x) => ({ type: "shape", shape: "circle", at: [x, 0.5], cut: true })) }] } }],
    });
    const o = [opt("A", [0.25]), opt("B", [0.25, 0.75]), opt("C", [0.5])];
    expect(figureAnswerCheck(q, o, "B")).toMatchObject({ labels: ["B"], agreesWithKey: true });
    expect(figureAnswerCheck(q, o, "A")?.note).toMatch(/gives option B, but the key says A/);
  });
  it("leaves other questions alone", () => {
    expect(figureAnswerCheck([{ type: "text", text: "Find x." }], options, "A")).toBeNull();
  });
});
