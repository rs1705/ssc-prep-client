import React from "react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  text?: string;
}

// Circle of radius 20 in a 48 box: circumference ≈ 125.7. The arc is ~30% of it.
const R = 20;
const CIRCUMFERENCE = 2 * Math.PI * R;

/**
 * The ring every loader in the app draws: a faint full track with a brand arc turning
 * on it. Track and arc are one SVG, so the arc always turns around the exact centre,
 * and the SVG sits on its own compositing layer so the rotation never snaps a pixel.
 * Size it with `className` (h-/w-); `tone="onBrand"` is for spinners inside a brand
 * button, where the arc must be white.
 */
export function Spinner({ className = "h-4 w-4", tone = "brand" }: { className?: string; tone?: "brand" | "onBrand" | "current" }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={cn("block shrink-0 animate-spin [transform-origin:50%_50%] will-change-transform", className)}
      style={{ animationDuration: "0.9s" }}
    >
      <circle
        cx="24"
        cy="24"
        r={R}
        strokeWidth="5"
        className={
          tone === "brand"
            ? "stroke-[color-mix(in_oklab,var(--brand-500)_18%,var(--card))]"
            : "stroke-current opacity-25"
        }
      />
      <circle
        cx="24"
        cy="24"
        r={R}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={`${CIRCUMFERENCE * 0.3} ${CIRCUMFERENCE}`}
        className={tone === "brand" ? "stroke-brand-500" : "stroke-current"}
      />
    </svg>
  );
}

/**
 * The loader for anything that waits (a page, a section, a card): the ring with an
 * optional short label under it. One look everywhere; it scales a little with the
 * screen (36px on phones, 40px on tablets, 44px on desktops) so it never looks lost on
 * a big screen or heavy on a small one. Labels are short and have no trailing "…".
 */
export const Loader = ({ className = "", text }: LoaderProps) => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={text ?? "Loading"}
      className={cn("flex flex-col items-center justify-center gap-3 sm:gap-4", className)}
    >
      <Spinner className="h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11" />
      {text && (
        <p className="max-w-[18rem] text-center text-[11px] font-bold uppercase leading-4 tracking-widest text-muted-foreground/80 animate-pulse sm:text-xs">
          {text.replace(/(…|\.\.\.)$/, "")}
        </p>
      )}
    </div>
  );
};

export default Loader;
