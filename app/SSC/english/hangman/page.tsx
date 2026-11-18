"use client";

import { playFeedback } from "@/features/games/feedback";
import { useEffect, useRef, useState } from "react";
import { GameFrame } from "@/features/games/GameFrame";
import { usePause } from "@/features/games/usePause";
import { HangmanBoard } from "@/features/hangman/HangmanBoard";
import { LobbyScreen } from "@/features/hangman/LobbyScreen";
import { ResultScreen } from "@/features/hangman/ResultScreen";
import { useHangmanGame } from "@/features/hangman/useHangmanGame";
import { useWordBanks } from "@/features/games/wordBank";

export default function HangmanPage() {
  // The pause hook needs to know when a word is in play; the game reports it below.
  const [inPlay, setInPlay] = useState(false);
  const { paused, pause, resume } = usePause(inPlay);
  const { state, word, best, isNewBest, start, guess, hint, next, replaySet, retryMistakes, retryCount } = useHangmanGame({
    bank: useWordBanks().hangman,
    paused,
  });
  useEffect(() => {
    setInPlay(state.phase === "playing");
  }, [state.phase]);
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
      confirmExit={state.phase === "playing" || state.phase === "reveal"}
      pause={state.phase === "playing" ? { paused, onPause: pause, onResume: resume } : undefined}
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
