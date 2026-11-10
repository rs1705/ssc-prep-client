"use client";

import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import SectionCardGrid from "@/components/custom/section-card/section-card-grid";
import { ExamPatternStrip, SyllabusMap } from "@/components/custom/subject-overview";
import { SUBJECT_SECTIONS } from "@/lib/subject-data";
import { SUBJECT_LABEL, type SubjectKey } from "@/lib/subject-theme";

interface SubjectHomeProps {
  subject: SubjectKey;
  description: string;
}

/** Shared landing page for a subject: exam pattern, practice modes, syllabus. */
export function SubjectHome({ subject, description }: SubjectHomeProps) {
  const sections = SUBJECT_SECTIONS[subject];
  const live = sections.filter((s) => s.linkTo !== "#").length;

  return (
    <TopicPageLayout title={SUBJECT_LABEL[subject]} description={description}>
      <div className="flex w-full flex-col gap-8">
        <ExamPatternStrip subject={subject} />

        <section aria-labelledby={`modes-${subject}`} className="flex flex-col gap-3">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 id={`modes-${subject}`} className="text-lg font-extrabold text-foreground">
              Practice modes
            </h2>
            <p className="text-xs font-medium text-muted-foreground">
              {live > 0
                ? `${live} live · ${sections.length - live} coming soon`
                : "Coming soon"}
            </p>
          </div>
          <SectionCardGrid sections={sections} />
        </section>

        <SyllabusMap subject={subject} />
      </div>
    </TopicPageLayout>
  );
}
