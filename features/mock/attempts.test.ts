import { beforeEach, describe, expect, it } from "vitest";
import type { FullMock, Pyq } from "@/redux/PyqApi";
import { createExam, examReducer } from "./examSession";
import { MAX_ATTEMPTS, buildAttempt, findAttempt, readAttempts, saveAttempt } from "./attempts";

// Minimal browser stand-ins.
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

const mock = (kind: FullMock["kind"]): FullMock => ({
  kind,
  id: "paper-1",
  title: "SSC CGL Tier 1 · 2025",
  year: 2025,
  shift: null,
  date: null,
  questionCount: 3,
  durationSeconds: 900,
  sections: [{ subject: "maths", questions: [q("q1"), q("q2"), q("q3")] }],
});

describe("attempts", () => {
  beforeEach(() => store.clear());

  it("records answers, question order and the exam score", () => {
    let exam = createExam(mock("section").sections);
    exam = examReducer(exam, { type: "PICK", label: "A" });
    exam = examReducer(exam, { type: "SAVE_NEXT" });
    exam = examReducer(exam, { type: "PICK", label: "B" });
    exam = examReducer(exam, { type: "SAVE_NEXT" });
    exam = examReducer(exam, { type: "SUBMIT" });
    const a = buildAttempt(mock("section"), exam, 1000);
    expect(a).toMatchObject({
      kind: "section",
      paperId: "paper-1",
      subject: "maths",
      sections: [{ subject: "maths", ids: ["q1", "q2", "q3"] }],
      answers: { q1: "A", q2: "B" },
      correct: 1,
      wrong: 1,
      marks: 1.5,
      maxMarks: 6,
    });
  });

  it("keeps no paper id for a generated mock", () => {
    expect(buildAttempt(mock("mock"), createExam(mock("mock").sections)).paperId).toBeNull();
  });

  it("saves newest first and keeps at most MAX_ATTEMPTS", () => {
    const exam = createExam(mock("paper").sections);
    for (let i = 0; i < MAX_ATTEMPTS + 3; i++) saveAttempt({ ...buildAttempt(mock("paper"), exam, i), id: `a${i}` });
    const list = readAttempts();
    expect(list).toHaveLength(MAX_ATTEMPTS);
    expect(list[0].id).toBe(`a${MAX_ATTEMPTS + 2}`);
    expect(findAttempt("a0")).toBeNull();
    expect(findAttempt(`a${MAX_ATTEMPTS + 2}`)?.at).toBe(MAX_ATTEMPTS + 2);
  });
});
