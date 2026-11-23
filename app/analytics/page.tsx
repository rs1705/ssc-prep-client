"use client";

import { Suspense } from "react";
import { ProtectedRoute } from "@/components/custom/ProtectedRoute";
import { AnalyticsView } from "@/features/analytics/AnalyticsView";

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <Suspense>
        <AnalyticsView />
      </Suspense>
    </ProtectedRoute>
  );
}
