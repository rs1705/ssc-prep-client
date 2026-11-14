"use client";

import type { ReactNode } from "react";
import { ContentBlocks, ContentRoot } from "./ContentBlocks";
import type { Block } from "./types";
import "./app-theme.css";

/**
 * App entry point for the content format (main-app/CONTENT_FORMAT.md): draws `blocks`
 * when a question, option or explanation has them, and the old text rendering
 * (`fallback`) when it doesn't. The files next to this one are copied unchanged from
 * ingestion-pipeline/src/content; app-specific code lives here and in app-theme.css.
 */
export function Blocks({ blocks, fallback, className }: { blocks?: Block[] | null; fallback: ReactNode; className?: string }) {
  if (!blocks?.length) return <>{fallback}</>;
  return (
    <ContentRoot className={className}>
      <ContentBlocks content={blocks} />
    </ContentRoot>
  );
}

/** Apply a text transform (e.g. "option 3" → "option C") to every text block. */
export function mapTextBlocks(blocks: Block[] | undefined, fn: (text: string) => string): Block[] | undefined {
  return blocks?.map((b) => (b.type === "text" ? { ...b, text: fn(b.text) } : b));
}

/**
 * In a cloze passage, make the blank the question asks about bold
 * ("…fill in blank number 2" → "**(2)________**"). Formatting only; the words stay.
 */
export function markAskedBlank(passage: string, question: string): string {
  const n = /blank (?:number |no\.?\s*)?(\d+)/i.exec(question)?.[1];
  if (!n) return passage;
  return passage.replace(new RegExp(`\\(${n}\\)\\s*_{2,}`), (m) => `**${m}**`);
}
