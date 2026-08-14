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
  colorTheme = "indigo",
  revisionConfig,
  stats = "Practice",
  badge,
}: TopicCardProps) => {
  const theme = colorTheme || "indigo";
  const themeMap: Record<string, string> = {
    sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  };
  const glowMap: Record<string, string> = {
    emerald: "bg-emerald-500/10",
    amber: "bg-amber-500/10",
    violet: "bg-violet-500/10",
    rose: "bg-rose-500/10",
    cyan: "bg-cyan-500/10",
    blue: "bg-blue-500/10",
    orange: "bg-orange-500/10",
    indigo: "bg-amber-500/10",
  };
  const themeClass = themeMap[theme] || themeMap.indigo;
  const glowClass = glowMap[theme] || "bg-amber-500/10";

  const canRevise = !!revisionConfig;

  const getDifficultyStyles = (diff: "Easy" | "Medium" | "Hard") => {
    switch (diff) {
      case "Easy":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400";
      case "Medium":
        return "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400";
      case "Hard":
        return "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400";
    }
  };

  return (
    <div
      className="group relative h-full flex flex-col justify-between p-5 rounded-3xl bg-card/60 backdrop-blur-xl border border-border/40 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 hover:border-amber-500/30 transition-all duration-300 ease-out hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-2 zoom-in-95 select-none noise-overlay overflow-hidden"
      style={{
        animationDelay: `${Math.floor(index / cols) * 100}ms`,
        animationFillMode: "both",
      }}
    >
      <div className="flex flex-col gap-2 relative z-10">
        {/* Card Header: Emoji + Title + Description inline */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3.5">
            {/* Emoji box */}
            <div className={`flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-2xl font-extrabold text-lg select-none shadow-inner ring-1 ring-border/40 ${themeClass}`}>
              {emoji}
            </div>
            <div className="flex flex-col">
              <h3 className="font-extrabold text-foreground text-sm sm:text-base tracking-tight group-hover:text-amber-500 transition-colors">
                {name}
              </h3>
              <p className="text-[11px] sm:text-xs text-muted-foreground leading-snug mt-0.5">
                {description}
              </p>
            </div>
          </div>
          {badge && (
            <span className="flex-shrink-0 whitespace-nowrap inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 select-none">
              {badge}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Row Controls */}
      <div className="flex items-center justify-end mt-4 pt-3.5 border-t border-border/40 relative z-10">
        <div className="flex items-center gap-2">
          {canRevise && revisionConfig && (
            <RevisionDialog
              name={name}
              emoji={emoji}
              revisionConfig={revisionConfig}
              trigger={
                <Button
                  variant="ghost"
                  className="px-3.5 py-1.5 h-auto rounded-full text-[10px] font-mono font-bold tracking-widest uppercase gap-1 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all cursor-pointer border border-border/40"
                >
                  Revise
                </Button>
              }
            />
          )}
          <Button
            onClick={onStartClick}
            className="px-4 py-2 h-auto rounded-full text-[10px] font-mono font-bold tracking-widest uppercase gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs hover:shadow-md hover:shadow-amber-500/20 hover:translate-x-0.5 active:scale-95 transition-all hover:cursor-pointer border-0"
          >
            <Swords className="w-3.5 h-3.5" />
            Practice
          </Button>
        </div>
      </div>
    </div>
  );
};
