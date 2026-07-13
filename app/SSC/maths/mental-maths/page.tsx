"use client";

import React, { useState } from "react";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import { TopicCard } from "@/components/custom/TopicCard";
import { useRouter } from "next/navigation";

interface MathTopic {
    id: string;
    name: string;
    emoji: string;
    description: string;
    difficulty: "Easy" | "Medium" | "Hard";
    stats: string;
}

const MENTAL_MATHS_TOPICS: MathTopic[] = [
    {
        id: "squares",
        name: "Squares",
        emoji: "²",
        description: "Master squares of numbers from 1 to 50 for lightning-fast calculations.",
        difficulty: "Easy",
        stats: "1-50 Range",
    },
    {
        id: "cubes",
        name: "Cubes Practice",
        emoji: "³",
        description: "Master cubes of numbers from 1 to 30 to solve polynomial expressions instantly.",
        difficulty: "Medium",
        stats: "1-25 Range",
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
            title="Mental Maths"
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
                        />
                    </div>
                ))}
            </div>

            {loadingTopic && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex flex-col items-center justify-center animate-in fade-in duration-200">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative w-12 h-12">
                            <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                        <p className="text-sm font-semibold text-muted-foreground animate-pulse">
                            Loading practice lobby...
                        </p>
                    </div>
                </div>
            )}
        </TopicPageLayout >
    );
};

export default MentalMaths;