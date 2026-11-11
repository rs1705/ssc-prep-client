import { beforeEach, describe, expect, it } from "vitest";
import {
  describeRoute,
  dismissMistake,
  logActivity,
  logMistakes,
  plainText,
  readActivity,
  readMistakes,
  startOfWeek,
  subjectStats,
  timeAgo,
  weekStats,
  type ActivityEntry,
} from "./activity-log";

const store = new Map<string, string>();
Object.assign(globalThis, {
  window: {
    localStorage: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
    },
    dispatchEvent: () => true,
  },
});

beforeEach(() => store.clear());

// Wednesday 11 Nov 2026, 10:00 local.
const WED = new Date(2026, 10, 11, 10, 0);
const at = (day: number, hour = 9) => new Date(2026, 10, day, hour).getTime();

const entry = (over: Partial<ActivityEntry>): ActivityEntry => ({
  id: Math.random().toString(),
  at: WED.getTime(),
  kind: "game",
  subject: "english",
  label: "x",
  href: "/x",
  ...over,
});

describe("describeRoute", () => {
  it("names games, drills and PYQs with their subject", () => {
    expect(describeRoute("/SSC/english/games/fill-in-the-blanks")).toMatchObject({ label: "Fill in the Blanks", subject: "english" });
    expect(describeRoute("/SSC/maths/mental-maths/square_roots")).toEqual({
      label: "Square Roots speed drill",
      subject: "maths",
      kind: "drill",
    });
    expect(describeRoute("/SSC/reasoning/speed-drills/coding-decoding")).toMatchObject({
      label: "Coding Decoding drill",
      subject: "reasoning",
    });
    expect(describeRoute("/SSC/gk/topic-pyqs/history")).toMatchObject({ subject: "gk", kind: "pyq" });
  });
});

describe("startOfWeek", () => {
  it("is Monday at midnight, also on a Sunday", () => {
    expect(startOfWeek(WED)).toEqual(new Date(2026, 10, 9));
    expect(startOfWeek(new Date(2026, 10, 15, 22))).toEqual(new Date(2026, 10, 9));
  });
});

describe("weekStats", () => {
  it("adds up this week only and marks the active days", () => {
    const s = weekStats(
      [
        entry({ at: at(9), correct: 8, total: 10 }),
        entry({ at: at(11), correct: 2, total: 10 }),
        entry({ at: at(11, 8) }), // no score: counts as a session, not as questions
        entry({ at: at(8), correct: 10, total: 10 }), // last Sunday
      ],
      WED,
    );
    expect(s.sessions).toBe(3);
    expect(s.questions).toBe(20);
    expect(s.accuracy).toBe(50);
    expect(s.activeDays).toEqual([true, false, true, false, false, false, false]);
  });

  it("has no accuracy with no scored sessions", () => {
    expect(weekStats([], WED).accuracy).toBeNull();
  });
});

describe("subjectStats", () => {
  it("looks back 30 days in one subject", () => {
    const list = [
      entry({ subject: "maths", at: at(10), correct: 3, total: 4 }),
      entry({ subject: "maths", at: new Date(2026, 9, 1).getTime(), correct: 0, total: 10 }), // too old
      entry({ subject: "english", at: at(10), correct: 0, total: 5 }),
    ];
    const s = subjectStats(list, "maths", WED.getTime());
    expect(s).toEqual({ sessions: 1, questions: 4, accuracy: 75, lastAt: at(10) });
    expect(subjectStats(list, "gk", WED.getTime()).accuracy).toBeNull();
  });
});

describe("log storage", () => {
  it("keeps the newest activity first", () => {
    logActivity({ kind: "drill", subject: "maths", label: "a", href: "/a" }, 1);
    logActivity({ kind: "game", subject: "english", label: "b", href: "/b" }, 2);
    expect(readActivity().map((a) => a.label)).toEqual(["b", "a"]);
  });

  it("caps the activity log at 300 entries", () => {
    for (let i = 0; i < 310; i++) logActivity({ kind: "game", subject: "english", label: String(i), href: "/" }, i);
    const list = readActivity();
    expect(list).toHaveLength(300);
    expect(list[0].label).toBe("309");
  });

  it("replaces a repeated mistake instead of saving it twice", () => {
    const m = { subject: "english" as const, source: "Cloze", prompt: "He ____ home", answer: "went", href: "/c" };
    logMistakes([m, { ...m, prompt: "Other" }], 1);
    logMistakes([m], 2);
    const list = readMistakes();
    expect(list.map((x) => x.prompt)).toEqual(["He ____ home", "Other"]);
    expect(list[0].at).toBe(2);
  });

  it("caps mistakes at 150 and can dismiss one", () => {
    logMistakes(
      Array.from({ length: 160 }, (_, i) => ({ subject: "maths" as const, source: "s", prompt: `q${i}`, answer: "a", href: "/" })),
    );
    expect(readMistakes()).toHaveLength(150);
    const first = readMistakes()[0];
    dismissMistake(first.id);
    expect(readMistakes().some((m) => m.id === first.id)).toBe(false);
  });

  it("ignores an empty mistakes list", () => {
    logMistakes([]);
    expect(store.size).toBe(0);
  });
});

describe("text helpers", () => {
  it("formats time ago", () => {
    const now = WED.getTime();
    expect(timeAgo(now - 10_000, now)).toBe("just now");
    expect(timeAgo(now - 5 * 60_000, now)).toBe("5 min ago");
    expect(timeAgo(now - 3 * 3_600_000, now)).toBe("3 h ago");
    expect(timeAgo(now - 26 * 3_600_000, now)).toBe("yesterday");
    expect(timeAgo(now - 4 * 86_400_000, now)).toBe("4 days ago");
  });

  it("strips LaTeX and markdown and shortens long text", () => {
    expect(plainText("Find $\\frac{1}{2}$ of **20**")).toBe("Find 1/2 of 20");
    expect(plainText("a".repeat(50), 10)).toHaveLength(10);
  });
});
