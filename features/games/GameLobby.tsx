"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Play, RotateCcw, Trophy } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { CTA, DUO } from "./buttons";
import { GAME_TONE, TONE_BAND, type GameTone } from "./tone";
import { ActionBar } from "./ActionBar";

export interface LobbyRule {
  icon: LucideIcon;
  text: string;
}

interface GameLobbyProps {
  hero: React.ReactNode;
  title: string;
  blurb: string;
  rules: LobbyRule[];
  best: number;
  onStart: () => void;
  startLabel?: string;
  tone?: GameTone;
  /** Extra controls between the rules and the start button (e.g. a deck picker). */
  children?: React.ReactNode;
  /** A half-finished run that can be picked up again. */
  resume?: { label: string; onResume: () => void; onDiscard: () => void };
}

export function GameLobby({
  hero,
  title,
  blurb,
  rules,
  best,
  onStart,
  startLabel = "Start",
  tone = "english",
  children,
  resume,
}: GameLobbyProps) {
  const t = GAME_TONE[tone];
  const reduce = useReducedMotion();
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-4">
      <div className="flex min-h-0 flex-1 flex-col items-center gap-5 overflow-y-auto py-1 text-center [scrollbar-width:none]">
        <div className="flex flex-col items-center gap-3 pt-2">
          <motion.div
            initial={reduce ? false : { scale: 0.6, opacity: 0, rotate: -8 }}
            animate={reduce ? { scale: 1, opacity: 1 } : { scale: 1, opacity: 1, rotate: 0, y: [0, -5, 0] }}
            transition={
              reduce
                ? undefined
                : {
                    scale: { type: "spring", stiffness: 260, damping: 16 },
                    rotate: { type: "spring", stiffness: 260, damping: 16 },
                    opacity: { duration: 0.2 },
                    y: { delay: 0.6, duration: 2.8, repeat: Infinity, ease: "easeInOut" },
                  }
            }
            className={cn(
              "flex h-[clamp(72px,13dvh,96px)] w-[clamp(72px,13dvh,96px)] items-center justify-center rounded-[1.75rem] border-b-[6px] border-black/15 shadow-sm [&_svg]:h-1/2 [&_svg]:w-1/2 [&_svg]:stroke-[1.9] [&_g]:stroke-current",
              TONE_BAND[tone],
            )}
          >
            {hero}
          </motion.div>
          <div className="flex flex-col gap-1.5">
            <h2 className="text-[1.65rem] font-extrabold leading-tight tracking-tight text-foreground">{title}</h2>
            <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">{blurb}</p>
          </div>
          {best > 0 && (
            <span className="flex items-center gap-1.5 rounded-full border-2 border-border bg-card px-3 py-1 text-xs font-bold text-muted-foreground">
              <Trophy className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
              Your best <span className="tabular-nums text-foreground">{best}</span>
            </span>
          )}
        </div>

        {resume && (
          <div className="flex w-full max-w-sm shrink-0 flex-col gap-2 rounded-2xl border-2 border-b-4 border-brand-500/50 bg-[color-mix(in_oklab,var(--brand-500)_8%,var(--card))] p-3 text-left">
            <p className="text-sm font-extrabold text-foreground">Pick up where you left off</p>
            <p className="-mt-1.5 text-xs text-muted-foreground">{resume.label}</p>
            <div className="flex gap-2">
              <button type="button" onClick={resume.onResume} autoFocus className={cn(DUO.primary, "min-h-12 flex-1 px-3 text-xs")}>
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Resume
              </button>
              <button type="button" onClick={resume.onDiscard} className={cn(DUO.secondary, "min-h-12 px-3 text-xs")}>
                Start fresh
              </button>
            </div>
          </div>
        )}

        <ul className="flex w-full max-w-sm shrink-0 flex-col gap-2 text-left">
          {rules.map(({ icon: Icon, text }, i) => (
            <motion.li
              key={text}
              initial={reduce ? false : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.07, duration: 0.25 }}
              className="flex items-center gap-3 rounded-2xl border-2 border-border bg-card px-3 py-2.5 text-sm font-medium text-foreground"
            >
              <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl", t.iconWrap)}>
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              {text}
            </motion.li>
          ))}
        </ul>

        {children && <div className="flex w-full max-w-sm shrink-0 flex-col items-stretch gap-2">{children}</div>}
      </div>

      <ActionBar
        className="mx-auto w-full max-w-sm"
        note={<p className="hidden text-center text-xs text-muted-foreground md:block">or press Enter</p>}
      >
        <button type="button" onClick={onStart} autoFocus={!resume} className={CTA.primary}>
          <Play className="h-5 w-5 fill-current" aria-hidden="true" />
          {startLabel}
        </button>
      </ActionBar>
    </div>
  );
}
