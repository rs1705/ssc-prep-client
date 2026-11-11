import { describe, expect, it } from "vitest";
import { BASE_POINTS, SPRINT_SECONDS, WRONG_PENALTY_SECONDS, initialState, sprintReducer, streakMultiplier } from "./sprint";

const q = { prompt: "2 + 2?", options: ["3", "4", "5", "6"], answer: "4", explain: "Add." };
const started = () => sprintReducer(initialState, { type: "START", queue: [q, q, q] });

describe("streakMultiplier", () => {
  it("rises by 0.5 every 5 in a row and caps at 3", () => {
    expect(streakMultiplier(0)).toBe(1);
    expect(streakMultiplier(5)).toBe(1.5);
    expect(streakMultiplier(100)).toBe(3);
  });
});

describe("sprintReducer", () => {
  it("scores a right answer", () => {
    const s = sprintReducer(started(), { type: "ANSWER", option: "4" });
    expect(s.score).toBe(BASE_POINTS);
    expect(s.feedback).toEqual({ chosen: "4", correct: true });
  });

  it("a wrong answer costs time and is kept for review", () => {
    const s = sprintReducer(started(), { type: "ANSWER", option: "5" });
    expect(s.timeLeft).toBe(SPRINT_SECONDS - WRONG_PENALTY_SECONDS);
    expect(s.misses[0].chosen).toBe("5");
  });

  it("ignores a second answer until the next question", () => {
    let s = sprintReducer(started(), { type: "ANSWER", option: "4" });
    s = sprintReducer(s, { type: "ANSWER", option: "4" });
    expect(s.correctCount).toBe(1);
  });

  it("ends when the clock runs out", () => {
    let s = started();
    for (let i = 0; i < SPRINT_SECONDS; i++) s = sprintReducer(s, { type: "TICK" });
    expect(s.phase).toBe("over");
  });
});
