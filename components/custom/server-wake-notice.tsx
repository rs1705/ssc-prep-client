"use client";

import { Spinner } from "@/components/custom/loader";
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
            <Spinner className="h-6 w-6" />
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
