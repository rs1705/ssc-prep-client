"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Loader } from "@/components/custom/loader";
import { BTN, MockRunner } from "@/features/mock/MockRunner";
import { useLazyGetMockPaperQuery, useLazyGetNewMockQuery, type FullMock } from "@/redux/PyqApi";

/** /mock-tests/attempt?paper=<paper id | new>: the full-screen test. */
function Attempt() {
  const router = useRouter();
  const paper = useSearchParams().get("paper") ?? "new";
  const [fetchPaper] = useLazyGetMockPaperQuery();
  const [fetchMock] = useLazyGetNewMockQuery();
  const [mock, setMock] = useState<FullMock | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const load = useCallback(async () => {
    setMock(null);
    setFailed(false);
    try {
      const result = paper === "new" ? await fetchMock(undefined, false) : await fetchPaper(paper, true);
      if (result.data) {
        setMock(result.data);
        setAttempt((n) => n + 1);
      } else setFailed(true);
    } catch {
      setFailed(true);
    }
  }, [paper, fetchMock, fetchPaper]);

  useEffect(() => {
    void load();
  }, [load]);

  if (failed) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-background p-6 text-center">
        <p className="text-lg font-extrabold text-foreground">Couldn&apos;t load the test</p>
        <p className="max-w-sm text-sm text-muted-foreground">The server may be waking up. Please try again in a moment.</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => void load()} className={BTN.primary}>
            Try again
          </button>
          <Link href="/mock-tests" className={BTN.outline}>
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
      restartLabel={paper === "new" ? "New mock test" : "Retake this paper"}
      onRestart={() => (paper === "new" ? void load() : setAttempt((n) => n + 1))}
      onExit={() => router.push("/mock-tests")}
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
