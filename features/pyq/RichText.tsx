"use client";

import { Fragment, useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

/**
 * Renders the small subset of Markdown the question bank uses (bold, italics,
 * <u>underline</u>, bullet lines, line breaks) plus inline/display LaTeX. Everything except the
 * KaTeX output is built as React nodes, so question text can never inject HTML.
 */

const INLINE = /(\$\$[^$]+\$\$|\$[^$\n]+\$|<u>[^<\n]+<\/u>|\*\*[^*\n]+\*\*|\*[^*\s][^*\n]*\*)/g;
const BULLET = /^\s*(?:[-*•])\s+/;

function Tex({ tex, display }: { tex: string; display: boolean }) {
  const html = useMemo(
    () =>
      katex.renderToString(tex, {
        displayMode: display,
        throwOnError: false,
        strict: "ignore",
        output: "html",
      }),
    [tex, display],
  );
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith("$$") && part.endsWith("$$") && part.length > 4) {
      return <Tex key={key} tex={part.slice(2, -2)} display />;
    }
    if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
      return <Tex key={key} tex={part.slice(1, -1)} display={false} />;
    }
    // Papers underline the word a question is about (e.g. "the underlined word").
    if (part.startsWith("<u>") && part.endsWith("</u>")) {
      return (
        <u key={key} className="decoration-2 underline-offset-4">
          {part.slice(3, -4)}
        </u>
      );
    }
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={key} className="font-bold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }
    return <Fragment key={key}>{part}</Fragment>;
  });
}

interface Block {
  type: "p" | "ul";
  lines: string[];
}

function toBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  for (const raw of text.replace(/\r/g, "").split("\n")) {
    const line = raw.trimEnd();
    if (!line.trim()) continue;
    if (BULLET.test(line)) {
      const last = blocks[blocks.length - 1];
      const item = line.replace(BULLET, "");
      if (last?.type === "ul") last.lines.push(item);
      else blocks.push({ type: "ul", lines: [item] });
    } else {
      blocks.push({ type: "p", lines: [line.trim()] });
    }
  }
  return blocks;
}

interface RichTextProps {
  text: string;
  className?: string;
  /** Render as a single inline span (for use inside buttons). */
  inline?: boolean;
}

export function RichText({ text, className = "", inline = false }: RichTextProps) {
  const blocks = useMemo(() => toBlocks(text), [text]);

  if (inline) {
    const flat = blocks.flatMap((b) => b.lines).join(" ");
    return <span className={`break-words ${className}`}>{renderInline(flat, "i")}</span>;
  }

  return (
    <div className={`flex flex-col gap-2 break-words ${className}`}>
      {blocks.map((block, i) =>
        block.type === "ul" ? (
          <ul key={i} className="flex list-disc flex-col gap-1 pl-5">
            {block.lines.map((line, j) => (
              <li key={j}>{renderInline(line, `${i}-${j}`)}</li>
            ))}
          </ul>
        ) : (
          <p key={i}>{renderInline(block.lines[0], String(i))}</p>
        ),
      )}
    </div>
  );
}
