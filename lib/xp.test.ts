import { beforeEach, describe, expect, it } from "vitest";
import { XP_GAIN_EVENT, XP_RULES, awardXp, compact, levelFor, readXp, stepFor, streakMultiplier, totalXp } from "./xp";

const store = new Map<string, string>();
const events: Event[] = [];
Object.assign(globalThis, {
  window: {
    localStorage: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
    },
    dispatchEvent: (e: Event) => {
      events.push(e);
      return true;
    },
  },
});

const NOW = new Date(2026, 10, 23, 10, 0).getTime();
const DAY = 86_400_000;

beforeEach(() => {
  store.clear();
  events.length = 0;
});

describe("levels", () => {
  it("starts at level 1 and needs a bigger step each level", () => {
    expect(levelFor(0)).toMatchObject({ level: 1, into: 0, size: 100, toNext: 100 });
    expect(levelFor(99).level).toBe(1);
    expect(levelFor(100)).toMatchObject({ level: 2, into: 0, size: stepFor(2) });
    expect(stepFor(3)).toBeGreaterThan(stepFor(2));
  });
  it("names levels in bands of three", () => {
    expect(levelFor(0).name).toBe("Aspirant");
    expect(levelFor(stepFor(1) + stepFor(2) + stepFor(3)).name).toBe("Learner");
  });
});

describe("awarding", () => {
  it("pays each award once", () => {
    expect(awardXp([{ id: "q:1:2026-11-23", source: "answer", amount: 10 }], 0, NOW)).toBe(10);
    expect(awardXp([{ id: "q:1:2026-11-23", source: "answer", amount: 10 }], 0, NOW)).toBe(0);
    expect(totalXp(readXp())).toBe(10);
  });

  it("applies the streak bonus", () => {
    expect(streakMultiplier(2)).toBe(1);
    expect(streakMultiplier(7)).toBe(1.25);
    expect(awardXp([{ id: "a", source: "answer", amount: 10 }], 30, NOW)).toBe(15);
  });

  it("caps games, flashcards and drills per day", () => {
    const got = awardXp(
      Array.from({ length: 20 }, (_, i) => ({ id: `p${i}`, source: "practice" as const, amount: 30 })),
      0,
      NOW,
    );
    expect(got).toBe(XP_RULES.practiceDailyCap);
    // Questions are not capped.
    expect(awardXp([{ id: "q", source: "answer", amount: 10 }], 0, NOW)).toBe(10);
    // A new day has a new cap.
    expect(awardXp([{ id: "p-next", source: "practice", amount: 30 }], 0, NOW + DAY)).toBe(30);
  });

  it("announces the gain and a level-up", () => {
    awardXp([{ id: "big", source: "mock", amount: 120 }], 0, NOW);
    const gain = events.find((e) => e.type === XP_GAIN_EVENT) as CustomEvent;
    expect(gain.detail.amount).toBe(120);
    expect(gain.detail.levelUp?.level).toBe(2);
  });
});

describe("compact", () => {
  it("folds month-old awards into day totals without changing the total", () => {
    const r = {
      awards: {
        old1: { at: NOW - 40 * DAY, amount: 10, source: "answer" as const },
        old2: { at: NOW - 40 * DAY, amount: 5, source: "answer" as const },
        fresh: { at: NOW - DAY, amount: 7, source: "answer" as const },
      },
      days: {},
    };
    const c = compact(r, NOW);
    expect(Object.keys(c.awards)).toEqual(["fresh"]);
    expect(Object.values(c.days)).toEqual([15]);
    expect(totalXp(c)).toBe(totalXp(r));
  });
});
