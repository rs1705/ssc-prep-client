import { CalendarDays, Link2, Skull, SpellCheck } from "lucide-react";
import type { SectionCardProps } from "@/components/custom/section-card/section-card";
import { SUBJECT_HUE } from "@/lib/subject-theme";

/** Every English game, in the order shown on the Games hub. */
export const ENGLISH_GAMES: SectionCardProps[] = [
  {
    title: "Hangman Sprint",
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
    title: "Spelling Sprint",
    description: "60 seconds, four spellings, one is right. Build a streak and beat your best.",
    icon: <SpellCheck className="w-5 h-5" strokeWidth={2} />,
    buttonText: "Play",
    meta: "60 seconds",
    linkTo: "/SSC/english/games/spelling-sprint",
    colorTheme: SUBJECT_HUE.english,
  },
];
