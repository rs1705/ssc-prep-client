/**
 * Generic timed multiple-choice sprint: questions come from a generator, a
 * wrong answer costs time and the streak, streaks raise the points multiplier.
 * Used by the Reasoning speed drills (and reusable for other subjects).
 */

export const SPRINT_SECONDS = 60;
export const WRONG_PENALTY_SECONDS = 5;
export const BASE_POINTS = 10;
export const FEEDBACK_MS = 650;

export interface SprintQuestion {
  /** Main line, e.g. "Position of R in the alphabet?" */
  prompt: string;
  /** Optional second line, e.g. a series "4, 9, 16, 25, ?" shown large. */
  display?: string;
  options: string[];
  answer: string;
  /** One-line method, shown after a miss and in the review list. */
  explain: string;
}

export type Phase = "lobby" | "playing" | "over";

export interface SprintState {
  phase: Phase;
  queue: SprintQuestion[];
  index: number;
  timeLeft: number;
  score: number;
  streak: number;
  bestStreak: number;
  correctCount: number;
  answeredCount: number;
  misses: (SprintQuestion & { chosen: string })[];
  feedback: { chosen: string; correct: boolean } | null;
}

export type SprintAction =
  | { type: "START"; queue: SprintQuestion[] }
  | { type: "TICK" }
  | { type: "ANSWER"; option: string }
  | { type: "ADVANCE" }
  | { type: "RESET" };

export const initialState: SprintState = {
  phase: "lobby",
  queue: [],
  index: 0,
  timeLeft: SPRINT_SECONDS,
  score: 0,
  streak: 0,
  bestStreak: 0,
  correctCount: 0,
  answeredCount: 0,
  misses: [],
  feedback: null,
};

export function streakMultiplier(streak: number): number {
  return Math.min(3, 1 + Math.floor(streak / 5) * 0.5);
}

export function rankTitle(score: number): string {
  if (score >= 450) return "Topper";
  if (score >= 300) return "Inspector";
  if (score >= 180) return "Officer";
  if (score >= 80) return "Aspirant";
  return "Rookie";
}

export function sprintReducer(state: SprintState, action: SprintAction): SprintState {
  switch (action.type) {
    case "START":
      if (action.queue.length === 0) return state;
      return { ...initialState, phase: "playing", queue: action.queue };

    case "TICK": {
      if (state.phase !== "playing") return state;
      const timeLeft = state.timeLeft - 1;
      return timeLeft <= 0 ? { ...state, timeLeft: 0, phase: "over", feedback: null } : { ...state, timeLeft };
    }

    case "ANSWER": {
      if (state.phase !== "playing" || state.feedback) return state;
      const q = state.queue[state.index];
      if (!q.options.includes(action.option)) return state;
      if (action.option === q.answer) {
        const streak = state.streak + 1;
        return {
          ...state,
          streak,
          bestStreak: Math.max(state.bestStreak, streak),
          score: state.score + Math.round(BASE_POINTS * streakMultiplier(state.streak)),
          correctCount: state.correctCount + 1,
          answeredCount: state.answeredCount + 1,
          feedback: { chosen: action.option, correct: true },
        };
      }
      const timeLeft = state.timeLeft - WRONG_PENALTY_SECONDS;
      return {
        ...state,
        streak: 0,
        timeLeft: Math.max(0, timeLeft),
        phase: timeLeft <= 0 ? "over" : state.phase,
        answeredCount: state.answeredCount + 1,
        misses: [...state.misses, { ...q, chosen: action.option }],
        feedback: { chosen: action.option, correct: false },
      };
    }

    case "ADVANCE": {
      if (state.phase !== "playing" || !state.feedback) return state;
      const index = state.index + 1;
      return { ...state, index: index >= state.queue.length ? 0 : index, feedback: null };
    }

    case "RESET":
      return initialState;

    default:
      return state;
  }
}
