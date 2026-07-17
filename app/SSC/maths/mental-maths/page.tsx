"use client";

import React, { useState } from "react";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import { TopicCard, type RevisionConfig } from "@/components/custom/TopicCard";
import { useRouter } from "next/navigation";
import Loader from "@/components/custom/loader";

interface MathTopic {
  id: string;
  name: string;
  emoji: React.ReactNode;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  stats: string;
  revisionConfig?: RevisionConfig;
}

const MENTAL_MATHS_TOPICS: MathTopic[] = [
  {
    id: "squares",
    name: "Squares",
    emoji: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 12h18M12 3v18" />
      </svg>
    ),
    description: "Master squares up to 50 to accelerate compound interest, geometry area, and algebraic calculations.",
    difficulty: "Easy",
    stats: "1-50 Range",
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
    id: "cubes",
    name: "Cubes",
    emoji: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    description: "Memorize cube values up to 30 to conquer volume formulas and number series reasoning puzzles.",
    difficulty: "Medium",
    stats: "1-30 Range",
    revisionConfig: {
      type: "cube",
      ranges: [
        { label: "Easy", range: "2 - 10", min: 2, max: 10 },
        { label: "Medium", range: "11 - 20", min: 11, max: 20 },
        { label: "Hard", range: "21 - 30", min: 21, max: 30 },
      ],
    },
  },
  /*
  {
    id: "tables",
    name: "Tables Practice",
    emoji: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
      </svg>
    ),
    description: "Establish bedrock arithmetic speed. Memorize multiplication tables up to 30 to instantly identify factors and speed up division.",
    difficulty: "Easy",
    stats: "1-30 Tables",
    // revisionConfig: {
    //   type: "table",
    //   ranges: [
    //     { label: "Easy", range: "2 - 10", min: 2, max: 10 },
    //     { label: "Medium", range: "11 - 20", min: 11, max: 20 },
    //     { label: "Hard", range: "21 - 30", min: 21, max: 30 },
    //   ],
    // },
  },
  */
  {
    id: "addition",
    name: "Addition",
    emoji: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
    description: "Master double and triple-digit additions to speed run through data interpretation table queries.",
    difficulty: "Easy",
    stats: "2-3 Digits",
  },
  /*
  {
    id: "subtraction",
    name: "Subtraction",
    emoji: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
    description: "Develop rapid deduction instincts. Solve complex differences instantly to handle multi-step arithmetic questions with ease.",
    difficulty: "Easy",
    stats: "2-3 Digits",
  },
  {
    id: "division",
    name: "Division",
    emoji: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <circle cx="12" cy="6" r="1.5" fill="currentColor" />
        <circle cx="12" cy="18" r="1.5" fill="currentColor" />
      </svg>
    ),
    description: "Master division quotients and remainders estimation. Estimate complex ratios and simplify fractions under intense time pressure.",
    difficulty: "Hard",
    stats: "Quotients",
  },
  {
    id: "multiplication",
    name: "Multiplication",
    emoji: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
    description: "Multiply multi-digit numbers in seconds. Dominate multiplication sprints to ace compound interest and mensuration questions.",
    difficulty: "Hard",
    stats: "Speed Matrix",
  },
  {
    id: "fractions",
    name: "Fractions & Decimals",
    emoji: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a10 10 0 0 1 10 10H12V2z" fill="currentColor" fillOpacity="0.2" />
        <path d="M12 2v20M2 12h20" />
      </svg>
    ),
    description: "Convert fractions to decimal ratios instantly. Memorize key fraction-to-decimal pairings to solve simplification puzzles faster.",
    difficulty: "Medium",
    stats: "Conversions",
  },
  {
    id: "percentages",
    name: "Percentages",
    emoji: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="5" x2="5" y2="19" />
        <circle cx="7" cy="7" r="2.5" />
        <circle cx="17" cy="17" r="2.5" />
      </svg>
    ),
    description: "Ace rapid percentage increments, decrements, and successive changes. The ultimate tool for Profit & Loss and Simple Interest.",
    difficulty: "Medium",
    stats: "Base Scale",
  },
  {
    id: "ratios",
    name: "Ratios & Scales",
    emoji: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="3" x2="12" y2="21" />
        <line x1="3" y1="7" x2="21" y2="7" />
        <path d="M6 7l-3 6h6l-3-6M18 7l-3 6h6l-3-6M12 21h8M4 21h8" />
      </svg>
    ),
    description: "Simplify proportional ratios and divide scales on the fly. Master scaling laws for Partnership and Mixture & Alligation problems.",
    difficulty: "Medium",
    stats: "Proportions",
  },
  {
    id: "mixed",
    name: "Ultimate Mixed Blitz",
    emoji: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 3 21 3 21 8" />
        <line x1="4" y1="20" x2="21" y2="3" />
        <polyline points="21 16 21 21 16 21" />
        <line x1="15" y1="15" x2="21" y2="21" />
        <line x1="4" y1="4" x2="9" y2="9" />
      </svg>
    ),
    description: "Put your brain to the absolute test. Face a random onslaught of squares, cubes, and arithmetic operators under customized limits.",
    difficulty: "Hard",
    stats: "Customizable",
  },
  */
];

const MentalMaths = () => {
  const router = useRouter();
  const [loadingTopic, setLoadingTopic] = useState<string | null>(null);

  const handleStart = (topicId: string) => {
    setLoadingTopic(topicId);
    router.push(`/SSC/maths/mental-maths/${topicId}`);
  };

  return (
    <TopicPageLayout
      title="Speed Math"
      description="Calculators are strictly banned in SSC. Master rapid arithmetic and claim precious seconds back."
    >
      <div className="flex flex-wrap justify-center gap-3 md:gap-4 w-full px-4 sm:px-0 mt-2">
        {MENTAL_MATHS_TOPICS.map((topic, idx) => (
          <div
            key={topic.id}
            className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)]"
          >
            <TopicCard
              index={idx}
              cols={3}
              name={topic.name}
              emoji={topic.emoji}
              description={topic.description}
              difficulty={topic.difficulty}
              stats={topic.stats}
              onStartClick={() => handleStart(topic.id)}
              colorTheme="emerald"
              revisionConfig={topic.revisionConfig}
            />
          </div>
        ))}
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
