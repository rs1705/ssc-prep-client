"use client";

import Link from "next/link";
import { ChevronLeft, Trophy } from "lucide-react";

interface GameFrameProps {
  title: string;
  subtitle: string;
  /** Shown as a small trophy chip when greater than zero. */
  best?: number;
  backHref?: string;
  children: React.ReactNode;
}

/**
 * Shared page chrome for every English game: back button, title and best score,
 * then a viewport-height column the game fills (screens scroll internally).
 */
export function GameFrame({
  title,
  subtitle,
  best = 0,
  backHref = "/SSC/english/games",
  children,
}: GameFrameProps) {
  return (
    <div className="mx-auto flex min-h-0 w-full max-w-xl flex-1 flex-col gap-3">
      <header className="flex shrink-0 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href={backHref}
            aria-label="Back to all games"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
          <div className="min-w-0 leading-tight">
            <h1 className="truncate text-sm font-extrabold uppercase tracking-wider text-foreground sm:text-base">
              {title}
            </h1>
            <p className="truncate text-xs font-mono font-semibold text-violet-700 dark:text-violet-300">
              {subtitle}
            </p>
          </div>
        </div>

        {best > 0 && (
          <div
            className="flex shrink-0 items-center gap-1.5 rounded-full border-2 border-border bg-card px-2.5 py-1 text-xs font-mono font-bold text-muted-foreground"
            title="Your best score"
          >
            <Trophy className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            {best}
          </div>
        )}
      </header>
      {children}
    </div>
  );
}
