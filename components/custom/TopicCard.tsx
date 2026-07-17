import React from "react";
import { Button } from "@/components/ui/button";
import { Play, BookOpen } from "lucide-react";
import { RevisionDialog } from "./revision-dialog";

export interface RevisionRange {
  label: string;
  range: string;
  min: number;
  max: number;
}

export interface RevisionConfig {
  type: "square" | "cube" | "table";
  ranges: RevisionRange[];
}

export interface TopicCardProps {
  name: string;
  emoji: React.ReactNode;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  stats: string;
  onStartClick?: () => void;
  index?: number;
  cols?: number;
  colorTheme?: "sky" | "emerald" | "rose" | "amber" | "indigo";
  revisionConfig?: RevisionConfig;
}

export const TopicCard = ({
  name,
  emoji,
  description,
  stats,
  onStartClick,
  index = 0,
  cols = 3,
  colorTheme = "indigo",
  revisionConfig,
}: TopicCardProps) => {
  const theme = colorTheme || "indigo";
  const themeMap = {
    sky: "bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400",
    emerald: "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    rose: "bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400",
    amber: "bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400",
    indigo: "bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400",
  };
  const themeClass = themeMap[theme];

  const canRevise = !!revisionConfig;



  return (
    <div
      className="group relative h-full flex flex-col justify-between p-5 rounded-3xl bg-card border border-border shadow-xs hover:shadow-md hover:border-primary/30 transition-all duration-300 ease-out hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom-2 zoom-in-95 select-none"
      style={{ animationDelay: `${Math.floor(index / cols) * 120}ms`, animationFillMode: "both" }}
    >
      <div>
        {/* Card Header Info */}
        <div className="flex items-center mb-2">
          <div className="flex items-center gap-3">
            {/* Emoji box */}
            <div className={`flex items-center justify-center w-10 h-10 rounded-2xl font-extrabold text-lg select-none transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-3 ${themeClass}`}>
              {emoji}
            </div>
            <h3 className="font-bold text-foreground text-base tracking-tight">
              {name}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
          {description}
        </p>
      </div>

      {/* Bottom Row Controls */}
      <div className="flex items-center justify-between mt-auto py-3 -mb-2 border-t border-border/40">
        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 bg-accent/20 px-2.5 py-1 rounded-lg">
          {stats}
        </span>

        <div className="flex items-center gap-2">
          {canRevise && revisionConfig && (
            <RevisionDialog
              name={name}
              emoji={emoji}
              revisionConfig={revisionConfig}
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl text-xs font-bold gap-1 text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Revise</span>
                </Button>
              }
            />
          )}

          <Button
            size="default"
            onClick={onStartClick}
            className="h-9 px-5 bg-gradient-to-r from-primary to-indigo-600 text-white shadow-sm hover:from-primary/95 hover:to-indigo-600/95 rounded-xl text-xs font-bold gap-1.5 hover:translate-x-0.5 transition-all duration-200 active:scale-[0.97] hover:cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Practice</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
