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
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-[0_2px_8px_rgba(245,158,11,0.05)]",
    },
  };

  const currentTheme = themeMap[theme];

  return (
    <div
      className={`group rounded-2xl p-6 flex flex-col justify-between transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 ${
        isClickable
          ? "bg-card ring-1 ring-border shadow-sm hover:-translate-y-0.5 hover:ring-primary/50"
          : "bg-card/50 ring-1 ring-border/50"
      }`}
      style={{
        animationDelay: `${index * 120}ms`,
        animationFillMode: "both",
      }}
    >
      <div>
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-3 ${
            isClickable
              ? currentTheme.iconWrapper
              : "bg-muted text-muted-foreground"
          }`}
        >
          {icon}
        </div>
        <h3 className="text-lg font-bold tracking-tight mb-2 text-foreground">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          {description}
        </p>
      </div>

      <div>
        {isClickable ? (
          <Link
            href={linkTo}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-[10px] font-bold tracking-widest uppercase px-5 py-3 rounded-full hover:bg-primary/90 transition-colors"
          >
            {buttonText}{" "}
            <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        ) : (
          <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground text-[10px] font-bold tracking-widest uppercase px-5 py-3 rounded-full">
            {buttonText}
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionCard;
