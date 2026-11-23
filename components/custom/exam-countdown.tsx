"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, Pencil } from "lucide-react";
import { readStored, writeStored } from "@/lib/storage";

export const EXAM_DATE_KEY = "ssc:exam-date";
const STORAGE_KEY = EXAM_DATE_KEY;
/** Fired when the date changes, so every countdown on screen stays in step. */
/** When the date was last changed, so the newest choice wins across devices. */
export const EXAM_DATE_AT_KEY = "ssc:exam-date-at";
export const EXAM_DATE_EVENT = "ssc:exam-date-updated";

export function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

/** Whole days from today (local) to an ISO date. Negative when it has passed. */
export function daysUntil(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((Date.UTC(y, m - 1, d) - today) / 86_400_000);
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface ExamCountdownProps {
  /** Icon-only version for the collapsed sidebar. */
  compact?: boolean;
  className?: string;
}

/**
 * Personal exam countdown. The date is chosen by the student and kept in their
 * browser, so the number shown is always theirs rather than a placeholder.
 */
export function ExamCountdown({ compact = false, className = "" }: ExamCountdownProps) {
  const [date, setDate] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = () => {
      const saved = readStored<string | null>(STORAGE_KEY, null);
      setDate(saved && /^\d{4}-\d{2}-\d{2}$/.test(saved) ? saved : null);
      setReady(true);
    };
    load();
    window.addEventListener(EXAM_DATE_EVENT, load);
    return () => window.removeEventListener(EXAM_DATE_EVENT, load);
  }, []);

  const save = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return;
    setDate(value);
    writeStored(STORAGE_KEY, value);
    writeStored(EXAM_DATE_AT_KEY, Date.now());
    window.dispatchEvent(new Event(EXAM_DATE_EVENT));
  };

  const days = date ? daysUntil(date) : null;

  if (compact) {
    return (
      <div
        title={days === null ? "Set your exam date" : `${Math.max(days, 0)} days to your exam`}
        className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 border-brand-500/25 bg-card font-mono text-xs font-bold text-brand-700 dark:text-brand-400 ${className}`}
      >
        {ready && days !== null && days >= 0 ? (
          `${days}d`
        ) : (
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
        )}
      </div>
    );
  }

  // One slim row: days to go (tap to change), or "Set exam date". The date picker opens directly.
  const open = () => {
    const el = inputRef.current;
    if (!el) return;
    try {
      el.showPicker();
    } catch {
      el.focus();
    }
  };
  const isSet = ready && days !== null && days >= 0;
  return (
    <section aria-label="Exam countdown" className={`relative w-full ${className}`}>
      <button
        type="button"
        onClick={open}
        title={isSet && date ? `Exam on ${formatDate(date)}. Tap to change.` : "Set your exam date"}
        className={`group flex w-full items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
          isSet
            ? "border-brand-500/25 bg-[color-mix(in_oklab,var(--brand-500)_6%,var(--card))] hover:bg-[color-mix(in_oklab,var(--brand-500)_10%,var(--card))]"
            : "border-dashed border-brand-500/50 text-brand-700 hover:bg-[color-mix(in_oklab,var(--brand-500)_6%,var(--card))] dark:text-brand-300"
        }`}
      >
        <CalendarDays className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
        {!ready ? (
          <span className="h-5" />
        ) : isSet ? (
          <span className="min-w-0 flex-1 truncate text-muted-foreground">
            <span className="font-mono text-base font-black tabular-nums text-foreground">{days}</span>{" "}
            {days === 1 ? "day to exam" : days === 0 ? "exam is today" : "days to exam"}
          </span>
        ) : (
          <span className="flex-1 font-semibold">{date ? "Set your next exam" : "Set exam date"}</span>
        )}
        {isSet && <Pencil className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />}
      </button>
      <input
        ref={inputRef}
        type="date"
        min={todayIso()}
        value={date ?? ""}
        onChange={(e) => save(e.target.value)}
        aria-label="Exam date"
        tabIndex={-1}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
      />
    </section>
  );
}
