"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Eye,
  EyeOff,
  Layers,
  Lightbulb,
  Search,
  Target,
  X,
} from "lucide-react";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import { RichText } from "@/features/pyq/RichText";
import {
  FORMULAS,
  FORMULA_CATEGORIES,
  FORMULA_TOPICS,
  type FormulaEntry,
  type FormulaTopic,
} from "@/lib/maths-formulas";

const TOPIC_BY_ID = new Map(FORMULA_TOPICS.map((topic) => [topic.id, topic]));
const CATEGORY_LABEL = new Map(FORMULA_CATEGORIES.map((c) => [c.id, c.label]));
const ENTRIES_BY_TOPIC = new Map(
  FORMULA_TOPICS.map((topic) => [topic.id, FORMULAS.filter((f) => f.topic === topic.id)]),
);
const GROUPS = FORMULA_CATEGORIES.map((category) => ({
  ...category,
  topics: FORMULA_TOPICS.filter((topic) => topic.category === category.id),
})).filter((group) => group.topics.length > 0);

// Long display formulas scroll inside the card instead of widening it.
const MATH_CLASS =
  "[&_.katex-display]:my-1 [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden [&_.katex-display]:py-1";

function matches(entry: FormulaEntry, query: string): boolean {
  const topic = TOPIC_BY_ID.get(entry.topic)?.name ?? "";
  return [entry.title, entry.body, entry.note ?? "", entry.example ?? "", topic]
    .join(" ")
    .toLowerCase()
    .includes(query);
}

