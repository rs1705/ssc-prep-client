import { describe, expect, it } from "vitest";
import {
  alphabetPosition,
  codingMixed,
  codingNumber,
  letterSeries,
  numberAnalogy,
  numberSeries,
  oddOneOut,
  opposite,
  oppositeLetter,
  pos,
  type Generator,
} from "./generators";

const RUNS = 2000;
const all: [string, Generator][] = [
  ["alphabetPosition", alphabetPosition],
  ["oppositeLetter", oppositeLetter],
  ["codingMixed", codingMixed],
  ["numberSeries", numberSeries],
  ["letterSeries", letterSeries],
  ["numberAnalogy", numberAnalogy],
  ["oddOneOut", oddOneOut],
];

describe.each(all)("%s", (_, generate) => {
  it("always gives 4 distinct options that include the answer, plus a method", () => {
    for (let i = 0; i < RUNS; i++) {
      const q = generate();
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options).toContain(q.answer);
      expect(q.explain.length).toBeGreaterThan(0);
      expect(q.options.join(" ")).not.toMatch(/NaN|undefined/);
    }
  });
});

describe("answer keys", () => {
  it("opposite letters add up to 27", () => {
    for (let i = 0; i < RUNS; i++) {
      const q = oppositeLetter();
      const letter = q.prompt.match(/of ([A-Z])/)![1];
      expect(pos(letter) + pos(q.answer)).toBe(27);
      expect(opposite(q.answer)).toBe(letter);
    }
  });

  it("letter-sum codes add the positions", () => {
    for (let i = 0; i < RUNS; i++) {
      const q = codingNumber();
      if (!/Add the letter/.test(q.explain)) continue;
      const word = q.prompt.match(/then ([A-Z]+)/)![1];
      expect(Number(q.answer)).toBe([...word].reduce((sum, c) => sum + pos(c), 0));
    }
  });

  it("square odd-one-out has exactly three squares", () => {
    const isSquare = (n: number) => Number.isInteger(Math.sqrt(n));
    for (let i = 0; i < RUNS; i++) {
      const q = oddOneOut();
      if (!/perfect squares/.test(q.explain)) continue;
      expect(q.options.filter((o) => isSquare(Number(o)))).toHaveLength(3);
      expect(isSquare(Number(q.answer))).toBe(false);
    }
  });
});
