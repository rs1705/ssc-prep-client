"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

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
  "mock-test": "Mock Test",
  "formula-practice": "Formula Practice",
};

export const TopicPageLayout = ({
  title,
  description,
  children,
  contentMaxWidthClass = "w-full",
  hideBreadcrumbs = false,
  centerContent = false,
}: TopicPageLayoutProps) => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbSegments = segments.filter(
    (seg) => seg.toLowerCase() !== "ssc",
  );

  const getPathForSegment = (seg: string) => {
    const origIndex = segments.indexOf(seg);
    return "/" + segments.slice(0, origIndex + 1).join("/");
  };

  return (
    <div className={`flex flex-col items-center w-full mx-auto ${hideBreadcrumbs ? 'pb-0' : 'pb-3'} h-full flex-1 ${centerContent ? 'justify-center' : 'justify-start pt-0'}`}>
      {/* Dynamic Breadcrumbs */}
      {!hideBreadcrumbs && breadcrumbSegments.length > 0 && (
        <div
          className={`${contentMaxWidthClass} flex items-center justify-start gap-1.5 text-xs font-mono font-semibold text-muted-foreground/80 select-none mb-3 shrink-0`}
        >
          <Link
            href="/dashboard"
            className="hover:text-foreground transition-colors"
          >
            Home
          </Link>
          {breadcrumbSegments.map((seg, idx) => {
            const path = getPathForSegment(seg);
            const label = ROUTE_NAMES[seg.toLowerCase()] || seg;
            const isLast = idx === breadcrumbSegments.length - 1;

            return (
              <React.Fragment key={seg}>
                <ChevronRight className="w-3 h-3 text-muted-foreground/45" />
                {isLast ? (
                  <span className="text-foreground/90 font-bold truncate max-w-[150px]">
                    {label}
                  </span>
                ) : (
                  <Link
                    href={path}
                    className="hover:text-foreground transition-colors capitalize"
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
        <div className="mb-6 w-full flex flex-col items-start text-left shrink-0">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground mb-1">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground text-sm mb-1 max-w-2xl">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Actual Content Wrapper */}
      <div className={`flex flex-col items-center w-full flex-1 ${centerContent ? 'justify-center' : ''} ${contentMaxWidthClass}`}>
        {children}
      </div>
    </div>
  );
};
