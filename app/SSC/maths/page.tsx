"use client";

import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import SectionCardGrid from "@/components/custom/section-card/section-card-grid";

import { SUBJECT_SECTIONS } from "@/lib/subject-data";

export default function MathsHomePage() {
  const sections = SUBJECT_SECTIONS.maths;

  return (
    <TopicPageLayout
      title="Mathematics"
      description="Master speed drills, arithmetic shortcuts, and mock tests designed to maximise your solving efficiency."
    >
      <SectionCardGrid sections={sections} />
    </TopicPageLayout>
  );
}
