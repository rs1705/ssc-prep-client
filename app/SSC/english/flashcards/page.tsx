import SectionCardGrid from "@/components/custom/section-card/section-card-grid";
import { SectionCardProps } from "@/lib/types";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import React from "react";
import { Dices, BookOpen } from "lucide-react";

const sections: SectionCardProps[] = [
  {
    icon: <Dices className="w-8 h-8 text-violet-500 dark:text-violet-400" fill="currentColor" fillOpacity={0.1} />,
    title: "Freestyle Mode",
    description:
      "Flip and practice vocabulary words freely at your own speed with zero pressure and complete flexibility.",
    linkTo: "/SSC/english/flashcards/freestyle",
    knowMoreText:
      "1. Learn Your Way: No time limits, no deadlines. Flip through vocabulary flashcards whenever you have a few minutes.\n\n2. Focus on What Matters: Pick specific categories like Idioms, Vocabulary, or One Word Substitutions to study exactly what you need.\n\n3. Zero Pressure: Review words as many times as you want until you feel comfortable and they stick naturally.\n\nBest For:\n\n ▪️ Quick, last-minute revisions before exams ⚡\n\n    ▪️ Short, casual daily practice sessions on the go 📅\n\n    ▪️ Stress-free learning without score tracking 😌",
    buttonText: "Start Freestyle",
    colorTheme: "violet",
  },
  {
    icon: <BookOpen className="w-8 h-8 text-violet-500 dark:text-violet-400" fill="currentColor" fillOpacity={0.1} />,
    title: "Study Mode",
    description:
      "Utilize intelligent Spaced Repetition algorithms (FSRS) to automatically review weak items and lock in memories.",
    linkTo: "/SSC/english/flashcards/fsrs",
    knowMoreText:
      "1. Smart Memory Assistant: The app checks how well you know each word and automatically schedules when you need to see it next.\n\n2. Focus on Weak Words: Words you struggle to remember are shown frequently, while words you already know are hidden until you actually need to refresh them.\n\n3. Memorize 3x Faster: Instead of wasting hours reviewing words you already master, you focus 100% of your energy on your weak spots.\n\nBest For:\n\n ▪️ Locking vocabulary into your long-term memory 🧠\n\n    ▪️ High-efficiency, highly-focused study sessions ⏱️\n\n    ▪️ Watching your weak spots disappear day by day ✅",
    buttonText: "Start Study Mode",
    colorTheme: "violet",
  },
];

const FlashcardPage = () => {
  return (
    <TopicPageLayout
      title="Flashcards"
      description="Harness the cognitive science of active recall. Memorize synonyms, antonyms, and idioms effortlessly. Select your training mode to get started."
    >
      <SectionCardGrid sections={sections} />
    </TopicPageLayout>
  );
};

export default FlashcardPage;
