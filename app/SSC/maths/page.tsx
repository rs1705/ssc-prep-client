import { SectionCardProps } from "@/lib/types";
import SectionCardGrid from "@/components/custom/section-card/section-card-grid";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import React from "react";
import { Zap, Lightbulb, Target, ClipboardList } from "lucide-react";

const MathsHomePage = () => {
  const sections: SectionCardProps[] = [
    {
      icon: <Zap className="w-8 h-8 text-emerald-500 dark:text-emerald-400" fill="currentColor" fillOpacity={0.1} />,
      title: "Speed Math",
      description:
        "Ditch the calculator. Train your brain with gamified timed arithmetic drills to solve core calculations with lightning speed.",
      linkTo: "/SSC/maths/mental-maths",
      buttonText: "Explore Speed Math",
      colorTheme: "emerald",
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-emerald-500 dark:text-emerald-400" fill="currentColor" fillOpacity={0.1} />,
      title: "Formulas & Tricks",
      description:
        "Slay complex equations. Master shortcut techniques, digital sum concepts, and Vedic math tricks to cut solving time in half.",
      linkTo: "#",
      buttonText: "Coming Soon",
      colorTheme: "emerald",
    },
    {
      icon: <Target className="w-8 h-8 text-emerald-500 dark:text-emerald-400" fill="currentColor" fillOpacity={0.1} />,
      title: "Topic Practice",
      description:
        "Build muscle memory. Drill down into chapter-wise questions sorted by difficulty, covering everything from Algebra to Geometry.",
      linkTo: "#",
      buttonText: "Coming Soon",
      colorTheme: "emerald",
    },
    {
      icon: <ClipboardList className="w-8 h-8 text-emerald-500 dark:text-emerald-400" fill="currentColor" fillOpacity={0.1} />,
      title: "Mock Tests",
      description:
        "Simulate the pressure. Practice full-length exam simulations with detailed performance diagnostics and section-by-section breakdown.",
      linkTo: "#",
      buttonText: "Coming Soon",
      colorTheme: "emerald",
    },
  ];
  return (
    <TopicPageLayout
      title="Mathematics"
      description="Think you're fast? Prove it. Drop the calculator, beat the clock, and leave the competition calculating their losses."
      contentMaxWidthClass="w-full max-w-[824px]"
    >
      <SectionCardGrid sections={sections} />
    </TopicPageLayout>
  );
};

export default MathsHomePage;
