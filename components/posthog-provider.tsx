"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * PostHogProvider — Initializes PostHog on the client side and wraps the app
 * so that hooks like usePostHog() are available anywhere in the component tree.
 *
 * Env vars required (set in .env.local):
 *   NEXT_PUBLIC_POSTHOG_KEY  — Your PostHog project API key (starts with phc_)
 *   NEXT_PUBLIC_POSTHOG_HOST — Your PostHog instance URL (e.g. https://eu.i.posthog.com)
 */

/**
 * PostHogPageView — Captures $pageview on every client-side route change.
 * Next.js App Router navigates without full page reloads, so PostHog's
 * built-in capture_pageview misses subsequent navigations. This component
 * watches usePathname + useSearchParams and fires manually.
 */
function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = url + "?" + searchParams.toString();
      }
      posthog.capture("$pageview", { $current_url: url });
    }
  }, [pathname, searchParams]);

  return null;
}

export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (!key) {
      console.warn(
        "[PostHog] Missing NEXT_PUBLIC_POSTHOG_KEY — analytics will not be initialised."
      );
      return;
    }

    posthog.init(key, {
      api_host: host || "https://us.i.posthog.com",
      // Disable automatic $pageview — we handle it manually via PostHogPageView
      // because Next.js App Router does client-side navigation without full reloads
      capture_pageview: false,
      // Capture page-leave events (time on page, scroll depth, etc.)
      capture_pageleave: true,
    });
  }, []);

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  );
}
