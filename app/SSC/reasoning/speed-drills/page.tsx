"use client";

import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import SectionCardGrid from "@/components/custom/section-card/section-card-grid";
import { REASONING_DRILL_CARDS } from "@/features/reasoning-drills/drills";

export default function ReasoningDrillsPage() {
  return (
    <TopicPageLayout
      title="Reasoning Speed Drills"
      description="60-second drills for the patterns behind most reasoning questions: coding-decoding, alphabet tricks, series and analogies."
    >
      <SectionCardGrid sections={REASONING_DRILL_CARDS} />
    </TopicPageLayout>
  );
}
