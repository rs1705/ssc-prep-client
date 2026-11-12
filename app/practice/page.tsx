"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Brain, Calculator, Globe2, Languages } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import SectionCardGrid from "@/components/custom/section-card/section-card-grid";
import { ExamPatternLink } from "@/components/custom/subject-overview";
import { SUBJECT_SECTIONS } from "@/lib/subject-data";
import { SUBJECT_LABEL, subjectTheme, type SubjectKey } from "@/lib/subject-theme";

const TABS: { id: SubjectKey; short: string; icon: typeof Calculator }[] = [
  { id: "maths", short: "Quant", icon: Calculator },
  { id: "english", short: "English", icon: Languages },
  { id: "reasoning", short: "Reasoning", icon: Brain },
  { id: "gk", short: "GK", icon: Globe2 },
];

export default function PracticeHomePage() {
  const [activeTab, setActiveTab] = useState<SubjectKey>("maths");
  const tabRefs = useRef<Partial<Record<SubjectKey, HTMLButtonElement | null>>>({});

  const sections = SUBJECT_SECTIONS[activeTab];
  const live = sections.filter((s) => s.linkTo !== "#").length;

  // Arrow keys move between tabs, as a tablist should.
  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (step === 0) return;
    e.preventDefault();
    const next = TABS[(index + step + TABS.length) % TABS.length].id;
    setActiveTab(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <TopicPageLayout
      title="Practice Hub"
      description="Every subject in one place. Pick a section of the paper and jump straight into a drill, a deck or a game."
    >
      <div className="flex w-full flex-col gap-6 sm:gap-8">
        {/* Subject tabs: the selected tab takes its subject's colour. */}
        <div
          role="tablist"
          aria-label="Subjects"
          className="grid w-full grid-cols-2 gap-2 lg:grid-cols-4"
        >
          {TABS.map((tab, index) => {
            const active = activeTab === tab.id;
            const theme = subjectTheme(tab.id);
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[tab.id] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={active}
                aria-controls="practice-panel"
                tabIndex={active ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(e) => onKeyDown(e, index)}
                className={`flex min-h-12 items-center justify-center gap-2 rounded-2xl border-2 px-3 py-2 text-sm font-bold transition-all duration-200 ${
                  active
                    ? theme.solid
                    : `border-border bg-card text-muted-foreground hover:text-foreground ${theme.hoverBorder} ${theme.hoverBg}`
                }`}
              >
                <tab.icon
                  className={`h-4 w-4 shrink-0 ${active ? "" : theme.text}`}
                  aria-hidden="true"
                />
                <span className="truncate sm:hidden">{tab.short}</span>
                <span className="hidden truncate sm:inline">{SUBJECT_LABEL[tab.id]}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            role="tabpanel"
            id="practice-panel"
            aria-labelledby={`tab-${activeTab}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex w-full flex-col gap-5"
          >
            <ExamPatternLink subject={activeTab} />

            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 className="text-lg font-extrabold text-foreground">Practice modes</h2>
              <Link
                href={`/SSC/${activeTab}`}
                className="inline-flex items-center gap-1 py-1 text-sm font-semibold text-brand-700 hover:underline dark:text-brand-400"
              >
                {live} live · see the full syllabus
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>

            <SectionCardGrid sections={sections} />
          </motion.div>
        </AnimatePresence>
      </div>
    </TopicPageLayout>
  );
}
