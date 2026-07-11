import { SectionCardProps } from "@/lib/types";
import SectionCardGrid from "@/components/custom/section-card/section-card-grid";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import React from "react";

const ReasoningHomePage = () => {
  const sections: SectionCardProps[] = [
    {
      icon: "🧩",
      title: "Logic Puzzles",
      description: "Master logical deduction and complex puzzle solving.",
      linkTo: "#",
      buttonText: "Coming Soon",
    },
    {
      icon: "🧠",
      title: "Analytical Reasoning",
      description: "Enhance your critical thinking and pattern recognition skills.",
      linkTo: "#",
      buttonText: "Coming Soon",
    },
    {
      icon: "🎲",
      title: "Spatial & Non-Verbal",
      description: "Practice visual reasoning, dice, and paper folding questions.",
      linkTo: "#",
      buttonText: "Coming Soon",
    },
    {
      icon: "🧾",
      title: "Mock Tests",
      description: "Attempt timed mock tests to simulate exam conditions.",
      linkTo: "#",
      buttonText: "Coming Soon",
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
