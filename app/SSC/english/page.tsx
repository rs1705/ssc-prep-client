import SectionCardGrid from "@/components/custom/section-card/section-card-grid";
import { SectionCardProps } from "@/lib/types";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import React from "react";
import { Layers, Skull, Shuffle, Grid3X3 } from "lucide-react";

const EnglishHomePage = () => {
  const sections: SectionCardProps[] = [
    {
      icon: <Layers className="w-8 h-8 text-violet-500 dark:text-violet-400" fill="currentColor" fillOpacity={0.1} />,
      title: "Flashcards",
      description:
        "Optimize your vocabulary memory with smart spaced-repetition cards for high-frequency words.",
      linkTo: "/SSC/english/flashcards",
      buttonText: "Explore Flashcards",
      colorTheme: "violet",
    },
    {
      icon: <Skull className="w-8 h-8 text-violet-500 dark:text-violet-400" fill="currentColor" fillOpacity={0.1} />,
      title: "Hangman",
      description:
        "Uncover hidden exam terms, fix spelling mistakes, and build dynamic vocabulary retention.",
      linkTo: "#",
      buttonText: "Coming Soon",
      colorTheme: "violet",
    },
    {
      icon: <Shuffle className="w-8 h-8 text-violet-500 dark:text-violet-400" fill="currentColor" fillOpacity={0.1} />,
      title: " Word Shuffle",
      description:
        "Solve anagram scrambles and speed anagram challenges to trigger active recall memory.",
      linkTo: "#",
      buttonText: "Coming Soon",
      colorTheme: "violet",
    },
    {
      icon: <Grid3X3 className="w-8 h-8 text-violet-500 dark:text-violet-400" fill="currentColor" fillOpacity={0.1} />,
      title: "Crossword",
      description:
        "Crack word puzzle grids to test your contextual definitions and synonym associations.",
      linkTo: "#",
      buttonText: "Coming Soon",
      colorTheme: "sky",
    },
  ];

  return (
    <TopicPageLayout
      title="English"
      description="Train spelling and reading retention with flashcards, anagram shuffles, and word puzzles."
      contentMaxWidthClass="w-full max-w-[824px]"
    >
      <SectionCardGrid sections={sections} />
    </TopicPageLayout>
  );
};

export default EnglishHomePage;