export default function FormulasPage() {
  const [topicId, setTopicId] = useState(FORMULA_TOPICS[0].id);
  const [query, setQuery] = useState("");
  const [hideFormulas, setHideFormulas] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Deep links such as /SSC/maths/formula-practice#percentage (from the syllabus map).
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (TOPIC_BY_ID.has(id)) setTopicId(id);
  }, []);

  const topic = TOPIC_BY_ID.get(topicId) ?? FORMULA_TOPICS[0];
  const entries = ENTRIES_BY_TOPIC.get(topic.id) ?? [];
  const index = FORMULA_TOPICS.findIndex((t) => t.id === topic.id);
  const prev = FORMULA_TOPICS[index - 1];
  const next = FORMULA_TOPICS[index + 1];

  const q = query.trim().toLowerCase();
  const results = useMemo(() => (q ? FORMULAS.filter((entry) => matches(entry, q)) : []), [q]);

  const openTopic = (id: string, scroll = true) => {
    setTopicId(id);
    setQuery("");
    window.history.replaceState(null, "", `#${id}`);
    if (scroll) {
      const top = contentRef.current?.getBoundingClientRect().top ?? 0;
      if (top < 0) contentRef.current?.scrollIntoView({ block: "start" });
    }
  };

  const tricks = entries.filter((e) => e.kind === "trick").length;

  return (
    <TopicPageLayout
      title="Formulas & Tricks"
      description="The whole SSC CGL quant syllabus, one topic at a time. Learn the formula, check the worked example, then hide them and test yourself."
      contentMaxWidthClass="w-full max-w-[1200px]"
    >
      <div className="grid w-full gap-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-10">
        {/* ── Topic navigation ── */}
        <aside className="flex flex-col gap-3 lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:self-start">
          <SearchBox value={query} onChange={setQuery} />

          {/* Phones and tablets: one compact picker */}
          <label className="relative lg:hidden">
            <span className="sr-only">Topic</span>
            <select
              value={topic.id}
              onChange={(e) => openTopic(e.target.value, false)}
              className="h-11 w-full appearance-none rounded-xl border-2 border-border bg-card pl-3.5 pr-10 text-sm font-bold text-foreground outline-none focus-visible:border-brand-500/60"
            >
              {GROUPS.map((group) => (
                <optgroup key={group.id} label={group.label}>
                  {group.topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({ENTRIES_BY_TOPIC.get(t.id)?.length ?? 0})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
          </label>

          {/* Desktop: grouped list */}
          <nav
            aria-label="Topics"
            className="hidden flex-col gap-4 overflow-y-auto pb-4 pr-1 scrollbar-none lg:flex"
          >
            {GROUPS.map((group) => (
              <div key={group.id} className="flex flex-col gap-0.5">
                <p className="section-label px-3 pb-1">{group.label}</p>
                {group.topics.map((t) => {
                  const active = !q && t.id === topic.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => openTopic(t.id)}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                        active
                          ? "bg-[color-mix(in_oklab,var(--brand-500)_10%,var(--card))] font-bold text-brand-700 dark:text-brand-300"
                          : "font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <span className="truncate">{t.name}</span>
                      <span className="shrink-0 text-xs tabular-nums opacity-60">
                        {ENTRIES_BY_TOPIC.get(t.id)?.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>

        {/* ── Content ── */}
        <div ref={contentRef} className="flex min-w-0 scroll-mt-24 flex-col gap-5">
          {q ? (
            <SearchResults query={query} results={results} onOpenTopic={openTopic} onClear={() => setQuery("")} />
          ) : (
            <>
              <header className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-border pb-4">
                <div>
                  <p className="section-label">{CATEGORY_LABEL.get(topic.category)}</p>
                  <h2 className="mt-1 text-2xl font-extrabold text-foreground">{topic.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {entries.length - tricks} formulas
                    {tricks > 0 && ` · ${tricks} ${tricks === 1 ? "trick" : "tricks"}`}
                  </p>
                </div>
                <button
                  type="button"
                  aria-pressed={hideFormulas}
                  onClick={() => setHideFormulas((v) => !v)}
                  className={`flex min-h-10 items-center gap-2 rounded-xl border-2 px-3.5 text-sm font-bold transition-colors ${
                    hideFormulas
                      ? "border-brand-600 bg-brand-600 text-on-brand"
                      : "border-border bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  {hideFormulas ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  {hideFormulas ? "Show formulas" : "Hide formulas"}
                </button>
              </header>

              {hideFormulas && (
                <p className="text-sm text-muted-foreground">
                  Say each formula from its title, then tap the card to check yourself.
                </p>
              )}

              <ol className="flex flex-col gap-3">
                {entries.map((entry) => (
                  <li key={`${topic.id}-${entry.id}-${hideFormulas}`}>
                    <FormulaCard entry={entry} startHidden={hideFormulas} />
                  </li>
                ))}
              </ol>

              <TopicPager prev={prev} next={next} onOpen={openTopic} />
            </>
          )}
        </div>
      </div>
    </TopicPageLayout>
  );
}

function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search all formulas"
        aria-label="Search all formulas"
        className="h-11 w-full rounded-xl border-2 border-border bg-card pl-10 pr-10 text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-brand-500/60 focus-visible:ring-4 focus-visible:ring-brand-500/15"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function FormulaCard({ entry, startHidden }: { entry: FormulaEntry; startHidden: boolean }) {
  const [hidden, setHidden] = useState(startHidden);
  const [open, setOpen] = useState(false);
  const hasMore = Boolean(entry.note || entry.example);

  return (
    <article className="surface-card rounded-2xl p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-bold leading-snug text-foreground">{entry.title}</h3>
        {entry.kind === "trick" && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--brand-500)_10%,var(--card))] px-2 py-0.5 text-[11px] font-bold text-brand-700 dark:text-brand-300">
            <Lightbulb className="h-3 w-3" aria-hidden="true" />
            Trick
          </span>
        )}
      </div>

      {hidden ? (
        <button
          type="button"
          onClick={() => setHidden(false)}
          className="mt-3 flex min-h-16 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-sm font-bold text-muted-foreground transition-colors hover:border-brand-500/50 hover:text-foreground"
        >
          <Eye className="h-4 w-4" aria-hidden="true" />
          Tap to reveal
        </button>
      ) : (
        <div className={`mt-3 text-[0.95rem] leading-relaxed text-foreground ${MATH_CLASS}`}>
          <RichText text={entry.body} />
        </div>
      )}

      {hasMore && !hidden && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:underline dark:text-brand-300"
          >
            {open ? "Hide example" : entry.example ? "Show example" : "Show note"}
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <div className={`mt-2 flex flex-col gap-2 rounded-xl bg-[color-mix(in_oklab,var(--muted)_70%,var(--card))] p-3 text-sm leading-relaxed text-muted-foreground ${MATH_CLASS}`}>
              {entry.note && <p>{entry.note}</p>}
              {entry.example && (
                <div className="text-foreground">
                  <RichText text={entry.example} />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function TopicPager({
  prev,
  next,
  onOpen,
}: {
  prev?: FormulaTopic;
  next?: FormulaTopic;
  onOpen: (id: string) => void;
}) {
  return (
    <div className="mt-2 flex flex-col gap-3 border-t-2 border-border pt-5">
      <div className="grid grid-cols-2 gap-3">
        {prev ? (
          <button
            type="button"
            onClick={() => onOpen(prev.id)}
            className="surface-card flex min-h-16 flex-col items-start justify-center rounded-xl px-4 py-2 text-left transition-colors hover:border-brand-500/40"
          >
            <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Previous
            </span>
            <span className="text-sm font-bold text-foreground">{prev.name}</span>
          </button>
        ) : (
          <span />
        )}
        {next ? (
          <button
            type="button"
            onClick={() => onOpen(next.id)}
            className="surface-card flex min-h-16 flex-col items-end justify-center rounded-xl px-4 py-2 text-right transition-colors hover:border-brand-500/40"
          >
            <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              Next <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span className="text-sm font-bold text-foreground">{next.name}</span>
          </button>
        ) : (
          <span />
        )}
      </div>
      <Link
        href="/SSC/maths/flashcards"
        className="flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-bold text-brand-700 hover:underline dark:text-brand-300"
      >
        <Layers className="h-4 w-4" aria-hidden="true" />
        Revise them as flashcards
      </Link>
      <Link
        href="/SSC/maths/topic-pyqs"
        className="flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-bold text-brand-700 hover:underline dark:text-brand-300"
      >
        <Target className="h-4 w-4" aria-hidden="true" />
        Use them on real Maths PYQs
      </Link>
    </div>
  );
}

function SearchResults({
  query,
  results,
  onOpenTopic,
  onClear,
}: {
  query: string;
  results: FormulaEntry[];
  onOpenTopic: (id: string) => void;
  onClear: () => void;
}) {
  if (results.length === 0) {
    return (
      <div className="surface-card flex flex-col items-center gap-3 rounded-2xl px-6 py-14 text-center">
        <Search className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
        <p className="font-bold text-foreground">Nothing matches &ldquo;{query}&rdquo;</p>
        <button
          type="button"
          onClick={onClear}
          className="rounded-xl border-2 border-border bg-card px-4 py-2 text-sm font-bold hover:bg-muted"
        >
          Clear search
        </button>
      </div>
    );
  }

  const byTopic = FORMULA_TOPICS.map((t) => ({
    topic: t,
    items: results.filter((r) => r.topic === t.id),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {results.length} {results.length === 1 ? "result" : "results"} for &ldquo;{query}&rdquo;
      </p>
      {byTopic.map(({ topic, items }) => (
        <section key={topic.id} className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => onOpenTopic(topic.id)}
            className="flex items-center gap-1 self-start text-sm font-extrabold text-foreground hover:text-brand-700 dark:hover:text-brand-300"
          >
            {topic.name}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <ol className="flex flex-col gap-3">
            {items.map((entry) => (
              <li key={entry.id}>
                <FormulaCard entry={entry} startHidden={false} />
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
