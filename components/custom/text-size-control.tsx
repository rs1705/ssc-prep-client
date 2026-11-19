"use client";

import { cn } from "@/lib/utils";
import { contentSizePercent, MAX_CONTENT_SIZE, stepContentSize } from "@/lib/content-size";
import { usePreferences } from "@/lib/preferences";

const BTN =
  "flex h-9 w-9 items-center justify-center font-bold text-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-500";

/**
 * A− / A+ for question text. The size is saved on this device and used on every
 * question screen (practice, PYQs, mock tests), so it only needs setting once.
 */
export function TextSizeControl({ className }: { className?: string }) {
  const { prefs, update } = usePreferences();
  const step = prefs.contentSize;
  const size = contentSizePercent(step);

  return (
    <div role="group" aria-label={`Question text size, ${size}`} className={cn("flex shrink-0 items-center divide-x divide-border overflow-hidden rounded-md border border-border bg-card", className)}>
      <button
        type="button"
        onClick={() => update({ contentSize: stepContentSize(step, -1) })}
        disabled={step <= 0}
        aria-label="Smaller text"
        title="Smaller text"
        className={cn(BTN, "text-xs")}
      >
        A<span aria-hidden="true">−</span>
      </button>
      <button
        type="button"
        onClick={() => update({ contentSize: stepContentSize(step, 1) })}
        disabled={step >= MAX_CONTENT_SIZE}
        aria-label="Larger text"
        title="Larger text"
        className={cn(BTN, "text-base")}
      >
        A<span aria-hidden="true">+</span>
      </button>
      <span className="sr-only" aria-live="polite">
        Text size {size}
      </span>
    </div>
  );
}
