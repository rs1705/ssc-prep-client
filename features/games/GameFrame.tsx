"use client";

import Link from "next/link";
import { ChevronLeft, Trophy } from "lucide-react";
import { DUO } from "./buttons";
import { GAME_TONE, type GameTone } from "./tone";

interface GameFrameProps {
  title: string;
  subtitle: string;
  /** Shown as a small trophy chip when greater than zero. */
  best?: number;
  backHref?: string;
  backLabel?: string;
  tone?: GameTone;
  children: React.ReactNode;
}

/**
 * Shared chrome for every game and drill: one bordered card that stands on its
 * own over the page, with the back button, title and best score in a header
 * and the game filling the rest (screens scroll inside the card).
 */
export function GameFrame({
  title,
  subtitle,
  best = 0,
  backHref = "/SSC/english/games",
  backLabel = "Back to all games",
  tone = "english",
  children,
}: GameFrameProps) {
  return (
    <div className="mx-auto flex min-h-0 w-full max-w-xl flex-1 flex-col">
      <div className="surface-card flex min-h-0 flex-1 flex-col gap-4 rounded-3xl p-4 sm:p-6 [@media(max-height:600px)]:gap-2 [@media(max-height:600px)]:p-3">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b-2 border-border pb-3 [@media(max-height:600px)]:pb-2">
          <div className="flex min-w-0 items-center gap-3">
            <Link href={backHref} aria-label={backLabel} className={DUO.icon}>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </Link>
            <div className="min-w-0 leading-tight">
              <h1 className="truncate text-base font-extrabold text-foreground sm:text-lg">{title}</h1>
              <p className={`truncate text-xs font-semibold ${GAME_TONE[tone].text}`}>{subtitle}</p>
            </div>
          </div>

          {best > 0 && (
            <div
              className="flex shrink-0 items-center gap-1.5 rounded-full border-2 border-border bg-card px-3 py-1 text-xs font-bold text-muted-foreground"
              title="Your best score"
            >
              <Trophy className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
              <span className="tabular-nums">{best}</span>
            </div>
          )}
        </header>
        {children}
      </div>
    </div>
  );
}
