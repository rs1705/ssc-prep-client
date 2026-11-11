"use client";

import Link from "next/link";
import { ArrowRight, Clock3, type LucideIcon } from "lucide-react";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";

export interface ComingSoonAction {
  label: string;
  href: string;
}

interface ComingSoonProps {
  /** Page heading (also used for the breadcrumb). */
  pageTitle?: string;
  title?: string;
  description?: string;
  icon?: LucideIcon;
  /** What the finished page will show, so the empty state still informs. */
  features?: string[];
  /** Where to go meanwhile. The first one is the main button. */
  actions?: ComingSoonAction[];
}

/**
 * Honest placeholder for a page whose data isn't wired up yet. Never shows
 * sample numbers: it says what is coming and points to what works today.
 */
export default function ComingSoon({
  pageTitle,
  title = "Coming soon",
  description = "This part of EptSsc is being built.",
  icon: Icon = Clock3,
  features = [],
  actions = [{ label: "Go to Practice", href: "/practice" }],
}: ComingSoonProps) {
  const [primary, ...rest] = actions;
  return (
    <TopicPageLayout title={pageTitle} contentMaxWidthClass="w-full max-w-2xl">
      <section className="surface-card flex w-full flex-col items-center gap-6 rounded-3xl px-6 py-10 text-center sm:px-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-border bg-[color-mix(in_oklab,var(--brand-500)_10%,var(--card))] text-brand-600 dark:text-brand-300">
          <Icon className="h-8 w-8" aria-hidden="true" />
        </div>

        <div className="flex flex-col gap-2">
          <span className="mx-auto inline-flex items-center gap-1.5 rounded-full border-2 border-border bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
            In progress
          </span>
          <h2 className="text-2xl font-extrabold text-foreground">{title}</h2>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>

        {features.length > 0 && (
          <ul className="flex w-full max-w-md flex-col divide-y-2 divide-border overflow-hidden rounded-2xl border-2 border-border text-left">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 bg-card px-4 py-3 text-sm text-foreground">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
        )}

        {primary && (
          <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
            <Link
              href={primary.href}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-b-[5px] border-brand-700 bg-brand-500 px-5 text-sm font-extrabold uppercase tracking-wide text-white transition-[transform,border-width] duration-75 hover:bg-brand-600 active:translate-y-[3px] active:border-b-2"
            >
              {primary.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            {rest.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-b-[5px] border-border bg-card px-5 text-sm font-extrabold uppercase tracking-wide text-foreground transition-[transform,border-width] duration-75 hover:bg-muted active:translate-y-[3px] active:border-b-2"
              >
                {action.label}
              </Link>
            ))}
          </div>
        )}
      </section>
    </TopicPageLayout>
  );
}
