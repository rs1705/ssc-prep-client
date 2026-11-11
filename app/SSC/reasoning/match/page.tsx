"use client";

import { MatchGame } from "@/features/match/MatchGame";
import { REASONING_MATCH_DECKS } from "@/features/match/localDecks";

export default function ReasoningMatchPage() {
  return (
    <MatchGame
      decks={REASONING_MATCH_DECKS}
      title="Match the Pairs"
      blurb="Tap a letter, then its partner. Positions and opposites are behind most coding questions."
      tone="reasoning"
      backHref="/SSC/reasoning"
      backLabel="Back to Reasoning"
      storagePrefix="ssc:reasoning-match"
    />
  );
}
