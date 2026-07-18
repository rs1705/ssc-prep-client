"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

/**
 * PostHogProvider — Initializes PostHog on the client side and wraps the app
 * so that hooks like usePostHog() are available anywhere in the component tree.
 *
 * Env vars required (set in .env.local):
 *   NEXT_PUBLIC_POSTHOG_KEY  — Your PostHog project API key (starts with phc_)
 *   NEXT_PUBLIC_POSTHOG_HOST — Your PostHog instance URL (e.g. https://us.i.posthog.com)
 */
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
      // Automatically capture $pageview events on every route change
      capture_pageview: true,
      // Capture page-leave events (time on page, scroll depth, etc.)
      capture_pageleave: true,
      // Respect Do-Not-Track browser setting
      respect_dnt: true,
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
