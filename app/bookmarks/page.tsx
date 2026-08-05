"use client";
import ComingSoon from "@/components/custom/ComingSoon";

import { ProtectedRoute } from "@/components/custom/ProtectedRoute";

export default function BookmarksPage() {
  return (
    <ProtectedRoute>
      <ComingSoon title="Bookmarks" description="Your saved questions and vocabulary will appear here." />
    </ProtectedRoute>
  );
}
