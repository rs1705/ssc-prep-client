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
        name: "Squares Practice",
        emoji: <span className="font-black text-base">x²</span>,
        description: "Unlock instant calculation power. Master squares up to 50 to speed run compound interest, area calculations, and algebraic expansions.",
        difficulty: "Easy",
        stats: "1-50 Range",
        revisionConfig: {
            type: "square",
            ranges: [
                { label: "Easy", range: "2 - 12", min: 2, max: 12 },
                { label: "Medium", range: "13 - 29", min: 13, max: 29 },
                { label: "Hard", range: "30 - 50", min: 30, max: 50 },
            ]
        }
    },
    {
        id: "cubes",
        name: "Cubes Practice",
        emoji: <span className="font-black text-base">x³</span>,
        description: "Recognize cubic roots instantly. Memorize powers up to 25 to conquer complex volume formulas and number series reasoning puzzles.",
        difficulty: "Medium",
        stats: "1-30 Range",
        revisionConfig: {
            type: "cube",
            ranges: [
                { label: "Easy", range: "2 - 10", min: 2, max: 10 },
                { label: "Medium", range: "11 - 20", min: 11, max: 20 },
                { label: "Hard", range: "21 - 30", min: 21, max: 30 },
            ]
        }
    },
    /*
    {
        id: "addition",
        name: "Addition",
        emoji: "➕",
        description: "Train active summation with double and triple digit speed sprints.",
        difficulty: "Easy",
        stats: "2-3 Digits",
    },
    {
        id: "multiplication",
        name: "Multiplication",
        emoji: "✖️",
        description: "Speed up cross-product multiplication with dynamic digital grids.",
        difficulty: "Hard",
        stats: "Speed Matrix",
    },
    {
        id: "divisions",
        name: "Division",
        emoji: "➗",
        description: "Improve division quotients estimation and remainders mental processing.",
        difficulty: "Hard",
        stats: "Quotients",
    },
    {
        id: "fractions",
        name: "Fractions & Decimals",
        emoji: "🧮",
        description: "Convert vulgar fractions to equivalents and decimal ratios in seconds.",
        difficulty: "Medium",
        stats: "Conversions",
    },
    {
        id: "percentages",
        name: "Percentages",
        emoji: "📈",
        description: "Practice fractional conversions and rapid percentage increments.",
        difficulty: "Medium",
        stats: "Base Scale",
    },
    {
        id: "ratios",
        name: "Ratios & Scales",
        emoji: "⚖️",
        description: "Simplify proportional ratios and divide scales on the fly.",
        difficulty: "Medium",
        stats: "Proportions",
    },
    {
        id: "decimals",
        name: "Decimal Points",
        emoji: "🔢",
        description: "Operate floating point movements and precision calculations under pressure.",
        difficulty: "Easy",
        stats: "Precision",
    },
    {
        id: "tables",
        name: "Tables Practice",
        emoji: "📋",
        description: "Master multiplication tables from 1 to 30 for swift factoring and divisions.",
        difficulty: "Easy",
        stats: "1-30 Tables",
    },
    {
        id: "mixed",
        name: "Mixed Practice",
        emoji: "🔀",
        description: "Combine different calculation types (squares, cubes, operators) in a single dynamic sprint.",
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
            description="Calculators are strictly banned in SSC exams, but they didn't say anything about turning your brain into one. Master rapid arithmetic and claim those precious seconds back."
        >
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 w-full px-4 sm:px-0 mt-2">
                {MENTAL_MATHS_TOPICS.map((topic, idx) => (
                    <div key={topic.id} className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] max-w-sm">
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
        </TopicPageLayout >
    );
};

export default MentalMaths;