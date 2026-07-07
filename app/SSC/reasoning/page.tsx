import { SectionCardProps } from "@/lib/types";
import SectionCardGrid from "@/components/custom/section-card/section-card-grid";
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
    <>
      <div className="text-center mb-8 max-w-2xl mx-auto">
        <h1 className="text-4xl text-center font-bold mb-4 tracking-tight">
          Reasoning
        </h1>
        <p className="text-center text-lg text-slate-500 dark:text-slate-400">
          Crack the code behind complex patterns. Train your brain to see what others miss and solve puzzles with blazing speed.
        </p>
      </div>

      <SectionCardGrid sections={sections} />
    </>
  );
};

export default ReasoningHomePage;
