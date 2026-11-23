"use client";
import { cn } from "@/lib/utils";
import { DUO } from "@/features/games/buttons";
import React from "react";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { HUE_THEME, type Hue } from "@/lib/subject-theme";

export interface SectionCardProps {
  title: string;
  description: string;
  linkTo: string;
  buttonText: string;
  /** Short factual line under the description, e.g. "12 drill topics · 3 levels". */
  meta?: string;
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
  meta,
  icon,
  index = 0,
  colorTheme = "brand",
}: SectionCardProps) => {
  // Colour lives in the icon tile only; the button is neutral since the whole card is the link.
  const isLive = linkTo !== "#";
  const theme = HUE_THEME[colorTheme] ?? HUE_THEME.brand;
  const style = { animationDelay: `${index * 70}ms`, animationFillMode: "both" as const };

  const body = (
    <>
      {/* Phones: icon beside the title, so two or three modes fit per screen.
          Larger screens: icon on top, so the card reads as a tile, not a strip. */}
      <div className="flex flex-1 items-start gap-3 sm:flex-col sm:gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ring-border/60 transition-transform duration-300 ease-out sm:h-12 sm:w-12 ${
            isLive ? `${theme.iconWrap} group-hover:scale-110` : "bg-muted text-muted-foreground"
          }`}
        >
          {icon}
        </div>
        <div className="flex w-full min-w-0 flex-1 flex-col gap-1 sm:gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <h3
              className={`text-base font-extrabold sm:text-lg ${
                isLive ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {title}
            </h3>
            {!isLive && (
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 border-border bg-muted px-2.5 py-0.5 text-xs font-bold text-muted-foreground">
                <Lock className="h-3 w-3" aria-hidden="true" />
                Soon
              </span>
            )}
          </div>
          <p className="text-[13px] leading-snug text-muted-foreground sm:text-sm sm:leading-relaxed">{description}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2.5 border-t-2 border-border/70 pt-3 sm:pt-3.5">
        <span className="text-xs font-semibold text-muted-foreground">
          {meta ?? (isLive ? "Ready to practice" : "In development")}
        </span>
        {isLive && (
          <span className={cn(DUO.secondary, "pointer-events-none min-h-9 shrink-0 px-4 text-xs")}>
            {buttonText}
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        )}
      </div>
    </>
  );

  const shared =
    "group relative flex h-full flex-col gap-3 overflow-hidden rounded-3xl p-4 animate-in fade-in slide-in-from-bottom-4 sm:gap-4 sm:p-5 lg:min-h-[15rem] lg:p-6";

  if (!isLive) {
    return (
      <div
        aria-disabled="true"
        className={`${shared} border-2 border-dashed border-border bg-card`}
        style={style}
      >
        {body}
      </div>
    );
  }

  return (
    <Link
      href={linkTo}
      className={`${shared} surface-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 ${theme.hoverBorder}`}
      style={style}
    >
      {body}
    </Link>
  );
};

export default SectionCard;
