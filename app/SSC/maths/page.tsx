import { SectionCardProps } from "@/lib/types";
import SectionCardGrid from "@/components/custom/section-card/section-card-grid";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import React from "react";

const MathsHomePage = () => {
  const sections: SectionCardProps[] = [
    {
      icon: "📐",
      title: "Mental Maths",
      description:
        "Improve your calculation speed with timed sprints.",
      linkTo: "/SSC/maths/mental-maths",
      buttonText: "Start",
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
