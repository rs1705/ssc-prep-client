import SectionCardGrid from "@/components/custom/section-card/section-card-grid";
import { SectionCardProps } from "@/lib/types";
import React from "react";

const sections: SectionCardProps[] = [
  {
    title: "Freestyle Mode🕺🏼",
    description:
      "Learn at your own pace and enjoy flashcards your way. No schedules, no pressure—just flip, revise, and have fun!",
    linkTo: "/SSC/english/flashcards/freestyle",
    knowMoreText:
      "1. Explore flashcards freely, at your own pace, without any schedules or deadlines, and learn in a way that suits you best.\n\n2. Choose from a wide range of categories—Idioms, Synonyms, Antonyms, or Vocabulary—and focus on what interests you most.\n\n3. Flip through cards as much as you like, review concepts casually, and reinforce your memory naturally.\n\nGreat for:\n\n ▪️ Quick exam revision ⚡\n\n    ▪️ Daily bite-sized practice 📅\n\n    ▪️ Stress-free, no-pressure learning 😌",
    buttonText: "Practice freestyle",
  },
  {
    title: "Leitner Mode 🗂️",
    description:
      "Boost your memory with smart spaced repetition.\nFocus on what matters most and make your study time truly effective!",
    linkTo: "/SSC/english/flashcards/leitner",
    knowMoreText:
      "1. Master concepts efficiently with the Leitner system—smart spaced repetition that boosts memory retention.\n\n2. Cards are organized into boxes based on how well you know them, so you focus on what needs practice most.\n\n3. Review difficult cards more often, while mastered cards appear less frequently, saving your time and effort.\n\nGreat for:\n\n ▪️ Retaining important concepts for the long term 🧠\n\n    ▪️ Time-efficient, focused study sessions ⏱️\n\n    ▪️ Tracking your progress and improving weak areas continuously ✅",
    buttonText: "Practice leitner",
  },
];

const FlashcardPage = () => {
  return (
    <div>
      <div className="my-5 text-center">
        <h2 className="text-center text-4xl font-bold">🎴Flashcards🎴</h2>
        <br />
        <p className="text-gray-600">
          Flashcards are a simple and effective way to learn and remember words,
          idioms, synonyms, and more. Pick the mode that suits you the best.
        </p>
      </div>
      <div>
        <SectionCardGrid sections={sections} />
      </div>
    </div>
  );
};

export default FlashcardPage;
