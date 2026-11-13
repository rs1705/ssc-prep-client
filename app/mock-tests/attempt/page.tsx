"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Loader } from "@/components/custom/loader";
import { BTN, MockReview, MockRunner } from "@/features/mock/MockRunner";
import { findAttempt, type Attempt } from "@/features/mock/attempts";
import { createExam, type ExamState } from "@/features/mock/examSession";
import { timeAgo } from "@/lib/activity-log";
import { SUBJECT_LABEL, type SubjectKey } from "@/lib/subject-theme";
import {
  useLazyGetMockPaperQuery,
  useLazyGetNewMockQuery,
  useLazyGetQuestionsByIdsQuery,
  useLazyGetSectionalPaperQuery,
  type FullMock,
  type Pyq,
} from "@/redux/PyqApi";

const SUBJECTS: SubjectKey[] = ["maths", "english", "reasoning", "gk"];

/**
 * The full-screen test.
 *   ?paper=new                  a fresh 100-question mock
 *   ?paper=<id>                 a whole past paper
 *   ?paper=<id>&section=maths   one section of a past paper (Sectional PYQs)
 */
/** Where an attempt's "Retake" starts a fresh run, and where its "back" goes. */
function attemptLinks(a: Attempt) {
  if (a.kind === "section" && a.paperId && a.subject) {
    return {
      retake: `/mock-tests/attempt?paper=${encodeURIComponent(a.paperId)}&section=${a.subject}`,
      home: `/SSC/${a.subject}/sectional-pyqs`,
      retakeLabel: "Retake this section",
      exitLabel: "All papers",
    };
  }
  if (a.kind === "paper" && a.paperId) {
    return { retake: `/mock-tests/attempt?paper=${encodeURIComponent(a.paperId)}`, home: "/mock-tests", retakeLabel: "Retake this paper", exitLabel: "All tests" };
  }
  return { retake: "/mock-tests/attempt?paper=new", home: "/mock-tests", retakeLabel: "New mock test", exitLabel: "All tests" };
}

/** /mock-tests/attempt?review=<attempt id>: reopen a finished test. */
function ReviewAttempt({ id }: { id: string }) {
  const router = useRouter();
  const [fetchQuestions] = useLazyGetQuestionsByIdsQuery();
  const [state, setState] = useState<
    { status: "loading" } | { status: "missing" } | { status: "failed" } | { status: "ready"; attempt: Attempt; mock: FullMock; exam: ExamState }
  >({ status: "loading" });

  const load = useCallback(async () => {
    const attempt = findAttempt(id);
    if (!attempt) return setState({ status: "missing" });
    setState({ status: "loading" });
    try {
      const ids = attempt.sections.flatMap((s) => s.ids);
      const { data } = await fetchQuestions(ids, true);
      if (!data) return setState({ status: "failed" });
      const byId = new Map(data.map((q) => [q.id, q]));
      // Questions removed from the bank since are simply skipped.
      const sections = attempt.sections
        .map((s) => ({
          subject: s.subject as SubjectKey,
          questions: s.ids.map((qid) => byId.get(qid)).filter((q): q is Pyq => q !== undefined),
        }))
        .filter((s) => s.questions.length > 0);
      if (sections.length === 0) return setState({ status: "failed" });
      const exam: ExamState = { ...createExam(sections), answers: attempt.answers, submitted: true };
      const mock: FullMock = {
        kind: attempt.kind,
        id: attempt.paperId ?? attempt.id,
        title: attempt.title,
        year: new Date(attempt.at).getFullYear(),
        shift: null,
        date: null,
        questionCount: exam.questions.length,
        durationSeconds: 0,
        sections,
      };
      setState({ status: "ready", attempt, mock, exam });
    } catch {
      setState({ status: "failed" });
    }
  }, [id, fetchQuestions]);

  useEffect(() => {
    void load();
  }, [load]);

  if (state.status === "missing" || state.status === "failed") {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-background p-6 text-center">
        <p className="text-lg font-bold text-foreground">{state.status === "missing" ? "Attempt not found" : "Couldn't load this attempt"}</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          {state.status === "missing"
            ? "It may have been made on another device that hasn't synced yet."
            : "The server may be waking up. Please try again in a moment."}
        </p>
        <div className="flex gap-2">
          {state.status === "failed" && (
            <button type="button" onClick={() => void load()} className={BTN.primary}>
              Try again
            </button>
          )}
          <Link href="/mock-tests" className={BTN.outline}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Mock tests
          </Link>
        </div>
      </div>
    );
  }

  if (state.status === "loading") {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background">
        <Loader text="Opening your attempt…" />
      </div>
    );
  }

  const links = attemptLinks(state.attempt);
  return (
    <MockReview
      mock={state.mock}
      exam={state.exam}
      when={timeAgo(state.attempt.at)}
      homeHref={links.home}
      exitLabel={links.exitLabel}
      restartLabel={links.retakeLabel}
      onRestart={() => router.push(links.retake)}
      onExit={() => router.push(links.home)}
    />
  );
}

