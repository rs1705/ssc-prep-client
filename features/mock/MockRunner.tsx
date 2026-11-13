"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpenText,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  Lock,
  LogOut,
  Maximize,
  Minimize,
  Minus,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";
import { RichText } from "@/features/pyq/RichText";
import { MARKS_CORRECT, MARKS_WRONG, computeResult, createSession, formatClock } from "@/features/pyq/session";
import { logActivity, logMistakes, plainText } from "@/lib/activity-log";
import { recordPlanActivity } from "@/lib/today-plan";
import { SUBJECT_LABEL, subjectTheme } from "@/lib/subject-theme";
import { cn } from "@/lib/utils";
import type { FullMock, Pyq } from "@/redux/PyqApi";
import { buildAttempt, saveAttempt } from "./attempts";
import { BTN } from "./examButtons";
import {
  SECTION_SECONDS,
  countStatuses,
  createExam,
  examReducer,
  paletteStatus,
  type ExamState,
  type PaletteStatus,
} from "./examSession";
import { ChoiceOption, choiceState } from "@/features/pyq/ChoiceOption";

interface MockRunnerProps {
  mock: FullMock;
  onExit: () => void;
  onRestart: () => void;
  restartLabel: string;
  /** Where the test lives, for the history entry (defaults to the Mock Tests page). */
  homeHref?: string;
  /** Label for the button back to that page. */
  exitLabel?: string;
}

/** "Mock test", "Previous year paper" or "Sectional test". */
function kindLabel(kind: FullMock["kind"]) {
  return kind === "mock" ? "Mock test" : kind === "section" ? "Sectional test" : "Previous year paper";
}

export { BTN } from "./examButtons";

const ICON_BTN =
  "flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:opacity-40";

const SECTION_NAME: Record<string, string> = {
  reasoning: "General Intelligence & Reasoning",
  gk: "General Awareness",
  maths: "Quantitative Aptitude",
  english: "English Comprehension",
};

const STATUS_STYLE: Record<PaletteStatus, string> = {
  "not-visited": "border-border bg-muted text-foreground",
  "not-answered": "border-rose-600 bg-rose-500 text-white",
  answered: "border-emerald-700 bg-emerald-600 text-white",
  marked: "border-brand-700 bg-brand-500 text-white",
  "answered-marked": "border-brand-700 bg-brand-500 text-white",
};

const shortName = (subject: string) =>
  ({ reasoning: "Reasoning", gk: "GK", maths: "Quant", english: "English" } as Record<string, string>)[subject] ?? subject;

const ZOOM = ["text-[15px]", "text-base", "text-lg", "text-xl"];

function StatusChip({ status, children, className }: { status: PaletteStatus; children?: React.ReactNode; className?: string }) {
  return (
    <span className={cn("relative inline-flex items-center justify-center rounded-lg border font-mono text-xs font-bold", STATUS_STYLE[status], className)}>
      {children}
      {status === "answered-marked" && (
        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" aria-hidden="true" />
      )}
    </span>
  );
}

/* ------------------------------ Full screen ------------------------------ */

function enterFullscreen() {
  const el = document.documentElement;
  if (!document.fullscreenElement && el.requestFullscreen) el.requestFullscreen().catch(() => {});
}
function exitFullscreen() {
  if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
}
function useIsFullscreen() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const update = () => setOn(Boolean(document.fullscreenElement));
    update();
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);
  return on;
}

/* --------------------------------- Shell --------------------------------- */

function Modal({ children, onClose, wide }: { children: React.ReactNode; onClose?: () => void; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-3 sm:items-center" onClick={onClose}>
      <div
        role="alertdialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={cn("w-full rounded-xl border border-border bg-card shadow-2xl", wide ? "max-w-2xl" : "max-w-md")}
      >
        {children}
      </div>
    </div>
  );
}

export function MockRunner(props: MockRunnerProps) {
  const [phase, setPhase] = useState<"instructions" | "exam" | "review">("instructions");
  const [finalState, setFinalState] = useState<ExamState | null>(null);

  // Leave full screen when the runner goes away (back to the lobby).
  useEffect(() => {
    return () => exitFullscreen();
  }, []);

  if (phase === "instructions")
    return (
      <Instructions
        {...props}
        onBegin={() => {
          enterFullscreen(); // runs inside the click, so the browser allows it
          setPhase("exam");
        }}
      />
    );
  if (phase === "exam" || !finalState)
    return (
      <ExamScreen
        {...props}
        onFinish={(s) => {
          exitFullscreen();
          saveAttempt(buildAttempt(props.mock, s));
          setFinalState(s);
          setPhase("review");
        }}
      />
    );
  return <Review {...props} exam={finalState} />;
}

