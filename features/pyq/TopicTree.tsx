"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { Spinner } from "@/components/custom/loader";
import { cn } from "@/lib/utils";
import type { HueTheme } from "@/lib/subject-theme";
import type { PyqTopicNode } from "@/redux/PyqApi";

/**
 * The topic page: topics listed on the left (under their group headings), the chosen
 * topic on the right with its subtopics and concepts. Only what has questions is shown
 * as something to practise; the rest of the syllabus is a quiet "not asked yet" line,
 * so the page stays readable while every topic is still visible.
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
  /** ID of the topic, subtopic or concept whose set is loading. */
  pending: string | null;
  disabled: boolean;
  onPick: (id: string, name: string) => void;
}) {
  /** The group being shown (null = all). */
  const [filter, setFilter] = useState<string | null>(null);
  /** The topic open on the right; the busiest one to start with. */
  const [openId, setOpenId] = useState<string | null>(null);
  /** Phones show the list or the topic, not both. */
  const [showDetail, setShowDetail] = useState(false);

  const sections: { group: string | null; topics: PyqTopicNode[] }[] = [];
  for (const t of topics) {
    const g = t.group ?? null;
    const same = g !== null ? sections.find((x) => x.group === g) : sections[sections.length - 1]?.group === null ? sections[sections.length - 1] : undefined;
    if (same) same.topics.push(t);
    else sections.push({ group: g, topics: [t] });
  }
  const groups = sections.filter((x) => x.group).map((x) => x.group!);
  const shown = filter ? sections.filter((x) => x.group === filter) : sections;
  const visible = shown.flatMap((x) => x.topics);
  const busiest = [...visible].sort((a, b) => b.count - a.count)[0];
  const open = visible.find((t) => t.id === openId) ?? busiest;
  const max = Math.max(1, ...visible.map((t) => t.count));

  const pick = (t: PyqTopicNode) => {
    setOpenId(t.id);
    setShowDetail(true);
  };

  const PractiseButton = ({ id, name, count, label }: { id: string; name: string; count: number; label?: string }) => (
    <button
      type="button"
      disabled={disabled || count === 0}
      onClick={() => onPick(id, name)}
      className="group inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-600 px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
    >
      {pending === id ? "Loading" : (label ?? `Practise ${Math.min(setSize, count)}`)}
      {pending === id ? <Spinner tone="current" className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />}
    </button>
  );

  return (
    <div className="flex flex-col gap-4">
      {groups.length > 1 && (
        <div role="group" aria-label="Show topics from" className="flex flex-wrap gap-2">
          {[null, ...groups].map((g) => (
            <button
              key={g ?? "all"}
              type="button"
              aria-pressed={filter === g}
              onClick={() => {
                setFilter(g);
                setOpenId(null);
                setShowDetail(false);
              }}
              className={cn(
                "min-h-9 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
                filter === g ? "border-brand-600 bg-brand-600 text-white" : "border-border bg-card text-foreground hover:border-brand-500/60",
              )}
            >
              {g ?? "All"}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,20rem)_1fr] lg:items-start">
        {/* Topic list */}
        <nav aria-label="Topics" className={cn("surface-card flex-col rounded-2xl p-2 lg:sticky lg:top-4 lg:flex", showDetail ? "hidden" : "flex")}>
          {shown.map((section, si) => {
            const total = section.topics.reduce((n, t) => n + t.count, 0);
            return (
              <div key={section.group ?? `s${si}`} className="flex flex-col">
                {section.group && (
                  <div className="flex items-center justify-between gap-2 px-3 pb-1 pt-3 first:pt-1">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{section.group}</span>
                    {total > 0 && (
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => onPick(`group:${section.group}`, section.group!)}
                        className="text-[11px] font-bold text-brand-700 hover:underline disabled:opacity-50 dark:text-brand-400"
                      >
                        {pending === `group:${section.group}` ? "Loading…" : `Practise all · ${total}`}
                      </button>
                    )}
                  </div>
                )}
                <ul>
                  {section.topics.map((t) => (
                    <li key={t.id}>
                      <button
                        type="button"
                        onClick={() => pick(t)}
                        aria-current={open?.id === t.id ? "true" : undefined}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                          open?.id === t.id ? "bg-[color-mix(in_oklab,var(--brand-500)_10%,var(--card))]" : "hover:bg-muted/60",
                        )}
                      >
                        <span className="min-w-0 flex-1">
                          <span className={cn("block text-sm font-semibold", t.count ? "text-foreground" : "text-muted-foreground")}>{t.name}</span>
                          <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                            <span className="block h-full rounded-full bg-brand-500" style={{ width: `${(t.count / max) * 100}%` }} />
                          </span>
                        </span>
                        <span className="font-mono text-xs font-bold tabular-nums text-muted-foreground">{t.count}</span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/60" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>

        {/* The chosen topic */}
        {open && (
          <section aria-label={open.name} className={cn("surface-card flex-col gap-5 rounded-2xl p-5 sm:p-6 lg:flex", showDetail ? "flex" : "hidden")}>
            <button type="button" onClick={() => setShowDetail(false)} className="flex items-center gap-1 self-start text-sm font-semibold text-brand-700 lg:hidden dark:text-brand-400">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All topics
            </button>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                {open.group && <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{open.group}</p>}
                <h3 className="text-2xl font-extrabold text-foreground">{open.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {open.count ? `${open.count} questions from past papers` : "No questions from past papers yet"}
                </p>
              </div>
              {open.count > 0 && <PractiseButton id={open.id} name={open.name} count={open.count} label={`Practise ${Math.min(setSize, open.count)} questions`} />}
            </div>

            {(() => {
              const asked = open.children.filter((s) => s.count > 0).sort((a, b) => b.count - a.count);
              const notAsked = open.children.filter((s) => s.count === 0);
              return (
                <>
                  {asked.length > 0 && (
                    <ul className="flex flex-col divide-y divide-border rounded-xl border border-border">
                      {asked.map((sub) => {
                        const concepts = sub.children.filter((c) => c.count > 0).sort((a, b) => b.count - a.count);
                        return (
                          <li key={sub.id} className="flex flex-col gap-2 p-3.5 sm:p-4">
                            <div className="flex items-center gap-3">
                              <span className="min-w-0 flex-1">
                                <span className="block font-bold text-foreground">{sub.name}</span>
                                <span className="text-xs text-muted-foreground">{sub.count} {sub.count === 1 ? "question" : "questions"}</span>
                              </span>
                              <PractiseButton id={sub.id} name={sub.name} count={sub.count} />
                            </div>
                            {concepts.length > 0 && (
                              <ul aria-label={`${sub.name} concepts`} className="flex flex-wrap gap-1.5">
                                {concepts.map((c) => (
                                  <li key={c.id}>
                                    <button
                                      type="button"
                                      disabled={disabled}
                                      onClick={() => onPick(c.id, c.name)}
                                      className={cn("inline-flex min-h-8 items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground transition-colors", theme.hoverBorder)}
                                    >
                                      {c.name}
                                      <span className="font-mono text-muted-foreground">{pending === c.id ? <Spinner tone="current" className="h-3 w-3" /> : c.count}</span>
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  {notAsked.length > 0 && (
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      <span className="font-semibold">Not asked yet:</span> {notAsked.map((s) => s.name).join(" · ")}
                    </p>
                  )}
                </>
              );
            })()}
          </section>
        )}
      </div>
    </div>
  );
}
