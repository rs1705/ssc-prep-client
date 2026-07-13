import { SectionCardProps } from "@/lib/types";
import SectionCardGrid from "@/components/custom/section-card/section-card-grid";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import React from "react";
import { Newspaper, Landmark, FlaskConical, ClipboardList } from "lucide-react";

const GKHomePage = () => {
  const sections: SectionCardProps[] = [
    {
      icon: <Newspaper className="w-8 h-8 text-rose-500 dark:text-rose-400" fill="currentColor" fillOpacity={0.1} />,
      title: "Current Affairs",
      description: "Stay updated with daily and monthly national and international news.",
      linkTo: "#",
      buttonText: "Coming Soon",
      colorTheme: "rose",
    },
    {
      icon: <Landmark className="w-8 h-8 text-rose-500 dark:text-rose-400" fill="currentColor" fillOpacity={0.1} />,
      title: "History & Polity",
      description: "Master important historical events and constitutional frameworks.",
      linkTo: "#",
      buttonText: "Coming Soon",
      colorTheme: "rose",
    },
    {
      icon: <FlaskConical className="w-8 h-8 text-rose-500 dark:text-rose-400" fill="currentColor" fillOpacity={0.1} />,
      title: "General Science",
      description: "Review essential concepts in Physics, Chemistry, and Biology.",
      linkTo: "#",
      buttonText: "Coming Soon",
      colorTheme: "rose",
    },
    {
      icon: <ClipboardList className="w-8 h-8 text-rose-500 dark:text-rose-400" fill="currentColor" fillOpacity={0.1} />,
      title: "Mock Tests",
      description: "Attempt timed mock tests to simulate exam conditions.",
      linkTo: "#",
      buttonText: "Coming Soon",
      colorTheme: "rose",
    },
  ];
  return (
    <TopicPageLayout
      title="General Knowledge"
      description="Knowledge is power. Build a massive factual arsenal to conquer the highest-scoring section of the exam in record time."
      contentMaxWidthClass="w-full max-w-[824px]"
    >
      <SectionCardGrid sections={sections} />
    </TopicPageLayout>
  );
};

export default GKHomePage;
