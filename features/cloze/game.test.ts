import { describe, expect, it } from "vitest";
import type { FlashCardInterface } from "@/lib/types";
import { blankSentence, buildQuestions, clozeReducer, initialState } from "./game";

const card = (id: string, word: string, example: string): FlashCardInterface =>
  ({
    _id: id,
    type: "vocab",
    difficulty: "medium",
    subject: "english",
    tags: [],
    front: { text: word },
    back: { content_eng: `Meaning of ${word}`, example_eng: [example] },
  }) as unknown as FlashCardInterface;

describe("blankSentence", () => {
  it("blanks the whole word, keeping the sentence around it", () => {
    expect(blankSentence(card("1", "invigilator", "The invigilator collected the sheets."))).toEqual({
      before: "The ",
      answer: "invigilator",
      after: " collected the sheets.",
    });
  });

  it("matches case-insensitively and keeps the sentence's own casing", () => {
    expect(blankSentence(card("1", "abate", "Abate the noise."))?.answer).toBe("Abate");
  });

  it("does not match inside a longer word", () => {
    expect(blankSentence(card("1", "abate", "The storm abated."))).toBeNull();
  });
});

describe("buildQuestions", () => {
  const words = ["candid", "brisk", "frugal", "lucid", "placid", "serene", "terse", "vivid"];
  const cards = words.map((w, i) => card(String(i), w, `She was ${w} about it.`));

  it("gives every question 4 distinct options including the answer", () => {
    const qs = buildQuestions(cards, 6);
    expect(qs).toHaveLength(6);
    for (const q of qs) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options.map((o) => o.toLowerCase())).size).toBe(4);
      expect(q.options).toContain(q.answer);
    }
  });
});

describe("clozeReducer", () => {
  it("scores a right answer, records a wrong one, and ends after the last question", () => {
    const qs = [
      { id: "a", before: "", after: "", answer: "x", options: ["x", "y", "z", "w"], meaning: "" },
      { id: "b", before: "", after: "", answer: "y", options: ["x", "y", "z", "w"], meaning: "" },
    ];
    let s = clozeReducer(initialState, { type: "START", questions: qs });
    s = clozeReducer(s, { type: "ANSWER", option: "x" });
    expect(s.correctCount).toBe(1);
    s = clozeReducer(s, { type: "NEXT" });
    s = clozeReducer(s, { type: "ANSWER", option: "z" });
    expect(s.misses.map((m) => m.id)).toEqual(["b"]);
    s = clozeReducer(s, { type: "NEXT" });
    expect(s.phase).toBe("over");
  });
});
