import { describe, expect, it } from "vitest";
import { prefillLetters } from "@/features/hangman/game";
import { fractionPercent, MATHS_DECKS } from "@/features/maths-cards/decks";
import { formatInterval } from "@/features/flashcards/ratings";

describe("Hangman prefillLetters", () => {
  it("gives the first letter, and the last for words of 7+ letters", () => {
    expect(prefillLetters("RESILIENT")).toEqual(["R", "T"]);
    expect(prefillLetters("OBSOLETE")).toEqual(["O", "E"]);
    expect(prefillLetters("ABATE")).toEqual(["A"]);
  });

  it("always leaves at least two different letters to find", () => {
    expect(prefillLetters("AB")).toEqual([]);
    expect(prefillLetters("ABC")).toEqual(["A"]);
  });
});

describe("Maths flashcards", () => {
  it("writes fractions as exact percentages, with a decimal when it doesn't terminate", () => {
    expect(fractionPercent(1, 8)).toBe("$12\\tfrac{1}{2}\\%$ (≈ 12.50%)");
    expect(fractionPercent(1, 4)).toBe("$25\\%$");
    expect(fractionPercent(1, 7)).toBe("$14\\tfrac{2}{7}\\%$ (≈ 14.29%)");
    expect(fractionPercent(5, 6)).toBe("$83\\tfrac{1}{3}\\%$ (≈ 83.33%)");
  });

  it("builds every deck with unique card ids", () => {
    for (const deck of MATHS_DECKS) {
      const cards = deck.build();
      expect(cards.length).toBeGreaterThan(0);
      expect(new Set(cards.map((c) => c._id)).size).toBe(cards.length);
    }
  });
});

describe("formatInterval", () => {
  const now = Date.parse("2026-11-10T10:00:00Z");
  const at = (ms: number) => new Date(now + ms).toISOString();

  it("formats each range", () => {
    expect(formatInterval(at(30_000), now)).toBe("<1 min");
    expect(formatInterval(at(10 * 60_000), now)).toBe("10 min");
    expect(formatInterval(at(5 * 3_600_000), now)).toBe("5 h");
    expect(formatInterval(at(4 * 86_400_000), now)).toBe("4 d");
    expect(formatInterval(undefined, now)).toBeNull();
  });
});
