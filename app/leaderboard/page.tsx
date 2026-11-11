"use client";

import { Trophy } from "lucide-react";
import ComingSoon from "@/components/custom/ComingSoon";
import { ProtectedRoute } from "@/components/custom/ProtectedRoute";

export default function LeaderboardPage() {
  return (
    <ProtectedRoute>
      <ComingSoon
        pageTitle="Leaderboard"
        icon={Trophy}
        title="Rankings start with full mocks"
        description="When full-length mocks arrive, everyone who sits the same paper is ranked together, so your rank and percentile mean something."
        features={[
          "All-India rank and percentile for every mock you sit",
          "Section-wise toppers' averages to compare against",
          "Weekly practice league among students preparing for the same exam",
        ]}
        actions={[
          { label: "Sectional PYQs", href: "/practice" },
          { label: "Word games", href: "/SSC/english/games" },
        ]}
      />
    </ProtectedRoute>
  );
}
