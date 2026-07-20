import { SectionCardProps } from "@/components/custom/section-card/section-card";
import SectionCardGrid from "@/components/custom/section-card/section-card-grid";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import React from "react";
import { Newspaper, Landmark, FlaskConical, ClipboardList } from "lucide-react";

import { SUBJECT_SECTIONS } from "@/lib/subject-data";

const GKHomePage = () => {
  const sections = SUBJECT_SECTIONS.gk;
  return (
    <TopicPageLayout
      title="General Knowledge"
      description="Conquer current affairs and static facts across history, polity, and science with active quizzes."
    >
      <SectionCardGrid sections={sections} />
    </TopicPageLayout>
  );
};

export default GKHomePage;
