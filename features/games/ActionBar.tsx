"use client";

import { cn } from "@/lib/utils";

/**
 * The bottom of a game screen, where the next step lives. On phones the buttons are
 * full width and stacked with the main one at the very bottom, under the thumb; on wider
 * screens they sit side by side with the main one on the right. Put the main button
 * first in `children` (it gets focus first) — the bar reverses the order visually.
 */
export function ActionBar({ children, note, className }: { children: React.ReactNode; note?: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex shrink-0 flex-col gap-2 border-t-2 border-border pt-3 pb-[env(safe-area-inset-bottom)]",
        className,
      )}
    >
      <div className="flex flex-col-reverse gap-2.5 sm:flex-row-reverse [&>*]:sm:flex-1">{children}</div>
      {note}
    </div>
  );
}
