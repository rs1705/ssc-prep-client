import SectionCardGrid from "@/components/custom/section-card/section-card-grid";
import { SectionCardProps } from "@/lib/types";
import React from "react";
const EnglishHomePage = () => {
  const sections: SectionCardProps[] = [
    {
      icon: "🎴",
      title: "Flashcards",
      description:
        "Revise important words quickly with flip-cards designed for smart memory recall.",
      linkTo: "/SSC/english/flashcards",
      buttonText: "Start Flashcards",
    },
    {
      "icon": "☠️",
      title: "Hangman",
      description:
        "Guess hidden words, practice spelling, and strengthen vocabulary while having fun.",
      linkTo: "#",
      buttonText: "Coming Soon",
    },
    {
      icon: "🔀",
      title: " Word Shuffle",
      description:
        "Unscramble mixed letters, build vocabulary, and improve quick-thinking skills instantly.",
      linkTo: "#",
      buttonText: "Coming Soon",
    },
    {
      "icon": "🧠",
      title: "Crossword",
      description:
        "Solve word puzzles to sharpen grammar, vocabulary, and problem-solving skills easily.",
      linkTo: "#",
      buttonText: "Coming Soon",
    },
  ];

  return (
    <>
      <div className="text-center mb-8 max-w-2xl mx-auto">
        <h1 className="text-4xl text-center font-bold mb-4 tracking-tight">
          English
        </h1>
        <p className="text-center text-lg text-slate-500 dark:text-slate-400">
          Explore interactive tools and activities to boost your vocabulary, grammar, and comprehension for exam success.
        </p>
      </div>

      <SectionCardGrid sections={sections} />
    </>
  );
};

export default EnglishHomePage;
