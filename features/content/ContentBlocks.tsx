"use client";

import "./content.css";
import { DiagramView } from "./Diagrams";
import { RichText, Tex } from "./RichText";
import { optionBlocks, toBlocks, type Block, type Content, type ContentOption } from "./types";
import { blockProblems } from "./validate";

/**
 * Renders content in the EptSSC format. `content` may be a block list or a legacy plain
 * string (shown as one text block). A block that fails its checks shows what is wrong
 * instead of a broken drawing.
 */
export function ContentBlocks({ content, className }: { content: Content; className?: string }) {
  const blocks = toBlocks(content);
  return (
    <div className={`cf-blocks${className ? ` ${className}` : ""}`}>
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </div>
  );
}

/** Wrap anything rendered with these components so the tokens and styles apply. */
export function ContentRoot({ children, dark, className }: { children: React.ReactNode; dark?: boolean; className?: string }) {
  return (
    <div className={`cf${className ? ` ${className}` : ""}`} data-theme={dark ? "dark" : undefined}>
      {children}
    </div>
  );
}

export function BlockView({ block }: { block: Block }) {
  const problems = blockProblems(block);
  if (problems.length > 0) return <ProblemBox problems={problems} />;

  switch (block.type) {
    case "text":
      return <RichText text={block.text} />;
    case "math":
      return <Tex tex={block.latex} display />;
    case "table":
      return (
        <div className="cf-figure">
          <table className="cf-table">
            <thead>
              <tr>
                {block.headers.map((x, i) => (
                  <th key={i}>{x}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((r, i) => (
                <tr key={i} className={block.highlightRow === i ? "cf-hl" : undefined}>
                  {r.map((x, j) => (
                    <td key={j}>{String(x)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {block.caption && <div className="cf-caption">{block.caption}</div>}
        </div>
      );
    case "series":
      return (
        <div className="cf-series" role="img" aria-label={`Series ${block.items.join(", ")}`}>
          {block.items.map((it, i) => (
            <SeriesItem key={i} index={i} item={it} diffs={block.diffs} found={block.found} />
          ))}
        </div>
      );
    case "coding": {
      const letters = [...block.from];
      return (
        <div className="cf-figure">
          <div className="cf-coding" role="img" aria-label={`${block.from} becomes ${block.to}`}>
            <div className="cf-c-row">
              <span className="cf-c-tag">{block.fromTag || "Word"}</span>
              {letters.map((c, i) => <span key={i} className="cf-c-cell">{c}</span>)}
            </div>
            <div className="cf-c-row">
              <span className="cf-c-tag" />
              {letters.map((_, i) => <span key={i} className="cf-c-shift">{`${block.shifts[i] ?? ""} ↓`}</span>)}
            </div>
            <div className="cf-c-row">
              <span className="cf-c-tag">{block.toTag || "Code"}</span>
              {[...block.to].map((c, i) => <span key={i} className="cf-c-cell cf-out">{c}</span>)}
            </div>
          </div>
        </div>
      );
    }
    case "image":
      return (
        <div className="cf-paper-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.src} alt={block.alt} loading="lazy" />
          <span className="cf-paper-tag">{block.tag || "FROM THE PAPER"}</span>
        </div>
      );
    case "diagram":
      return (
        <div className="cf-figure">
          <DiagramView d={block.diagram} />
          {block.diagram.generated && <span className="cf-scale">NOT TO SCALE</span>}
          {block.caption && <div className="cf-caption">{block.caption}</div>}
        </div>
      );
  }
}

function SeriesItem({ index, item, diffs, found }: { index: number; item: string | number; diffs?: string[]; found?: number }) {
  const cls = item === "?" ? "cf-s-num cf-ask" : found === index ? "cf-s-num cf-found" : "cf-s-num";
  return (
    <>
      {/* In a question the series is printed plainly (3, 8, 15, …); arrows only appear
          in explanations, where they carry the differences. */}
      {index > 0 && !diffs && <span className="cf-s-comma" aria-hidden="true">,</span>}
      {index > 0 && diffs && (
        <div className="cf-s-gap">
          <span className="cf-s-diff">{diffs[index - 1]}</span>
          <svg viewBox="0 0 26 8" className="cf-s-arrow" aria-hidden="true">
            <path d="M1 4 H22 M18 1 L23 4 L18 7" stroke="var(--cf-muted)" fill="none" strokeWidth={1.4} />
          </svg>
        </div>
      )}
      <div className={cls}>{String(item)}</div>
    </>
  );
}

function ProblemBox({ problems }: { problems: string[] }) {
  return (
    <div className="cf-problem" role="alert">
      <strong>This block can&apos;t be drawn:</strong>
      <ul>
        {problems.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </div>
  );
}

export type OptionState = "idle" | "right" | "wrong";

/** One answer option in the calm style (A–D chip, thin border). */
export function OptionView({
  option,
  letter,
  state = "idle",
  onClick,
  disabled,
}: {
  option: ContentOption;
  /** Display letter; defaults to the option's own label. */
  letter?: string;
  state?: OptionState;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const cls = `cf-opt${state === "right" ? " cf-right" : state === "wrong" ? " cf-wrong" : ""}`;
  const body = (
    <>
      <span className="cf-opt-lbl">{letter ?? option.label}</span>
      <span className="cf-opt-body">
        <ContentBlocks content={optionBlocks(option)} />
      </span>
    </>
  );
  return onClick ? (
    <button type="button" className={cls} onClick={onClick} disabled={disabled}>
      {body}
    </button>
  ) : (
    <div className={cls}>{body}</div>
  );
}
