"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { DUO } from "@/features/games/buttons";
import { subjectTheme, type SubjectKey } from "@/lib/subject-theme";
import { cn } from "@/lib/utils";
import { ChoiceOption, choiceState } from "@/features/pyq/ChoiceOption";

interface SampleQuestion {
  subject: SubjectKey;
  topic: string;
  source: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

/** Real questions from past SSC CGL Tier 1 papers, copied from the question bank. */
const SAMPLES: SampleQuestion[] = [
  {
    subject: "maths",
    topic: "Arithmetic",
    source: "SSC CGL Tier 1 · 2024",
    question: "Without doing the actual division, find the remainder when 28735429 is divided by 9.",
    options: ["4", "8", "2", "9"],
    answer: 0,
    explanation: "A number leaves the same remainder on division by 9 as the sum of its digits. 2+8+7+3+5+4+2+9 = 40, and 40 = 9 × 4 + 4, so the remainder is 4.",
  },
  {
    subject: "english",
    topic: "Vocabulary",
    source: "SSC CGL Tier 1 · 2024",
    question: "Select the INCORRECTLY spelt word.",
    options: ["Allocation", "Abismal", "Aversion", "Allegation"],
    answer: 1,
    explanation: "The correct spelling is “Abysmal”, meaning extremely bad. Allocation, Aversion and Allegation are all spelt correctly.",
  },
  {
    subject: "reasoning",
    topic: "Verbal Reasoning",
    source: "SSC CGL Tier 1 · 2025",
    question: "Identify the odd one: 2, 3, 5, 7, 11, 13, 17, 20",
    options: ["17", "13", "20", "11"],
    answer: 2,
    explanation: "Every number except 20 is a prime. 20 is composite: it divides by 2, 4, 5 and 10.",
  },
  {
    subject: "gk",
    topic: "Static GK",
    source: "SSC CGL Tier 1 · 2024",
    question: "At which Olympics did Gagan Narang win a bronze medal?",
    options: ["Beijing 2008", "London 2012", "Athens 2004", "Rio 2016"],
    answer: 1,
    explanation: "Gagan Narang won bronze in the men's 10 m air rifle at London 2012. He did not medal at the other Games listed.",
  },
  {
    subject: "maths",
    topic: "Algebra",
    source: "SSC CGL Tier 1 · 2025",
    question: "The line y = mx + 5 passes through the point (1, 8). Find m.",
    options: ["5", "4", "3", "2"],
    answer: 2,
    explanation: "Put x = 1 and y = 8 into y = mx + 5: 8 = m + 5, so m = 3.",
  },
  {
    subject: "english",
    topic: "Spelling",
    source: "SSC CGL Tier 1 · 2024",
    question: "Select the correctly spelled sentence.",
    options: [
      "I will definitely attend the conference.",
      "I will definetely attend the conference.",
      "I will definately attend the conference.",
      "I will definitly attend the conference.",
    ],
    answer: 0,
    explanation: "The adverb is spelled “definitely”. Definetely, definately and definitly are common misspellings.",
  },
  {
    subject: "reasoning",
    topic: "Blood Relations",
    source: "SSC CGL Tier 1 · 2025",
    question: "Pointing to a woman, John says, “She is the wife of my uncle's only son.” How is the woman related to John?",
    options: ["Sister", "Cousin", "Sister-in-law", "Niece"],
    answer: 2,
    explanation: "John's uncle's only son is John's cousin, and the wife of one's cousin is one's sister-in-law.",
  },
  {
    subject: "gk",
    topic: "Geography",
    source: "SSC CGL Tier 1 · 2024",
    question: "In which part of India does the hot wind ‘Loo’ blow?",
    options: ["South and Southwestern", "East and Northeastern", "West and Southwestern", "North and Northwestern"],
    answer: 3,
    explanation: "The Loo is a hot, dry summer wind over the northern plains (Rajasthan, Punjab, Haryana, Delhi, Uttar Pradesh) in May and June.",
  },
];

const LABEL: Record<SubjectKey, string> = { maths: "Quant", english: "English", reasoning: "Reasoning", gk: "GK" };

/** Landing-page mini quiz: eight real PYQs, two per section, then a result. */
export function TryQuestion() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => SAMPLES.map(() => null));
  const [finished, setFinished] = useState(false);

  const q = SAMPLES[index];
  const chosen = answers[index];
  const answered = chosen !== null;
  const right = chosen === q.answer;
  const isLast = index === SAMPLES.length - 1;
  const doneCount = answers.filter((a) => a !== null).length;
  const theme = subjectTheme(q.subject);

  const choose = (option: number) => {
    if (answered) return;
    setAnswers((prev) => prev.map((a, i) => (i === index ? option : a)));
  };
  const restart = () => {
    setAnswers(SAMPLES.map(() => null));
    setIndex(0);
    setFinished(false);
  };

  if (finished) {
    const score = SAMPLES.filter((s, i) => answers[i] === s.answer).length;
    const bySection = (["maths", "reasoning", "english", "gk"] as SubjectKey[]).map((key) => {
      const items = SAMPLES.map((s, i) => ({ s, i })).filter(({ s }) => s.subject === key);
      return { key, right: items.filter(({ s, i }) => answers[i] === s.answer).length, total: items.length };
    });
    const verdict =
      score === SAMPLES.length
        ? "Perfect score!"
        : score >= 6
          ? "Great start!"
          : score >= 4
            ? "Good effort!"
            : "Every topper started somewhere.";
    return (
      <section aria-label="Your result" className="surface-card w-full rounded-3xl p-4 text-left shadow-xl shadow-black/5 sm:p-6">
        <p className="section-label">Your result</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-mono text-5xl font-black tabular-nums text-foreground">{score}</span>
          <span className="font-mono text-xl font-bold text-muted-foreground">/ {SAMPLES.length}</span>
        </div>
        <p className="mt-1 text-lg font-extrabold text-foreground">{verdict}</p>
        <p className="text-sm text-muted-foreground">
          These were real SSC CGL Tier 1 questions. The app has many more, each with an explanation.
        </p>

        <ul className="mt-4 grid grid-cols-2 gap-2">
          {bySection.map(({ key, right: r, total }) => {
            const t = subjectTheme(key);
            return (
              <li key={key} className="flex items-center justify-between gap-2 rounded-2xl border-2 border-border bg-card px-3 py-2">
                <span className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <span className={cn("h-2.5 w-2.5 rounded-full", t.dot)} aria-hidden="true" />
                  {LABEL[key]}
                </span>
                <span
                  className={cn(
                    "font-mono text-sm font-black tabular-nums",
                    r === total ? "text-emerald-700 dark:text-emerald-300" : "text-muted-foreground",
                  )}
                >
                  {r}/{total}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 flex gap-2">
          <Link href="/practice" className={cn(DUO.primary, "min-h-12 flex-1 px-3")}>
            Practice more
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <button type="button" onClick={restart} className={cn(DUO.secondary, "min-h-12 px-4")}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Try again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Try real questions" className="surface-card w-full rounded-3xl p-4 text-left shadow-xl shadow-black/5 sm:p-6">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="section-label">Try 8 real questions</span>
        <span className={cn("rounded-full border-2 px-2.5 py-0.5 text-xs font-bold", theme.chip)}>
          {LABEL[q.subject]} · {q.topic}
        </span>
        <span className="ml-auto font-mono text-xs font-bold tabular-nums text-muted-foreground">
          {index + 1}/{SAMPLES.length}
        </span>
      </div>

      {/* One segment per question: green right, red wrong, faint for the current one. */}
      <div className="mb-4 flex gap-1" aria-hidden="true">
        {SAMPLES.map((s, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full",
              answers[i] === null
                ? i === index
                  ? "bg-brand-500/40"
                  : "bg-muted"
                : answers[i] === s.answer
                  ? "bg-emerald-500"
                  : "bg-rose-500",
            )}
          />
        ))}
      </div>

      <p className="mb-1 text-xs font-medium text-muted-foreground">{q.source}</p>
      <p className="mb-4 text-base font-bold leading-relaxed text-foreground sm:text-lg">{q.question}</p>

      <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Options">
        {q.options.map((option, i) => (
          <ChoiceOption
            key={option}
            label={String.fromCharCode(65 + i)}
            state={choiceState({ revealed: answered, isAnswer: i === q.answer, isChosen: chosen === i })}
            role="radio"
            aria-checked={chosen === i}
            disabled={answered}
            onClick={() => choose(i)}
          >
            {option}
          </ChoiceOption>
        ))}
      </div>

      <div aria-live="polite">
        {answered && (
          <div className="mt-4 rounded-2xl border-2 border-border bg-[color-mix(in_oklab,var(--muted)_50%,var(--card))] p-3">
            <p
              className={cn(
                "mb-1 text-sm font-extrabold",
                right ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300",
              )}
            >
              {right ? "Correct!" : `Not quite: the answer is ${String.fromCharCode(65 + q.answer)}.`}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">{q.explanation}</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIndex((i) => i - 1)}
          disabled={index === 0}
          aria-label="Previous question"
          className={cn(DUO.icon, "disabled:opacity-40")}
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        {isLast && doneCount === SAMPLES.length ? (
          <button type="button" onClick={() => setFinished(true)} className={cn(DUO.success, "min-h-11 flex-1 px-3 text-xs")}>
            See my result
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : isLast ? (
          <p className="flex-1 text-center text-xs text-muted-foreground">
            Answer all {SAMPLES.length} to see your result ({doneCount} done)
          </p>
        ) : (
          <button
            type="button"
            onClick={() => setIndex((i) => i + 1)}
            className={cn(answered ? DUO.primary : DUO.secondary, "min-h-11 flex-1 px-3 text-xs")}
          >
            {answered ? "Next question" : "Skip for now"}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </section>
  );
}
