"use client";

import { Fragment, useMemo, type ReactNode } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

/**
 * The text block's markdown subset: **bold**, *italic*, <u>underline</u>, "- " bullets,
 * inline $…$ and display $$…$$ LaTeX, and ![alt](url) images (older drafts keep images
 * inside their text). Built as React nodes, never raw HTML, so pasted text can't inject
 * markup; only KaTeX's own output is set as HTML.
 */

const BULLET = /^\s*(?:[-*•])\s+/;
// $$…$$ | $…$ (not \$) | **…** | <u>…</u> | *…* | ![alt](url)
const INLINE = /(\$\$[\s\S]+?\$\$|(?<!\\)\$(?:\\.|[^$\\])+?\$|\*\*[\s\S]+?\*\*|<u>[\s\S]+?<\/u>|(?<![*\w])\*(?!\s)[^*]+?\*(?![*\w])|!\[[^\]]*\]\([^)\s]+\))/g;

export function Tex({ tex, display = false }: { tex: string; display?: boolean }) {
  const html = useMemo(
    () => katex.renderToString(tex, { displayMode: display, throwOnError: false, strict: "ignore", trust: false }),
    [tex, display],
  );
  return display ? (
    <div className="cf-math" dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <span dangerouslySetInnerHTML={{ __html: html }} />
  );
}

export function renderInline(text: string, key = "i"): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    const k = `${key}-${i}`;
    if (!part) return null;
    if (part.startsWith("$$") && part.endsWith("$$") && part.length > 4) return <Tex key={k} tex={part.slice(2, -2)} display />;
    if (part.startsWith("$") && part.endsWith("$") && part.length > 2) return <Tex key={k} tex={part.slice(1, -1)} />;
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) return <strong key={k}>{renderInline(part.slice(2, -2), k)}</strong>;
    if (part.startsWith("<u>") && part.endsWith("</u>")) {
      return <u key={k} style={{ textUnderlineOffset: 4 }}>{renderInline(part.slice(3, -4), k)}</u>;
    }
    if (part.startsWith("![")) {
      const m = /^!\[([^\]]*)\]\(([^)\s]+)\)$/.exec(part);
      if (m && /^(https?:|data:image\/)/i.test(m[2])) {
        // eslint-disable-next-line @next/next/no-img-element
        return <img key={k} src={m[2]} alt={m[1] || "Figure"} loading="lazy" />;
      }
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={k}>{renderInline(part.slice(1, -1), k)}</em>;
    return <Fragment key={k}>{part.replace(/\\\$/g, "$")}</Fragment>;
  });
}

/** Paragraphs and bullet lists from a text block. */
export function RichText({ text }: { text: string }) {
  const groups: { type: "p" | "ul"; lines: string[] }[] = [];
  for (const raw of text.replace(/\r/g, "").split("\n")) {
    const line = raw.trimEnd();
    if (!line.trim()) continue;
    if (BULLET.test(line)) {
      const last = groups[groups.length - 1];
      const item = line.replace(BULLET, "");
      if (last?.type === "ul") last.lines.push(item);
      else groups.push({ type: "ul", lines: [item] });
    } else {
      groups.push({ type: "p", lines: [line.trim()] });
    }
  }
  return (
    <div className="cf-text">
      {groups.map((g, i) =>
        g.type === "ul" ? (
          <ul key={i}>
            {g.lines.map((l, j) => (
              <li key={j}>{renderInline(l, `${i}-${j}`)}</li>
            ))}
          </ul>
        ) : (
          <p key={i}>{renderInline(g.lines[0], String(i))}</p>
        ),
      )}
    </div>
  );
}
