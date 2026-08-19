import React from "react";
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
        "bg-sky-500/10 text-sky-600 dark:text-sky-400 shadow-[0_2px_8px_rgba(14,165,233,0.05)]",
      hoverBorder: "hover:border-sky-500/50",
      hoverBg: "hover:bg-sky-500/[0.03]",
    },
    emerald: {
      iconWrapper:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-[0_2px_8px_rgba(16,185,129,0.05)]",
      hoverBorder: "hover:border-emerald-500/50",
      hoverBg: "hover:bg-emerald-500/[0.03]",
    },
    rose: {
      iconWrapper:
        "bg-rose-500/10 text-rose-600 dark:text-rose-400 shadow-[0_2px_8px_rgba(244,63,94,0.05)]",
      hoverBorder: "hover:border-rose-500/50",
      hoverBg: "hover:bg-rose-500/[0.03]",
    },
    amber: {
      iconWrapper:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-[0_2px_8px_rgba(245,158,11,0.05)]",
      hoverBorder: "hover:border-amber-500/50",
      hoverBg: "hover:bg-amber-500/[0.03]",
    },
    indigo: {
      iconWrapper:
        "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-[0_2px_8px_rgba(99,102,241,0.05)]",
      hoverBorder: "hover:border-indigo-500/50",
      hoverBg: "hover:bg-indigo-500/[0.03]",
    },
    violet: {
      iconWrapper:
        "bg-violet-500/10 text-violet-600 dark:text-violet-400 shadow-[0_2px_8px_rgba(139,92,246,0.05)]",
      hoverBorder: "hover:border-violet-500/50",
      hoverBg: "hover:bg-violet-500/[0.03]",
    },
  };

  const currentTheme = themeMap[theme] || themeMap.amber;
  const canRevise = !!revisionConfig;

  return (
    <div
      className={`group relative h-full flex flex-col justify-between p-5 sm:p-6 rounded-3xl bg-card/95 md:bg-card/60 backdrop-blur-none md:backdrop-blur-xl border-2 border-border/60 hover:shadow-xl hover:shadow-black/5 ${currentTheme.hoverBorder} ${currentTheme.hoverBg} transition-all duration-300 ease-out hover:-translate-y-1 select-none overflow-hidden`}
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
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border-2 border-amber-500/25 select-none">
              {badge}
            </span>
          )}
        </div>

        {/* Title & Description: Full card width */}
        <div className="flex flex-col flex-1">
          <h3 className="font-extrabold text-foreground text-base sm:text-lg tracking-tight group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
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
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground/80 bg-muted/60 px-2.5 py-1 rounded-lg border-2 border-border/40 truncate max-w-[120px]">
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
                  className="px-3 py-1.5 h-8 rounded-xl text-xs font-mono font-bold tracking-wider uppercase gap-1 text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted border-2 border-border/50 active:scale-95 transition-all cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Revise
                </Button>
              }
            />
          )}
          <Button
            onClick={onStartClick}
            className="px-3.5 py-1.5 h-8 rounded-xl text-xs font-mono font-bold tracking-wider uppercase gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs hover:shadow-md hover:shadow-amber-500/20 active:scale-95 transition-all hover:cursor-pointer border-0"
          >
            <Swords className="w-3.5 h-3.5" />
            Practice
          </Button>
        </div>
      </div>
    </div>
  );
};
