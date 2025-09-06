import React from "react";
import { Loader2 } from "lucide-react";
const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/70 z-[9999]">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );
};

export default LoadingOverlay;
