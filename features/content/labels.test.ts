import { describe, expect, it } from "vitest";
import { placeLabels, segmentBoxDistance, type Pt } from "./labels";

describe("placeLabels", () => {
  it("measures segment-to-box distance", () => {
    expect(segmentBoxDistance([[0, 0], [100, 0]], 50, 20, 10, 5)).toBeCloseTo(15, 0);
    expect(segmentBoxDistance([[0, 0], [100, 0]], 50, 3, 10, 5)).toBe(0);
  });

  it("keeps every label off every line, dot and other label (the direction-path case)", () => {
    // A walk N 5, E 3, S 9, E 3 drawn on screen, plus the dashed start→end line.
    // Same 44px padding as the real diagram (360 × 300).
    const P = (x: number, y: number): Pt => [100 + x * 20, 160 - y * 20];
    const pts = [P(0, 0), P(0, 5), P(3, 5), P(3, -4), P(6, -4)];
    const steps: [Pt, Pt][] = pts.slice(1).map((p, i) => [pts[i], p]);
    const disp: [Pt, Pt] = [pts[0], pts[4]];
    const dots = [{ at: pts[0], r: 6 }, { at: pts[4], r: 6 }];
    const placed = placeLabels(
      [
        ...steps.map((s, i) => ({ text: `${[5, 3, 9, 3][i]} km`, along: s, charWidth: 6.7 })),
        { text: "√52 ≈ 7.2 km", along: disp, charWidth: 6.4 },
      ],
      { segments: [...steps, disp], dots },
      360,
      300,
    );
    for (const l of placed) {
      for (const s of [...steps, disp]) {
        expect(segmentBoxDistance(s, l.x, l.y, l.w / 2, l.h / 2), `${l.text} vs a line`).toBeGreaterThanOrEqual(3);
      }
      for (const d of dots) {
        const dx = Math.max(Math.abs(d.at[0] - l.x) - l.w / 2, 0), dy = Math.max(Math.abs(d.at[1] - l.y) - l.h / 2, 0);
        expect(Math.hypot(dx, dy) - d.r, `${l.text} vs a dot`).toBeGreaterThanOrEqual(3);
      }
    }
    for (let i = 0; i < placed.length; i++) {
      for (let j = i + 1; j < placed.length; j++) {
        const a = placed[i], b = placed[j];
        const overlap = Math.abs(a.x - b.x) < (a.w + b.w) / 2 && Math.abs(a.y - b.y) < (a.h + b.h) / 2;
        expect(overlap, `${a.text} / ${b.text}`).toBe(false);
      }
    }
  });
});

describe("geometry length labels", () => {
  // Two parallel chords on the same side of the centre (a real explanation that read badly:
  // "10 cm" and "7 cm" sat between OA and OP and looked like their lengths).
  const chords = {
    kind: "geometry" as const,
    alt: "Two parallel chords",
    points: { O: [0, 0], P: [0, 12], Q: [0, 5], A: [-5, 12], B: [5, 12], C: [-12, 5], D: [12, 5] } as Record<string, [number, number]>,
    segments: [["A", "B"], ["C", "D"], ["O", "P"], ["O", "A"], ["O", "C"]] as [string, string][],
    circles: [{ center: "O", through: "A" }],
    labels: { AB: "10 cm", CD: "24 cm", PQ: "7 cm" },
  };

  it("puts each label nearer its own line than any other, and gives an undrawn distance a dimension line", async () => {
    const { layoutGeometry } = await import("./geometry");
    const g = layoutGeometry(chords);
    const seg = (i: number): [[number, number], [number, number]] => [[g.segments[i].x1, g.segments[i].y1], [g.segments[i].x2, g.segments[i].y2]];
    const gap = (l: (typeof g.lengthLabels)[number], s: [[number, number], [number, number]]) => segmentBoxDistance(s, l.x, l.y, l.w / 2, l.h / 2);
    const [ab, , pq] = g.lengthLabels;
    // 10 cm: on the far side of AB from the centre (OP and OA are on the near side), nearer AB than OA
    expect(ab.y + ab.h / 2).toBeLessThan(g.segments[0].y1);
    expect(gap(ab, seg(0))).toBeLessThan(gap(ab, seg(3)));
    // 7 cm: PQ has no line of its own, so it gets a dimension line, and the label is nearer that than OP
    expect(g.dimensions).toHaveLength(1);
    const m = g.dimensions[0];
    expect(gap(pq, [[m.x1, m.y1], [m.x2, m.y2]])).toBeLessThan(gap(pq, seg(2)));
    expect(gap(pq, seg(3))).toBeGreaterThan(gap(pq, [[m.x1, m.y1], [m.x2, m.y2]]));
  });
});
