"use client";

import { useState } from "react";
import { ArrowRight, Layers, Loader2, Shuffle } from "lucide-react";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import ErrorState from "@/components/custom/error-state";
import { Loader } from "@/components/custom/loader";
import { PyqRunner } from "@/features/pyq/PyqRunner";
import { useSubjectParam } from "@/features/pyq/useSubjectParam";
import { SUBJECT_META } from "@/lib/exam-pattern";
import { SUBJECT_LABEL, subjectTheme } from "@/lib/subject-theme";
import { useGetPyqTopicsQuery, useLazyGetPyqSetQuery, type Pyq } from "@/redux/PyqApi";

const SET_SIZE = 10;

interface ActiveSet {
  /** null = mixed set across all topics */
  topic: string | null;
  questions: Pyq[];
  /** Changes on every new set so the runner starts fresh. */
  key: number;
}

export default function TopicPyqsPage() {
  const subject = useSubjectParam();
  const { data: topics, isLoading, isError, refetch } = useGetPyqTopicsQuery(subject ?? "maths", {
    skip: !subject,
  });
  const [fetchSet, { isFetching: isLoadingSet, isError: isSetError }] = useLazyGetPyqSetQuery();
  const [active, setActive] = useState<ActiveSet | null>(null);
  /** Which card is fetching its set ("__mixed" for the mixed set). */
  const [pending, setPending] = useState<string | null>(null);

  if (!subject) {
    return (
      <TopicPageLayout title="Topic-wise PYQs">
        <ErrorState title="Subject not found" description="Pick a subject from the menu to see its questions." />
      </TopicPageLayout>
    );
  }

  const theme = subjectTheme(subject);
  const total = topics?.reduce((sum, t) => sum + t.count, 0) ?? 0;

  const start = async (topic: string | null) => {
    setPending(topic ?? "__mixed");
    try {
      const result = await fetchSet({ subject, topic: topic ?? undefined, limit: SET_SIZE });
      if (result.data && result.data.length > 0) {
        setActive({ topic, questions: result.data, key: Date.now() });
      }
    } finally {
      setPending(null);
    }
  };

  if (active) {
    return (
      <TopicPageLayout hideBreadcrumbs>
        <PyqRunner
          key={active.key}
          subject={subject}
          mode="practice"
          title={`${active.topic ?? "Mixed topics"} · ${SUBJECT_LABEL[subject]}`}
          questions={active.questions}
          restartLabel="Another set"
          onRestart={() => start(active.topic)}
          onExit={() => setActive(null)}
        />
      </TopicPageLayout>
    );
  }

  return (
    <TopicPageLayout
      title="Topic-wise PYQs"
      description={`Real ${SUBJECT_META[subject].paperSection} questions from past SSC CGL Tier 1 papers, grouped by topic. Each one comes with an explanation.`}
    >
      {isLoading ? (
        <div className="flex min-h-[40dvh] items-center justify-center">
          <Loader size="lg" text="Loading topics" />
        </div>
      ) : isError || !topics ? (
        <ErrorState
          title="Couldn't load topics"
          description="The question bank didn't respond. Check that the server is running and try again."
          onRetry={refetch}
        />
      ) : topics.length === 0 ? (
        <ErrorState
          title="No questions yet"
          description="There are no previous-year questions for this subject yet."
        />
      ) : (
        <div className="flex w-full flex-col gap-6">
          {/* Mixed set */}
          <button
            type="button"
            disabled={isLoadingSet}
            onClick={() => start(null)}
            className={`group flex w-full flex-col gap-4 rounded-3xl border-2 bg-gradient-to-br p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 sm:flex-row sm:items-center sm:justify-between sm:p-6 ${theme.banner}`}
          >
            <div className="flex items-center gap-4">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ring-border/60 ${theme.iconWrap}`}>
                <Shuffle className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-lg font-extrabold text-foreground">Mixed practice</span>
                <span className="block text-sm text-muted-foreground">
                  {Math.min(SET_SIZE, total)} random questions from all {topics.length} topics · {total} in the bank
                </span>
              </span>
            </div>
            <span className="inline-flex h-10 shrink-0 items-center gap-1.5 self-start rounded-full bg-gradient-to-r from-brand-500 to-brand-alt-500 px-5 text-xs font-bold uppercase tracking-wider text-white sm:self-auto">
              {pending === "__mixed" ? "Loading" : "Start"}
              {pending === "__mixed" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              )}
            </span>
          </button>

          {isSetError && (
            <p role="alert" className="text-sm font-semibold text-rose-700 dark:text-rose-300">
              Couldn&apos;t load that set. Please try again.
            </p>
          )}

          <section aria-labelledby="topics-heading" className="flex flex-col gap-3">
            <h2 id="topics-heading" className="text-lg font-extrabold text-foreground">
              Choose a topic
            </h2>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {topics.map((topic) => (
                <li key={topic.topic}>
                  <button
                    type="button"
                    disabled={isLoadingSet}
                    onClick={() => start(topic.topic)}
                    className={`surface-card group flex h-full w-full flex-col gap-3 rounded-3xl p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 ${theme.hoverBorder}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ring-border/60 ${theme.iconWrap}`}>
                        <Layers className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="rounded-full border-2 border-border bg-muted px-2.5 py-0.5 font-mono text-xs font-bold text-muted-foreground">
                        {topic.count} Q
                      </span>
                    </div>
                    <span className="text-lg font-extrabold text-foreground">{topic.topic}</span>
                    {topic.subtopics.length > 0 && (
                      <span className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {topic.subtopics.slice(0, 6).join(" · ")}
                        {topic.subtopics.length > 6 ? ` · +${topic.subtopics.length - 6} more` : ""}
                      </span>
                    )}
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-bold text-brand-700 dark:text-brand-400">
                      {pending === topic.topic ? "Loading questions" : `Practise ${Math.min(SET_SIZE, topic.count)} questions`}
                      {pending === topic.topic ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </TopicPageLayout>
  );
}
