import React from "react";
import Loader from "./loader";

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 w-screen h-[100dvh] flex flex-col items-center justify-center bg-background/80 backdrop-blur-md z-[9999] animate-in fade-in duration-200">
      <Loader size="lg" text="PrepPilot is loading..." />
    </div>
  );
};

export default LoadingOverlay;
