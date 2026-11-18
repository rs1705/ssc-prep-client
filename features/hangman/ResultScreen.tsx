"use client";

import { ResultSummary } from "@/features/games/ResultSummary";
import { WordReviewList } from "@/features/games/WordReviewList";
import { rankTitle, type HangmanState } from "./game";

interface ResultScreenProps {
  state: HangmanState;
  best: number;
  isNewBest: boolean;
  onPlayAgain: () => void;
  onReplaySet?: () => void;
  onRetryMistakes?: () => void;
  retryCount?: number;
}

export function ResultScreen({ state, best, isNewBest, onPlayAgain, onReplaySet, onRetryMistakes, retryCount }: ResultScreenProps) {
  const solved = state.results.filter((r) => r.outcome === "solved").length;
  const accuracy =
    state.totalGuesses > 0
      ? Math.round((state.correctGuesses / state.totalGuesses) * 100)
      : 0;
  const cleared = state.lives > 0 && state.results.length === state.queue.length;


  const stats = [
    { label: "Solved", value: `${solved}/${state.queue.length}` },
    { label: "Accuracy", value: `${accuracy}%` },
    { label: "Best combo", value: `x${state.bestCombo}` },
  ];

  return (
    <ResultSummary
      kicker={cleared ? "Run complete" : "Out of hearts"}
      result={{ correct: solved, total: state.results.length }}
      mistakes={state.results
        .filter((r) => r.outcome !== "solved")
        .map((r) => ({ prompt: r.word.meaning, answer: r.word.word, detail: r.word.hindi }))}
      rank={rankTitle(state.score)}
      score={state.score}
      best={best}
      isNewBest={isNewBest}
      stats={stats}
      onPlayAgain={onPlayAgain}
      onReplaySet={onReplaySet}
      onRetryMistakes={onRetryMistakes}
      retryCount={retryCount}
      note={state.lifeBonus > 0 ? `Includes +${state.lifeBonus} for hearts left` : undefined}
      celebrate={cleared && solved === state.queue.length}
    >
      <WordReviewList
        words={state.results.map((r) => ({
          key: r.word.word,
          word: r.word.word.charAt(0) + r.word.word.slice(1).toLowerCase(),
          correct: r.outcome === "solved",
          meaning: r.word.meaning,
          hindi: r.word.hindi,
          note: r.outcome === "timeout" ? "Ran out of time" : undefined,
        }))}
      />
    </ResultSummary>
  );
}
