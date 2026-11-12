"use client";

import { ChartNoAxesCombined } from "lucide-react";
import ComingSoon from "@/components/custom/ComingSoon";
import { ProtectedRoute } from "@/components/custom/ProtectedRoute";

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <ComingSoon
        pageTitle="Analytics"
        icon={ChartNoAxesCombined}
        title="Your analytics will appear here"
        description="Once your practice is saved to your account, this page shows exactly where you gain and lose marks. No sample numbers in the meantime."
        features={[
          "Accuracy and average time for every topic, as a heat map",
          "Your score trend across sectional tests and mocks",
          "Where marks go: wrong answers, skipped questions or running out of time",
          "Your three weakest topics, each with a one-tap practice set",
        ]}
        actions={[
          { label: "Practice PYQs", href: "/practice" },
          { label: "Speed drills", href: "/SSC/maths/mental-maths" },
        ]}
      />
    </ProtectedRoute>
  );
}
