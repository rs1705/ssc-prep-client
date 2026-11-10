"use client";

import { Flame, Heart, Timer } from "lucide-react";
import { GameLobby } from "@/features/games/GameLobby";
import { LIVES, MAX_STRIKES, WORDS_PER_RUN } from "./game";
import { HangmanFigure } from "./HangmanFigure";

interface LobbyScreenProps {
  best: number;
  onStart: () => void;
}

const RULES = [
  { icon: Timer, text: `${WORDS_PER_RUN} words · about 3 minutes` },
  { icon: Heart, text: `${LIVES} hearts. Lose a word (${MAX_STRIKES} strikes or time out) and one is gone` },
  { icon: Flame, text: "Solve with no mistakes to build a score combo up to x2" },
];

export function LobbyScreen({ best, onStart }: LobbyScreenProps) {
  return (
    <GameLobby
      hero={<HangmanFigure strikes={4} />}
      title="Hangman"
      blurb="Guess the SSC word from its meaning. The first letter (and the last, for long words) is given."
      rules={RULES}
      best={best}
      onStart={onStart}
    />
  );
}
