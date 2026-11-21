"use client";

import { ArrowRight, Layers } from "lucide-react";
import { Spinner } from "@/components/custom/loader";
import { cn } from "@/lib/utils";
import type { HueTheme } from "@/lib/subject-theme";
import type { PyqTopicNode } from "@/redux/PyqApi";

/**
 * Topics as cards, each with its subtopics as chips. Every subtopic shows with its
 * question count; ones with no questions yet are shown greyed out, not hidden, so the
 * whole syllabus is visible.
 */
export function TopicTree({
  topics,
  theme,
  setSize,
  pending,
  disabled,
  onPick,
}: {
  topics: PyqTopicNode[];
  theme: HueTheme;
  setSize: number;
  /** ID of the topic or subtopic whose set is loading. */
  pending: string | null;
  disabled: boolean;
  onPick: (id: string, name: string) => void;
}) {
  // Topics in a row that share a group ("Arithmetic", "Advanced Maths") go under one heading.
  const sections: { group: string | null; topics: PyqTopicNode[] }[] = [];
  for (const t of topics) {
    const last = sections[sections.length - 1];
    if (last && last.group === (t.group ?? null)) last.topics.push(t);
    else sections.push({ group: t.group ?? null, topics: [t] });
  }
  return (
    <div className="flex flex-col gap-6">
      {sections.map((section, si) => (
        <section key={section.group ?? `s${si}`} aria-label={section.group ?? undefined} className="flex flex-col gap-3">
          {section.group && (
            <h3 className="flex items-baseline gap-2 text-base font-extrabold text-foreground">
              {section.group}
              <span className="text-sm font-semibold text-muted-foreground">
                {section.topics.reduce((n, t) => n + t.count, 0)} questions
              </span>
            </h3>
          )}
          {renderGrid(section.topics)}
        </section>
      ))}
    </div>
  );

  function renderGrid(list: PyqTopicNode[]) {
    return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {list.map((topic) => {
        const empty = topic.count === 0;
        return (
          <li key={topic.id} className={cn("surface-card flex h-full flex-col gap-3 rounded-3xl p-5", empty && "opacity-60")}>
            <div className="flex items-start justify-between gap-3">
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ring-border/60 ${theme.iconWrap}`}>
                <Layers className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="rounded-full border-2 border-border bg-muted px-2.5 py-0.5 font-mono text-xs font-bold text-muted-foreground">
                {topic.count} Q
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-foreground">{topic.name}</h3>

            <ul aria-label={`${topic.name} subtopics`} className="flex flex-wrap gap-1.5">
              {topic.children.map((sub) => (
                <li key={sub.id}>
                  <button
                    type="button"
                    disabled={disabled || sub.count === 0}
                    onClick={() => onPick(sub.id, sub.name)}
                    title={sub.concepts.length ? sub.concepts.join(" · ") : undefined}
                    className={cn(
                      "inline-flex min-h-9 items-center gap-1.5 rounded-full border-2 border-border px-3 py-1 text-sm font-semibold transition-colors",
                      sub.count === 0
                        ? "cursor-not-allowed text-muted-foreground/60"
                        : `bg-card text-foreground ${theme.hoverBorder}`,
                    )}
                  >
                    {sub.name}
                    <span className="font-mono text-xs text-muted-foreground">
                      {pending === sub.id ? <Spinner tone="current" className="h-3.5 w-3.5" /> : sub.count}
                    </span>
                    {sub.count === 0 && <span className="sr-only">(no questions yet)</span>}
                  </button>
                </li>
              ))}
            </ul>

            <button
              type="button"
              disabled={disabled || empty}
              onClick={() => onPick(topic.id, topic.name)}
              className="group mt-auto inline-flex items-center gap-1.5 self-start pt-1 text-sm font-bold text-brand-700 disabled:cursor-not-allowed disabled:text-muted-foreground dark:text-brand-400"
            >
              {empty
                ? "No questions yet"
                : pending === topic.id
                  ? "Loading questions"
                  : `Practice ${Math.min(setSize, topic.count)} from all of ${topic.name}`}
              {pending === topic.id ? (
                <Spinner tone="current" className="h-4 w-4" />
              ) : (
                !empty && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              )}
            </button>
          </li>
        );
      })}
    </ul>
    );
  }
}
