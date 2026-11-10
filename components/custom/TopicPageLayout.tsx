"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useAuth } from "@/context/auth";

interface TopicPageLayoutProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  contentMaxWidthClass?: string;
  hideBreadcrumbs?: boolean;
  centerContent?: boolean;
}

const ROUTE_NAMES: Record<string, string> = {
  ssc: "SSC",
  maths: "Mathematics",
  "mental-maths": "Speed Math",
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
  practice: "Practice",
  about: "About",
  feedback: "Feedback",
  analytics: "Analytics",
  bookmarks: "Bookmarks",
  leaderboard: "Leaderboard",
  dashboard: "Dashboard",
  hangman: "Hangman",
  games: "Games",
  "topic-pyqs": "Topic-wise PYQs",
  "sectional-pyqs": "Sectional PYQs",
  "odd-link": "Odd Link",
  "word-of-the-day": "Word of the Day",
  "spelling-sprint": "Spelling Sprint",
  "pyq-practice": "PYQ Practice",
  "mock-test": "Mock Test",
  "formula-practice": "Formulas & Tricks",
};

const toLabel = (seg: string) =>
  ROUTE_NAMES[seg.toLowerCase()] ??
  seg
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export const TopicPageLayout = ({
  title,
  description,
  children,
  contentMaxWidthClass = "w-full",
  hideBreadcrumbs = false,
  centerContent = false,
}: TopicPageLayoutProps) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbSegments = segments.filter(
    (seg) => seg.toLowerCase() !== "ssc",
  );

  const getPathForSegment = (seg: string) => {
    const origIndex = segments.indexOf(seg);
    return "/" + segments.slice(0, origIndex + 1).join("/");
  };

  return (
    <div className={`flex flex-col items-center w-full mx-auto ${hideBreadcrumbs ? 'pb-0' : 'pb-4'} h-full flex-1 ${centerContent ? 'justify-center' : 'justify-start pt-0'}`}>
      {/* Dynamic Breadcrumbs */}
      {!hideBreadcrumbs && breadcrumbSegments.length > 0 && (
        <div
          aria-label="Breadcrumb"
          className={`${contentMaxWidthClass} flex items-center justify-start gap-1.5 text-xs font-mono font-semibold text-muted-foreground select-none mb-4 shrink-0 flex-wrap`}
        >
          <Link
            href={user ? "/dashboard" : "/"}
            className="py-1.5 hover:text-foreground transition-colors"
          >
            Home
          </Link>
          {breadcrumbSegments.map((seg, idx) => {
            const path = getPathForSegment(seg);
            const label = toLabel(seg);
            const isLast = idx === breadcrumbSegments.length - 1;

            return (
              <React.Fragment key={seg}>
                <ChevronRight className="w-3 h-3 text-muted-foreground/45" />
                {isLast ? (
                  <span aria-current="page" className="text-foreground font-bold truncate max-w-[180px]">
                    {label}
                  </span>
                ) : (
                  <Link
                    href={path}
                    className="py-1.5 hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Sub-section Header */}
      {title && (
        <div className={`mb-6 w-full flex flex-col items-start text-left gap-1.5 shrink-0 ${contentMaxWidthClass}`}>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Actual Content Wrapper */}
      <div className={`flex flex-col w-full flex-1 min-w-0 ${centerContent ? 'justify-center items-center' : ''} ${contentMaxWidthClass}`}>
        {children}
      </div>
    </div>
  );
};
