import { beforeEach, describe, expect, it } from "vitest";
import { logMistakes } from "@/lib/activity-log";
import { markSeen, missedLabels, orderFresh, readSeen, seenProgress } from "./seenPool";


// Minimal browser stand-ins: localStorage with key iteration, and events.
const store = new Map<string, string>();
Object.assign(globalThis, {
  window: {
    localStorage: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
      key: (i: number) => [...store.keys()][i] ?? null,
      get length() {
        return store.size;
      },
    },
    dispatchEvent: () => true,
  },
});

const items = Array.from({ length: 10 }, (_, i) => `w${i}`);
const idOf = (s: string) => s;

describe("seenPool", () => {
  beforeEach(() => store.clear());

  it("puts unseen items before seen ones, oldest seen first", () => {
    markSeen("p", ["w3", "w1"]);
    const out = orderFresh("p", items, { idOf });
    expect(out).toHaveLength(10);
    expect(out.slice(-2)).toEqual(["w3", "w1"]);
    expect(new Set(out.slice(0, 8))).toEqual(new Set(items.filter((w) => w !== "w1" && w !== "w3")));
  });

  it("goes through the whole pool before repeating", () => {
    const shown: string[] = [];
    for (let round = 0; round < 5; round++) {
      const pick = orderFresh("p", items, { idOf, count: 2 }).slice(0, 2);
      markSeen("p", pick);
      shown.push(...pick);
    }
    expect(new Set(shown).size).toBe(10);
  });

  it("starts a new cycle when everything is seen, without repeating the last round", () => {
    markSeen("p", items);
    const out = orderFresh("p", items, { idOf, count: 3 });
    expect(readSeen().p.cycle).toBe(1);
    expect(out.slice(-3)).toEqual(["w7", "w8", "w9"]);
    expect(seenProgress("p", items).seen).toBe(3);
  });

  it("mixes recent mistakes from this screen into the first round", () => {
    items.slice(0, 9).forEach((w) => markSeen("p", [w]));
    logMistakes([{ subject: "english", source: "Hangman", prompt: "clue", answer: "W0", href: "/h" }]);
    const out = orderFresh("p", items, { idOf, labelsOf: (w) => [w], missed: missedLabels("/h"), count: 5 });
    expect(out.slice(0, 5)).toContain("w0");
    expect(out.slice(0, 5)).toContain("w9");
  });
});
