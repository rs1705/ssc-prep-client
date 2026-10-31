"use client";

import React, { useState } from "react";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import SectionCardGrid from "@/components/custom/section-card/section-card-grid";
import { SUBJECT_SECTIONS } from "@/lib/subject-data";
import {
  SUBJECT_HUE,
  SUBJECT_LABEL,
  HUE_THEME,
  type SubjectKey,
} from "@/lib/subject-theme";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calculator, Languages, Newspaper, Sigma } from "lucide-react";
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
      description="Your central command for all subjects. Jump straight into drills, flashcards, and mock tests."
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
            const theme = HUE_THEME[SUBJECT_HUE[tab.id]];
            const sections = SUBJECT_SECTIONS[tab.id];
            const live = sections.filter((s) => s.linkTo !== "#").length;
            const upcoming = sections.length - live;

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
                  className="flex w-full flex-col gap-6"
                >
                  <div
                    className={`relative flex w-full items-center gap-4 overflow-hidden rounded-3xl border-2 bg-gradient-to-br p-5 sm:p-6 ${theme.banner}`}
                  >
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ring-border/60 sm:h-14 sm:w-14 ${theme.iconWrap}`}
                    >
                      <tab.icon className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
                        {SUBJECT_LABEL[tab.id]}
                      </h2>
                      <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono font-semibold text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <span className={`h-2 w-2 rounded-full ${theme.dot}`} />
                          {live} live
                        </span>
                        {upcoming > 0 && <span>{upcoming} coming soon</span>}
                      </p>
                    </div>
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
