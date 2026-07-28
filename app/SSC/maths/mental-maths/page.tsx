"use client";

import React, { useState } from "react";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import { TopicCard, type RevisionConfig } from "@/components/custom/TopicCard";
import { TOPIC_ID } from "@/lib/mathGenerator";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import Loader from "@/components/custom/loader";
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
  theme: "emerald" | "violet" | "rose" | "amber" | "sky";
  topics: MathTopic[];
}

const MENTAL_MATHS_SECTIONS: MathTopicSection[] = [
  {
    id: "arithmetic",
    label: "⚡ Arithmetic",
    description: "Core speed — add, subtract, multiply, divide under pressure.",
    theme: "emerald",
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
          "Master double and triple-digit additions to speed run through data interpretation table queries.",
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
          "Develop rapid deduction instincts. Solve complex differences instantly to handle multi-step arithmetic questions with ease.",
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
          "Multiply multi-digit numbers in seconds. Dominate multiplication sprints to ace compound interest and mensuration questions.",
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
          "Master division quotients and remainders estimation. Estimate complex ratios and simplify fractions under intense time pressure.",
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
    theme: "violet",
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
          "Master squares up to 50 to accelerate compound interest, geometry area, and algebraic calculations.",
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
          "Memorize cube values up to 30 to conquer volume formulas and number series reasoning puzzles.",
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
          "Instantly find square roots of perfect squares up to 2500. Essential for Mensuration and Geometry calculations.",
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
          "Recognize perfect cube roots up to 27000 in seconds. A secret weapon for volume questions and Number System.",
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
    theme: "rose",
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
          "Solve BODMAS chains with nested brackets, percentages, squares, and roots under intense exam pressure.",
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
          "Ace rapid percentage computations and SSC fractional shortcuts. The foundation for Profit & Loss and Interest.",
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
          "Master proportional reasoning and ratio splits. Instantly find missing terms and divide quantities for Partnership & Mixtures.",
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
    posthog.capture("mental_maths_topic_selected", { topic: topicId });
    setLoadingTopic(topicId);
    router.push(`/SSC/maths/mental-maths/${topicId}`);
  };

  return (
    <TopicPageLayout
      title="Mental Maths Arena & Speed Drills"
      description="Spend 10 minutes daily here to build instinctive calculation speed so you can attempt every question before the sectional timer expires."
      contentMaxWidthClass="w-full"
    >
      <div className="flex flex-col gap-8 w-full">
        {/* Daily Warm-up Pro-Tip Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-sky-500/10 border border-emerald-500/20 p-5 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-extrabold text-lg select-none">
              💡
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-2">
                SSC Aspirant Daily Warm-Up Routine
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 uppercase">
                  10 Mins / Day
                </span>
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                With strict sectional timers in SSC CGL, you cannot afford to calculate from scratch in the exam hall. Build muscle memory for <span className="font-semibold text-foreground">Squares (up to 50)</span>, <span className="font-semibold text-foreground">Fraction-to-Percentage tables</span>, and <span className="font-semibold text-foreground">BODMAS shortcuts</span>. Mastering these high-yield drills is the secret to attempting all 25 Quant questions in 15 minutes!
              </p>
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex w-full overflow-x-auto pb-2 scrollbar-none gap-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeFilter === "all"
                ? "bg-foreground text-background shadow-md"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            All Topics
          </button>
          {MENTAL_MATHS_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveFilter(section.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeFilter === section.id
                  ? "bg-foreground text-background shadow-md"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
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
                <div className="mb-3">
                  <h3 className="text-lg font-extrabold tracking-tight text-foreground">
                    {section.label}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {section.description}
                  </p>
                </div>

                {/* Section Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                  {section.topics.map((topic, idx) => (
                    <div key={topic.id}>
                        <TopicCard
                          index={idx}
                          cols={4}
                          name={topic.name}
                          emoji={topic.emoji}
                          description={topic.description}
                          difficulty={topic.difficulty}
                          onStartClick={() => handleStart(topic.id)}
                          colorTheme="emerald"
                          revisionConfig={topic.revisionConfig}
                          stats={topic.stats}
                          badge={topic.badge}
                        />
                    </div>
                  ))}
                </div>
                </section>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {loadingTopic && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center animate-in fade-in duration-200">
          <Loader size="lg" text="Loading practice lobby..." />
        </div>
      )}
    </TopicPageLayout>
  );
};

export default MentalMaths;
