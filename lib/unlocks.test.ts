import { describe, expect, it } from "vitest";
import { lockText, paperLock } from "./unlocks";

describe("paper unlocks", () => {
  it("keeps the newest paper free", () => {
    expect(paperLock(0, { level: 1, answered: 0, attempted: false }).open).toBe(true);
  });

  it("needs both the level and the practice for older papers", () => {
    expect(paperLock(2, { level: 3, answered: 59, attempted: false })).toMatchObject({ open: false, levelNeeded: 0, questionsNeeded: 1 });
    expect(paperLock(2, { level: 2, answered: 60, attempted: false })).toMatchObject({ open: false, levelNeeded: 1, questionsNeeded: 0 });
    expect(paperLock(2, { level: 3, answered: 60, attempted: false }).open).toBe(true);
  });

  it("keeps a paper open once attempted", () => {
    expect(paperLock(5, { level: 1, answered: 0, attempted: true }).open).toBe(true);
  });

  it("says what is left", () => {
    expect(lockText(paperLock(2, { level: 1, answered: 50, attempted: false }))).toBe("Reach level 3 and answer 10 more questions");
    expect(lockText(paperLock(1, { level: 2, answered: 29, attempted: false }))).toBe("Answer 1 more question");
  });
});
