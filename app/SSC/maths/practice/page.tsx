"use client";

import React from "react";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";

export default function TopicPracticePage() {
    return (
        <TopicPageLayout
            title="Topic Practice"
            description="Practice chapter-wise questions to master each topic."
        >
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-6 border border-dashed rounded-3xl bg-muted/20 w-full max-w-md mx-auto">
                <span className="text-4xl mb-4">🎯</span>
                <h2 className="text-xl font-bold mb-2">Coming Soon</h2>
                <p className="text-sm text-muted-foreground max-w-xs">
                    Topic-wise worksheets and custom practice modules are under development. Stay tuned!
                </p>
            </div>
        </TopicPageLayout>
    );
}
