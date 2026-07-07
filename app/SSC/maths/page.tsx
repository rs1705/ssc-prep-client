import { SectionCardProps } from "@/lib/types";
import SectionCardGrid from "@/components/custom/section-card/section-card-grid";
import React from "react";

const MathsHomePage = () => {
  const sections: SectionCardProps[] = [
    {
      icon: "📐",
      title: "Mental Maths",
      description:
        "Improve your calculation speed with timed sprints.",
      linkTo: "#",
      buttonText: "Coming Soon",
    },
    {
      icon: "💡",
      title: "Formulas & Tricks",
      description:
        "Learn and practice key formulas and shortcut tricks to solve problems faster.",
      linkTo: "#",
      buttonText: "Coming Soon",
    },
    {
      icon: "🎯",
      title: "Topic Practice",
      description:
        "Practice chapter-wise questions to master each topic.",
      linkTo: "#",
      buttonText: "Coming Soon",
    },
    {
      icon: "🧾",
      title: "Mock Tests",
      description:
        "Attempt timed mock tests to simulate exam conditions and track your progress.",
      linkTo: "#",
      buttonText: "Coming Soon",
    },
  ];
  return (
    <>
      <div className="text-center mb-8 max-w-2xl mx-auto">

        <h1 className="text-4xl text-center font-bold mb-4 tracking-tight">
          Master Mathematics with Smart Practice
        </h1>
        <p className="text-center text-lg text-slate-500 dark:text-slate-400">
          Think you&apos;re fast? Prove it. Drop the calculator, beat the clock, and leave the competition calculating their losses.
        </p>
      </div>
      <div className="w-full md:w-[calc(70%+1.25rem)] lg:w-[calc(70%+1.25rem)] mx-auto text-left">
        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full">
          SSC Maths
        </span>
      </div>
      <SectionCardGrid sections={sections} />
    </>
  );
};

export default MathsHomePage;
