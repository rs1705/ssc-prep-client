import type { PinpointPuzzle } from "@/lib/pinpoint-puzzles";
import { shuffle } from "@/lib/shuffle";

export const PUZZLES_PER_RUN = 6;
export const MAX_WRONG = 3;
/** Points by number of wrong guesses before the right one. */
export const POINTS = [100, 70, 40] as const;
export const MAX_SCORE = PUZZLES_PER_RUN * POINTS[0];

export interface Round {
  puzzle: PinpointPuzzle;
  /** Shuffled once per round so options don't move while playing. */
  options: string[];
}

export interface RoundResult {
  round: Round;
  points: number;
  wrongCount: number;
  solved: boolean;
}

export type Phase = "lobby" | "playing" | "reveal" | "over";

export interface PinpointState {
  phase: Phase;
  rounds: Round[];
  index: number;
  /** Options eliminated by wrong guesses this round. */
  eliminated: string[];
  score: number;
  results: RoundResult[];
}

export type PinpointAction =
  | { type: "START"; rounds: Round[] }
  | { type: "PICK"; option: string }
  | { type: "NEXT" }
  | { type: "RESET" };

export const initialState: PinpointState = {
  phase: "lobby",
  rounds: [],
  index: 0,
  eliminated: [],
  score: 0,
  results: [],
};

export function buildRounds(bank: PinpointPuzzle[], count = PUZZLES_PER_RUN): Round[] {
  return shuffle(bank)
    .slice(0, count)
    .map((puzzle) => ({
      puzzle,
      options: shuffle([puzzle.answer, ...puzzle.distractors]),
    }));
}

export function rankTitle(score: number): string {
  const ratio = score / MAX_SCORE;
  if (ratio >= 0.8) return "Commissioner";
  if (ratio >= 0.6) return "Inspector";
  if (ratio >= 0.4) return "Officer";
  if (ratio >= 0.2) return "Aspirant";
  return "Rookie";
}

export function currentRound(state: PinpointState): Round | null {
  return state.rounds[state.index] ?? null;
}

export function pinpointReducer(state: PinpointState, action: PinpointAction): PinpointState {
  switch (action.type) {
    case "START":
      if (action.rounds.length === 0) return state;
      return { ...initialState, phase: "playing", rounds: action.rounds };

    case "PICK": {
      if (state.phase !== "playing") return state;
      const round = state.rounds[state.index];
      if (!round.options.includes(action.option) || state.eliminated.includes(action.option)) {
        return state;
      }

      if (action.option === round.puzzle.answer) {
        const wrongCount = state.eliminated.length;
        const points = POINTS[wrongCount] ?? 0;
        return {
          ...state,
          phase: "reveal",
          score: state.score + points,
          results: [...state.results, { round, points, wrongCount, solved: true }],
        };
      }

      const eliminated = [...state.eliminated, action.option];
      if (eliminated.length >= MAX_WRONG) {
        // Only the right answer is left: show it and move on, no points.
        return {
          ...state,
          phase: "reveal",
          eliminated,
          results: [...state.results, { round, points: 0, wrongCount: eliminated.length, solved: false }],
        };
      }
      return { ...state, eliminated };
    }

    case "NEXT": {
      if (state.phase !== "reveal") return state;
      if (state.index + 1 >= state.rounds.length) return { ...state, phase: "over" };
      return { ...state, phase: "playing", index: state.index + 1, eliminated: [] };
    }

    case "RESET":
      return initialState;

    default:
      return state;
  }
}
