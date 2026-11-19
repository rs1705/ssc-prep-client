import { describe, expect, it } from "vitest";
import { clampContentSize, contentSizePercent, MAX_CONTENT_SIZE, stepContentSize } from "./content-size";

describe("content size", () => {
  it("falls back to normal for odd saved values", () => {
    expect(clampContentSize(undefined)).toBe(1);
    expect(clampContentSize("big")).toBe(1);
    expect(clampContentSize(NaN)).toBe(1);
    expect(clampContentSize(99)).toBe(MAX_CONTENT_SIZE);
    expect(clampContentSize(-3)).toBe(0);
  });
  it("steps up and down without leaving the range", () => {
    expect(stepContentSize(1, 1)).toBe(2);
    expect(stepContentSize(0, -1)).toBe(0);
    expect(stepContentSize(MAX_CONTENT_SIZE, 1)).toBe(MAX_CONTENT_SIZE);
  });
  it("names each step as a percentage", () => {
    expect(contentSizePercent(1)).toBe("100%");
    expect(contentSizePercent(2)).toBe("115%");
  });
});
