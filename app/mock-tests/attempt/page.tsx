"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Loader } from "@/components/custom/loader";
import { BTN, MockRunner } from "@/features/mock/MockRunner";
import { SUBJECT_LABEL, type SubjectKey } from "@/lib/subject-theme";
import {
  useLazyGetMockPaperQuery,
  useLazyGetNewMockQuery,
  useLazyGetSectionalPaperQuery,
  type FullMock,
} from "@/redux/PyqApi";

const SUBJECTS: SubjectKey[] = ["maths", "english", "reasoning", "gk"];

/**
 * The full-screen test.
 *   ?paper=new                  a fresh 100-question mock
 *   ?paper=<id>                 a whole past paper
 *   ?paper=<id>&section=maths   one section of a past paper (Sectional PYQs)
 */
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

export default function MockAttemptPage() {
  return (
    <Suspense fallback={null}>
      <Attempt />
    </Suspense>
  );
}
