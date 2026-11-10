import type { FlashCardInterface } from "@/lib/types";
import type { FlashcardFilters } from "@/redux/FlashcardApiSlice";
import type { Pair } from "./game";

/** Which kind of pairs a Match run uses. Each is built from the flashcard database. */
export type MatchDeckId = "meanings" | "synonyms" | "antonyms" | "idioms" | "ows";

export interface MatchDeck {
  id: MatchDeckId;
  label: string;
  /** Column headings, shown above the tiles. */
  leftLabel: string;
  rightLabel: string;
  query: FlashcardFilters;
  toPair: (card: FlashCardInterface) => Pair | null;
}

/** Meanings can be long; keep the first clause so a tile stays readable. */
function shortMeaning(text: string): string {
  const first = text.split(/[;:]/)[0].trim().replace(/\.$/, "");
  return first.length > 70 ? `${first.slice(0, 67).trimEnd()}…` : first;
}

const word = (card: FlashCardInterface) => card.front.text.trim();

export const MATCH_DECKS: MatchDeck[] = [
  {
    id: "meanings",
    label: "Word → meaning",
    leftLabel: "Word",
    rightLabel: "Meaning",
    query: { type: "vocab", random: true, limit: 40 },
    toPair: (c) => ({ id: c._id, left: word(c), right: shortMeaning(c.back.content_eng) }),
  },
  {
    id: "synonyms",
    label: "Synonyms",
    leftLabel: "Word",
    rightLabel: "Synonym",
    query: { type: "vocab", random: true, limit: 40 },
    toPair: (c) => (c.back.synonyms?.[0] ? { id: c._id, left: word(c), right: c.back.synonyms[0].toLowerCase() } : null),
  },
  {
    id: "antonyms",
    label: "Antonyms",
    leftLabel: "Word",
    rightLabel: "Antonym",
    query: { type: "vocab", random: true, limit: 40 },
    toPair: (c) => (c.back.antonyms?.[0] ? { id: c._id, left: word(c), right: c.back.antonyms[0].toLowerCase() } : null),
  },
  {
    id: "idioms",
    label: "Idioms",
    leftLabel: "Idiom",
    rightLabel: "Meaning",
    query: { type: "idiom", random: true, limit: 45 },
    toPair: (c) => ({ id: c._id, left: word(c), right: shortMeaning(c.back.content_eng) }),
  },
  {
    id: "ows",
    label: "One-word substitution",
    leftLabel: "Word",
    rightLabel: "Definition",
    query: { type: "ows", random: true, limit: 40 },
    toPair: (c) => ({ id: c._id, left: word(c), right: shortMeaning(c.back.content_eng) }),
  },
];

export function deckById(id: string): MatchDeck {
  return MATCH_DECKS.find((d) => d.id === id) ?? MATCH_DECKS[0];
}
