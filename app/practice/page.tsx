"use client";

import React, { useState } from "react";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import SectionCardGrid from "@/components/custom/section-card/section-card-grid";
import { SUBJECT_SECTIONS } from "@/lib/subject-data";
import { SUBJECT_LABEL, type SubjectKey } from "@/lib/subject-theme";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Link from "next/link";
import { ArrowUpRight, Calculator, Languages, Newspaper, Sigma } from "lucide-react";
import { ExamPatternStrip } from "@/components/custom/subject-overview";
import { motion, AnimatePresence } from "framer-motion";

const TAB_ORDER: { id: SubjectKey; short: string; icon: typeof Calculator }[] = [
  { id: "maths", short: "Maths", icon: Calculator },
  { id: "english", short: "English", icon: Languages },
  { id: "gk", short: "GK", icon: Newspaper },
  { id: "reasoning", short: "Reasoning", icon: Sigma },
];

export default function PracticeHomePage() {
  const [activeTab, setActiveTab] = useState<SubjectKey>("maths");

  return (
    <TopicPageLayout
      title="Practice Hub"
      description="Every subject in one place. Pick a section of the paper and jump straight into a drill, a deck or a game."
    >
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as SubjectKey)}
        className="w-full flex flex-col gap-6"
      >
        <TabsList className="grid h-auto w-full grid-cols-4 gap-1 rounded-2xl surface-card p-1.5 sm:inline-flex sm:w-fit">
          {TAB_ORDER.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="h-11 min-w-0 flex-col gap-0.5 rounded-xl px-2 text-xs font-bold tracking-tight transition-all data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-md sm:flex-row sm:gap-2 sm:px-5 sm:text-sm"
            >
              <tab.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate sm:hidden">{tab.short}</span>
              <span className="hidden sm:inline">{SUBJECT_LABEL[tab.id]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <AnimatePresence mode="wait">
          {TAB_ORDER.map((tab) => {
            if (activeTab !== tab.id) return null;
            const sections = SUBJECT_SECTIONS[tab.id];
            const live = sections.filter((s) => s.linkTo !== "#").length;

            return (
              <TabsContent
                key={tab.id}
                value={tab.id}
                className="mt-0 outline-none"
                asChild
                forceMount
              >
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="flex w-full flex-col gap-5"
                >
                  <ExamPatternStrip subject={tab.id} />

                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h2 className="text-lg font-extrabold text-foreground">Practice modes</h2>
                    <Link
                      href={`/SSC/${tab.id}`}
                      className="inline-flex items-center gap-1 py-1 text-sm font-semibold text-amber-700 hover:underline dark:text-amber-400"
                    >
                      {live} live · see the full syllabus
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>

                  <SectionCardGrid sections={sections} />
                </motion.div>
              </TabsContent>
            );
          })}
        </AnimatePresence>
      </Tabs>
    </TopicPageLayout>
  );
}
