import { describe, expect, it } from "vitest";
import { GEO_H, GEO_W, layoutGeometry } from "./geometry";
import { SAMPLE_QUESTIONS } from "./samples";
import { optionBlocks, toBlocks, type Block, type GeometryDiagram } from "./types";
import { blockProblems, contentProblems, diagramProblems, splitSegmentName } from "./validate";
import { blocksToPlainText } from "./plain";

const allBlocks = SAMPLE_QUESTIONS.flatMap((q) => [...q.question, ...q.explanation, ...q.options.flatMap(optionBlocks)]);

describe("samples", () => {
  it("cover every block type and diagram kind", () => {
    const types = new Set(allBlocks.map((b) => b.type));
    expect([...types].sort()).toEqual(["coding", "diagram", "image", "math", "series", "table", "text"]);
    const kinds = new Set(allBlocks.flatMap((b) => (b.type === "diagram" ? [b.diagram.kind] : [])));
    expect([...kinds].sort()).toEqual(["bar", "cube", "fold", "geometry", "mirror", "numberline", "panel", "path", "pie", "puzzle", "regions", "relation", "seating", "tree", "venn"]);
  });

  it("are all valid", () => {
    for (const q of SAMPLE_QUESTIONS) {
      expect(contentProblems([...q.question, ...q.explanation]), q.id).toEqual([]);
      expect(contentProblems(q.options.flatMap(optionBlocks).filter((b) => b.type !== "image")), q.id).toEqual([]);
    }
  });
});

describe("toBlocks / optionBlocks", () => {
  it("turns a legacy string into one text block", () => {
    expect(toBlocks("Find x.")).toEqual([{ type: "text", text: "Find x." }]);
    expect(toBlocks("  ")).toEqual([]);
    expect(toBlocks(null)).toEqual([]);
    const blocks: Block[] = [{ type: "math", latex: "x" }];
    expect(toBlocks(blocks)).toBe(blocks);
  });
  it("reads every option form", () => {
    expect(optionBlocks({ label: "A", text: "6 cm" })).toEqual([{ type: "text", text: "6 cm" }]);
    expect(optionBlocks({ label: "B", image: "u", alt: "fig" })).toEqual([{ type: "image", src: "u", alt: "fig" }]);
    expect(optionBlocks({ label: "C", image: "u" })[0]).toMatchObject({ alt: "Option C" });
  });
});

