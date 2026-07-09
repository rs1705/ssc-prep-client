// components/custom/TopicPageLayout.tsx
import React from "react";

interface TopicPageLayoutProps {
    title: string;
    description?: string;
    children: React.ReactNode;
}

export const TopicPageLayout = ({ title, description, children }: TopicPageLayoutProps) => {
    return (
        <div className="flex flex-col items-center w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto py-6">
            {/* Sub-section Header */}
            <div className="mb-6 text-center px-4 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold tracking-tight mb-2 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent dark:from-white dark:via-slate-200 dark:to-white">
                    {title}
                </h1>
                {description && (
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        {description}
                    </p>
                )}
            </div>

            {/* Actual Content Wrapper */}
            <div className="w-full flex flex-col items-center">
                {children}
            </div>
        </div>
    );
};
