"use client";

import { MatchGame } from "@/features/match/MatchGame";
import { MATHS_MATCH_DECKS } from "@/features/match/localDecks";

export default function MathsMatchPage() {
  return (
    <MatchGame
      decks={MATHS_MATCH_DECKS}
      title="Match the Pairs"
      blurb="Tap a number, then its partner. Squares, cubes, roots and fractions until they're instant."
      tone="maths"
      backHref="/SSC/maths"
      backLabel="Back to Quant"
      storagePrefix="ssc:maths-match"
    />
  );
}
