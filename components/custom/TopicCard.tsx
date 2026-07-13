import React from "react";
import { Button } from "@/components/ui/button";
import { Play, ArrowRight } from "lucide-react";

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
}

export const TopicCard = ({
  name,
  emoji,
  description,
  difficulty,
  stats,
  onStartClick,
  index = 0,
  cols = 3,
  colorTheme = "indigo",
}: TopicCardProps) => {
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

  const theme = colorTheme || "indigo";
  const themeMap = {
    sky: "bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400",
    emerald: "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    rose: "bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400",
    amber: "bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400",
    indigo: "bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400",
  };
  const themeClass = themeMap[theme];

  return (
    <div
      className="group relative h-full flex flex-col justify-between p-5 rounded-3xl bg-card border border-border shadow-xs hover:shadow-md hover:border-primary/30 hover:ring-1 hover:ring-primary/30 transition-all duration-300 ease-out hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom-2 zoom-in-95 select-none"
      style={{ animationDelay: `${Math.floor(index / cols) * 120}ms`, animationFillMode: "both" }}
    >
      <div>
        {/* Card Header Info */}
        <div className="flex items-start justify-between mb-3.5">
          <div className="flex items-center gap-3">
            {/* Emoji box */}
            <div className={`flex items-center justify-center w-10 h-10 rounded-2xl font-extrabold text-lg select-none ${themeClass}`}>
              {emoji}
            </div>
            <h3 className="font-bold text-foreground text-base tracking-tight">
              {name}
            </h3>
          </div>

          {/* Difficulty Badge */}
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getDifficultyStyles(difficulty)}`}>
            {difficulty}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed mb-4">
          {description}
        </p>
      </div>

      {/* Bottom Row Controls */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/40">
        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 bg-accent/20 px-2.5 py-1 rounded-lg">
          {stats}
        </span>

        <Button
          size="sm"
          onClick={onStartClick}
          className="h-8 px-3 rounded-lg text-xs font-bold gap-1 shadow-xs hover:shadow-sm hover:translate-x-0.5 transition-all hover:cursor-pointer"
        >
          <Play className="w-3 h-3 fill-current" />
          Start
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
    </div>
  );
};
