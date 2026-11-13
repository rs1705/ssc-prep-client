"use client";

import React, { useState } from "react";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import { TopicCard, type RevisionConfig } from "@/components/custom/TopicCard";
import { TOPIC_ID } from "@/lib/mathGenerator";
import { useRouter } from "next/navigation";
import { track } from "@/lib/analytics";
import { motion, AnimatePresence } from "framer-motion";

interface MathTopic {
  id: string;
  name: string;
  emoji: React.ReactNode;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  stats: string;
  revisionConfig?: RevisionConfig;
  badge?: string;
}

interface MathTopicSection {
  id: string;
  label: string;
  description: string;
  theme: "sky";
  badge?: string;
  topics: MathTopic[];
}

const MENTAL_MATHS_SECTIONS: MathTopicSection[] = [
  {
    id: "ultimate",
    label: "🔥 Ultimate Challenge",
    description:
      "The final frontier. A relentless, randomized onslaught of questions across all topics and difficulties.",
    theme: "sky",
    badge: "✨ NEW",
    topics: [
      {
        id: TOPIC_ID.MIXED,
        name: "Mix Blitz",
        emoji: (
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        ),
        description:
          "Rapid-fire calculation across all topics. Build ultimate cognitive agility.",
        difficulty: "Hard",
        stats: "All Topics",
        badge: "⚡ Ultimate",
      },
    ],
  },
  {
    id: "arithmetic",
    label: "⚡ Arithmetic",
    description: "Core speed — add, subtract, multiply, divide under pressure.",
    theme: "sky",
    topics: [
      {
        id: TOPIC_ID.ADDITION,
        name: "Addition",
        emoji: (
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        ),
        description:
          "Drill 2-3 digit sums. Stop using pen and paper for basic arithmetic.",
        difficulty: "Easy",
        stats: "2-3 Digits",
      },
      {
        id: TOPIC_ID.SUBTRACTION,
        name: "Subtraction",
        emoji: (
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        ),
        description:
          "Master carry-overs and rapid differences in your head.",
        difficulty: "Easy",
        stats: "2-3 Digits",
      },
      {
        id: TOPIC_ID.MULTIPLICATION,
        name: "Multiplication",
        emoji: (
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ),
        description:
          "Crush 2-digit multiplications. Essential for compound interest tricks.",
        difficulty: "Hard",
        stats: "2-3 Digits",
      },
      {
        id: TOPIC_ID.DIVISION,
        name: "Division",
        emoji: (
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <circle cx="12" cy="6" r="1.5" fill="currentColor" />
            <circle cx="12" cy="18" r="1.5" fill="currentColor" />
          </svg>
        ),
        description:
          "Instantly estimate quotients. Crucial for data interpretation (DI).",
        difficulty: "Hard",
        stats: "2-3 Digits",
      },
    ],
  },
  {
    id: "powers-roots",
    label: "🔢 Powers & Roots",
    description:
      "Instant recall of squares, cubes, and their inverses — the backbone of Geometry & Mensuration.",
    theme: "sky",
    topics: [
      {
        id: TOPIC_ID.SQUARES,
        name: "Squares",
        emoji: (
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 12h18M12 3v18" />
          </svg>
        ),
        description:
          "Memorize 1-50. The absolute backbone of mensuration and series.",
        difficulty: "Easy",
        stats: "1-50",
        badge: "🔥 High Yield",
        revisionConfig: {
          type: "square",
          ranges: [
            { label: "Easy", range: "2 - 12", min: 2, max: 12 },
            { label: "Medium", range: "13 - 29", min: 13, max: 29 },
            { label: "Hard", range: "30 - 50", min: 30, max: 50 },
          ],
        },
      },
      {
        id: TOPIC_ID.CUBES,
        name: "Cubes",
        emoji: (
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        ),
        description:
          "Lock in 1-30. Essential for fast compound interest calculations.",
        difficulty: "Medium",
        stats: "1-30",
        revisionConfig: {
          type: "cube",
          ranges: [
            { label: "Easy", range: "2 - 10", min: 2, max: 10 },
            { label: "Medium", range: "11 - 20", min: 11, max: 20 },
            { label: "Hard", range: "21 - 30", min: 21, max: 30 },
          ],
        },
      },
      {
        id: TOPIC_ID.SQUARE_ROOTS,
        name: "Square Roots",
        emoji: (
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12h2l3 7 4-14h9" />
          </svg>
        ),
        description:
          "Instantly recognize perfect squares to save seconds in algebra.",
        difficulty: "Easy",
        stats: "1-50 Roots",
        badge: "💡 Speed Boost",
      },
      {
        id: TOPIC_ID.CUBE_ROOTS,
        name: "Cube Roots",
        emoji: (
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12h2l3 7 4-14h9" />
            <text x="17" y="10" fontSize="8" fontWeight="bold" fill="currentColor">3</text>
          </svg>
        ),
        description:
          "Spot cube roots instantly. A lifesaver for number series.",
        difficulty: "Medium",
        stats: "1-30 Roots",
      },
    ],
  },
  {
    id: "applied",
    label: "📊 Applied Math",
    description:
      "BODMAS chains, percentage shortcuts, and ratio splits — the skills that win SSC CGL.",
    theme: "sky",
    badge: "✨ NEW",
    topics: [
      {
        id: TOPIC_ID.SIMPLIFICATION,
        name: "Simplification",
        emoji: (
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ),
        description:
          "Master bracket logic and signs. Never lose a free BODMAS mark.",
        difficulty: "Hard",
        stats: "BODMAS",
        badge: "🔥 High Yield",
      },
      {
        id: TOPIC_ID.PERCENTAGE,
        name: "Percentages",
        emoji: (
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="5" x2="5" y2="19" />
            <circle cx="7" cy="7" r="2.5" />
            <circle cx="17" cy="17" r="2.5" />
          </svg>
        ),
        description:
          "Drill standard fractions (1/2 to 1/11). The cheat code for Arithmetic.",
        difficulty: "Medium",
        stats: "Speed Calc",
        badge: "⭐ Must Master",
        revisionConfig: {
          type: "percentage",
          ranges: [
            { label: "Easy", range: "Core (1/2 to 1/5)", min: 0, max: 8 },
            { label: "Medium", range: "1/6, 1/7 & 1/8 Families", min: 9, max: 20 },
            { label: "Hard", range: "1/9, 1/11 & Advanced", min: 21, max: 41 },
          ],
        },
      },
      {
        id: TOPIC_ID.RATIO,
        name: "Ratios",
        emoji: (
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="3" x2="12" y2="21" />
            <line x1="3" y1="7" x2="21" y2="7" />
            <path d="M6 7l-3 6h6l-3-6M18 7l-3 6h6l-3-6M12 21h8M4 21h8" />
          </svg>
        ),
        description:
          "Speed-split values across ratios. The foundation of mixtures and ages.",
        difficulty: "Medium",
        stats: "Proportions",
      },
    ],
  },
];

