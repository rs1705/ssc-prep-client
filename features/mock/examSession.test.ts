import { describe, expect, it } from "vitest";
import type { Pyq } from "@/redux/PyqApi";
import { SECTION_SECONDS, countStatuses, createExam, examReducer, paletteStatus, type ExamAction, type ExamState } from "./examSession";

const q = (id: string): Pyq => ({
  id,
  topic: "T",
  subtopics: [],
  difficulty: null,
  question: id,
  options: ["A", "B", "C", "D"].map((label) => ({ label, text: label })),
  answer: "A",
  explanation: "",
  passage: null,
  source: null,
});

const exam = () =>
  createExam([
    { subject: "reasoning", questions: [q("r1"), q("r2"), q("r3")] },
    { subject: "gk", questions: [q("g1"), q("g2")] },
  ]);

const run = (state: ExamState, ...actions: ExamAction[]) => actions.reduce(examReducer, state);

describe("examSession", () => {
  it("only saves a pick on Save & Next", () => {
    let s = run(exam(), { type: "PICK", label: "B" }, { type: "GOTO", index: 1 });
    expect(s.answers.r1).toBeUndefined();
    expect(paletteStatus(s, "r1")).toBe("not-answered");
    s = run(s, { type: "PICK", label: "C" }, { type: "SAVE_NEXT" });
    expect(s.answers.r2).toBe("C");
    expect(s.index).toBe(2);
    expect(paletteStatus(s, "r2")).toBe("answered");
  });

  it("marks for review, with or without an answer", () => {
    const s = run(exam(), { type: "MARK_NEXT" }, { type: "PICK", label: "A" }, { type: "MARK_NEXT" });
    expect(paletteStatus(s, "r1")).toBe("marked");
    expect(paletteStatus(s, "r2")).toBe("answered-marked");
    expect(countStatuses(s, 0, 3)).toMatchObject({ marked: 1, "answered-marked": 1, "not-answered": 1 });
  });

  it("keeps navigation inside the running section", () => {
    const s = run(exam(), { type: "GOTO", index: 4 });
    expect(s.index).toBe(2);
    const t = run(exam(), { type: "SAVE_NEXT" }, { type: "SAVE_NEXT" }, { type: "SAVE_NEXT" });
    expect(t.index).toBe(2);
    expect(t.section).toBe(0);
  });

  it("moves to the next section when the clock runs out, and never back", () => {
    let s: ExamState = { ...exam(), secondsLeft: 1 };
    s = run(s, { type: "TICK" });
    expect(s.section).toBe(1);
    expect(s.index).toBe(3);
    expect(s.secondsLeft).toBe(SECTION_SECONDS);
    s = run(s, { type: "GOTO", index: 0 });
    expect(s.index).toBe(3);
  });

  it("submits after the last section ends", () => {
    const s = run(exam(), { type: "END_SECTION" }, { type: "END_SECTION" });
    expect(s.submitted).toBe(true);
  });

  it("clears a saved answer", () => {
    const s = run(exam(), { type: "PICK", label: "A" }, { type: "SAVE_NEXT" }, { type: "GOTO", index: 0 }, { type: "CLEAR" });
    expect(s.answers.r1).toBeUndefined();
  });
});
