"use client";

import { useState } from "react";
import { ArrowRight, CircleMinus, Clock, FileText, Target } from "lucide-react";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import ErrorState from "@/components/custom/error-state";
import { Loader } from "@/components/custom/loader";
import { Button } from "@/components/ui/button";
import { PyqRunner } from "@/features/pyq/PyqRunner";
import { MARKS_CORRECT, MARKS_WRONG } from "@/features/pyq/session";
import { useSubjectParam } from "@/features/pyq/useSubjectParam";
import { SUBJECT_META } from "@/lib/exam-pattern";
import { subjectTheme } from "@/lib/subject-theme";
import {
  useGetPyqPapersQuery,
  useLazyGetSectionalPaperQuery,
  type SectionalPaper,
} from "@/redux/PyqApi";

function formatPaperDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function SectionalPyqsPage() {
  const subject = useSubjectParam();
  const { data: papers, isLoading, isError, refetch } = useGetPyqPapersQuery(subject ?? "maths", {
    skip: !subject,
  });
  const [fetchPaper, { isFetching: isLoadingPaper, isError: isPaperError }] =
    useLazyGetSectionalPaperQuery();
  const [paper, setPaper] = useState<SectionalPaper | null>(null);
  const [started, setStarted] = useState(false);
  const [attempt, setAttempt] = useState(0);

  if (!subject) {
    return (
      <TopicPageLayout title="Sectional PYQs">
        <ErrorState title="Subject not found" description="Pick a subject from the menu to see its papers." />
      </TopicPageLayout>
    );
  }

  const theme = subjectTheme(subject);
  const section = SUBJECT_META[subject].paperSection;

  const open = async (paperId: string) => {
    const result = await fetchPaper({ paperId, subject }, true);
    if (result.data) {
      setPaper(result.data);
      setStarted(false);
    }
  };

  if (paper && started) {
    return (
      <TopicPageLayout hideBreadcrumbs>
        <PyqRunner
          key={`${paper.id}-${attempt}`}
          subject={subject}
          mode="test"
          title={`${section} · ${paper.title}`}
          questions={paper.questions}
          durationSeconds={paper.durationSeconds}
          restartLabel="Retake this section"
          onRestart={() => setAttempt((n) => n + 1)}
          onExit={() => {
            setPaper(null);
            setStarted(false);
          }}
        />
      </TopicPageLayout>
    );
  }

  if (paper) {
    const minutes = Math.round(paper.durationSeconds / 60);
    const rules = [
      { icon: FileText, value: String(paper.questionCount), label: "Questions" },
      { icon: Clock, value: `${minutes} min`, label: "On the clock" },
      { icon: Target, value: `+${MARKS_CORRECT}`, label: "Per correct" },
      { icon: CircleMinus, value: String(MARKS_WRONG), label: "Per wrong" },
    ];
    return (
      <TopicPageLayout title="Before you start" description={`${section} · ${paper.title}${paper.shift ? ` · ${paper.shift}` : ""}`}>
        <div className={`flex w-full max-w-3xl flex-col gap-5 rounded-3xl border-2 bg-gradient-to-br p-5 sm:p-6 ${theme.banner}`}>
          <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {rules.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col gap-1 rounded-2xl border-2 border-border bg-card px-3.5 py-3">
                <Icon className={`h-4 w-4 ${theme.text}`} aria-hidden="true" />
                <dd className="font-mono text-lg font-black tabular-nums leading-none text-foreground">{value}</dd>
                <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
              </div>
            ))}
          </dl>
          <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-foreground/90">
            <li>The clock starts as soon as you begin and the test submits itself when time runs out.</li>
            <li>You can change or clear an answer any time before you submit.</li>
            <li>Answers and explanations are shown only after you submit.</li>
            {paper.questionCount < 25 && (
              <li>
                This section has {paper.questionCount} of 25 questions here. Questions that need a
                figure are left out for now.
              </li>
            )}
          </ul>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              autoFocus
              onClick={() => setStarted(true)}
              className="h-12 gap-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-alt-500 px-7 text-sm font-bold text-white"
            >
              Start test
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button type="button" variant="outline" onClick={() => setPaper(null)} className="h-12 rounded-full px-7 text-sm font-bold">
              Choose another paper
            </Button>
          </div>
        </div>
      </TopicPageLayout>
    );
  }

  return (
    <TopicPageLayout
      title="Sectional PYQs"
      description={`Sit the ${section} section of a real SSC CGL Tier 1 paper against the clock, with exam marking.`}
    >
      {isLoading ? (
        <div className="flex min-h-[40dvh] items-center justify-center">
          <Loader size="lg" text="Loading papers" />
        </div>
      ) : isError || !papers ? (
        <ErrorState
          title="Couldn't load papers"
          description="The question bank didn't respond. Check that the server is running and try again."
          onRetry={refetch}
        />
      ) : papers.length === 0 ? (
        <ErrorState title="No papers yet" description="There are no past papers for this subject yet." />
      ) : (
        <div className="flex w-full flex-col gap-3">
          {isPaperError && (
            <p role="alert" className="text-sm font-semibold text-rose-700 dark:text-rose-300">
              Couldn&apos;t open that paper. Please try again.
            </p>
          )}
          <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {papers.map((p) => {
              const date = formatPaperDate(p.date);
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    disabled={isLoadingPaper}
                    onClick={() => open(p.id)}
                    className={`surface-card group flex h-full w-full flex-col gap-4 rounded-3xl p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 sm:flex-row sm:items-center ${theme.hoverBorder}`}
                  >
                    <span className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl font-mono ring-1 ring-border/60 ${theme.iconWrap}`}>
                      <span className="text-xs font-bold uppercase leading-none opacity-80">CGL</span>
                      <span className="text-base font-black leading-tight">{p.year}</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-extrabold text-foreground">{p.title}</span>
                      <span className="block text-sm text-muted-foreground">
                        {[date, p.shift].filter(Boolean).join(" · ")}
                      </span>
                      <span className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs font-bold text-muted-foreground">
                        <span>{p.questionCount} questions</span>
                        <span>{Math.round((p.questionCount * 36) / 60)} min</span>
                        <span>{p.questionCount * MARKS_CORRECT} marks</span>
                      </span>
                    </span>
                    <span className="inline-flex h-10 shrink-0 items-center gap-1.5 self-start rounded-full bg-gradient-to-r from-brand-500 to-brand-alt-500 px-5 text-xs font-bold uppercase tracking-wider text-white sm:self-center">
                      Open
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </TopicPageLayout>
  );
}
