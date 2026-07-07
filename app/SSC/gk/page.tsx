import { SectionCardProps } from "@/lib/types";
import SectionCardGrid from "@/components/custom/section-card/section-card-grid";
import React from "react";

const GKHomePage = () => {
  const sections: SectionCardProps[] = [
    {
      icon: "📰",
      title: "Current Affairs",
      description: "Stay updated with daily and monthly national and international news.",
      linkTo: "#",
      buttonText: "Coming Soon",
    },
    {
      icon: "🏛️",
      title: "History & Polity",
      description: "Master important historical events and constitutional frameworks.",
      linkTo: "#",
      buttonText: "Coming Soon",
    },
    {
      icon: "🔬",
      title: "General Science",
      description: "Review essential concepts in Physics, Chemistry, and Biology.",
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
          General Knowledge
        </h1>
        <p className="text-center text-lg text-slate-500 dark:text-slate-400">
          Knowledge is power. Build a massive factual arsenal to conquer the highest-scoring section of the exam in record time.
        </p>
      </div>
     
      <SectionCardGrid sections={sections} />
    </>
  );
};

export default GKHomePage;
