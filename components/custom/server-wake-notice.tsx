"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SERVER_WAKE_EVENT } from "@/lib/server-wake";

/** Small notice while a slow request waits for the sleeping API to wake up. */
export function ServerWakeNotice() {
  const [waking, setWaking] = useState(false);

  useEffect(() => {
    const onWake = (e: Event) => setWaking(Boolean((e as CustomEvent<{ waking: boolean }>).detail?.waking));
    window.addEventListener(SERVER_WAKE_EVENT, onWake);
    return () => window.removeEventListener(SERVER_WAKE_EVENT, onWake);
  }, []);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-20 z-50 flex justify-center px-4">
      <AnimatePresence>
        {waking && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="pointer-events-auto flex max-w-sm items-center gap-3 rounded-2xl border-2 border-brand-500/40 bg-card px-4 py-3 shadow-lg"
          >
            <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="h-6 w-6 shrink-0 animate-spin will-change-transform">
              <circle cx="24" cy="24" r="20" strokeWidth="6" className="stroke-[color-mix(in_oklab,var(--brand-500)_18%,var(--card))]" />
              <circle cx="24" cy="24" r="20" strokeWidth="6" strokeLinecap="round" strokeDasharray="38 126" className="stroke-brand-500" />
            </svg>
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground">Still connecting…</p>
              <p className="text-xs text-muted-foreground">The server is taking longer than usual. Retrying automatically.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
