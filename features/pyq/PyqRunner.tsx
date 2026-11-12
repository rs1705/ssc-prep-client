"use client";

import { describeRoute, logActivity, logMistakes, plainText } from "@/lib/activity-log";
import { recordPlanActivity } from "@/lib/today-plan";
import { useEffect, useReducer, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Check,
  Clock,
  Eraser,
  Flag,
  RotateCcw,
  X,
  ChevronDown,
  Repeat,
  Target,
} from "lucide-react";
import { DUO } from "@/features/games/buttons";
import { replayHref, shuffle } from "@/features/games/sessionSet";
import { cn } from "@/lib/utils";
import { ProgressBar } from "@/components/custom/ProgressBar";
import { subjectTheme, type SubjectKey } from "@/lib/subject-theme";
import type { Pyq } from "@/redux/PyqApi";
import { RichText } from "./RichText";
import {
  MARKS_CORRECT,
  MARKS_WRONG,
  computeResult,
  createSession,
  formatClock,
  isPracticeComplete,
  sessionReducer,
  type PyqMode,
  type PyqSessionState,
} from "./session";

interface PyqRunnerProps {
  subject: SubjectKey;
  title: string;
  mode: PyqMode;
  questions: Pyq[];
  /** Test mode only. */
  durationSeconds?: number;
  restartLabel: string;
  onRestart: () => void;
  onExit: () => void;
  /** Start a new run with these questions ("Same set again", "Retry wrong"). */
  onPlayQuestions?: (questions: Pyq[]) => void;
  /** A saved half-finished session to continue from. */
  initialSession?: PyqSessionState;
  /** Called after every answer (null once the set is finished). */
  onProgress?: (session: PyqSessionState | null) => void;
}

