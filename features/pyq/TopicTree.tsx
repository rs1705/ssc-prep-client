"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  Calculator,
  ChevronRight,
  ClipboardList,
  FlaskConical,
  Globe2,
  IndianRupee,
  Landmark,
  Layers,
  Leaf,
  MessageSquareText,
  Newspaper,
  Palette,
  Scale,
  Shapes,
  Sigma,
  type LucideIcon,
} from "lucide-react";
import { Spinner } from "@/components/custom/loader";
import { cn } from "@/lib/utils";
import type { HueTheme } from "@/lib/subject-theme";
import type { PyqTopicNode } from "@/redux/PyqApi";
import { progressLabel, useTopicProgress, type NodeProgress } from "./answered";

/**
 * Topic practice in three pages, one level at a time:
 * 1. topics as tiles under their group headings (no buttons, easy to scan);
 * 2. ?topic=…: that topic's subtopics, with one "Practise all";
 * 3. ?topic=…&sub=…: one subtopic, its Practise button and its concepts.
 * Each level is its own URL, so the browser's back button steps back up.
 */

const GROUP_ICON: Record<string, LucideIcon> = {
  History: Landmark,
  "Art & Culture": Palette,
  Polity: Scale,
  Geography: Globe2,
  Economy: IndianRupee,
  Science: FlaskConical,
  Environment: Leaf,
  "Static GK & Current Affairs": Newspaper,
  Arithmetic: Calculator,
  "Advanced Maths": Sigma,
  "Data Interpretation & Statistics": BarChart3,
  Verbal: MessageSquareText,
  Clerical: ClipboardList,
  "Non-Verbal": Shapes,
};
const iconFor = (t: PyqTopicNode) => (t.group ? GROUP_ICON[t.group] : undefined) ?? (t.group ? Layers : BookOpen);

type Props = {
  topics: PyqTopicNode[];
  theme: HueTheme;
  setSize: number;
  /** Open level: a topic ID, and a subtopic ID under it. */
  topicId: string | null;
  subId: string | null;
  /** ID of the set loading. */
  pending: string | null;
  disabled: boolean;
  onPick: (id: string, name: string) => void;
};

function PractiseButton({ count, setSize, loading, disabled, onClick, children }: { count: number; setSize: number; loading: boolean; disabled: boolean; onClick: () => void; children?: React.ReactNode }) {
  return (
    <button
      type="button"
      disabled={disabled || count === 0}
      onClick={onClick}
      className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:opacity-50"
    >
      {loading ? "Loading questions" : (children ?? `Practise ${Math.min(setSize, count)} questions`)}
      {loading ? <Spinner tone="current" className="h-4 w-4" /> : <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />}
    </button>
  );
}

/** How much of `total` is done, and how much of that was right. */
function ProgressBar({ p, total, className }: { p?: NodeProgress; total: number; className?: string }) {
  const done = Math.min(p?.done ?? 0, total);
  const right = Math.min(p?.right ?? 0, done);
  return (
    <span className={cn("flex h-1.5 overflow-hidden rounded-full bg-muted", className)} aria-hidden="true">
      <span className="bg-emerald-500" style={{ width: `${total ? (right / total) * 100 : 0}%` }} />
      <span className="bg-rose-400" style={{ width: `${total ? ((done - right) / total) * 100 : 0}%` }} />
    </span>
  );
}

