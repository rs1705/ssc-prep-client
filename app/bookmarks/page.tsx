"use client";

import { Bookmark } from "lucide-react";
import ComingSoon from "@/components/custom/ComingSoon";
import { ProtectedRoute } from "@/components/custom/ProtectedRoute";

export default function BookmarksPage() {
  return (
    <ProtectedRoute>
      <ComingSoon
        pageTitle="Bookmarks"
        icon={Bookmark}
        title="Saved questions and words, coming soon"
        description="You'll be able to bookmark any question, word or formula and come back to it here. Your wrong answers will be collected automatically too."
        features={[
          "Bookmark PYQs, flashcards and formulas from anywhere",
          "A mistake notebook that fills itself with your wrong answers",
          "Re-test saved items on a schedule so they stick",
        ]}
        actions={[
          { label: "Flashcards", href: "/SSC/english/flashcards" },
          { label: "Formulas", href: "/SSC/maths/formula-practice" },
        ]}
      />
    </ProtectedRoute>
  );
}
