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
  description = "This part of EptSSC is being built.",
  icon: Icon = Clock3,
  features = [],
  actions = [{ label: "Go to Practice", href: "/practice" }],
}: ComingSoonProps) {
  const [primary, ...rest] = actions;
  return (
    <TopicPageLayout title={pageTitle} contentMaxWidthClass="w-full max-w-2xl">
      <section className="surface-card flex w-full flex-col gap-4 rounded-3xl p-4 sm:items-center sm:gap-6 sm:px-10 sm:py-10 sm:text-center">
        {/* Phones: icon beside the title to save height. Larger screens: stacked and centred. */}
        <div className="flex items-start gap-3 sm:flex-col sm:items-center sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-border bg-[color-mix(in_oklab,var(--brand-500)_10%,var(--card))] text-brand-600 sm:h-16 sm:w-16 dark:text-brand-300">
            <Icon className="h-6 w-6 sm:h-8 sm:w-8" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-col gap-1 sm:gap-2">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border-2 border-border bg-muted px-2.5 py-0.5 text-xs font-bold text-muted-foreground sm:mx-auto sm:px-3 sm:py-1">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
              In progress
            </span>
            <h2 className="text-lg font-extrabold leading-snug text-foreground sm:text-2xl">{title}</h2>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground sm:mx-auto sm:max-w-md">{description}</p>

        {features.length > 0 && (
          <ul className="flex w-full max-w-md flex-col divide-y-2 divide-border overflow-hidden rounded-2xl border-2 border-border text-left sm:mx-auto">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 bg-card px-3 py-2 text-sm leading-snug text-foreground sm:gap-3 sm:px-4 sm:py-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500 sm:h-2 sm:w-2" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
        )}

        {primary && (
          <div className="flex w-full max-w-md gap-2 sm:mx-auto">
            <Link
              href={primary.href}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-2xl border-2 border-b-[5px] px-3 text-center text-xs sm:min-h-12 sm:gap-2 sm:text-sm border-brand-700 bg-brand-500 font-extrabold sm:px-5 uppercase tracking-wide text-white transition-[transform,border-width] duration-75 hover:bg-brand-600 active:translate-y-[3px] active:border-b-2"
            >
              {primary.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            {rest.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-2xl border-2 border-b-[5px] px-3 text-center text-xs sm:min-h-12 sm:gap-2 sm:text-sm border-border bg-card font-extrabold sm:px-5 uppercase tracking-wide text-foreground transition-[transform,border-width] duration-75 hover:bg-muted active:translate-y-[3px] active:border-b-2"
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
