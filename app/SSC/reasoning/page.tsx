import { SectionCardProps } from "@/lib/types";
import SectionCardGrid from "@/components/custom/section-card/section-card-grid";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import React from "react";
import { Puzzle, Brain, Layers3, ClipboardList } from "lucide-react";

const ReasoningHomePage = () => {
  const sections: SectionCardProps[] = [
    {
      icon: <Puzzle className="w-8 h-8 text-amber-500 dark:text-amber-400" fill="currentColor" fillOpacity={0.1} />,
      title: "Logic Puzzles",
      description: "Master logical deduction and complex puzzle solving.",
      linkTo: "#",
      buttonText: "Coming Soon",
      colorTheme: "amber",
    },
    {
      icon: <Brain className="w-8 h-8 text-amber-500 dark:text-amber-400" fill="currentColor" fillOpacity={0.1} />,
      title: "Analytical Reasoning",
      description: "Enhance your critical thinking and pattern recognition skills.",
      linkTo: "#",
      buttonText: "Coming Soon",
      colorTheme: "amber",
    },
    {
      icon: <Layers3 className="w-8 h-8 text-amber-500 dark:text-amber-400" fill="currentColor" fillOpacity={0.1} />,
      title: "Spatial & Non-Verbal",
      description: "Practice visual reasoning, dice, and paper folding questions.",
      linkTo: "#",
      buttonText: "Coming Soon",
      colorTheme: "amber",
    },
    {
      icon: <ClipboardList className="w-8 h-8 text-amber-500 dark:text-amber-400" fill="currentColor" fillOpacity={0.1} />,
      title: "Mock Tests",
      description: "Attempt timed mock tests to simulate exam conditions.",
      linkTo: "#",
      buttonText: "Coming Soon",
      colorTheme: "amber",
    },
  ];
  return (
    <TopicPageLayout
      title="Reasoning"
      description="Crack the code behind complex patterns. Train your brain to see what others miss and solve puzzles with blazing speed."
      contentMaxWidthClass="w-full max-w-[824px]"
    >
      <SectionCardGrid sections={sections} />
    </TopicPageLayout>
  );
};

export default ReasoningHomePage;
