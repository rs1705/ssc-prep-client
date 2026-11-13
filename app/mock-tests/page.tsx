"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight, Clock, FileText, Lock, Shuffle } from "lucide-react";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import ErrorState from "@/components/custom/error-state";
import { SECTION_SECONDS } from "@/features/mock/examSession";
import { BTN } from "@/features/mock/MockRunner";
import { AttemptList } from "@/features/mock/AttemptList";
import { useAttempts } from "@/features/mock/attempts";
import { MARKS_CORRECT, MARKS_WRONG } from "@/features/pyq/session";
import { SUBJECT_LABEL, subjectTheme, type SubjectKey } from "@/lib/subject-theme";
import { cn } from "@/lib/utils";
import { useGetMockPapersQuery } from "@/redux/PyqApi";

/** Tier 1 order. */
const SECTIONS: SubjectKey[] = ["reasoning", "gk", "maths", "english"];
const MINUTES = SECTION_SECONDS / 60;

const attemptHref = (paper: string) => `/mock-tests/attempt?paper=${encodeURIComponent(paper)}`;

export default function MockTestsPage() {
  const { data: papers, isLoading, isError, refetch } = useGetMockPapersQuery();
  const { attempts } = useAttempts((a) => a.kind !== "section");
  const bestByPaper = new Map<string, number>();
  for (const a of attempts) if (a.paperId) bestByPaper.set(a.paperId, Math.max(bestByPaper.get(a.paperId) ?? -Infinity, a.marks));

  return (
    <TopicPageLayout
      title="Mock tests"
      description="Full SSC CGL Tier 1 papers in the new exam interface. The test opens full-screen."
    >
      <div className="flex w-full flex-col gap-8">
        {/* Fresh mock */}
        <section aria-labelledby="new-mock" className="surface-card overflow-hidden rounded-3xl">
          <div className="flex flex-col gap-6 p-5 sm:p-7 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[color-mix(in_oklab,var(--brand-500)_12%,var(--card))] text-brand-600 dark:text-brand-400">
                <Shuffle className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <h2 id="new-mock" className="text-xl font-extrabold text-foreground">
                  Full mock test
                </h2>
                <p className="mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">
                  100 real previous-year questions, picked fresh from every paper each time you start.
                </p>
              </div>
            </div>
            <Link href={attemptHref("new")} className={cn(BTN.primary, "h-11 shrink-0 px-6")}>
              Start mock
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {/* The pattern, as the exam runs it */}
          <ol className="grid grid-cols-2 border-t-2 border-border sm:grid-cols-4">
            {SECTIONS.map((s, i) => (
              <li
                key={s}
                className={cn(
                  "flex flex-col gap-1 px-5 py-4",
                  i % 2 === 1 && "border-l-2 border-border",
                  i >= 2 && "border-t-2 border-border sm:border-t-0",
                  i === 2 && "sm:border-l-2",
                )}
              >
                <span className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <span className={cn("h-2 w-2 rounded-full", subjectTheme(s).dot)} aria-hidden="true" />
                  {s === "gk" ? "General Awareness" : SUBJECT_LABEL[s]}
                </span>
                <span className="text-xs text-muted-foreground">
                  Section {i + 1} · 25 Qs · {MINUTES} min
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* Rules */}
        <ul className="-mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <Clock className="h-4 w-4" aria-hidden="true" />
            {MINUTES} minutes per section, no carry-over
          </li>
          <li className="flex items-center gap-2">
            <Lock className="h-4 w-4" aria-hidden="true" />
            No going back to a finished section
          </li>
          <li className="flex items-center gap-2">
            <FileText className="h-4 w-4" aria-hidden="true" />+{MARKS_CORRECT} right, {MARKS_WRONG} wrong
          </li>
        </ul>

        <AttemptList attempts={attempts} />

        {/* Past papers */}
        <section aria-labelledby="past-papers" className="flex flex-col gap-3">
          <div>
            <h2 id="past-papers" className="text-lg font-extrabold text-foreground">
              Previous year papers
            </h2>
            <p className="text-sm text-muted-foreground">The real paper, exactly as it was set. Questions that need a diagram are left out.</p>
          </div>

          {isError ? (
            <ErrorState title="Couldn't load the papers" description="Please try again in a moment." onRetry={refetch} />
          ) : (
            <ul className="surface-card divide-y-2 divide-border overflow-hidden rounded-3xl">
              {isLoading &&
                [0, 1].map((i) => (
                  <li key={i} className="flex items-center gap-4 px-5 py-4">
                    <span className="h-12 w-12 animate-pulse rounded-2xl bg-muted" />
                    <span className="h-4 w-40 animate-pulse rounded bg-muted" />
                  </li>
                ))}
              {papers?.map((paper) => (
                <li key={paper.id}>
                  <Link href={attemptHref(paper.id)} className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/60">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-muted font-mono text-sm font-black text-foreground">
                      {paper.year}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold text-foreground">SSC CGL Tier 1 · {paper.year}</span>
                      <span className="block truncate text-sm text-muted-foreground">
                        {paper.shift ? `${paper.shift} · ` : ""}4 sections · {MINUTES * 4} min
                      </span>
                    </span>
                    {bestByPaper.has(paper.id) && (
                      <span className="hidden shrink-0 rounded-md bg-muted px-2 py-1 font-mono text-xs font-bold text-muted-foreground sm:inline">
                        Best {bestByPaper.get(paper.id)}
                      </span>
                    )}
                    <span className="hidden text-sm font-bold text-brand-700 dark:text-brand-400 sm:inline">
                      {bestByPaper.has(paper.id) ? "Retake" : "Start"}
                    </span>
                    <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </li>
              ))}
              {papers && papers.length === 0 && <li className="px-5 py-4 text-sm text-muted-foreground">No full papers yet.</li>}
            </ul>
          )}
        </section>
      </div>
    </TopicPageLayout>
  );
}
