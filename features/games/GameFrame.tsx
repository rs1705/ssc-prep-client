"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, LogOut, Pause, Play, Trophy, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CTA, DUO } from "./buttons";
import { GAME_TONE, type GameTone } from "./tone";

interface GameFrameProps {
  title: string;
  subtitle: string;
  /** Shown as a small trophy chip when greater than zero. */
  best?: number;
  backHref?: string;
  backLabel?: string;
  tone?: GameTone;
  /**
   * True while a round is being played: the back button then asks before leaving,
   * so a stray tap doesn't throw the round away.
   */
  confirmExit?: boolean;
  /** Timed games: shows a pause button, and covers the game while paused (see usePause). */
  pause?: { paused: boolean; onPause: () => void; onResume: () => void };
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
  confirmExit = false,
  pause,
  children,
}: GameFrameProps) {
  const router = useRouter();
  const [asking, setAsking] = useState(false);
  return (
    <div className="mx-auto flex min-h-0 w-full max-w-xl flex-1 flex-col">
      <div className="surface-card relative flex min-h-0 flex-1 flex-col gap-4 rounded-3xl p-4 sm:p-6 [@media(max-height:600px)]:gap-2 [@media(max-height:600px)]:p-3">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b-2 border-border pb-3 [@media(max-height:600px)]:pb-2">
          <div className="flex min-w-0 items-center gap-3">
            {confirmExit ? (
              <button type="button" onClick={() => setAsking(true)} aria-label="Leave this game" className={DUO.icon}>
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            ) : (
              <Link href={backHref} aria-label={backLabel} className={DUO.icon}>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </Link>
            )}
            <div className="min-w-0 leading-tight">
              <h1 className="truncate text-base font-extrabold text-foreground sm:text-lg">{title}</h1>
              <p className={`truncate text-xs font-semibold ${GAME_TONE[tone].text}`}>{subtitle}</p>
            </div>
          </div>

          {pause ? (
            <button
              type="button"
              onClick={pause.onPause}
              aria-label="Pause"
              title="Pause (Esc)"
              className={DUO.icon}
            >
              <Pause className="h-5 w-5" aria-hidden="true" />
            </button>
          ) : best > 0 && (
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

        {pause?.paused && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Game paused"
            className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-5 rounded-3xl bg-card p-6 text-center animate-in fade-in duration-150"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-[1.6rem] border-b-[6px] border-black/15 bg-brand-500 text-white shadow-sm">
              <Pause className="h-10 w-10" strokeWidth={2.4} aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Paused</h2>
              <p className="text-sm text-muted-foreground">The clock is stopped. Take your time.</p>
            </div>
            <div className="flex w-full max-w-xs flex-col gap-2.5">
              <button type="button" onClick={pause.onResume} autoFocus className={CTA.primary}>
                <Play className="h-5 w-5 fill-current" aria-hidden="true" />
                Resume
              </button>
              <button type="button" onClick={() => setAsking(true)} className={cn(CTA.secondary, "text-rose-700 dark:text-rose-300")}>
                Leave game
              </button>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={asking} onOpenChange={setAsking}>
        <AlertDialogContent className="max-w-sm rounded-3xl p-5 sm:p-6">
          <AlertDialogHeader className="items-center text-center">
            <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-[color-mix(in_oklab,var(--color-rose-500)_14%,var(--card))] text-rose-600 dark:text-rose-300">
              <LogOut className="h-7 w-7" aria-hidden="true" />
            </div>
            <AlertDialogTitle className="text-xl font-extrabold">Leave this game?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed">
              You&apos;re in the middle of a round. If you leave now, this round&apos;s score won&apos;t count.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-2 flex-col gap-2.5 sm:flex-col">
            <AlertDialogCancel className={cn(CTA.primary, "m-0 h-auto border-brand-700 hover:text-white")}>Keep playing</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => router.push(backHref)}
              className={cn(CTA.secondary, "m-0 h-auto text-rose-700 hover:text-rose-800 dark:text-rose-300")}
            >
              Leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
