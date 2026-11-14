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
