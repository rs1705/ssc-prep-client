import type { Pyq } from "@/redux/PyqApi";

/** practice = instant feedback, untimed. test = exam rules, marked at the end. */
export type PyqMode = "practice" | "test";

export const MARKS_CORRECT = 2;
export const MARKS_WRONG = -0.5;

export interface PyqSessionState {
  mode: PyqMode;
  questions: Pyq[];
  index: number;
  /** questionId -> chosen option label */
  answers: Record<string, string>;
  submitted: boolean;
  /** Seconds left on the clock (test mode only). */
  secondsLeft: number | null;
  secondsTotal: number | null;
}

export type PyqSessionAction =
  | { type: "SELECT"; label: string }
  | { type: "CLEAR" }
  | { type: "GOTO"; index: number }
  | { type: "TICK" }
  | { type: "SUBMIT" };

export function createSession(
  mode: PyqMode,
  questions: Pyq[],
  durationSeconds?: number,
): PyqSessionState {
  const timed = mode === "test" && durationSeconds ? durationSeconds : null;
  return {
    mode,
    questions,
    index: 0,
    answers: {},
    submitted: false,
    secondsLeft: timed,
    secondsTotal: timed,
  };
}

export function sessionReducer(
  state: PyqSessionState,
  action: PyqSessionAction,
): PyqSessionState {
  if (state.submitted && action.type !== "GOTO") return state;
  const current = state.questions[state.index];

  switch (action.type) {
    case "SELECT": {
      if (!current.options.some((o) => o.label === action.label)) return state;
      // In practice mode the first answer is final (feedback is shown at once).
      if (state.mode === "practice" && state.answers[current.id]) return state;
      return { ...state, answers: { ...state.answers, [current.id]: action.label } };
    }

    case "CLEAR": {
      if (state.mode !== "test" || !state.answers[current.id]) return state;
      const answers = { ...state.answers };
      delete answers[current.id];
      return { ...state, answers };
    }

    case "GOTO": {
      const index = Math.max(0, Math.min(state.questions.length - 1, action.index));
      return index === state.index ? state : { ...state, index };
    }

    case "TICK": {
      if (state.secondsLeft === null) return state;
      const secondsLeft = state.secondsLeft - 1;
      return secondsLeft <= 0
        ? { ...state, secondsLeft: 0, submitted: true, index: 0 }
        : { ...state, secondsLeft };
    }

    case "SUBMIT":
      return { ...state, submitted: true, index: 0 };

    default:
      return state;
  }
}

export interface PyqResult {
  correct: number;
  wrong: number;
  skipped: number;
  /** Exam marks: +2 / -0.5 / 0. */
  marks: number;
  maxMarks: number;
  accuracy: number;
}

export function computeResult(state: PyqSessionState): PyqResult {
  let correct = 0;
  let wrong = 0;
  for (const q of state.questions) {
    const chosen = state.answers[q.id];
    if (!chosen) continue;
    if (chosen === q.answer) correct += 1;
    else wrong += 1;
  }
  const attempted = correct + wrong;
  return {
    correct,
    wrong,
    skipped: state.questions.length - attempted,
    marks: correct * MARKS_CORRECT + wrong * MARKS_WRONG,
    maxMarks: state.questions.length * MARKS_CORRECT,
    accuracy: attempted > 0 ? Math.round((correct / attempted) * 100) : 0,
  };
}

/** A practice set is finished once every question has an answer. */
export function isPracticeComplete(state: PyqSessionState): boolean {
  return state.questions.every((q) => state.answers[q.id]);
}

export function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
