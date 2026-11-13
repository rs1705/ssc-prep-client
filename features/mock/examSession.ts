import type { Pyq } from "@/redux/PyqApi";
import type { SubjectKey } from "@/lib/subject-theme";

/**
 * SSC CBT rules for a full Tier 1 paper (new interface):
 *  - Sections run in a fixed order, each with its own clock (15 minutes).
 *    Unused time is not carried over; when a section's clock ends the test
 *    moves on, and a finished section cannot be reopened.
 *  - Inside the running section you can jump to any question.
 *  - Picking an option is only a draft. It is saved by "Save & Next" or
 *    "Mark for Review & Next"; moving away any other way discards it.
 */

export const SECTION_SECONDS = 15 * 60;

export interface ExamSection {
  subject: SubjectKey;
  start: number;
  end: number;
}

export interface ExamState {
  questions: Pyq[];
  sections: ExamSection[];
  section: number;
  index: number;
  /** Saved answers: questionId -> option label. */
  answers: Record<string, string>;
  /** Unsaved pick on the current question. */
  draft: string | null;
  marked: string[];
  visited: string[];
  secondsLeft: number;
  submitted: boolean;
}

export type ExamAction =
  | { type: "PICK"; label: string }
  | { type: "CLEAR" }
  | { type: "SAVE_NEXT" }
  | { type: "MARK_NEXT" }
  | { type: "GOTO"; index: number }
  | { type: "TICK" }
  | { type: "END_SECTION" }
  | { type: "SUBMIT" };

export function createExam(sections: { subject: SubjectKey; questions: Pyq[] }[]): ExamState {
  let start = 0;
  const ranges = sections.map((s) => {
    const r = { subject: s.subject, start, end: start + s.questions.length };
    start = r.end;
    return r;
  });
  const questions = sections.flatMap((s) => s.questions);
  return {
    questions,
    sections: ranges,
    section: 0,
    index: 0,
    answers: {},
    draft: null,
    marked: [],
    visited: questions[0] ? [questions[0].id] : [],
    secondsLeft: SECTION_SECONDS,
    submitted: false,
  };
}

/** Go to a question, keeping it inside the running section. */
function moveTo(state: ExamState, index: number): ExamState {
  const sec = state.sections[state.section];
  const target = Math.max(sec.start, Math.min(sec.end - 1, index));
  const id = state.questions[target].id;
  return {
    ...state,
    index: target,
    draft: state.answers[id] ?? null,
    visited: state.visited.includes(id) ? state.visited : [...state.visited, id],
  };
}

function nextSection(state: ExamState): ExamState {
  if (state.section >= state.sections.length - 1) return { ...state, draft: null, submitted: true };
  const section = state.section + 1;
  return moveTo({ ...state, section, secondsLeft: SECTION_SECONDS }, state.sections[section].start);
}

export function examReducer(state: ExamState, action: ExamAction): ExamState {
  if (state.submitted) return state;
  const current = state.questions[state.index];
  const sec = state.sections[state.section];
  const isLastInSection = state.index === sec.end - 1;

  switch (action.type) {
    case "PICK":
      return current.options.some((o) => o.label === action.label) ? { ...state, draft: action.label } : state;

    case "CLEAR": {
      const answers = { ...state.answers };
      delete answers[current.id];
      return { ...state, answers, draft: null };
    }

    case "SAVE_NEXT":
    case "MARK_NEXT": {
      const answers = { ...state.answers };
      if (state.draft) answers[current.id] = state.draft;
      const marked =
        action.type === "MARK_NEXT"
          ? state.marked.includes(current.id)
            ? state.marked
            : [...state.marked, current.id]
          : state.marked.filter((id) => id !== current.id);
      const saved = { ...state, answers, marked };
      return isLastInSection ? { ...saved, draft: answers[current.id] ?? null } : moveTo(saved, state.index + 1);
    }

    case "GOTO":
      return moveTo(state, action.index);

    case "TICK":
      return state.secondsLeft <= 1 ? nextSection({ ...state, secondsLeft: 0 }) : { ...state, secondsLeft: state.secondsLeft - 1 };

    case "END_SECTION":
      return nextSection(state);

    case "SUBMIT":
      return { ...state, draft: null, submitted: true };

    default:
      return state;
  }
}

export type PaletteStatus = "not-visited" | "not-answered" | "answered" | "marked" | "answered-marked";

export function paletteStatus(state: ExamState, id: string): PaletteStatus {
  const answered = id in state.answers;
  const marked = state.marked.includes(id);
  if (answered && marked) return "answered-marked";
  if (marked) return "marked";
  if (answered) return "answered";
  return state.visited.includes(id) ? "not-answered" : "not-visited";
}

export function countStatuses(state: ExamState, start: number, end: number): Record<PaletteStatus, number> {
  const out: Record<PaletteStatus, number> = {
    "not-visited": 0,
    "not-answered": 0,
    answered: 0,
    marked: 0,
    "answered-marked": 0,
  };
  for (const q of state.questions.slice(start, end)) out[paletteStatus(state, q.id)] += 1;
  return out;
}
