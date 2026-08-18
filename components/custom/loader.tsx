import React from "react";
import { Loader2 } from "lucide-react";

interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

export const Loader = ({ className = "", size = "md", text }: LoaderProps) => {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulsing ring */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 animate-ping ${
          size === "sm" ? "w-8 h-8" : size === "md" ? "w-14 h-14" : "w-20 h-20"
        }`} />
        
        {/* Core rotating spinner */}
        <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
      </div>
      {text && (
        <p className="text-xs font-bold text-muted-foreground/80 animate-pulse tracking-widest uppercase mt-1">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;
