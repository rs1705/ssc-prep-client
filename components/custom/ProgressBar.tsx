import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
    value: number; // 0 to 100
    className?: string;
    barClassName?: string;
    children?: React.ReactNode;
    /** Accessible name for screen readers, e.g. "Time remaining". */
    label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    value,
    className,
    barClassName,
    children,
    label,
}) => {
    const clampedValue = Math.min(100, Math.max(0, value));

    return (
        <div
            role="progressbar"
            aria-label={label}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(clampedValue)}
            className={cn("relative w-full h-3.5 bg-muted/70 rounded-full overflow-hidden border-2 border-border p-0.5 z-10", className)}
        >
            {/* Progress Fill */}
            <div
                className={cn(
                    "h-full bg-primary transition-all duration-300 ease-out rounded-full",
                    barClassName
                )}
                style={{ width: `${clampedValue}%` }}
            />
            {children}
        </div>
    );
};
