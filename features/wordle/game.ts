import { WORD_OF_DAY_BANK, type WordOfDay } from "@/lib/wordle-words";

export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;
/** Meaning is shown as a hint once this many guesses have been made. */
export const HINT_AFTER = 3;

export type TileState = "correct" | "present" | "absent";
export type Status = "playing" | "won" | "lost";
export type Mode = "daily" | "bonus";

export interface WordleState {
  mode: Mode;
  answer: WordOfDay;
  guesses: string[];
  current: string;
  status: Status;
  /** Incremented when Enter is pressed with fewer than 5 letters, so the UI can nudge. */
  shortCount: number;
}

export type WordleAction =
  | { type: "TYPE"; letter: string }
  | { type: "DELETE" }
  | { type: "SUBMIT" }
  | { type: "LOAD"; mode: Mode; answer: WordOfDay; guesses: string[] };

/** Whole days since 2025-01-01 in the player's local calendar. */
export function dayNumber(date: Date = new Date()): number {
  const local = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor((local - Date.UTC(2025, 0, 1)) / 86_400_000);
}

/** Deterministic daily word. Stepping by 7 avoids showing the bank in list order. */
export function wordForDay(day: number, bank: WordOfDay[] = WORD_OF_DAY_BANK): WordOfDay {
  const index = (((day * 7) % bank.length) + bank.length) % bank.length;
  return bank[index];
}

/** Standard Wordle scoring, including correct handling of repeated letters. */
export function evaluateGuess(guess: string, answer: string): TileState[] {
  const result: TileState[] = Array(guess.length).fill("absent");
  const remaining: Record<string, number> = {};

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === answer[i]) result[i] = "correct";
    else remaining[answer[i]] = (remaining[answer[i]] ?? 0) + 1;
  }
  for (let i = 0; i < guess.length; i++) {
    if (result[i] === "correct") continue;
    if ((remaining[guess[i]] ?? 0) > 0) {
      result[i] = "present";
      remaining[guess[i]] -= 1;
    }
  }
  return result;
}

/** Best known state per letter, for colouring the on-screen keyboard. */
export function letterStates(guesses: string[], answer: string): Record<string, TileState> {
  const rank: Record<TileState, number> = { absent: 0, present: 1, correct: 2 };
  const out: Record<string, TileState> = {};
  for (const guess of guesses) {
    evaluateGuess(guess, answer).forEach((state, i) => {
      const letter = guess[i];
      if (!out[letter] || rank[state] > rank[out[letter]]) out[letter] = state;
    });
  }
  return out;
}

export function createState(mode: Mode, answer: WordOfDay, guesses: string[] = []): WordleState {
  let status: Status = "playing";
  if (guesses.includes(answer.word)) status = "won";
  else if (guesses.length >= MAX_GUESSES) status = "lost";
  return { mode, answer, guesses, current: "", status, shortCount: 0 };
}

export function wordleReducer(state: WordleState, action: WordleAction): WordleState {
  switch (action.type) {
    case "LOAD":
      return createState(action.mode, action.answer, action.guesses);

    case "TYPE": {
      if (state.status !== "playing" || state.current.length >= WORD_LENGTH) return state;
      const letter = action.letter.toUpperCase();
      if (!/^[A-Z]$/.test(letter)) return state;
      return { ...state, current: state.current + letter };
    }

    case "DELETE":
      if (state.status !== "playing") return state;
      return { ...state, current: state.current.slice(0, -1) };

    case "SUBMIT": {
      if (state.status !== "playing") return state;
      if (state.current.length !== WORD_LENGTH) {
        return { ...state, shortCount: state.shortCount + 1 };
      }
      const guesses = [...state.guesses, state.current];
      return createState(state.mode, state.answer, guesses);
    }

    default:
      return state;
  }
}

/** Emoji grid for sharing, e.g. "Word of the Day #412 3/6". */
export function shareText(state: WordleState, day: number): string {
  const rows = state.guesses.map((guess) =>
    evaluateGuess(guess, state.answer.word)
      .map((s) => (s === "correct" ? "🟩" : s === "present" ? "🟨" : "⬛"))
      .join(""),
  );
  const score = state.status === "won" ? `${state.guesses.length}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
  const label = state.mode === "daily" ? `#${day}` : "bonus";
  return `EptSSC Word of the Day ${label} ${score}\n${rows.join("\n")}`;
}

export interface WordleStats {
  played: number;
  won: number;
  streak: number;
  bestStreak: number;
  lastWonDay: number;
}

export const EMPTY_STATS: WordleStats = { played: 0, won: 0, streak: 0, bestStreak: 0, lastWonDay: -1 };

/** Update lifetime stats after a finished daily game. */
export function recordResult(stats: WordleStats, won: boolean, day: number): WordleStats {
  if (!won) return { ...stats, played: stats.played + 1, streak: 0 };
  const streak = stats.lastWonDay === day - 1 ? stats.streak + 1 : 1;
  return {
    played: stats.played + 1,
    won: stats.won + 1,
    streak,
    bestStreak: Math.max(stats.bestStreak, streak),
    lastWonDay: day,
  };
}
