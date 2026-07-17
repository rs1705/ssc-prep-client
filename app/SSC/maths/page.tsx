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
        "Train your brain with gamified timed arithmetic drills to solve calculations with lightning speed.",
      linkTo: "/SSC/maths/mental-maths",
      buttonText: "Explore Speed Math",
      colorTheme: "emerald",
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-emerald-500 dark:text-emerald-400" fill="currentColor" fillOpacity={0.1} />,
      title: "Formulas & Tricks",
      description:
        "Master shortcut techniques, digital sum concepts, and Vedic math tricks to cut equations solving time in half.",
      linkTo: "#",
      buttonText: "Coming Soon",
      colorTheme: "emerald",
    },
    {
      icon: <Target className="w-8 h-8 text-emerald-500 dark:text-emerald-400" fill="currentColor" fillOpacity={0.1} />,
      title: "Topic Practice",
      description:
        "Drill down into chapter-wise questions sorted by difficulty, covering everything from Algebra to Geometry.",
      linkTo: "#",
      buttonText: "Coming Soon",
      colorTheme: "emerald",
    },
    {
      icon: <ClipboardList className="w-8 h-8 text-emerald-500 dark:text-emerald-400" fill="currentColor" fillOpacity={0.1} />,
      title: "Mock Tests",
      description:
        "Practice full-length exam simulations with detailed performance diagnostics and section-by-section breakdown.",
      linkTo: "#",
      buttonText: "Coming Soon",
      colorTheme: "emerald",
    },
  ];
  return (
    <TopicPageLayout
      title="Mathematics"
      description="Master speed drills, arithmetic shortcuts, and mock tests designed to maximize solving efficiency."
      contentMaxWidthClass="w-full max-w-[824px]"
    >
      <SectionCardGrid sections={sections} />
    </TopicPageLayout>
  );
};

export default MathsHomePage;
