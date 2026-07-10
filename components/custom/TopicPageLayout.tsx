"use client";

// components/custom/TopicPageLayout.tsx
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

interface TopicPageLayoutProps {
    title: string;
    description?: string;
    children: React.ReactNode;
}

const ROUTE_NAMES: Record<string, string> = {
    ssc: "SSC",
    maths: "Mathematics",
    "mental-maths": "Mental Maths",
    english: "English",
    flashcards: "Flashcards",
    freestyle: "Freestyle",
    fsrs: "Spaced Repetition",
    reasoning: "Reasoning",
    gk: "General Knowledge",
    squares: "Squares",
    cubes: "Cubes",
    addition: "Addition",
    subtraction: "Subtraction",
    multiplication: "Multiplication",
    division: "Division",
    percentages: "Percentages",
    ratios: "Ratios",
    decimals: "Decimals",
    tables: "Tables",
    mixed: "Mixed",
};

export const TopicPageLayout = ({ title, description, children }: TopicPageLayoutProps) => {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbSegments = segments.filter(seg => seg.toLowerCase() !== "ssc");

    const getPathForSegment = (seg: string) => {
        const origIndex = segments.indexOf(seg);
        return "/" + segments.slice(0, origIndex + 1).join("/");
    };

    return (
        <div className="flex flex-col items-center w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto py-6">
            {/* Sub-section Header */}
            <div className="mb-6 text-center px-4 max-w-2xl mx-auto flex flex-col items-center">
                <h1 className="text-2xl font-bold tracking-tight mb-2 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent dark:from-white dark:via-slate-200 dark:to-white">
                    {title}
                </h1>
                {description && (
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                        {description}
                    </p>
                )}

                {/* Dynamic Breadcrumbs */}
                {breadcrumbSegments.length > 0 && (
                    <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-muted-foreground/80 select-none">
                        <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
                            <Home className="w-3.5 h-3.5" />
                            <span>Home</span>
                        </Link>
                        {breadcrumbSegments.map((seg, idx) => {
                            const path = getPathForSegment(seg);
                            const label = ROUTE_NAMES[seg.toLowerCase()] || seg;
                            const isLast = idx === breadcrumbSegments.length - 1;

                            return (
                                <React.Fragment key={seg}>
                                    <ChevronRight className="w-3 h-3 text-muted-foreground/45" />
                                    {isLast ? (
                                        <span className="text-foreground/90 font-bold truncate max-w-[150px]">{label}</span>
                                    ) : (
                                        <Link href={path} className="hover:text-foreground transition-colors capitalize">
                                            {label}
                                        </Link>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Actual Content Wrapper */}
            <div className="w-full flex flex-col items-center">
                {children}
            </div>
        </div>
    );
};
