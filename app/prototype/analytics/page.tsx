"use client";

import { Suspense } from "react";
import { AnalyticsView } from "@/features/analytics/AnalyticsView";

/** PROTOTYPE: the analytics page without the sign-in gate, for review. */
export default function AnalyticsPreview() {
  return (
    <Suspense>
      <AnalyticsView />
    </Suspense>
  );
}
