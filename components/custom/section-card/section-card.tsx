"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface SectionCardProps {
  title: string;
  description: string;
  linkTo: string;
  buttonText: string;
  knowMoreText?: string;
  className?: string;
  icon?: any;
  index?: number;
  cols?: number;
  colorTheme?: "sky" | "emerald" | "rose" | "amber" | "indigo" | "violet";
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  description,
  linkTo,
  buttonText,
  knowMoreText,
  icon,
  index = 0,
  cols = 2,
  colorTheme = "indigo",
}: SectionCardProps) => {
  const isClickable = linkTo !== "#";
  const theme = colorTheme || "indigo";

  const themeMap = {
    sky: {
      iconWrapper:
        "bg-sky-500/10 text-sky-600 dark:text-sky-400 shadow-[0_2px_8px_rgba(14,165,233,0.05)]",
    },
    emerald: {
      iconWrapper:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-[0_2px_8px_rgba(16,185,129,0.05)]",
    },
    rose: {
      iconWrapper:
        "bg-rose-500/10 text-rose-600 dark:text-rose-400 shadow-[0_2px_8px_rgba(244,63,94,0.05)]",
    },
    amber: {
      iconWrapper:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-[0_2px_8px_rgba(245,158,11,0.05)]",
    },
    violet: {
      iconWrapper:
        "bg-violet-500/10 text-violet-600 dark:text-violet-400 shadow-[0_2px_8px_rgba(139,92,246,0.05)]",
    },
    indigo: {
      iconWrapper:
        "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-[0_2px_8px_rgba(99,102,241,0.05)]",
    },
  };

  const glowMap: Record<string, string> = {
    emerald: "bg-emerald-500/10",
    amber: "bg-amber-500/10",
    rose: "bg-rose-500/10",
    cyan: "bg-cyan-500/10",
    blue: "bg-blue-500/10",
    orange: "bg-orange-500/10",
    violet: "bg-violet-500/10",
    indigo: "bg-amber-500/10",
  };

  const currentTheme = themeMap[theme];
  const glowClass = glowMap[theme] || "bg-amber-500/10";

  return (
    <div
      className={`group rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 relative overflow-hidden shadow-lg shadow-black/5 ${
        isClickable
          ? "bg-card/95 md:bg-card/60 backdrop-blur-none md:backdrop-blur-xl border border-border/40 hover:border-amber-500/30 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1"
          : "bg-card/90 md:bg-card/30 backdrop-blur-none md:backdrop-blur-md border border-border/20 opacity-75"
      }`}
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: "both",
      }}
    >
      <div className="relative z-10">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-3 shadow-inner ring-1 ring-border/40 ${
            isClickable
              ? currentTheme.iconWrapper
              : "bg-muted text-muted-foreground"
          }`}
        >
          {icon}
        </div>
        <h3 className="text-lg sm:text-xl font-extrabold tracking-tight mb-2 text-foreground group-hover:text-amber-500 transition-colors">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6 font-medium">
          {description}
        </p>
      </div>

      <div>
        {isClickable ? (
          <Link
            href={linkTo}
            className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-mono font-bold tracking-wider uppercase px-5 py-2.5 rounded-full hover:shadow-md hover:shadow-amber-500/20 active:scale-95 transition-all duration-200"
          >
            <span>{buttonText}</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        ) : (
          <div className="inline-flex items-center justify-center gap-2.5 bg-muted text-muted-foreground text-xs font-mono font-bold tracking-wider uppercase px-5 py-2.5 rounded-full border border-border/40">
            <span>{buttonText}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionCard;
