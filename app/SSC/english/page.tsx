"use client";

import { Layers, Skull, Shuffle, Grid3X3 } from "lucide-react";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import SectionCardGrid from "@/components/custom/section-card/section-card-grid";

import { SUBJECT_SECTIONS } from "@/lib/subject-data";

export default function EnglishHomePage() {
  const sections = SUBJECT_SECTIONS.english;

  return (
    <TopicPageLayout
      title="English"
      description="Sharpen your grammar, vocabulary, and comprehension with interactive tools."
    >
      <SectionCardGrid sections={sections} />
    </TopicPageLayout>
  );
}
