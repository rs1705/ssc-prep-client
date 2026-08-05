"use client";
import ComingSoon from "@/components/custom/ComingSoon";

import { ProtectedRoute } from "@/components/custom/ProtectedRoute";

export default function LeaderboardPage() {
  return (
    <ProtectedRoute>
      <ComingSoon title="Leaderboard" description="Compete with other aspirants and track your rank." />
    </ProtectedRoute>
  );
}
