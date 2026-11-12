import React from "react";
import { cn } from "@/lib/utils";
import { DUO } from "@/features/games/buttons";
import { Button } from "@/components/ui/button";
import { Swords, BookOpen, Loader2 } from "lucide-react";
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
  colorTheme?: "sky" | "emerald" | "rose" | "amber" | "indigo" | "violet";
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
  colorTheme = "amber",
  revisionConfig,
  stats = "Practice",
  badge,
}: TopicCardProps) => {
  const theme = colorTheme || "amber";
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
    emerald: {
      iconWrapper:
        "bg-[color-mix(in_oklab,var(--color-emerald-500)_10%,var(--card))] text-emerald-600 dark:text-emerald-400 shadow-[0_2px_8px_rgba(16,185,129,0.05)]",
      hoverBorder: "hover:border-emerald-500/50",
      hoverBg: "hover:bg-[color-mix(in_oklab,var(--color-emerald-500)_5%,var(--card))]",
    },
    rose: {
      iconWrapper:
        "bg-[color-mix(in_oklab,var(--color-rose-500)_10%,var(--card))] text-rose-600 dark:text-rose-400 shadow-[0_2px_8px_rgba(244,63,94,0.05)]",
      hoverBorder: "hover:border-rose-500/50",
      hoverBg: "hover:bg-[color-mix(in_oklab,var(--color-rose-500)_5%,var(--card))]",
    },
    amber: {
      iconWrapper:
        "bg-[color-mix(in_oklab,var(--brand-500)_10%,var(--card))] text-brand-600 dark:text-brand-400 shadow-[0_2px_8px_rgba(192,38,211,0.05)]",
      hoverBorder: "hover:border-brand-500/50",
      hoverBg: "hover:bg-[color-mix(in_oklab,var(--brand-500)_5%,var(--card))]",
    },
    indigo: {
      iconWrapper:
        "bg-[color-mix(in_oklab,var(--color-indigo-500)_10%,var(--card))] text-indigo-600 dark:text-indigo-400 shadow-[0_2px_8px_rgba(99,102,241,0.05)]",
      hoverBorder: "hover:border-indigo-500/50",
      hoverBg: "hover:bg-[color-mix(in_oklab,var(--color-indigo-500)_5%,var(--card))]",
    },
    violet: {
      iconWrapper:
        "bg-[color-mix(in_oklab,var(--color-fuchsia-500)_10%,var(--card))] text-fuchsia-700 dark:text-fuchsia-400 shadow-[0_2px_8px_rgba(192,38,211,0.05)]",
      hoverBorder: "hover:border-fuchsia-500/50",
      hoverBg: "hover:bg-[color-mix(in_oklab,var(--color-fuchsia-500)_5%,var(--card))]",
    },
  };

  const currentTheme = themeMap[theme] || themeMap.amber;
  const canRevise = !!revisionConfig;

  return (
    <div
      className={`group relative h-full flex flex-col justify-between p-5 sm:p-6 rounded-3xl bg-card border-2 border-border hover:shadow-xl hover:shadow-black/5 ${currentTheme.hoverBorder} ${currentTheme.hoverBg} transition-all duration-300 ease-out hover:-translate-y-1 select-none overflow-hidden`}
      style={{
        animationDelay: `${Math.floor(index / cols) * 80}ms`,
        animationFillMode: "both",
      }}
    >
      <div className="flex flex-col flex-1 relative z-10">
        {/* Top Header Row: Icon on left, Badge on right */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div
            className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-3 shadow-inner ring-1 ring-border/40 select-none ${currentTheme.iconWrapper}`}
          >
            {emoji}
          </div>
          {badge && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-[color-mix(in_oklab,var(--brand-500)_10%,var(--card))] text-brand-600 dark:text-brand-400 border-2 border-brand-500/25 select-none">
              {badge}
            </span>
          )}
        </div>

        {/* Title & Description: Full card width */}
        <div className="flex flex-col flex-1">
          <h3 className="font-extrabold text-foreground text-base sm:text-lg tracking-tight group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
            {name}
          </h3>
          <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed mt-1.5 font-normal">
            {description}
          </p>
        </div>
      </div>

      {/* Bottom Controls Row */}
      <div className="flex items-center justify-between mt-5 pt-3.5 border-t-2 border-border/40 relative z-10 gap-2">
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
              colorTheme="amber"
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
              <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
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
