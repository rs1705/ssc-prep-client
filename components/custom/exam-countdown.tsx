"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Pencil } from "lucide-react";
import { readStored, writeStored } from "@/lib/storage";

const STORAGE_KEY = "ssc:exam-date";

function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

/** Whole days from today (local) to an ISO date. Negative when it has passed. */
function daysUntil(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((Date.UTC(y, m - 1, d) - today) / 86_400_000);
}

function formatDate(iso: string): string {
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
  const [editing, setEditing] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = readStored<string | null>(STORAGE_KEY, null);
    if (saved && /^\d{4}-\d{2}-\d{2}$/.test(saved)) setDate(saved);
    setReady(true);
  }, []);

  const save = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return;
    setDate(value);
    writeStored(STORAGE_KEY, value);
    setEditing(false);
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

  return (
    <section
      aria-label="Exam countdown"
      className={`w-full rounded-2xl border-2 border-brand-500/25 bg-gradient-to-br from-brand-500/10 to-transparent p-3.5 ${className}`}
    >
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="section-label whitespace-nowrap">Exam countdown</span>
        {date && !editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label="Change exam date"
            className="-m-1.5 rounded-lg p-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </div>

      {!ready ? (
        <div className="h-9" />
      ) : editing || !date ? (
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            {date ? "Pick a new date" : "When is your exam?"}
          </span>
          <input
            type="date"
            min={todayIso()}
            defaultValue={date ?? ""}
            onChange={(e) => save(e.target.value)}
            className="h-9 w-full rounded-lg border-2 border-border bg-card px-2 font-mono text-xs text-foreground"
          />
        </label>
      ) : days !== null && days < 0 ? (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-left text-xs font-semibold text-muted-foreground underline-offset-2 hover:underline"
        >
          That date has passed. Set your next exam.
        </button>
      ) : (
        <>
          <div className="flex items-baseline gap-1.5 whitespace-nowrap">
            <span className="font-mono text-2xl font-black tabular-nums tracking-tight text-foreground">
              {days}
            </span>
            <span className="text-xs font-semibold text-muted-foreground">
              {days === 1 ? "day to go" : days === 0 ? "days — it's today" : "days to go"}
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {formatDate(date)}
          </div>
        </>
      )}
    </section>
  );
}
