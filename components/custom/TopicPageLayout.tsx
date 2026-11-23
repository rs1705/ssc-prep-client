"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
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
  "mock-tests": "Mock Tests",
  attempt: "Test",
  maths: "Quant",
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
  settings: "Settings",
  feedback: "Feedback",
  analytics: "Analytics",
  bookmarks: "Bookmarks",
  leaderboard: "Leaderboard",
  dashboard: "Dashboard",
  hangman: "Hangman",
  games: "Games",
  "speed-drills": "Speed Drills",
  "match-the-following": "Match the Following",
  match: "Match the Pairs",
  "fill-in-the-blanks": "Fill in the Blanks",
  "topic-pyqs": "Topic-wise PYQs",
  "sectional-pyqs": "Sectional PYQs",
  "odd-link": "Odd Link",
  "word-of-the-day": "Word of the Day",
  "spelling-sprint": "Spelling Check",
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

  // Pages below a section (Quant → Speed Math) get a back button to that section.
  // Top-level pages (Practice, Mock Tests, Settings…) are reached from the menu instead.
  const parentSeg = breadcrumbSegments.length >= 2 ? breadcrumbSegments[breadcrumbSegments.length - 2] : null;
  const back = parentSeg ? { href: getPathForSegment(parentSeg), label: toLabel(parentSeg) } : null;

  return (
    <div className={`flex flex-col items-center w-full mx-auto ${hideBreadcrumbs ? 'pb-0' : 'pb-4'} h-full flex-1 ${centerContent ? 'justify-center' : 'justify-start pt-0'}`}>
      {/* Dynamic Breadcrumbs */}
      {!hideBreadcrumbs && breadcrumbSegments.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className={`${contentMaxWidthClass} flex items-center justify-start gap-1.5 text-xs font-mono font-semibold text-muted-foreground select-none mb-1 shrink-0 flex-wrap`}
        >
          <Link
            href={user ? "/dashboard" : "/"}
            className="-mx-1 -my-2 inline-flex min-h-9 items-center rounded px-1 transition-colors hover:text-foreground"
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
                    className="-mx-1 -my-2 inline-flex min-h-9 items-center rounded px-1 transition-colors hover:text-foreground"
                  >
                    {label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      )}

      {/* Sub-section Header */}
      {title && (
        <div className={`mb-4 sm:mb-6 w-full flex flex-col items-start text-left gap-1 shrink-0 ${contentMaxWidthClass}`}>
          <div className="flex w-full min-w-0 items-center gap-2.5">
            {back && (
              <Link
                href={back.href}
                aria-label={`Back to ${back.label}`}
                title={`Back to ${back.label}`}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              </Link>
            )}
            <h1 className="min-w-0 text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              {title}
            </h1>
          </div>
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