const MentalMaths = () => {
  const router = useRouter();
  const [loadingTopic, setLoadingTopic] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const handleStart = (topicId: string) => {
    track("mental_maths_topic_selected", { topic: topicId });
    setLoadingTopic(topicId);
    router.push(`/SSC/maths/mental-maths/${topicId}`);
  };

  return (
    <TopicPageLayout
      title="Speed Math"
      description="Spend 10 minutes daily here to build instinctive calculation speed so you can attempt every question before the sectional timer expires."
      contentMaxWidthClass="w-full"
    >
      <div className="flex flex-col xl:flex-row gap-6 sm:gap-8 w-full">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-6 w-full min-w-0">

        {/* Filter Chips */}
        <div className="flex w-full overflow-x-auto pb-2 scrollbar-none gap-1.5 surface-card p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveFilter("all")}
            className={`flex-shrink-0 min-h-10 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeFilter === "all"
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            All Topics
          </button>
          {MENTAL_MATHS_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveFilter(section.id)}
              className={`flex-shrink-0 min-h-10 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeFilter === section.id
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        <div className="relative w-full min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col gap-8 w-full"
            >
              {MENTAL_MATHS_SECTIONS.filter((s) => activeFilter === "all" || activeFilter === s.id).map((section) => (
                <section 
                  key={section.id} 
                  className="w-full"
                >
                {/* Section Header */}
                <div className="mb-3.5">
                  <h3 className="text-lg sm:text-xl font-black tracking-tight text-foreground flex items-center gap-2">
                    {section.label}
                    {section.badge && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[color-mix(in_oklab,var(--brand-500)_15%,var(--card))] text-brand-600 dark:text-brand-400 border-2 border-brand-500/25 shadow-xs uppercase tracking-wider">
                        {section.badge}
                      </span>
                    )}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed font-medium">
                    {section.description}
                  </p>
                </div>

                {/* Section Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 w-full">
                  {section.topics.map((topic, idx) => {
                    const isMixBlitz = topic.id === TOPIC_ID.MIXED;
                    const isTwoCol = section.topics.length === 2 || section.topics.length === 4;
                    const isThreeCol = section.topics.length === 3;
                    
                    const spanClass = isMixBlitz 
                      ? "lg:col-span-12" 
                      : isTwoCol
                        ? "lg:col-span-6"
                        : isThreeCol
                          ? "lg:col-span-4"
                          : "lg:col-span-4";
                    
                    return (
                      <div key={topic.id} className={spanClass}>
                          <TopicCard
                            index={idx}
                            cols={isMixBlitz ? 1 : isTwoCol ? 2 : 3}
                            name={topic.name}
                            emoji={topic.emoji}
                            description={topic.description}
                            difficulty={topic.difficulty}
                            onStartClick={() => handleStart(topic.id)}
                            isStarting={loadingTopic === topic.id}
                            startDisabled={loadingTopic !== null}
                            colorTheme={section.theme}
                            revisionConfig={topic.revisionConfig}
                            stats={topic.stats}
                            badge={topic.badge}
                          />
                      </div>
                    );
                  })}
                </div>
                </section>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        </div>

        {/* Right Rail - Stats & Streak Panel (Desktop Only) */}
        <div className="hidden xl:flex w-80 flex-col gap-6 shrink-0 animate-in fade-in slide-in-from-right-4 duration-500">
          {/* Quant on the real paper */}
          <div className="surface-card rounded-3xl flex flex-col gap-4 p-4 sm:p-6">
            <h3 className="section-label">Quant in SSC CGL Tier 1</h3>
            <dl className="grid grid-cols-3 gap-2 text-center">
              {[
                { value: "25", label: "Questions" },
                { value: "50", label: "Marks" },
                { value: "−0.50", label: "Per wrong" },
              ].map((fact) => (
                <div key={fact.label} className="rounded-2xl bg-[color-mix(in_oklab,var(--muted)_70%,var(--card))] px-2 py-3">
                  <dd className="font-mono text-lg font-black tabular-nums leading-none text-foreground">
                    {fact.value}
                  </dd>
                  <dt className="mt-1 text-xs font-medium text-muted-foreground">{fact.label}</dt>
                </div>
              ))}
            </dl>
            <p className="text-xs leading-relaxed text-muted-foreground">
              All four sections share one 60-minute clock, so every second saved on
              calculation is a second for another question.
            </p>
          </div>

          {/* How drills work */}
          <div className="surface-card rounded-3xl flex flex-col gap-4 p-4 sm:p-6">
            <h3 className="section-label">How drills work</h3>
            <ul className="flex flex-col gap-3 text-sm text-foreground">
              {[
                { title: "Timed", text: "Race a 30, 60 or 90 second clock." },
                { title: "Freestyle", text: "A fixed set of questions, no clock." },
                { title: "Three levels", text: "Easy, Medium and Hard, or mix them all." },
                { title: "Review", text: "Every attempt is listed after the drill." },
              ].map((row) => (
                <li key={row.title} className="flex gap-3">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  <span>
                    <span className="font-bold">{row.title}.</span>{" "}
                    <span className="text-muted-foreground">{row.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Daily Warm-up Pro-Tip Banner */}
          <div className="rounded-3xl border-2 border-sky-500/25 bg-[color-mix(in_oklab,var(--color-sky-500)_6%,var(--card))] p-6 flex flex-col gap-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <span className="text-base">💡</span> Pro Tip
            </h3>
            <div className="space-y-2 z-10">
              <h4 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-2">
                Daily Warm-Up
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-bold tracking-wider bg-[color-mix(in_oklab,var(--color-sky-500)_15%,var(--card))] text-sky-700 dark:text-sky-300 uppercase border-2 border-sky-500/25">
                  10 Mins
                </span>
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                Sectional timers give you zero room for manual scratch work. Lock in <span className="font-bold text-foreground">Squares</span>, <span className="font-bold text-foreground">Fractions</span>, and <span className="font-bold text-foreground">BODMAS</span> to solve 25 Quant questions in 15 mins.
              </p>
            </div>
          </div>
        </div>
      </div>

    </TopicPageLayout>
  );
};

export default MentalMaths;
