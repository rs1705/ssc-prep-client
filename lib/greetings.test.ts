import { describe, expect, it } from "vitest";
import { QUOTES, dayPart, greetingFor, quoteFor } from "./greetings";

const on = (day: number, hour: number) => new Date(2026, 10, day, hour, 30);

describe("greetings", () => {
  it("follows the time of day", () => {
    expect([2, 5, 9, 14, 19, 23].map(dayPart)).toEqual(["lateNight", "early", "morning", "afternoon", "evening", "night"]);
    expect(dayPart(4)).toBe("early");
    expect(dayPart(12)).toBe("afternoon");
    expect(dayPart(17)).toBe("evening");
    expect(dayPart(21)).toBe("night");
  });

  it("changes between morning and evening on the same day", () => {
    expect(greetingFor(on(11, 9))).not.toBe(greetingFor(on(11, 19)));
  });

  it("uses a different wording on different days", () => {
    const week = new Set(Array.from({ length: 3 }, (_, i) => greetingFor(on(11 + i, 9))));
    expect(week.size).toBe(3);
  });
});

describe("daily quote", () => {
  it("stays the same all day", () => {
    expect(quoteFor(on(11, 0))).toEqual(quoteFor(on(11, 23)));
  });

  it("changes every day and goes through every quote before repeating", () => {
    const seen = Array.from({ length: QUOTES.length }, (_, i) => quoteFor(new Date(2026, 10, 11 + i, 12)).text);
    expect(new Set(seen).size).toBe(QUOTES.length);
    for (let i = 1; i < seen.length; i++) expect(seen[i]).not.toBe(seen[i - 1]);
  });

  it("has no duplicate quotes", () => {
    expect(new Set(QUOTES.map((q) => q.text)).size).toBe(QUOTES.length);
  });
});
