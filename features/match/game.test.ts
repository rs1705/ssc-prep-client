import { describe, expect, it } from "vitest";
import {
  ROUND_SIZE,
  RUN_SECONDS,
  TIME_BONUS,
  WRONG_PENALTY_SECONDS,
  buildRounds,
  initialState,
  matchReducer,
  uniquePairs,
  type Pair,
} from "./game";

const pairs = (n: number): Pair[] => Array.from({ length: n }, (_, i) => ({ id: `p${i}`, left: `L${i}`, right: `R${i}` }));

describe("uniquePairs", () => {
  it("drops pairs whose left or right text repeats, ignoring case", () => {
    const out = uniquePairs([
      { id: "a", left: "Abate", right: "lessen" },
      { id: "b", left: "abate", right: "other" },
      { id: "c", left: "Brisk", right: "LESSEN" },
      { id: "d", left: "Calm", right: "quiet" },
    ]);
    expect(out.map((p) => p.id)).toEqual(["a", "d"]);
  });

  it("drops pairs where both sides are the same", () => {
    expect(uniquePairs([{ id: "x", left: "A", right: "a" }])).toEqual([]);
  });
});

describe("buildRounds", () => {
  it("makes rounds of ROUND_SIZE and drops a short last round", () => {
    const rounds = buildRounds(pairs(12));
    expect(rounds).toHaveLength(2);
    rounds.forEach((r) => expect(r).toHaveLength(ROUND_SIZE));
  });
});

describe("matchReducer", () => {
  const start = () => matchReducer(initialState, { type: "START", rounds: buildRounds(pairs(10)) });

  it("matches a correct pair and scores it", () => {
    let s = start();
    s = matchReducer(s, { type: "PICK", side: "left", id: "p0" });
    s = matchReducer(s, { type: "PICK", side: "right", id: "p0" });
    expect(s.matched).toEqual(["p0"]);
    expect(s.score).toBeGreaterThan(0);
    expect(s.streak).toBe(1);
  });

  it("a wrong pair costs time and the streak, and is saved for review", () => {
    let s = start();
    s = matchReducer(s, { type: "PICK", side: "left", id: "p0" });
    s = matchReducer(s, { type: "PICK", side: "right", id: "p1" });
    expect(s.wrong).toEqual({ left: "p0", right: "p1" });
    expect(s.timeLeft).toBe(RUN_SECONDS - WRONG_PENALTY_SECONDS);
    expect(s.streak).toBe(0);
    expect(s.missed.map((p) => p.id)).toEqual(["p0"]);
  });

  it("clearing every round ends the run with a time bonus", () => {
    let s = start();
    for (let r = 0; r < 2; r++) {
      for (const p of s.rounds[s.round]) {
        s = matchReducer(s, { type: "PICK", side: "left", id: p.id });
        s = matchReducer(s, { type: "PICK", side: "right", id: p.id });
      }
      const before = s.score;
      s = matchReducer(s, { type: "NEXT_ROUND" });
      if (r === 1) {
        expect(s.phase).toBe("over");
        expect(s.clearedAll).toBe(true);
        expect(s.score).toBe(before + s.timeLeft * TIME_BONUS);
      }
    }
  });
});