/** A tappable row: name, count and a chevron (dimmed when nothing has been asked yet). */
function Row({ name, count, href, onClick, loading, progress }: { name: string; count: number; href?: string; onClick?: () => void; loading?: boolean; progress?: NodeProgress }) {
  const label = progressLabel(progress, count);
  const inner = (
    <>
      <span className="min-w-0 flex-1 py-2.5">
        <span className={cn("block font-semibold", count ? "text-foreground" : "text-muted-foreground")}>{name}</span>
        {label && (
          <>
            <span className="mt-0.5 block text-xs text-muted-foreground">{label}</span>
            <ProgressBar p={progress} total={count} className="mt-1.5 max-w-56" />
          </>
        )}
      </span>
      <span className="font-mono text-sm tabular-nums text-muted-foreground">{loading ? <Spinner tone="current" className="h-4 w-4" /> : count}</span>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/70" aria-hidden="true" />
    </>
  );
  const cls = cn("flex min-h-14 w-full items-center gap-3 px-4 text-left transition-colors", count ? "hover:bg-muted/50" : "cursor-default");
  if (href && count) return <Link href={href} className={cls}>{inner}</Link>;
  return (
    <button type="button" disabled={!count || !onClick} onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

export function TopicTree({ topics, theme, setSize, topicId, subId, pending, disabled, onPick }: Props) {
  const path = usePathname();
  const progress = useTopicProgress();
  /** The group chip picked on the topics page (null = all). */
  const [group, setGroup] = useState<string | null>(null);
  const href = (topic?: string, sub?: string) => {
    const q = new URLSearchParams();
    if (topic) q.set("topic", topic);
    if (sub) q.set("sub", sub);
    const s = q.toString();
    return s ? `${path}?${s}` : path;
  };

  const topic = topicId ? topics.find((t) => t.id === topicId) : undefined;
  const sub = topic && subId ? topic.children.find((s) => s.id === subId) : undefined;

  /* ---------- 3. One subtopic ---------- */
  if (topic && sub) {
    const concepts = sub.children.filter((c) => c.count > 0).sort((a, b) => b.count - a.count);
    const notAsked = sub.children.filter((c) => c.count === 0);
    return (
      <div className="flex flex-col gap-5">
        <Link href={href(topic.id)} className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-brand-700 dark:text-brand-400">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {topic.name}
        </Link>
        <header className="surface-card flex flex-col gap-4 rounded-3xl p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{topic.name}</p>
            <h2 className="text-2xl font-extrabold text-foreground">{sub.name}</h2>
            <p className="text-sm text-muted-foreground">
              {progressLabel(progress.get(sub.id), sub.count) ?? `${sub.count} ${sub.count === 1 ? "question" : "questions"} from past papers`}
            </p>
            <ProgressBar p={progress.get(sub.id)} total={sub.count} className="mt-2 max-w-64" />
          </div>
          <PractiseButton count={sub.count} setSize={setSize} loading={pending === sub.id} disabled={disabled} onClick={() => onPick(sub.id, sub.name)} />
        </header>
        {concepts.length > 0 && (
          <section aria-labelledby="concepts-heading" className="flex flex-col gap-2">
            <h3 id="concepts-heading" className="text-sm font-extrabold text-foreground">
              Practise one concept
            </h3>
            <ul className="surface-card divide-y divide-border overflow-hidden rounded-2xl">
              {concepts.map((c) => (
                <li key={c.id}>
                  <Row name={c.name} count={c.count} progress={progress.get(c.id)} loading={pending === c.id} onClick={disabled ? undefined : () => onPick(c.id, c.name)} />
                </li>
              ))}
            </ul>
          </section>
        )}
        {notAsked.length > 0 && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span className="font-semibold">Not asked yet:</span> {notAsked.map((c) => c.name).join(" · ")}
          </p>
        )}
      </div>
    );
  }

  /* ---------- 2. One topic ---------- */
  if (topic) {
    const Icon = iconFor(topic);
    const asked = topic.children.filter((s) => s.count > 0).sort((a, b) => b.count - a.count);
    const notAsked = topic.children.filter((s) => s.count === 0);
    return (
      <div className="flex flex-col gap-5">
        <Link href={href()} className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-brand-700 dark:text-brand-400">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All topics
        </Link>
        <header className="surface-card flex flex-col gap-4 rounded-3xl p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-4">
            <span className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl", theme.iconWrap)}>
              <Icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              {topic.group && <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{topic.group}</p>}
              <h2 className="text-2xl font-extrabold text-foreground">{topic.name}</h2>
              <p className="text-sm text-muted-foreground">
                {progressLabel(progress.get(topic.id), topic.count) ?? `${topic.count} questions · ${asked.length} of ${topic.children.length} subtopics asked`}
              </p>
              <ProgressBar p={progress.get(topic.id)} total={topic.count} className="mt-2 max-w-64" />
            </div>
          </div>
          <PractiseButton count={topic.count} setSize={setSize} loading={pending === topic.id} disabled={disabled} onClick={() => onPick(topic.id, topic.name)}>
            Practise all
          </PractiseButton>
        </header>
        {asked.length > 0 && (
          <section aria-labelledby="subtopics-heading" className="flex flex-col gap-2">
            <h3 id="subtopics-heading" className="text-sm font-extrabold text-foreground">
              Subtopics
            </h3>
            <ul className="surface-card divide-y divide-border overflow-hidden rounded-2xl">
              {asked.map((s) => (
                <li key={s.id}>
                  <Row name={s.name} count={s.count} progress={progress.get(s.id)} href={href(topic.id, s.id)} />
                </li>
              ))}
            </ul>
          </section>
        )}
        {notAsked.length > 0 && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span className="font-semibold">Not asked yet:</span> {notAsked.map((s) => s.name).join(" · ")}
          </p>
        )}
      </div>
    );
  }

  /* ---------- 1. All topics ---------- */
  const groups = [...new Set(topics.map((t) => t.group).filter((g): g is string => !!g))];
  const shown = group ? topics.filter((t) => t.group === group) : topics;
  const groupTotal = shown.reduce((n, t) => n + t.count, 0);
  return (
    <div className="flex flex-col gap-4">
      {groups.length > 1 && (
        <div role="group" aria-label="Show topics from" className="flex flex-wrap gap-2">
          {[null, ...groups].map((g) => {
            const Icon = g ? (GROUP_ICON[g] ?? Layers) : null;
            return (
              <button
                key={g ?? "all"}
                type="button"
                aria-pressed={group === g}
                onClick={() => setGroup(g)}
                className={cn(
                  "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors",
                  group === g ? "border-brand-600 bg-brand-600 text-white" : "border-border bg-card text-foreground hover:border-brand-500/60",
                )}
              >
                {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
                {g ?? "All topics"}
              </button>
            );
          })}
        </div>
      )}

      {group && groupTotal > 0 && (
        <div className="surface-card flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3">
          <p className="text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{group}</span> · {groupTotal} questions across {shown.length} {shown.length === 1 ? "topic" : "topics"}
          </p>
          <PractiseButton count={groupTotal} setSize={setSize} loading={pending === `group:${group}`} disabled={disabled} onClick={() => onPick(`group:${group}`, group)}>
            Practise all {group}
          </PractiseButton>
        </div>
      )}

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {shown.map((t) => {
          const Icon = iconFor(t);
          const asked = t.children.filter((s) => s.count > 0).length;
          const body = (
            <>
              <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", t.count ? theme.iconWrap : "bg-muted text-muted-foreground")}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                {t.group && !group && <span className="block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{t.group}</span>}
                <span className={cn("block text-[15px] font-bold leading-snug", t.count ? "text-foreground" : "text-muted-foreground")}>{t.name}</span>
              </span>
              <span className="mt-auto flex flex-col gap-1.5">
                <span className="text-xs text-muted-foreground">
                  {t.count ? (progressLabel(progress.get(t.id), t.count) ?? `${t.count} questions · ${asked}/${t.children.length} subtopics`) : "Not asked yet"}
                </span>
                {t.count > 0 && <ProgressBar p={progress.get(t.id)} total={t.count} />}
              </span>
            </>
          );
          const cls = "surface-card flex h-full min-h-40 flex-col gap-2.5 rounded-2xl p-4";
          return (
            <li key={t.id}>
              {t.count ? (
                <Link href={href(t.id)} className={cn(cls, "transition-all hover:-translate-y-0.5 hover:shadow-md", theme.hoverBorder)}>
                  {body}
                </Link>
              ) : (
                <div className={cn(cls, "opacity-55")}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
