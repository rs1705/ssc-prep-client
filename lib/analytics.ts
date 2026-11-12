"use client";

import type { PostHog } from "posthog-js";

/**
 * Product analytics, loaded lazily. PostHog (~200 KB) is only downloaded when
 * NEXT_PUBLIC_POSTHOG_KEY is set, and only once the browser is idle, so it never
 * slows the first page load. Events sent before it loads are queued.
 */

let client: PostHog | null = null;
let loading: Promise<void> | null = null;
const queue: [string, Record<string, unknown> | undefined][] = [];

function whenIdle(fn: () => void) {
  const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
    .requestIdleCallback;
  if (ric) ric(fn, { timeout: 4000 });
  else window.setTimeout(fn, 1500);
}

export function initAnalytics(): void {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (typeof window === "undefined" || !key || loading) return;
  loading = new Promise((resolve) => {
    whenIdle(async () => {
      const { default: posthog } = await import("posthog-js");
      posthog.init(key, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
        // Page views are sent on route changes by the provider.
        capture_pageview: false,
        capture_pageleave: true,
      });
      client = posthog;
      for (const [event, props] of queue.splice(0)) posthog.capture(event, props);
      resolve();
    });
  });
}

/** Send an event (no-op when analytics isn't configured). */
export function track(event: string, props?: Record<string, unknown>): void {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  if (client) client.capture(event, props);
  else if (queue.length < 100) queue.push([event, props]);
}