/* ------------------------------ Instructions ------------------------------ */

function Instructions({ mock, onExit, onBegin }: MockRunnerProps & { onBegin: () => void }) {
  const [agreed, setAgreed] = useState(false);
  const total = mock.sections.reduce((n, s) => n + s.questions.length, 0);
  const minutes = (mock.sections.length * SECTION_SECONDS) / 60;

  const stats = [
    { label: "Questions", value: total },
    { label: "Minutes", value: minutes },
    { label: "Max marks", value: total * MARKS_CORRECT },
    { label: "Marking", value: `+${MARKS_CORRECT} / ${MARKS_WRONG}` },
  ];

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 font-mono text-xs font-bold text-white" aria-hidden="true">
            E
          </span>
          <p className="truncate text-sm font-semibold text-foreground">EptSSC · {kindLabel(mock.kind)}</p>
        </div>
        <button type="button" onClick={onExit} className={BTN.ghost}>
          <X className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Close</span>
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-7 px-4 py-6 sm:py-10">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{mock.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Read this once before you start. The test opens in full screen.</p>
          </div>

          <dl className="grid grid-cols-2 overflow-hidden rounded-xl border border-border bg-card sm:grid-cols-4">
            {stats.map((s, i) => (
              <div key={s.label} className={cn("px-4 py-3", i > 0 && "border-l border-border", i === 2 && "border-l-0 border-t sm:border-l sm:border-t-0", i === 3 && "border-t sm:border-t-0")}>
                <dd className="font-mono text-xl font-bold tabular-nums text-foreground">{s.value}</dd>
                <dt className="text-xs text-muted-foreground">{s.label}</dt>
              </div>
            ))}
          </dl>

          <section>
            <h2 className="mb-3 text-sm font-bold text-foreground">
              {mock.sections.length > 1 ? `The ${mock.sections.length} sections run one after another` : "The section"}
            </h2>
            <ol className="relative flex flex-col gap-0 border-l-2 border-border pl-5">
              {mock.sections.map((s, i) => (
                <li key={s.subject} className="relative pb-3 last:pb-0">
                  <span className={cn("absolute -left-[27px] top-1 h-3 w-3 rounded-full ring-4 ring-background", subjectTheme(s.subject).dot)} aria-hidden="true" />
                  <p className="text-sm font-semibold text-foreground">{SECTION_NAME[s.subject]}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.questions.length} questions · {SECTION_SECONDS / 60} minutes{i === 0 && mock.sections.length > 1 ? " · starts first" : ""}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section className="flex flex-col gap-2 text-sm leading-relaxed text-foreground/85">
            <h2 className="text-sm font-bold text-foreground">How the clock works</h2>
            {mock.sections.length > 1 ? (
              <p>
                Each section gets its own {`${SECTION_SECONDS / 60} minutes`}, as in the real exam. Time you don&apos;t use is not added to the next
                section. When a section&apos;s clock runs out, or you finish it early, it locks and you can&apos;t return to it. The test ends with
                the last section.
              </p>
            ) : (
              <p>
                You get {`${SECTION_SECONDS / 60} minutes`}, the same time this section gets in the real exam. When the clock runs out, the test is
                submitted automatically. You can also submit early.
              </p>
            )}
          </section>

          <section className="flex flex-col gap-2 text-sm leading-relaxed text-foreground/85">
            <h2 className="text-sm font-bold text-foreground">Saving answers</h2>
            <p>
              Picking an option is only a selection. It counts once you press <b>Save &amp; Next</b> or <b>Mark for Review &amp; Next</b>. If
              you jump to another question without saving, the selection is dropped, just like the real CBT.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold text-foreground">Reading the question map</h2>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {(
                [
                  ["not-visited", "Not opened yet"],
                  ["not-answered", "Opened, no answer saved"],
                  ["answered", "Answer saved"],
                  ["marked", "Marked to revisit, no answer"],
                  ["answered-marked", "Answer saved and marked (still scored)"],
                ] as [PaletteStatus, string][]
              ).map(([status, label]) => (
                <li key={status} className="flex items-center gap-3 text-sm text-foreground">
                  <StatusChip status={status} className="h-7 w-7 shrink-0">
                    7
                  </StatusChip>
                  {label}
                </li>
              ))}
            </ul>
          </section>

          <p className="text-xs text-muted-foreground">Shortcuts: 1–4 or A–D to pick an option, Enter to save and move on.</p>
        </div>
      </div>

      <footer className="shrink-0 border-t border-border bg-card px-4 py-3">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-2.5 text-sm text-foreground">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="h-4 w-4 shrink-0 accent-[var(--brand-600)]" />
            I&apos;ve read the instructions
          </label>
          <button type="button" disabled={!agreed} onClick={onBegin} className={cn(BTN.primary, "h-11 px-6")}>
            Start test
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </footer>
    </div>
  );
}

