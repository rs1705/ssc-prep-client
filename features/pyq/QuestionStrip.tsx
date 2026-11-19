"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface StripItem {
  id: string;
  /** Number shown on the tile. */
  number: number;
  /** Tile colours (same classes as the question map). */
  tone: string;
  /** Read out by screen readers, e.g. "Question 3: right". */
  label: string;
}

/**
 * One scrollable row of question numbers, for phones and tablets where the full
 * question map would sit below the question. Tap a number to jump to it; the
 * current one stays in view.
 */
export function QuestionStrip({
  items,
  current,
  onPick,
  className,
}: {
  items: StripItem[];
  /** Index into `items`, or -1 when the current question isn't in this row. */
  current: number;
  onPick: (index: number) => void;
  className?: string;
}) {
  const row = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = row.current;
    const tile = el?.children[current] as HTMLElement | undefined;
    if (!el || !tile) {
      return;
    }
    const left = tile.offsetLeft - el.clientWidth / 2 + tile.offsetWidth / 2;
    el.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }, [current, items.length]);

  return (
    <nav aria-label="Jump to a question" className={cn("-mx-1 min-w-0", className)}>
      <ol
        ref={row}
        className="relative flex snap-x gap-1.5 overflow-x-auto px-1 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          <li key={item.id} className="snap-center">
            <button
              type="button"
              onClick={() => onPick(i)}
              aria-label={item.label}
              aria-current={i === current ? "true" : undefined}
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border font-mono text-sm font-bold transition-colors",
                item.tone,
                i === current && "ring-2 ring-foreground ring-offset-2 ring-offset-card",
              )}
            >
              {item.number}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
