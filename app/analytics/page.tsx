"use client";
import ComingSoon from "@/components/custom/ComingSoon";
import { ProtectedRoute } from "@/components/custom/ProtectedRoute";

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <ComingSoon pageTitle="Analytics" title="Coming Soon" description="Detailed performance insights and weakness tracking are coming soon." />
    </ProtectedRoute>
  );
}
