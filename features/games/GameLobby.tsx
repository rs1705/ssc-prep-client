"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Play, Trophy } from "lucide-react";
import { DUO } from "./buttons";
import { GAME_TONE, type GameTone } from "./tone";

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
}: GameLobbyProps) {
  const t = GAME_TONE[tone];
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col items-center gap-5 overflow-y-auto py-1 text-center [scrollbar-width:none]">
      <div className="flex flex-col items-center gap-3 pt-1">
        <div
          className={`flex h-[clamp(64px,12dvh,88px)] w-[clamp(64px,12dvh,88px)] items-center justify-center rounded-3xl border-2 border-border ${t.iconWrap} [&_svg]:h-1/2 [&_svg]:w-1/2`}
        >
          {hero}
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-extrabold text-foreground">{title}</h2>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">{blurb}</p>
        </div>
      </div>

      <ul className="flex w-full max-w-sm flex-col divide-y-2 divide-border overflow-hidden rounded-2xl border-2 border-border text-left">
        {rules.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-3 bg-card px-3.5 py-2.5 text-sm text-foreground">
            <Icon className={`h-4 w-4 shrink-0 ${t.icon}`} aria-hidden="true" />
            {text}
          </li>
        ))}
      </ul>

      {children}

      <div className="mt-auto flex w-full max-w-sm flex-col items-center gap-3 pt-1">
        {best > 0 && (
          <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
            <Trophy className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
            Your best: <span className="tabular-nums text-foreground">{best}</span>
          </span>
        )}
        <button type="button" onClick={onStart} autoFocus className={cn(DUO.primary, "w-full")}>
          <Play className="h-4 w-4 fill-current" aria-hidden="true" />
          {startLabel}
        </button>
        <p className="hidden text-xs text-muted-foreground md:block">or press Enter</p>
      </div>
    </div>
  );
}
