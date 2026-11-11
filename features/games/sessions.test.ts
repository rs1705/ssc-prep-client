import { beforeEach, describe, expect, it } from "vitest";
import { loadSet, replayHref, saveSet, shuffle } from "./sessionSet";
import { clearUnfinished, listUnfinished, loadUnfinished, resumeHref, saveUnfinished, UNFINISHED_MAX_AGE_MS } from "./unfinished";
import { MASTERY_DAYS, logMistakes, pickForReview, readMastered, readMistakes, recordReview } from "@/lib/activity-log";

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

beforeEach(() => store.clear());

const day = (d: number, h = 10) => new Date(2026, 10, d, h);

describe("saved sets", () => {
  it("saves one set per screen, ignoring the query string", () => {
    saveSet("/SSC/english/games/fill-in-the-blanks", [1, 2, 3], "idiom");
    const saved = loadSet<number[]>("/SSC/english/games/fill-in-the-blanks?replay=1");
    expect(saved?.items).toEqual([1, 2, 3]);
    expect(saved?.meta).toBe("idiom");
    expect(loadSet("/SSC/english/games/match-the-following")).toBeNull();
  });

  it("builds replay links and shuffles without losing items", () => {
    expect(replayHref("/a/b?x=1")).toBe("/a/b?replay=1");
    const items = Array.from({ length: 20 }, (_, i) => i);
    expect(shuffle(items).sort((a, b) => a - b)).toEqual(items);
  });
});

describe("unfinished sessions", () => {
  const entry = (path: string, done: number, total = 10) => ({
    path,
    label: path,
    subject: "english" as const,
    done,
    total,
    state: { done },
  });

  it("can be saved, listed newest first and cleared", () => {
    saveUnfinished(entry("/a", 3), 1_000);
    saveUnfinished(entry("/b", 5), 2_000);
    expect(listUnfinished(3_000).map((u) => u.path)).toEqual(["/b", "/a"]);
    clearUnfinished("/b");
    expect(loadUnfinished("/b", 3_000)).toBeNull();
    expect(resumeHref("/a?x")).toBe("/a?resume=1");
  });

  it("drops finished and old sessions", () => {
    saveUnfinished(entry("/done", 10), 1_000);
    expect(loadUnfinished("/done", 2_000)).toBeNull();
    saveUnfinished(entry("/old", 4), 1_000);
    expect(loadUnfinished("/old", 1_000 + UNFINISHED_MAX_AGE_MS + 1)).toBeNull();
    expect(loadUnfinished("/old", 1_000 + UNFINISHED_MAX_AGE_MS - 1)).not.toBeNull();
  });
});

describe("mistakes review", () => {
  const add = (prompt: string, at = day(9).getTime()) =>
    logMistakes([{ subject: "english", source: "Cloze", prompt, answer: "x", href: "/c", options: ["x", "y"] }], at);

  it("masters a mistake after right answers on two different days", () => {
    add("q1");
    const id = readMistakes()[0].id;
    expect(recordReview(id, true, day(10))).toBe(false);
    expect(recordReview(id, true, day(10, 18))).toBe(false); // same day again doesn't count twice
    expect(readMistakes()[0].rightDays).toHaveLength(1);
    expect(recordReview(id, true, day(11))).toBe(true);
    expect(readMistakes()).toHaveLength(0);
    expect(readMastered()).toHaveLength(1);
    expect(MASTERY_DAYS).toBe(2);
  });

  it("starts the count again after a wrong answer", () => {
    add("q1");
    const id = readMistakes()[0].id;
    recordReview(id, true, day(10));
    recordReview(id, false, day(11));
    expect(readMistakes()[0].rightDays).toEqual([]);
    expect(recordReview(id, true, day(12))).toBe(false);
  });

  it("puts mistakes not yet right today first, oldest first", () => {
    add("old", day(1).getTime());
    add("new", day(5).getTime());
    add("done-today", day(3).getTime());
    const doneId = readMistakes().find((m) => m.prompt === "done-today")!.id;
    recordReview(doneId, true, day(10));
    expect(pickForReview(readMistakes(), 10, day(10)).map((m) => m.prompt)).toEqual(["old", "new", "done-today"]);
    expect(pickForReview(readMistakes(), 2, day(10))).toHaveLength(2);
  });

  it("keeps answer options with a mistake", () => {
    add("q1");
    expect(readMistakes()[0].options).toEqual(["x", "y"]);
  });
});
