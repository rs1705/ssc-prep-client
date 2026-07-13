import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
    value: number; // 0 to 100
    className?: string;
    barClassName?: string;
    children?: React.ReactNode;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    value,
    className,
    barClassName,
    children,
}) => {
    const clampedValue = Math.min(100, Math.max(0, value));

    return (
        <div className={cn("relative w-full bg-muted rounded-full overflow-hidden shadow-inner", className)}>
            {/* Progress Fill */}
            <div
                className={cn(
                    "absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-indigo-600 transition-all duration-300 ease-out rounded-full",
                    barClassName
                )}
                style={{ width: `${clampedValue}%` }}
            />
            {children}
        </div>
    );
};
