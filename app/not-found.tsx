"use client";

import Link from "next/link";
import { MoveLeft } from "lucide-react";

export default function NotFoundComponent() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background px-4">
      <div className="max-w-md text-center animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
        <h1 className="text-7xl md:text-9xl font-black text-foreground tracking-tighter opacity-10">
          404
        </h1>
        <h2 className="mt-4 text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
          Page not found
        </h2>
        <p className="mt-2 text-sm md:text-base text-muted-foreground leading-relaxed">
          The page you're looking for doesn't exist, has been moved, or you lost your way in the syllabus.
        </p>
        <div className="mt-8 flex items-center justify-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold tracking-widest uppercase text-primary-foreground transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
          >
            <MoveLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Go back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
