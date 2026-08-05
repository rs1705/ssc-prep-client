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
  const themeClass = themeMap[theme] || themeMap.indigo;

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
      className="group relative h-full flex flex-col justify-between p-4 rounded-2xl bg-card border border-border shadow-xs hover:shadow-md hover:border-primary/30 hover:ring-1 hover:ring-primary/30 transition-all duration-300 ease-out hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom-2 zoom-in-95 select-none"
      style={{
        animationDelay: `${Math.floor(index / cols) * 120}ms`,
        animationFillMode: "both",
      }}
    >
      <div className="flex flex-col gap-2">
        {/* Card Header: Emoji + Title + Description inline */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            {/* Emoji box */}
            <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl font-extrabold text-lg select-none ${themeClass}`}>
              {emoji}
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold text-foreground text-sm tracking-tight">
                {name}
              </h3>
              <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                {description}
              </p>
            </div>
          </div>
          {badge && (
            <span className="flex-shrink-0 whitespace-nowrap inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase bg-muted/80 text-muted-foreground border border-border/50 select-none">
              {badge}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Row Controls */}
      <div className="flex items-center justify-end mt-3 pt-3 border-t border-border/40">
        <div className="flex items-center gap-2">
          {canRevise && revisionConfig && (
            <RevisionDialog
              name={name}
              emoji={emoji}
              revisionConfig={revisionConfig}
              trigger={
                <Button
                  variant="ghost"
                  className="px-4 py-2 h-auto rounded-full text-[10px] font-bold tracking-widest uppercase gap-1 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all cursor-pointer"
                >
                  Revise
                </Button>
              }
            />
          )}
          <Button
            onClick={onStartClick}
            className="px-4 py-2 h-auto rounded-full text-[10px] font-bold tracking-widest uppercase gap-1 shadow-xs hover:shadow-sm hover:translate-x-0.5 transition-all hover:cursor-pointer"
          >
            <Swords className="w-3.5 h-3.5" />
            Practice
          </Button>
        </div>
      </div>
    </div>
  );
};
