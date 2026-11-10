import { shuffle } from "@/lib/shuffle";

/** Duolingo-style "match the pairs": tap a left tile, then its partner on the right. */

export const ROUND_SIZE = 5;
export const ROUNDS = 5;
export const RUN_SECONDS = 90;
export const WRONG_PENALTY_SECONDS = 3;
export const BASE_POINTS = 10;
/** Bonus points per second left when every round is cleared. */
export const TIME_BONUS = 2;
export const WRONG_FLASH_MS = 450;
export const ROUND_CLEAR_MS = 350;

export interface Pair {
  id: string;
  left: string;
  right: string;
}

export type Side = "left" | "right";
export type Phase = "lobby" | "playing" | "over";

export interface MatchState {
  phase: Phase;
  rounds: Pair[][];
  round: number;
  /** Pair ids in display order for each column (shuffled independently). */
  leftOrder: string[];
  rightOrder: string[];
  matched: string[];
  selected: { side: Side; id: string } | null;
  /** The two tiles of a wrong attempt, shown red for a moment. */
  wrong: { left: string; right: string } | null;
  timeLeft: number;
  score: number;
  streak: number;
  bestStreak: number;
  mistakes: number;
  matchedTotal: number;
  /** Pairs the player got wrong at least once, for the review list. */
  missed: Pair[];
  clearedAll: boolean;
}

export type MatchAction =
  | { type: "START"; rounds: Pair[][] }
  | { type: "TICK" }
  | { type: "PICK"; side: Side; id: string }
  | { type: "CLEAR_WRONG" }
  | { type: "NEXT_ROUND" }
  | { type: "RESET" };

export const initialState: MatchState = {
  phase: "lobby",
  rounds: [],
  round: 0,
  leftOrder: [],
  rightOrder: [],
  matched: [],
  selected: null,
  wrong: null,
  timeLeft: RUN_SECONDS,
  score: 0,
  streak: 0,
  bestStreak: 0,
  mistakes: 0,
  matchedTotal: 0,
  missed: [],
  clearedAll: false,
};

/** Drops pairs whose left or right text repeats (would make two tiles look identical). */
export function uniquePairs(pairs: Pair[]): Pair[] {
  const lefts = new Set<string>();
  const rights = new Set<string>();
  return pairs.filter((p) => {
    const l = p.left.trim().toLowerCase();
    const r = p.right.trim().toLowerCase();
    if (!l || !r || l === r || lefts.has(l) || rights.has(r)) return false;
    lefts.add(l);
    rights.add(r);
    return true;
  });
}

/** Splits pairs into rounds of ROUND_SIZE (a short last round is dropped). */
export function buildRounds(pairs: Pair[], rounds = ROUNDS): Pair[][] {
  const unique = uniquePairs(pairs);
  const out: Pair[][] = [];
  for (let i = 0; i + ROUND_SIZE <= unique.length && out.length < rounds; i += ROUND_SIZE) {
    out.push(unique.slice(i, i + ROUND_SIZE));
  }
  return out;
}

export function streakMultiplier(streak: number): number {
  return Math.min(3, 1 + Math.floor(streak / 5) * 0.5);
}

export function rankTitle(score: number): string {
  if (score >= 450) return "Wordsmith";
  if (score >= 320) return "Officer";
  if (score >= 200) return "Aspirant";
  if (score >= 100) return "Learner";
  return "Rookie";
}

function startRound(state: MatchState, round: number): MatchState {
  const ids = state.rounds[round].map((p) => p.id);
  return {
    ...state,
    round,
    leftOrder: shuffle(ids),
    rightOrder: shuffle(ids),
    matched: [],
    selected: null,
    wrong: null,
  };
}

export function findPair(state: MatchState, id: string): Pair | undefined {
  return state.rounds[state.round]?.find((p) => p.id === id);
}

export function matchReducer(state: MatchState, action: MatchAction): MatchState {
  switch (action.type) {
    case "START":
      if (action.rounds.length === 0) return state;
      return startRound({ ...initialState, phase: "playing", rounds: action.rounds }, 0);

    case "TICK": {
      if (state.phase !== "playing") return state;
      const timeLeft = state.timeLeft - 1;
      return timeLeft <= 0 ? { ...state, timeLeft: 0, phase: "over", selected: null } : { ...state, timeLeft };
    }

    case "PICK": {
      if (state.phase !== "playing" || state.wrong) return state;
      if (state.matched.includes(action.id)) return state;
      if (state.matched.length === ROUND_SIZE) return state;
      const sel = state.selected;

      // First tile, or a different tile on the same side: (re)select it.
      if (!sel || sel.side === action.side) {
        const same = sel?.side === action.side && sel.id === action.id;
        return { ...state, selected: same ? null : { side: action.side, id: action.id } };
      }

      const leftId = sel.side === "left" ? sel.id : action.id;
      const rightId = sel.side === "right" ? sel.id : action.id;

      if (leftId === rightId) {
        const streak = state.streak + 1;
        return {
          ...state,
          matched: [...state.matched, leftId],
          selected: null,
          streak,
          bestStreak: Math.max(state.bestStreak, streak),
          score: state.score + Math.round(BASE_POINTS * streakMultiplier(state.streak)),
          matchedTotal: state.matchedTotal + 1,
        };
      }

      const pair = findPair(state, leftId);
      const missed =
        pair && !state.missed.some((m) => m.id === pair.id) ? [...state.missed, pair] : state.missed;
      const timeLeft = Math.max(0, state.timeLeft - WRONG_PENALTY_SECONDS);
      return {
        ...state,
        selected: null,
        wrong: { left: leftId, right: rightId },
        streak: 0,
        mistakes: state.mistakes + 1,
        missed,
        timeLeft,
        phase: timeLeft <= 0 ? "over" : state.phase,
      };
    }

    case "CLEAR_WRONG":
      return state.wrong ? { ...state, wrong: null } : state;

    case "NEXT_ROUND": {
      if (state.phase !== "playing" || state.matched.length < ROUND_SIZE) return state;
      const next = state.round + 1;
      if (next < state.rounds.length) return startRound(state, next);
      return {
        ...state,
        phase: "over",
        clearedAll: true,
        score: state.score + state.timeLeft * TIME_BONUS,
      };
    }

    case "RESET":
      return initialState;

    default:
      return state;
  }
}
