"use client";

import { playFeedback } from "@/features/games/feedback";
import { useEffect, useRef } from "react";
import { GameFrame } from "@/features/games/GameFrame";
import { HangmanBoard } from "@/features/hangman/HangmanBoard";
import { LobbyScreen } from "@/features/hangman/LobbyScreen";
import { ResultScreen } from "@/features/hangman/ResultScreen";
import { useHangmanGame } from "@/features/hangman/useHangmanGame";

export default function HangmanPage() {
  const { state, word, best, isNewBest, start, guess, hint, next, replaySet, retryMistakes, retryCount } = useHangmanGame();
  const previous = useRef({ phase: state.phase, index: state.index, wrong: 0, guessed: 0 });

  // Sound + vibration per guess (prefilled letters at a word's start stay silent).
  useEffect(() => {
    const p = previous.current;
    const sameWord = p.phase === "playing" && state.phase !== "lobby" && p.index === state.index;
    if (sameWord && state.wrong > p.wrong) playFeedback("wrong");
    else if (sameWord && state.guessed.length > p.guessed) playFeedback("correct");
    if (state.phase === "over" && p.phase !== "over") playFeedback("finish");
    previous.current = { phase: state.phase, index: state.index, wrong: state.wrong, guessed: state.guessed.length };
  }, [state.phase, state.index, state.wrong, state.guessed.length]);

  return (
    <GameFrame
      title="Hangman"
      subtitle="SSC vocabulary & one-word substitutions"
      best={state.phase === "lobby" ? 0 : best}
    >
      {state.phase === "lobby" && <LobbyScreen best={best} onStart={start} />}

      {(state.phase === "playing" || state.phase === "reveal") && word && (
        <HangmanBoard state={state} word={word} onGuess={guess} onHint={hint} onNext={next} />
      )}

      {state.phase === "over" && (
        <ResultScreen
          state={state}
          best={best}
          isNewBest={isNewBest}
          onPlayAgain={start}
          onReplaySet={replaySet}
          onRetryMistakes={retryMistakes}
          retryCount={retryCount}
        />
      )}
    </GameFrame>
  );
}
