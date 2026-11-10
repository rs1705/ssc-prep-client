import type { SpellingWord } from "@/lib/spelling-words";
import { shuffle } from "@/lib/shuffle";

export const ROUND_SECONDS = 60;
export const WRONG_PENALTY_SECONDS = 5;
export const BASE_POINTS = 10;
export const FEEDBACK_MS = 380;

export interface Question {
  word: SpellingWord;
  /** Shuffled once so options never move under the player's thumb. */
  options: string[];
}

export interface Miss {
  correct: string;
  chosen: string;
}

export type Phase = "lobby" | "playing" | "over";

export interface SpellingState {
  phase: Phase;
  queue: Question[];
  index: number;
  timeLeft: number;
  score: number;
  streak: number;
  bestStreak: number;
  correctCount: number;
  answeredCount: number;
  misses: Miss[];
  /** Set for a moment after an answer so the UI can colour the buttons. */
  feedback: { chosen: string; correct: boolean } | null;
}

export type SpellingAction =
  | { type: "START"; queue: Question[] }
  | { type: "TICK" }
  | { type: "ANSWER"; option: string }
  | { type: "ADVANCE" }
  | { type: "RESET" };

export const initialState: SpellingState = {
  phase: "lobby",
  queue: [],
  index: 0,
  timeLeft: ROUND_SECONDS,
  score: 0,
  streak: 0,
  bestStreak: 0,
  correctCount: 0,
  answeredCount: 0,
  misses: [],
  feedback: null,
};

/** Every word once, shuffled, then reshuffled again if the player outlasts the bank. */
export function buildQueue(bank: SpellingWord[], rounds = 2): Question[] {
  const out: Question[] = [];
  for (let r = 0; r < rounds; r++) {
    for (const word of shuffle(bank)) {
      out.push({ word, options: shuffle([word.correct, ...word.wrong]) });
    }
  }
  return out;
}

/** +10, rising by half a step for every 5 answers in a row, up to x3. */
export function streakMultiplier(streak: number): number {
  return Math.min(3, 1 + Math.floor(streak / 5) * 0.5);
}

export function rankTitle(score: number): string {
  if (score >= 500) return "Commissioner";
  if (score >= 350) return "Inspector";
  if (score >= 220) return "Officer";
  if (score >= 100) return "Aspirant";
  return "Rookie";
}

export function spellingReducer(state: SpellingState, action: SpellingAction): SpellingState {
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
      const question = state.queue[state.index];
      if (!question.options.includes(action.option)) return state;
      const correct = action.option === question.word.correct;

      if (correct) {
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
        misses: [...state.misses, { correct: question.word.correct, chosen: action.option }],
        feedback: { chosen: action.option, correct: false },
      };
    }

    case "ADVANCE": {
      if (state.phase !== "playing" || !state.feedback) return state;
      const index = state.index + 1;
      // Ran out of questions: the clock decides the rest, so loop back to the start.
      return { ...state, index: index >= state.queue.length ? 0 : index, feedback: null };
    }

    case "RESET":
      return initialState;

    default:
      return state;
  }
}
