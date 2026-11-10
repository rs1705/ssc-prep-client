import type { HangmanWord } from "@/lib/hangman-words";

export const WORDS_PER_RUN = 10;
export const LIVES = 3;
export const MAX_STRIKES = 6;
export const HINTS_PER_RUN = 2;
export const HINT_COST = 40;
export const REVEAL_MS = 2600;
export const LIFE_BONUS = 50;
export const MAX_COMBO = 4;

export type Phase = "lobby" | "playing" | "reveal" | "over";
export type Outcome = "solved" | "failed" | "timeout";

export interface WordResult {
  word: HangmanWord;
  outcome: Outcome;
  gained: number;
  /** Solved with no wrong guess and no hint. */
  perfect: boolean;
}

export interface HangmanState {
  phase: Phase;
  queue: HangmanWord[];
  index: number;
  guessed: string[];
  wrong: number;
  hintUsed: boolean;
  lives: number;
  score: number;
  /** Consecutive perfect words. Drives the score multiplier. */
  combo: number;
  bestCombo: number;
  hintsLeft: number;
  timeLeft: number;
  timeTotal: number;
  totalGuesses: number;
  correctGuesses: number;
  results: WordResult[];
  lastResult: WordResult | null;
  /** Bonus added when a run is completed with lives remaining. */
  lifeBonus: number;
}

export type HangmanAction =
  | { type: "START"; queue: HangmanWord[] }
  | { type: "GUESS"; letter: string }
  | { type: "HINT"; letter: string }
  | { type: "TICK" }
  | { type: "NEXT" }
  | { type: "RESET" };

export const initialState: HangmanState = {
  phase: "lobby",
  queue: [],
  index: 0,
  guessed: [],
  wrong: 0,
  hintUsed: false,
  lives: LIVES,
  score: 0,
  combo: 0,
  bestCombo: 0,
  hintsLeft: HINTS_PER_RUN,
  timeLeft: 0,
  timeTotal: 0,
  totalGuesses: 0,
  correctGuesses: 0,
  results: [],
  lastResult: null,
  lifeBonus: 0,
};

export function timeForWord(word: string): number {
  return 25 + word.length * 2;
}

export function comboMultiplier(combo: number): number {
  return 1 + Math.min(combo, MAX_COMBO) * 0.25;
}

export function isSolved(word: string, guessed: string[]): boolean {
  return word.split("").every((letter) => guessed.includes(letter));
}

export function currentWord(state: HangmanState): HangmanWord | null {
  return state.queue[state.index] ?? null;
}

export function shuffleQueue(
  bank: HangmanWord[],
  count: number = WORDS_PER_RUN,
): HangmanWord[] {
  const copy = [...bank];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(count, copy.length));
}

export function rankTitle(score: number): string {
  if (score >= 1800) return "Commissioner";
  if (score >= 1300) return "Inspector";
  if (score >= 800) return "Officer";
  if (score >= 400) return "Aspirant";
  return "Rookie";
}

function finishWord(
  state: HangmanState,
  outcome: Outcome,
  guessed: string[],
  wrong: number,
  hintUsed: boolean,
): HangmanState {
  const word = state.queue[state.index];
  const perfect = outcome === "solved" && wrong === 0 && !hintUsed;
  const gained =
    outcome === "solved"
      ? Math.round(
          (100 + (MAX_STRIKES - wrong) * 10 + state.timeLeft * 2) *
            comboMultiplier(state.combo),
        )
      : 0;
  const combo = perfect ? state.combo + 1 : 0;
  const result: WordResult = { word, outcome, gained, perfect };

  return {
    ...state,
    phase: "reveal",
    guessed,
    wrong,
    hintUsed,
    score: state.score + gained,
    combo,
    bestCombo: Math.max(state.bestCombo, combo),
    lives: outcome === "solved" ? state.lives : state.lives - 1,
    results: [...state.results, result],
    lastResult: result,
  };
}

