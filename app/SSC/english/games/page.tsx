"use client";

import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import SectionCardGrid from "@/components/custom/section-card/section-card-grid";
import { ENGLISH_GAMES } from "@/lib/games-catalog";

export default function EnglishGamesPage() {
  return (
    <TopicPageLayout
      title="English Games"
      description="Short, replayable games that make SSC vocabulary, spelling and word links stick."
    >
      <SectionCardGrid sections={ENGLISH_GAMES} />
    </TopicPageLayout>
  );
}
