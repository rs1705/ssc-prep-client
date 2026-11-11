import React from "react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

// Even pixel sizes so the centre never falls on a half pixel.
const SIZE = { sm: "h-6 w-6", md: "h-10 w-10", lg: "h-14 w-14" } as const;

// Circle of radius 20 in a 48 box: circumference ≈ 125.7. The arc is ~30% of it.
const R = 20;
const CIRCUMFERENCE = 2 * Math.PI * R;

/**
 * Spinner: a faint full ring with a brand arc turning on it. Track and arc are
 * one SVG, so the arc always turns around the exact centre of the ring, and the
 * SVG sits on its own compositing layer so the rotation never snaps a pixel up
 * or down.
 */
export const Loader = ({ className = "", size = "md", text }: LoaderProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <svg
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
        className={cn("block shrink-0 animate-spin [transform-origin:50%_50%] will-change-transform", SIZE[size])}
        style={{ animationDuration: "0.9s" }}
      >
        <circle cx="24" cy="24" r={R} strokeWidth="5" className="stroke-[color-mix(in_oklab,var(--brand-500)_18%,var(--card))]" />
        <circle
          cx="24"
          cy="24"
          r={R}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${CIRCUMFERENCE * 0.3} ${CIRCUMFERENCE}`}
          className="stroke-brand-500"
        />
      </svg>
      {text && (
        <p className="h-4 text-xs font-bold uppercase leading-4 tracking-widest text-muted-foreground/80 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;
