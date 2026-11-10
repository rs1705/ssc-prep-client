"use client";

import { GameFrame } from "@/features/games/GameFrame";
import { HangmanBoard } from "@/features/hangman/HangmanBoard";
import { LobbyScreen } from "@/features/hangman/LobbyScreen";
import { ResultScreen } from "@/features/hangman/ResultScreen";
import { useHangmanGame } from "@/features/hangman/useHangmanGame";

export default function HangmanPage() {
  const { state, word, best, isNewBest, start, guess, hint, next } = useHangmanGame();

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
        <ResultScreen state={state} best={best} isNewBest={isNewBest} onPlayAgain={start} />
      )}
    </GameFrame>
  );
}
