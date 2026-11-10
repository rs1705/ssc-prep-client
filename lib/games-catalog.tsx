import { CalendarDays, Link2, Puzzle, Skull, SpellCheck, TextCursorInput } from "lucide-react";
import type { SectionCardProps } from "@/components/custom/section-card/section-card";
import { SUBJECT_HUE } from "@/lib/subject-theme";

/** Every English game, in the order shown on the Games hub. */
export const ENGLISH_GAMES: SectionCardProps[] = [
  {
    title: "Match the Following",
    description: "Tap a word, then its meaning, synonym or antonym. Five pairs a round, against the clock.",
    icon: <Puzzle className="w-5 h-5" strokeWidth={2} />,
    buttonText: "Play",
    meta: "5 decks · 90 seconds",
    linkTo: "/SSC/english/games/match-the-following",
    colorTheme: SUBJECT_HUE.english,
  },
  {
    title: "Fill in the Blanks",
    description: "Real example sentences with the word missing. Pick the one that fits, then see its meaning.",
    icon: <TextCursorInput className="w-5 h-5" strokeWidth={2} />,
    buttonText: "Play",
    meta: "10 sentences · no clock",
    linkTo: "/SSC/english/games/fill-in-the-blanks",
    colorTheme: SUBJECT_HUE.english,
  },
  {
    title: "Hangman",
    description: "Guess SSC vocabulary from its meaning. 10 words, 3 hearts, combos for clean solves.",
    icon: <Skull className="w-5 h-5" strokeWidth={2} />,
    buttonText: "Play",
    meta: "10 words · about 3 min",
    linkTo: "/SSC/english/hangman",
    colorTheme: SUBJECT_HUE.english,
  },
  {
    title: "Odd Link",
    description: "Words appear one by one. Spot what connects them before you run out of clues.",
    icon: <Link2 className="w-5 h-5" strokeWidth={2} />,
    buttonText: "Play",
    meta: "6 puzzles · about 2 min",
    linkTo: "/SSC/english/games/odd-link",
    colorTheme: SUBJECT_HUE.english,
  },
  {
    title: "Word of the Day",
    description: "One new 5-letter word every day. Six tries, a streak to protect, then bonus words.",
    icon: <CalendarDays className="w-5 h-5" strokeWidth={2} />,
    buttonText: "Play",
    meta: "1 new word every day",
    linkTo: "/SSC/english/games/word-of-the-day",
    colorTheme: SUBJECT_HUE.english,
  },
  {
    title: "Spelling Check",
    description: "60 seconds, four spellings, one is right. Build a streak and beat your best.",
    icon: <SpellCheck className="w-5 h-5" strokeWidth={2} />,
    buttonText: "Play",
    meta: "60 seconds",
    linkTo: "/SSC/english/games/spelling-sprint",
    colorTheme: SUBJECT_HUE.english,
  },
];
