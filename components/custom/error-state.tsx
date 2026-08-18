import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Failed to Load Deck",
  description = "We couldn't connect to our servers to retrieve your cards. Please check your network and try again.",
  onRetry,
  className = "",
}) => {
  return (
    <div className={`w-full max-w-md mx-auto transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-2 ${className}`}>
      <div className="flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-card border-2 border-border shadow-xs hover:shadow-sm hover:border-border/80 transition-all duration-300">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 shadow-inner ring-1 ring-border/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4 select-none">
          <AlertCircle className="w-6 h-6" strokeWidth={2} />
        </div>
        <h3 className="text-base font-black tracking-tight text-foreground mb-1.5">{title}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xs mb-6">
          {description}
        </p>
        {onRetry && (
          <Button 
            onClick={onRetry}
            className="h-10 px-6 text-xs font-mono font-bold tracking-wider uppercase rounded-full shadow-xs hover:shadow-md hover:shadow-amber-500/20 bg-gradient-to-r from-amber-500 to-orange-500 text-white active:scale-[0.98] transition-all flex items-center gap-2 hover:cursor-pointer border-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
