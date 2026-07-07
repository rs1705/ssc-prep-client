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
      <div className="text-center mb-8 max-w-2xl mx-auto mt-8">
        <h1 className="text-4xl text-center font-bold mb-4 tracking-tight">
          Sharpen Your Logical Reasoning
        </h1>
        <p className="text-center text-lg text-slate-500 dark:text-slate-400">
          Crack the code behind complex patterns. Train your brain to see what others miss and solve puzzles with blazing speed.
        </p>
      </div>
      <div className="w-full md:w-[calc(70%+1.25rem)] lg:w-[calc(70%+1.25rem)] mx-auto text-left">
        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full">
          SSC Reasoning
        </span>
      </div>
      <SectionCardGrid sections={sections} />
    </>
  );
};

export default ReasoningHomePage;
