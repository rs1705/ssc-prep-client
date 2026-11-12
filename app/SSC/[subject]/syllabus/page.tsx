"use client";

import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import ErrorState from "@/components/custom/error-state";
import { ExamPatternStrip, SyllabusMap } from "@/components/custom/subject-overview";
import { useSubjectParam } from "@/features/pyq/useSubjectParam";
import { SUBJECT_LABEL } from "@/lib/subject-theme";

/** Exam pattern and syllabus for one subject (moved off the subject page to keep it short). */
export default function SyllabusPage() {
  const subject = useSubjectParam();
  if (!subject) {
    return (
      <TopicPageLayout title="Syllabus">
        <ErrorState title="Subject not found" description="Pick a subject from the menu to see its syllabus." />
      </TopicPageLayout>
    );
  }
  return (
    <TopicPageLayout
      title={`${SUBJECT_LABEL[subject]} syllabus`}
      description="What this section of SSC CGL Tier 1 covers, and how it is marked."
    >
      <div className="flex w-full flex-col gap-6 sm:gap-8">
        <ExamPatternStrip subject={subject} />
        <SyllabusMap subject={subject} />
      </div>
    </TopicPageLayout>
  );
}
