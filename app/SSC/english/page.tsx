import SectionCardGrid from "@/components/custom/section-card/section-card-grid";
import { SectionCardProps } from "@/lib/types";
import React from "react";
const EnglishHomePage = () => {
  const sections: SectionCardProps[] = [
    {
      title: "Flashcards",
      description:
        "Revise important words quickly with flip-cards designed for smart memory recall.",
      linkTo: "/SSC/english/flashcards",
      buttonText: "Start Flashcards",
    },
    {
      title: "Hangman",
      description:
        "Guess hidden words, practice spelling, and strengthen vocabulary while having fun.",
      linkTo: "/SSC/english/hangman",
      buttonText: "Play Hangman",
    },
    {
      title: "Word Shuffle",
      description:
        "Unscramble mixed letters, build vocabulary, and improve quick-thinking skills instantly.",
      linkTo: "/SSC/english/word-shuffle",
      buttonText: "Play Shuffle",
    },
    {
      title: "Crossword",
      description:
        "Solve word puzzles to sharpen grammar, vocabulary, and problem-solving skills easily.",
      linkTo: "/SSC/english/crossword",
      buttonText: "Play Crossword",
    },
  ];

  return (
    <>
      <div className="text-center">
        <h1 className="text-5xl font-bold my-5">
          Master English with Smart Practice
        </h1>
        <p>
          Explore interactive tools and activities to boost your vocabulary,
          grammar, and comprehension for exam success.
        </p>
      </div>
      <br />
      <SectionCardGrid sections={sections} />
    </>
  );
};

export default EnglishHomePage;
