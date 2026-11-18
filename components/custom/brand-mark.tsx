import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * The EptSSC mark (a circle): an open book with an arrow climbing above it, in white on the
 * brand gradient (indigo to blue, like the main landing buttons). Same drawing as
 * app/icon.svg and the PNG icons (scripts/make-icons.mjs).
 * Size it with className.
 */
export function BrandMark({ className }: { className?: string }) {
  const gradient = `brand-mark-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true" className={cn("block shrink-0", className)}>
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6366f1" />
          <stop offset="1" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <circle cx="256" cy="256" r="256" fill={`url(#${gradient})`} />
      <g fill="none" stroke="#ffffff" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round">
        <path d="M256 392 C220 370 174 366 140 373 V258 C174 251 220 255 256 278 Z" />
        <path d="M256 392 C292 370 338 366 372 373 V258 C338 251 292 255 256 278 Z" />
        <path d="M164 206 L226 148 L276 186 L356 110" />
        <path d="M306 108 H358 V160" />
      </g>
    </svg>
  );
}

export default BrandMark;
