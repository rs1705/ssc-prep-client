"use client";

import React, { useState } from "react";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import SectionCardGrid from "@/components/custom/section-card/section-card-grid";
import { SUBJECT_SECTIONS } from "@/lib/subject-data";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calculator, Languages, Newspaper, Sigma } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TAB_DATA = [
  {
    id: "maths",
    label: "Mathematics",
    icon: Calculator,
    sections: SUBJECT_SECTIONS.maths,
    theme: "emerald",
    bgClass: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20",
    textClass: "text-emerald-600 dark:text-emerald-400",
    iconBgClass: "bg-emerald-500/10",
  },
  {
    id: "english",
    label: "English",
    icon: Languages,
    sections: SUBJECT_SECTIONS.english,
    theme: "violet",
    bgClass: "from-violet-500/10 to-violet-500/5 border-violet-500/20",
    textClass: "text-violet-600 dark:text-violet-400",
    iconBgClass: "bg-violet-500/10",
  },
  {
    id: "gk",
    label: "General Knowledge",
    icon: Newspaper,
    sections: SUBJECT_SECTIONS.gk,
    theme: "rose",
    bgClass: "from-rose-500/10 to-rose-500/5 border-rose-500/20",
    textClass: "text-rose-600 dark:text-rose-400",
    iconBgClass: "bg-rose-500/10",
  },
  {
    id: "reasoning",
    label: "Reasoning",
    icon: Sigma,
    sections: SUBJECT_SECTIONS.reasoning,
    theme: "amber",
    bgClass: "from-amber-500/10 to-amber-500/5 border-amber-500/20",
    textClass: "text-amber-600 dark:text-amber-400",
    iconBgClass: "bg-amber-500/10",
  },
];

export default function PracticeHomePage() {
  const [activeTab, setActiveTab] = useState("maths");

  return (
    <TopicPageLayout
      title="Practice Hub"
      description="Your central command for all subjects. Jump straight into drills, flashcards, and mock tests."
      hideBreadcrumbs={true}
    >
      <div className="w-full mt-2 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-700" style={{ animationFillMode: "both" }}>
        <Tabs defaultValue="maths" value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col gap-8">
          <div className="flex w-full justify-start overflow-x-auto pb-2 scrollbar-none">
            <TabsList className="h-13 p-1.5 bg-card/95 md:bg-card/60 backdrop-blur-none md:backdrop-blur-xl border border-border/40 rounded-2xl shadow-xs gap-1">
              {TAB_DATA.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="h-full rounded-xl px-5 font-bold text-xs sm:text-sm tracking-tight transition-all data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-md cursor-pointer"
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="relative min-h-[500px]">
            <AnimatePresence mode="wait">
              {TAB_DATA.map((tab) => 
                activeTab === tab.id && (
                  <TabsContent key={tab.id} value={tab.id} className="mt-0 outline-none" asChild forceMount>
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="flex flex-col gap-8 w-full"
                    >
                      {/* Subject Banner */}
                      <div className={`w-full rounded-3xl border bg-card/95 md:bg-card/60 backdrop-blur-none md:backdrop-blur-2xl ${tab.bgClass} p-5 sm:p-6 sm:px-7 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-xl shadow-black/5 overflow-hidden relative noise-overlay`}>
                        {/* Decorative background blobs */}
                        <div className={`absolute -right-10 -top-10 w-36 h-36 sm:w-44 sm:h-44 rounded-full blur-3xl opacity-60 pointer-events-none ${tab.iconBgClass}`} />
                        <div className={`absolute right-40 -bottom-10 w-28 h-28 sm:w-36 sm:h-36 rounded-full blur-3xl opacity-40 pointer-events-none ${tab.iconBgClass}`} />
                        
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${tab.iconBgClass} flex items-center justify-center shrink-0 shadow-inner ring-1 ring-border/50`}>
                          <tab.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${tab.textClass}`} strokeWidth={2} />
                        </div>
                        <div className="z-10">
                          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground mb-1">{tab.label}</h2>
                          <p className="text-xs sm:text-sm font-mono font-medium text-muted-foreground flex items-center gap-2">
                            <span className="flex h-2 w-2 relative">
                              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${tab.iconBgClass.replace('bg-', 'bg-').replace('/10', '')}`}></span>
                              <span className={`relative inline-flex rounded-full h-2 w-2 ${tab.iconBgClass.replace('bg-', 'bg-').replace('/10', '')}`}></span>
                            </span>
                            {tab.sections.length} ACTIVE PRACTICE MODULES
                          </p>
                        </div>
                      </div>

                      {/* Content Grid */}
                      <SectionCardGrid sections={tab.sections} />
                    </motion.div>
                  </TabsContent>
                )
              )}
            </AnimatePresence>
          </div>
        </Tabs>
      </div>
    </TopicPageLayout>
  );
}
