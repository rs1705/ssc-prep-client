import { describe, expect, it } from "vitest";
import { freestyleSpotKey, resumeIndex } from "./resume";

const cards = ["a", "b", "c", "d"].map((_id) => ({ _id }));

describe("resumeIndex", () => {
  it("reopens at the saved card, found by id", () => {
    expect(resumeIndex(cards, { id: "c", index: 0 })).toBe(2);
  });
  it("falls back to the saved position, kept inside the deck", () => {
    expect(resumeIndex(cards, { id: "gone", index: 1 })).toBe(1);
    expect(resumeIndex(cards, { id: "gone", index: 40 })).toBe(3);
  });
  it("starts at the first card with nothing saved or an empty deck", () => {
    expect(resumeIndex(cards, null)).toBe(0);
    expect(resumeIndex([], { id: "a", index: 2 })).toBe(0);
  });
});

describe("freestyleSpotKey", () => {
  it("is the same for the same filters in any order, and differs per letter", () => {
    expect(freestyleSpotKey("vocab", { alphabet: "b", level: 2 })).toBe(freestyleSpotKey("vocab", { level: 2, alphabet: "b" }));
    expect(freestyleSpotKey("vocab", { alphabet: "b" })).not.toBe(freestyleSpotKey("vocab", { alphabet: "c" }));
    expect(freestyleSpotKey("idioms", { alphabet: "b" })).not.toBe(freestyleSpotKey("vocab", { alphabet: "b" }));
  });
});
