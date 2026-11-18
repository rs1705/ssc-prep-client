import { describe, expect, it } from "vitest";
import { nextHidden } from "./hide-on-scroll";

describe("nextHidden", () => {
  it("hides when scrolling down past the top and shows when scrolling up", () => {
    expect(nextHidden(false, 100, 140)).toBe(true);
    expect(nextHidden(true, 400, 360)).toBe(false);
  });
  it("ignores small jitters", () => {
    expect(nextHidden(true, 400, 404)).toBe(true);
    expect(nextHidden(false, 400, 396)).toBe(false);
  });
  it("always shows near the top", () => {
    expect(nextHidden(true, 200, 40)).toBe(false);
    expect(nextHidden(false, 10, 60)).toBe(false);
  });
});