export function PyqRunner({
  subject,
  title,
  mode,
  questions,
  durationSeconds,
  restartLabel,
  onRestart,
  onExit,
  onPlayQuestions,
  initialSession,
  onProgress,
}: PyqRunnerProps) {
  const [state, dispatch] = useReducer(
    sessionReducer,
    undefined,
    () => initialSession ?? createSession(mode, questions, durationSeconds),
  );
  const [confirming, setConfirming] = useState(false);
  const theme = subjectTheme(subject);

  const question = state.questions[state.index];
  const chosen = state.answers[question.id];
  const revealed = state.submitted || (mode === "practice" && !!chosen);
  const isLast = state.index === state.questions.length - 1;
  const answeredCount = Object.keys(state.answers).length;
  const unanswered = state.questions.length - answeredCount;
  const result = computeResult(state);
  const practiceDone = mode === "practice" && isPracticeComplete(state);
  const wrongQuestions = state.questions.filter((q) => state.answers[q.id] && state.answers[q.id] !== q.answer);

  // Count a finished set towards today's plan (once per set).
  const counted = useRef(false);
  useEffect(() => {
    if ((state.submitted || practiceDone) && !counted.current) {
      counted.current = true;
      recordPlanActivity("pyq");
      const path = window.location.pathname;
      logActivity({
        kind: "pyq",
        subject,
        label: describeRoute(path).label,
        href: onPlayQuestions ? replayHref(path) : path,
        correct: result.correct,
        total: state.questions.length,
      });
      logMistakes(
        state.questions
          .filter((q) => state.answers[q.id] && state.answers[q.id] !== q.answer)
          .map((q) => ({
            subject,
            source: `${q.topic} PYQ`,
            prompt: plainText(q.question),
            answer: plainText(q.options.find((o) => o.label === q.answer)?.text ?? q.answer, 80),
            detail: q.topic,
            href: path,
            options: q.options.map((o) => plainText(o.text, 80)),
          })),
      );
    }
    // Logged once when the set finishes; the values are read at that moment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.submitted, practiceDone]);

  // Report progress so the page can save a half-finished set.
  useEffect(() => {
    if (!onProgress) return;
    onProgress(state.submitted || practiceDone ? null : state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.answers, state.index, state.submitted, practiceDone]);

  // Exam clock.
  useEffect(() => {
    if (mode !== "test" || state.submitted) return;
    const id = window.setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => window.clearInterval(id);
  }, [mode, state.submitted]);

  // Keyboard: 1-4 / A-D choose, arrows move, Enter goes on.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || confirming) return;
      const key = e.key.toLowerCase();
      const byNumber = "1234".indexOf(key);
      const byLetter = "abcd".indexOf(key);
      const optionIndex = key.length === 1 ? Math.max(byNumber, byLetter) : -1;
      if (optionIndex >= 0 && question.options[optionIndex]) {
        e.preventDefault();
        dispatch({ type: "SELECT", label: question.options[optionIndex].label });
      } else if (e.key === "ArrowRight" || (e.key === "Enter" && revealed)) {
        e.preventDefault();
        dispatch({ type: "GOTO", index: state.index + 1 });
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        dispatch({ type: "GOTO", index: state.index - 1 });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [question, revealed, state.index, confirming]);

  const paletteClass = (q: Pyq, i: number) => {
    const answer = state.answers[q.id];
    const show = state.submitted || (mode === "practice" && !!answer);
    let tone = "border-border bg-card text-muted-foreground";
    if (show && answer) {
      tone =
        answer === q.answer
          ? "border-emerald-500/50 bg-[color-mix(in_oklab,var(--color-emerald-500)_15%,var(--card))] text-emerald-700 dark:text-emerald-300"
          : "border-rose-500/50 bg-[color-mix(in_oklab,var(--color-rose-500)_15%,var(--card))] text-rose-700 dark:text-rose-300";
    } else if (answer) {
      tone = "border-primary bg-primary text-primary-foreground";
    }
    const ring = i === state.index ? "ring-2 ring-brand-500 ring-offset-2 ring-offset-background" : "";
    return `${tone} ${ring}`;
  };

  const timeRatio =
    state.secondsLeft !== null && state.secondsTotal
      ? state.secondsLeft / state.secondsTotal
      : 1;

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Session bar */}
      <div className="surface-card flex flex-col gap-3 rounded-2xl p-3 sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={onExit}
              aria-label="Leave this set"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <div className="min-w-0">
              <p className="section-label truncate">
                {mode === "test" ? "Sectional test" : "Topic practice"}
                {state.submitted ? " · Review" : ""}
              </p>
              <h2 className="truncate text-base font-extrabold text-foreground">{title}</h2>
            </div>
          </div>

          {mode === "test" && state.secondsLeft !== null && !state.submitted ? (
            <div
              role="timer"
              aria-label="Time left"
              className={`flex shrink-0 items-center gap-1.5 rounded-full border-2 px-3 py-1.5 font-mono text-sm font-black tabular-nums ${
                timeRatio <= 0.15
                  ? "border-rose-500/40 bg-[color-mix(in_oklab,var(--color-rose-500)_10%,var(--card))] text-rose-700 dark:text-rose-300"
                  : "border-border bg-card text-foreground"
              }`}
            >
              <Clock className="h-4 w-4" aria-hidden="true" />
              {formatClock(state.secondsLeft)}
            </div>
          ) : (
            <div className="shrink-0 font-mono text-sm font-black tabular-nums text-muted-foreground">
              {state.index + 1} / {state.questions.length}
            </div>
          )}
        </div>

        {mode === "test" && !state.submitted ? (
          <ProgressBar
            value={timeRatio * 100}
            label="Time left"
            className="h-2 p-0"
            barClassName={`bg-gradient-to-r ${timeRatio <= 0.15 ? "from-rose-500 to-red-600" : theme.bar} transition-[width] duration-1000 ease-linear`}
          />
        ) : (
          <ProgressBar
            value={(answeredCount / state.questions.length) * 100}
            label="Questions answered"
            className="h-2 p-0"
            barClassName={`bg-gradient-to-r ${theme.bar}`}
          />
        )}
      </div>

      {/* Result summary */}
      {state.submitted && (
        <section
          aria-label="Result"
          className={`rounded-3xl border-2 bg-gradient-to-br p-5 sm:p-6 ${theme.banner}`}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="section-label">{mode === "test" ? "Your score" : "Set complete"}</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-4xl font-black tabular-nums text-foreground">
                  {mode === "test" ? result.marks : result.correct}
                </span>
                <span className="font-mono text-lg font-bold text-muted-foreground">
                  / {mode === "test" ? result.maxMarks : state.questions.length}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {mode === "test"
                  ? `+${MARKS_CORRECT} per correct, ${MARKS_WRONG} per wrong, as on the real paper.`
                  : "Review each question below, with explanations."}
              </p>
            </div>
            <dl className="grid grid-cols-4 gap-2 text-center sm:w-auto">
              {[
                { label: "Correct", value: result.correct, tone: "text-emerald-700 dark:text-emerald-300" },
                { label: "Wrong", value: result.wrong, tone: "text-rose-700 dark:text-rose-300" },
                { label: "Skipped", value: result.skipped, tone: "text-muted-foreground" },
                { label: "Accuracy", value: `${result.accuracy}%`, tone: "text-foreground" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border-2 border-border bg-card px-2 py-2.5 sm:min-w-[4.75rem]">
                  <dd className={`font-mono text-lg font-black tabular-nums ${s.tone}`}>{s.value}</dd>
                  <dt className="text-xs font-medium text-muted-foreground">{s.label}</dt>
                </div>
              ))}
            </dl>
          </div>
          <div className="mt-4 flex flex-col flex-wrap gap-2 sm:flex-row">
            {onPlayQuestions && wrongQuestions.length > 0 && (
              <button type="button" onClick={() => onPlayQuestions(shuffle(wrongQuestions))} className={cn(DUO.primary, "min-h-11")}>
                <Target className="h-4 w-4" aria-hidden="true" />
                Retry {wrongQuestions.length} wrong
              </button>
            )}
            {onPlayQuestions && (
              <button
                type="button"
                onClick={() => onPlayQuestions(shuffle(state.questions))}
                className={cn(wrongQuestions.length > 0 ? DUO.secondary : DUO.primary, "min-h-11")}
              >
                <Repeat className="h-4 w-4" aria-hidden="true" />
                Same set again
              </button>
            )}
            <button
              type="button"
              onClick={onRestart}
              className={cn(DUO.primary, "min-h-11 px-5")}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              {restartLabel}
            </button>
            <button type="button" onClick={onExit} className={cn(DUO.secondary, "min-h-11 px-5")}>
              Back
            </button>
          </div>
        </section>
      )}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        {/* Question */}
        <article className="surface-card flex min-w-0 flex-1 flex-col gap-4 rounded-3xl p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="rounded-full bg-primary px-2.5 py-1 font-mono text-primary-foreground">
              Q{state.index + 1}
            </span>
            {question.subtopics[0] && (
              <span className={`rounded-full border-2 px-2.5 py-0.5 ${theme.chip}`}>
                {question.subtopics[0]}
              </span>
            )}
            {question.source && (
              <span className="rounded-full border-2 border-border bg-muted px-2.5 py-0.5 text-muted-foreground">
                {question.source}
              </span>
            )}
            {question.difficulty && (
              <span className="text-muted-foreground">{question.difficulty}</span>
            )}
          </div>

          {question.passage && (
            <details open className="group rounded-2xl border-2 border-border bg-[color-mix(in_oklab,var(--muted)_50%,var(--card))]">
              <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-bold text-foreground">
                <BookOpenText className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                Passage
                <span className="ml-auto text-xs font-medium text-muted-foreground group-open:hidden">Show</span>
                <span className="ml-auto hidden text-xs font-medium text-muted-foreground group-open:inline">Hide</span>
              </summary>
              <RichText
                text={question.passage}
                className="max-h-64 overflow-y-auto border-t-2 border-border px-4 py-3 text-sm leading-relaxed text-foreground/90"
              />
            </details>
          )}

          <RichText
            text={question.question}
            className="text-base font-medium leading-relaxed text-foreground sm:text-lg"
          />

          <div role="radiogroup" aria-label="Options" className="flex flex-col gap-2">
            {question.options.map((option) => {
              const isChosen = chosen === option.label;
              const isAnswer = option.label === question.answer;
              const tone =
                revealed && isAnswer
                  ? DUO.correct
                  : revealed && isChosen
                    ? DUO.wrong
                    : isChosen
                      ? "border-brand-500 bg-[color-mix(in_oklab,var(--brand-500)_10%,var(--card))] text-foreground"
                      : revealed
                        ? DUO.faded
                        : DUO.idle;

              return (
                <button
                  key={option.label}
                  type="button"
                  role="radio"
                  aria-checked={isChosen}
                  disabled={revealed}
                  onClick={() => dispatch({ type: "SELECT", label: option.label })}
                  className={cn(DUO.option, tone, "flex min-h-12 items-center gap-3 px-3 py-2.5 text-left text-sm font-medium sm:text-base")}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-black ${
                      revealed && isAnswer
                        ? "bg-emerald-600 text-white"
                        : revealed && isChosen
                          ? "bg-rose-600 text-white"
                          : isChosen
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {option.label}
                  </span>
                  <RichText inline text={option.text} className="min-w-0 flex-1" />
                  {revealed && isAnswer && <Check className="h-4 w-4 shrink-0 text-emerald-600" aria-label="Correct answer" />}
                  {revealed && isChosen && !isAnswer && <X className="h-4 w-4 shrink-0 text-rose-600" aria-label="Your answer, wrong" />}
                </button>
              );
            })}
          </div>

          <p role="status" aria-live="polite" className="sr-only">
            {revealed && chosen
              ? chosen === question.answer
                ? "Correct"
                : `Wrong. The correct option is ${question.answer}`
              : ""}
          </p>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t-2 border-border/70 pt-4">
            <button
              type="button"
              disabled={state.index === 0}
              onClick={() => dispatch({ type: "GOTO", index: state.index - 1 })}
              className={cn(DUO.secondary, "min-h-11 px-4")}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex flex-wrap items-center justify-end gap-2">
              {mode === "test" && !state.submitted && chosen && (
                <button
                  type="button"
                  onClick={() => dispatch({ type: "CLEAR" })}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Eraser className="h-4 w-4" aria-hidden="true" />
                  Clear
                </button>
              )}
              {mode === "test" && !state.submitted && (
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  className={cn(isLast ? DUO.primary : DUO.secondary, "min-h-11 px-4")}
                >
                  <Flag className="h-4 w-4" aria-hidden="true" />
                  Submit test
                </button>
              )}
              {practiceDone && !state.submitted && (
                <button
                  type="button"
                  onClick={() => dispatch({ type: "SUBMIT" })}
                  className={cn(DUO.success, "min-h-11 px-5")}
                >
                  See results
                </button>
              )}
              {!isLast && (
                <button
                  type="button"
                  onClick={() => dispatch({ type: "GOTO", index: state.index + 1 })}
                  className={cn(DUO.primary, "min-h-11 px-5")}
                >
                  Next
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          {revealed && (
            <details
              key={question.id}
              className="group rounded-2xl border-2 border-border bg-[color-mix(in_oklab,var(--muted)_50%,var(--card))]"
            >
              <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-bold text-foreground [&::-webkit-details-marker]:hidden">
                {!chosen ? (
                  <span className="text-muted-foreground">Not attempted · Answer: {question.answer}</span>
                ) : chosen === question.answer ? (
                  <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                    <Check className="h-4 w-4" aria-hidden="true" /> Correct
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-rose-700 dark:text-rose-300">
                    <X className="h-4 w-4" aria-hidden="true" /> Answer: {question.answer}
                  </span>
                )}
                <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-brand-700 dark:text-brand-400">
                  <span className="group-open:hidden">Show explanation</span>
                  <span className="hidden group-open:inline">Hide explanation</span>
                  <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
                </span>
              </summary>
              <div className="border-t-2 border-border px-4 py-3">
                {question.explanation ? (
                  <RichText text={question.explanation} className="text-sm leading-relaxed text-foreground/90" />
                ) : (
                  <p className="text-sm text-muted-foreground">No explanation for this question yet.</p>
                )}
              </div>
            </details>
          )}

          {confirming && (
            <div role="alertdialog" aria-label="Submit test?" className="rounded-2xl border-2 border-brand-500/40 bg-[color-mix(in_oklab,var(--brand-500)_10%,var(--card))] p-4">
              <p className="text-sm font-bold text-foreground">
                Submit the test now?
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {unanswered > 0
                  ? `${unanswered} question${unanswered === 1 ? " is" : "s are"} unanswered. Unanswered questions score 0.`
                  : "You have answered every question."}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  autoFocus
                  onClick={() => {
                    setConfirming(false);
                    dispatch({ type: "SUBMIT" });
                  }}
                  className={cn(DUO.primary, "min-h-11 px-5")}
                >
                  Yes, submit
                </button>
                <button type="button" onClick={() => setConfirming(false)} className={cn(DUO.secondary, "min-h-11 px-5")}>
                  Keep going
                </button>
              </div>
            </div>
          )}
        </article>

        {/* Question palette */}
        <nav aria-label="Questions" className="surface-card rounded-3xl lg:sticky lg:top-24 lg:w-64 lg:shrink-0 p-4 sm:p-6">
          <p className="section-label mb-3">
            Questions · {answeredCount}/{state.questions.length} answered
          </p>
          <ol className="grid grid-cols-8 gap-1.5 sm:grid-cols-10 lg:grid-cols-5">
            {state.questions.map((q, i) => (
              <li key={q.id}>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "GOTO", index: i })}
                  aria-label={`Question ${i + 1}`}
                  aria-current={i === state.index ? "true" : undefined}
                  className={`flex aspect-square w-full items-center justify-center rounded-lg border-2 font-mono text-xs font-bold transition-colors ${paletteClass(q, i)}`}
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}
