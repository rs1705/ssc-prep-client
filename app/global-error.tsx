"use client";

import { useEffect } from "react";
import "./globals.css";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// Replaces the root layout when the layout itself throws, so it must render
// its own <html>/<body> and cannot rely on providers (theme, auth, store).
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground antialiased">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-extrabold tracking-tight">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The app failed to load. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-full bg-gradient-to-r from-brand-500 to-brand-alt-500 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
