import type { FlashCardInterface } from "@/lib/types";
import { shuffle } from "@/lib/shuffle";

/** Fill in the Blanks: a flashcard's example sentence with its word blanked out. */

export const QUESTIONS_PER_RUN = 10;
export const BASE_POINTS = 10;

export interface ClozeQuestion {
  id: string;
  before: string;
  after: string;
  /** The text that fills the blank, exactly as it appears in the sentence. */
  answer: string;
  options: string[];
  meaning: string;
}

export type Phase = "lobby" | "playing" | "over";

export interface ClozeState {
  phase: Phase;
  questions: ClozeQuestion[];
  index: number;
  /** The option the player chose for the current question (null = not answered). */
  chosen: string | null;
  score: number;
  streak: number;
  bestStreak: number;
  correctCount: number;
  misses: ClozeQuestion[];
}

export type ClozeAction =
  | { type: "START"; questions: ClozeQuestion[] }
  | { type: "ANSWER"; option: string }
  | { type: "NEXT" }
  | { type: "RESET" }
  /** Pick up a saved, half-finished run. */
  | { type: "RESTORE"; state: ClozeState };

export const initialState: ClozeState = {
  phase: "lobby",
  questions: [],
  index: 0,
  chosen: null,
  score: 0,
  streak: 0,
  bestStreak: 0,
  correctCount: 0,
  misses: [],
};

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Finds the card's own word (or idiom) in its example; null if it isn't there verbatim. */
export function blankSentence(card: FlashCardInterface): Pick<ClozeQuestion, "before" | "after" | "answer"> | null {
  const sentence = card.back.example_eng?.[0]?.trim();
  const word = card.front.text.trim();
  if (!sentence || !word) return null;
  const match = new RegExp(`\\b${escapeRegExp(word)}\\b`, "i").exec(sentence);
  if (!match) return null;
  return {
    before: sentence.slice(0, match.index),
    answer: match[0],
    after: sentence.slice(match.index + match[0].length),
  };
}

/** Same case as the blank (a blank at the start of a sentence is capitalised). */
function matchCase(option: string, like: string) {
  const lower = option.toLowerCase();
  return like[0] === like[0].toUpperCase() && like[0] !== like[0].toLowerCase()
    ? lower.charAt(0).toUpperCase() + lower.slice(1)
    : lower;
}

/** Three wrong options from the same batch, preferring words of similar length. */
function distractors(answer: string, pool: string[]): string[] {
  const target = answer.toLowerCase();
  const candidates = [...new Set(pool.map((w) => w.toLowerCase()))].filter((w) => w !== target);
  const near = shuffle(candidates.filter((w) => Math.abs(w.length - target.length) <= 3));
  const far = shuffle(candidates.filter((w) => Math.abs(w.length - target.length) > 3));
  return [...near, ...far].slice(0, 3);
}

/** Up to `count` questions from a batch of cards (cards without a usable sentence are skipped). */
export function buildQuestions(cards: FlashCardInterface[], count = QUESTIONS_PER_RUN): ClozeQuestion[] {
  const pool = cards.map((c) => c.front.text.trim()).filter(Boolean);
  const out: ClozeQuestion[] = [];
  for (const card of cards) {
    if (out.length >= count) break;
    const blank = blankSentence(card);
    if (!blank) continue;
    const wrong = distractors(blank.answer, pool);
    if (wrong.length < 3) continue;
    const options = shuffle([blank.answer, ...wrong.map((w) => matchCase(w, blank.answer))]);
    if (new Set(options.map((o) => o.toLowerCase())).size !== 4) continue;
    out.push({ id: card._id, ...blank, options, meaning: card.back.content_eng });
  }
  return out;
}

export function streakMultiplier(streak: number): number {
  return Math.min(3, 1 + Math.floor(streak / 3) * 0.5);
}

export function rankTitle(correct: number, total: number): string {
  const ratio = total ? correct / total : 0;
  if (ratio === 1) return "Flawless";
  if (ratio >= 0.8) return "Sharp";
  if (ratio >= 0.6) return "Getting there";
  return "Keep practising";
}

export function clozeReducer(state: ClozeState, action: ClozeAction): ClozeState {
  switch (action.type) {
    case "START":
      if (action.questions.length === 0) return state;
      return { ...initialState, phase: "playing", questions: action.questions };

    case "ANSWER": {
      if (state.phase !== "playing" || state.chosen !== null) return state;
      const q = state.questions[state.index];
      if (!q.options.includes(action.option)) return state;
      if (action.option === q.answer) {
        const streak = state.streak + 1;
        return {
          ...state,
          chosen: action.option,
          streak,
          bestStreak: Math.max(state.bestStreak, streak),
          correctCount: state.correctCount + 1,
          score: state.score + Math.round(BASE_POINTS * streakMultiplier(state.streak)),
        };
      }
      return { ...state, chosen: action.option, streak: 0, misses: [...state.misses, q] };
    }

    case "RESTORE":
      return action.state.phase === "playing" ? action.state : state;
    case "NEXT": {
      if (state.phase !== "playing" || state.chosen === null) return state;
      const index = state.index + 1;
      return index >= state.questions.length
        ? { ...state, phase: "over", chosen: null }
        : { ...state, index, chosen: null };
    }

    case "RESET":
      return initialState;

    default:
      return state;
  }
}