describe("blockProblems", () => {
  it("flags broken blocks in plain words", () => {
    expect(blockProblems({ type: "nope" })).toEqual(['Unknown block type "nope".']);
    expect(blockProblems({ type: "series", items: [1, 2, 3], diffs: ["+1"] })[0]).toMatch(/needs 2 diffs/);
    expect(blockProblems({ type: "table", headers: ["a", "b"], rows: [["1"]] })[0]).toMatch(/1 cells, headers have 2/);
    expect(blockProblems({ type: "coding", from: "ABC", to: "BCD", shifts: ["+1"] })[0]).toMatch(/3 letters but 1 shifts/);
    expect(blockProblems({ type: "image", src: "x" })).toEqual(["Image has no alt text."]);
  });

  it("checks diagram specs", () => {
    expect(diagramProblems({ kind: "pie", slices: [{ label: "a", value: 60 }, { label: "b", value: 30 }] })[0]).toMatch(/add up to 90%/);
    expect(diagramProblems({ kind: "bar", labels: ["a"], values: [1, 2] })[0]).toMatch(/2 values but 1 labels/);
    expect(diagramProblems({ kind: "geometry", points: { A: [0, 0] } })[0]).toMatch(/at least two points/);
    expect(
      diagramProblems({ kind: "geometry", points: { A: [0, 0], B: [1, 0] }, segments: [["A", "C"]] })[0],
    ).toMatch(/unknown point/);
    expect(diagramProblems({ kind: "venn", sets: [{ id: "a", label: "A" }, { id: "b", label: "B", within: "z" }] })[0]).toMatch(/isn't an earlier set/);
    expect(diagramProblems({ kind: "tree", nodes: [{ id: "a", label: "A", gender: "m" }, { id: "b", label: "B", gender: "f" }], edges: [["a", "b"], ["b", "a"]] })).toEqual(["Family tree has a loop."]);
    expect(diagramProblems({ kind: "seating", seats: ["A", "B", "A"] })).toEqual(["Seating lists someone twice."]);
    expect(diagramProblems({ kind: "numberline", min: 5, max: 1 })[0]).toMatch(/min below max/);
    expect(diagramProblems({ kind: "path", steps: [{ dir: "N", dist: 0 }] })[0]).toMatch(/positive distance/);
    expect(diagramProblems({ kind: "cube", views: [] })).toEqual(["Cube needs at least one view."]);
    expect(diagramProblems({ kind: "puzzle", figures: [{ shape: "triangle", values: ["1", "2"] }] })[0]).toMatch(/3 corner values/);
    expect(diagramProblems({ kind: "puzzle", figures: [{ shape: "grid", rows: [["1", "2"], ["3"]] }] })[0]).toMatch(/same length/);
    expect(diagramProblems({ kind: "puzzle", figures: [{ shape: "square", values: ["1", "", "3", "4"] }] })[0]).toMatch(/empty value/);
    expect(diagramProblems({ kind: "mirror", text: "" })).toEqual(["Mirror image needs the text."]);
    expect(diagramProblems({ kind: "mirror", text: "AB", keep: [5] })[0]).toMatch(/outside the text/);
    expect(diagramProblems({ kind: "regions", sets: [{ label: "A", shape: "circle" }], values: {} })).toEqual(["Regions figure needs 2 or 3 groups."]);
    expect(
      diagramProblems({ kind: "regions", sets: [{ label: "P", shape: "circle" }, { label: "Q", shape: "square" }], values: { AC: "3" } })[0],
    ).toMatch(/doesn't exist for 2 groups/);
    expect(diagramProblems({ kind: "relation", pattern: "4-stars" as never })[0]).toMatch(/Unknown circle arrangement/);
    expect(diagramProblems({ kind: "relation", pattern: "2-overlap", labels: ["a", "b", "c"] })[0]).toMatch(/2 circles but 3 labels/);
    expect(diagramProblems({ kind: "cube", views: [{ top: "A", left: "A", right: "B" }] })[0]).toMatch(/same face twice/);
    expect(diagramProblems({ kind: "cube", views: [{ top: "A", left: "", right: "B" }] })[0]).toMatch(/needs top, left and right/);
    expect(diagramProblems({ kind: "cube", pips: true, views: [{ top: "1", left: "7", right: "3" }] })[0]).toMatch(/numbers 1 to 6/);
    expect(
      diagramProblems({ kind: "cube", views: [{ top: "Q", left: "Z", right: "V" }], opposites: [["Q", "Z"]] })[0],
    ).toMatch(/can't be opposite/);
    expect(diagramProblems({ kind: "cube", views: [{ top: "Q", left: "Z", right: "V" }], highlight: "X" })[0]).toMatch(/isn't on any view/);
  });

  it("splits segment names, including multi-letter points", () => {
    expect(splitSegmentName("AB", ["A", "B"])).toEqual(["A", "B"]);
    expect(splitSegmentName("O1P", ["O1", "P"])).toEqual(["O1", "P"]);
    expect(splitSegmentName("AZ", ["A", "B"])).toBeNull();
  });
});

describe("geometry label placement", () => {
  const geometryDiagrams = allBlocks.flatMap((b) =>
    b.type === "diagram" && b.diagram.kind === "geometry" ? [b.diagram as GeometryDiagram] : [],
  );
  const extra: GeometryDiagram = {
    kind: "geometry",
    points: { A: [0, 0], B: [8, 0], C: [8, 6], D: [0, 6], M: [4, 3] },
    segments: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["A", "C"], ["B", "D"]],
    labels: { AB: "8 cm", BC: "6 cm", AC: "10 cm" },
  };

  for (const d of [...geometryDiagrams, extra]) {
    const layout = layoutGeometry(d);
    const labelBoxes = [
      ...layout.lengthLabels.map((l) => ({ x: l.x, y: l.y, w: l.w, h: l.h, what: l.text })),
      ...layout.points.map((p) => ({ x: p.labelX, y: p.labelY, w: 12 + p.name.length * 8, h: 16, what: p.name })),
    ];

    it(`keeps labels inside the figure (${d.alt ?? "rectangle"})`, () => {
      for (const b of labelBoxes) {
        expect(b.x - b.w / 2, b.what).toBeGreaterThanOrEqual(0);
        expect(b.x + b.w / 2, b.what).toBeLessThanOrEqual(GEO_W);
        expect(b.y - b.h / 2, b.what).toBeGreaterThanOrEqual(0);
        expect(b.y + b.h / 2, b.what).toBeLessThanOrEqual(GEO_H);
      }
    });

    it(`never overlaps two labels (${d.alt ?? "rectangle"})`, () => {
      for (let i = 0; i < labelBoxes.length; i++) {
        for (let j = i + 1; j < labelBoxes.length; j++) {
          const a = labelBoxes[i], b = labelBoxes[j];
          const overlap = Math.abs(a.x - b.x) < (a.w + b.w) / 2 && Math.abs(a.y - b.y) < (a.h + b.h) / 2;
          expect(overlap, `${a.what} / ${b.what}`).toBe(false);
        }
      }
    });

    it(`keeps point names off the lines and off other points (${d.alt ?? "rectangle"})`, () => {
      const segDist = (px: number, py: number, s: { x1: number; y1: number; x2: number; y2: number }) => {
        const vx = s.x2 - s.x1, vy = s.y2 - s.y1, L2 = vx * vx + vy * vy || 1;
        const t = Math.max(0, Math.min(1, ((px - s.x1) * vx + (py - s.y1) * vy) / L2));
        return Math.hypot(px - (s.x1 + t * vx), py - (s.y1 + t * vy));
      };
      for (const p of layout.points) {
        for (const s of layout.segments) expect(segDist(p.labelX, p.labelY, s), p.name).toBeGreaterThan(7);
        for (const q of layout.points) {
          if (q !== p) expect(Math.hypot(p.labelX - q.x, p.labelY - q.y), `${p.name} near ${q.name}`).toBeGreaterThan(10);
        }
      }
    });
  }

  it("draws a figure that is a single line", () => {
    const layout = layoutGeometry({ kind: "geometry", points: { A: [0, 0], B: [4, 0] }, segments: [["A", "B"]] });
    expect(layout.segments).toHaveLength(1);
    expect(Number.isFinite(layout.points[0].x)).toBe(true);
  });
});


describe("blocksToPlainText", () => {
  it("keeps every block readable as text", () => {
    const text = blocksToPlainText([
      { type: "text", text: "Find **x**." },
      { type: "math", latex: "x^2 = 4" },
      { type: "series", items: [3, 8, "?"] },
      { type: "series", items: [3, 8, 15], diffs: ["+5", "+7"] },
      { type: "table", headers: ["Year", "Sales"], rows: [["2020", 120]] },
      { type: "coding", from: "COLD", to: "FROG", shifts: ["+3", "+3", "+3", "+3"] },
      { type: "image", src: "https://x/y.webp", alt: "Figure 1" },
      { type: "diagram", diagram: { kind: "pie", alt: "Spending split", slices: [{ label: "a", value: 100 }] } },
    ]);
    expect(text.split("\n\n")).toEqual([
      "Find **x**.",
      "$$x^2 = 4$$",
      "3, 8, ?",
      "3 → (+5) 8 → (+7) 15",
      "Year | Sales\n2020 | 120",
      "Word: COLD → Code: FROG (+3, +3, +3, +3)",
      "![Figure 1](https://x/y.webp)",
      "[Figure: Spending split]",
    ]);
  });
});

describe("venn and tree checks", () => {
  it("allows a set that stands apart and keeps it clear of the others", async () => {
    const { renderToStaticMarkup } = await import("react-dom/server");
    const { ContentBlocks } = await import("./ContentBlocks");
    const d = {
      kind: "venn" as const,
      sets: [
        { id: "env", label: "Envelopes" },
        { id: "cards", label: "Cards", within: "env" },
        { id: "parcels", label: "Parcels" },
        { id: "bags", label: "Bags", overlaps: "env" },
      ],
    };
    expect(diagramProblems(d)).toEqual([]);
    const svg = renderToStaticMarkup(<ContentBlocks content={[{ type: "diagram", diagram: d }]} />);
    const circles = [...svg.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)" class="(?:ink|brand)"/g)].map((m) => m.slice(1, 4).map(Number));
    const [env, , parcels, bags] = circles;
    const apart = (a: number[], b: number[]) => Math.hypot(a[0] - b[0], a[1] - b[1]) > a[2] + b[2];
    expect(apart(parcels, env)).toBe(true);
    expect(apart(parcels, bags)).toBe(true);
  });
  it("flags a family tree with no links", () => {
    expect(diagramProblems({ kind: "tree", nodes: [{ id: "a", label: "A", gender: "f" }, { id: "b", label: "B", gender: "m" }], edges: [] })).toEqual([
      "Family tree has people but no parent → child links.",
    ]);
  });
});

describe("tidyTex", () => {
  it("turns en dashes, em dashes and Unicode minus into a plain minus", async () => {
    const { tidyTex } = await import("./tex");
    expect(tidyTex("10 – 5 — 2 − 1")).toBe("10 - 5 - 2 - 1");
    expect(tidyTex(String.raw`\frac{a} - b`)).toBe(String.raw`\frac{a} - b`);
  });
});

describe("cube diagram", () => {
  it("draws every face, dots for dice, and the opposite pairs", async () => {
    const { renderToStaticMarkup } = await import("react-dom/server");
    const { ContentBlocks } = await import("./ContentBlocks");
    const letters = renderToStaticMarkup(
      <ContentBlocks
        content={[{ type: "diagram", diagram: { kind: "cube", views: [{ top: "Q", left: "Z", right: "V" }, { top: "T", left: "L", right: "V" }], opposites: [["Q", "T"]] } }]}
      />,
    );
    for (const f of ["Q", "Z", "V", "T", "L"]) expect(letters).toContain(`>${f}</text>`);
    expect(letters).toContain("Q ↔ T");
    expect(letters).toContain('aria-label="2 views of a cube: Q on top, Z left, V right; T on top, L left, V right."');
    const dice = renderToStaticMarkup(
      <ContentBlocks content={[{ type: "diagram", diagram: { kind: "cube", pips: true, views: [{ top: "1", left: "2", right: "6" }] } }]} />,
    );
    expect(dice.match(/<circle/g)).toHaveLength(1 + 2 + 6);
  });
});

describe("reasoning figures", () => {
  it("draws mirror images by moving and flipping each character", async () => {
    const { renderToStaticMarkup } = await import("react-dom/server");
    const { ContentBlocks } = await import("./ContentBlocks");
    const svg = renderToStaticMarkup(
      <ContentBlocks content={[{ type: "diagram", diagram: { kind: "mirror", text: "AB3", transform: "mirror", keep: [2] } }]} />,
    );
    // A (first) ends up in the last cell, flipped; 3 moves to the first cell but stays unflipped.
    expect(svg).toMatch(/translate\(70 30\) scale\(-1 1\)"[^>]*>A</);
    expect(svg).toMatch(/translate\(22 30\)"[^>]*>3</);
  });

  it("puts each region's number inside exactly the right shapes, for every mix of shapes", async () => {
    const { layoutRegions, regionKeys, pointInPolygon } = await import("./regions");
    const shapes = ["circle", "triangle", "square"] as const;
    for (const a of shapes) for (const b of shapes) for (const c of [...shapes, null]) {
      const sets = [a, b, c].filter((s): s is (typeof shapes)[number] => s !== null).map((shape) => ({ label: "x", shape }));
      const L = layoutRegions({ kind: "regions", sets, values: {} });
      for (const key of regionKeys(sets.length as 2 | 3)) {
        const at = L.spots[key];
        const name = `${sets.map((s) => s.shape).join("/")} ${key}`;
        expect(at, name).toBeDefined();
        expect(L.shapes.map((s) => pointInPolygon(at, s.outline)), name).toEqual(L.shapes.map((_, i) => key.includes("ABC"[i])));
        expect(L.clearance[key], name).toBeGreaterThan(10);
      }
    }
  }, 30000); // checks every mix of shapes: a few seconds alone, more when the whole suite runs

  it("draws every circle arrangement the way its name says", async () => {
    const { RELATION_PATTERN_NAMES, patternCircles, pairRelation, REL_W, REL_H } = await import("./relations");
    const expected: Record<string, string[]> = {
      "2-apart": ["apart"], "2-overlap": ["overlap"], "2-inside": ["contains"],
      "3-apart": ["apart", "apart", "apart"],
      "3-nested": ["contains", "contains", "contains"],
      "3-two-inside-apart": ["contains", "contains", "apart"],
      "3-two-inside-overlap": ["contains", "contains", "overlap"],
      "3-overlap": ["overlap", "overlap", "overlap"],
      "3-overlap-apart": ["overlap", "apart", "apart"],
      "3-chain": ["overlap", "apart", "overlap"],
      "3-inside-apart": ["contains", "apart", "apart"],
      "3-inside-overlap-outer": ["contains", "overlap", "apart"],
      "3-inside-overlap-both": ["contains", "overlap", "overlap"],
      "3-overlap-one-inside": ["overlap", "contains", "apart"],
      "3-in-both": ["overlap", "contains", "contains"],
    };
    expect(Object.keys(expected).sort()).toEqual([...RELATION_PATTERN_NAMES].sort());
    for (const name of RELATION_PATTERN_NAMES) {
      const c = patternCircles(name);
      const pairs = c.length === 2 ? [pairRelation(c[0], c[1])] : [pairRelation(c[0], c[1]), pairRelation(c[0], c[2]), pairRelation(c[1], c[2])];
      expect(pairs, name).toEqual(expected[name]);
      for (const k of c) {
        expect(k.cx - k.r, name).toBeGreaterThanOrEqual(0);
        expect(k.cx + k.r, name).toBeLessThanOrEqual(REL_W);
        expect(k.cy - k.r, name).toBeGreaterThanOrEqual(0);
        expect(k.cy + k.r, name).toBeLessThanOrEqual(REL_H);
      }
    }
  });

  it("spells figures out in the plain-text copy", () => {
    const text = blocksToPlainText([
      { type: "diagram", diagram: { kind: "puzzle", alt: "a figure", figures: [{ shape: "triangle", values: ["2", "3", "4"], center: "?" }] } },
      { type: "diagram", diagram: { kind: "mirror", text: "AB3K7", line: "right" } },
    ]);
    expect(text).toContain("triangle with 2, 3, 4 at the corners and ? in the middle");
    expect(text).toContain("AB3K7, as printed, mirror line on the right");
  });
});