/* --------------------------------- Exam ---------------------------------- */

function ExamScreen({ mock, onExit, onFinish }: MockRunnerProps & { onFinish: (s: ExamState) => void }) {
  const [state, dispatch] = useReducer(examReducer, mock.sections, createExam);
  const [zoom, setZoom] = useState(0);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [confirm, setConfirm] = useState<null | "section" | "submit" | "leave">(null);
  const [switches, setSwitches] = useState(0);
  const [toast, setToast] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const fullscreen = useIsFullscreen();

  const sec = state.sections[state.section];
  const sectionSize = sec.end - sec.start;
  const isLastSection = state.section === state.sections.length - 1;
  const question = state.questions[state.index];
  const counts = countStatuses(state, sec.start, sec.end);
  const answeredInSection = counts.answered + counts["answered-marked"];
  const notAnsweredInSection = counts["not-answered"] + counts.marked + counts["not-visited"];
  const markedInSection = counts.marked + counts["answered-marked"];
  const qNo = state.index - sec.start + 1;
  const lowTime = state.secondsLeft <= 60;

  // The section clock keeps running even if the window loses focus, as in the real exam.
  useEffect(() => {
    if (state.submitted) return;
    const id = window.setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => window.clearInterval(id);
  }, [state.submitted]);

  useEffect(() => {
    if (state.submitted) onFinish(state);
    // Fires once, when the last section ends.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.submitted]);

  // Closing or reloading the tab loses the attempt.
  useEffect(() => {
    if (state.submitted) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [state.submitted]);

  // Count switches away from the test window, and say so.
  useEffect(() => {
    let timer: number | undefined;
    const onVisibility = () => {
      if (!document.hidden) return;
      setSwitches((n) => n + 1);
      setToast(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setToast(false), 5000);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearTimeout(timer);
    };
  }, []);

  // Braces matter: scrollTo returns a Promise in newer browsers, and an effect may only return a cleanup.
  useEffect(() => {
    setConfirm(null);
  }, [state.section]);
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [state.index]);

  // Keyboard: 1-4 / A-D select, Enter = Save & Next.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || confirm) return;
      const key = e.key.toLowerCase();
      const i = key.length === 1 ? Math.max("1234".indexOf(key), "abcd".indexOf(key)) : -1;
      if (i >= 0 && question.options[i]) {
        e.preventDefault();
        dispatch({ type: "PICK", label: question.options[i].label });
      } else if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "BUTTON") {
        e.preventDefault();
        dispatch({ type: "SAVE_NEXT" });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [question, confirm]);

  const palette = (
    <>
      <div className="border-b border-border bg-card px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-sm font-bold text-foreground">
            <span className={cn("h-2.5 w-2.5 rounded-full", subjectTheme(sec.subject).dot)} aria-hidden="true" />
            {SECTION_NAME[sec.subject]}
          </p>
          <button type="button" onClick={() => setPaletteOpen(false)} aria-label="Close question map" className={cn(ICON_BTN, "border-0 lg:hidden")}>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          <b className="font-mono text-foreground">{answeredInSection}</b> of {sectionSize} saved
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
          <div className="h-full rounded-full bg-emerald-500 transition-[width]" style={{ width: `${(answeredInSection / sectionSize) * 100}%` }} />
        </div>
      </div>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-2 border-b border-border px-4 py-3 text-xs text-muted-foreground">
        {(
          [
            ["answered", "Saved"],
            ["not-answered", "No answer"],
            ["marked", "To revisit"],
            ["not-visited", "Not opened"],
          ] as [PaletteStatus, string][]
        ).map(([status, label]) => (
          <li key={status} className="flex items-center gap-2">
            <StatusChip status={status} className="h-6 w-6 shrink-0 text-[11px]">
              {status === "marked" ? counts.marked + counts["answered-marked"] : counts[status]}
            </StatusChip>
            {label}
          </li>
        ))}
      </ul>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <ol className="grid grid-cols-[repeat(5,2.5rem)] justify-center gap-2">
          {state.questions.slice(sec.start, sec.end).map((q, i) => {
            const index = sec.start + i;
            const status = paletteStatus(state, q.id);
            return (
              <li key={q.id}>
                <button
                  type="button"
                  onClick={() => {
                    dispatch({ type: "GOTO", index });
                    setPaletteOpen(false);
                  }}
                  aria-label={`Question ${i + 1}: ${status.replace(/-/g, " ")}`}
                  aria-current={index === state.index ? "true" : undefined}
                  className="flex"
                >
                  <StatusChip
                    status={status}
                    className={cn("h-10 w-10 text-sm", index === state.index && "ring-2 ring-foreground ring-offset-2 ring-offset-card")}
                  >
                    {i + 1}
                  </StatusChip>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="border-t border-border bg-card p-3">
        <button type="button" onClick={() => setConfirm(isLastSection ? "submit" : "section")} className={cn(BTN.primary, "h-11 w-full")}>
          {isLastSection ? "Submit test" : `Finish ${shortName(sec.subject)} section`}
        </button>
      </div>
    </>
  );

  // Per-section summary for the final submit dialog.
  const summary = state.sections.map((s, i) => {
    const c = countStatuses(state, s.start, s.end);
    return {
      name: SECTION_NAME[s.subject],
      total: s.end - s.start,
      attempted: c.answered + c["answered-marked"],
      marked: c.marked + c["answered-marked"],
      locked: i < state.section,
    };
  });
  const totalQs = state.questions.length;
  const totalAttempted = summary.reduce((n, s) => n + s.attempted, 0);

  return (
    <div className="flex h-[100dvh] flex-col bg-card">
      {/* Top bar */}
      <header className="grid h-14 shrink-0 grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-border bg-card px-3 sm:px-4">
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={() => setZoom((z) => Math.max(0, z - 1))} disabled={zoom === 0} aria-label="Zoom out" className={cn(ICON_BTN, "hidden sm:flex")}>
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => setZoom((z) => Math.min(ZOOM.length - 1, z + 1))} disabled={zoom === ZOOM.length - 1} aria-label="Zoom in" className={cn(ICON_BTN, "hidden sm:flex")}>
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => (fullscreen ? exitFullscreen() : enterFullscreen())}
            aria-label={fullscreen ? "Exit full screen" : "Full screen"}
            className={ICON_BTN}
          >
            {fullscreen ? <Minimize className="h-4 w-4" aria-hidden="true" /> : <Maximize className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
        <p className="truncate text-center text-sm font-semibold uppercase tracking-wide text-foreground">{mock.title}</p>
        <div className="flex items-center gap-2">
          <div role="timer" aria-label="Time left in this section" className="text-right leading-none">
            <span className="hidden text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:block">Time left</span>
            <span className={cn("font-mono text-xl font-bold tabular-nums", lowTime ? "animate-pulse text-rose-600" : "text-rose-600 dark:text-rose-400")}>
              {formatClock(state.secondsLeft)}
            </span>
          </div>
          <button type="button" onClick={() => setConfirm("leave")} aria-label="Leave the test" className={cn(ICON_BTN, "border-0")}>
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Sections in order: finished (locked), current, upcoming */}
      <div className="flex shrink-0 items-stretch justify-between gap-2 border-b border-border bg-card px-1 sm:px-2">
        <ol className="flex min-w-0 items-stretch overflow-x-auto [scrollbar-width:none]">
          {state.sections.map((s, i) => {
            const c = countStatuses(state, s.start, s.end);
            const saved = c.answered + c["answered-marked"];
            const current = i === state.section;
            return (
              <li
                key={s.subject}
                aria-current={current ? "step" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm sm:px-4",
                  current ? "border-brand-600 font-semibold text-foreground" : "border-transparent text-muted-foreground",
                )}
              >
                {i < state.section ? (
                  <Lock className="h-3.5 w-3.5" aria-label="Finished" />
                ) : (
                  <span className={cn("h-2 w-2 rounded-full", current ? subjectTheme(s.subject).dot : "bg-border")} aria-hidden="true" />
                )}
                {shortName(s.subject)}
                {i <= state.section && (
                  <span className="font-mono text-xs tabular-nums text-muted-foreground">
                    {saved}/{s.end - s.start}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
        <button type="button" onClick={() => setPaletteOpen(true)} className={cn(BTN.outline, "my-1.5 mr-2 h-8 shrink-0 px-2.5 text-xs lg:hidden")}>
          <LayoutGrid className="h-4 w-4" aria-hidden="true" />
          Map
        </button>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Question: plain white */}
        <main className="flex min-w-0 flex-1 flex-col bg-card">
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/60 px-4 py-2.5 sm:px-6">
            <p className="text-sm font-bold text-brand-800 dark:text-brand-200">
              Question {qNo} of {sectionSize}
            </p>
            <p className="text-xs font-semibold text-muted-foreground">
              <span className="text-emerald-700 dark:text-emerald-300">+{MARKS_CORRECT}</span>
              {" / "}
              <span className="text-rose-700 dark:text-rose-300">{MARKS_WRONG}</span>
            </p>
          </div>

          <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto bg-card">
            <div className={cn("flex w-full flex-col gap-5 px-4 py-5 sm:px-6", ZOOM[zoom])}>
              {question.passage && (
                <details open className="group rounded-lg border border-border">
                  <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-2.5 text-sm font-semibold text-foreground">
                    <BookOpenText className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    Passage
                    <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <RichText text={question.passage} className="max-h-72 overflow-y-auto border-t border-border px-4 py-3 leading-relaxed text-foreground/90" />
                </details>
              )}
              <RichText text={question.question} className="font-medium leading-relaxed text-foreground" />
              <div role="radiogroup" aria-label="Options" className="flex flex-col gap-2.5">
                {question.options.map((o) => {
                  const picked = state.draft === o.label;
                  return (
                    <label
                      key={o.label}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 transition-colors",
                        picked ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10" : "border-border hover:bg-muted/50",
                      )}
                    >
                      <input
                        type="radio"
                        name={`q-${question.id}`}
                        checked={picked}
                        onChange={() => dispatch({ type: "PICK", label: o.label })}
                        className="h-5 w-5 shrink-0 accent-[var(--brand-600)]"
                      />
                      <RichText inline text={o.text} className="min-w-0 flex-1 text-foreground" />
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action bar */}
          <div className="flex shrink-0 items-center gap-2 border-t border-border bg-muted/60 px-3 py-2.5 sm:px-4">
            <button type="button" onClick={() => dispatch({ type: "MARK_NEXT" })} className={cn(BTN.mark, "px-3")}>
              <span className="sm:hidden">Mark &amp; Next</span>
              <span className="hidden sm:inline">Mark for Review &amp; Next</span>
            </button>
            <button type="button" onClick={() => dispatch({ type: "CLEAR" })} className={cn(BTN.outline, "px-3")}>
              <span className="sm:hidden">Clear</span>
              <span className="hidden sm:inline">Clear Response</span>
            </button>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                disabled={state.index === sec.start}
                onClick={() => dispatch({ type: "GOTO", index: state.index - 1 })}
                className={cn(BTN.outline, "hidden px-3 sm:inline-flex")}
              >
                « Previous
              </button>
              <button type="button" onClick={() => dispatch({ type: "SAVE_NEXT" })} className={BTN.save}>
                Save &amp; Next »
              </button>
            </div>
          </div>
        </main>

        {/* Palette on the right; a drawer on smaller screens */}
        <aside aria-label="Question palette" className="hidden w-[16.5rem] shrink-0 flex-col border-l border-border bg-muted/30 lg:flex">
          {palette}
        </aside>
        {paletteOpen && (
          <div className="fixed inset-0 z-40 flex justify-end bg-black/40 lg:hidden" onClick={() => setPaletteOpen(false)}>
            <aside aria-label="Question palette" className="flex h-full w-[86%] max-w-sm flex-col bg-background shadow-2xl" onClick={(e) => e.stopPropagation()}>
              {palette}
            </aside>
          </div>
        )}
      </div>

      {/* Leaving the test window is noted, as it would be flagged in the real exam */}
      {toast && (
        <div role="status" className="fixed bottom-20 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm text-background shadow-lg">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
          Stay on this window during the test · left {switches} {switches === 1 ? "time" : "times"}
        </div>
      )}

      {confirm === "leave" && (
        <Modal onClose={() => setConfirm(null)}>
          <div className="p-6">
            <h2 className="text-lg font-bold text-foreground">Leave the test?</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">This attempt will be lost and nothing will be scored.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-border p-4">
            <button type="button" autoFocus onClick={() => setConfirm(null)} className={BTN.outline}>
              Keep going
            </button>
            <button type="button" onClick={onExit} className={cn(BTN.primary, "bg-rose-600 hover:bg-rose-700")}>
              Leave test
            </button>
          </div>
        </Modal>
      )}

      {confirm === "section" && (
        <Modal onClose={() => setConfirm(null)}>
          <div className="p-6">
            <h2 className="text-lg font-bold text-foreground">Finish {SECTION_NAME[sec.subject]}?</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              You&apos;ll move to {SECTION_NAME[state.sections[state.section + 1]?.subject ?? sec.subject]} and can&apos;t come back. The{" "}
              {formatClock(state.secondsLeft)} left here is dropped.
            </p>
            <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                { label: "Saved", value: answeredInSection, tone: "text-emerald-700 dark:text-emerald-300" },
                { label: "No answer", value: notAnsweredInSection, tone: "text-rose-700 dark:text-rose-300" },
                { label: "To revisit", value: markedInSection, tone: "text-brand-700 dark:text-brand-300" },
              ].map((x) => (
                <div key={x.label} className="rounded-lg border border-border py-2">
                  <dd className={cn("font-mono text-xl font-bold tabular-nums", x.tone)}>{x.value}</dd>
                  <dt className="text-xs text-muted-foreground">{x.label}</dt>
                </div>
              ))}
            </dl>
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-border p-4">
            <button type="button" autoFocus onClick={() => setConfirm(null)} className={BTN.outline}>
              Stay here
            </button>
            <button type="button" onClick={() => dispatch({ type: "END_SECTION" })} className={BTN.primary}>
              Next section
            </button>
          </div>
        </Modal>
      )}

      {confirm === "submit" && (
        <Modal onClose={() => setConfirm(null)}>
          <div className="p-6">
            <h2 className="text-lg font-bold text-foreground">Submit the test?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatClock(state.secondsLeft)} still left in {SECTION_NAME[sec.subject]}. You can keep working on it.
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {summary.map((s) => (
                <li key={s.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-foreground">
                      {s.locked && <Lock className="h-3 w-3 text-muted-foreground" aria-label="finished" />}
                      {s.name}
                    </span>
                    <span className="font-mono text-xs tabular-nums text-muted-foreground">
                      <b className="text-foreground">{s.attempted}</b>/{s.total}
                      {s.marked > 0 && <span className="ml-2 text-brand-700 dark:text-brand-300">{s.marked} marked</span>}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(s.attempted / s.total) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
            {totalQs - totalAttempted > 0 && (
              <p className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {totalQs - totalAttempted} of {totalQs} questions have no saved answer. They score zero.
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-border p-4">
            <button type="button" autoFocus onClick={() => setConfirm(null)} className={BTN.outline}>
              Keep working
            </button>
            <button type="button" onClick={() => dispatch({ type: "SUBMIT" })} className={BTN.primary}>
              Submit &amp; see result
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* -------------------------------- Review --------------------------------- */

/** Reopen a saved attempt: the same result and review, without logging it again. */
export function MockReview(props: MockRunnerProps & { exam: ExamState; when?: string }) {
  return <Review {...props} record={false} />;
}

function Review({
  mock,
  exam,
  onExit,
  onRestart,
  restartLabel,
  homeHref = "/mock-tests",
  exitLabel = "All tests",
  record = true,
  when,
}: MockRunnerProps & { exam: ExamState; record?: boolean; when?: string }) {
  const [index, setIndex] = useState(0);
  // Mark the saved answers with the usual PYQ rules (+2 / -0.5).
  const asSession = (questions: Pyq[]) => ({ ...createSession("test", questions), answers: exam.answers, submitted: true });
  const total = computeResult(asSession(exam.questions));
  const sec = exam.sections.find((s) => index >= s.start && index < s.end) ?? exam.sections[0];
  const question = exam.questions[index];
  const chosen = exam.answers[question.id];

  // Log once: one entry per attempted section, so subject stats update.
  const logged = useRef(false);
  useEffect(() => {
    if (logged.current || !record) return;
    logged.current = true;
    recordPlanActivity("pyq");
    const path = homeHref;
    for (const s of exam.sections) {
      const qs = exam.questions.slice(s.start, s.end);
      const res = computeResult(asSession(qs));
      if (res.correct + res.wrong === 0) continue;
      logActivity({
        kind: "pyq",
        subject: s.subject,
        label: `${kindLabel(mock.kind)} · ${SUBJECT_LABEL[s.subject]}`,
        href: path,
        correct: res.correct,
        total: qs.length,
      });
      logMistakes(
        qs
          .filter((q) => exam.answers[q.id] && exam.answers[q.id] !== q.answer)
          .map((q) => ({
            subject: s.subject,
            source: `${q.topic} PYQ`,
            prompt: plainText(q.question),
            answer: plainText(q.options.find((o) => o.label === q.answer)?.text ?? q.answer, 80),
            detail: q.topic,
            href: path,
            options: q.options.map((o) => plainText(o.text, 80)),
          })),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = (i: number) => {
    setIndex(i);
    document.getElementById("review-question")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-4 sm:px-6">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold uppercase tracking-wide text-foreground">{mock.title}</p>
          <p className="text-xs text-muted-foreground">{when ? `Attempted ${when}` : "Result & review"}</p>
        </div>
        <button type="button" onClick={onExit} className={BTN.ghost}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">{exitLabel}</span>
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-5 sm:px-6 sm:py-8">
          <section aria-label="Result" className="grid gap-5 rounded-xl border border-border bg-card p-5 sm:p-6 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Your score</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-5xl font-bold tabular-nums text-foreground sm:text-6xl">{total.marks}</span>
                <span className="font-mono text-xl font-semibold text-muted-foreground">/ {total.maxMarks}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {total.correct} right · {total.wrong} wrong · {total.skipped} not answered · {total.accuracy}% accuracy
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={onRestart} className={BTN.primary}>
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  {restartLabel}
                </button>
                <button type="button" onClick={onExit} className={BTN.outline}>
                  {exitLabel}
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[20rem] text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <th className="py-2 pr-2 font-semibold">Section</th>
                    <th className="px-2 text-right font-semibold">Right</th>
                    <th className="px-2 text-right font-semibold">Wrong</th>
                    <th className="px-2 text-right font-semibold">Skipped</th>
                    <th className="pl-2 text-right font-semibold">Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {exam.sections.map((s) => {
                    const res = computeResult(asSession(exam.questions.slice(s.start, s.end)));
                    return (
                      <tr key={s.subject} className="border-t border-border">
                        <td className="py-2.5 pr-2">
                          <button type="button" onClick={() => go(s.start)} className="flex items-center gap-2 font-semibold text-foreground hover:underline">
                            <span className={cn("h-2.5 w-2.5 rounded-full", subjectTheme(s.subject).dot)} aria-hidden="true" />
                            {SUBJECT_LABEL[s.subject]}
                          </button>
                        </td>
                        <td className="px-2 text-right font-mono font-bold tabular-nums text-emerald-700 dark:text-emerald-300">{res.correct}</td>
                        <td className="px-2 text-right font-mono font-bold tabular-nums text-rose-700 dark:text-rose-300">{res.wrong}</td>
                        <td className="px-2 text-right font-mono font-bold tabular-nums text-muted-foreground">{res.skipped}</td>
                        <td className="pl-2 text-right font-mono font-bold tabular-nums text-foreground">
                          {res.marks}
                          <span className="text-xs font-semibold text-muted-foreground">/{res.maxMarks}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <div id="review-question" className="flex scroll-mt-4 flex-col gap-5 lg:flex-row lg:items-start">
            <article className="flex min-w-0 flex-1 flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                <span className="rounded bg-brand-600 px-2 py-0.5 font-mono text-white">Q{index - sec.start + 1}</span>
                <span className="text-muted-foreground">{SECTION_NAME[sec.subject]}</span>
                {question.source && mock.kind === "mock" && <span className="text-muted-foreground">· {question.source}</span>}
                <span className="ml-auto">
                  {!chosen ? (
                    <span className="text-muted-foreground">Not answered</span>
                  ) : chosen === question.answer ? (
                    <span className="text-emerald-700 dark:text-emerald-300">Correct · +{MARKS_CORRECT}</span>
                  ) : (
                    <span className="text-rose-700 dark:text-rose-300">Wrong · {MARKS_WRONG}</span>
                  )}
                </span>
              </div>
              {question.passage && (
                <details className="group rounded-lg border border-border">
                  <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-2.5 text-sm font-semibold text-foreground">
                    <BookOpenText className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    Passage
                    <ChevronDown className="ml-auto h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <RichText text={question.passage} className="max-h-64 overflow-y-auto border-t border-border px-4 py-3 text-sm leading-relaxed text-foreground/90" />
                </details>
              )}
              <RichText text={question.question} className="text-base font-medium leading-relaxed text-foreground sm:text-lg" />
              <div className="flex flex-col gap-2">
                {question.options.map((o) => {
                  const isAnswer = o.label === question.answer;
                  const isChosen = chosen === o.label;
                  return (
                    <ChoiceOption
                      key={o.label}
                      label={o.label}
                      state={choiceState({ revealed: true, isAnswer, isChosen })}
                      disabled
                      aria-label={`Option ${o.label}${isAnswer ? ", correct answer" : isChosen ? ", your answer" : ""}`}
                    >
                      <RichText inline text={o.text} />
                    </ChoiceOption>
                  );
                })}
              </div>
              <details key={question.id} className="group rounded-lg border border-border">
                <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-2.5 text-sm font-semibold text-brand-700 dark:text-brand-300 [&::-webkit-details-marker]:hidden">
                  <span className="group-open:hidden">Show explanation</span>
                  <span className="hidden group-open:inline">Hide explanation</span>
                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <div className="border-t border-border px-4 py-3">
                  {question.explanation ? (
                    <RichText text={question.explanation} className="text-sm leading-relaxed text-foreground/90" />
                  ) : (
                    <p className="text-sm text-muted-foreground">No explanation for this question yet.</p>
                  )}
                </div>
              </details>
              <div className="flex items-center justify-between gap-2 border-t border-border pt-4">
                <button type="button" disabled={index === 0} onClick={() => setIndex((i) => i - 1)} className={BTN.outline}>
                  « Previous
                </button>
                <button type="button" disabled={index === exam.questions.length - 1} onClick={() => setIndex((i) => i + 1)} className={BTN.primary}>
                  Next »
                </button>
              </div>
            </article>

            <nav aria-label="Review questions" className="rounded-xl border border-border bg-card p-4 lg:sticky lg:top-4 lg:w-[16.5rem] lg:shrink-0">
              <div className="mb-3 grid grid-cols-4 gap-1.5">
                {exam.sections.map((s) => (
                  <button
                    key={s.subject}
                    type="button"
                    onClick={() => setIndex(s.start)}
                    className={cn(
                      "rounded-md px-1 py-1.5 text-xs font-semibold",
                      s === sec ? "bg-brand-600 text-white" : "bg-muted text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {shortName(s.subject)}
                  </button>
                ))}
              </div>
              <ol className="grid grid-cols-[repeat(5,2.5rem)] justify-center gap-2">
                {exam.questions.slice(sec.start, sec.end).map((q, i) => {
                  const a = exam.answers[q.id];
                  return (
                    <li key={q.id}>
                      <button
                        type="button"
                        onClick={() => setIndex(sec.start + i)}
                        aria-label={`Question ${i + 1}`}
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg border font-mono text-sm font-bold",
                          !a ? "border-border bg-muted text-muted-foreground" : a === q.answer ? "border-emerald-700 bg-emerald-600 text-white" : "border-rose-600 bg-rose-500 text-white",
                          sec.start + i === index && "ring-2 ring-amber-400 ring-offset-2 ring-offset-card",
                        )}
                      >
                        {i + 1}
                      </button>
                    </li>
                  );
                })}
              </ol>
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-emerald-600" />Right</li>
                <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-rose-500" />Wrong</li>
                <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded border border-border bg-muted" />Not answered</li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
