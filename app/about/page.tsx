"use client";

import Link from "next/link";
import { ArrowRight, BookOpenCheck, CalendarCheck, CloudCheck, Layers, MessageSquare, ShieldCheck, Timer, type LucideIcon } from "lucide-react";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import { DUO } from "@/features/games/buttons";
import { SubjectCards } from "@/features/landing/SubjectCards";
import { cn } from "@/lib/utils";

const PRINCIPLES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: BookOpenCheck,
    title: "Real past-paper questions",
    body: "Practice uses questions from actual SSC CGL Tier 1 papers, each with an explanation, so you learn the exam rather than a guess at it.",
  },
  {
    icon: CalendarCheck,
    title: "Little and often",
    body: "A short daily plan (a drill, a PYQ set, ten flashcards and one game) adds up to about fifteen minutes. Steady beats cramming.",
  },
  {
    icon: Layers,
    title: "Review what you get wrong",
    body: "Mistakes are saved with the right answer and come back until you get them right on two different days. Flashcards use spaced repetition.",
  },
  {
    icon: Timer,
    title: "Speed under the clock",
    body: "Timed speed drills for Quant and Reasoning build the quick, accurate working the paper's 60 minutes demand.",
  },
];

const PROMISES: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: ShieldCheck, title: "No made-up numbers", body: "We only show real counts and your real results. Pages that aren't ready say so." },
  { icon: CloudCheck, title: "Your progress follows you", body: "Sign in and your history, mistakes and daily plan sync across your devices." },
  { icon: MessageSquare, title: "Built with you", body: "Every report and idea sent from the Feedback page is read." },
];

export default function AboutPage() {
  return (
    <TopicPageLayout
      title="About EptSSC"
      description="EptSSC (Elite Prep Training for SSC) is a practice app for SSC CGL Tier 1: real questions, short daily practice and honest progress."
    >
      <div className="flex w-full flex-col gap-6 sm:gap-8">
        <section className="surface-card flex flex-col gap-4 rounded-3xl p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="max-w-2xl">
            <p className="section-label">Why it exists</p>
            <h2 className="mt-1 text-xl font-extrabold text-foreground sm:text-2xl">
              Most marks are lost to time and to mistakes made twice.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              EptSSC keeps practice short and focused on the real paper, and brings back what you got wrong until it sticks.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:w-56">
            <Link href="/practice" className={cn(DUO.primary, "w-full")}>
              Start practicing
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/dashboard" className={cn(DUO.secondary, "w-full")}>
              Today&apos;s plan
            </Link>
          </div>
        </section>

        <section aria-labelledby="how-heading" className="flex flex-col gap-3">
          <h2 id="how-heading" className="section-label">
            How EptSSC helps
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {PRINCIPLES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="surface-card flex gap-3 rounded-3xl p-4 sm:p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[color-mix(in_oklab,var(--brand-500)_12%,var(--card))] text-brand-600 dark:text-brand-400">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-extrabold text-foreground">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="sections-heading" className="flex flex-col gap-3">
          <h2 id="sections-heading" className="section-label">
            All four Tier 1 sections
          </h2>
          <SubjectCards />
        </section>

        <section aria-labelledby="promise-heading" className="surface-card rounded-3xl p-4 sm:p-6">
          <h2 id="promise-heading" className="section-label mb-3">
            Our promise
          </h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {PROMISES.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-3">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                <div>
                  <p className="font-bold text-foreground">{title}</p>
                  <p className="text-sm text-muted-foreground">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col items-start gap-3 rounded-3xl border-2 border-brand-500/30 bg-[color-mix(in_oklab,var(--brand-500)_7%,var(--card))] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="font-extrabold text-foreground">Spotted a mistake or have an idea?</p>
            <p className="text-sm text-muted-foreground">New PYQ sets, drills and features are added regularly, often from suggestions.</p>
          </div>
          <Link href="/feedback" className={cn(DUO.secondary, "w-full shrink-0 sm:w-auto")}>
            Send feedback
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </section>
      </div>
    </TopicPageLayout>
  );
}