function Attempt() {
  const router = useRouter();
  const params = useSearchParams();
  const paper = params.get("paper") ?? "new";
  const sectionParam = params.get("section");
  const section = SUBJECTS.find((s) => s === sectionParam) ?? null;
  const homeHref = section ? `/SSC/${section}/sectional-pyqs` : "/mock-tests";

  const [fetchPaper] = useLazyGetMockPaperQuery();
  const [fetchMock] = useLazyGetNewMockQuery();
  const [fetchSection] = useLazyGetSectionalPaperQuery();
  const [mock, setMock] = useState<FullMock | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const load = useCallback(async () => {
    setMock(null);
    setFailed(false);
    try {
      let next: FullMock | undefined;
      if (section && paper !== "new") {
        const { data } = await fetchSection({ paperId: paper, subject: section }, true);
        if (data) {
          next = {
            kind: "section",
            id: data.id,
            title: `${data.title} · ${SUBJECT_LABEL[section]}`,
            year: data.year,
            shift: data.shift,
            date: data.date,
            questionCount: data.questionCount,
            durationSeconds: data.durationSeconds,
            sections: [{ subject: section, questions: data.questions }],
          };
        }
      } else {
        const { data } = paper === "new" ? await fetchMock(undefined, false) : await fetchPaper(paper, true);
        next = data;
      }
      if (next) {
        setMock(next);
        setAttempt((n) => n + 1);
      } else {
        setFailed(true);
      }
    } catch {
      setFailed(true);
    }
  }, [paper, section, fetchMock, fetchPaper, fetchSection]);

  useEffect(() => {
    void load();
  }, [load]);

  if (failed) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-background p-6 text-center">
        <p className="text-lg font-bold text-foreground">Couldn&apos;t load the test</p>
        <p className="max-w-sm text-sm text-muted-foreground">The server may be waking up. Please try again in a moment.</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => void load()} className={BTN.primary}>
            Try again
          </button>
          <Link href={homeHref} className={BTN.outline}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Link>
        </div>
      </div>
    );
  }

  if (!mock) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background">
        <Loader text={paper === "new" ? "Building your mock test…" : "Loading the paper…"} />
      </div>
    );
  }

  return (
    <MockRunner
      key={`${mock.id}-${attempt}`}
      mock={mock}
      homeHref={homeHref}
      exitLabel={section ? "All papers" : "All tests"}
      restartLabel={paper === "new" ? "New mock test" : section ? "Retake this section" : "Retake this paper"}
      onRestart={() => (paper === "new" ? void load() : setAttempt((n) => n + 1))}
      onExit={() => router.push(homeHref)}
    />
  );
}

function AttemptOrReview() {
  const review = useSearchParams().get("review");
  return review ? <ReviewAttempt id={review} /> : <Attempt />;
}

export default function MockAttemptPage() {
  return (
    <Suspense fallback={null}>
      <AttemptOrReview />
    </Suspense>
  );
}
