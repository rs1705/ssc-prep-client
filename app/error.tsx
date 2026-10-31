"use client";

import { useEffect } from "react";
import ErrorState from "@/components/custom/error-state";

interface RouteErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RouteError({ error, reset }: RouteErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center px-4">
      <ErrorState
        title="Something went wrong"
        description="This page hit an unexpected error. Your progress is safe — try again, and if it keeps happening, head back to the dashboard."
        onRetry={reset}
      />
    </div>
  );
}
