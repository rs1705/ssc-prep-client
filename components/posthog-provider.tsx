"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initAnalytics, track } from "@/lib/analytics";

/**
 * Starts analytics lazily (see lib/analytics.ts) and records a page view on
 * every client-side route change, which the App Router doesn't do by itself.
 *
 * Env vars (optional): NEXT_PUBLIC_POSTHOG_KEY, NEXT_PUBLIC_POSTHOG_HOST.
 */
function PageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const query = searchParams.toString();
    track("$pageview", { $current_url: window.origin + pathname + (query ? `?${query}` : "") });
  }, [pathname, searchParams]);

  return null;
}

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => initAnalytics(), []);

  return (
    <>
      <Suspense fallback={null}>
        <PageViews />
      </Suspense>
      {children}
    </>
  );
}
