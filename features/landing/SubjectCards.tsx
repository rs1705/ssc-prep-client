"use client";

import Link from "next/link";
import { ArrowRight, Brain, Calculator, Globe2, Languages, type LucideIcon } from "lucide-react";
import { subjectTheme, type SubjectKey } from "@/lib/subject-theme";
import { cn } from "@/lib/utils";
import { usePyqCounts } from "./usePyqCounts";

const SUBJECTS: { key: SubjectKey; name: string; icon: LucideIcon; offer: string }[] = [
  { key: "maths", name: "Quant", icon: Calculator, offer: "12 speed drills, formulas, flashcards" },
  { key: "reasoning", name: "Reasoning", icon: Brain, offer: "9 speed drills and Match the Pairs" },
  { key: "english", name: "English", icon: Languages, offer: "637 flashcards and 6 word games" },
  { key: "gk", name: "General Knowledge", icon: Globe2, offer: "Topic-wise current affairs and static GK" },
];

/** The four Tier 1 sections, in their subject colours, with live question counts. */
export function SubjectCards() {
  const { counts } = usePyqCounts();

  return (
    <div className="grid w-full grid-cols-2 gap-3 lg:grid-cols-4">
      {SUBJECTS.map(({ key, name, icon: Icon, offer }) => {
        const theme = subjectTheme(key);
        const count = counts[key];
        return (
          <Link
            key={key}
            href={`/SSC/${key}`}
            className={cn(
              "group surface-card flex flex-col gap-3 rounded-3xl p-4 text-left transition-colors sm:p-5",
              theme.hoverBorder,
              theme.hoverBg,
            )}
          >
            <span className={cn("flex h-11 w-11 items-center justify-center rounded-2xl ring-1 ring-border/40", theme.iconWrap)}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block font-extrabold text-foreground">{name}</span>
              <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{offer}</span>
            </span>
            <span className={cn("mt-auto flex items-center justify-between gap-2 text-xs font-bold", theme.text)}>
              <span>{count ? `${count} real PYQs` : "Real PYQs"}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </Link>
        );
      })}
    </div>
  );
}
