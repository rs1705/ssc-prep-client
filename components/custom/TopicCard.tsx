import { Spinner } from "@/components/custom/loader";
import React from "react";
import { cn } from "@/lib/utils";
import { DUO } from "@/features/games/buttons";
import { Button } from "@/components/ui/button";
import { Swords, BookOpen } from "lucide-react";
import { RevisionDialog } from "./revision-dialog";

export interface RevisionRange {
  label: string;
  range: string;
  min: number;
  max: number;
}

export interface RevisionConfig {
  type:
    | "square"
    | "cube"
    | "table"
    | "subtraction"
    | "multiplication"
    | "division"
    | "percentage";
  ranges: RevisionRange[];
}

export interface TopicCardProps {
  name: string;
  emoji: React.ReactNode;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  onStartClick?: () => void;
  /** The drill is opening: show a spinner on Practice. */
  isStarting?: boolean;
  /** Another drill is opening: ignore clicks. */
  startDisabled?: boolean;
  index?: number;
  cols?: number;
  colorTheme?: "sky";
  revisionConfig?: RevisionConfig;
  stats?: string;
  badge?: string;
}

export const TopicCard = ({
  name,
  emoji,
  description,
  difficulty,
  onStartClick,
  isStarting = false,
  startDisabled = false,
  index = 0,
  cols = 3,
  colorTheme = "sky",
  revisionConfig,
  stats = "Practice",
  badge,
}: TopicCardProps) => {
  const theme = colorTheme;
  const themeMap: Record<
    string,
    {
      iconWrapper: string;
      hoverBorder: string;
      hoverBg: string;
    }
  > = {
    sky: {
      iconWrapper:
        "bg-[color-mix(in_oklab,var(--color-sky-500)_10%,var(--card))] text-sky-600 dark:text-sky-400 shadow-[0_2px_8px_rgba(14,165,233,0.05)]",
      hoverBorder: "hover:border-sky-500/50",
      hoverBg: "hover:bg-[color-mix(in_oklab,var(--color-sky-500)_5%,var(--card))]",
    },
  };

  const currentTheme = themeMap[theme] ?? themeMap.sky;
  const canRevise = !!revisionConfig;

  return (
    <div
      className={`group relative h-full flex flex-col justify-between p-4 sm:p-6 rounded-3xl bg-card border-2 border-border hover:shadow-xl hover:shadow-black/5 ${currentTheme.hoverBorder} ${currentTheme.hoverBg} transition-all duration-300 ease-out hover:-translate-y-1 select-none overflow-hidden`}
      style={{
        animationDelay: `${Math.floor(index / cols) * 80}ms`,
        animationFillMode: "both",
      }}
    >
      {/* Phones: icon beside the name, so several drills fit per screen. Larger screens: icon on top. */}
      <div className="relative z-10 flex flex-1 items-start gap-3 sm:flex-col sm:gap-3.5">
        <div
          className={`flex h-11 w-11 flex-shrink-0 select-none items-center justify-center rounded-2xl shadow-inner ring-1 ring-border/40 transition-all duration-300 ease-out group-hover:rotate-3 group-hover:scale-110 sm:h-12 sm:w-12 ${currentTheme.iconWrapper}`}
        >
          {emoji}
        </div>
        <div className="flex w-full min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="text-base font-extrabold tracking-tight text-foreground sm:text-lg">{name}</h3>
            {badge && (
              <span className="inline-flex select-none items-center gap-1 rounded-full border-2 border-border bg-muted px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                {badge}
              </span>
            )}
          </div>
          <p className="mt-1 text-[13px] leading-snug text-muted-foreground">{description}</p>
        </div>
      </div>

      {/* Bottom Controls Row */}
      <div className="flex items-center justify-between mt-3 pt-3 sm:mt-5 sm:pt-3.5 border-t-2 border-border/40 relative z-10 gap-2">
        {/* Left: Stats Pill */}
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground/80 bg-[color-mix(in_oklab,var(--muted)_60%,var(--card))] px-2.5 py-1 rounded-lg border-2 border-border truncate max-w-[120px]">
          {stats}
        </span>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {canRevise && revisionConfig && (
            <RevisionDialog
              name={name}
              emoji={emoji}
              revisionConfig={revisionConfig}
              colorTheme={theme}
              trigger={
                <Button
                  variant="ghost"
                  className={cn(DUO.secondary, "min-h-10 px-3 text-xs")}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Revise
                </Button>
              }
            />
          )}
          <Button
            onClick={onStartClick}
            disabled={startDisabled}
            aria-busy={isStarting}
            className={cn(DUO.primary, "group/btn min-h-10 px-4 text-xs")}
          >
            {isStarting ? (
              <Spinner tone="current" className="h-4 w-4" />
            ) : (
              <Swords className="w-3.5 h-3.5 group-hover/btn:rotate-12 group-hover/btn:scale-125 transition-transform duration-300" />
            )}
            {isStarting ? "Opening…" : "Practice"}
          </Button>
        </div>
      </div>
    </div>
  );
};
