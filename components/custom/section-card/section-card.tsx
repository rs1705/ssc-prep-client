"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HUE_THEME, type Hue } from "@/lib/subject-theme";

export interface SectionCardProps {
  title: string;
  description: string;
  linkTo: string;
  buttonText: string;
  knowMoreText?: string;
  className?: string;
  icon?: React.ReactNode;
  index?: number;
  cols?: number;
  colorTheme?: Hue;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  description,
  linkTo,
  buttonText,
  icon,
  index = 0,
  colorTheme = "indigo",
}: SectionCardProps) => {
  const isClickable = linkTo !== "#";
  const theme = HUE_THEME[colorTheme] ?? HUE_THEME.indigo;

  return (
    <div
      className={`group h-full rounded-3xl p-5 sm:p-6 flex flex-col gap-5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden ${
        isClickable
          ? `bg-card md:bg-card/70 md:backdrop-blur-xl border-2 border-border ${theme.hoverBorder} ${theme.hoverBg} hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1`
          : "surface-card border-dashed"
      }`}
      style={{
        animationDelay: `${index * 80}ms`,
        animationFillMode: "both",
      }}
    >
      <div className="flex flex-col gap-4 flex-1">
        <div
          className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-110 ring-1 ring-border/60 ${
            isClickable
              ? theme.iconWrap
              : "bg-muted text-muted-foreground"
          }`}
        >
          {icon}
        </div>
        <div className="flex flex-col gap-1.5">
          <h3
            className={`text-lg font-extrabold tracking-tight transition-colors ${
              isClickable
                ? "text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400"
                : "text-muted-foreground"
            }`}
          >
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {isClickable ? (
        <Link
          href={linkTo}
          className="inline-flex h-10 w-fit items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-mono font-bold tracking-wider uppercase px-5 rounded-full hover:shadow-md hover:shadow-amber-500/25 active:scale-95 transition-all duration-200"
        >
          <span>{buttonText}</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      ) : (
        <div className="inline-flex h-10 w-fit items-center justify-center bg-muted text-muted-foreground text-xs font-mono font-bold tracking-wider uppercase px-5 rounded-full border-2 border-border">
          {buttonText}
        </div>
      )}
    </div>
  );
};

export default SectionCard;
