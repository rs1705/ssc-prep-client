"use client";

import Link from "next/link";
import { ChevronRight, Clock, Lock, Target } from "lucide-react";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import ErrorState from "@/components/custom/error-state";
import { Loader } from "@/components/custom/loader";
import { SECTION_SECONDS } from "@/features/mock/examSession";
import { MARKS_CORRECT, MARKS_WRONG } from "@/features/pyq/session";
import { useSubjectParam } from "@/features/pyq/useSubjectParam";
import { SUBJECT_META } from "@/lib/exam-pattern";
import { subjectTheme } from "@/lib/subject-theme";
import { cn } from "@/lib/utils";
import { useGetPyqPapersQuery } from "@/redux/PyqApi";
import { AttemptList } from "@/features/mock/AttemptList";
import { useAttempts } from "@/features/mock/attempts";

function formatPaperDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
}

const MINUTES = SECTION_SECONDS / 60;

export default function SectionalPyqsPage() {
  const subject = useSubjectParam();
  const { data: papers, isLoading, isError, refetch } = useGetPyqPapersQuery(subject ?? "maths", { skip: !subject });
  const { attempts } = useAttempts((a) => a.kind === "section" && a.subject === subject);
  const best = new Map<string, { marks: number; max: number; count: number }>();
  for (const a of attempts) {
    if (!a.paperId) continue;
    const prev = best.get(a.paperId);
    best.set(a.paperId, { marks: Math.max(prev?.marks ?? -Infinity, a.marks), max: a.maxMarks, count: (prev?.count ?? 0) + 1 });
  }

  if (!subject) {
    return (
      <TopicPageLayout title="Sectional PYQs">
        <ErrorState title="Subject not found" description="Pick a subject from the menu to see its papers." />
      </TopicPageLayout>
    );
  }

  const theme = subjectTheme(subject);
  const section = SUBJECT_META[subject].paperSection;

  return (
    <TopicPageLayout
      title="Sectional PYQs"
      description={`Sit the ${section} section of a real SSC CGL Tier 1 paper in the exam interface. It opens full-screen.`}
    >
      <div className="flex w-full flex-col gap-6">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <Clock className="h-4 w-4" aria-hidden="true" />
            {MINUTES} minutes, as in the real exam
          </li>
          <li className="flex items-center gap-2">
            <Target className="h-4 w-4" aria-hidden="true" />+{MARKS_CORRECT} right, {MARKS_WRONG} wrong
          </li>
          <li className="flex items-center gap-2">
            <Lock className="h-4 w-4" aria-hidden="true" />
            Answers and explanations after you submit
          </li>
        </ul>

        {isLoading ? (
          <div className="flex min-h-[30dvh] items-center justify-center">
            <Loader size="lg" text="Loading papers" />
          </div>
        ) : isError || !papers ? (
          <ErrorState
            title="Couldn't load papers"
            description="The question bank didn't respond. Please try again in a moment."
            onRetry={refetch}
          />
        ) : papers.length === 0 ? (
          <ErrorState title="No papers yet" description="There are no past papers for this subject yet." />
        ) : (
          <ul className="surface-card divide-y-2 divide-border overflow-hidden rounded-3xl">
            {papers.map((p) => {
              const date = formatPaperDate(p.date);
              return (
                <li key={p.id}>
                  <Link
                    href={`/mock-tests/attempt?paper=${encodeURIComponent(p.id)}&section=${subject}`}
                    className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/60"
                  >
                    <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-mono text-sm font-black", theme.iconWrap)}>
                      {p.year}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold text-foreground">
                        {p.title} · {section}
                      </span>
                      <span className="block truncate text-sm text-muted-foreground">
                        {[date, p.shift, `${p.questionCount} questions`].filter(Boolean).join(" · ")}
                        {p.questionCount < 25 ? " (diagram questions left out)" : ""}
                      </span>
                    </span>
                    {best.has(p.id) && (
                      <span className="hidden shrink-0 rounded-md bg-muted px-2 py-1 font-mono text-xs font-bold text-muted-foreground sm:inline">
                        Best {best.get(p.id)!.marks}/{best.get(p.id)!.max}
                      </span>
                    )}
                    <span className="hidden text-sm font-bold text-brand-700 dark:text-brand-400 sm:inline">{best.has(p.id) ? "Retake" : "Start"}</span>
                    <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <AttemptList attempts={attempts} title={`Your ${section} attempts`} />
      </div>
    </TopicPageLayout>
  );
}
