"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Pencil } from "lucide-react";
import { readStored, writeStored } from "@/lib/storage";
import {
  EXAM_DATE_AT_KEY,
  EXAM_DATE_EVENT,
  EXAM_DATE_KEY,
  daysUntil,
  formatDate,
  todayIso,
} from "@/components/custom/exam-countdown";

const ISO = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Big countdown for the dashboard header. Shares its date with the sidebar
 * countdown (same key and event), so setting it here updates both.
 */
export function HeaderCountdown() {
  const [date, setDate] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const load = () => {
      const saved = readStored<string | null>(EXAM_DATE_KEY, null);
      setDate(saved && ISO.test(saved) ? saved : null);
      setReady(true);
    };
    load();
    window.addEventListener(EXAM_DATE_EVENT, load);
    return () => window.removeEventListener(EXAM_DATE_EVENT, load);
  }, []);

  const save = (value: string) => {
    if (!ISO.test(value)) return;
    writeStored(EXAM_DATE_KEY, value);
    writeStored(EXAM_DATE_AT_KEY, Date.now());
    setDate(value);
    setEditing(false);
    window.dispatchEvent(new Event(EXAM_DATE_EVENT));
  };

  if (!ready) return <div className="h-[72px] w-full sm:w-64" aria-hidden="true" />;

  const days = date ? daysUntil(date) : null;

  if (editing || !date || (days !== null && days < 0)) {
    return (
      <label className="surface-card flex w-full flex-col gap-1.5 rounded-2xl px-4 py-3 sm:w-64">
        <span className="section-label">
          {date && days !== null && days < 0 ? "That date has passed" : date ? "Change exam date" : "Set your exam date"}
        </span>
        <input
          type="date"
          min={todayIso()}
          defaultValue={date ?? ""}
          onChange={(e) => save(e.target.value)}
          className="h-10 w-full rounded-xl border-2 border-border bg-card px-3 font-mono text-sm text-foreground"
        />
      </label>
    );
  }

  return (
    <div className="surface-card flex w-full items-center gap-4 rounded-2xl px-4 py-3 sm:w-auto">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_oklab,var(--brand-500)_12%,var(--card))] text-brand-600 dark:text-brand-400">
        <CalendarDays className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5 whitespace-nowrap">
          <span className="font-mono text-3xl font-black tabular-nums leading-none text-foreground">{days}</span>
          <span className="text-sm font-bold text-muted-foreground">
            {days === 0 ? "it's today" : days === 1 ? "day to go" : "days to go"}
          </span>
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          {formatDate(date)}
          <span className="hidden min-[400px]:inline"> · {days} daily plans left</span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setEditing(true)}
        aria-label="Change exam date"
        className="-mr-1 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Pencil className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