/**
 * Letters shown before the first guess so the word is approachable: the first
 * letter, plus the last one for words of 7+ letters. Never so many that fewer
 * than two different letters are left to find.
 */
export function prefillLetters(word: string): string[] {
  const letters = word.toUpperCase().split("");
  const distinct = new Set(letters);
  const picks = [letters[0]];
  if (letters.length >= 7 && letters[letters.length - 1] !== letters[0]) picks.push(letters[letters.length - 1]);
  const out: string[] = [];
  for (const letter of picks) {
    if (distinct.size - (out.length + 1) >= 2) out.push(letter);
  }
  return out;
}

function startWord(state: HangmanState, index: number): HangmanState {
  const word = state.queue[index];
  const total = timeForWord(word.word);
  return {
    ...state,
    phase: "playing",
    index,
    guessed: prefillLetters(word.word),
    wrong: 0,
    hintUsed: false,
    timeLeft: total,
    timeTotal: total,
    lastResult: null,
  };
}

export function hangmanReducer(
  state: HangmanState,
  action: HangmanAction,
): HangmanState {
  switch (action.type) {
    case "START": {
      if (action.queue.length === 0) return state;
      return startWord(
        { ...initialState, queue: action.queue, phase: "playing" },
        0,
      );
    }

    case "GUESS": {
      if (state.phase !== "playing") return state;
      const letter = action.letter.toUpperCase();
      if (!/^[A-Z]$/.test(letter) || state.guessed.includes(letter)) {
        return state;
      }
      const word = state.queue[state.index].word;
      const correct = word.includes(letter);
      const guessed = [...state.guessed, letter];
      const wrong = correct ? state.wrong : state.wrong + 1;
      const next: HangmanState = {
        ...state,
        guessed,
        wrong,
        totalGuesses: state.totalGuesses + 1,
        correctGuesses: state.correctGuesses + (correct ? 1 : 0),
        // A wrong guess ends the perfect streak immediately.
        combo: correct ? state.combo : 0,
      };
      if (isSolved(word, guessed)) {
        return finishWord(next, "solved", guessed, wrong, state.hintUsed);
      }
      if (wrong >= MAX_STRIKES) {
        return finishWord(next, "failed", guessed, wrong, state.hintUsed);
      }
      return next;
    }

    case "HINT": {
      if (state.phase !== "playing" || state.hintsLeft <= 0) return state;
      const letter = action.letter.toUpperCase();
      const word = state.queue[state.index].word;
      if (!word.includes(letter) || state.guessed.includes(letter)) {
        return state;
      }
      const guessed = [...state.guessed, letter];
      const next: HangmanState = {
        ...state,
        guessed,
        hintUsed: true,
        hintsLeft: state.hintsLeft - 1,
        score: Math.max(0, state.score - HINT_COST),
        combo: 0,
      };
      if (isSolved(word, guessed)) {
        return finishWord(next, "solved", guessed, state.wrong, true);
      }
      return next;
    }

    case "TICK": {
      if (state.phase !== "playing") return state;
      const timeLeft = state.timeLeft - 1;
      if (timeLeft <= 0) {
        return finishWord(
          { ...state, timeLeft: 0, combo: 0 },
          "timeout",
          state.guessed,
          state.wrong,
          state.hintUsed,
        );
      }
      return { ...state, timeLeft };
    }

    case "NEXT": {
      if (state.phase !== "reveal") return state;
      const isLast = state.index + 1 >= state.queue.length;
      if (state.lives <= 0 || isLast) {
        const completed = state.lives > 0 && isLast;
        const lifeBonus = completed ? state.lives * LIFE_BONUS : 0;
        return {
          ...state,
          phase: "over",
          lifeBonus,
          score: state.score + lifeBonus,
        };
      }
      return startWord(state, state.index + 1);
    }

    case "RESET":
      return initialState;

    default:
      return state;
  }
}
